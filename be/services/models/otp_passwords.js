/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('otp_passwords', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    context: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    hash: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isUsed: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    validTill: {
      type: DataTypes.DATE,
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    }
  }, dbTableOptions);
};