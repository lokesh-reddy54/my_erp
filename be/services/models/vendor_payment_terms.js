/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_payment_terms', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    vendorId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendors',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tagName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    onAdvance: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    onDelivery: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    inProgress: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    inProgressStages: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    onFinish: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    afterFinish: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    afterFinishStages: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, dbTableOptions);
};