import IconButton from 'components/IconButton/IconButton';
import IconRender from 'components/IconRender';
import Resize from 'components/Resize';
import useLocalStorage from 'hooks/useLocalStorage';
import React from 'react';
import { Block, BlockObjectType } from 'types/block';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/actions';
import { IAppState } from 'redux/reducers';

type RecursivePageProps = {
  blocks: Block[];
};

const RecursivePage = ({ blocks }: RecursivePageProps) => {
  const dispatch = useDispatch();

  /**
   * Delete a page from SQL + Redux
   *
   * @param pageId
   */
  const deletePage = async (pageId: string) => {
    dispatch(actions.pages.deletePageActionCreator(pageId));
  };

  return (
    <div key="sidebar-block-group" className="mt-2">
      {blocks.map((page) => {
        if (page && page.object === BlockObjectType.Page) {
          return (
            <div
              className="ml-3 cursor-pointer select-none"
              key={`sidebar-block-${page.id}`}
            >
              <div
                className="flex flex-row"
                onClick={() =>
                  dispatch(actions.pages.changeCurrentPage(page.id))
                }
              >
                <IconRender icon={page.emoji} className="mr-1" />{' '}
                {page.title || 'Untitled'}
                <div className="ml-auto z-10">
                  <IconButton onClick={() => deletePage(page.id)} />
                </div>
              </div>
              {page.children && <RecursivePage blocks={page.children} />}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const Sidebar = () => {
  // Store sidebar width in local storage
  const [defaultWidth, setDefaultWidth] = useLocalStorage('sidebar-width', 192);

  const dispatch = useDispatch();

  const blocks: Block[] = useSelector(
    (state: IAppState) => state.pageState.pages
  );

  const addPage = async () => {
    dispatch(actions.pages.createPageActionCreator(blocks[0].id));
  };

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={4}
      className="bg-gray-100"
      dragHandleClassName="bg-gray-200"
    >
      <div className="flex flex-col h-full">
        <RecursivePage blocks={blocks} />
        <div className="mt-auto">
          <IconButton text="Add Page" onClick={addPage} />
        </div>
      </div>
    </Resize>
  );
};

export default Sidebar;
