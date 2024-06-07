/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('price_contracts', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    priceId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'price_quotes',
        key: 'id'
      }
    },
    contractId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'contracts',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    mailId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    mailSent: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, dbTableOptions);
};