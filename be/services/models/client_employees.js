/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('client_employees', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    clientId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'company',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    contactPurposes: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    designation: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    hasAccess: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },sendInvoice: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    verified: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, dbTableOptions);
};