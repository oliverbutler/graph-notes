import IconButton from 'components/IconButton/IconButton';
import Resize from 'components/Resize';
import useLocalStorage from 'hooks/useLocalStorage';
import React, { useEffect, useState } from 'react';
import { Block } from 'types/block';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/actions';
import { IAppState } from 'redux/reducers';
import { Plus, ArrowDown, ArrowRight } from 'react-feather';

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
      <div onClick={() => onCollapse(item.id)} className="hover:bg-gray-100">
        <ArrowDown size="15" />
      </div>
    ) : (
      <div onClick={() => onExpand(item.id)} className="hover:bg-gray-100">
        <ArrowRight size="15" />
      </div>
    );
  }
  return <div style={{ width: 15 }}></div>;
};

const Sidebar = () => {
  // Store sidebar width in local storage
  const [defaultWidth, setDefaultWidth] = useLocalStorage('sidebar-width', 192);

  // Pull all pages from the current state
  const pages = useSelector((state: IAppState) => state.pageState.pages);

  // build tree structure (required for this library) using a custom function, then update as we move pages around.
  const [treeData, setTreeData] = useState<TreeData | null>(null);

  // Upon Load of pages, build the sidebar tree
  useEffect(() => {
    setTreeData(buildTreeFromPages(pages));
  }, [pages]);

  const dispatch = useDispatch();

  const renderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
  }: RenderItemParams) => {
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="flex flex-row hover:bg-gray-100"
        onClick={() => dispatch(actions.pages.changeCurrentPage(item.id))}
      >
        {getIcon(item, onExpand, onCollapse)}
        <p>
          {item.emoji || ''} {item.title || 'Untitled'}
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
      const newParent =
        destination.parentId === 'root'
          ? null
          : destination.parentId.toString();

      const sourceItem = treeData.items[source.parentId].children[source.index];

      // Expand the destination so we can see the new element
      treeData.items[sourceItem].hasChildren = true;
      treeData.items[sourceItem].isExpanded = true;

      console.log(sourceItem, newParent);
      console.log(pages[sourceItem], newParent ? pages[newParent] : null);

      dispatch(
        actions.pages.changeBlockParent(sourceItem.toString(), newParent)
      );

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
