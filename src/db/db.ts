// import { Sequelize, Model, DataTypes } from 'sequelize';

// // const sequelize = new Sequelize({ dialect: 'sqlite', storage: './local.db' });
// const sequelize = new Sequelize('sqlite::memory:');

// class Block extends Model {
//   [x: string]: any;
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

// Block.hasMany(Block, { as: 'children' });
// Block.belongsTo(Block, { as: 'parent' });

// (async () => {
//   await sequelize.sync({ force: true });

//   const p1 = await Block.create({
//     type: 'page',
//   });

//   const p1_b1 = await Block.create({
//     type: 'content',
//   });

//   await p1_b1.setParent(p1);

//   console.log(await p1_b1.getParent());
// })();
