import IconButton from 'components/IconButton/IconButton';
import IconRender from 'components/IconRender';
import Resize from 'components/Resize';
import useLocalStorage from 'hooks/useLocalStorage';
import React, { useEffect } from 'react';
import { Block } from 'types/block';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/actions';
import { IAppState } from 'redux/reducers';
import { Plus, X } from 'react-feather';

type RecursivePageProps = {
  parentId: string | null;
};

/**
 * Renders from a chosen block down
 */
const RecursivePage = ({ parentId }: RecursivePageProps) => {
  const dispatch = useDispatch();

  const pages: Block[] = useSelector((state: IAppState) =>
    state.pageState.pages.filter((p) => p.parentId === parentId)
  );

  return (
    <div key="sidebar-block-group" className="">
      {pages.map((page) => (
        <div
          className="ml-3 cursor-pointer select-none"
          key={`sidebar-block-${page.id}`}
        >
          <div
            className="flex flex-row"
            onClick={() => dispatch(actions.pages.changeCurrentPage(page.id))}
          >
            <IconRender icon={page.emoji} className="mr-1" />{' '}
            {page.title || 'Untitled'}
            <div className="ml-auto z-10">
              <IconButton
                icon={<X size="15" />}
                onClick={() =>
                  dispatch(actions.pages.deletePageActionCreator(page.id))
                }
              />
            </div>
            <div className="z-10">
              <IconButton
                icon={<Plus size="15" />}
                onClick={() =>
                  dispatch(actions.pages.createPageActionCreator(page.id))
                }
              />
            </div>
          </div>
          <RecursivePage parentId={page.id} />
        </div>
      ))}
    </div>
  );
};

const Sidebar = () => {
  // Store sidebar width in local storage
  const [defaultWidth, setDefaultWidth] = useLocalStorage('sidebar-width', 192);

  const dispatch = useDispatch();

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={4}
      className="bg-gray-100"
      dragHandleClassName="bg-gray-200"
    >
      <div className="flex flex-col h-full py-2">
        <RecursivePage parentId={null} />
        <div className="mt-auto">
          <IconButton
            icon={<Plus size="15" />}
            text="Add Page"
            onClick={() =>
              dispatch(actions.pages.createPageActionCreator(null))
            }
          />
        </div>
      </div>
    </Resize>
  );
};

export default Sidebar;
