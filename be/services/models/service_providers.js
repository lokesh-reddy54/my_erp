/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('service_providers', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    opexTypeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'opex_types',
        key: 'id'
      }
    },
    serviceId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'service_provide_services',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    paymentMode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    panId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    gst: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    gstId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    cin: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cinId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    addressProofId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    hasContact: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    hasGst: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    hasTds: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    isPaymentHolded: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    additionalPaymentInfo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    itLedgerAdded: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
  }, dbTableOptions);
};