/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('bill_queue_gsts', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    billId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'bill_queues',
        key: 'id'
      }
    },
    slab: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    gst: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    tds: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    igst: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    cgst: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    sgst: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, dbTableOptions);
};