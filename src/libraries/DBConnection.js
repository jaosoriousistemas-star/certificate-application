// Import the Sequelize constructor from the 'sequelize' library
import { Sequelize } from 'sequelize';
// Import configuration settings
import { config } from "../config/config.js";

// Create a new instance of Sequelize with the provided credentials and options
export const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPassword,
  {
    // Specify the database host
    host: config.dbHost,
    // Specify the database port
    port: config.dbPort,
    // Specify the dialect as MySQL
    dialect: config.dialect,
    // Enable logging of SQL queries to the console
    logging: console.log,
    // Set the timezone to Colombia (UTC-5)
    dialectOptions: {
      timezone: 'America/Bogota'
    }
  }
);

/**
 * Function to test the database connection
 * @param {Function} next
 * - Optional callback function to execute after the test
 */
export const testConnection = async (next) => {
  try {
    // Attempt to authenticate the connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (err) {
    // Log an error message if the connection fails
    console.log('Impossible to connect the database:', err);
  }
};
