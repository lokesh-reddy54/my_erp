module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('user_roles', {
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
    roleId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    cityIds: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    locationIds: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    buildingIds: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    supportLevel: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    assigneeTypes: {
      type: DataTypes.STRING(20),
      allowNull: true,
    }
  }, dbTableOptions);
};