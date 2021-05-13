// /* eslint-disable no-console */
// import {
//   Sequelize,
//   Model,
//   DataTypes,
//   Optional,
//   BelongsToGetAssociationMixin,
//   BelongsToSetAssociationMixin,
//   HasManyGetAssociationsMixin,
//   HasManyCountAssociationsMixin,
//   HasManyAddAssociationMixin,
//   HasManyCreateAssociationMixin,
// } from 'sequelize';

// // const sequelize = new Sequelize({ dialect: 'sqlite', storage: './local.db' });
// const sequelize = new Sequelize('sqlite::memory:');

// // Attributes for a Block in the DB
// interface BlockAttributes {
//   id: string;
//   type: string;
// }

// // Sometimes you don't need certain fields, neglect these from another interface
// type BlockCreationAttributes = Optional<BlockAttributes, 'id'>;

// class Block extends Model<BlockAttributes, BlockCreationAttributes>
//   implements BlockAttributes {
//   // Primary Key (UUIDv4)
//   public id!: string;

//   // Block-specific Fields
//   public type!: string;

//   // timestamps!
//   public readonly createdAt!: Date;

//   public readonly updatedAt!: Date;

//   // Relationships
//   public readonly parentId!: string;

//   public getParent!: BelongsToGetAssociationMixin<Block>;

//   public setParent!: BelongsToSetAssociationMixin<Block, string>;

//   public getChildren!: HasManyGetAssociationsMixin<Block>;

//   public countChildren!: HasManyCountAssociationsMixin;

//   public addChildren!: HasManyAddAssociationMixin<Block, string>;

//   // Children or parent present IF you include them in the easy loading
//   public readonly children?: [Block];

//   public readonly parent?: [Block];
// }

// Block.init(
//   {
//     id: {
//       primaryKey: true,
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//     },
//     type: DataTypes.STRING,
//   },
//   { sequelize, modelName: 'block', paranoid: true }
// );

// Block.hasMany(Block, { as: 'children', foreignKey: 'parentId' });
// Block.belongsTo(Block, { as: 'parent', foreignKey: 'parentId' });

// (async () => {
//   await sequelize.sync({ force: true });

//   const p1 = await Block.create({
//     type: 'page',
//   });

//   const b1 = await Block.create({
//     type: 'block1',
//   });

//   p1.addChildren(b1);

//   // await p1.addBlock({
//   //   type: 'block',
//   // });

//   // await p1.addBlock({
//   //   type: 'block',
//   // });

//   const res = await Block.findAll({ include: 'children' });

//   res.forEach((block) => {
//     console.info(block.get());
//   });
// })();
