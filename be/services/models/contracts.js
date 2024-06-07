/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('contracts', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    deskType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    frequency: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    officeType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    invoiceServiceType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    term: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    kind: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    discount: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    rent: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    deskPrice: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    additionalRent: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    additionalDesks: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    desks: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    isSqftRent: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    sqFt: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    sqFtPrice: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    security: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    token: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    contractPeriod: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    lockIn: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    lockInPenaltyType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    lockInPenalty: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    noticePeriod: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    noticePeriodViolationType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    noticePeriodViolation: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    freeCredits: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    agreementAccepted: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    approvedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approvedBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    confirmedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    confirmedBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    agreementId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    signedAgreementId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    bookingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    tokenSD: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    rentFreePeriod: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    }
  }, dbTableOptions);
};