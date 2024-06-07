/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('floors', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    officeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'offices',
        key: 'id'
      }
    },
    cabinc: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    desks: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, dbTableOptions);
};