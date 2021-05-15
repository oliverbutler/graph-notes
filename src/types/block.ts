// Value for the object field present with every block
export enum BlockObjectType {
  Page = 'page',
  Block = 'block',
  Database = 'database',
}

// Value for the type field found with objects with a object="block"
export enum BlockType {
  Paragraph = 'paragraph',
  Heading1 = 'heading_1',
  Heading2 = 'heading_2',
  Heading3 = 'heading_3',
  BulletedListItem = 'bulleted_list_item',
  NumberedListItem = 'numbered_list_item',
  ToDo = 'to_do',
  Toggle = 'toggle',
  Location = 'location',
  PropertyReference = 'property_reference',
}

export type Icon = {
  emoji: string;
};

export type Image = {
  url: string;
  blurHash: string;
  width?: number;
  height?: number;
};

export type RichText = {
  plain_text: string;
};

export type PropertyReference = {
  type: string;
  id: string;
  last_updated: Date;
  timeout: string;
};

// Every block has certain parameters, these are shown below
export type Block = {
  id: string;

  // Metadata
  archived: boolean;
  schemaId: string;

  // Type
  object: BlockObjectType;
  type: BlockType;

  // Metadata
  createdAt: Date;
  updatedAt: Date;

  // Parent
  parentId: string;
  parent?: Block;

  // Children
  children?: Block[];

  // Page Fields
  title?: string;
  emoji?: string;

  // rich text
  text?: RichText;

  // to do
  checked?: boolean;

  // location
  location?: string;

  // URL
  url?: string;

  // Phone
  phone?: string;

  // Property Ref
  propertyReference?: PropertyReference;
};

/**
 * Check if a given block is a Page
 *
 * @param block
 * @returns
 */
export const isPageBlock = (block: Block): boolean => {
  return block.object === BlockObjectType.Page;
};

/**
 * Check if a given block is a content block (e.g. paragraph)
 *
 * @param block
 * @returns
 */
export const isContentBlock = (block: Block): boolean => {
  return block.object === BlockObjectType.Block;
};
