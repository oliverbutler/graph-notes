import * as sequelize from "sequelize";
import { blockFactory } from "./block";

export const dbConfig = new sequelize.Sequelize({
  dialect: "sqlite",
  storage: "./vault/database.db",
  logging: false,
});

export const Block = blockFactory(dbConfig);

// Define self-relational associations

// Each block has MANY children
Block.hasMany(Block, { as: "children", foreignKey: "parentId" });

// Each child hs ONE parent
Block.belongsTo(Block, { as: "parent", foreignKey: "parentId" });
