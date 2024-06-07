'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var request = require('request-promise');
var moment = require("moment");

var config = require('../utils/config').config;
var session = require("./session");
var serviceSession = require("../services/session");
var log = require('../utils/log').log;
var utils = require('../utils/utils').utils;
var systemUtils = require('./utils/system_util').utils;

var Constants = require("./models/constants");
var Company = require("./models/base").Company;
var SkuCategory = require("./models/base").SkuCategory;
var SkuType = require("./models/base").SkuType;
var SkuUnit = require("./models/base").SkuUnit;
var Sku = require("./models/base").Sku;
var Doc = require("./models/base").Doc;
var OpexCategory = require("./models/base").OpexCategory;
var OpexType = require("./models/base").OpexType;
var Asset = require("./models/base").Asset;
var AssetItem = require("./models/base").AssetItem;
var Building = require("./models/base").Building;
var Office = require("./models/base").Office;
var Client = require("./models/base").Client;
var Booking = require("./models/base").Booking;
var Cabin = require("./models/base").Cabin;
var City = require("./models/base").City;
var Vendor = require("./models/base").Vendor;
var Project = require("./models/base").Project;
var VendorContact = require("./models/base").VendorContact;
var VendorBankAccount = require("./models/base").VendorBankAccount;
var VendorPaymentTerm = require("./models/base").VendorPaymentTerm;
var VendorSku = require("./models/base").VendorSku;
var VendorSkuPricing = require("./models/base").VendorSkuPricing;
var WorkOrder = require("./models/base").WorkOrder;
var WorkItem = require("./models/base").WorkItem;
var PurchaseOrder = require("./models/base").PurchaseOrder;
var PurchaseOrderInvoice = require("./models/base").PurchaseOrderInvoice;
var PurchaseOrderInvoiceGst = require("./models/base").PurchaseOrderInvoiceGst;
var PurchaseItem = require("./models/base").PurchaseItem;
var PurchaseItemDelivery = require("./models/base").PurchaseItemDelivery;
var PurchaseItemStatus = require("./models/base").PurchaseItemStatus;
var PurchaseItemStatusImage = require("./models/base").PurchaseItemStatusImage;
var PurchaseOrderMilestone = require("./models/base").PurchaseOrderMilestone;
var PayoutBenificiary = require("./models/base").PayoutBenificiary;
var PayoutPayment = require("./models/base").PayoutPayment;
var VendorTdsDeduction = require("./models/base").VendorTdsDeduction;
var Assets = require("./models/base").Assets;
var AssetItem = require("./models/base").AssetItem;
var AssetItemMovement = require("./models/base").AssetItemMovement;
var AssetItemAssignment = require("./models/base").AssetItemAssignment;
var TdsComplianceTerm = require("./models/base").TdsComplianceTerm;
var GstComplianceTerm = require("./models/base").GstComplianceTerm;
var TdsPayment = require("./models/base").TdsPayment;

var services = require("./services").service;
var bookingsService = require("./bookings").service;
var supportService = require("./support").service;
var mailsService = require("./mails").service;

var service = {};

service.listSkuCategories = async (data) => {
  try {
    log.write("PurchaseService ::: listSkuCategories :: data : ", data);
    var where = {};
    var include = null;
    data.filters = data.filters || {};
    if (data.filters.search && data.filters.search != '') {
      include = [{ as: 'types', model: SkuType, attributes: ['name'], include: [{ as: 'skus', model: Sku, attributes: ['name'] }] }];
      // where['name'] = { $like: '%' + data.filters.search + '%' }
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('sku_categories.name')), {
        $like: "%" + data.filters.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('types.name')), {
        $like: "%" + data.filters.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`types->skus`.name')), {
        $like: "%" + data.filters.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    if (data.filters.active && data.filters.active != '') {
      where['active'] = data.filters.active
    }
    if (data.filters.cityId && data.filters.cityId != '') {
      where['cityId'] = data.filters.cityId
    }
    var results = await SkuCategory.findAll({
      where: where,
      include: include,
      subQuery: false,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("PurchaseService ::: listSkuCategories :: SkuCategories count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listSkuCategories :: exception : ", e);
    throw (e);
  }
}
service.saveSkuCategory = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveSkuCategory :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await SkuCategory.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await SkuCategory.create(data);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveSkuCategory :: exception : ", e);
    throw (e);
  }
}

service.listSkuTypes = async (data) => {
  try {
    log.write("PurchaseService ::: listSkuTypes :: data : ", data);
    var where = {};
    var include = null;
    if (data.filters.search && data.filters.search != '') {
      include = [{ as: 'skus', model: Sku, attributes: ['name'] }];
      // where['name'] = { $like: '%' + data.filters.search + '%' }
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('sku_types.name')), {
        $like: "%" + data.filters.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('skus.name')), {
        $like: "%" + data.filters.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    if (data.filters.active && data.filters.active != '') {
      where['active'] = data.filters.active
    }
    if (data.filters.catId && data.filters.catId != '') {
      where['catId'] = data.filters.catId
    }
    var results = await SkuType.findAll({
      where: where,
      include: include,
      subQuery: false,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("PurchaseService ::: listSkuTypes :: SkuTypes count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listSkuTypes :: exception : ", e);
    throw (e);
  }
}
service.saveSkuType = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveSkuType :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await SkuType.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await SkuType.create(data);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveSkuType :: exception : ", e);
    throw (e);
  }
}

service.listSkus = async (data) => {
  try {
    log.write("PurchaseService ::: listSkus :: data : ", data);
    var where = {};
    if (data.filters.search && data.filters.search != '') {
      // where['name'] = { $like: data.filters.search + '%' }
      // where['$category.name$'] = { $like: data.filters.search + '%' }
      // where['$type.name$'] = { $like: data.filters.search + '%' }

      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`skus`.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`type`.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`category`.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    if (data.filters.active && data.filters.active != '') {
      where['active'] = data.filters.active;
    }
    if (data.filters && data.filters.isAsset == 1) {
      where['isAsset'] = data.filters.isAsset
    }
    if (data.filters && data.filters.isAsset == 0) {
      where['isService'] = 1;
    }
    if (data.filters.catId && data.filters.catId != '') {
      where['catId'] = data.filters.catId
    }
    if (data.filters.typeId && data.filters.typeId != '') {
      where['typeId'] = data.filters.typeId
    }
    var orderBy = [
      ['name', 'desc']
    ];
    if (data.sortBy) {
      if (data.sortBy.split(".").length) {
        orderBy = [
          [Sequelize.literal(data.sortBy), data.sortOrder]
        ];
      } else {
        orderBy = [
          [data.sortBy, data.sortOrder]
        ];
      }
    }
    log.write("PurchaseService ::: listSkus :: where : ", where);
    var results = await Sku.findAll({
      where: where,
      include: ['category', 'type'],
      offset: data.offset,
      limit: data.limit,
      order: orderBy
    });
    var skus = [];
    _.each(results, function(r) {
      var sku = r.toJSON();
      sku.kind = r.isService ? "Service" : "Material";
      skus.push(sku);
    })
    log.write("PurchaseService ::: listSkus :: SkuTypes count : " + skus.length);
    return skus;
  } catch (e) {
    log.write("PurchaseService ::: listSkus :: exception : ", e);
    throw (e);
  }
}
service.searchSkus = async (data) => {
  try {
    log.write("PurchaseService ::: searchSkus :: data : ", data);
    var where = {};
    if (data.filters.isAsset && data.filters.isAsset != '') {
      where['$skus.isAsset$'] = 1;
    }
    if (data.filters.search && data.filters.search != '') {
      // where['name'] = { $like: '%' + data.filters.search + '%' }
      var query = data.filters;
      var $or = [];
      if (data.filters.vendorId) {
        $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('sku.name')), {
          $like: query.search.toLowerCase() + "%"
        }))
      } else {
        $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('skus.name')), {
          $like: query.search.toLowerCase() + "%"
        }))
      }
      where['$and'] = { $or: $or }
    }

    var results;
    if (data.filters.vendorId) {
      where.vendorId = data.filters.vendorId;
      where.active = 1;
      where.status = { $in: ['Accepted', 'Approved'] };
      results = [];

      // log.write("PurchaseService ::: searchSkus :: vendorSkus : where : ", JSON.stringify(where, null, 2));
      var rows = await VendorSku.findAll({
        where: where,
        include: {
          as: 'sku',
          model: Sku,
          include: [{ as: 'category', model: SkuCategory, attributes: ['name'], required: false },
            { as: 'type', model: SkuType, attributes: ['name'], required: false }
          ]
        },
        offset: data.offset || 0,
        limit: data.limit || 10,
      });
      // log.write("PurchaseService ::: searchSkus :: vendorSkus : ", rows)
      // results = _.map(results, 'sku');
      _.each(rows, function(r) {
        r = r.toJSON();
        var sku = r.sku;
        sku.price = r.minPrice;
        results.push(sku);
      })
    } else {
      //gththtgn ghbgfbfg gb
      results = await Sku.findAll({
        where: where,
        include: [{ as: 'category', model: SkuCategory, attributes: ['name'] },
          { as: 'type', model: SkuType, attributes: ['name'] }
        ],
        offset: data.offset || 0,
        limit: data.limit || 10,
      });
    }
    log.write("PurchaseService ::: searchSkus :: count : " + JSON.stringify(results));
    var skus = [];
    _.each(results, function(r) {
      skus.push({ skuId: r.id, gst: r.gst, price: r.price, sku: r.name, type: r.type.name, skuCatId: r.catId, category: r.category.name });
    })
    return skus;
  } catch (e) {
    log.write("PurchaseService ::: searchSkus :: exception : ", e);
    throw (e);
  }
}
service.saveSku = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveSku :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await Sku.update(data, { where: { id: data.id } })
      item = data;
    } else {
      var skus = await Sku.findAll({ where: { name: data.name } });
      if (skus.length) {
        throw (data.name + " SKU already exisiting.")
      } else {
        item = await Sku.create(data);
      }
    }
    if (data.typeCode) {
      await SkuType.update({ code: data.typeCode }, { where: { id: data.typeId } });
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveSku :: exception : ", e);
    throw (e);
  }
}

service.listSkuUnits = async (data) => {
  try {
    log.write("PurchaseService ::: listSkus :: data : ", data);
    var where = { companyId: data.companyId };
    var results = await SkuUnit.findAll({
      where: where,
    });
    log.write("PurchaseService ::: listSkuUnits :: SkuUnits count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listSkuUnits :: exception : ", e);
    throw (e);
  }
}
service.saveSkuUnit = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveSku :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await SkuUnit.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await SkuUnit.create(data);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveSku :: exception : ", e);
    throw (e);
  }
}
service.deleteSkuUnit = async (id, username) => {
  try {
    log.write("PurchaseService ::: saveSku :: unit id : " + id);
    return await SkuUnit.destroy({ where: { id: id } });
  } catch (e) {
    log.write("PurchaseService ::: saveSku :: exception : ", e);
    throw (e);
  }
}

service.listAssets = async (data) => {
  try {
    log.write("PurchaseService ::: listAssets :: data : ", data);
    var where = {};
    if (data.filters.search && data.filters.search != '') {
      where['name'] = { $like: '%' + data.filters.search + '%' }
    }
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status
    }
    if (data.filters.skuId && data.filters.skuId != '') {
      where['skuId'] = data.filters.skuId
    }
    var results = await Asset.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("PurchaseService ::: listAssets :: Assets count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listAssets :: exception : ", e);
    throw (e);
  }
}
service.saveAsset = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveAsset :: data : ", data);
    var asset = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await Asset.update(data, { where: { id: data.id } })
      asset = data;
    } else {
      data.date = new Date();
      asset = await Asset.create(data);

      // var sku = await Sku.findOne({ where: { id: data.skuId } });
      var result = await session.db.query("select sum(quantity) count from assets where skuId=" + data.skuId + " group by skuId", { type: Sequelize.QueryTypes.SELECT });
      var count = result[0]['count'] - data.quantity + 1;
      var items = [];
      for (var i = 0; i < data.quantity; i++) {
        items.push({
          assetId: asset.id,
          seqNo: i + 1,
          tagNo: data.skuCode + "-" + count,
          status: 'Active'
        })
        count++;
      }
      service.saveAssetItems(items, username);
    }
    return asset;
  } catch (e) {
    log.write("PurchaseService ::: saveAsset :: exception : ", e);
    throw (e);
  }
}

service.listAssetItems = async (data) => {
  try {
    log.write("PurchaseService ::: listAssetItems :: data : ", data);
    var where = {};
    if (data.filters.search && data.filters.search != '') {
      where['name'] = { $like: '%' + data.filters.search + '%' }
    }
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status
    }
    if (data.filters.assetId && data.filters.assetId != '') {
      where['assetId'] = data.filters.assetId
    }
    var results = await AssetItem.findAll({
      where: where,
      include: [{ as: 'building', model: Building, attributes: ['name'], required: false },
        { as: 'cabin', model: Cabin, attributes: ['name'], required: false }
      ],
      offset: data.offset,
      limit: data.limit,
    });
    log.write("PurchaseService ::: listAssetItems :: Assets count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listAssetItems :: exception : ", e);
    throw (e);
  }
}
service.saveAssetItems = async (items, username) => {
  try {
    log.write("PurchaseService ::: saveAssetItems :: items : ", items);
    var assetItem = {};
    for (var i = 0; i < items.length; i++) {
      var data = items[i];
      if (data.id) {
        if (data.assignment) {
          data.status = "Assigned";
          data.assignedOn = new Date();
          data.assignedBy = username;
        }
        if (data.scrapped) {
          data.status = "Scrapped";
          data.scrappedOn = new Date();
          data.scrappedBy = username;
        }
        await AssetItem.update(data, { where: { id: data.id } })
        assetItem = data;
      } else {
        assetItem = await AssetItem.create(data);
        assetItem.set("tagNo", data.tagNo + "-" + assetItem.id);
        assetItem.save();
      }
    }
    return assetItem;
  } catch (e) {
    log.write("PurchaseService ::: saveAssetItems :: exception : ", e);
    throw (e);
  }
}

service.listServiceVendors = async (data) => {
  try {
    log.write("PurchaseService ::: listServiceVendors :: data : ", data);
    var where = {};
    var attributes = null;
    if (data.filters.search && data.filters.search != '') {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('vendors.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('address')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('gst')), {
        $like: query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    where['name'] = { $ne: null };
    if (data.filters.active && data.filters.active != '') {
      where['active'] = data.filters.active
    } else {
      where['active'] = 1
    }
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status
    } else {
      // where['status'] = { $in: ['Empanelled', 'Approved'] }
    }
    if (data.filters.id && data.filters.id != '') {
      where['id'] = data.filters.id
    }
    where.companyId = data.companyId;
    log.write("PurchaseService ::: listServiceVendors :: where : ", where);
    var include = [{ as: 'contact', model: VendorContact, required: false, where: { isMainContact: 1 } },
      { as: 'bankAccounts', model: VendorBankAccount, required: false, where: { active: 1, verified: 1 }, attributes: ['id', 'accountNumber', 'ifscCode', 'benificiaryName'] }, {
        as: 'skus',
        model: VendorSku,
        attributes: ['minPrice', 'maxPrice'],
        where: { active: 1, $or: [{ skuId: data.filters.skuId }, { typeId: data.filters.skuTypeId }] }
      }
    ];
    if (data.filters.typeSearch) {
      attributes = ['id', 'name', 'gst'];
      include = null;
      data.limit = 5;
      data.offset = 0;
    }
    var results = await Vendor.findAll({
      where: where,
      include: include,
      attributes: attributes,
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'desc']
      ]
    });
    log.write("PurchaseService ::: listServiceVendors :: ServiceVendors count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listServiceVendors :: exception : ", e);
    throw (e);
  }
}
service.listVendors = async (data) => {
  try {
    log.write("PurchaseService ::: listVendors :: data : ", data);
    var where = {};
    var attributes = null;
    if (data.filters.search && data.filters.search != '') {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('vendors.name')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      if (!data.filters.typeSearch) {
        $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('contact.phone')), {
          $like: "%" + query.search.toLowerCase() + "%"
        }))
      }
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('address')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('gst')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    where['name'] = { $ne: null };
    // if (data.filters) {
    // where['active'] = data.filters.active ? 1 : 0;
    // where['verified'] = data.filters.verified ? 1 : 0;
    // where['$and'] = { $or: [{ active: data.filters.active ? 1 : 0 }, { verified: data.filters.verified ? 1 : 0 }] }
    // }
    if (data.filters) {
      if (data.filters.active && data.filters.active != '') {
        where['active'] = 1;
      } else if (data.filters.active != undefined) {
        where['active'] = { $ne: 1 };
      }
    }
    if (data.filters.statuses && data.filters.statuses.length) {
      where['status'] = { $in: data.filters.statuses }
    }
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status
    } else {
      // where['status'] = { $in: ['Empanelled', 'Approved'] }
    }
    if (data.filters.id && data.filters.id != '') {
      where['id'] = data.filters.id
    }
    where.companyId = data.companyId;
    var include = [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }];
    if (data.filters.typeSearch) {
      attributes = ['id', 'name', 'gst'];
      include = null;
      data.limit = 8;
      data.offset = 0;
    }
    if (data.filters.opexTypeId) {
      include.push('skus');
      include.push({ as: 'bankAccount', model: VendorBankAccount, required: false, where: { active: 1, verified: 1 } });
      where['$skus.opexTypeId$'] = data.filters.opexTypeId;
    }

    var orderBy = [
      ['id', 'desc']
    ];
    if (data.sortBy) {
      if (data.sortBy.split(".").length) {
        orderBy = [
          [Sequelize.literal(data.sortBy), data.sortOrder]
        ];
      } else {
        orderBy = [
          [data.sortBy, data.sortOrder]
        ];
      }
    }
    log.write("PurchaseService ::: listVendors :: where : ", JSON.stringify(where, null, 2));
    var results = await Vendor.findAll({
      where: where,
      include: include,
      attributes: attributes,
      offset: data.offset,
      limit: data.limit,
      order: orderBy
    });
    log.write("PurchaseService ::: listVendors :: VendorTypes count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listVendors :: exception : ", e);
    throw (e);
  }
}
service.getVendor = async (id) => {
  try {
    log.write("PurchaseService ::: getVendor :: id : ", id);
    var vendor = await Vendor.findOne({
      where: { id: id },
      include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }]
    });
    if (vendor) {
      vendor = vendor.toJSON();
      vendor.gstFile = vendor.gstId ? await systemUtils.getFile(vendor.gstId) : null;
      vendor.cinFile = vendor.cinId ? await systemUtils.getFile(vendor.cinId) : null;
      vendor.panFile = vendor.panId ? await systemUtils.getFile(vendor.panId) : null;
      vendor.msmeFile = vendor.msmeId ? await systemUtils.getFile(vendor.msmeId) : null;
    }
    return vendor;
  } catch (e) {
    log.write("PurchaseService ::: getVendor :: exception : ", e);
    throw (e);
  }
}
service.saveVendor = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveVendor :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await Vendor.update(data, { where: { id: data.id } })
      item = data;
      if (data.contact) {
        await service.saveVendorContact(data.contact, username);
      }
    } else {
      data.date = new Date();
      data.active = 1;
      data.status = 'New';
      data.referredBy = username;
      data.referredOn = new Date();
      item = await Vendor.create(data);
      data.contact.vendorId = item.id;
      data.contact.isMainContact = 1;
      data.contact.active = 1;
      var company = await systemUtils.getCompany(data.companyId);
      var refNo = "VEN-" + company.shortName + "-" + (100000 + item.id);
      item.set('refNo', refNo);
      await item.save();
      await VendorContact.create(data.contact);

      systemUtils.addActivity({
        activity: 'NewVendor',
        update: (data.update || "New Vendor '" + data.name + "' is added"),
        companyId: data.companyId
      }, username);
      // VendorPaymentTerm.create({
      //   vendorId: item.id,
      //   name: "Advance Payment Term",
      //   onAdvance: 100,
      //   onDelivery: 0,
      //   inProgress: 0,
      //   inProgressStages: "[]",
      //   onFinish: 0,
      //   afterFinish: 0,
      //   afterFinishStages: "[]",
      //   active: 1
      // });
      // VendorPaymentTerm.create({
      //   vendorId: item.id,
      //   name: "Delivery Payment Term",
      //   onAdvance: 0,
      //   onDelivery: 100,
      //   inProgress: 0,
      //   inProgressStages: "[]",
      //   onFinish: 0,
      //   afterFinish: 0,
      //   afterFinishStages: "[]",
      //   active: 1
      // });

      service.sendVendorVerificationMail(item.id);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveVendor :: exception : ", e);
    throw (e);
  }
}
service.saveServiceVendor = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveServiceVendor :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await Vendor.update(data, { where: { id: data.id } })
      item = data;
      if (data.contact) {
        await service.saveVendorContact(data.contact, username);
      }
    } else {
      data.date = new Date();
      data.active = 1;
      data.status = 'Empanelled';
      data.referredBy = username;
      data.referredOn = new Date();
      item = await Vendor.create(data);
      if (data.hasContact) {
        var contact = {
          name: data.contactName,
          email: data.contactEmail,
          phone: data.contactPhone
        }
        contact.vendorId = item.id;
        contact.isMainContact = 1;
        contact.active = 1;
        await VendorContact.create(contact);

        if (data.bankAccountNumber) {
          var bankAccount = {
            accountNumber: data.bankAccountNumber,
            ifscCode: data.bankIfscCode,
            benificiaryName: data.accountHolderName,
            active: 1,
            verified: 1,
            vendorId: item.id,
            date: new Date()
          }
          await VendorBankAccount.create(bankAccount);
        }
      }
      if (data.skuTypeId || data.skuItemId) {
        await VendorSku.create({
          vendorId: item.id,
          typeId: data.skuTypeId,
          skuId: data.skuItemId,
          active: 1,
          status: 'Approved',
          date: new Date()
        })
      }
      var company = await systemUtils.getCompany(data.companyId);
      var refNo = "VEN-" + company.shortName + "-" + (100000 + item.id);
      item.set('refNo', refNo);
      await item.save();

      systemUtils.addActivity({
        activity: 'NewVendor',
        update: (data.update || "New Vendor '" + data.name + "' is added"),
        companyId: data.companyId
      }, username);

      // service.sendVendorVerificationMail(item.id);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveVendor :: exception : ", e);
    throw (e);
  }
}
service.saveProjectBill = async (data, username) => {
  try {
    var billStatus = data.status || "Raised";
    if (data.isPaid) {
      if (data.payout && data.payout.utr) {
        billStatus = "Paid";
      } else {
        billStatus = "Draft";
      }
    }
    log.write("PurchaseService ::: saveProjectBill :: data : ", data);
    data.updated = new Date();
    data.updatedBy = username;
    data.status = billStatus;
    data.isBill = 1;

    if (data.id) {
      await PurchaseOrder.update(data, { where: { id: data.id } });
      if (data.payout) {
        var milestone = await PurchaseOrderMilestone.findOne({ where: { purchaseOrderId: data.id } });
        if (!milestone) {
          milestone = {
            purchaseOrderId: data.id,
            status: data.payout && data.payout.utr ? "Paid" : "Draft",
            name: data.name,
            amount: data.amount - (data.tds || 0),
            tds: data.tds,
            paidOn: data.paidOn,
            actualDate: data.dueDate,
            paymentMode: data.paymentMode,
            updated: new Date(),
            updatedBy: username
          }
          milestone = await PurchaseOrderMilestone.create(milestone);
        } else {
          var _milestone = {
            status: data.payout && data.payout.utr ? "Paid" : "Draft",
            name: data.name,
            amount: data.amount - (data.tds || 0),
            tds: data.tds,
            paidOn: data.paidOn,
            actualDate: data.dueDate,
            paymentMode: data.paymentMode,
            updated: new Date(),
            updatedBy: username
          }
          await PurchaseOrderMilestone.update(_milestone, { where: { purchaseOrderId: data.id } });
          milestone = await PurchaseOrderMilestone.findOne({ where: { purchaseOrderId: data.id } });
        }

        var payout = await PayoutPayment.findOne({ where: { purchaseOrderId: data.id } });
        if (payout) {
          await PayoutPayment.update({
            amount: milestone.amount,
            paidOn: data.paidOn,
            paymentMode: data.payout.paymentMode,
            type: 'VendorPayment',
            status: data.payout.utr ? 'Paid' : 'Approved',
            utr: data.payout.utr,
            updated: new Date(),
            updatedBy: username,
            issuedOn: data.payout.issuedOn,
            chequeNo: data.payout.chequeNo,
          }, { where: { id: milestone.payooutId } })
        } else {
          var payout = await PayoutPayment.create({
            info: "CapexBill payment for " + data.vendor.name,
            amount: milestone.amount,
            paidOn: data.paidOn,
            paymentMode: data.payout.paymentMode,
            type: 'VendorPayment',
            status: data.payout.utr ? 'Paid' : 'Approved',
            utr: data.payout.utr,
            purchaseOrderId: data.id,
            updated: new Date(),
            updatedBy: username,
            companyId: data.companyId,
            issuedOn: utils.moment(data.payout.issuedOn).format("YYYY-MM-DD"),
            chequeNo: data.payout.chequeNo,
          })
          milestone.set("payoutId", payout.id);
          milestone.save();
        }
        po = data;
      }
    } else {
      data.taxInvoiceId = data.imageId;
      var po = await PurchaseOrder.create(data);
      var company = await systemUtils.getCompany(data.companyId);
      var refNo = company.shortName + "-PO-" + (100000 + po.id);
      po.set('refNo', refNo);
      po.save();

      var milestone = {
        purchaseOrderId: po.id,
        status: data.payout && data.payout.utr ? "Paid" : "Draft",
        name: data.name,
        amount: data.amount - (data.tds || 0),
        tds: data.tds,
        paidOn: data.paidOn,
        actualDate: data.dueDate,
        paymentMode: data.paymentMode,
        updated: new Date(),
        updatedBy: username
      }
      milestone = await PurchaseOrderMilestone.create(milestone);

      if (data.payout) {
        var payout = await PayoutPayment.create({
          info: "CapexBill payment for " + data.vendor.name,
          amount: milestone.amount,
          paidOn: data.paidOn,
          paymentMode: data.payout.paymentMode,
          type: 'VendorPayment',
          status: data.payout.utr ? 'Paid' : 'Approved',
          utr: data.payout.utr,
          purchaseOrderId: po.id,
          updated: new Date(),
          updatedBy: username,
          companyId: data.companyId,
          issuedOn: data.payout.issuedOn,
          chequeNo: data.payout.chequeNo,
        })
        milestone.set("payoutId", payout.id);
        milestone.save();
      }
    }
    return po;
  } catch (e) {
    log.write("PurchaseService ::: saveVendor :: exception : ", e);
    throw (e);
  }
}
service.getVendorServiceSkus = async (data) => {
  try {
    log.write("PurchaseService ::: getVendorTdsDeductions :: data : ", data);
    var startDate = data.startDate;
    var endDate = data.endDate;
    var year = utils.moment().year();
    var month = utils.moment().month();
    if (month < 3) {
      startDate = (year - 1) + "-04-01";
      endDate = year + "-03-31";
    } else {
      startDate = year + "-04-01";
      endDate = (year + 1) + "-03-31";
    }
    var where = { vendorId: data.vendorId, date: { $between: [utils.moment(startDate).toDate(), utils.moment(endDate).toDate()] } };
    log.write("PurchaseService ::: getVendorTdsDeductions :: where : ", where);

    var pos = await PurchaseOrder.findAll({
      where: where,
      attributes: ['id', 'date'],
      include: [{
        as: 'items',
        model: PurchaseItem,
        attributes: ['id', 'taxableAmount', 'tds', 'gst', 'amount'],
        include: [{
          as: 'sku',
          model: Sku,
          attributes: ['name', 'tds'],
          where: { isService: 1 }
        }]
      }]
    });
    log.write("PurchaseService ::: getVendorTdsDeductions :: pos : ", pos.length);

    var items = [];
    _.each(pos, function(p) {
      log.write("PurchaseService ::: getVendorTdsDeductions :: po : ", p.toJSON());
      _.each(p.items, function(i) {
        items.push({
          id: i.id,
          purchaseOrderId: p.id,
          taxableAmount: i.taxableAmount,
          tds: i.tds,
          gst: i.gst,
          amount: i.amount,
          sku: i.sku.name,
          skuTdsPercent: i.sku.tds
        })
      })
    })
    return items;
  } catch (e) {
    log.write("PurchaseService ::: getVendorServiceSkus :: exception : ", e);
    throw (e);
  }
}
service.getVendorTdsDeductions = async (data) => {
  try {
    log.write("PurchaseService ::: getVendorTdsDeductions :: data : ", data);
    var financialYear = data.financialYear;
    if (!financialYear) {
      var year = utils.moment().year();
      var month = utils.moment().month();
      if (month < 3) {
        financialYear = (year - 1) + "-" + (year % 100);
      } else {
        financialYear = year + "-" + ((year + 1) % 100);
      }
    }
    var excludePo = {};
    if (data.excludePo) {
      excludePo = { $notIn: [data.excludePo] }
    }
    var items = await VendorTdsDeduction.findAll({
      where: { vendorId: data.vendorId, year: financialYear },
      include: [{ as: 'milestone', model: PurchaseOrderMilestone, attributes: ['name', 'status', 'purchaseOrderId'] }]
    });

    var deductions = [];
    _.each(items, function(i) {
      var item = i.toJSON();
      item.purchaseOrderId = item.milestone.purchaseOrderId;
      item.milestoneStatus = item.milestone.status;
      item.milestone = item.milestone.name;
      deductions.push(item);
    })

    return deductions;
  } catch (e) {
    log.write("PurchaseService ::: getVendorTdsDeductions :: exception : ", e);
    throw (e);
  }
}
service.deductTDS = async (data) => {
  try {
    var tdsDeduction = await VendorTdsDeduction.create(data)
    return tdsDeduction;
  } catch (e) {
    log.write("PurchaseService ::: deductTDS :: exception : ", e);
    throw (e);
  }
}

service.sendVendorVerificationMail = async (vendorId) => {
  log.write("PurchaseService ::: sendVendorVerificationMail :: vendorId : ", vendorId);
  try {
    var vendor = await Vendor.findOne({
      where: { id: vendorId },
      include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }]
    })
    if (vendor) {
      var linkData = {
        vendorId: vendor.id,
      }
      var selfCareLink = await systemUtils.createSelfCareLink("VendorVerification", "vendor-verification", linkData, vendor.companyId);

      var msg = "We are happy to get associated with " + vendor.name + " as our vendor for our company projects. " +
        " We request you to verify your self at this link to proceed further. <a href='" + selfCareLink.url + "'> Click here to Verify</a>";
      var company = await systemUtils.getCompany(vendor.companyId);
      var mailData = {
        name: vendor.contact.name,
        msg: msg,
        supportPhone: company.supportPhone,
        supportEmail: company.supportEmail,
        teamName: "Team " + company.name,
      }
      log.write("PurchaseService ::: sendVendorVerificationMail :: mailData : ", mailData);

      var mailBody = await services.getMailBody("emails/context_notification.html", mailData);
      log.write("PurchaseService ::: sendVendorVerificationMail :: mailBody : ", mailBody.length);
      var receivers = [];
      receivers.push({
        name: vendor.contact.name,
        email: vendor.contact.email,
      });
      await services.sendMail(company.name + " :: Requesting for Vendor Verification", mailBody, receivers);
    } else {
      log.write("PurchaseService ::: sendVendorVerificationMail :: no vendor found : " + vendorId);
      throw ("No Vendor found with ID : " + vendorId)
    }
  } catch (e) {
    log.write("PurchaseService ::: sendVendorVerificationMail :: exception : ", e);
    throw e;
  }
}

service.listVendorContacts = async (data) => {
  try {
    log.write("PurchaseService ::: listVendorContacts :: data : ", data);
    var where = {};
    if (data.filters.active && data.filters.active != '') {
      where['active'] = data.filters.active
    }
    if (data.filters.vendorId && data.filters.vendorId != '') {
      where['vendorId'] = data.filters.vendorId
    }
    var results = await VendorContact.findAll({
      where: where,
      include: ['idProof', 'addressProof'],
      offset: data.offset,
      limit: data.limit,
    });
    log.write("PurchaseService ::: listVendorContacts :: VendorContacts count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listVendorContacts :: exception : ", e);
    throw (e);
  }
}
service.saveVendorContact = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveVendorContact :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await VendorContact.update(data, { where: { id: data.id } });

      item = await VendorContact.findOne({
        where: { id: data.id },
        include: [{ as: 'vendor', model: Vendor, include: ['skus', 'bankAccounts'] }]
      });
      if (data.verified && !item.vendor.verified) {
        var vendorStatus = "New";
        if (item.vendor.bankAccounts.length) {
          // var acceptedSkus = _.filter(item.vendor.skus, { status: "Accepted" });
          var verifiedBanks = _.filter(item.vendor.bankAccounts, { verified: 1 });
          if (verifiedBanks.length) {
            vendorStatus = "Empanelled";
          }
        } else if (item.vendor.paymentMode != "BankTransfer") {
          vendorStatus = "Empanelled";
        }
        if (vendorStatus == "Empanelled") {
          await Vendor.update({
            status: vendorStatus,
            verified: 1,
            verifiedOn: new Date(),
            verifiedBy: username
          }, { where: { id: item.vendorId } });
        }
      }
    } else {
      data.date = new Date();
      item = await VendorContact.create(data);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveVendorContact :: exception : ", e);
    throw (e);
  }
}

service.listVendorBankAccounts = async (data) => {
  try {
    log.write("PurchaseService ::: listVendorBankAccounts :: data : ", data);
    var where = {};
    if (data.filters.active && data.filters.active != '') {
      where['active'] = data.filters.active
    }
    if (data.filters.vendorId && data.filters.vendorId != '') {
      where['vendorId'] = data.filters.vendorId
    }
    where['accountNumber'] = { $ne: null };
    var results = await VendorBankAccount.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("PurchaseService ::: listVendorBankAccounts :: VendorBankAccounts count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listVendorBankAccounts :: exception : ", e);
    throw (e);
  }
}
service.saveVendorBankAccount = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveVendorBankAccount :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await VendorBankAccount.update(data, { where: { id: data.id } })
      item = await VendorBankAccount.findOne({
        where: { id: data.id },
        include: [{ as: 'vendor', model: Vendor, include: ['contacts', 'skus'] }]
      });
      var vendorVerified = item.vendor.verified;
      var verifiedContacts = _.filter(item.vendor.contacts, { verified: 1 });
      if (verifiedContacts.length) {
        vendorVerified = true;
      }
      if (vendorVerified && item.vendor.status == "New") {
        // var vendorStatus = "New";
        // if (item.vendor.skus.length) {
        //   var acceptedSkus = _.filter(item.vendor.skus, { status: "Accepted" });
        //   if (acceptedSkus.length) {
        //     vendorStatus = "Empanelled";
        //   }
        // }
        var vendorStatus = "Empanelled";
        // if (vendorStatus == "Empanelled") {
        await Vendor.update({
          status: vendorStatus,
          verified: 1,
          verifiedOn: new Date(),
          verifiedBy: username
        }, { where: { id: item.vendorId } });
        // }
      }

      log.write("PurchaseService ::: saveVendorBankAccount :: account : ", item.toJSON());
      if (item.active && item.verified) {
        var bankAccount = await VendorBankAccount.findOne({
          where: { id: item.id },
          include: [{ as: 'vendor', model: Vendor, include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }] }]
        });
        log.write("PurchaseService ::: saveVendorBankAccount :: bankAccount : ", bankAccount.toJSON());
        if (bankAccount && bankAccount.vendor && bankAccount.vendor.contact) {
          var benificiary = await PayoutBenificiary.findOne({ where: { accountNumber: bankAccount.accountNumber, active: 1 } });
          if (!benificiary) {
            var accountData = {
              id: bankAccount.id,
              accountNumber: bankAccount.accountNumber,
              ifscCode: bankAccount.ifscCode,
              name: bankAccount.benificiaryName,
              email: bankAccount.vendor.contact.email,
              phone: bankAccount.vendor.contact.phone,
              address: bankAccount.vendor.address,
            }
            benificiary = await services.addCashFreeBenificiaryForRefund(accountData, bankAccount.vendor.companyId);
          }
        } else {
          throw ("Bank Account not found for this Vendor to approve payment")
        }
      }
    } else {
      data.date = new Date();
      item = await VendorBankAccount.create(data);

      var company = await systemUtils.getCompany(data.companyId);
      var linkData = {
        bankAccountId: item.id,
      }
      var selfCareLink;
      var msg, subject;
      if (data.accountNumber) {
        selfCareLink = await systemUtils.createSelfCareLink("VendorBankAccountVerification", "vendor-bankaccount-verification", linkData, data.companyId);
        msg = " We request you to verify your bank account details at this link to use for all future transactions. <a href='" + selfCareLink.url + "'> Click here to Verify</a>";
        subject = company.name + " :: Requesting to Verify Bank Account";
      } else {
        selfCareLink = await systemUtils.createSelfCareLink("VendorBankAccountRequest", "vendor-bankaccount-request", linkData, data.companyId);
        msg = " We request you to add your bank account details at this link to use for all future transactions. <a href='" + selfCareLink.url + "'> Click here to Verify</a>";
        subject = company.name + " :: Requesting to Add Bank Account";
      }

      var vendor = await Vendor.findOne({
        where: { id: data.vendorId },
        include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }]
      });

      var mailData = {
        name: vendor.contact.name,
        msg: msg,
        supportPhone: company.supportPhone,
        supportEmail: company.supportEmail,
        teamName: "Team " + company.name,
      }
      log.write("PurchaseService ::: saveVendor :: mailData : ", mailData);

      var mailBody = await services.getMailBody("emails/context_notification.html", mailData);
      log.write("PurchaseService ::: saveVendor :: mailBody : ", mailBody.length);
      var receivers = [];
      receivers.push({
        name: vendor.contact.name,
        email: vendor.contact.email,
      });
      await services.sendMail(subject, mailBody, receivers);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveVendorBankAccount :: exception : ", e);
    throw (e);
  }
}

service.listVendorPayments = async (data) => {
  try {
    log.write("PurchaseService ::: listVendorPayments :: data : ", data);
    var where = {
      status: { $in: ['Draft', 'Completed', 'Confirmed', 'Approved', 'Paid'] },
      '$purchaseOrder.status$': { $in: ['Raised', 'Closed', 'Started', 'New', 'Approved', 'Paid'] }
    }
    if (data.filters.vendorId && data.filters.vendorId != '') {
      where['$purchaseOrder.vendorId$'] = data.filters.vendorId
    }
    var orderBy = [
      ['paidOn', 'desc']
    ];
    if (data.sortBy) {
      if (data.sortBy.split(".").length) {
        orderBy = [
          [Sequelize.literal(data.sortBy), data.sortOrder]
        ];
      } else {
        orderBy = [
          [data.sortBy, data.sortOrder]
        ];
      }
    }
    var results = await PurchaseOrderMilestone.findAll({
      where: where,
      attributes: ['amount', 'name', 'status', 'paidOn', 'expectedDate', 'actualDate'],
      include: [{
        as: 'purchaseOrder',
        model: PurchaseOrder,
        attributes: ['refNo', 'id'],
        include: [
          { as: 'project', model: Project, attributes: ['title'] },
          { as: 'building', model: Building, attributes: ['name'] }
        ]
      }],
      order: orderBy,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("PurchaseService ::: listVendorPayments :: VendorPaymentTerms count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listVendorPayments :: exception : ", e);
    throw (e);
  }
}

service.listVendorPaymentTerms = async (data) => {
  try {
    log.write("PurchaseService ::: listVendorPaymentTerms :: data : ", data);
    var where = {};
    if (data.filters.active && data.filters.active != '') {
      where['active'] = data.filters.active
    }
    if (data.filters.vendorId && data.filters.vendorId != '') {
      where['vendorId'] = data.filters.vendorId
    }
    var results = await VendorPaymentTerm.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("PurchaseService ::: listVendorPaymentTerms :: VendorPaymentTerms count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listVendorPaymentTerms :: exception : ", e);
    throw (e);
  }
}
service.saveVendorPaymentTerm = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveVendorPaymentTerm :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    data.tagName = "(OA" + data.onAdvance + " - OD" + data.onDelivery + " - IP" + data.inProgress + " - OF" + data.onFinish + " - AF" + data.afterFinish + ")";
    if (data.id) {
      await VendorPaymentTerm.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await VendorPaymentTerm.create(data);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveVendorPaymentTerm :: exception : ", e);
    throw (e);
  }
}

service.updateVendorSkuLastPrice = async (data, username) => {
  try {
    log.write("PurchaseService ::: updateVendorSkuLastPrice :: data : ", data);
    var item = {};
    data.date = new Date();
    data.updated = new Date();
    data.updatedBy = username;

    await VendorSku.update({ active: 0, status: 'Archived' }, { where: { skuId: data.skuId, vendorId: data.vendorId } });

    data.minPrice = data.price;
    data.maxPrice = data.price;
    data.status = 'Accepted';
    data.active = 1;
    item = await VendorSku.create(data)

    return item;
  } catch (e) {
    log.write("PurchaseService ::: updateVendorSkuLastPrice :: exception : ", e);
    throw (e);
  }
}
service.listVendorSkus = async (data) => {
  try {
    log.write("PurchaseService ::: listVendorSkus :: data : ", data);
    var where = {
      // '$vendor.status$': 'Empanelled',
      // '$vendor.active$': 1,
    };
    if (data.filters.active && data.filters.active != '') {
      where['active'] = data.filters.active
    }
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status
    } else {
      where['status'] = { $ne: 'Archived' };
    }
    if (data.filters.vendorId && data.filters.vendorId != '') {
      where['vendorId'] = data.filters.vendorId
    }
    var opexCatWhere = {};
    if (data.filters.office) {
      opexCatWhere.office = 1;
    } else {
      opexCatWhere.office = 0;
    }
    var include = ['vendor']
    if (data.filters.skus) {
      where['skuId'] = { $ne: null };
      include.push({ as: 'sku', model: Sku, include: ['category', 'type'], required: false });
      include.push({ as: 'pricings', model: VendorSkuPricing, include: ['paymentTerm'], required: false });
    }
    if (data.filters.opexTypes) {
      where['opexTypeId'] = { $ne: null };
      include.push({
        as: 'opexType',
        model: OpexType,
        include: [{ as: 'type', model: OpexType, include: [{ as: 'category', model: OpexCategory, where: opexCatWhere, required: false }] },
          { as: 'category', model: OpexCategory, where: opexCatWhere, required: false }
        ],
        required: false
      })
    }
    log.write("PurchaseService ::: listVendorSkus :: where : ", JSON.stringify(where, null, 2));
    log.write("PurchaseService ::: listVendorSkus :: include : ", JSON.stringify(include, null, 2));
    var skus = await VendorSku.findAll({
      where: where,
      include: include,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("PurchaseService ::: listVendorSkus :: VendorSkus count : " + skus.length);
    var results = [];
    _.each(skus, function(s) {
      log.write("PurchaseService ::: listVendorSkus :: VendorSkus : ", s.toJSON());
      var r = {
        minPrice: s.minPrice,
        maxPrice: s.maxPrice,
        active: s.active,
        status: s.status,
        date: s.date,
      }
      if (s.sku) {
        r.category = s.sku.category.name;
        r.type = s.sku.type.name;
        r.sku = s.sku.name;
      } else if (s.opexType) {
        if (s.opexType.category) {
          r.category = s.opexType.category.name;
        } else if (s.opexType.type && s.opexType.type.category) {
          r.category = s.opexType.type.category.name;
        }
        if (s.opexType.type) {
          r.sku = s.opexType ? s.opexType.name : null;
          r.type = s.opexType && s.opexType.type ? s.opexType.type.name : null;
        } else {
          r.type = s.opexType ? s.opexType.name : null;
        }
      }
      if (r.category) {
        results.push(r);
      }
    })
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listVendorSkus :: exception : ", e);
    throw (e);
  }
}
service.saveVendorSku = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveVendorSku :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.accepted || data.rejected) {
      data.active = data.accepted ? 1 : 0;
      await VendorSku.update(data, { where: { id: data.id } });

      item = await VendorSku.findOne({
        where: { id: data.id },
        include: [{ as: 'vendor', model: Vendor, include: ['skus', 'bankAccounts'] }]
      });
      if (item.vendor.verified && item.vendor.status == "New") {
        var vendorStatus = "New";
        if (item.vendor.skus.length && item.vendor.bankAccounts.length) {
          var acceptedSkus = _.filter(item.vendor.skus, { status: "Accepted" });
          var verifiedBanks = _.filter(item.vendor.bankAccounts, { verified: 1 });
          if (acceptedSkus.length && verifiedBanks.length) {
            vendorStatus = "Empanelled";
          }
        } else if (item.vendor.skus.length && item.vendor.paymentMode != 'BankTransfer') {
          vendorStatus = "Empanelled";
        }
        if (vendorStatus == "Empanelled") {
          await Vendor.update({
            status: vendorStatus
          }, { where: { id: item.vendorId } });
        }
      }
      return data;
    } else if (data.id) {
      if (data.active) {
        var vendorSku = await VendorSku.findOne({ where: { id: data.id } });
        if (!vendorSku.active && data.active) {
          await VendorSku.update({ active: 1 }, { where: { id: data.id } });
        } else {
          await VendorSku.update({ status: "Archived", active: 0 }, { where: { id: data.id } });
          delete data.id;
        }
      } else {
        await VendorSku.update(data, { where: { id: data.id } });
        return data;
      }
    }

    data.status = data.status || "Draft";
    data.date = data.date || new Date();
    item = await VendorSku.create(data);
    if (data.pricings && data.pricings.length) {
      for (var i = 0; i < data.pricings.length; i++) {
        var p = data.pricings[i];
        p.vendorSkuId = item.id;
        delete p.id;
        await VendorSkuPricing.create(p);
      }
    }

    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveVendorSku :: exception : ", e);
    throw (e);
  }
}
service.sendVendorSKUsPricingMail = async (data) => {
  try {
    var company = await systemUtils.getCompany(data.companyId);
    var linkData = {
      // vendorSkuId: item.id,
      vendorId: data.vendorId
    }
    var selfCareLink;
    var msg, subject;
    selfCareLink = await systemUtils.createSelfCareLink("VendorSKUVerification", "vendor-sku-verification", linkData, data.companyId);

    msg = " We got list of SKU items which you can provide us for our future projects." +
      " We request you to verify your pricings for each item you provide at this link to use for our future purchase orders. <a href='" + selfCareLink.url + "'> Click here to Verify</a>";
    subject = company.name + " :: Requesting to verify SKU items and pricings";

    var vendor = await Vendor.findOne({
      where: { id: data.vendorId },
      include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }]
    });

    // var sku = await Sku.findOne({
    //   where: { id: data.skuId },
    //   attributes: ['name'],
    //   include: [{ as: 'category', model: SkuCategory, attributes: ['name'] },
    //     { as: 'type', model: SkuType, attributes: ['name'] }
    //   ]
    // });
    // sku = sku.toJSON();
    // var paymentTerms = _(data.pricings)
    //   .groupBy(x => x.paymentTermId)
    //   .map((value, key) => ({ paymentTermId: key, pricings: value }))
    //   .value();
    // sku.paymentTerms = paymentTerms;
    // for (var i = 0; i < sku.paymentTerms.length; i++) {
    //   var term = sku.paymentTerms[i];
    //   var paymentTerm = await VendorPaymentTerm.findOne({ id: term.paymentTermId });
    //   sku.paymentTerms[i].paymentTerm = paymentTerm;
    // }
    // log.write("PurchaseService ::: saveVendorSku :: sku : ", JSON.stringify(sku, null, 2));
    var mailData = {
      name: vendor.contact.name,
      msg: msg,
      supportPhone: company.supportPhone,
      supportEmail: company.supportEmail,
      teamName: "Team " + company.name,
    }
    log.write("PurchaseService ::: saveVendorSku :: mailData : ", mailData);

    var mailBody = await services.getMailBody("emails/context_notification.html", mailData);
    log.write("PurchaseService ::: saveVendorSku :: mailBody : ", mailBody.length);
    var receivers = [];
    receivers.push({
      name: vendor.contact.name,
      email: vendor.contact.email,
    });
    await services.sendMail(subject, mailBody, receivers);

  } catch (e) {
    log.write("PurchaseService ::: saveVendorSku :: exception : ", e);
    throw (e);
  }
}

service.listWorkOrders = async (data) => {
  try {
    log.write("PurchaseService ::: listWorkOrders :: data : ", data);
    var where = {};
    if (data.filters.search && data.filters.search != '') {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('vendor.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status
    }
    if (data.filters.statuses && data.filters.statuses.length) {
      where['status'] = { $in: data.filters.statuses };
    }
    if (data.filters.vendorId && data.filters.vendorId != '') {
      where['vendorId'] = data.filters.vendorId
    }
    if (data.filters.projectId && data.filters.projectId != '') {
      where['projectId'] = data.filters.projectId
    }
    if (data.filters.buildingId && data.filters.buildingId != '') {
      where['buildingId'] = data.filters.buildingId
    }
    if (data.companyId) {
      where.companyId = data.companyId;
    }
    if (data.filters.isOpex) {
      where.isOpex = 1;
    } else {
      where.isOpex = 0;
    }
    var orderBy = [
      ['id', 'desc']
    ];
    if (data.sortBy) {
      if (data.sortBy.split(".").length) {
        orderBy = [
          [Sequelize.literal(data.sortBy), data.sortOrder]
        ];
      } else {
        orderBy = [
          [data.sortBy, data.sortOrder]
        ];
      }
    }
    var results = await WorkOrder.findAll({
      include: [{ as: 'vendor', model: Vendor, attributes: ['name'] },
        { as: 'building', model: Building, attributes: ['name'] },
        { as: 'project', model: Project, attributes: ['title'] },
      ],
      where: where,
      offset: data.offset,
      limit: data.limit,
      order: orderBy
    });
    log.write("PurchaseService ::: listWorkOrders :: WorkOrders count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listWorkOrders :: exception : ", e);
    throw (e);
  }
}
service.saveWorkOrder = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveWorkOrder :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await WorkOrder.update(data, { where: { id: data.id } });
      item = data;
    } else {
      var executive = await systemUtils.getUser(username);
      if (executive) {
        data.executive = executive.id;
      }
      item = await WorkOrder.create(data);

      systemUtils.addActivity({
        activity: 'NewWorkOrder',
        update: (data.update || "New WorkOrder is raised by " + executive.name),
        companyId: data.companyId
      }, username);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveWorkOrder :: exception : ", e);
    throw (e);
  }
}
service.getWorkOrder = async (id) => {
  try {
    log.write("PurchaseService ::: getWorkOrder :: id : ", id);
    var workOrder = await WorkOrder.findOne({
      where: { id: id },
      include: ['paymentTerm', 'deliveryStore', {
          as: 'vendor',
          model: Vendor,
          include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }]
        },
        { as: 'project', model: Project, attributes: ['title'] },
        { as: 'building', model: Building, attributes: ['id', 'name', 'locationId', 'address'] },
        { as: 'purchaseOrder', model: PurchaseOrder, attributes: ['id', 'pdfId'] }
      ]
    });
    if (workOrder) {
      workOrder = workOrder.toJSON();
      if (workOrder.purchaseOrder && workOrder.purchaseOrder.pdfId) {
        workOrder.purchaseOrder.pdf = await systemUtils.getFile(workOrder.purchaseOrder.pdfId);
      }
      workOrder.building.location = await systemUtils.getLocation(workOrder.building.locationId);
    }
    return workOrder;
  } catch (e) {
    log.write("PurchaseService ::: getWorkOrder :: exception : ", e);
    throw (e);
  }
}
service.prepareRepeatPO = async (id) => {
  try {
    log.write("PurchaseService ::: prepareRepeatPO :: id : ", id);
    var workOrder = await WorkOrder.findOne({
      where: { id: id },
      include: [{
        as: 'vendor',
        model: Vendor,
        attributes: ['id', 'name']
      }, {
        as: 'paymentTerm',
        model: VendorPaymentTerm
      }, {
        as: 'items',
        model: WorkItem,
        attributes: ['skuId', 'units', 'unitPrice'],
        include: [{
          as: 'sku',
          model: Sku,
          attributes: ['name', 'gst', 'description'],
          include: ['category', 'type']
        }]
      }]
    });
    return workOrder;
  } catch (e) {
    log.write("PurchaseService ::: prepareRepeatPO :: exception : ", e);
    throw (e);
  }
}
service.prepareEditPO = async (id) => {
  try {
    log.write("PurchaseService ::: prepareEditPO :: id : ", id);
    var purchaseOrder = await PurchaseOrder.findOne({
      where: { id: id },
      include: [{
        as: 'items',
        model: PurchaseItem,
        where: { status: 'Ordered' },
        attributes: ['skuId', 'units', 'unitPrice', 'amount', 'taxableAmount'],
        include: [{
          as: 'sku',
          model: Sku,
          attributes: ['name', 'gst', 'description'],
          include: ['category', 'type']
        }]
      }]
    });
    return purchaseOrder;
  } catch (e) {
    log.write("PurchaseService ::: prepareEditPO :: exception : ", e);
    throw (e);
  }
}

service.listVendorProjects = async (data) => {
  try {
    log.write("PurchaseService ::: listVendorProjects :: data : ", data);
    var where = {};
    if (data.filters.search && data.filters.search != '') {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('building.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('office.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`booking->client`.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`booking->client`.company')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('vendor_projects.refNo')), {
        $like: query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status
    }
    if (data.filters.statuses && data.filters.statuses.length) {
      where['status'] = { $in: data.filters.statuses };
    }
    if (data.filters.buildingId && data.filters.buildingId != '') {
      where['buildingId'] = data.filters.buildingId
    }
    if (data.filters.buildingIds && data.filters.buildingIds != '') {
      where['buildingId'] = { $in: data.filters.buildingIds }
    }
    if (data.companyId) {
      where.companyId = data.companyId;
    }
    var results = await Project.findAll({
      include: [{ as: 'office', model: Office, attributes: ['name'] },
        { as: 'building', model: Building, attributes: ['name'] },
        {
          as: 'booking',
          model: Booking,
          attributes: ['refNo'],
          include: [{ as: 'client', model: Client, attributes: ['id', 'name', 'company'] }]
        },
      ],
      where: where,
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'desc']
      ]
    });
    log.write("PurchaseService ::: listVendorProjects :: VendorProjects count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listVendorProjects :: exception : ", e);
    throw (e);
  }
}
service.saveVendorProject = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveVendorProject :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await Project.update(data, { where: { id: data.id } });
      item = data;
    } else {
      data.date = new Date();
      data.proposedBy = username;
      var proposedUserId = await systemUtils.getUser(username);
      if (proposedUserId) {
        data.proposedUserId = proposedUserId.id;
      }
      data.status = "Draft";
      item = await Project.create(data);
      item.set('refNo', "PROJ-HH-" + (100000 + item.id));
      item.save();

      systemUtils.addActivity({
        activity: 'NewVendorProject',
        update: (data.update || "New VendorProject is raised by " + proposedUserId.name),
        companyId: data.companyId
      }, username);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveVendorProject :: exception : ", e);
    throw (e);
  }
}
service.getVendorProject = async (id) => {
  try {
    log.write("PurchaseService ::: getVendorProject :: id : ", id);
    var vendorProject = await Project.findOne({
      where: { id: id },
      include: [{
          as: 'booking',
          model: Booking,
          attributes: ['id', 'refNo', 'started'],
          include: [{ as: 'client', model: Client, attributes: ['id', 'name', 'company'] }]
        },
        { as: 'office', model: Office, attributes: ['id', 'name'] },
        { as: 'building', model: Building, attributes: ['id', 'name', 'locationId'] }
      ]
    });
    if (vendorProject) {
      vendorProject = vendorProject.toJSON();
      vendorProject.building.location = await systemUtils.getLocation(vendorProject.building.locationId);

      vendorProject.currentPos = await PurchaseOrder.findAll({
        where: { projectId: id, status: 'Started' },
        attributes: ['refNo', 'paidAmount', 'amount'],
        include: [{ as: 'vendor', model: Vendor, attributes: ['name'] }]
      })

      var milestones = await PurchaseOrderMilestone.findAll({
        where: {
          '$purchaseOrder.projectId$': id,
          '$purchaseOrder.status$': { $in: ['Raised', 'Started'] },
          status: { $in: ['Draft', 'Approved', 'Completed', 'Confirmed'] }
        },
        attributes: ['name', 'amount', 'status', 'actualDate', 'expectedDate'],
        include: [{ as: 'purchaseOrder', model: PurchaseOrder, include: [{ as: 'vendor', model: Vendor, attributes: ['name'] }] }]
      })
      vendorProject.dueMilestones = _.filter(milestones, function(m) {
        var dueDate = m.actualDate || m.expectedDate;
        if (dueDate) {
          return utils.moment(dueDate).isBefore(utils.moment());
        }
        return false;
      })
      vendorProject.upcomingMilestones = _.filter(milestones, function(m) {
        var dueDate = m.actualDate || m.expectedDate;
        if (dueDate) {
          return utils.moment(dueDate).isAfter(utils.moment());
        }
        return true;
      })
    }
    return vendorProject;
  } catch (e) {
    log.write("PurchaseService ::: getVendorProject :: exception : ", e);
    throw (e);
  }
}

service.listWorkItems = async (data) => {
  try {
    log.write("PurchaseService ::: listWorkItems :: data : ", data);
    var where = {};
    if (data.filters.statuses && data.filters.statuses.length) {
      where['status'] = { $in: data.filters.statuses }
    }
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status;
    }
    if (data.filters.workOrderId && data.filters.workOrderId != '') {
      where['workOrderId'] = data.filters.workOrderId
    }
    var results = await WorkItem.findAll({
      include: [{ as: 'sku', model: Sku, include: ['category', 'type'] }],
      where: where
    });
    log.write("PurchaseService ::: listWorkItems :: WorkItems count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listWorkItems :: exception : ", e);
    throw (e);
  }
}
service.saveWorkItem = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveWorkItem :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await WorkItem.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await WorkItem.create(data);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveWorkOrder :: exception : ", e);
    throw (e);
  }
}

service.savePurchaseItem = async (data, username) => {
  try {
    log.write("PurchaseService ::: savePurchaseItem :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await PurchaseItem.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await PurchaseItem.create(data);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: savePurchaseItem :: exception : ", e);
    throw (e);
  }
}
service.deletePurchaseItem = async (data, username) => {
  try {
    log.write("PurchaseService ::: deletePurchaseItem :: id : " + data.id);
    return await PurchaseItem.destroy({ where: { id: data.id } });
  } catch (e) {
    log.write("PurchaseService ::: deletePurchaseItem :: exception : ", e);
    throw (e);
  }
}
service.listPurchaseOrders = async (data) => {
  try {
    log.write("PurchaseService ::: listPurchaseOrders :: data : ", data);
    var where = {};
    if (data.filters.search && data.filters.search != '') {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('vendor.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('building.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('vendor.gst')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`vendor_purchase_orders`.`refNo`')), {
        $like: query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    if (data.filters.dateFrom && data.filters.dateTo) {
      where['date'] = { $between: [utils.moment(data.filters.dateFrom).toDate(), utils.moment(data.filters.dateTo).toDate()] }
    }
    if (data.filters.statuses && data.filters.statuses.length) {
      where['status'] = { $in: data.filters.statuses };
    }
    if (data.filters.active && data.filters.active != '') {
      where['active'] = data.filters.active
    }
    if (data.filters.vendorId && data.filters.vendorId != '') {
      where['vendorId'] = data.filters.vendorId
    }
    if (data.filters.projectId && data.filters.projectId != '') {
      where['projectId'] = data.filters.projectId
    }
    if (data.filters.awaitingAdvancePayment) {
      where['hasAdvancePayment'] = 1;
      where['paidAmount'] = 0;
    }
    if (data.filters.inDue) {
      where['dueAmount'] = { $gt: 0 };
    }
    if (data.filters.buildingId && data.filters.buildingId != '') {
      where['buildingId'] = data.filters.buildingId
    } else if (data.filters.isHq) {
      where['buildingId'] = 1;
    } else {
      where['buildingId'] = { $gt: 0 };
    }
    if (data.companyId) {
      where.companyId = data.companyId;
    }
    data.filters.isOpex = parseInt(data.filters.isOpex);

    //-----temporarily commented on 02-01-2024 -------//
    // if (data.filters.isOpex) {
    //   where.isOpex = 1;
    // } else {
    //   where.isOpex = 0;
    // }

    var include = [{ as: 'vendor', model: Vendor, attributes: ['name'], required: false },
      { as: 'building', model: Building, attributes: ['name'], required: false },
      { as: 'project', model: Project, attributes: ['title'], required: false },
    ]

    //-----temporarily commented on 02-01-2024 -------//
    // if (data.filters.isBill) {
    //   where.isBill = 1;
    //   include.push({ as: 'milestone', required: false, model: PurchaseOrderMilestone, attributes: ['id', 'paidOn', 'actualDate', 'approvedBy'] })
    // } else {
    //   where.isBill = 0;
    // }

    
    var orderBy = [
      ['id', 'desc']
    ];
    if (data.sortBy) {
      if (data.sortBy.split(".").length) {
        orderBy = [
          [Sequelize.literal(data.sortBy), data.sortOrder]
        ];
      } else {
        orderBy = [
          [data.sortBy, data.sortOrder]
        ];
      }
    }
    log.write("PurchaseService ::: listPurchaseOrders :: PurchaseOrders where : ", JSON.stringify(where, null, 2));
    var results = await PurchaseOrder.findAll({
      where: where,
      include: include,
      offset: data.offset,
      limit: data.limit,
      order: orderBy
    });
    log.write("PurchaseService ::: listPurchaseOrders :: PurchaseOrders count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listPurchaseOrders :: exception : ", e);
    throw (e);
  }
}
service.savePurchaseOrder = async (data, username) => {
  try {
    log.write("PurchaseService ::: savePurchaseOrder :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await PurchaseOrder.update(data, { where: { id: data.id } })
      item = data;
    } else {
      data.date = utils.moment(data.date).format("YYYY-MM-DD");
      item = await PurchaseOrder.create(data);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: savePurchaseOrder :: exception : ", e);
    throw (e);
  }
}
service.updatePurchaseOrdersLedger = async () => {
  try {
    var pos = await PurchaseOrder.findAll({
      attributes: ['id'],
      where: { status: { $in: ['Approved', 'Paid', 'Closed', 'Raised', 'Started'] } }
    });
    log.write("PurchaseService ::: updatePurchaseOrdersLedger :: pos count : ", pos.length);
    for (var i = 0; i < pos.length; i++) {
      await service.updatePurchaseOrderLedger(pos[i].id);
    }

    var projects = await Project.findAll({
      attributes: ['id'],
      where: { status: { $in: ['Draft', 'InProgress'] } }
    });
    log.write("PurchaseService ::: updatePurchaseOrdersLedger :: projects count : ", projects.length);
    for (var i = 0; i < projects.length; i++) {
      await service.updateProjectLedger(projects[i].id);
    }
    return pos;
  } catch (e) {
    log.write("PurchaseService ::: updatePurchaseOrdersLedger :: exception : ", e);
    throw (e);
  }
}
service.updatePurchaseOrderLedger = async (id) => {
  try {
    var mileStones = await PurchaseOrderMilestone.findAll({
      where: { purchaseOrderId: id, status: { in: ['Draft', 'Completed', 'Confirmed', 'Approved', 'Paid'] } }
    });

    var amount = _.sumBy(mileStones, 'amount');
    var draftAmount = _.sumBy(_.filter(mileStones, { status: 'Draft' }), 'amount');
    var releasedAmount = _.sumBy(_.filter(mileStones, { status: 'Completed' }), 'amount');
    var confirmedAmount = _.sumBy(_.filter(mileStones, { status: 'Confirmed' }), 'amount');
    var approvedAmount = _.sumBy(_.filter(mileStones, { status: 'Approved' }), 'amount');
    var paidAmount = _.sumBy(_.filter(mileStones, { status: 'Paid' }), 'amount');
    var dueMilestones = _.filter(mileStones, function(m) {
      var dueDate = m.actualDate || m.expectedDate;
      if (dueDate) {
        return utils.moment(dueDate).isBefore(utils.moment());
      }
      return false;
    })
    _.each(dueMilestones, function(m) {
      if (m.status == 'Draft') {
        m.set('status', 'Completed');
        m.save();
      }
    })
    var dueAmount = _.sumBy(dueMilestones, 'amount');

    var update = {
      amount: amount,
      draftAmount: draftAmount,
      releasedAmount: releasedAmount,
      approvedAmount: approvedAmount,
      paidAmount: paidAmount,
      dueAmount: dueAmount,
    }
    log.write("PurchaseService ::: updatePurchaseOrderLedger :: update for  " + id, update);
    await PurchaseOrder.update(update, { where: { id: id } });

  } catch (e) {
    log.write("PurchaseService ::: updatePurchaseOrderLedger :: exception : ", e);
    throw (e);
  }
}
service.updateProjectLedger = async (id) => {
  try {
    var pos = await PurchaseOrder.findAll({
      where: { projectId: id, status: { in: ['Raised', 'Approved', 'Paid', 'Started', 'Closed'] } }
    });
    var amount = _.sumBy(pos, 'amount');
    var draftAmount = _.sumBy(pos, 'draftAmount');
    var releasedAmount = _.sumBy(pos, 'releasedAmount');
    var approvedAmount = _.sumBy(pos, 'approvedAmount');
    var paidAmount = _.sumBy(pos, 'paidAmount');
    var dueAmount = _.sumBy(pos, 'dueAmount');

    var update = {
      budgetAmount: amount,
      draftAmount: draftAmount,
      releasedAmount: releasedAmount,
      approvedAmount: approvedAmount,
      paidAmount: paidAmount,
      dueAmount: dueAmount,
    }
    log.write("PurchaseService ::: updateProjectLedger :: update for  " + id, update);
    await Project.update(update, { where: { id: id } });

  } catch (e) {
    log.write("PurchaseService ::: updateProjectLedger :: exception : ", e);
    throw (e);
  }
}


service.listPurchaseItems = async (data) => {
  try {
    log.write("PurchaseService ::: listPurchaseItems :: data : ", data);
    var where = {};
    if (data.filters.active && data.filters.active != '') {
      where['active'] = data.filters.active
    }
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status
    }
    if (data.filters.delivered && data.filters.delivered != '') {
      where['delivered'] = 1;
    }
    if (data.filters.notDelivered && data.filters.notDelivered != '') {
      where['delivered'] = { $ne: 1 };
    }
    if (data.filters.vendorId && data.filters.vendorId != '') {
      where['vendorId'] = data.filters.vendorId
    }
    if (data.filters.purchaseOrderId && data.filters.purchaseOrderId != '') {
      where['purchaseOrderId'] = data.filters.purchaseOrderId
    }
    var include = ['paymentTerm', { as: 'sku', model: Sku, include: ['category', 'type'] },
      {
        as: 'opexType',
        model: OpexType,
        include: [{ as: 'type', model: OpexType, include: [{ as: 'category', model: OpexCategory, required: false }] },
          { as: 'category', model: OpexCategory, required: false }
        ],
        required: false
      },
      { as: 'deliveries', model: PurchaseItemDelivery, required: false, attributes: ['quantity', 'receivedBy', 'deliveredOn'] }
    ]
    if (data.filters.projectId && data.filters.projectId != '') {
      include = [
        { as: 'sku', model: Sku, include: ['category', 'type'], where: { isAsset: 1 } },
        {
          as: 'opexType',
          model: OpexType,
          include: [{ as: 'type', model: OpexType, include: [{ as: 'category', model: OpexCategory, required: false }] },
            { as: 'category', model: OpexCategory, required: false }
          ],
          required: false
        },
        { as: 'deliveries', model: PurchaseItemDelivery, required: false, attributes: ['quantity', 'receivedBy', 'deliveredOn'] },
        { as: 'purchaseOrder', model: PurchaseOrder, attributes: ['projectId', 'vendorId'], where: { projectId: data.filters.projectId } }
      ]
    }
    log.write("PurchaseService ::: listPurchaseItems :: where : ", where);
    var results = await PurchaseItem.findAll({
      where: where,
      include: include,
      offset: data.offset,
      limit: data.limit,
    });
    var items = [];
    _.each(results, function(i) {
      var item = i.toJSON();
      // log.write("PurchaseService ::: listPurchaseItems :: item : ", item);
      if (item.sku) {
        item.isAsset = item.sku.isAsset;
        items.push(item);
      } else if (item.opexType) {
        item.sku = {
          category: item.opexType.category,
          type: { name: item.opexType.name },
        }
        if (item.opexType.type) {
          item.sku = {
            category: item.opexType.type.category,
            type: { name: item.opexType.type.name },
            item: { name: item.opexType.name },
          }
        }
        items.push(item);
      } else if (item.amount) {
        item.sku = {
          category: { name: "NonAsset" },
          type: { name: "Purchases" },
          name: "NonAsset Purchase",
        }
        items.push(item);
      }
    })
    log.write("PurchaseService ::: listPurchaseItems :: PurchaseItems count : " + items.length);
    return items;
  } catch (e) {
    log.write("PurchaseService ::: listPurchaseItems :: exception : ", e);
    throw (e);
  }
}
service.savePurchaseItem = async (data, username) => {
  try {
    log.write("PurchaseService ::: savePurchaseItem :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await PurchaseItem.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await PurchaseItem.create(data);
    }
    service.updatePurchaseOrderLedger(data.purchaseOrderId);
    return item;
  } catch (e) {
    log.write("PurchaseService ::: savePurchaseItem :: exception : ", e);
    throw (e);
  }
}

service.listPurchaseStatusImages = async (data) => {
  try {
    log.write("PurchaseService ::: listPurchaseStatusImages :: data : ", data);
    var where = {};
    if (data.filters.vendorPurchaseItemStatusId && data.filters.vendorPurchaseItemStatusId != '') {
      where['vendorPurchaseItemStatusId'] = data.filters.vendorPurchaseItemStatusId
    }
    var results = await PurchaseItemStatusImage.findAll({
      where: where,
      include: ['image']
    });
    log.write("PurchaseService ::: listPurchaseStatusImages :: PurchaseItemStatuss count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listPurchaseStatusImages :: exception : ", e);
    throw (e);
  }
}
service.listPurchaseItemStatuses = async (data) => {
  try {
    log.write("PurchaseService ::: listPurchaseItemStatuses :: data : ", data);
    var where = {};
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status
    }
    if (data.filters.purchaseItemId && data.filters.purchaseItemId != '') {
      where['purchaseItemId'] = data.filters.purchaseItemId
    }
    var results = await PurchaseItemStatus.findAll({
      where: where,
      include: ['images', 'mileStone'],
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'desc']
      ]
    });
    log.write("PurchaseService ::: listPurchaseItemStatuses :: PurchaseItemStatuss count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listPurchaseItemStatuses :: exception : ", e);
    throw (e);
  }
}
service.savePurchaseItemStatus = async (data, username) => {
  try {
    log.write("PurchaseService ::: savePurchaseItemStatus :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await PurchaseItemStatus.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await PurchaseItemStatus.create(data);
      if (data.mileStoneId) {
        await PurchaseOrderMilestone.update({
          status: 'Completed',
          releasedBy: username,
          releasedOn: new Date(),
          actualDate: new Date()
        }, { where: { id: data.mileStoneId } });
        systemUtils.addActivity({
          activity: 'PaymentReleaseRequested',
          update: (data.update || "MilestonePayment is requested by '" + username + "'"),
          companyId: data.companyId
        }, username);
      }
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: savePurchaseItemStatus :: exception : ", e);
    throw (e);
  }
}
service.savePurchaseItemDelivery = async (data, username) => {
  try {
    log.write("APIService ::: savePurchaseItemDelivery :: data : ", data);
    data.receivedBy = username;
    data.deliveredOn = new Date();
    var delivery = await PurchaseItemDelivery.create(data);
    if (data.delivered) {
      await PurchaseItem.update({ delivered: 1 }, { where: { id: data.purchaseItemId } });
    }
    if (data.mileStoneId) {
      await PurchaseOrderMilestone.update({
        status: 'Completed',
        releasedBy: username,
        releasedOn: new Date()
      }, { where: { id: data.mileStoneId } });
      systemUtils.addActivity({
        activity: 'PaymentReleaseRequested',
        update: (data.update || "MilestonePayment is requested by '" + username + "'"),
        companyId: data.companyId
      }, username);
    }

    data.purchaseItemDeliveryId = delivery.id;
    data.updated = new Date();
    data.date = new Date();
    data.updatedBy = username;
    var assets = await Asset.create(data);
    assets = assets.toJSON();
    var items = [];
    for (var i = 0; i < data.count; i++) {
      var seqNo = await systemUtils.getRefNo("AssetItem", null, null, data.companyId);
      var tagNo = assets.code + "/" + utils.moment().format("YY") + "/" + (seqNo + "").padStart(6, '0');
      var item = {
        assetId: assets.id,
        tagNo: tagNo,
        status: 'New',
        updated: new Date(),
        updatedBy: username
      }
      item = await AssetItem.create(item);
      item = item.toJSON();

      var movement = {
        assetItemId: item.id,
        purpose: "ToBuilding",
        approvedBy: username,
        buildingId: data.buildingId,
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

    return delivery;
  } catch (e) {
    log.write("APIService ::: savePurchaseItemDelivery :: exception : ", e);
    throw (e);
  }
}

service.listVendorPendingMilestones = async (data) => {
  try {
    log.write("PurchaseService ::: listVendorPendingMilestones :: data : ", data);
    var where = { vendorId: data.vendorId, status: { $in: ['Raised', 'Started'] } };
    var results = await PurchaseOrder.findAll({
      where: where,
      attributes: ['id', 'refNo', 'status', 'amount', 'date', 'paidAmount', 'releasedAmount', 'approvedAmount', 'draftAmount', 'dueAmount'],
      include: [{
        as: 'project',
        model: Project,
        attributes: ['id', 'title'],
      }, {
        as: 'milestones',
        model: PurchaseOrderMilestone,
        attributes: ['id', 'name', 'amount', 'status', 'approvedOn', 'expectedDate', 'actualDate'],
        where: { status: { $in: ['Draft', 'Completed', 'Confirmed'] } },
        include: [{
          as: 'milestones',
          model: PurchaseOrderMilestone,
          attributes: ['id', 'name', 'amount', 'status', 'approvedOn', 'expectedDate', 'actualDate']
        }]
      }],
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'asc'],
        ['milestones', 'id', 'asc']
      ]
    });
    log.write("PurchaseService ::: listVendorPendingMilestones :: PurchaseOrderMilestones count : " + results.length);

    var pos = [];
    _.each(results, function(r) {
      var po = {
        id: r.id,
        project: r.project.title,
        refNo: r.refNo,
        status: r.status,
        date: r.date,
        amount: r.amount,
        paidAmount: r.paidAmount,
        dueAmount: r.dueAmount
      }
      po.draftedAmount = _.sumBy(_.filter(r.milestones, { status: 'Draft' }), 'amount');
      po.completedAmount = _.sumBy(_.filter(r.milestones, { status: 'Completed' }), 'amount');
      po.confirmedAmount = _.sumBy(_.filter(r.milestones, { status: 'Confirmed' }), 'amount');
      pos.push(po);
    })
    return pos;
  } catch (e) {
    log.write("PurchaseService ::: listPurchaseOrderMilestones :: exception : ", e);
    throw (e);
  }
}
service.confirmVendorMilestoneApprovals = async (data) => {
  try {
    log.write("PurchaseService ::: confirmVendorMilestoneApprovals :: data : ", data);
    if (data.pos) {
      for (var i = 0; i < data.pos.length; i++) {
        var po = data.pos[i];
        var releaseAmount = po.releaseAmount;
        var milestones = await PurchaseOrderMilestone.findAll({
          where: { purchaseOrderId: po.id, status: { $in: ['Draft', 'Completed', 'Confirmed'] } }
        })
        // log.write("PurchaseService ::: confirmVendorMilestoneApprovals :: milestones : " + milestones.length);
        var statuses = ['Confirmed', 'Completed', 'Draft'];
        for (var k = 0; k < statuses.length; k++) {
          var status = statuses[k];
          if (releaseAmount > 0) {
            var confirmedMilestones = _.filter(milestones, { status: status });
            for (var j = 0; j < confirmedMilestones.length; j++) {
              var milestone = confirmedMilestones[j];
              if (releaseAmount > 0) {
                var _milestone = {
                  id: milestone.id,
                  status: 'Approved',
                  approved: true,
                }
                if (milestone.amount > releaseAmount) {
                  _milestone.partialAmount = releaseAmount;
                  releaseAmount = 0;
                } else {
                  releaseAmount = releaseAmount = milestone.amount;
                }
                log.write("PurchaseService ::: confirmVendorMilestoneApprovals :: milestone to release : ", _milestone);
                await service.savePurchaseOrderMilestone(_milestone);
              }
            }
          }
        }
      }
      return data;
    }
  } catch (e) {
    log.write("PurchaseService ::: confirmVendorMilestoneApprovals :: exception : ", e);
    throw (e);
  }
}
service.listPurchaseOrderMilestones = async (data) => {
  try {
    log.write("PurchaseService ::: listPurchaseOrderMilestones :: data : ", data);
    var where = { 'parentMilestoneId': { $eq: null } };
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status
    }
    if (data.filters.notIn && data.filters.notIn != '') {
      where['status'] = { $notIn: data.filters.notIn }
    }
    if (data.filters.purchaseItemId && data.filters.purchaseItemId != '') {
      where['purchaseItemId'] = data.filters.purchaseItemId
    }
    if (data.filters.purchaseOrderId && data.filters.purchaseOrderId != '') {
      where['purchaseOrderId'] = data.filters.purchaseOrderId
    }
    var results = await PurchaseOrderMilestone.findAll({
      where: where,
      include: ['milestones', {
        as: 'purchaseItem',
        model: PurchaseItem,
        attributes: ['id'],
        include: [{ as: 'sku', model: Sku, attributes: ['name'] }]
      }],
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'asc'],
        ['milestones', 'id', 'asc']
      ]
    });
    log.write("PurchaseService ::: listPurchaseOrderMilestones :: PurchaseOrderMilestones count : " + results.length);

    return results;
  } catch (e) {
    log.write("PurchaseService ::: listPurchaseOrderMilestones :: exception : ", e);
    throw (e);
  }
}
service.savePurchaseOrderMilestone = async (data, username) => {
  try {
    log.write("PurchaseService ::: savePurchaseOrderMilestone :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      var mileStone = _.clone(data);
      if (data.approved) {
        data.approvedBy = username;
        data.approvedOn = new Date();

        mileStone = await PurchaseOrderMilestone.findOne({ where: { id: data.id }, include: ['purchaseOrder'] });
        if (data.partialAmount) {
          var partialMileStone = mileStone.toJSON();
          delete partialMileStone.purchaseOrder;
          delete partialMileStone.id;

          partialMileStone.parentMilestoneId = mileStone.id;
          partialMileStone.amount = data.partialAmount;
          partialMileStone.name = "Partial Payment";
          mileStone.set("amount", (mileStone.amount - data.partialAmount));
          mileStone.save();

          partialMileStone = await PurchaseOrderMilestone.create(partialMileStone);
          mileStone = await PurchaseOrderMilestone.findOne({ where: { id: partialMileStone.id }, include: ['purchaseOrder'] });
        }

        var payoutBenificiaryId;
        var amount = mileStone.amount;
        if (mileStone.purchaseOrder.isBill) {
          mileStone.purchaseOrder.set("status", "Approved");
          mileStone.purchaseOrder.save();
        }
        if (mileStone.paymentMode == "BankTransfer") {
          var bankAccount = await VendorBankAccount.findOne({
            where: { id: mileStone.purchaseOrder.vendorBankAccountId },
            include: [{ as: 'vendor', model: Vendor, include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }] }]
          });
          if (bankAccount) {
            var benificiary = await PayoutBenificiary.findOne({ where: { accountNumber: bankAccount.accountNumber, active: 1 } });
            if (!benificiary) {
              var accountData = {
                id: bankAccount.id,
                accountNumber: bankAccount.accountNumber,
                ifscCode: bankAccount.ifscCode,
                name: bankAccount.benificiaryName,
                email: bankAccount.vendor.contact.email,
                phone: bankAccount.vendor.contact.phone,
                address: bankAccount.vendor.address,
              }
              benificiary = await services.addCashFreeBenificiaryForRefund(accountData, bankAccount.vendor.companyId);
            }
            payoutBenificiaryId = benificiary.id;
          } else {
            throw ("Bank Account not found for this Vendor to approve payment")
          }
        }
        var info = "";
        var pendingPayout = await PayoutPayment.findOne({ where: { purchaseOrderId: mileStone.purchaseOrderId, status: { $in: ['Pending', 'Approved'] } } });

        if (pendingPayout) {
          log.write("PurchaseService ::: savePurchaseOrderMilestone :: pendingPayout : ", pendingPayout.toJSON());
          info = pendingPayout.info + ", " + mileStone.name;
          var approvedMileStones = await PurchaseOrderMilestone.findAll({ where: { purchaseOrderId: mileStone.purchaseOrderId, status: 'Approved' } })
          amount = amount + _.sumBy(approvedMileStones, "amount");
          pendingPayout.set("amount", amount);
          pendingPayout.set("approvedOn", new Date());
          pendingPayout.set("approvedBy", username);
          pendingPayout.set("updated", new Date());
          pendingPayout.set("updateBy", username);
          await pendingPayout.save();
          mileStone.set("payoutId", pendingPayout.id);
          mileStone.save();
        } else {
          var payoutPayment = await PayoutPayment.create({
            payoutBenificiaryId: payoutBenificiaryId,
            paymentMode: mileStone.paymentMode == 'BankTransfer' ? 'CashFree' : mileStone.paymentMode,
            info: mileStone.name,
            amount: amount,
            approvedBy: username,
            approvedOn: new Date(),
            type: 'VendorPayment',
            status: 'Approved',
            purchaseOrderId: mileStone.purchaseOrderId,
            updated: new Date(),
            updatedBy: username,
            companyId: data.companyId
          })
          log.write("PurchaseService ::: savePurchaseOrderMilestone :: payoutPayment : ", payoutPayment.toJSON());
          mileStone.set("payoutId", payoutPayment.id);
          mileStone.set("status", 'Approved');
          mileStone.save();
        }

        await services.updatePurchaseOrderLedger(mileStone.purchaseOrderId);

        systemUtils.addActivity({
          activity: 'VendorPayoutApproved',
          update: (data.update || "Vendor Payout of amount Rs." + amount + " is approved by " + username),
          companyId: data.companyId
        }, username);
      }
      delete data.id;
      await PurchaseOrderMilestone.update(data, { where: { id: mileStone.id } })
      item = mileStone;
    } else {
      item = await PurchaseOrderMilestone.create(data);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: savePurchaseOrderMilestone :: exception : ", e);
    throw (e);
  }
}

service.searchVendorSkus = async (data) => {
  try {
    log.write("PurchaseService ::: searchVendorSkus :: data : ", data);
    var where = {
      'status': { $in: ['Empanelled', 'Approved'] },
      'active': 1,
      '$skus.skuId$': data.skuId,
      '$skus.status$': { $in: ['Approved', 'Accepted'] },
    };
    if (data['vendorId']) {
      where.id = data['vendorId']
    }
    log.write("PurchaseService ::: listVendorSKUs :: where : ", where);
    var vendors = await Vendor.findAll({
      where: where,
      include: [{
        as: 'skus',
        model: VendorSku,
        include: ['sku', { as: 'pricings', model: VendorSkuPricing, include: ['paymentTerm'] }]
      }],
      subQuery: false
    })

    log.write("PurchaseService ::: searchVendorSkus :: vendors found : ", vendors.length);
    var results = [];
    _.each(vendors, function(vendor) {
      log.write("PurchaseService ::: searchVendorSkus :: vendors  : ", vendor.toJSON());
      var vendorName = vendor['name'];
      var sku, paymentTerm;
      _.each(vendor.skus, function(service) {
        if (service['skuId'] == data.skuId) {
          if (service.pricings.length) {
            log.write("PurchaseService ::: listVendorSKUs :: service : ", service.toJSON());
            _.each(service.pricings, function(pricing) {
              if (!paymentTerm || pricing['paymentTermId'] != paymentTerm.id) {
                var pt = pricing.paymentTerm;
                paymentTerm = {
                  id: pricing['paymentTermId'],
                  name: pt['name'],
                  tagName: "(OA" + pt['onAdvance'] + "-OD" + pt['onDelivery'] + "-IP" + pt['inProgress'] + "-OF" + pt['onFinish'] + "-AF" + pt['afterFinish'] + ")",
                  vendorId: vendor['id'],
                  vendorName: vendorName,
                  vendorHasGST: vendor['hasGst'],
                  status: service['status'],
                  skuId: service['skuId'],
                  skuName: service.sku['name'],
                  pricings: [],
                };
                results.push(paymentTerm);
              }
              var inRange = false;
              if (pricing['minQty'] <= data.quantity && pricing['maxQty'] >= data.quantity) {
                inRange = true;
                paymentTerm.price = pricing.price;
              }
              paymentTerm.pricings.push({ inRange: inRange, minQty: pricing['minQty'], maxQty: pricing['maxQty'], price: pricing['price'] })
            })
          }
        }
      })
    });
    results = _.orderBy(results, ['price']);

    var vendors = _(results)
      .groupBy(x => x.vendorName)
      .map((value, key) => ({ vendorName: key, vendorId: value[0].vendorId, paymentTerms: value }))
      .value();

    log.write("PurchaseService ::: searchVendorSkus :: vendors : ", vendors);
    return vendors;
  } catch (e) {
    log.write("PurchaseService ::: searchVendorSkus :: exception : ", e);
    throw (e);
  }
}
service.raiseWorkOrders = async (data, username) => {
  try {
    log.write("PurchaseService ::: raiseWorkOrders :: data : ", data);
    var workOrder = {};
    data.updated = new Date();
    data.updatedBy = username;
    var vendors = _(data.items)
      .groupBy(x => x.vendorId)
      .map((value, key) => ({ vendorId: key, items: value }))
      .value();
    log.write("PurchaseService ::: raiseWorkOrders :: vendors : ", vendors);
    for (var i = 0; i < vendors.length; i++) {
      var vendor = vendors[i];
      var user = await systemUtils.getUser(username);
      var workOrder = {
        vendorId: vendor.vendorId,
        projectId: data.projectId,
        buildingId: data.buildingId,
        isOpex: data.isOpex,
        type: data.type,
        paymentTermId: vendor.items[0].paymentTermId,
        date: new Date(),
        proposedBy: username,
        proposedOn: new Date(),
        status: 'Raised',
        budget: 0,
        executive: user.id,
        deliveryStoreId: data.deliveryStoreId,
        companyId: data.companyId
      }
      workOrder = await WorkOrder.create(workOrder);
      workOrder.set('refNo', "WO-HH-" + (100000 + workOrder.id));
      var budget = 0;
      for (var j = 0; j < vendor.items.length; j++) {
        var item = vendor.items[j];
        var workItem = {
          workOrderId: workOrder.id,
          paymentTermId: item.paymentTermId,
          skuId: item.skuId,
          description: item.description || item.skuName,
          units: item.quantity,
          unitPrice: item.price,
          cost: item.quantity * item.price,
          status: 'Draft',
          vendorAcceptanceStatus: 'Waiting',
          totalDiscount: 0,
        }
        var gstPercent = (item.skuGst != null ? item.skuGst : 0) / 100;
        workItem.gst = (item.quantity * item.price) * gstPercent;
        workItem.totalAmount = (item.quantity * item.price) + workItem.gst;
        await service.saveWorkItem(workItem);
        budget = budget + workItem.totalAmount;
      }
      workOrder.set('budget', budget);
      await workOrder.save();
    }
    return vendors.length;
  } catch (e) {
    log.write("PurchaseService ::: raiseWorkOrders :: exception : ", e);
    throw (e);
  }
}

service.approveDeclineWorkItem = async (data, username) => {
  try {
    log.write("PurchaseService ::: approveDeclineWorkItem :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    await WorkItem.update(data, { where: { id: data.id } });

    var workItems = await WorkItem.findAll({ where: { workOrderId: data.workOrderId } })
    var update = { budget: 0 };
    _.each(workItems, function(i) {
      if (i.status == 'Declined' && !update.status) {
        update.status = "Declined";
      } else if (i.status == 'Draft') {
        update.status = "Raised";
      } else if (i.status == 'Approved') {
        // update.status = "Approved";
        update.budget = update.budget + i.totalAmount;
      }
    })
    WorkOrder.update(update, { where: { id: data.workOrderId } });
    return item;
  } catch (e) {
    log.write("PurchaseService ::: approveDeclineWorkItem :: exception : ", e);
    throw (e);
  }
}
service.requestVendorApproval = async (data, username) => {
  try {
    log.write("PurchaseService ::: requestVendorApproval :: data : ", data);
    var workOrder = await WorkOrder.findOne({
      include: ['items', 'company', { as: 'vendor', model: Vendor, include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }] }],
      where: { id: data.workOrderId }
    });
    var user = await systemUtils.getUser(username);
    WorkOrder.update({
      manager: user.id,
      additionalChargesNote: data.additionalChargesNote,
      deliveryCharges: data.deliveryCharges,
      additionalCharges: data.additionalCharges,
      expectedDates: data.expectedDates,
      status: 'Approved',
      approvedBy: username,
      approvedOn: new Date()
    }, { where: { id: data.workOrderId } })

    var data = {
      workOrderId: workOrder.id,
    }
    var selfCareLink = await systemUtils.createSelfCareLink("VendorWorkOrderApproval", "vendor-workorder-approval", data, workOrder.companyId);

    var items = [];
    _.each(workOrder.items, function(i) {
      items.push({
        description: i.description || '',
        price: i.unitPrice,
        qty: i.units,
        amount: i.units * i.unitPrice,
        gst: i.gst,
        total: i.totalAmount
      })
    })
    var data = {
      vendorName: workOrder.vendor.name,
      link: selfCareLink.url,
      items: items
    }
    log.write("MailsService ::: requestVendorApproval :: data : ", data);

    var mailBody = await services.getMailBody("emails/workorder_vendor_approval.html", data);
    log.write("MailsService ::: requestVendorApproval :: mailBody : ", mailBody.length);
    var receivers = [];
    receivers.push({
      name: workOrder.vendor.contact.name,
      email: workOrder.vendor.contact.email,
    });
    return await services.sendMail(workOrder.company.name + " :: Requesting for WorkOrder Approval", mailBody, receivers);
  } catch (e) {
    log.write("PurchaseService ::: requestVendorApproval :: exception : ", e);
    throw (e);
  }
}

service.raisePurchaseOrder = async (data, username) => {
  try {
    log.write("PurchaseService ::: raisePurchaseOrder :: data : ", data);
    var items = [];
    for (var i = 0; i < data.items.length; i++) {
      if (data.items[i].id) {
        await WorkItem.update({
          vendorAcceptanceStatus: data.items[i].vendorAcceptanceStatus,
          vendorRejectedReason: data.items[i].vendorRejectedReason,
          vendorRejectedComments: data.items[i].vendorRejectedComments
        }, { where: { id: data.items[i].id } })
      }
    }

    if (data.raisePurchaseOrder) {
      var workOrder;
      if (data.workOrderId) {
        workOrder = await WorkOrder.findOne({ where: { id: data.workOrderId }, include: ['items'] });
        workOrder = workOrder.toJSON();
      } else {
        workOrder = data;
        workOrder.refNo = "";
        workOrder.budget = _.sumBy(data.items, "amount");
      }
      log.write("PurchaseService ::: raisePurchaseOrder :: workOrder : ", workOrder);
      if (data.deliveryCharges) {
        // data.deliveryCharges = (data.deliveryCharges * 1.18);
        workOrder.budget = workOrder.budget + data.deliveryCharges;
      }
      if (data.additionalCharges) {
        // data.additionalCharges = (parseInt(data.additionalCharges) * 1.18);
        workOrder.budget = workOrder.budget + data.additionalCharges;
      }

      var company = await systemUtils.getCompany(workOrder.companyId);
      // log.write("PurchaseService ::: raisePurchaseOrder :: workOrder : ", workOrder.toJSON());
      var bankAccount = await VendorBankAccount.findOne({ where: { vendorId: workOrder.vendorId, active: 1 } })
      var vendor = await Vendor.findOne({
        where: { id: workOrder.vendorId },
        include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }]
      })
      log.write("PurchaseService ::: raisePurchaseOrder :: vendor : ", vendor.toJSON());
      var building = await Building.findOne({ where: { id: workOrder.buildingId } })

      var refNo = await systemUtils.getRefNo("PurchaseOrder", null, null, company);
      var purchaseOrder = await PurchaseOrder.create({
        projectId: workOrder.projectId,
        vendorId: workOrder.vendorId,
        buildingId: workOrder.buildingId,
        isOpex: workOrder.isOpex,
        type: workOrder.type,
        executive: workOrder.executive,
        manager: workOrder.manager,
        approvedBy: workOrder.approvedBy || username,
        vendorAcceptedOn: !workOrder.id ? new Date() : null,
        workOrderId: workOrder.id,
        vendorBankAccountId: bankAccount ? bankAccount.id : null,
        amount: workOrder.budget,
        refNo: refNo,
        date: moment().format("YYYY-MM-DD"),
        status: 'Raised',
        updated: new Date(),
        updatedBy: 'system',
        deliveryCharges: data.deliveryCharges,
        additionalCharges: data.additionalCharges,
        additionalChargesNote: data.additionalChargesNote,
        deliveryStoreId: workOrder.deliveryStoreId,
        companyId: workOrder.companyId,
      });

      var items = [];
      var terms = [];
      var poTaxableAmount = 0;
      var poGstAmount = 0;
      log.write("PurchaseServices ::: raisePurchaseOrder :: purchaseOrder : ", purchaseOrder.toJSON());
      for (var i = 0; i < workOrder.items.length; i++) {
        var item = workOrder.items[i];
        // log.write("PurchaseServices ::: raisePurchaseOrder :: item : ", item.toJSON());
        var purchaseItem = {
          purchaseOrderId: purchaseOrder.id,
          skuId: item.skuId,
          paymentTermId: item.paymentTermId,
          units: item.units,
          unitPrice: item.unitPrice,
          taxableAmount: (item.units * item.unitPrice),
          gst: item.gst,
          amount: item.totalAmount || item.amount,
          status: 'Ordered',
        }
        poTaxableAmount = poTaxableAmount + purchaseItem.taxableAmount;
        poGstAmount = poGstAmount + purchaseItem.gst;

        purchaseItem = await PurchaseItem.create(purchaseItem);
        var sku = await Sku.findOne({ where: { id: item.skuId }, include: ['type'] })
        items.push({
          item: sku.name,
          itemType: sku.type.name,
          qty: item.units,
          price: item.unitPrice,
          gst: item.gst,
          total: item.totalAmount || item.amount
        })
      }

      var milestoneIndex = 0;
      var lastMilestone;
      for (var i = 0; i < data.milestones.length; i++) {
        lastMilestone = await PurchaseOrderMilestone.create({
          purchaseOrderId: purchaseOrder.id,
          purchaseItemId: purchaseItem.id,
          name: data.milestones[i]['name'],
          amount: data.milestones[i]['amount'],
          status: 'Draft',
          paymentMode: vendor.paymentMode,
          expectedDate: data.milestones[i]['expectedDate']
        })
        terms.push({
          term: data.milestones[i].name
        })
      }

      // var paymentTerm = await VendorPaymentTerm.findOne({ where: { id: workOrder.paymentTermId } });
      // if (paymentTerm.onAdvance) {
      //   lastMilestone = await PurchaseOrderMilestone.create({
      //     purchaseOrderId: purchaseOrder.id,
      //     purchaseItemId: purchaseItem.id,
      //     name: 'As Advance, payment of ' + paymentTerm.onAdvance + "%",
      //     amount: poTaxableAmount * (paymentTerm.onAdvance / 100),
      //     status: 'Draft',
      //     paymentMode: vendor.paymentMode,
      //     expectedDate: data.milestones[milestoneIndex++]['expectedDate']
      //   })
      //   terms.push({
      //     term: "As Advance,  payment of " + paymentTerm.onAdvance + " % ",
      //     // payment: paymentTerm.onAdvance + "%"
      //   })
      // }
      // if (paymentTerm.onDelivery) {
      //   var name = 'On Delivery, payment of ' + paymentTerm.onDelivery + "%";
      //   var amount = poTaxableAmount * (paymentTerm.onDelivery / 100);
      //   lastMilestone = await PurchaseOrderMilestone.create({
      //     purchaseOrderId: purchaseOrder.id,
      //     purchaseItemId: purchaseItem.id,
      //     name: name,
      //     amount: amount,
      //     status: 'Draft',
      //     paymentMode: vendor.paymentMode,
      //     expectedDate: data.milestones[milestoneIndex++]['expectedDate']
      //   })
      //   terms.push({
      //     term: name,
      //     // payment: paymentTerm.onDelivery + "%"
      //   })
      // }
      // if (paymentTerm.inProgress) {
      //   var inProgressAmount = poTaxableAmount * (paymentTerm.inProgress / 100);
      //   var inProgressStages = [{ payment: 100, paymentLabel: paymentTerm.inProgress, workProgress: 100 }];
      //   if (paymentTerm.inProgressStages) {
      //     inProgressStages = JSON.parse(paymentTerm.inProgressStages);
      //   }
      //   var stages = [];
      //   for (var i = 0; i < inProgressStages.length; i++) {
      //     var stage = inProgressStages[i];
      //     if (stage.payment > 0) {
      //       var stageAmount = inProgressAmount * (stage.payment / 100);
      //       stages.push({
      //         purchaseOrderId: purchaseOrder.id,
      //         purchaseItemId: purchaseItem.id,
      //         name: 'In Progress, payment of ' + (stage.paymentLabel || stage.payment) + "% after " + stage.workProgress + "% of work done",
      //         amount: stageAmount,
      //         status: 'Draft',
      //         paymentMode: vendor.paymentMode,
      //         expectedDate: data.milestones[milestoneIndex++]['expectedDate']
      //       })
      //     }
      //   }
      //   if (stages.length > 1) {
      //     for (var j = 0; j < stages.length; j++) {
      //       lastMilestone = await PurchaseOrderMilestone.create(stages[j]);
      //       terms.push({
      //         term: stages[j].name
      //       })
      //     }
      //   } else {
      //     lastMilestone = await PurchaseOrderMilestone.create({
      //       purchaseOrderId: purchaseOrder.id,
      //       purchaseItemId: purchaseItem.id,
      //       name: 'In Progress, payment of ' + paymentTerm.inProgress + "% after 100% of work done",
      //       amount: stageAmount,
      //       status: 'Draft',
      //       paymentMode: vendor.paymentMode,
      //       expectedDate: data.milestones[milestoneIndex++]['expectedDate']
      //     });
      //     terms.push({
      //       term: 'In Progress, payment of ' + paymentTerm.inProgress + "% after 100% of work done"
      //     })
      //   }
      // }
      // if (paymentTerm.onFinish) {
      //   lastMilestone = await PurchaseOrderMilestone.create({
      //     purchaseOrderId: purchaseOrder.id,
      //     purchaseItemId: purchaseItem.id,
      //     name: 'On Finish, payment of ' + paymentTerm.onFinish + "%",
      //     amount: poTaxableAmount * (paymentTerm.onFinish / 100),
      //     status: 'Draft',
      //     paymentMode: vendor.paymentMode,
      //     expectedDate: data.milestones[milestoneIndex++]['expectedDate']
      //   })
      //   terms.push({
      //     term: 'On Finish, payment of ' + paymentTerm.onFinish + "%",
      //     // payment: paymentTerm.onFinish + "%"
      //   })
      // }
      // if (paymentTerm.afterFinish) {
      //   var afterFinishAmount = poTaxableAmount * (paymentTerm.afterFinish / 100);
      //   var afterFinishStages = [{ payment: 100, paymentLabel: paymentTerm.afterFinish, days: 30 }];
      //   if (paymentTerm.afterFinishStages) {
      //     afterFinishStages = JSON.parse(paymentTerm.afterFinishStages);
      //   }
      //   var stages = [];
      //   for (var i = 0; i < afterFinishStages.length; i++) {
      //     var stage = afterFinishStages[i];
      //     if (stage.payment > 0) {
      //       var stageAmount = afterFinishAmount * (stage.payment / 100);
      //       stages.push({
      //         purchaseOrderId: purchaseOrder.id,
      //         purchaseItemId: purchaseItem.id,
      //         name: 'On Finish, payment of ' + (stage.paymentLabel || stage.payment) + "% after " + stage.days + " days",
      //         amount: stageAmount,
      //         status: 'Draft',
      //         paymentMode: vendor.paymentMode,
      //         expectedDate: data.milestones[milestoneIndex++]['expectedDate']
      //       })
      //     }
      //   }
      //   if (stages.length > 1) {
      //     for (var j = 0; j < stages.length; j++) {
      //       lastMilestone = await PurchaseOrderMilestone.create(stages[j]);
      //       terms.push({
      //         term: stages[j].name
      //       })
      //     }
      //   } else {
      //     lastMilestone = await PurchaseOrderMilestone.create({
      //       purchaseOrderId: purchaseOrder.id,
      //       purchaseItemId: purchaseItem.id,
      //       name: 'On Finish, payment of ' + paymentTerm.afterFinish + "% after " + afterFinishStages[0].days + " days",
      //       amount: stageAmount,
      //       status: 'Draft',
      //       paymentMode: vendor.paymentMode,
      //       expectedDate: data.milestones[milestoneIndex++]['expectedDate']
      //     });
      //     terms.push({
      //       term: 'On Finish, payment of ' + paymentTerm.afterFinish + "% after " + afterFinishStages[0].days + " days"
      //     })
      //   }
      // }

      // if (lastMilestone) {
      //   var name = lastMilestone.name;
      //   var amount = lastMilestone.amount;
      //   amount = amount + poGstAmount;
      //   name = name + " + GST amount";
      //   if (purchaseOrder.additionalCharges) {
      //     name = name + " + Additional Charges";
      //     amount = amount + purchaseOrder.additionalCharges;
      //   }
      //   if (purchaseOrder.deliveryCharges) {
      //     name = name + " and Delivery Charges";
      //     amount = amount + purchaseOrder.deliveryCharges;
      //   }
      //   lastMilestone.set('name', name);
      //   lastMilestone.set('amount', amount);
      //   lastMilestone.save();

      //   var termsLength = terms.length;
      //   if (termsLength) {
      //     terms[termsLength - 1].term = name;
      //   }
      // }

      WorkOrder.update({
        status: 'PORaised',
        vendorAcceptedOn: new Date()
      }, { where: { id: data.workOrderId } });

      var executive = await systemUtils.getUserById(workOrder.executive);
      // log.write("PurchaseService ::: raisePurchaseOrder :: executive : ", executive.toJSON());
      var data = {
        companyLogo: company.logo,
        companyTradeName: company.tradeName,
        companyAddress: company.address,
        gstIn: company.gstNo,
        pan: company.panNo,
        stateCode: company.stateCode,
        title: "Purchase Order",
        refNo: purchaseOrder.refNo,
        date: utils.moment(purchaseOrder.date).format("MMM DD, YYYY"),
        place: company.city + ", " + company.state,
        vendorName: vendor.name,
        vendorAddress: vendor.address,
        vendorEmail: vendor.contact.email,
        vendorPhone: vendor.contact.phone,
        buildingName: building.name,
        buildingAddress: building.address || '',
        deliveryContactEmail: executive.email,
        deliveryContactPhone: executive.phone,
        items: items,
        terms: terms,
        deliveryCharges: parseInt(purchaseOrder.deliveryCharges) || 0,
        additionalCharges: parseInt(purchaseOrder.additionalCharges) || 0,
        additionalChargesNote: purchaseOrder.additionalChargesNote || '',
        budget: purchaseOrder.amount
      }
      // log.write("PurchaseService ::: raisePurchaseOrder :: data : ", data);
      var tmpFile = await services.parseContent("pdfs/purchase_order.html", data);
      var doc = await services.createDoc(purchaseOrder.refNo + ".pdf");
      await services.generatePdf(tmpFile, path.basename(doc.file));
      purchaseOrder.set('pdfId', doc.id);
      await purchaseOrder.save();
      log.write("PurchaseService ::: raisePurchaseOrder :: doc : ", doc);


      services.updatePurchaseOrderLedger(purchaseOrder.id);

      systemUtils.addActivity({
        activity: 'NewPurchaseOrder',
        update: (data.update || "New PurchaseOrder for " + building.name + " is accepted by Vendor '" + vendor.name + "' for an amount of Rs." + data.budget),
        companyId: company.id
      }, username);

      var receivers = [];
      receivers.push({
        name: vendor.contact.name,
        email: vendor.contact.email,
      });
      receivers.push({
        name: company.name + " Accounts",
        email: company.email,
      });
      if (executive) {
        receivers.push({
          name: executive.name,
          email: executive.email,
        });
      }
      var manager = await systemUtils.getUserById(workOrder.manager);
      if (manager) {
        receivers.push({
          name: manager.name,
          email: manager.email,
        });
      }

      var msg = "Thanks for accepting our WorkOrder for our project '" + building.name + "' with a budget of Rs. " + workOrder.budget;
      msg = msg + "<br><br>Attached is the Purchase Order for the same from our side. ";
      var data = {
        name: vendor.name,
        msg: msg,
        supportPhone: company.supportPhone,
        supportEmail: company.supportEmail,
        teamName: "Team " + company.name
      }
      log.write("MailsService ::: raisePurchaseOrder :: data : ", data);
      var attachments = [{ filename: doc.name, path: doc.file }];
      var mailBody = await services.getMailBody("emails/context_notification.html", data);
      log.write("MailsService ::: raisePurchaseOrder :: mailBody : ", mailBody.length);
      await services.sendMail(company.name + " :: New Purchase Order for " + building.name, mailBody, receivers, attachments);

      return purchaseOrder;
    }
    return data;
  } catch (e) {
    log.write("PurchaseService ::: raisePurchaseOrder :: exception : ", e);
    throw (e);
  }
}
service.getPurchaseOrder = async (id) => {
  try {
    log.write("PurchaseService ::: getPurchaseOrder :: id : ", id);
    var purchaseOrder = await PurchaseOrder.findOne({
      where: { id: id },
      include: ['items', { as: 'invoices', model: PurchaseOrderInvoice, include: ['file', 'gstFile', 'gstSlabs'] },
        { as: 'vendor', model: Vendor, include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }] },
        { as: 'building', model: Building, attributes: ['id', 'name', 'address'] },
        { as: 'project', model: Project, attributes: ['title'] },
      ]
    });
    if (purchaseOrder) {
      purchaseOrder = purchaseOrder.toJSON();
      purchaseOrder.executive = await systemUtils.getUserById(purchaseOrder.executive);
      purchaseOrder.manager = await systemUtils.getUserById(purchaseOrder.manager);
      purchaseOrder.proformaInvoice = await systemUtils.getFile(purchaseOrder.proformaInvoiceId);
      purchaseOrder.taxInvoice = await systemUtils.getFile(purchaseOrder.taxInvoiceId);
      purchaseOrder.pdf = await systemUtils.getFile(purchaseOrder.pdfId);
      if (purchaseOrder.building) {
        purchaseOrder.building.location = await systemUtils.getLocation(purchaseOrder.building.locationId);
      }
    }
    return purchaseOrder;
  } catch (e) {
    log.write("PurchaseService ::: getPurchaseOrder :: exception : ", e);
    throw (e);
  }
}

service.regeneratePurchaseOrder = async (id) => {
  try {
    log.write("PurchaseService ::: getPurchaseOrder :: id : ", id);
    var purchaseOrder = await PurchaseOrder.findOne({
      where: { id: id },
      include: ['items', 'milestones', 'deliveryStore',
        { as: 'vendor', model: Vendor, include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }] },
        { as: 'building', model: Building, attributes: ['id', 'name', 'address'] },
      ]
    });
    if (purchaseOrder) {
      var company = await systemUtils.getCompany(purchaseOrder.companyId);
      var vendor = purchaseOrder.vendor;
      var building = purchaseOrder.building;

      var items = [],
        terms = [];
      for (var i = 0; i < purchaseOrder.milestones.length; i++) {
        terms.push({
          term: purchaseOrder.milestones[i].name
        })
      }
      for (var i = 0; i < purchaseOrder.items.length; i++) {
        var item = purchaseOrder.items[i];
        var sku = await Sku.findOne({ where: { id: item.skuId }, include: ['type'] })
        console.log("Auyfyujhlok:",sku,"\nitem:", JSON.stringify(item))
        items.push({
          item: sku.name,
          itemType: sku.type.name,
          qty: item.units,
          price: item.unitPrice,
          gst: item.gst,
          total: item.amount
        })
      }
      var executive, deliveryPlace, deliveryAddress;
      if (purchaseOrder.deliveryStore) {
        deliveryPlace = purchaseOrder.deliveryStore.name;
        deliveryAddress = purchaseOrder.deliveryStore.address;
        executive = await systemUtils.getUserById(purchaseOrder.deliveryStore.managerId);
      } else {
        deliveryPlace = purchaseOrder.building.name;
        deliveryAddress = purchaseOrder.building.address;
        executive = await systemUtils.getUserById(purchaseOrder.executive);
      }
      var data = {
        companyLogo: company.logo,
        companyTradeName: company.tradeName,
        companyAddress: company.address,
        gstIn: company.gstNo,
        pan: company.panNo,
        stateCode: company.stateCode,
        title: "Purchase Order",
        refNo: purchaseOrder.refNo,
        date: utils.moment(purchaseOrder.date).format("MMM DD, YYYY"),
        place: company.city + ", " + company.state,
        vendorName: vendor.name,
        vendorAddress: vendor.address,
        vendorEmail: vendor.contact.email,
        vendorPhone: vendor.contact.phone,
        buildingName: deliveryPlace || '',
        buildingAddress: deliveryAddress || '',
        deliveryContactEmail: executive.email,
        deliveryContactPhone: executive.phone + "(" + executive.name + ")",
        items: items,
        terms: terms,
        deliveryCharges: purchaseOrder.deliveryCharges || 0,
        additionalCharges: purchaseOrder.additionalCharges || 0,
        additionalChargesNote: purchaseOrder.additionalChargesNote || '',
        budget: purchaseOrder.amount,
        deliveryAddress: deliveryAddress
      }
      // log.write("PurchaseService ::: raisePurchaseOrder :: data : ", data);
      var tmpFile = await services.parseContent("pdfs/purchase_order.html", data);
      var doc = await services.createDoc(purchaseOrder.refNo + ".pdf");
      await services.generatePdf(tmpFile, path.basename(doc.file));
      purchaseOrder.set('pdfId', doc.id);
      await purchaseOrder.save();
      log.write("PurchaseService ::: raisePurchaseOrder :: doc : ", doc);


      services.updatePurchaseOrderLedger(purchaseOrder.id);
    }
    return doc;
  } catch (e) {
    log.write("PurchaseService ::: getPurchaseOrder :: exception : ", e);
    throw (e);
  }
}
service.updatePurchaseOrder = async (data) => {
  try {
    log.write("PurchaseService ::: updatePurchaseOrder :: data : ", data);

    var purchaseOrder = await PurchaseOrder.findOne({ where: { id: data.id }, include: ['milestones'] });

    var poTaxableAmount = 0;
    var poGstAmount = 0;
    var purchaseItems = [];
    for (var i = 0; i < data.items.length; i++) {
      var item = data.items[i];
      var purchaseItem = {
        purchaseOrderId: data.id,
        skuId: item.skuId,
        paymentTermId: purchaseOrder.paymentTermId,
        units: item.units,
        unitPrice: item.unitPrice,
        taxableAmount: (item.units * item.unitPrice),
        status: 'Ordered',
      }
      purchaseItem.gst = purchaseItem.taxableAmount * (item.skuGst / 100);
      purchaseItem.amount = purchaseItem.taxableAmount + purchaseItem.gst;

      poTaxableAmount = poTaxableAmount + purchaseItem.taxableAmount;
      poGstAmount = poGstAmount + purchaseItem.gst;

      purchaseItems.push(purchaseItem);
    }

    var paidMilestonesAmount = _.sumBy(_.filter(purchaseOrder.milestones, function(m) { return m.status == 'Paid'; }), 'amount');
    var milestonesAmount = _.sumBy(_.filter(purchaseOrder.milestones, function(m) {
      return m.status == 'Draft' || m.status == 'Completed' || m.status == 'Confirmed' || m.status == 'Approved' || m.status == 'Paid'
    }), 'amount');
    var amount = _.sumBy(purchaseItems, 'amount');

    log.write("PurchaseService ::: updatePurchaseOrder :: paidMilestonesAmount : " + paidMilestonesAmount);
    log.write("PurchaseService ::: updatePurchaseOrder :: milestonesAmount : " + milestonesAmount);
    log.write("PurchaseService ::: updatePurchaseOrder :: amount : " + amount);

    if (amount >= paidMilestonesAmount) {
      await PurchaseItem.update({ status: 'Archived' }, { where: { purchaseOrderId: data.id } });

      for (var i = 0; i < purchaseItems.length; i++) {
        var purchaseItem = purchaseItems[i];
        purchaseItem = await PurchaseItem.create(purchaseItem);
      }

      if (amount > milestonesAmount) {
        var pendingAmount = amount - milestonesAmount;
        var milestone = {
          purchaseOrderId: data.id,
          name: "Amended PO milestone",
          status: 'Draft',
          amount: pendingAmount
        }
        await PurchaseOrderMilestone.create(milestone);
      } else if (amount < milestonesAmount) {
        var amountToDeduct = milestonesAmount - amount;

        var pendingMilestones = _.filter(purchaseOrder.milestones, function(m) { return m.status == 'Draft' || m.status == 'Completed' || m.status == 'Confirmed'; })
        for (var i = 0; i < pendingMilestones.length; i++) {
          log.write("PurchaseService ::: updatePurchaseOrder :: amountToDeduct : " + amountToDeduct);
          if (amountToDeduct > 0) {
            var milestone = pendingMilestones[i];
            var milestoneStatus = milestone.status;
            milestone.set('status', 'Archived');
            await milestone.save();

            var milestoneAmount = milestone.amount;
            log.write("PurchaseService ::: updatePurchaseOrder :: milestoneAmount : " + milestoneAmount);

            if (milestoneAmount > amountToDeduct) {
              milestoneAmount = milestoneAmount - amountToDeduct;
              milestone = milestone.toJSON();
              delete milestone.id;

              milestone.amount = milestoneAmount;
              milestone.status = milestoneStatus;
              milestone = await PurchaseOrderMilestone.create(milestone);
              log.write("PurchaseService ::: updatePurchaseOrder :: milestone : ", milestone.toJSON());
              amountToDeduct = 0;
              return;
            } else if (milestoneAmount < amountToDeduct) {
              amountToDeduct = amountToDeduct - milestoneAmount;
            }
          }

          if (amountToDeduct > 0) {
            pendingMilestones = _.filter(purchaseOrder.milestones, function(m) { return m.status == 'Approved' })
            for (var i = 0; i < pendingMilestones.length; i++) {
              if (amountToDeduct > 0) {
                var milestone = pendingMilestones[i];
                milestone.set('status', 'Archived');
                await milestone.save();

                var milestoneAmount = milestone.amount;

                if (milestoneAmount > amountToDeduct) {
                  milestoneAmount = milestoneAmount - amountToDeduct;
                  milestone = milestone.toJSON();
                  delete milestone.id;

                  milestone.amount = milestoneAmount;
                  mileStone.status = 'Completed';
                  await PurchaseOrderMilestone.create(milestone);
                  amountToDeduct = 0;
                  return;
                } else if (milestoneAmount < amountToDeduct) {
                  amountToDeduct = amountToDeduct - milestoneAmount;
                }
              }
            }
          }
        }
      }

      purchaseOrder.set("amount", amount);
      await purchaseOrder.save();

      services.updatePurchaseOrderLedger(data.id);
    } else {
      throw ("Paid Amount is greater than new items amount");
    }

    return purchaseItems;
  } catch (e) {
    log.write("PurchaseService ::: updatePurchaseOrder :: exception : ", e);
    throw (e);
  }
}
service.savePurchaseOrderInvoice = async (data, username) => {
  try {
    log.write("PurchaseService ::: savePurchaseOrderInvoice :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await PurchaseOrderInvoice.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await PurchaseOrderInvoice.create(data);
    }
    PurchaseOrder.update({ taxInvoiceId: item.id }, { where: { id: data.purchaseOrderId } });
    return item;
  } catch (e) {
    log.write("PurchaseService ::: savePurchaseOrderInvoice :: exception : ", e);
    throw (e);
  }
}
service.savePurchaseOrderInvoiceGsts = async (data, username) => {
  try {
    log.write("PurchaseService ::: savePurchaseOrderInvoiceGsts :: data : ", data);
    var item = { gstSlabs: [] };
    await PurchaseOrderInvoiceGst.destroy({
      where: {
        purchaseOrderInvoiceId: data.gstSlabs[0].purchaseOrderInvoiceId,
        isVerification: data.gstSlabs[0].isVerification
      }
    });
    for (var i = 0; i < data.gstSlabs.length; i++) {
      data.gstSlabs[i].updated = new Date();
      data.gstSlabs[i].updatedBy = username;
      var slab = await PurchaseOrderInvoiceGst.create(data.gstSlabs[i]);
      item.gstSlabs.push(slab);
    }

    if (data.gstVerificationStatus && data.id) {
      await PurchaseOrderInvoice.update({ gstFileId: data.gstFileId, gstVerificationStatus: data.gstVerificationStatus }, { where: { id: data.id } });
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: savePurchaseOrderInvoiceGsts :: exception : ", e);
    throw (e);
  }
}

service.listPurchaseOrderInvoices = async (data) => {
  try {
    log.write("PurchaseService ::: listPurchaseOrderInvoices :: data : ", data);

    var searchSql = "";
    if (data.filters) {
      if (data.filters.statuses && data.filters.statuses.length) {
        var statuses = [];
        _.each(data.filters.statuses, function(s) {
          statuses.push("'" + s + "'");
        })
        searchSql = " and i.gstVerificationStatus in (" + statuses.join(',') + ") ";
      }
      if (data.filters.search && data.filters.search != '') {
        searchSql = searchSql + " and (lower(v.name) like '" + data.filters.search + "%' or lower(p.refNo) like '" + data.filters.search + "%') ";
      }
      if (data.filters.dateFrom && data.filters.dateFrom != '' && data.filters.dateTo && data.filters.dateTo != '') {
        searchSql = searchSql + " and date(p.date)>='" + data.filters.dateFrom + "' and date(p.date)<='" + data.filters.dateTo + "' ";
      }
    }
    var sortSql = " i.id desc";
    if (data.sortBy && data.sortOrder) {
      sortSql = data.sortBy + " " + data.sortOrder;
    }
    var sql = `select i.id, i.gstFileId, i.docId, p.refNo, pp.title project, v.name vendor, i.taxableAmount, i.gst, 
                i.purchaseOrderId, i.invoiceNo, i.amount, p.date, i.gstVerificationStatus
                from vendor_purchase_order_invoices i
                left join vendor_purchase_orders p on p.id=i.purchaseOrderId
                left join vendor_projects pp on pp.id = p.projectId
                left join vendors v on v.id = p.vendorId
                 where p.companyId=` + data.companyId + ` and p.isBill=0 ` + searchSql + ` 
                 order by ` + sortSql + `
                 limit ` + data.offset + `, ` + data.limit + ``;

    log.write("ReportsService ::: listPurchaseOrderInvoices :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: listPurchaseOrderInvoices :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("PurchaseService ::: listPurchaseOrderInvoices :: exception : ", e);
    throw (e);
  }
}
service.getPurchaseOrderInvoiceGsts = async (purchaseOrderInvoiceId) => {
  try {
    log.write("PurchaseService ::: getPurchaseOrderInvoiceGsts :: purchaseOrderInvoiceId : ", purchaseOrderInvoiceId);
    var gstSlabs = await PurchaseOrderInvoice.findOne({
      where: { id: purchaseOrderInvoiceId },
      include: ['gstFile', 'gstSlabs']
    });
    // log.write("PurchaseService ::: getPurchaseOrderInvoiceGsts :: gstSlabs : ", gstSlabs);
    return gstSlabs;
  } catch (e) {
    log.write("PurchaseService ::: getPurchaseOrderInvoiceGsts :: exception : ", e);
    throw (e);
  }
}


service.listVendorTdsPayments = async (data) => {
  try {
    log.write("PurchaseService ::: listVendorTdsPayments :: data : ", data);

    var searchSql = "";
    if (data.filters) {
      if (data.filters.notPaid) {
        searchSql = " and tp.id is null ";
      }
      if (data.filters.search && data.filters.search != '') {
        searchSql = searchSql + " and (lower(v.name) like '" + data.filters.search.toLowerCase() + "%' or lower(p.refNo) like '" + data.filters.search.toLowerCase() + "%') ";
      }
    }
    var sortSql = " v.name";
    if (data.sortBy && data.sortOrder) {
      if (data.sortBy == 'invoicesCount') {
        sortSql = " count(i.id) " + data.sortOrder;
      } else if (data.sortBy == 'status') {
        sortSql = " tp.id " + data.sortOrder;
      } else {
        sortSql = data.sortBy + " " + data.sortOrder;
      }
    }
    var sql = `select i.id,v.id vendorId, v.name vendor, i.invoiceDate, ifnull(sum(i.taxableAmount),0) taxableAmount, ifnull(sum(i.tds),0) tds, count(i.id) invoices,
               tp.amount, tp.date, ct.dueDate,tp.id paymentId, d.file
              from vendor_purchase_order_invoices i
              left join vendor_purchase_orders p on p.id=i.purchaseOrderId 
              left join vendors v on v.id = p.vendorId
              left join vendor_tds_compliance_terms ct on  ct.dateFrom='` + data.filters.dateFrom + `'
              left join vendor_tds_payments tp on ct.id=tp.complianceTermId and tp.vendorId=p.vendorId 
              left join docs d on d.id=tp.tdsFileId
               where p.companyId=` + data.companyId + ` and p.isBill=0 ` + searchSql + `
               and i.invoiceDate BETWEEN '` + data.filters.dateFrom + `' and '` + data.filters.dateTo + `'  
              group by p.vendorId, month(i.invoiceDate)
              order by ` + sortSql;

    log.write("ReportsService ::: listVendorTdsPayments :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: listVendorTdsPayments :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("PurchaseService ::: listVendorTdsPayments :: exception : ", e);
    throw (e);
  }
}
service.getVendorTdsPayments = async (data) => {
  try {
    log.write("PurchaseService ::: getVendorTdsPayments :: data : ", data);
    var sql = `select i.id, pp.title project, p.refNo, i.invoiceDate, ifnull(sum(i.taxableAmount),0) taxableAmount,
               ifnull(sum(i.tds),0) tds, i.invoiceNo, tp.amount, tp.date, ct.dueDate, tp.id paymentId
              from vendor_purchase_order_invoices i
              left join vendor_purchase_orders p on p.id=i.purchaseOrderId 
              left join vendor_projects pp on pp.id=p.projectId
              left join vendors v on v.id = p.vendorId
              left join vendor_tds_compliance_terms ct on  ct.dateFrom='` + data.dateFrom + `'
              left join vendor_tds_payments tp on ct.id=tp.complianceTermId and tp.vendorId=p.vendorId 
               where p.companyId=` + data.companyId + ` and p.isBill=0 and p.vendorId=` + data.vendorId + `
               and i.invoiceDate BETWEEN '` + data.dateFrom + `' and '` + data.dateTo + `'  
              group by i.id order by i.invoiceDate`;

    log.write("ReportsService ::: getVendorTdsPayments :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getVendorTdsPayments :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("PurchaseService ::: getVendorTdsPayments :: exception : ", e);
    throw (e);
  }
}
service.saveVendorTdsPayment = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveVendorTdsPayment :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (item.id) {
      await TdsPayment.update(data, { where: { id: data.id } });
      item = data
    } else {
      item = await TdsPayment.create(data);

      item = await TdsPayment.findOne({
        where: { id: item.id },
        include: ['vendor', 'file', 'complianceTerm']
      })
      var company = await Company.findOne({ where: { id: item.companyId } });
      data = {
        vendorName: item.vendor.name,
        month: utils.moment(item.complianceTerm.dateFrom).format("MMM YYYY"),
        amount: item.amount,
        paymentDate: utils.moment(item.date).format("MMM DD, YYYY"),
        teamName: company.name
      }
      var html = await services.getMailBody("emails/vendor_tds_payment_notification.html", data);
      // log.write("BookingService ::: sendInvoice :: html body : " + html.length);
      var attachments = [{ filename: item.file.name, path: item.file.file }];

      var subject = company.name + " : " + utils.moment(item.date).format("MMM YYYY") + " TDS Payment";
      services.sendMail(subject, html, [{
        name: item.vendor.name,
        email: item.vendor.email,
        vendorId: item.vendor.id
      }], attachments);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveVendorTdsPayment :: exception : ", e);
    throw (e);
  }
}
service.listVendorTdsComplianceTerms = async (data) => {
  try {
    log.write("PurchaseService ::: listVendorTdsComplianceTerms :: data : ", data);
    var where = { year: data.year, archieved: 0, companyId: data.companyId };
    var results = await TdsComplianceTerm.findAll({
      where: where
    });
    log.write("PurchaseService ::: listVendorTdsComplianceTerms :: SkuTypes count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listVendorTdsComplianceTerms :: exception : ", e);
    throw (e);
  }
}
service.saveTdsComplianceTerm = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveTdsComplianceTerm :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    await TdsComplianceTerm.update({ archieved: 1 }, { where: { year: data.year } });
    for (var i = 0; i < data.terms.length; i++) {
      item = data.terms[i];
      delete item.id;
      item.year = data.year;
      item.archieved = 0;
      item.companyId = data.companyId;
      item = await TdsComplianceTerm.create(item);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveTdsComplianceTerm :: exception : ", e);
    throw (e);
  }
}
service.listVendorGstComplianceTerms = async (data) => {
  try {
    log.write("PurchaseService ::: listVendorGstComplianceTerms :: data : ", data);
    var where = { year: data.year, archieved: 0, companyId: data.companyId };
    var results = await GstComplianceTerm.findAll({
      where: where
    });
    log.write("PurchaseService ::: listVendorGstComplianceTerms :: SkuTypes count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listVendorGstComplianceTerms :: exception : ", e);
    throw (e);
  }
}
service.saveGstComplianceTerm = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveGstComplianceTerm :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    await GstComplianceTerm.update({ archieved: 1 }, { where: { year: data.year } });
    for (var i = 0; i < data.terms.length; i++) {
      item = data.terms[i];
      delete item.id;
      item.year = data.year;
      item.archieved = 0;
      item.companyId = data.companyId;
      item = await GstComplianceTerm.create(item);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveGstComplianceTerm :: exception : ", e);
    throw (e);
  }
}



exports.service = service;