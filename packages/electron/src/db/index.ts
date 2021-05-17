import { Block, BlockObjectType } from 'types/block';
import { BlockModel } from './models/block';
import { Block as DBBlockModel, dbConfig } from './models/index';

export const initDb = async () => {
  await dbConfig.sync({}).catch(() => {
    throw Error("Can't connect to DB");
  });
};

/**
 * Return all sub-blocks of a parent
 *
 * @param withChildren
 * @returns
 */

export const getSubPages = async (
  parentId: string | null,
  children = false
): Promise<Block[]> => {
  const res = await DBBlockModel.findAll({
    where: { object: BlockObjectType.Page, parentId },
    include: children ? 'children' : undefined,
  });

  return res.map((b) => b.get() as Block);
};

/**
 * Return all pages in the DB (mainly used to populate the sidebar and navigation)
 *
 * @returns
 */
export const getAllPages = async (): Promise<Block[]> => {
  const res = await DBBlockModel.findAll({
    where: { object: BlockObjectType.Page },
  });

  return res.map((b) => b.get() as Block);
};

/**
 * Create a new blank page
 *
 * @param parent Parent of the block
 * @returns
 */
export const addNewBlankPage = async (
  parentId: string | null
): Promise<Block> => {
  // Check parent is valid
  if (parentId != null) {
    const res = await DBBlockModel.findAll({ where: { id: parentId } });
    if (res.length === 0) throw new Error('Parent not found');
  }

  const icons = ['🚀', '❤️', '🙏', '🎉', '✅'];

  // Build the new page
  const res = await DBBlockModel.create({
    parentId: parentId || undefined,
    archived: false,
    object: BlockObjectType.Page,
    emoji: icons[Math.floor(Math.random() * icons.length)],
  });

  return res.get() as Block;
};

/**
 * Delete a block given its ID
 *
 * @param blockId
 * @returns
 */
export const deleteBlock = async (blockId: string): Promise<boolean> => {
  const doc = await DBBlockModel.findOne({ where: { id: blockId } });

  if (!doc) {
    return false;
  }

  return doc.destroy().then(() => true);
};

/**
 * Change the parent of a block
 *
 * @param blockId
 * @param newParentId
 * @returns
 */
export const updateBlockParent = async (
  blockId: string,
  newParentId: string | null
): Promise<Block> => {
  const doc = await DBBlockModel.findOne({ where: { id: blockId } });

  let targetDoc: BlockModel | null = null;

  if (newParentId) {
    targetDoc = await DBBlockModel.findOne({
      where: { id: newParentId },
    });

    if (!targetDoc) {
      throw new Error('Target Block not Found');
    }
  }

  if (!doc) {
    throw new Error('Block not Found');
  }

  doc.setParent(targetDoc);

  return doc.get() as Block;
};
