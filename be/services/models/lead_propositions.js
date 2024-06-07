/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('lead_propositions', {
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
    desksAvailable: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    distance: {
      type: "DOUBLE(9,6)",
      allowNull: true
    },
    price: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    visitId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'visits',
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
    isInterested: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    by: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, dbTableOptions);
};