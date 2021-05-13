import {
  BelongsToSetAssociationMixin,
  BuildOptions,
  DataTypes,
  HasManyAddAssociationMixin,
  Model,
  Sequelize,
} from 'sequelize';

export interface BlockAttributes {
  id?: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
  parentId?: string;

  title?: string;
  emoji?: string;
  variant?: string;
  text?: string;
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
      type: DataTypes.STRING,
      title: DataTypes.STRING,
      emoji: DataTypes.STRING,
      variant: DataTypes.STRING,
      text: DataTypes.STRING,
    },
    { paranoid: true }
  );
};
