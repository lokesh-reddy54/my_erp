/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('office_pricings', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    officeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    facilitySetId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'facility_sets',
        key: 'id'
      }
    },
    deskType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    minPerson: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    maxPerson: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, dbTableOptions);
};