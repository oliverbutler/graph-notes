import IconButton from 'components/IconButton/IconButton';
import Resize from 'components/Resize';
import useLocalStorage from 'hooks/useLocalStorage';
import React, { useEffect, useState } from 'react';
import { Block } from 'types/block';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/actions';
import { IAppState } from 'redux/reducers';
import { Plus, X, Minus } from 'react-feather';

import TreeBuilder from './TreeBuilder';

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
import { treeFromFlattenedTree } from 'libs/tree';

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

const exampleData: TreeData = new TreeBuilder(1)
  .withLeaf(0) // 0
  .withLeaf(1) // 1
  .withSubTree(
    new TreeBuilder(2) // 2
      .withLeaf(0) // 3
      .withLeaf(1) // 4
  )
  .withLeaf(3) // 7
  .build();

const Sidebar = () => {
  // Store sidebar width in local storage
  const [defaultWidth, setDefaultWidth] = useLocalStorage('sidebar-width', 192);

  const [treeData, setTreeData] = useState<TreeData>(exampleData);

  const dispatch = useDispatch();

  const pages: Block[] = useSelector(
    (state: IAppState) => state.pageState.pages
  );

  // Upon sidebar load, compute the tree structure
  useEffect(() => {
    const treeFromPageStore = treeFromFlattenedTree(pages);

    console.log(pages, treeFromPageStore);
  }, []);

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
        className="flex flex-row"
      >
        {getIcon(item, onExpand, onCollapse)}
        <p>{item.data.title}</p>
      </div>
    );
  };

  const onExpand = (itemId: ItemId) => {
    setTreeData(mutateTree(treeData, itemId, { isExpanded: true }));
  };

  const onCollapse = (itemId: ItemId) => {
    setTreeData(mutateTree(treeData, itemId, { isExpanded: false }));
  };

  const onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition
  ) => {
    if (!destination) {
      return;
    }
    const newTree = moveItemOnTree(treeData, source, destination);

    setTreeData(newTree);
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
          <Tree
            tree={treeData}
            renderItem={renderItem}
            onExpand={onExpand}
            onCollapse={onCollapse}
            onDragEnd={onDragEnd}
            isDragEnabled
            isNestingEnabled
          />
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
