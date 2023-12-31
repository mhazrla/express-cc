const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USERNAME,
    password: null,
    database: "database_test",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: null,
    database: "database_production",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
};
