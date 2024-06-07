/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_contacts', {
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
    title: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    designation: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    isMainContact: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    idProofId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    addressProofId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    relationshipManagement: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    salesManagement: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    projectManager: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    siteManager: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    siteExecutive: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    verified: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
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