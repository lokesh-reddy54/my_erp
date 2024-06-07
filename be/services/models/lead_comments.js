/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('lead_comments', {
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
    leadPropositionId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'lead_propositions',
        key: 'id'
      }
    },
    visitId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'visits',
        key: 'id'
      }
    },
    callId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'calls',
        key: 'id'
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    by: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, dbTableOptions);
};