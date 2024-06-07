/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('price_quotes', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    quoteId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'proposition_quotes',
        key: 'id'
      }
    },
    facilitySetId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'facility_sets',
        key: 'id'
      }
    },
    facilities: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deskType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    min: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    max: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    lockIn: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    }
  }, dbTableOptions);
};