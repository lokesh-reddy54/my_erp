'use strict';

var Q = require('q');
var moment = require('moment');
var _ = require('underscore');
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var nodemailer = require('nodemailer');
var atob = require('atob');
const webpush = require('web-push');
var jwt = require('jsonwebtoken');
var request = require('async-request');

var config = require('../utils/config').config;
var session = require("./session");
var services = require("./services").service;
var log = require('../utils/log').log;
var utils = require('../utils/utils').utils;
var systemUtils = require('./utils/system_util').utils;

var Constants = require("./models/constants");
var AssetStore = require("./models/base").AssetStore;
var Asset = require("./models/base").Asset;
var AssetItem = require("./models/base").AssetItem;
var AssetItemAssignment = require("./models/base").AssetItemAssignment;
var AssetItemMovement = require("./models/base").AssetItemMovement;
var AssetServiceProvider = require("./models/base").AssetServiceProvider;
var AssetWarrenty = require("./models/base").AssetWarrenty;
var AssetStore = require("./models/base").AssetStore;
var Building = require("./models/base").Building;
var Office = require("./models/base").Office;
var Cabin = require("./models/base").Cabin;
var Desk = require("./models/base").Desk;
var Project = require("./models/base").Project;
var PurchaseOrder = require("./models/base").PurchaseOrder;
var PurchaseItem = require("./models/base").PurchaseItem;
var Sku = require("./models/base").Sku;
var SkuType = require("./models/base").SkuType;
var SkuCategory = require("./models/base").SkuCategory;
var Location = require("./models/base").Location;
var City = require("./models/base").City;
var User = require("./models/base").User;
var UserRole = require("./models/base").UserRole;
var Role = require("./models/base").Role;
var Vendor = require("./models/base").Vendor;
var Doc = require("./models/base").Doc;

var service = {};

service.listStoreManagers = async (data) => {
  try {
    log.write("APIService ::: listStoreManagers :: data : ", data);
    var where = { companyId: data.companyId, active: 1 };
    log.write("APIService ::: listStoreManagers :: where : ", where);
    var managers = await User.findAll({
      where: where,
      include: [{ as: 'userRoles', model: Role, attributes: ['name'], where: { enum: 'STORE_MANAGER' } },
        // { as: 'role', model: Role, where: { enum: 'STORE_MANAGER' }, attributes: ['id', 'name'] }
      ]
    });
    log.write("APIService ::: listStoreManagers :: managers count : " + managers.length);
    return managers;
  } catch (e) {
    log.write("APIService ::: listStoreManagers :: exception : ", e);
    throw (e);
  }
}
service.listStores = async (data) => {
  try {
    log.write("APIService ::: listStores :: data : ", data);
    var where = { companyId: data.companyId };
    if (data.filters && data.filters.locationId) {
      where.locationId = data.filters.locationId;
    }
    log.write("APIService ::: listStores :: where : ", where);
    var stores = await AssetStore.findAll({
      where: where,
      include: [{ as: 'location', model: Location, attributes: ['name'] },
        { as: 'manager', model: User, required: false, attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });
    log.write("APIService ::: listStores :: stores count : " + stores.length);
    return stores;
  } catch (e) {
    log.write("APIService ::: listStores :: exception : ", e);
    throw (e);
  }
}
service.saveStore = async (data, username) => {
  try {
    log.write("APIService ::: saveStore :: data : ", data);
    var role = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await AssetStore.update(data, { where: { id: data.id } })
      role = data;
    } else {
      data.active = 1;
      role = await AssetStore.create(data);
    }
    return role;
  } catch (e) {
    log.write("APIService ::: saveStore :: exception : ", e);
    throw (e);
  }
}


service.listBuildingAssets = async (data) => {
  try {
    log.write("APIService ::: listBuildingAssets :: data : ", data);
    var where = {};
    var projectWhere = {};
    var attributes;
    if (data.id && data.id != '') {
      where['id'] = data.id;
    }
    if (data.search) {
      var query = data;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('name')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('vendors.name')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    var itemWhere = {};
    if (data.buildingId) {
      itemWhere.currentBuildingId = data.buildingId;
    }
    if (data.statuses && data.statuses.length) {
      itemWhere.status = { $in: data.statuses };
    }
    var itemsInclude = [{
      as: 'assignment',
      model: AssetItemAssignment,
      required: true,
      where: { active: 1, buildingId: data.buildingId },
      attributes: ['assignedOn']
    }];
    log.write("APIService ::: listBuildingAssets :: where : ", where);
    log.write("APIService ::: listBuildingAssets :: itemWhere : ", itemWhere);
    var assets = await Asset.findAll({
      attributes: ['id', 'name', 'price', 'count'],
      where: where,
      include: [{ as: 'vendor', model: Vendor, attributes: ['name'] },
        // { as: 'project', model: Project, attributes: ['id', 'title'] },
        {
          as: 'items',
          model: AssetItem,
          required: true,
          where: itemWhere,
          attributes: ['id', 'tagNo', 'status', 'warrentyNo'],
          // include: itemsInclude
        }
      ],
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'desc']
      ]
    });
    log.write("APIService ::: listBuildingAssets :: assets count : " + assets.length);

    return assets;
  } catch (e) {
    log.write("APIService ::: listBuildingAssets :: exception : ", e);
    throw (e);
  }
}
service.listStoreAssets = async (data) => {
  try {
    log.write("APIService ::: listStoreAssets :: data : ", data);
    var where = {};
    var projectWhere = {};
    var attributes;
    if (data.id && data.id != '') {
      where['id'] = data.id;
    }
    if (data.search) {
      var query = data;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('name')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('vendors.name')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    log.write("APIService ::: listStoreAssets :: where : ", where);
    var visits = await Asset.findAll({
      attributes: ['name', 'id', 'price', 'count'],
      where: where,
      include: [{ as: 'vendor', model: Vendor, attributes: ['name'] },
        // { as: 'project', model: Project, attributes: ['id','title'] },
        {
          as: 'items',
          model: AssetItem,
          required: true,
          where: { status: 'InStore' },
          attributes: ['tagNo'],
          include: [{
            as: 'assignment',
            model: AssetItemAssignment,
            required: true,
            where: { active: 1 },
            attributes: ['assignedOn'],
            include: [{ as: 'movement', model: AssetItemMovement, where: { storeId: data.storeId } }]
          }]
        }
      ],
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'desc']
      ]
    });
    log.write("APIService ::: listStoreAssets :: visits count : " + visits.length);

    return visits;
  } catch (e) {
    log.write("APIService ::: listStoreAssets :: exception : ", e);
    throw (e);
  }
}
service.listProjectAssets = async (data) => {
  try {
    var where = "";
    if (data.projectId) {
      where = " and po.projectId=" + data.projectId;
    }
    if (data.unassigned) {
      where = where + " a.id is null ";
    }
    var sql = `SELECT pi.id purchaseItemId, po.id purchaseOrderId, v.id vendorId, skt.catId skuCatId, sk.id skuId, v.name vendor,concat(skt.name,', ',sk.name) name,concat(skt.code,'/',sk.code) code, pi.units count, pi.unitPrice price, ifnull(a.id,0) assigned 
              FROM vendor_purchase_items pi
              left join skus sk on sk.id=pi.skuId
              left join sku_types skt on skt.id=sk.typeId
              left join vendor_purchase_orders po on po.id=pi.purchaseOrderId
              left join vendors v on v.id=po.vendorId
              left join assets a on a.purchaseItemId=pi.id
              where po.companyId=` + data.companyId + ` and po.status not in ('Declined','Rejected','Archived','Cancelled') and sk.isAsset=1 ` + where + `
              order by po.id`;
    var assets = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return assets;
  } catch (e) {
    log.write("APIService ::: listProjectAssets :: exception : ", e);
    throw (e);
  }
}

service.listAssetsRegistry = async (data) => {
  try {
    var where = "";
    var buildingsTables = "";
    if (data.locationId || data.buildingIds.length) {
      buildingsTables = "left join buildings b on b.id = ia.buildingId left join locations l on l.id = b.locationId ";
    }
    if (data.locationId) {
      where = where + " and l.id = " + data.locationId;
    }
    if (data.buildingIds) {
      where = where + " and b.id in (" + data.buildingIds.join(",") + ") ";
    }
    if (data.statuses && data.statuses.length) {
      var statuses = [];
      _.each(data.statuses, function(s) {
        statuses.push("'" + s + "'");
      })
      where = where + " and ai.status in (" + statuses.join(",") + ")";
    }
    var vendorSearch = "";
    if (data.search && data.search != "") {
      vendorSearch = " left join vendors v on v.id = a.vendorId ";
      var search = data.search.toLowerCase();
      where = where + " and ( lower(v.name) like '%" + search + "%' or lower(sk.name) like '%" + search + "%')"
    }
    if (data.unassigned) {
      where = where + " and ai.id is null ";
    }
    var sql = `SELECT skc.name category, skt.name type, sk.name sku, sk.id skuId, count(ai.id) items
              FROM asset_items ai
              left join assets a on a.id = ai.assetId ` + vendorSearch + `
              left join skus sk on sk.id = a.skuId
              left join sku_types skt on skt.id = sk.typeId
              left join sku_categories skc on skc.id = sk.catId
              left join asset_item_assignments ia on ia.assetItemId = ai.id ` + buildingsTables + `
              where a.companyId=` + data.companyId + ` and ia.active=1 and ia.buildingId is not null` + where + `
              group by sk.id`;
    var assets = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return assets;
  } catch (e) {
    log.write("APIService ::: listProjectAssets :: exception : ", e);
    throw (e);
  }
}
service.listAssetItems = async (data) => {
  try {
    var where = "";
    var buildingsTables = "";
    if (data.locationId || data.buildingIds.length) {
      buildingsTables = "left join buildings b on b.id = ia.buildingId left join locations l on l.id = b.locationId ";
    }
    if (data.locationId) {
      where = where + " and l.id = " + data.locationId;
    }
    if (data.buildingIds) {
      where = where + " and b.id in (" + data.buildingIds.join(",") + ") ";
    }
    if (data.statuses && data.statuses.length) {
      var statuses = [];
      _.each(data.statuses, function(s) {
        statuses.push("'" + s + "'");
      })
      where = where + " and ai.status in (" + statuses.join(",") + ")";
    }
    var vendorSearch = "";
    if (data.search && data.search != "") {
      vendorSearch = " left join vendors v on v.id = a.vendorId ";
      var search = data.search.toLowerCase();
      where = where + " and ( lower(v.name) like '%" + search + "%' or lower(sk.name) like '%" + search + "%')"
    }
    if (data.unassigned) {
      where = where + " and ai.id is null ";
    }
    var sql = `SELECT ai.id, ai.tagNo, ai.status, ai.warrentyNo, ai.verified, ai.warrentyFile, ai.taggedOn,
                ia.assignedOn,  b.name building, o.name office, c.name cabin, d.name desk
                FROM asset_items ai
                left join assets a on a.id = ai.assetId ` + vendorSearch + `
                left join asset_item_assignments ia on ia.assetItemId = ai.id
                left join buildings b on b.id = ia.buildingId
                left join locations l on l.id = b.locationId
                left join offices o on o.id = ia.officeId
                left join cabins c on c.id = ia.cabinId
                left join desks d on d.id = ia.deskId
                where a.companyId=` + data.companyId + ` and ia.active=1 and ia.buildingId is not null` + where + `
              group by sk.id`;
    var assets = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return assets;
  } catch (e) {
    log.write("APIService ::: listProjectAssets :: exception : ", e);
    throw (e);
  }
}
service.getAssets = async (data) => {
  try {
    var itemWhere = {};
    if (data.statuses && data.statuses.length) {
      itemWhere = { status: { $in: data.statuses } };
    }
    // var assets = await Asset.findOne({
    //   where: { id: data.id }, 
    var assets = await Asset.findAll({
      where: { skuId: data.skuId },
      attributes: ['name', 'count', 'price', 'date', 'manufacturer', 'modelName'],
      include: [{ as: 'category', model: SkuCategory, attributes: ['name'] },
        { as: 'vendor', model: Vendor, attributes: ['name'] },
        { as: 'serviceProvider', model: AssetServiceProvider, required: false },
        { as: 'warrenty', model: AssetWarrenty, required: false }, {
          as: 'items',
          model: AssetItem,
          where: itemWhere,
          include: [{
            as: 'assignment',
            where: { active: 1 },
            required: false,
            model: AssetItemAssignment,
            include: [
              { as: 'building', model: Building, attributes: ['name'] },
              { as: 'office', model: Office, attributes: ['name'] },
              { as: 'cabin', model: Cabin, attributes: ['name'] },
              { as: 'desk', model: Desk, attributes: ['name'] },
              {
                as: 'movement',
                model: AssetItemMovement,
                attributes: ['purpose', 'date'],
                include: [{ as: 'store', model: AssetStore, required: false, include: ['location'] },
                  { as: 'serviceProvider', model: AssetServiceProvider, required: false },
                  { as: 'pdf', model: Doc, required: false }
                ]
              },
            ]
          }]
        }
      ]
    })
    return assets;
  } catch (e) {
    log.write("APIService ::: getAssets :: exception : ", e);
    throw (e);
  }
}
service.getAssetItem = async (id) => {
  try {
    var assets = await AssetItem.findOne({
      where: { id: id },
      include: [{
        as: 'assignments',
        required: false,
        model: AssetItemAssignment,
        include: [
          { as: 'building', model: Building, attributes: ['name'] },
          { as: 'office', model: Office, attributes: ['name'] },
          { as: 'cabin', model: Cabin, attributes: ['name'] },
          { as: 'desk', model: Desk, attributes: ['name'] },
          {
            as: 'movement',
            model: AssetItemMovement,
            attributes: ['purpose', 'date'],
            include: [{ as: 'store', model: AssetStore, required: false, include: ['location'] },
              { as: 'serviceProvider', model: AssetServiceProvider, required: false },
              { as: 'building', model: Building, required: false, attributes: ['name'] },
              { as: 'pdf', model: Doc, required: false }
            ]
          },
        ]
      }]
    })
    return assets;
  } catch (e) {
    log.write("APIService ::: getAssets :: exception : ", e);
    throw (e);
  }
}

service.createAssetItems = async (data, username) => {
  try {
    log.write("APIService ::: createAssetItems :: data : ", data);
    data.updated = new Date();
    data.date = new Date();
    data.updatedBy = username;
    var assets = await Asset.create(data);
    assets = assets.toJSON();
    var items = [];
    for (var i = 0; i < data.count; i++) {
      var seqNo = await systemUtils.getRefNo("AssetItem", null, null, data.companyId);
      var tagNo = utils.moment().format("YY") + "/" + (seqNo + "").padStart(6, '0');
      var item = {
        currentBuildingId: data.buildingId,
        assetId: assets.id,
        tagNo: tagNo,
        status: data.storeId ? 'InStore' : 'New',
        updated: new Date(),
        updatedBy: username
      }
      item = await AssetItem.create(item);
      item = item.toJSON();

      var movement = {
        assetItemId: item.id,
        purpose: data.buildingId ? "ToBuilding" : "ToStore",
        approvedBy: username,
        buildingId: data.buildingId,
        storeId: data.storeId,
        date: new Date(),
        updated: new Date(),
        updatedBy: "system"
      }
      movement = await AssetItemMovement.create(movement);

      var assignment = {
        assetItemId: item.id,
        buildingId: data.buildingId,
        active: 1,
        assetMovementId: movement.id,
        assignedOn: new Date(),
        assignedBy: "system"
      }
      assignment = await AssetItemAssignment.create(assignment);
      item.assignment = assignment;

      items.push(item);
    }
    assets.items = items;
    return assets;
  } catch (e) {
    log.write("APIService ::: createAssetItems :: exception : ", e);
    throw (e);
  }
}
service.assignAssetItems = async (data, username) => {
  try {
    log.write("APIService ::: assignAssetItems :: data : ", data);
    var assignments = [];
    for (var i = 0; i < data.items.length; i++) {
      var item = data.items[i];
      if (data.moveTo == "SetAside") {
        var itemStatus = "SetAside";
        await AssetItem.update({ status: itemStatus }, { where: { id: item.id } })
      } else {
        await AssetItem.update({ status: itemStatus }, { where: { id: item.id } })
        await AssetItemAssignment.update({ active: 0 }, { where: { assetItemId: item.id, active: 1 } });
        if (!item.assignmentId) {
          var movement = {
            assetItemId: item.id,
            purpose: data.moveTo || "ToBuilding",
            storeId: data.storeId,
            buildingId: data.buildingId,
            assetServiceProviderId: data.assetServiceProviderId,
            date: new Date(),
            updated: new Date(),
            updatedBy: username
          }
          movement = await AssetItemMovement.create(movement);

          var itemStatus = "InUse";
          if (data.moveTo == "ToStore") {
            itemStatus = "InStore";
          } else if (data.moveTo == "ToRepair") {
            itemStatus = "InRepair";
          } else if (data.moveTo == "ToTrash") {
            itemStatus = "Trashed";
          }
          await AssetItem.update({ status: itemStatus }, { where: { id: item.id } })
          var assignment = {
            assetItemId: item.id,
            buildingId: data.buildingId,
            officeId: data.officeId,
            cabinId: data.cabinId,
            desk: data.desk,
            active: 1,
            assetMovementId: movement.id,
            assignedOn: new Date(),
            assignedBy: username
          }
          assignment = await AssetItemAssignment.create(assignment);
          assignments.push(assignment);
        } else {
          var assignment = {
            assetItemId: item.id,
            buildingId: data.buildingId,
            officeId: data.officeId,
            cabinId: data.cabinId,
            deskId: data.deskId,
            active: 1,
            assignedOn: new Date(),
            assignedBy: username
          }
          assignment = await AssetItemAssignment.create(assignment);
          assignments.push(assignment);
        }
      }
    }
    return assignments;
  } catch (e) {
    log.write("APIService ::: assignAssetItems :: exception : ", e);
    throw (e);
  }
}
service.saveAsset = async (data, username) => {
  try {
    log.write("APIService ::: saveAsset :: data : ", data);
    var asset = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await Asset.update(data, { where: { id: data.id } })
      asset = data;
    } else {
      asset = await Asset.create(data);
    }
    return asset;
  } catch (e) {
    log.write("APIService ::: saveAsset :: exception : ", e);
    throw (e);
  }
}
service.saveAssetItem = async (data, username) => {
  try {
    log.write("APIService ::: saveAssetItem :: data : ", data);
    var asset = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await AssetItem.update(data, { where: { id: data.id } })
      asset = data;
    } else {
      asset = await AssetItem.create(data);
    }
    return asset;
  } catch (e) {
    log.write("APIService ::: saveAssetItem :: exception : ", e);
    throw (e);
  }
}

service.listAssetServiceProviders = async (data) => {
  try {
    log.write("APIService ::: listAssetServiceProviders :: data : ", data);
    var where = { active: 1 };
    if (data.filters.vendorId) {
      where.vendorId = data.filters.vendorId;
    }
    log.write("APIService ::: listAssetServiceProviders :: where : ", where);
    var items = await AssetServiceProvider.findAll({
      where: where,
      include: [{ as: 'vendor', model: Vendor, attributes: ['name'] }]
    });
    log.write("APIService ::: listAssetServiceProviders :: items count : " + items.length);
    return items;
  } catch (e) {
    log.write("APIService ::: listAssetServiceProviders :: exception : ", e);
    throw (e);
  }
}
service.saveAssetServiceProvider = async (data, username) => {
  try {
    log.write("APIService ::: saveAssetServiceProvider :: data : ", data);
    var role = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await AssetServiceProvider.update(data, { where: { id: data.id } })
      role = data;
    } else {
      role = await AssetServiceProvider.create(data);
    }
    return role;
  } catch (e) {
    log.write("APIService ::: saveAssetServiceProvider :: exception : ", e);
    throw (e);
  }
}

service.listAssetWarrenties = async (data) => {
  try {
    log.write("APIService ::: listAssetWarrenties :: data : ", data);
    var where = { companyId: data.companyId, active: 1 };
    if (data.filters.assetId) {
      where.assetId = data.filters.assetId;
    }
    log.write("APIService ::: listAssetWarrenties :: where : ", where);
    var items = await AssetWarrenty.findAll({
      where: where,
      include: [{ as: 'assets', model: Assets }]
    });
    log.write("APIService ::: listAssetWarrenties :: items count : " + items.length);
    return items;
  } catch (e) {
    log.write("APIService ::: listAssetWarrenties :: exception : ", e);
    throw (e);
  }
}
service.saveAssetWarrenty = async (data, username) => {
  try {
    log.write("APIService ::: saveAssetWarrenty :: data : ", data);
    var role = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await AssetWarrenty.update(data, { where: { id: data.id } })
      role = data;
    } else {
      role = await AssetWarrenty.create(data);
    }
    return role;
  } catch (e) {
    log.write("APIService ::: saveAssetWarrenty :: exception : ", e);
    throw (e);
  }
}


exports.service = service;