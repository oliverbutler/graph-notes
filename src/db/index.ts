import { Block, BlockType, PageBlock } from 'types/block';
import { Block as BlockSQLite, dbConfig } from './models/index';

export const initDb = async () => {
  await dbConfig.sync({}).catch(() => {
    throw Error("Can't connect to DB");
  });
};

/**
 * Generate block path to reach a root node
 * @param block
 */
export const getBlockPath = async (blockId: string): Promise<PageBlock[]> => {
  let foundRoot = false;
  let currentTarget = blockId;
  const path: PageBlock[] = [];

  while (!foundRoot) {
    // eslint-disable-next-line no-await-in-loop
    const res = await BlockSQLite.findOne({ where: { id: currentTarget } });

    if (!res) {
      foundRoot = true;
      return path;
    }

    path.push(res.get() as PageBlock);

    if (!res.parentId) {
      foundRoot = true;
      return path;
    }

    currentTarget = res.parentId;
  }

  return path;
};

/**
 * Return all Root blocks
 *
 * @param withChildren
 * @returns
 */
export const getRootBlocks = async (
  withChildren = false
): Promise<PageBlock[]> => {
  const res = await BlockSQLite.findAll({
    where: { type: BlockType.Page, parentId: null },
    include: withChildren ? 'children' : undefined,
  });

  return res.map((b) => b.get() as PageBlock);
};

/**
 * Create a new Block given it's params + parent
 *
 * @param parent Parent of the block
 * @param type
 * @returns
 */
export const addNewPage = async (parent: string | null): Promise<void> => {
  // Check parent is valid
  if (parent != null) {
    const res = await BlockSQLite.findAll({ where: { id: parent } });
    if (res.length === 0) throw new Error('Parent not found');
  }
};

/**
 * Generate some demo pages
 */
export const initDemoPages = async () => {
  const page1 = await BlockSQLite.create({
    type: BlockType.Page,
    title: 'Page 1',
    emoji: '🚀',
  });

  const subpage = await BlockSQLite.create({
    type: BlockType.Page,
    title: 'Sub Page',
    emoji: '🧠',
  });

  subpage.setParent(page1);

  BlockSQLite.create({
    type: BlockType.Page,
    title: 'Page 2',
    emoji: '❤️',
  });
  BlockSQLite.create({
    type: BlockType.Page,
    title: 'Todo List',
    emoji: '✅',
  });
};
