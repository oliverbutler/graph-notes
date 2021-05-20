import {
  BelongsToSetAssociationMixin,
  BuildOptions,
  DataTypes,
  HasManyAddAssociationMixin,
  Model,
  Sequelize,
} from 'sequelize';

interface DBFolderAttributes {
  id?: string;
  archived: boolean;
}

export interface DBBlockModel extends Model<DBFolderAttributes>, DBFolderAttributes {
  id: string;

}
export class Block extends Model<DBBlockModel, DBFolderAttributes> {}

export type BlockStatic = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): DBBlockModel;
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
    },
    { paranoid: true }
  );
};
