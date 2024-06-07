/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('facility_set_facilities', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    facilityId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'facilities',
        key: 'id'
      }
    },
    setId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'facility_sets',
        key: 'id'
      }
    }
  }, dbTableOptions);
};