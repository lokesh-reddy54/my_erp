/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('cabins', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    officeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'offices',
        key: 'id'
      }
    },
    floorId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'floors',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    deskType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    deskSize: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    totalArea: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    usedArea: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    deskc: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, dbTableOptions);
};