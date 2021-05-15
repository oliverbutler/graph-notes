/* eslint-disable no-console */
import {
  createRxDatabase,
  addRxPlugin,
  RxJsonSchema,
  RxDocument,
  RxCollection,
  RxDatabase,
} from 'rxdb';

import { v4 as uuidv4 } from 'uuid';

const leveldown = require('leveldown');
addRxPlugin(require('pouchdb-adapter-leveldb')); // leveldown adapters need the leveldb plugin to work

const initializeDb = async () => {
  type IconDocType = {
    emoji: string;
  };

  type BlockDocType = {
    type: string;
    variant?: string;
    text?: string;
  };

  type PageDocType = {
    id: string;
    parent?: string;
    parent_?: PageDocType;
    archived?: boolean;
    title: string;
    icon?: IconDocType;
    blocks?: BlockDocType[];
  };

  type PageDocMethods = {
    getParent: () => string;
  };

  type PageDocument = RxDocument<PageDocType, PageDocMethods>;

  type PageCollectionMethods = {
    countAllDocuments: () => Promise<number>;
  };

  // and then merge all our types
  type PageCollection = RxCollection<
    PageDocType,
    PageDocMethods,
    PageCollectionMethods
  >;

  type MyDatabaseCollections = {
    pages: PageCollection;
  };

  type MyDatabase = RxDatabase<MyDatabaseCollections>;

  const db: MyDatabase = await createRxDatabase<MyDatabaseCollections>({
    name: 'slate',
    adapter: leveldown,
    multiInstance: false,
    eventReduce: true,
  });

  const pageSchema: RxJsonSchema<PageDocType> = {
    title: 'page schema',
    version: 0,
    description: 'describes a simple hero',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        primary: true,
      },
      parent: {
        type: 'string',
        ref: 'pages',
      },
      archived: {
        type: 'boolean',
        default: false,
      },
      title: {
        type: 'string',
      },
      icon: {
        type: 'object',
        properties: {
          emoji: {
            type: 'string',
          },
        },
      },
      blocks: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
            },
            variant: {
              type: 'string',
            },
            text: {
              type: 'string',
            },
          },
        },
      },
    },
    required: [],
    encrypted: [],
  };

  const pageDocMethods: PageDocMethods = {
    getParent(this: PageDocument) {
      return `${this.id} unknown`;
    },
  };

  const pageCollectionMethods: PageCollectionMethods = {
    async countAllDocuments(this: PageCollection) {
      const allDocs = await this.find().exec();
      return allDocs.length;
    },
  };

  await db.addCollections({
    pages: {
      schema: pageSchema,
      methods: pageDocMethods,
      statics: pageCollectionMethods,
    },
  });

  const { pages } = db.collections;

  // const page = await pages.insert({
  //   id: uuidv4(),
  //   title: 'A fancy page',
  //   icon: {
  //     emoji: '🚀',
  //   },
  //   blocks: [
  //     {
  //       type: 'text',
  //       variant: 'heading_1',
  //       text: 'wow a title!',
  //     },
  //   ],
  // });

  // const subPage = await pages.insert({
  //   id: uuidv4(),
  //   title: 'sub page',
  //   parent: page.id,
  //   icon: {
  //     emoji: '❤️',
  //   },
  //   blocks: [
  //     {
  //       type: 'text',
  //       variant: 'heading_1',
  //       text: 'Sub page title',
  //     },
  //   ],
  // });

  console.log(await pages.countAllDocuments());

  // eslint-disable-next-line promise/catch-or-return
  const docs = await pages.find().exec();

  docs.forEach(async (doc) => {
    console.log(doc.parent, await doc.populate('parent'));
  });

  db.destroy();
};

export default initializeDb;
