/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('asset_item_assignments', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    assetItemId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'asset_items',
        key: 'id'
      }
    },
    buildingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'buildings',
        key: 'id'
      }
    },
    officeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'offices',
        key: 'id'
      }
    },
    cabinId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'cabins',
        key: 'id'
      }
    },
    deskId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'desks',
        key: 'id'
      }
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    assignedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    assignedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deassignedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    deassignedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    assetMovementId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'asset_movements',
        key: 'id'
      }
    }
  }, dbTableOptions);
};