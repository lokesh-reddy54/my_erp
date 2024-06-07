/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('proposition_quotes', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    propositionId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'lead_propositions',
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
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