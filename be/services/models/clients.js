/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('clients', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    company: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    brand: {
      type: DataTypes.STRING(200),
      allowNull: true
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
      type: DataTypes.STRING(15),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    companyRegistrationId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    gstRegistrationId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    gstNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    panNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    stateCode: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    panCardId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    benificiaryName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    accountNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ifscCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updateBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, dbTableOptions);
};