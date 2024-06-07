/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('building_property_contacts', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    propertyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'building_properties',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    purposes: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    addedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    added: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, dbTableOptions);
};