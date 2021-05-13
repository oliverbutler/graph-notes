export type Icon = {
  emoji: string;
};

export type Image = {
  url: string;
  blurHash: string;
  width?: number;
  height?: number;
};

export enum BlockType {
  Page = 'page',
  Typography = 'typography',
}

// Everything in Notive is a Block blocks have relations with other blocks in a 'tree' https://en.wikipedia.org/wiki/Tree_(data_structure).
// In our case, a block has ONE parent, and MANY children
export type Block = {
  id: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  type: BlockType;

  // Relations
  parentId: string | null;
  parent?: Block[];
  children?: Block[];
};

// A specific type of Block called a page
export interface PageBlock extends Block {
  title: string;
  emoji: string;
  coverPhoto?: Image;
}

// Any block that can be placed within a page
export interface ContentBlock extends Block {
  colour?: string;
  backgroundColour?: string;
}

// Specific type of ContentBlock for typography
export interface TypographyBlock extends ContentBlock {
  variant: 'h1' | 'h2' | 'h3' | 'p';
  text: string;
}

/**
 * Check if a given block is a PageBlock
 *
 * @param block
 * @returns
 */
export const isPageBlock = (block: Block): block is PageBlock => {
  return block.type === BlockType.Page;
};

/**
 * Check if a given block is a ContentBlock
 *
 * @param block
 * @returns
 */
export const isContentBlock = (block: Block): block is ContentBlock => {
  const fakeBlock = block as ContentBlock;
  return (
    fakeBlock.colour !== undefined && fakeBlock.backgroundColour !== undefined
  );
};

/**
 * Check if a given block is a TypographyBlock
 *
 * @param block
 * @returns
 */
export const isTypographyBlock = (
  block: Block | ContentBlock
): block is TypographyBlock => {
  return block.type === BlockType.Typography;
};

/**
 * Check if an icon is an Icon
 *
 * @param icon
 * @returns
 */
export const isIcon = (icon: Icon | Image): icon is Icon => {
  return (icon as Icon).emoji !== undefined;
};

/**
 * Check if an icon is an Image
 *
 * @param icon
 * @returns
 */
export const isImage = (icon: Icon | Image): icon is Image => {
  return (icon as Image).blurHash !== undefined;
};
