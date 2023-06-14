const { DataTypes } = require('sequelize');
module.exports = model;

function model(sequelize){
    const attribute={
        Name : {type : DataTypes.STRING, allowNull : true},
        Company : {type : DataTypes.STRING, allowNull:true},        
        Email : {type : DataTypes.STRING, allowNull:true},        
        Status : {type : DataTypes.STRING, allowNull:true},
        isSelect : {type:DataTypes.BOOLEAN,allowNull:true},
        }  ;
        return sequelize.define('user_details', attribute) 
        }