/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('selfcare_links', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    linkId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    context: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expiry: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    }
  }, dbTableOptions);
};