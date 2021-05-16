import {
  BelongsToSetAssociationMixin,
  BuildOptions,
  DataTypes,
  HasManyAddAssociationMixin,
  Model,
  Sequelize,
} from 'sequelize';
import { BlockObjectType, BlockType } from 'types/block';
import { PropertyType, PropertyUnits } from 'types/property';

export interface PropertyAttributes {
  id?: string;
  pageId: string;
  name: string;
  type: PropertyType;
  units: PropertyUnits;
}

/**
 * Actual attributes of a Block
 */
export interface BlockAttributes {
  id?: string;
  archived: boolean;
  object: BlockObjectType;
  type?: BlockType;
  schemaId?: string;

  createdAt?: Date;
  updatedAt?: Date;

  parentId?: string;

  // Page Fields
  title?: string;
  emoji?: string;

  // paragraph, heading_1, heading_2 etc.
  text?: string; // JSON

  // to_do
  checked?: boolean;

  // location
  location?: string; // JSON

  // URL
  url?: string; // JSON

  // Phone
  phone?: string;

  // Property Ref
  propertyReference?: string; // JSON
}

export interface BlockModel extends Model<BlockAttributes>, BlockAttributes {
  id: string;
  parent?: Block;
  children?: Block[];

  // Add Children to Blocks
  addChildren: HasManyAddAssociationMixin<BlockModel, BlockModel>;
  // Set parent to null
  setParent: BelongsToSetAssociationMixin<BlockModel, BlockModel | null>;
}
export class Block extends Model<BlockModel, BlockAttributes> {}

export type BlockStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): BlockModel;
};

export const blockFactory = (sequelize: Sequelize): BlockStatic => {
  return <BlockStatic>sequelize.define(
    'blocks',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      object: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },

      // Page Fields
      title: {
        type: DataTypes.STRING,
      },
      emoji: {
        type: DataTypes.STRING,
      },

      // Rich Text
      text: {
        type: DataTypes.STRING,
        comment: 'JSON',
      },

      // To Do
      checked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // location
      location: {
        type: DataTypes.STRING,
        comment: 'JSON',
      },

      // URL
      url: {
        type: DataTypes.STRING,
      },

      // Phone
      phone: {
        type: DataTypes.STRING,
      },

      // Property Reference
      propertyReference: {
        type: DataTypes.STRING,
        comment: 'JSON',
      },
    },
    { paranoid: true }
  );
};
