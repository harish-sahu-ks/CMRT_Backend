const { DataTypes } = require('sequelize');
module.exports = model;

function model(sequelize){
    const attribute={
        Date : {type : DataTypes.STRING, allowNull : true},
        ZipFileName : {type : DataTypes.STRING, allowNull:true},        
        ConsolidatedFileName : {type : DataTypes.STRING, allowNull:true},        
        ResultFileName : {type : DataTypes.STRING, allowNull:true},
        FileCount : {type : DataTypes.INTEGER, allowNull:true}, 
        RowCount : {type : DataTypes.INTEGER, allowNull:true}
        }  ;
        return sequelize.define('cmrt_file_details', attribute) 
        }