import IconButton from 'components/IconButton/IconButton';
import Resize from 'components/Resize';
import useLocalStorage from 'hooks/useLocalStorage';
import React, { useEffect, useState } from 'react';
import { Block } from 'types/block';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/actions';
import { IAppState } from 'redux/reducers';
import { Plus, X, Minus } from 'react-feather';

import { buildTreeFromPages } from './treeBuilder';

import Tree, {
  mutateTree,
  moveItemOnTree,
  RenderItemParams,
  TreeItem,
  TreeData,
  ItemId,
  TreeSourcePosition,
  TreeDestinationPosition,
} from '@atlaskit/tree';

const getIcon = (
  item: TreeItem,
  onExpand: (itemId: ItemId) => void,
  onCollapse: (itemId: ItemId) => void
) => {
  if (item.children && item.children.length > 0) {
    return item.isExpanded ? (
      <button onClick={() => onCollapse(item.id)}>
        <Minus size="15" />
      </button>
    ) : (
      <button onClick={() => onExpand(item.id)}>
        <Plus size="15" />
      </button>
    );
  }
  return <div>&bull;</div>;
};

const Sidebar = () => {
  // Store sidebar width in local storage
  const [defaultWidth, setDefaultWidth] = useLocalStorage('sidebar-width', 192);

  // Pull all pages from the current state
  const pages: Block[] = useSelector(
    (state: IAppState) => state.pageState.pages
  );

  // build tree structure (required for this library) using a custom function, then update as we move pages around.
  const [treeData, setTreeData] = useState<TreeData | null>(null);

  // Upon Load of pages, build the sidebar tree
  useEffect(() => {
    // todo: UNTIL we add tree structure + expanded properties to redux, we hackily don't update the pages
    if (pages.length > 0 && !treeData) {
      setTreeData(buildTreeFromPages(pages));
    }
  }, [pages]);

  const dispatch = useDispatch();

  const renderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
  }: RenderItemParams) => {
    const page = item.data as Block;

    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="flex flex-row"
        onClick={() => dispatch(actions.pages.changeCurrentPage(page.id))}
      >
        {getIcon(item, onExpand, onCollapse)}
        <p>
          {page.emoji} {page.title || 'Untitled'}
        </p>
      </div>
    );
  };

  const onExpand = (itemId: ItemId) => {
    treeData && setTreeData(mutateTree(treeData, itemId, { isExpanded: true }));
  };

  const onCollapse = (itemId: ItemId) => {
    treeData &&
      setTreeData(mutateTree(treeData, itemId, { isExpanded: false }));
  };

  // Update the view and change the redux state upon dragEnd
  const onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition
  ) => {
    if (!destination) {
      return;
    }

    if (treeData) {
      const newTree = moveItemOnTree(treeData, source, destination);

      // if it actually moved
      if (source.index != destination.index) {
        const newParent =
          destination.parentId === 'root'
            ? null
            : destination.parentId.toString();

        const sourceItem =
          treeData.items[source.parentId].children[source.index];

        // Expand the destination so we can see the new element
        treeData.items[sourceItem].hasChildren = true;
        treeData.items[sourceItem].isExpanded = true;

        dispatch(
          actions.pages.changeBlockParent(sourceItem.toString(), newParent)
        );
      }

      setTreeData(newTree);
    }
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
      <div className="flex flex-col h-full py-2">
        <div className="overflow-auto h-full">
          {treeData && (
            <Tree
              tree={treeData}
              renderItem={renderItem}
              onExpand={onExpand}
              onCollapse={onCollapse}
              onDragEnd={onDragEnd}
              isDragEnabled
              isNestingEnabled
            />
          )}
        </div>
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
