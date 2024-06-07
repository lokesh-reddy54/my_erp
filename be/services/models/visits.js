/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('visits', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'leads',
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
    assignedTo: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, dbTableOptions);
};