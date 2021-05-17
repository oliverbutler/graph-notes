import { IPage } from 'redux/reducers/pages';
import { Block } from 'types/block';
import _ from 'lodash';

export interface TreeData {
  rootId: string;
  items: Record<string, TreeItem>;
}

export type TreeItemData = any;

export type TreeItem = {
  id: string;
  children: string[];
  hasChildren?: boolean;
  isExpanded?: boolean;
  isChildrenLoading?: boolean;
  data?: TreeItemData;
  [x: string]: any;
};

/**
 * Build the redux pages into the tree structure found within @atlaskit/tree
 *
 * @param pages
 * @returns
 */
export const buildTreeFromPages = (pages: Record<string, IPage>) => {
  const children: string[] = Object.keys(pages).filter(
    (x) => pages[x].parentId === null
  );

  let tree: TreeData = {
    rootId: 'root',
    items: {
      root: {
        id: 'root',
        children,
        hasChildren: true,
        isExpanded: true,
        isChildrenLoading: false,
      },
      ...pages,
    },
  };

  return tree;
};
