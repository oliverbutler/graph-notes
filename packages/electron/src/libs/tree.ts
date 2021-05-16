export type TreeDataStructureItem = {
  id: number | string;
  parentId: number | string | null;
  [x: string]: any;
};

export type TreeDataStructure = {
  id: number | string;
  parentId: number | string;
  children: TreeDataStructure[];
  [x: string]: any;
};

/**
 * Takes a flattened tree (id and parentId variables) and converts it into a full tree
 *
 * @param data
 * @returns
 */
export const treeFromFlattenedTree = (
  data: TreeDataStructureItem[]
): TreeDataStructure => {
  // https://typeofnan.dev/an-easy-way-to-build-a-tree-with-object-references/

  const idMapping = data.reduce((acc: any, el, i) => {
    acc[el.id] = i;
    return acc;
  }, {});

  console.log(idMapping);

  let root: TreeDataStructureItem;

  const tree = data.map((el) => {
    // Handle the root element
    if (el.parentId === null) {
      root = el;
      return;
    }
    // Use our mapping to locate the parent element in our data array
    const parentEl = data[idMapping[el.parentId]];
    // Add our current el to its parent's `children` array
    parentEl.children = [...(parentEl.children || []), el];
  });

  console.log(root);

  return root as TreeDataStructure;
};
