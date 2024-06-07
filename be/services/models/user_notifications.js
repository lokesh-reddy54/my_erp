module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('user_notifications', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    webPushId: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    mobilePushId: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    whatsappNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, dbTableOptions);
};