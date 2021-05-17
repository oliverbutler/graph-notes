import { Block } from 'types/block';

export type ItemId = string | number;

export interface TreeData {
  rootId: ItemId;
  items: Record<ItemId, TreeItem>;
}

export type TreeItemData = any;

export type TreeItem = {
  id: ItemId;
  children: ItemId[];
  hasChildren?: boolean;
  isExpanded?: boolean;
  isChildrenLoading?: boolean;
  data?: TreeItemData;
};

/**
 * Build the redux pages into the tree structure found within @atlaskit/tree
 *
 * @param pages
 * @returns
 */
export const buildTreeFromPages = (pages: Block[]) => {
  let tree: TreeData = {
    rootId: 'root',
    items: {
      root: {
        id: 'root',
        children: pages.filter((b) => b.parentId === null).map((b) => b.id),
        hasChildren: true,
        isExpanded: true,
        isChildrenLoading: false,
      },
    },
  };

  for (let block of pages) {
    const childrenIdArray: string[] = pages
      .filter((b) => b.parentId === block.id)
      .map((b) => b.id);

    tree.items[block.id] = {
      id: block.id,
      children: childrenIdArray,
      hasChildren: childrenIdArray.length > 0 ? true : false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        ...block,
      },
    };
  }

  return tree;
};
