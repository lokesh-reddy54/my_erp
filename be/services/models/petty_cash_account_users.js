/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('petty_cash_account_users', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pettyCashAccountId: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      references: {
        model: 'petty_cash_accounts',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    addedBy: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    addedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, dbTableOptions);
};