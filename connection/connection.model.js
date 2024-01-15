const { DataTypes } = require('sequelize');
module.exports = model;

function model(sequelize){
    const attribute={
        name : {type : DataTypes.STRING, allowNull : true},
        numberOfSmelter : {type : DataTypes.INTEGER, allowNull:true},        
         uniqueSmelter : {type : DataTypes.INTEGER, allowNull:true},        
        extracted : {type : DataTypes.BOOLEAN, allowNull:true} 
        }  ;
        return sequelize.define('CMRT_file_Details', attribute) 
        }
     