const config = require('./config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

//async function initialize() {
async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    
    // connect to db
    
    const sequelize = new Sequelize(database, user, password, {host, dialect: 'mysql' });

    
    db.cmrt_file_details = require('./serverConnection/serverConnection.model')(sequelize);
    db.user_details = require('./serverConnection/userDetails.model')(sequelize);
    await sequelize.sync();

    console.log('Database Connected......');
}  