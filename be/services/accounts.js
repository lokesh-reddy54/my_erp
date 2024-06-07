"use strict";

var Q = require("q");
var moment = require("moment");
var _ = require("lodash");
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var nodemailer = require("nodemailer");
var request = require("request-promise");
var atob = require("atob");
// var request = require("request");

var config = require("../utils/config").config;
var session = require("./session");
var log = require("../utils/log").log;
var utils = require("../utils/utils").utils;
var systemUtils = require("./utils/system_util").utils;

var Constants = require("./models/constants");
var OpexCategory = require("./models/base").OpexCategory;
var Building = require("./models/base").Building;
var OpexType = require("./models/base").OpexType;
var OpexPayment = require("./models/base").OpexPayment;
var BillsQueue = require("./models/base").BillsQueue;
var BillsQueueGst = require("./models/base").BillsQueueGst;
var Booking = require("./models/base").Booking;
var Vendor = require("./models/base").Vendor;
var PurchaseOrder = require("./models/base").PurchaseOrder;
var PurchaseItem = require("./models/base").PurchaseItem;
var PurchaseOrderInvoice = require("./models/base").PurchaseOrderInvoice;
var PurchaseOrderInvoiceGst = require("./models/base").PurchaseOrderInvoiceGst;
var PurchaseOrderMilestone = require("./models/base").PurchaseOrderMilestone;
var PayinEntry = require("./models/base").PayinEntry;
var PayoutEntry = require("./models/base").PayoutEntry;
var PayoutPayment = require("./models/base").PayoutPayment;
var PayoutBenificiary = require("./models/base").PayoutBenificiary;
var Payment = require("./models/base").Payment;
var Office = require("./models/base").Office;
var InvoiceService = require("./models/base").InvoiceService;
var Invoice = require("./models/base").Invoice;
var InvoiceItem = require("./models/base").InvoiceItem;
var PgTransaction = require("./models/base").PgTransaction;
var ProviderService = require("./models/base").ProviderService;
var Provider = require("./models/base").Provider;
var ProviderBankAccount = require("./models/base").ProviderBankAccount;
var ProviderPortal = require("./models/base").ProviderPortal;
var ProviderPayment = require("./models/base").ProviderPayment;
var ProviderBill = require("./models/base").ProviderBill;
var OpexPayment = require("./models/base").OpexPayment;
var OpexBill = require("./models/base").OpexBill;
var Client = require("./models/base").Client;
var VendorBankAccount = require("./models/base").VendorBankAccount;
var ExitRequest = require("./models/base").ExitRequest;
var Doc = require("./models/base").Doc;

var services = require("./services").service;
var service = {};

service.listOpexCategories = async (data) => {
  try {
    log.write("PurchaseService ::: listOpexCategories :: data : ", data);
    var where = { companyId: { $in: [data.companyId, -1] } };
    if (data.filters.search && data.filters.search != "") {
      where["name"] = { $like: "%" + data.filters.search + "%" };
    }
    if (data.filters.active && data.filters.active != "") {
      where["active"] = data.filters.active;
    }
    where["office"] = data.filters.office;
    var results = await OpexCategory.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("PurchaseService ::: listOpexCategories :: OpexCategories count : " +
        results.length);
    var cats = [];
    _.each(results, function (r) {
      r = r.toJSON();
      if (r.companyId > 0) {
        r.system = false;
      } else {
        r.system = true;
      }
      cats.push(r);
    });
    log.write(
      "PurchaseService ::: listOpexCategories :: OpexCategories : ",
      cats
    );
    return cats;
  } catch (e) {
    log.write("PurchaseService ::: listOpexCategories :: exception : ", e);
    throw e;
  }
};
service.saveOpexCategory = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveOpexCategory :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await OpexCategory.update(data, { where: { id: data.id } });
      item = data;
    } else {
      item = await OpexCategory.create(data);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveOpexCategory :: exception : ", e);
    throw e;
  }
};
service.listOpexTypes = async (data) => {
  try {
    log.write("PurchaseService ::: listOpexTypes :: data : ", data);
    var where = {};
    if (data.filters.search && data.filters.search != "") {
      where["name"] = { $like: "%" + data.filters.search + "%" };
    }
    if (data.filters.active && data.filters.active != "") {
      where["active"] = data.filters.active;
    }
    if (data.filters.catId && data.filters.catId != "") {
      where["catId"] = data.filters.catId;
    }
    if (data.filters.typeId && data.filters.typeId != "") {
      where["typeId"] = data.filters.typeId;
    }
    var results = await OpexType.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("PurchaseService ::: listOpexTypes :: OpexTypes count : " + results.length);
    return results;
  } catch (e) {
    log.write("PurchaseService ::: listOpexTypes :: exception : ", e);
    throw e;
  }
};
service.saveOpexType = async (data, username) => {
  try {
    log.write("PurchaseService ::: saveOpexType :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await OpexType.update(data, { where: { id: data.id } });
      item = data;
    } else {
      item = await OpexType.create(data);
    }
    return item;
  } catch (e) {
    log.write("PurchaseService ::: saveOpexType :: exception : ", e);
    throw e;
  }
};
service.listOpexPayments = async (data) => {
  try {
    log.write("AccountsService ::: listOpexPayments :: data : ", data);
    if (!data.filters || !data.filters.buildingId) {
      throw "Please specify building";
    }
    var where = { buildingId: data.filters.buildingId };
    var attributes;
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    } else {
      where.status = { $notIn: ["Declined"] };
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("vendor.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("opexType.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("office.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      where["$and"] = { $or: $or };
    }
    var include = [
      { as: "vendor", model: Vendor, required: false },
      { as: "office", model: Office, required: false },
      {
        as: "opexType",
        model: OpexType,
        where: { active: 1 },
        include: [
          {
            as: "type",
            model: OpexType,
            required: false,
            include: ["category"],
          },
          { as: "category", model: OpexCategory, required: false },
        ],
      },
    ];
    if (data.companyId) {
      where.companyId = data.companyId;
    }
    log.write("AccountsService ::: listOpexPayments :: where : ", where);
    var results = await OpexPayment.findAll({
      where: where,
      include: include,
      offset: data.offset,
      limit: data.limit,
      order: [["id", "desc"]],
    });
    log.write(
      "AccountsService ::: listOpexPayments :: results count : " +
        results.length
    );
    var payments = [];
    var opexCategories = await service.getOpexCategories({
      where: {
        active: 1,
        companyId: { $in: [data.companyId, -1] },
        default: 1,
        recurring: 1,
      },
    });

    log.write("AccountsService ::: listOpexPayments :: opexCategories count : " +
        opexCategories.length );

    if (!results.length) {
      for (var i = 0; i < opexCategories.length; i++) {
        var c = opexCategories[i];
        for (var j = 0; j < c.types.length; j++) {
          var type = c.types[j];
          if (type.items.length) {
            for (var k = 0; k < type.items.length; k++) {
              log.write("AccountsService ::: listOpexPayments :: item : ",
                type.items[k].toJSON());
              if (type.items[k].default) {
                var payment = {
                  buildingId: data.filters.buildingId,
                  opexTypeId: type.items[k].id,
                  companyId: data.companyId,
                  status: "Draft",
                };
                payment = await OpexPayment.create(payment);
                log.write( "AccountsService ::: listOpexPayments :: item paymentCreated : ",
                  payment.toJSON() );
              }
            }
          } else {
            log.write( "AccountsService ::: listOpexPayments :: type : ", type.toJSON());
            if (type.default) {
              var payment = {
                buildingId: data.filters.buildingId,
                opexTypeId: type.id,
                status: "Draft",
                companyId: data.companyId,
              };
              payment = await OpexPayment.create(payment);
              log.write(
                "AccountsService ::: listOpexPayments :: type paymentCreated : ",
                payment.toJSON()
              );
            }
          }
        }
      }
      return await service.listOpexPayments(data);
    } else {
      _.each(results, function (r) {
        var payment = r.toJSON();
        payment.officeId = r.office ? r.office.id : null;
        payment.office = r.office ? r.office.name : null;
        payment.providerName = r.vendor ? r.vendor.name : null;
        if (r.opexType && r.opexType.type) {
          payment.opexCategory = r.opexType.type.category.name;
          payment.opexType = r.opexType.type.name;
          payment.opexItem = r.opexType.name;
        } else if (r.opexType) {
          payment.opexCategory = r.opexType.category
            ? r.opexType.category.name
            : null;
          payment.opexType = r.opexType.name;
          payment.opexItem = null;
        }
        payments.push(payment);
      });
    }
    return { payments: payments, opexCategories: opexCategories };
  } catch (e) {
    log.write("AccountsService ::: listOpexPayments :: exception : ", e);
    throw e;
  }
};
service.getOpexCategories = async (data) => {
  try {
    log.write("AccountsService ::: getOpexCategories :: data : ", data);
    var where = { active: 1, companyId: { $in: [data.companyId, -1] } };
    if (data.where) {
      where = data.where;
    }
    if (data.office) {
      where.office = data.office;
    } else {
      where.office = 0;
    }
    var opexCategories = await OpexCategory.findAll({
      where: where,
      include: [
        {
          as: "types",
          model: OpexType,
          required: false,
          where: { active: 1 },
          include: [
            {
              as: "items",
              required: false,
              model: OpexType,
              where: { active: 1 },
            },
          ],
        },
      ],
    });
    return opexCategories;
  } catch (e) {
    log.write("AccountsService ::: getOpexCategories :: exception : ", e);
    throw e;
  }
};

service.saveOpexPayment = async (data, username) => {
  try {
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      if (data.approved) {
        data.approvedBy = username;
        data.approvedOn = new Date();
        data.status = "Approved";
      }
      await OpexPayment.update(data, { where: { id: data.id } });
      item = data;
    } else {
      data.date = new Date();
      data.by = username;
      data.status = "Draft";
      item = await OpexPayment.create(data);
      // if (data.paymentMode == 'BankTransfer') {
      //   var client = {
      //     id: item.id,
      //     accountNumber: data.bankAccountNumber,
      //     ifscCode: data.bankIfscCode,
      //     name: data.bankAccountName,
      //     email: data.contactEmail,
      //     phone: data.contactPhone,
      //   }
      //   var benificiary = await services.addCashFreeBenificiaryForRefund(client, item.companyId);
      //   item.set("benificiaryId", benificiary.id);
      //   item.save();
      // }
    }
    return item;
  } catch (e) {
    log.write("AccountService ::: saveOpexPayment :: exception : ", e);
    throw e;
  }
};
service.listOpexBills = async (data) => {
  try {
    log.write("AccountsService ::: listOpexBills :: data : ", data);
    var where = { isBill: 1, isOpex: 1 };
    var attributes;
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    if (data.filters.statuses && data.filters.statuses.length) {
      where["status"] = { $in: data.filters.statuses };
    }
    if (data.filters.noImages) {
      where["imageId"] = { $eq: null };
    }
    if (data.filters.noPostingData) {
      where["$and"] = [
        { serviceProviderId: { $eq: null } },
        { buildingId: { $eq: null } },
        { opexTypeId: { $eq: null } },
      ];
    }
    if (data.filters.buildingIds && data.filters.buildingIds.length) {
      where["buildingId"] = { $in: data.filters.buildingIds };
    } else if (data.filters.buildingId && data.filters.buildingId != "") {
      where["buildingId"] = data.filters.buildingId;
    } else if (!data.filters.isHq) {
      where["buildingId"] = { $or: [{ $gt: 0 }, { $eq: null }] };
    } else if (data.filters.isHq) {
      where["buildingId"] = { $or: [{ $eq: -1 }, { $eq: null }] };
    }
    if (data.filters.dateFrom && data.filters.dateTo) {
      where["date"] = {
        $between: [
          utils.moment(data.filters.dateFrom).toDate(),
          utils.moment(data.filters.dateTo).toDate(),
        ],
      };
    }
    if (data.filters.accountedFrom && data.filters.accountedTo) {
      where["$item.dateFrom$"] = {
        $between: [
          utils.moment(data.filters.accountedFrom).toDate(),
          utils.moment(data.filters.accountedTo).toDate(),
        ],
      };
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      if (query.search.indexOf("<") > -1) {
        var index = query.search.indexOf("<");
        var number = parseInt(query.search.substr(index + 1));
        if (number > 0) {
          where["amount"] = { $lte: number };
        }
      } else if (query.search.indexOf(">") > -1) {
        var index = query.search.indexOf(">");
        var number = parseInt(query.search.substr(index + 1));
        if (number > 0) {
          where["amount"] = { $gte: number };
        }
      } else {
        if (query.search.indexOf("-") > -1) {
          var numbers = query.search.split("-");
          if (numbers.length > 1 && numbers[0] > 0 && numbers[1] > 0) {
            where["amount"] = {
              $and: [{ $gte: numbers[0] }, { $lte: numbers[1] }],
            };
          }
        }
        if (parseInt(query.search) > 0) {
          $or.push({ amount: parseInt(query.search) });
        }
        $or.push(
          Sequelize.where(
            Sequelize.fn("lower", Sequelize.literal("`vendor`.`name`")),
            {
              $like: query.search.toLowerCase() + "%",
            }
          )
        );
        $or.push(
          Sequelize.where(
            Sequelize.fn("lower", Sequelize.literal("`item->opexType`.name")),
            {
              $like: query.search.toLowerCase() + "%",
            }
          )
        );
        $or.push(
          Sequelize.where(
            Sequelize.fn(
              "lower",
              Sequelize.literal("`item->opexType->category`.name")
            ),
            {
              $like: query.search.toLowerCase() + "%",
            }
          )
        );
        $or.push(
          Sequelize.where(
            Sequelize.fn("lower", Sequelize.literal("`office`.name")),
            {
              $like: query.search.toLowerCase() + "%",
            }
          )
        );
        $or.push(
          Sequelize.where(
            Sequelize.fn("lower", Sequelize.literal("`building`.name")),
            {
              $like: query.search.toLowerCase() + "%",
            }
          )
        );
        $or.push(
          Sequelize.where(
            Sequelize.fn(
              "lower",
              Sequelize.literal("`vendor_purchase_orders`.refNo")
            ),
            {
              $like: query.search.toLowerCase() + "%",
            }
          )
        );
        where["$and"] = { $or: $or };
      }
    }
    var include = [
      "building",
      "vendor",
      "office",
      { as: "opexPayment", model: OpexPayment, required: false },
      { as: "milestone", model: PurchaseOrderMilestone, required: false },
      {
        as: "taxInvoice",
        model: PurchaseOrderInvoice,
        required: false,
        include: [
          { as: "file", model: Doc, required: false },
          { as: "gstSlabs", model: PurchaseOrderInvoiceGst, required: false },
          { as: "gstFile", model: Doc, required: false },
        ],
      },
      {
        as: "item",
        model: PurchaseItem,
        include: [
          {
            as: "opexType",
            required: false,
            model: OpexType,
            where: { active: 1 },
            include: [
              {
                as: "type",
                model: OpexType,
                required: false,
                include: ["category"],
              },
              { as: "category", model: OpexCategory, required: false },
            ],
          },
        ],
      },
    ];
    if (data.companyId) {
      where.companyId = data.companyId;
    }
    log.write(
      "AccountsService ::: listOpexBills :: include : ",
      JSON.stringify(include, null, 2)
    );
    log.write(
      "AccountsService ::: listOpexBills :: where : ",
      JSON.stringify(where, null, 2)
    );
    var orderBy = [["id", "desc"]];
    if (data.sortBy) {
      if (data.sortBy === "opexType.name") {
        orderBy = [
          [Sequelize.literal("`item->opexType`.name"), data.sortOrder],
        ];
      } else if (data.sortBy.split(".").length) {
        orderBy = [[Sequelize.literal(data.sortBy), data.sortOrder]];
      } else {
        orderBy = [[data.sortBy, data.sortOrder]];
      }
    }
    var results = await PurchaseOrder.findAll({
      where: where,
      subQuery: false,
      include: include,
      offset: data.offset,
      limit: data.limit,
      order: orderBy,
    });
    log.write(
      "AccountsService ::: listOpexBills :: results count : " + results.length
    );
    var bills = [];
    _.each(results, function (r) {
      r = r.toJSON();
      // log.write("AccountsService ::: listOpexBills :: bill : ", r);
      var bill = {
        id: r.id,
        opexTypeId: r.item ? r.item.opexTypeId : null,
        opexType: r.opexType ? r.opexType.name : null,
        opexItem: r.opexType && r.opexType.type ? r.opexType.type.name : null,
        serviceProviderId: r.vendorId,
        vendorId: r.vendorId,
        providerName: r.vendor ? r.vendor.name : null,
        vendorText: r.vendorText,
        portal: r.vendor ? r.vendor.portal : null,
        amountType: r.opexPayment ? r.opexPayment.amountType : null,
        minCharge: r.opexPayment ? r.opexPayment.minCharge : null,
        maxCharge: r.opexPayment ? r.opexPayment.maxCharge : null,
        approvalRequired: r.opexPayment ? r.opexPayment.approvalRequired : null,
        paymentMode: r.vendor ? r.vendor.paymentMode : null,
        opexPaymentId: r.opexPaymentId,
        buildingId: r.buildingId,
        building: r.building ? r.building.name : null,
        officeId: r.officeId,
        office: r.office ? r.office.name : null,
        amount: r.amount,
        refNo: r.refNo,
        indexNo: r.taxInvoice ? r.taxInvoice.billNo : null,
        gstSlabs: r.taxInvoice ? r.taxInvoice.gstSlabs : null,
        billDate: r.date,
        dateFrom: r.item ? r.item.dateFrom : null,
        dateTo: r.item ? r.item.dateTo : null,
        mileStoneId: r.milestone ? r.milestone.id : null,
        billDueDate:
          (r.milestone ? r.milestone.actualDate : null) ||
          (r.milestone ? r.milestone.expectedDate : null) ||
          (r.taxInvoice ? r.taxInvoice.invoiceDueDate : null),
        status: r.status,
        taxInvoiceId: r.taxInvoice ? r.taxInvoice.id : null,
        image: r.taxInvoice ? r.taxInvoice.file : null,
        gstFile: r.taxInvoice ? r.taxInvoice.gstFile : null,
        paidOn: r.milestone ? r.milestone.paidOn : null,
        paidBy: r.milestone ? r.milestone.paidBy : null,
        utr: r.milestone ? r.milestone.utr : null,
      };
      // log.write("AccountsService ::: listOpexBills :: OpexType : ", r.opexType)
      if (r.item && r.item.opexType) {
        bill.opexCategoryId = r.item.opexType.category
          ? r.item.opexType.category.id
          : r.item.opexType.type.category.id;
        bill.opexCategory = r.item.opexType.category
          ? r.item.opexType.category.name
          : r.item.opexType.type.category.name;

        if (r.item.opexType.type) {
          bill.opexItem = r.item.opexType ? r.item.opexType.name : null;
          bill.opexType =
            r.item.opexType && r.item.opexType.type
              ? r.item.opexType.type.name
              : null;
        } else {
          bill.opexType = r.item.opexType ? r.item.opexType.name : null;
        }
      }
      bills.push(bill);
    });
    return bills;
  } catch (e) {
    log.write("AccountsService ::: listOpexBills :: exception : ", e);
    throw e;
  }
};
service.listBillItems = async (data) => {
  try {
    log.write("AccountsService ::: listBillItems :: data : ", data);
    var items = await PurchaseItem.findAll({
      attributes: [
        "id",
        "taxableAmount",
        "gst",
        "tds",
        "amount",
        "dateFrom",
        "dateTo",
      ],
      where: {
        purchaseOrderId: data.purchaseOrderId,
        status: { $notIn: ["Archived"] },
      },
    });
    return items;
  } catch (e) {
    log.write("AccountsService ::: getOpexCategories :: exception : ", e);
    throw e;
  }
};
service.saveOpexBill = async (data, username) => {
  try {
    log.write("AccountsService ::: saveOpexBill :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;

    if (data.billUploaded) {
      data.indexNo = await systemUtils.getRefNo(
        "BillIndexNo",
        null,
        data.billDate,
        data.companyId
      );
      data.status = data.status == "PrePaid" ? "PrePaid" : "New";

      if (data.taxInvoiceId) {
        await PurchaseOrderInvoice.update(
          {
            docId: data.imageId,
            billNo: data.indexNo,
            invoiceDate: data.billDate,
          },
          { where: { id: data.taxInvoiceId } }
        );
      } else {
        var invoice = await PurchaseOrderInvoice.create({
          purchaseOrderId: data.id,
          docId: data.imageId,
          billNo: data.indexNo,
          invoiceDate: data.billDate,
        });
        data.taxInvoiceId = invoice.id;
      }
    }
    if (
      (data.status == "Draft" || data.status == "Raised") &&
      data.indexNo &&
      data.buildingId &&
      ((data.vendorId && data.opexTypeId) || data.noVendor)
    ) {
      data.status = "New";
    }
    if (data.id) {
      log.write("AccountsService ::: saveOpexBill :: updating data : ", data);
      await PurchaseOrder.update(data, { where: { id: data.id } });

      if (data.mileStoneId && data.billDueDate) {
        PurchaseOrderMilestone.update(
          { expectedDate: data.billDueDate },
          { where: { id: data.mileStoneId } }
        );
      }
      if (data.processPayout) {
        var opexBill = await PurchaseOrder.findOne({
          where: { id: data.id },
          include: [
            "item",
            "milestone",
            {
              as: "vendor",
              model: Vendor,
              required: false,
              include: [
                {
                  as: "bankAccounts",
                  model: VendorBankAccount,
                  required: false,
                  where: { active: 1 },
                },
              ],
            },
          ],
        });
        // log.write("AccountsService ::: saveOpexBill :: opexBill : ", opexBill.toJSON());
        // if (opexBill.vendor && opexBill.vendor.paymentMode == 'BankTransfer') {
        var payoutBenificiaryId;
        if (
          opexBill.vendor &&
          opexBill.vendor.bankAccounts &&
          opexBill.vendor.bankAccounts.length
        ) {
          var payoutBenificiary = await PayoutBenificiary.findOne({
            where: {
              accountNumber: opexBill.vendor.bankAccounts[0].accountNumber,
              active: 1,
            },
          });
          payoutBenificiaryId = payoutBenificiary ? payoutBenificiary.id : null;
        }
        var paymentMode;
        if (opexBill.vendor) {
          if (opexBill.vendor.paymentMode == "BankTransfer") {
            paymentMode = "CashFree";
          } else {
            paymentMode = opexBill.vendor.paymentMode;
          }
        }
        var payoutPayment = await PayoutPayment.create({
          payoutBenificiaryId: payoutBenificiaryId,
          paymentMode: paymentMode,
          info:
            data.info ||
            (opexBill.vendor ? opexBill.vendor.name : "") + " bill",
          amount: opexBill.amount,
          approvedBy: username,
          approvedOn: new Date(),
          type: "BillPayment",
          status: opexBill.item.isPrepaid ? "PrePaid" : "Approved",
          paidOn: opexBill.milestone.isPrepaid
            ? opexBill.milestone.paidOn
            : null,
          paidBy: opexBill.milestone.isPrepaid
            ? opexBill.milestone.paidBy
            : null,
          purchaseOrderId: opexBill.id,
          pettyCashAccountId: opexBill.milestone.pettyCashAccountId,
          debitCardAccountId: opexBill.milestone.debitCardAccountId,
          updated: new Date(),
          updatedBy: username,
          companyId: opexBill.companyId,
        });
        data.payoutId = payoutPayment.id;
        data.status = "Approved";
        await PurchaseOrderMilestone.update(
          { status: data.status, payoutId: data.payoutId },
          { where: { purchaseOrderId: data.id } }
        );
        await PurchaseOrder.update(
          { status: data.status },
          { where: { id: data.id } }
        );
        // }
      } else if (data.items && data.items.length) {
        await PurchaseItem.destroy({ where: { purchaseOrderId: data.id } });
        for (var i = 0; i < data.items.length; i++) {
          // if (data.items[i].id) {
          //   await PurchaseItem.update(data.items[i], { where: { id: data.items[i].id } });
          // } else {
          data.items[i].status = "Ordered";
          await PurchaseItem.create(data.items[i]);
          // }
        }
      }
      if (data.opexTypeId) {
        await PurchaseItem.update(
          { opexTypeId: data.opexTypeId },
          { where: { purchaseOrderId: data.id } }
        );
      }
      item = data;
    }
    return item;
  } catch (e) {
    log.write("AccountService ::: saveOpexBill :: exception : ", e);
    throw e;
  }
};

service.listBillsQueue = async (data) => {
  try {
    log.write("AccountsService ::: listBillsQueue :: data : ", data);
    var where = {};
    var attributes;
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    if (data.filters.statuses && data.filters.statuses.length) {
      where["status"] = { $in: data.filters.statuses };
    }
    if (data.filters.buildingIds && data.filters.buildingIds.length) {
      where["buildingId"] = { $in: data.filters.buildingIds };
    } else if (data.filters.buildingId && data.filters.buildingId != "") {
      where["buildingId"] = data.filters.buildingId;
    } else if (!data.filters.isHq) {
      // where['buildingId'] = { $or: [{ $gt: 0 }, { $eq: null }] }
    } else if (data.filters.isHq) {
      // where['buildingId'] = { $or: [{ $eq: -1 }, { $eq: null }] }
    }
    if (data.filters.dateFrom && data.filters.dateTo) {
      where["billDate"] = {
        $between: [
          utils.moment(data.filters.dateFrom).toDate(),
          utils.moment(data.filters.dateTo).toJSON(),
        ],
      };
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`vendor`.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`serviceProvider`.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`opexType`.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`opexType->category`.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`office`.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`building`.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      where["$and"] = { $or: $or };
    }
    //
    var include = [
      "project",
      "vendor",
      "office",
      "building",
      "image",
      "gstFile",
      "gstSlabs",
      {
        as: "serviceProvider",
        model: Provider,
        required: false,
        include: ["portal"],
      },
      {
        as: "opexType",
        required: false,
        model: OpexType,
        where: { active: 1 },
        include: [
          {
            as: "type",
            model: OpexType,
            required: false,
            include: ["category"],
          },
          { as: "category", model: OpexCategory, required: false },
        ],
      },
    ];
    if (data.companyId) {
      where.companyId = data.companyId;
    }
    log.write("AccountsService ::: listBillsQueue :: where : ", where);
    var orderBy = [["id", "desc"]];
    if (data.sortBy) {
      if (data.sortBy.split(".").length) {
        orderBy = [[Sequelize.literal(data.sortBy), data.sortOrder]];
      } else {
        orderBy = [[data.sortBy, data.sortOrder]];
      }
    }
    var results = await BillsQueue.findAll({
      where: where,
      subQuery: false,
      include: include,
      offset: data.offset,
      limit: data.limit,
      order: orderBy,
    });
    log.write(
      "AccountsService ::: listBillsQueue :: results count : " + results.length
    );
    var bills = [];
    _.each(results, function (r) {
      r = r.toJSON();
      var bill = {
        id: r.id,
        opexTypeId: r.opexTypeId,
        serviceProviderId: r.serviceProviderId,
        providerName: r.serviceProvider ? r.serviceProvider.name : null,
        serviceProviderText: r.serviceProviderText,
        portal: r.serviceProvider ? r.serviceProvider.portal : null,
        paymentMode: r.serviceProvider ? r.serviceProvider.paymentMode : null,
        opexPaymentId: r.opexPayment ? r.opexPayment.opexPaymentId : null,
        projectId: r.projectId,
        buildingId: r.buildingId,
        building: r.building ? r.building.name : null,
        officeId: r.officeId,
        office: r.office ? r.office.name : null,
        amount: r.amount,
        billDate: r.billDate,
        dateFrom: r.dateFrom,
        dateTo: r.dateTo,
        noVendor: r.noVendor,
        billDueDate: r.billDueDate,
        status: r.status,
        image: r.image,
        gstFile: r.gstFile,
        gstSlabs: r.gstSlabs,
        notes: r.notes,
        billType: r.billType,
        paymentType: r.paymentType,
        prepaid: r.prepaid,
        success: r.prepaid,
        addedOn: r.addedOn,
        addedBy: r.addedBy,
        paidOn: r.paidOn,
        paidBy: r.paidBy,
      };
      if (r.vendor) {
        bill.vendorId = r.vendorId;
        bill.providerName = r.vendor.name;
      }
      // log.write("AccountsService ::: listBillsQueue :: OpexType : ", r.opexType)
      if (r.opexType) {
        bill.opexCategoryId = r.opexType.category
          ? r.opexType.category.id
          : r.opexType.type.category.id;
        bill.opexCategory = r.opexType.category
          ? r.opexType.category.name
          : r.opexType.type.category.name;

        if (r.opexType.type) {
          bill.opexItem = r.opexType ? r.opexType.name : null;
          bill.opexType =
            r.opexType && r.opexType.type ? r.opexType.type.name : null;
        } else {
          bill.opexType = r.opexType ? r.opexType.name : null;
        }
      }
      bills.push(bill);
    });
    return bills;
  } catch (e) {
    log.write("AccountsService ::: listBillsQueue :: exception : ", e);
    throw e;
  }
};
service.saveBillsQueue = async (data, username) => {
  try {
    log.write("AccountsService ::: saveBillsQueue :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;

    if ((data.status == "Draft" || data.status == "New") && data.imageId &&
      data.gst != null &&
      (data.serviceProviderId || data.vendorId || data.noVendor) && data.buildingId > -2
    ) {
      data.status = "Raised";
    }
    log.write("AccountsService ::: saveBillsQueue :: updated data : ", data);
    if (data.id) {
      await BillsQueue.update(data, { where: { id: data.id } });
      item = data;
    } else {
      data.addedOn = new Date();
      data.addedBy = username;
      data.status = data.status || "Draft";
      if (data.paymentType == "PrePaid") {
        data.paidOn = data.billDate;
      }
      item = await BillsQueue.create(data);
    }
    await BillsQueueGst.destroy({ where: { billId: item.id } });
    if (data.gstSlabs && data.gstSlabs.length) {
      var gstSlabs = [];
      for (var i = 0; i < data.gstSlabs.length; i++) {
        data.gstSlabs[i].updated = new Date();
        data.gstSlabs[i].updatedBy = username;
        data.gstSlabs[i].billId = item.id;
        log.write(
          "AccountService ::: saveBillsQueue :: gstSlab : ",
          data.gstSlabs[i]
        );
        var slab = await BillsQueueGst.create(data.gstSlabs[i]);
        gstSlabs.push(slab);
      }
      item.gstSlabs = gstSlabs;
    }
    return item;
  } catch (e) {
    log.write("AccountService ::: saveBillsQueue :: exception : ", e);
    throw e;
  }
};
service.mapBillsQueue = async (data, username) => {
  try {
    log.write("AccountsService ::: mapBillsQueue :: data : ", data);
    var item = await BillsQueue.findOne({
      where: { id: data.id },
      include: ["gstSlabs"],
    });
    if (item) {
      // if (data.billType == "Capex") {
      var company = await systemUtils.getCompany(data.companyId);
      var refNo,
        isOpex = 0,
        status = "",
        milestoneName = "";
      if (item.billType == "BuildingOpex" || item.billType == "HOOpex") {
        refNo = await systemUtils.getRefNo("Bill", null, null, company);
        isOpex = 1;
        milestoneName = "Opex Bill Payment";
        status = item.paymentType == "PrePaid" ? "PrePaid" : "New";
      } else {
        refNo = await systemUtils.getRefNo("PurchaseOrder",null,null, company);
        milestoneName = "Capex Bill Payment";
        status = "Raised";
      }
      var bankAccount = await VendorBankAccount.findOne({
        where: { vendorId: item.vendorId, active: 1 },
      });

      var paidAmount = 0,
        paidOn,
        paidBy,
        dueAmount = 0;
      if (item.paymentType == "PrePaid") {
        paidAmount = item.amount;
        paidOn = item.paidOn || item.billDate;
        paidBy = item.paidBy || item.addedBy;
      } else {
        dueAmount = item.amount;
      }
      var taxInvoice = {};
      var purchaseOrder = await PurchaseOrder.create({
        projectId: item.projectId,
        vendorId: item.vendorId,
        buildingId: item.buildingId || -1,
        isBill: 0,
        isOpex: isOpex,
        vendorBankAccountId: bankAccount ? bankAccount.id : null,
        amount: item.amount,
        paidAmount: item.paidAmount,
        dueAmount: item.dueAmount,
        approvedAmount: 0,
        releasedAmount: 0,
        draftAmount: 0,
        refNo: refNo,
        date: item.billDate,
        status: status,
        updated: new Date(),
        updatedBy: username,
        companyId: data.companyId,
      });

      if (item.imageId) {
        data.indexNo = await systemUtils.getRefNo(
          "BillIndexNo",
          null,
          item.billDate,
          data.companyId
        );
        var invoice = await PurchaseOrderInvoice.create({
          purchaseOrderId: purchaseOrder.id,
          amount: item.amount,
          docId: item.imageId,
          gstFileId: item.gstFileId,
          billNo: data.indexNo,
          invoiceDate: item.billDate,
        });
        purchaseOrder.set("taxInvoiceId", invoice.id);
        purchaseOrder.save();
        if (item.gstSlabs.length) {
          for (var i = 0; i < item.gstSlabs.length; i++) {
            var gst = item.gstSlabs[i].toJSON();
            delete gst.id;
            delete gst.billId;
            gst.purchaseOrderInvoiceId = invoice.id;
            gst.updated = new Date();
            gst.updatedBy = username;
            log.write("AccountsService ::: mapBillsQueue :: gst : ", gst);
            await PurchaseOrderInvoiceGst.create(gst);
          }
          invoice.set("gst", _.sumBy(item.gstSlabs, "gst"));
          invoice.set("igst", _.sumBy(item.gstSlabs, "igst"));
          invoice.set("cgst", _.sumBy(item.gstSlabs, "cgst"));
          invoice.set("sgst", _.sumBy(item.gstSlabs, "sgst"));
          invoice.save(); 
        }
      }
      var poItem = await PurchaseItem.create({
        purchaseOrderId: purchaseOrder.id,
        opexTypeId: item.opexTypeId,
        skuId: item.skuId,
        units: 1,
        taxableAmount: item.amount,
        gst: 0,
        amount: item.amount,
        status: "Ordered",
        dateFrom: item.dateFrom,
        dateTo: item.dateTo,
        isPrepaid: item.paymentType == "PrePaid" ? 1 : 0,
      });

      var milestone = {
        purchaseOrderId: purchaseOrder.id,
        status: paidAmount ? "Paid" : "Draft",
        name: milestoneName,
        amount: paidAmount || dueAmount,
        tds: 0,
        paidOn: paidOn,
        paidBy: paidBy,
        actualDate: item.billDueDate,
        pettyCashAccountId: item.pettyCashAccountId,
        debitCardAccountId: item.debitCardAccountId,
        paymentMode:
          bankAccount && item.billType != "PrePaid"
            ? "BankTransfer"
            : "CardPayment",
        isPrepaid: item.paymentType == "PrePaid" ? 1 : 0,
        updated: new Date(),
        updatedBy: username,
      };
      milestone = await PurchaseOrderMilestone.create(milestone);

      if (paidAmount > 0) {
        var payout = {
          info: milestoneName,
          amount: paidAmount,
          approvedOn: paidOn,
          approvedBy: paidBy,
          paidOn: paidOn,
          paidBy: paidBy,
          paymentMode:
            bankAccount && item.billType != "PrePaid"
              ? "BankTransfer"
              : "CardPayment",
          type: "VendorPayment",
          status: item.paymentType == "PrePaid" ? "PrePaid" : "Approved",
          purchaseOrderId: purchaseOrder.id,
          updated: new Date(),
          updatedBy: username,
          pettyCashAccountId: item.pettyCashAccountId,
          debitCardAccountId: item.debitCardAccountId,
          companyId: data.companyId,
        };
        payout = await PayoutPayment.create(payout);
        milestone.set("payoutId", payout.id);
        milestone.save();
      }
      item.set("status", "Mapped");
      await item.save();
    }
    return item;
  } catch (e) {
    log.write("AccountService ::: mapBillsQueue :: exception : ", e);
    throw e;
  }
};
service.getRecurringBillSuggestions = async (data) => {
  try {
    log.write(
      "AccountsService ::: getRecurringBillSuggestions :: data : ",
      data
    );
    var startDate = utils.moment(data.billDate).startOf("month").toDate();
    var endDate = utils.moment(data.billDate).endOf("month").toDate();
    var opexBills = [];
    if (data.buildingId) {
      opexBills = await PurchaseOrder.findAll({
        where: {
          buildingId: data.buildingId,
          vendorId: data.vendorId,
          date: { $between: [startDate, endDate] },
          opexPaymentId: { $ne: null },
          status: { $in: ["Raised", "Draft"] },
          companyId: data.companyId,
        },
        include: [
          "vendor",
          {
            as: "item",
            model: PurchaseItem,
            include: [
              {
                as: "opexType",
                required: false,
                model: OpexType,
                where: { active: 1 },
                include: [
                  {
                    as: "type",
                    model: OpexType,
                    required: false,
                    include: ["category"],
                  },
                  { as: "category", model: OpexCategory, required: false },
                ],
              },
            ],
          },
        ],
      });
      log.write(
        "AccountsService ::: getRecurringBillSuggestions :: opexBills : " +
          opexBills.length
      );
      var bills = [];
      _.each(opexBills, function (r) {
        var bill = {
          id: r.id,
          vendor: r.vendor.name,
          amount: r.amount,
          billDate: r.date,
          dateFrom: r.item.dateFrom,
          dateTo: r.item.dateTo,
        };
        if (r.item && r.item.opexType) {
          bill.opexCategoryId = r.item.opexType.category
            ? r.item.opexType.category.id
            : r.item.opexType.type.category.id;
          bill.opexCategory = r.item.opexType.category
            ? r.item.opexType.category.name
            : r.item.opexType.type.category.name;

          if (r.item.opexType.type) {
            bill.opexItem = r.opexType ? r.item.opexType.name : null;
            bill.opexType =
              r.opexType && r.item.opexType.type
                ? r.item.opexType.type.name
                : null;
          } else {
            bill.opexType = r.item.opexType ? r.item.opexType.name : null;
          }
        }
        bills.push(bill);
      });
    } else {
      opexBills = await PurchaseOrder.findAll({
        where: {
          projectId: data.projectId,
          vendorId: data.vendorId,
          date: { $between: [startDate, endDate] },
          status: { $in: ["Raised", "Draft", "Started", "Closed"] },
          companyId: data.companyId,
        },
        include: ["vendor"],
      });
      log.write(
        "AccountsService ::: getRecurringBillSuggestions :: opexBills : " +
          opexBills.length
      );
      var bills = [];
      _.each(opexBills, function (r) {
        var bill = {
          id: r.id,
          vendor: r.vendor.name,
          amount: r.amount,
          billDate: r.date,
        };
        bills.push(bill);
      });
    }
    return bills;
  } catch (e) {
    log.write(
      "AccountService ::: getRecurringBillSuggestions :: exception : ",
      e
    );
    throw e;
  }
};
service.mapImageToBill = async (data, username) => {
  try {
    log.write("AccountsService ::: mapImageToBill :: data : ", data);
    data.updated = new Date();
    data.updatedBy = username;
    var invoice = await PurchaseOrderInvoice.create(data);
    await PurchaseOrder.update(
      { taxInvoiceId: invoice.id },
      { where: { id: data.purchaseOrderId } }
    );
    return invoice;
  } catch (e) {
    log.write("AccountService ::: mapImageToBill :: exception : ", e);
    throw e;
  }
};
service.raiseOpexBills = async (data, username) => {
  try {
    // old query format for pos table which is used for opex_bills
    var sql = `select x.id opexPaymentId,x.effectiveFrom, month(x.date_field) month, year(x.date_field) year, b.id billId, x.isAdvancePayment,  x.isActive from
              (select m.id, m.effectiveFrom,m.isAdvancePayment, d.date_field, sp.active isActive
                from opex_recurring_payments m
                left join sys_date d on d.date_field >= m.effectiveFrom and (m.effectiveTo is null or d.date_field < m.effectiveTo) and date(d.date_field)<date(:nextMonthEndDate)
                left join vendors sp on sp.id = m.vendorId
                where m.status='Approved' and m.active=1 and m.companyId=:companyId
                group by year(d.date_field), month(d.date_field), m.id) x
              left join vendor_purchase_orders b on b.opexPaymentId = x.id and b.status not in ('Cancelled','Draft','Declined') 
                                  and ((b.date between x.date_field and LAST_DAY(x.date_field)) or (x.isAdvancePayment=1 and b.date between DATE_ADD(x.date_field, INTERVAL 1 MONTH) and LAST_DAY(DATE_ADD(x.date_field, INTERVAL 1 MONTH)))) 
              order by  x.id, month(x.date_field), year(x.date_field)`;

    var monthStartDate = moment().add(-1, "months").startOf("month");
    var monthEndDate = moment().add(-1, "months").endOf("month");
    var nextMonthStartDate = moment().startOf("month");
    var nextMonthEndDate = moment().endOf("month");
    var replacements = {
      companyId: data.companyId,
      monthStartDate: monthStartDate.toDate(),
      monthEndDate: monthEndDate.toDate(),
      nextMonthStartDate: nextMonthStartDate.toDate(),
      nextMonthEndDate: nextMonthEndDate.toDate(),
    };

    // log.write("AccountService ::: raiseOpexBills ::: sql :: ", sql);
    log.write(
      "AccountService ::: raiseOpexBills ::: replacements :: ",
      replacements
    );
    var opexPayments = await session.db.query(sql, {
      replacements: replacements,
      type: Sequelize.QueryTypes.SELECT,
    });
    log.write(
      "AccountService ::: raiseOpexBills ::: opexPayments :: count : " +
        opexPayments.length
    );
    // log.write("AccountService ::: raiseOpexBills ::: opexPayments :: ", opexPayments);
    var billsRaised = 0;
    for (var i = 0; i < opexPayments.length; i++) {
      var payment = opexPayments[i];
      if (!payment.isActive) {
        continue;
      }
      if (!payment.billId && payment.year && payment.month) {
        var year = payment.year;
        var month = payment.month;
        var opexPayment = await OpexPayment.findOne({
          where: { id: payment.opexPaymentId },
        });
        if (!opexPayment) {
          continue;
        }
        // log.write("AccountService ::: raiseOpexBills ::: opexPayment :: ", opexPayment.toJSON());
        var bill = {
          companyId: opexPayment["companyId"],
          status: "Raised",
          opexTypeId: opexPayment.opexTypeId,
          opexPaymentId: opexPayment.id,
          buildingId: opexPayment["buildingId"],
          vendorId: opexPayment["vendorId"],
          officeId: opexPayment["officeId"],
          updated: new Date(),
          updatedBy: "system",
          approvalRequired: 0,
        };
        bill["amount"] = parseInt(opexPayment["amount"]) || 0;

        if (
          bill["amount"] < opexPayment["minCharge"] ||
          bill["amount"] > opexPayment["maxCharge"]
        ) {
          bill["approvalRequired"] = 1;
        }
        if (opexPayment.amountType == "Fixed") {
          bill["approvalRequired"] = 0;
          // bill.status = 'Approved';
        }

        // var startDate = month.startOf('month').add(opexPayment['invoice_start_day'] - 1, 'days');
        var startDate = moment(
          year + "-" + month + "-" + opexPayment["invoiceStartDay"],
          "YYYY-MM-DD"
        ).add(10, "hours");
        log.write(
          "AccountService ::: raiseOpexBills :: startDate ",
          startDate.toDate()
        );
        var endDate = startDate
          .clone()
          .add(opexPayment["invoiceFrequency"], "months")
          .clone()
          .add(-1, "days")
          .add(10, "hours");
        log.write(
          "AccountService ::: raiseOpexBills :: endDate ",
          endDate.toDate()
        );
        var dueDate = moment(
          year + "-" + month + "-" + opexPayment["invoiceDueDay"],
          "YYYY-MM-DD"
        ).add(10, "hours");
        log.write(
          "AccountService ::: raiseOpexBills :: dueDate ",
          dueDate.toDate()
        );
        var billDate;
        if (opexPayment["invoiceDay"] >= 29) {
          billDate = moment(year + "-" + month + "-01", "YYYY-MM-DD");
          billDate = billDate.endOf("month");
        } else {
          billDate = moment(
            year + "-" + month + "-" + opexPayment["invoiceDay"],
            "YYYY-MM-DD"
          ).add(10, "hours");
        }
        log.write(
          "AccountService ::: raiseOpexBills :: billDate ",
          billDate.toDate()
        );
        if (!opexPayment["isAdvancePayment"]) {
          startDate = startDate.clone().add(-1, "months");
          endDate = startDate
            .clone()
            .add(opexPayment["invoiceFrequency"], "months")
            .add(-1, "days");
        }
        log.write(
          "AccountService ::: raiseOpexBills :: startDate ",
          startDate.toDate()
        );
        log.write(
          "AccountService ::: raiseOpexBills :: endDate ",
          endDate.toDate()
        );

        bill["dateFrom"] = startDate.toDate();
        bill["dateTo"] = endDate.toDate();
        bill["billDueDate"] = dueDate.toDate();
        bill["billDate"] = billDate.toDate();

        var previousStartDate = startDate
          .clone()
          .add(opexPayment["invoiceFrequency"] * -1, "months");
        log.write(
          "AccountService ::: raiseOpexBills :: previousStartDate ",
          previousStartDate.toDate()
        );
        if (opexPayment["invoiceFrequency"] > 1) {
          var resBills = await PurchaseOrder.findAll({
            where: {
              opexPaymentId: opexPayment.id,
              date: {
                $between: [
                  previousStartDate.toDate(),
                  startDate.clone().add(-1, "days").toDate(),
                ],
              },
              status: { $notIn: ["Cancelled"] },
            },
          });
          log.write(
            "AccountService ::: raiseOpexBills :: bills " + resBills.length
          );
          if (resBills.length > 0) {
            log.write(
              "AccountService ::: raiseOpexBills :: shouldnt raise this month bill "
            );
            continue;
          }
        }

        if (moment(opexPayment["effectiveTo"]).isBefore(endDate)) {
          endDate = moment(opexPayment["effectiveTo"]);
          bill["dateTo"] = endDate.toDate();
          var noOfDays = endDate.clone().diff(startDate, "days") + 1;
          var chargePerDay = bill.amount / startDate.daysInMonth();
          if (opexPayment["invoiceFrequency"] > 1) {
            chargePerDay = bill.amount / (30 * opexPayment["invoiceFrequency"]);
          }
          // log.write('AccountService ::: raiseOpexBills :: datediff ' + endDate.diff(startDate, 'days'));
          // log.write('AccountService ::: raiseOpexBills :: noOfDays ' + noOfDays);
          // log.write('AccountService ::: raiseOpexBills :: chargePerDay ' + chargePerDay);
          bill["amount"] = Math.round(chargePerDay * noOfDays);
          if (noOfDays > 0 && endDate.clone().diff(startDate, "days") > -1) {
            var gst = 0,
              tds = 0;
            if (opexPayment.gst && opexPayment.gst > 0) {
              gst = bill.amount * (opexPayment.gst / 100);
            }
            if (opexPayment.tds && opexPayment.tds > 0) {
              tds = bill.amount * (opexPayment.tds / 100);
            }
            bill.gst = gst;
            bill.tds = tds;
            bill.amount = bill.amount + gst - tds;
            // await OpexBill.create(bill);
            await services.addOpexBill(bill);
            billsRaised++;
          }
        } else if (moment(opexPayment["effectiveFrom"]).isAfter(startDate)) {
          // log.write('AccountService ::: raiseOpexBills :: opexPayment ', opexPayment.toJSON());
          // log.write('AccountService ::: raiseOpexBills :: effectiveDateTo ', moment(opexPayment['effectiveTo']).toDate());
          if (
            opexPayment["effectiveTo"] == null ||
            !moment(opexPayment["effectiveTo"]).isValid() ||
            moment(opexPayment["effectiveTo"]).isAfter(endDate)
          ) {
            startDate = moment(opexPayment["effectiveFrom"])
              .clone()
              .add(10, "hours");
            bill["dateFrom"] = startDate.toDate();
            bill["billDate"] = startDate.toDate();
          } else if (moment(opexPayment["effectiveTo"]).isBefore(endDate)) {
            startDate = moment(opexPayment["effectiveFrom"])
              .clone()
              .add(10, "hours");
            bill["dateFrom"] = startDate.toDate();
            endDate = moment(opexPayment["effectiveTo"])
              .clone()
              .add(10, "hours");
            bill["dateTo"] = endDate.toDate();
          }

          var noOfDays = endDate.diff(startDate, "days") + 1;
          var chargePerDay = bill.amount / startDate.daysInMonth();
          if (opexPayment["invoiceFrequency"] > 1) {
            chargePerDay = bill.amount / (30 * opexPayment["invoiceFrequency"]);
          }
          // log.write('AccountService ::: raiseOpexBills :: datediff ' + endDate.diff(startDate, 'days'));
          // log.write('AccountService ::: raiseOpexBills :: noOfDays ' + noOfDays);
          // log.write('AccountService ::: raiseOpexBills :: chargePerDay ' + chargePerDay);
          bill["amount"] = Math.round(chargePerDay * noOfDays);
          if (noOfDays > 0 && endDate.diff(startDate, "days") > -1) {
            var gst = 0,
              tds = 0;
            if (opexPayment.gst && opexPayment.gst > 0) {
              gst = bill.amount * (opexPayment.gst / 100);
            }
            if (opexPayment.tds && opexPayment.tds > 0) {
              tds = bill.amount * (opexPayment.tds / 100);
            }
            bill.gst = gst;
            bill.tds = tds;
            bill.amount = bill.amount + gst - tds;
            // await OpexBill.create(bill);
            await services.addOpexBill(bill);
            billsRaised++;
          }
        } else {
          var gst = 0,
            tds = 0;
          if (opexPayment.gst && opexPayment.gst > 0) {
            gst = bill.amount * (opexPayment.gst / 100);
          }
          if (opexPayment.tds && opexPayment.tds > 0) {
            tds = bill.amount * (opexPayment.tds / 100);
          }
          bill.gst = gst;
          bill.tds = tds;
          bill.amount = bill.amount + gst - tds;
          log.write(
            "AccountService ::: raiseOpexBills :: normal case : ",
            bill.amount
          );
          // await OpexBill.create(bill);
          await services.addOpexBill(bill);
          billsRaised++;
        }
        log.write("AccountService ::: raiseOpexBills :: bill ", bill);

        if (
          moment(opexPayment["effectiveFrom"]).isAfter(previousStartDate) &&
          moment(opexPayment["effectiveFrom"]).isBefore(startDate)
        ) {
          // log.write('AccountService ::: raiseOpexBills :: previousStartDate ', previousStartDate.toDate());
          // log.write('AccountService ::: raiseOpexBills :: curecnt start date ', billDate.clone().add(-1, 'days'));

          var resBills = await PurchaseOrder.findAll({
            where: {
              opexPaymentId: opexPayment.id,
              date: {
                $between: [
                  previousStartDate.toDate(),
                  billDate.clone().add(-1, "days").toDate(),
                ],
              },
              status: { $notIn: ["Cancelled"] },
            },
          });
          log.write(
            "AccountService ::: raiseOpexBills :: bills " + resBills.length
          );
          if (resBills.length == 0) {
            var noOfDays = startDate.diff(
              moment(opexPayment["effectiveFrom"]),
              "days"
            );
            var chargePerDay =
              bill.amount / moment(opexPayment["effectiveFrom"]).daysInMonth();
            if (opexPayment["invoiceFrequency"] > 1) {
              chargePerDay =
                bill.amount / (30 * opexPayment["invoiceFrequency"]);
            }
            var effectiveDateFrom = moment(opexPayment["effectiveFrom"])
              .clone()
              .add(10, "hours");
            bill["dateFrom"] = effectiveDateFrom.toDate();
            endDate = startDate.clone().add(-1, "days");
            bill["dateTo"] = endDate.toDate();
            bill["billDate"] = effectiveDateFrom.toDate();

            // log.write('AccountService ::: raiseOpexBills :: old months : noOfDays ', noOfDays);
            // log.write('AccountService ::: raiseOpexBills ::  old months :  chargePerDay ', chargePerDay);
            bill["amount"] = Math.round(chargePerDay * noOfDays);
            if (noOfDays > 0) {
              var gst = 0,
                tds = 0;
              if (opexPayment.gst && opexPayment.gst > 0) {
                gst = bill.amount * (opexPayment.gst / 100);
              }
              if (opexPayment.tds && opexPayment.tds > 0) {
                tds = bill.amount * (opexPayment.tds / 100);
              }
              bill.gst = gst;
              bill.tds = tds;
              bill.amount = bill.amount + gst - tds;
              // await OpexBill.create(bill);
              await services.addOpexBill(bill);
              billsRaised++;
            }

            log.write(
              "AccountService ::: raiseOpexBills :: previous bill ",
              bill
            );
          }
        }
      }
    }
    return billsRaised + " recurring bills are raised successfully.";
  } catch (e) {
    log.write("AccountService ::: raiseOpexBills :: exception : ", e);
    throw e;
  }
};

// ---------------------- Opex APIs -----------------------------

service.getAttributeSuggestions = async (data) => {
  try {
    log.write("AccountsService ::: getAttributeSuggestions :: data : ", data);
    var sql =
      `SELECT b.id, c.company,c.name, b.due, b.refNo, o.name office, b.status, i.id invoiceid, i.startDate, i.amount FROM bookings b join offices o on b.officeid=o.id join clients c on b.clientId=c.id join invoices i on b.id=i.bookingId\
      where b.companyId=` +
      data.companyId +
      ` and b.officeId=o.id and b.clientId=c.id and i.amount>=` +
      data.amount * 0.9 +
      ` and i.amount<=` +
      data.amount * 1.2 +
      ` and b.status in ('Active','Exiting','Exited')` +
      `and month(i.startDate) = month('${data.date}') 
      and year(i.startDate) = year('${data.date}')`;
    if (data.search) {
      sql =
        `SELECT b.id,  c.company,c.name,  b.due, b.refNo, o.name office, b.status  
         FROM bookings b, clients c,  offices o
        where  b.companyId=` +
        data.companyId +
        ` and b.officeId=o.id and b.clientId=c.id and (lower(c.company) like '%` +
        data.search.toLowerCase() +
        `%' or lower(c.name) like '%` +
        data.search.toLowerCase() +
        `%') and b.status in ('Active','Exiting','Exited')`;
    }
    var bookings = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });
    return bookings;
  } catch (e) {
    log.write("AccountsService ::: getAttributeSuggestions :: exception : ", e);
    throw e;
  }
};
service.listPayments = async (data) => {
  try {
    log.write("AccountsService ::: listPayments :: data : ", data);
    var where = {};
    var attributes;
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    if (data.filters.types && data.filters.types.length) {
      where["type"] = { $in: data.filters.types };
    } else {
      where["type"] = { $notIn: ["PgCharge"] };
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      if (query.search.indexOf("<") > -1) {
        var index = query.search.indexOf("<");
        var number = parseInt(query.search.substr(index + 1));
        if (number > 0) {
          where["amount"] = { $lte: number };
        }
      } else if (query.search.indexOf(">") > -1) {
        var index = query.search.indexOf(">");
        var number = parseInt(query.search.substr(index + 1));
        if (number > 0) {
          where["amount"] = { $gte: number };
        }
      } else if (query.search.indexOf("-") > -1) {
        var numbers = query.search.split("-");
        if (numbers.length > 1 && numbers[0] > 0 && numbers[1] > 0) {
          where["amount"] = {
            $and: [{ $gte: numbers[0] }, { $lte: numbers[1] }],
          };
        }
      } else {
        $or.push(
          Sequelize.where(
            Sequelize.fn("lower", Sequelize.literal("`booking->client`.name")),
            {
              $like: query.search.toLowerCase() + "%",
            }
          )
        );
        $or.push(
          Sequelize.where(
            Sequelize.fn(
              "lower",
              Sequelize.literal("`booking->client`.company")
            ),
            {
              $like: query.search.toLowerCase() + "%",
            }
          )
        );
        // $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`booking->client`.phone')), {
        //   $like: query.search.toLowerCase() + "%"
        // }))
        $or.push(
          Sequelize.where(
            Sequelize.fn("lower", Sequelize.literal("booking.refNo")),
            {
              $like: query.search.toLowerCase() + "%",
            }
          )
        );
        $or.push(
          Sequelize.where(Sequelize.fn("lower", Sequelize.literal("utr")), {
            $like: query.search.toLowerCase() + "%",
          })
        );
        $or.push(
          Sequelize.where(Sequelize.fn("lower", Sequelize.literal("amount")), {
            $like: query.search.toLowerCase() + "%",
          })
        );
        where["$and"] = { $or: $or };
      }
      log.write(
        "AccountService ::: listPayments :: $or : ",
        JSON.stringify($or, null, 2)
      );
    }

    if (data.filters.cancelled) {
      where.cancelled = 1;
    } else {
      where.active = 1;
    }
    if (
      data.filters &&
      data.filters.startDate &&
      data.filters &&
      data.filters.endDate
    ) {
      var startDate = utils.moment().add(-1, "months").startOf("month");
      var endDate = utils.moment().endOf("month");
      if (data.filters && data.filters.startDate) {
        startDate = utils.moment(data.filters.startDate);
      }
      if (data.filters && data.filters.endDate) {
        endDate = utils.moment(data.filters.endDate);
      }
      if (startDate && endDate) {
        where.date = { $between: [startDate.toDate(), endDate.toDate()] };
      }
    }

    log.write("AccountsService ::: listPayments :: where : ", where);
    var orderBy = [["id", "desc"]];
    if (data.sortBy) {
      if (data.sortBy == "booking.client.company") {
        orderBy = [
          [Sequelize.literal("`booking->client`.company"), data.sortOrder],
        ];
      } else if (data.sortBy.split(".").length) {
        orderBy = [[Sequelize.literal(data.sortBy), data.sortOrder]];
      } else {
        orderBy = [[data.sortBy, data.sortOrder]];
      }
    }
    var payments = await Payment.findAll({
      where: where,
      include: [
        {
          as: "booking",
          model: Booking,
          where: { companyId: data.companyId },
          include: ["client"],
        },
      ],
      offset: data.offset,
      limit: data.limit,
      order: orderBy,
    });
    log.write(
      "AccountsService ::: listPayments :: payments count : " + payments.length
    );

    return payments;
  } catch (e) {
    log.write("AccountsService ::: listPayments :: exception : ", e);
    throw e;
  }
};
service.listPayinEntries = async (data) => {
  try {
    log.write("AccountsService ::: listPayinEntries :: data : ", data);
    var where = {};
    var attributes;

    if (data.filters.paymentMode && data.filters.paymentMode != "") {
      where["paymentMode"] = data.filters.paymentMode;
    }
    if (data.filters.paymentModes && data.filters.paymentModes.length) {
      where["paymentMode"] = { $in: data.filters.paymentModes };
    }
    if (
      data.filters.statuses &&
      data.filters.statuses.indexOf("NotLinked") > -1
    ) {
      where.linked = 0;
      data.filters.statuses = _.without(data.filters.statuses, "NotLinked");
      where["paymentMode"] = "CashFree";
    }
    if (
      data.filters.statuses &&
      data.filters.statuses.indexOf("NotAttributed") > -1
    ) {
      where.attributed = 0;
      data.filters.statuses = _.without(data.filters.statuses, "NotAttributed");
      where["paymentMode"] = "CashFree";
    }

    // if (data.filters.notLinked) {
    //   where.linked = { $ne: 1 };
    // }
    var $or = [];
    if (data.filters.suspense) {
      // where.suspense = 1;
      $or.push({ suspense: 1 });
    }
    if (data.filters.nonRevenue) {
      // where.nonRevenue = 1;
      $or.push({ nonRevenue: 1 });
    }
    if (data.filters.nonExpense) {
      // where.nonExpense = 1;
      $or.push({ nonExpense: 1 });
    }
    if (data.filters.noInvoice) {
      // where.noInvoice = 1;
      $or.push({ noInvoice: 1 });
    }
    if (data.filters.linked) {
      // where.linked = 1;
      $or.push({ linked: 1 });
    }
    if (data.filters.notAttributed) {
      $or.push({ status: { $ne: "Attributed" } });
    }
    if ($or.length) {
      where["$and"] = { $or: $or };
    }
    if (data.filters.amount) {
      where.amount = data.filters.amount;
    }
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    if (data.filters.statuses && data.filters.statuses.length) {
      where["status"] = { $in: data.filters.statuses };
    }

    // var startDate = utils.moment().add(-1, 'months').startOf('month');
    // var endDate = utils.moment().endOf('month');
    var startDate, endDate;
    if (data.filters && data.filters.startDate) {
      startDate = utils.moment(data.filters.startDate);
    }
    if (data.filters && data.filters.endDate) {
      endDate = utils.moment(data.filters.endDate);
    }
    if (startDate && endDate) {
      where.receivedDate = { $between: [startDate.toDate(), endDate.toDate()] };
    }

    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      if (query.search.indexOf("<") > -1) {
        var index = query.search.indexOf("<");
        var number = parseInt(query.search.substr(index + 1));
        if (number > 0) {
          where["amount"] = { $lte: number };
        }
      } else if (query.search.indexOf(">") > -1) {
        var index = query.search.indexOf(">");
        var number = parseInt(query.search.substr(index + 1));
        if (number > 0) {
          where["amount"] = { $gte: number };
        }
      } else if (query.search.indexOf("-") > -1) {
        var numbers = query.search.split("-");
        if (numbers.length > 1 && numbers[0] > 0 && numbers[1] > 0) {
          where["amount"] = {
            $and: [{ $gte: numbers[0] }, { $lte: numbers[1] }],
          };
        }
      } else {
        $or.push(
          Sequelize.where(Sequelize.fn("lower", Sequelize.literal("utr")), {
            $like: query.search.toLowerCase() + "%",
          })
        );
        $or.push(
          Sequelize.where(
            Sequelize.fn("lower", Sequelize.literal("chequeNo")),
            {
              $like: query.search.toLowerCase() + "%",
            }
          )
        );
        where["$and"] = { $or: $or };
      }
    }
    var include = [
      "linkedTo",
      "pgTransactions",
      { as: "booking", model: Booking, include: ["client"] },
    ];
    if (data.companyId) {
      where.companyId = data.companyId;
    }
    var order = ["id", "desc"];
    if (data.sortBy) {
      order = [data.sortBy, data.sortOrder || "asc"];
      if (data.sortBy == "booking") {
        order = ["booking", "client", "company", data.sortOrder || "asc"];
      }
    }
    log.write(
      "AccountsService ::: listPayinEntries :: where : ",
      JSON.stringify(where, null, 2)
    );
    var results = await PayinEntry.findAll({
      where: where,
      include: include,
      offset: data.offset,
      limit: data.limit,
      order: [order],
    });
    log.write(
      "AccountsService ::: listPayinEntries :: results count : " +
        results.length
    );
    var payins = [];
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      // log.write("AccountsService ::: listPayinEntries :: row : ", r.toJSON());
      var payin = {
        id: r.id,
        narration: r.narration,
        paymentMode: r.paymentMode,
        amount: r.amount,
        status: r.status,
        chequeNo: r.chequeNo,
        addedBy: r.addedBy,
        addedOn: r.addedOn,
        receivedDate: r.receivedDate,
        depositedDate: r.depositedDate,
        reason: r.reason,
        noInvoice: r.noInvoice,
        linked: r.linked,
        attributed: r.attributed,
        nonRevenue: r.nonRevenue,
        suspense: r.suspense,
        // warning: r.suspense ? true : false,
        // active: r.nonRevenue ? 0 : 1,
        notAttributed: r.attributed || r.nonRevenue || r.suspense ? 0 : 1,
        utr: r.utr,
        narration: r.narration,
        linkedTo: r.linkedTo,
        pgTransactions: r.pgTransactions,
        booking:
          r.booking && r.booking.client
            ? r.booking.client.company || r.booking.client.name
            : null,
        bookingId: r.booking ? r.booking.id : null,
        paymentId: r.paymentId,
        bookingRefNo: r.booking ? r.booking.refNo : null,
      };
      if (!payin.booking) {
        payin.booking = r.reason;
      }
      if (payin.nonRevenue) {
        payin.status = "NonRevenue";
      } else if (payin.suspense) {
        payin.status = "Suspense";
      } else if (payin.notAttributed) {
        payin.status = "UnAttributed";
      }
      payins.push(payin);
    }
    return payins;
  } catch (e) {
    log.write("AccountsService ::: listPayinEntries :: exception : ", e);
    throw e;
  }
};
service.savePayinEntry = async (data, username) => {
  try {
    var item = {};
    if (data.id) {
      data.updated = new Date();
      data.updatedBy = username;
      if (data.linked) {
        data.linkedBy = username;
        data.linkedOn = new Date();
      }
      if (data.attributed) {
        data.attributedBy = username;
        data.attributedOn = new Date();
      }
      await PayinEntry.update(data, { where: { id: data.id } });
      item = data;
    } else {
      data.addedOn = new Date();
      data.addedBy = username;
      if (data.paymentMode == "BankTransfer") {
        data.status = "Credited";
      } else {
        data.status = "Received";
      }
      // if (data.duplicateCheck) {
      //   item = await PayinEntry.findOne({ where: { utr: data.utr } });
      //   if (item) {
      //     log.write("AccountService ::: savePayinEntry :: duplicate found for " + item.utr);
      //   }
      // }
      var where = { utr: data.utr };
      if (!data.utr) {
        where = { narration: data.narration };
      }
      item = await PayinEntry.findOne({ where: where });
      if (item) {
        log.write(
          "AccountService ::: savePayinEntry :: duplicate found for " +
            item.narration
        );
      }
      if (!item || !item.id) {
        item = await PayinEntry.create(data);
      }
    }
    return item;
  } catch (e) {
    log.write("AccountService ::: savePayinEntry :: exception : ", e);
    throw e;
  }
};
service.getPayinsByStatus = async (data) => {
  try {
    log.write("AccountsService ::: getPayinsByStatus :: data : ", data);
    var dateSql = "";
    if (data.startDate && data.endDate) {
      dateSql =
        " and addedOn between '" +
        data.startDate +
        "' and '" +
        data.endDate +
        "' ";
    }
    var sql =
      `select count(id) count, status from payin_entries where paymentMode='` +
      data.paymentMode +
      `' ` +
      dateSql +
      ` and companyId=` +
      data.companyId +
      ` and status not in ('Deleted') group by status`;
    var statuses = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    sql =
      `select count(id) count from payin_entries where paymentMode='` +
      data.paymentMode +
      `' ` +
      dateSql +
      ` and companyId=` +
      data.companyId +
      ` and attributed=0 and (suspense=0 or suspense is null) and (nonRevenue=0 or nonRevenue is null) `;
    var notAttributed = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    sql =
      `select count(id) count from payin_entries where paymentMode='` +
      data.paymentMode +
      `' ` +
      dateSql +
      ` and companyId=` +
      data.companyId +
      ` and suspense=1`;
    var suspense = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    sql =
      `select count(id) count from payin_entries where paymentMode='` +
      data.paymentMode +
      `' ` +
      dateSql +
      ` and companyId=` +
      data.companyId +
      ` and nonRevenue=1`;
    var nonRevenue = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    sql =
      `select count(id) count from payin_entries where paymentMode='` +
      data.paymentMode +
      `' ` +
      dateSql +
      ` and companyId=` +
      data.companyId +
      ` and noInvoice=1`;
    var noInvoice = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    sql =
      `select count(id) count from payin_entries where paymentMode='` +
      data.paymentMode +
      `' ` +
      dateSql +
      ` and companyId=` +
      data.companyId +
      ` and linkedId is not null`;
    var linked = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    return {
      statuses: statuses,
      notAttributed: notAttributed[0]["count"],
      suspense: suspense[0]["count"],
      nonRevenue: nonRevenue[0]["count"],
      linked: linked[0]["count"],
      noInvoice: noInvoice[0]["count"],
    };
  } catch (e) {
    log.write("AccountsService ::: getPayinsByStatus :: exception : ", e);
    throw e;
  }
};

service.getPayoutsByStatus = async (data) => {
  try {
    log.write("AccountsService ::: getPayoutsByStatus :: data : ", data);
    var paymentModes = [];
    _.each(data.paymentModes, function (m) {
      paymentModes.push("'" + m + "'");
    });
    var paymentModeSql = "";
    if (paymentModes.length) {
      paymentModeSql = " and paymentMode in (" + paymentModes.join(",") + ")";
    }
    var types = [];
    _.each(data.types, function (p) {
      types.push("'" + p + "'");
    });
    var typeSql = "";
    if (types.length) {
      typeSql = " and type in (" + types.join(",") + ")";
    }
    var sql =
      `select count(id) count, status from payout_payments where status='FuturePayout' and companyId=` +
      data.companyId +
      paymentModeSql +
      typeSql +
      `  group by status`;
    log.write("AccountsService ::: getPayoutsByStatus :: sql : ", sql);
    var statuses = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    return {
      statuses: statuses,
    };
  } catch (e) {
    log.write("AccountsService ::: getPayoutsByStatus :: exception : ", e);
    throw e;
  }
};
service.getPayoutEntriesByStatus = async (data) => {
  try {
    log.write("AccountsService ::: getPayoutEntriesByStatus :: data : ", data);
    var sql =
      `select count(id) count, status from payout_entries where paymentMode='` +
      data.paymentMode +
      `' and companyId=` +
      data.companyId +
      ` and  status not in ('Deleted') group by status`;
    var statuses = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    // sql = `select count(id) count from payout_entries where paymentMode='` + data.paymentMode + `' and companyId=` + data.companyId + ` and attributed is null and suspense is null and nonExpense is null and noBill is null`;
    sql =
      `select count(id) count from payout_entries where paymentMode='` +
      data.paymentMode +
      `' and companyId=` +
      data.companyId +
      ` and status not in ('Deleted','Attributed')`;
    var notAttributed = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    sql =
      `select count(id) count from payout_entries where paymentMode='` +
      data.paymentMode +
      `' and companyId=` +
      data.companyId +
      ` and suspense=1`;
    var suspense = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    sql =
      `select count(id) count from payout_entries where paymentMode='` +
      data.paymentMode +
      `' and companyId=` +
      data.companyId +
      ` and nonExpense=1`;
    var nonExpense = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    sql =
      `select count(id) count from payout_entries where paymentMode='` +
      data.paymentMode +
      `' and companyId=` +
      data.companyId +
      ` and salary=1`;
    var salary = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    sql =
      `select count(id) count from payout_entries where paymentMode='` +
      data.paymentMode +
      `' and companyId=` +
      data.companyId +
      ` and noBill=1`;
    var noBill = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    sql =
      `select count(id) count from payout_entries where paymentMode='` +
      data.paymentMode +
      `' and companyId=` +
      data.companyId +
      ` and linkedId is not null`;
    var linked = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    var credited = [],
      debited = [];
    if (data.paymentMode == "PettyCash") {
      var idSql = " and pettyCashAccountId is not null";
      if (data.pettyCashAccountId) {
        idSql = " and pettyCashAccountId=" + data.pettyCashAccountId;
      }
      sql =
        `select sum(amount) total from payout_entries where paymentMode in ('BankTransfer','CardPayment') and companyId=` +
        data.companyId +
        ` and  status='Attributed' ` +
        idSql;
      credited = await session.db.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
      });

      sql =
        `select sum(amount) total from payout_entries where paymentMode='PettyCash' and companyId=` +
        data.companyId +
        ` and  status='Attributed' ` +
        idSql;
      debited = await session.db.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
      });
    } else if (data.paymentMode == "CardPayment") {
      var idSql = " and debitCardAccountId is not null";
      if (data.debitCardAccountId) {
        // idSql = " and debitCardAccountId=" + data.debitCardAccountId;
      }
      sql =
        `select sum(amount) total from payout_entries where paymentMode in ('BankTransfer','PettyCash') and companyId=` +
        data.companyId +
        ` and  status='Attributed' ` +
        idSql;
      credited = await session.db.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
      });

      sql =
        `select sum(amount) total from payout_entries where paymentMode='CardPayment' and companyId=` +
        data.companyId +
        ` and  status='Attributed' ` +
        idSql;
      debited = await session.db.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
      });
    } else if (data.paymentMode == "PG") {
      var idSql = " and toPayoutGateway =1";
      sql =
        `select sum(amount) total from payout_entries where paymentMode='BankTransfer' and companyId=` +
        data.companyId +
        ` and  status='Attributed' ` +
        idSql;
      credited = await session.db.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
      });

      sql =
        `select sum(amount) total from payout_entries where paymentMode='CardPayment' and companyId=` +
        data.companyId +
        ` and  status='Attributed' ` +
        idSql;
      debited = await session.db.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
      });
    }
    return {
      statuses: statuses,
      notAttributed: notAttributed[0]["count"],
      suspense: suspense[0]["count"],
      nonExpense: nonExpense[0]["count"],
      salary: salary[0]["count"],
      noBill: noBill[0]["count"],
      linked: linked[0]["count"],
      credited:
        credited.length && credited[0]["total"] ? credited[0]["total"] : 0,
      debited: debited.length && debited[0]["total"] ? debited[0]["total"] : 0,
    };
  } catch (e) {
    log.write(
      "AccountsService ::: getPayoutEntriesByStatus :: exception : ",
      e
    );
    throw e;
  }
};
service.getDebitSuggestions = async (data) => {
  try {
    var suggestions = [];
    var searches = [];
    log.write("AccountsService ::: getDebitSuggestions :: data : ", data);
    // if (data.search) {
    //   var sql = `select po.id, po.dueAmount, v.name, p.title, b.name building, po.amount
    //           from vendor_purchase_orders po
    //           left join vendor_projects p on p.id = po.projectId
    //           left join buildings b on b.id =po.buildingId
    //           left join vendors v on v.id=po.vendorId
    //           where po.companyId=` + data.companyId + ` and po.dueAmount>0`;
    //   if (data.search) {
    //     sql = sql + " and lower(v.name) like '%" + data.search.toLowerCase() + "%'"
    //   }
    //   var vendors = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    //   searches = vendors;

    //   sql = `select  ob.id, ob.amount, sp.name, b.name building, ot.name otName, ott.name ottName, oc.name ocName, oct.name octName
    //       from opex_bills ob
    //       left join buildings b on b.id =ob.buildingId
    //       left join opex_types ot on ot.id = ob.opexTypeId
    //       left join opex_types ott on ott.id = ot.typeId
    //       left join opex_categories oc on oc.id = ot.catId
    //       left join opex_categories oct on oct.id = ott.catId
    //       left join service_providers sp on sp.id=ob.serviceProviderId
    //       where ob.companyId=` + data.companyId + ` and ob.amount>0 and ob.status in ('Paid')`;
    //   if (data.search) {
    //     sql = sql + " and lower(sp.name) like '%" + data.search.toLowerCase() + "%'"
    //   }
    //   var serviceProviders = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    //   searches = searches.concat(serviceProviders);
    // } else {
    var sql =
      `select pp.id, pp.amount, pp.info, p.title ,v.name vendor, pp.paidOn date 
                from payout_payments pp
                left join vendor_purchase_orders po on po.id=pp.purchaseOrderId
                left join vendors v on v.id = po.vendorId
                left join vendor_projects p on p.id=po.projectId
                where pp.companyId=` +
      data.companyId +
      ` and pp.paymentMode='` +
      data.paymentMode +
      `' and (pp.linked is null or pp.linked=0) 
                 and  pp.status in ('Paid','Approved') and floor(pp.amount)=` +
      Math.floor(data.amount);
    suggestions = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });
    // }

    var sql =
      `select amount, chequeNo, issuedOn from payout_entries 
          where paymentMode='Cheque' and linked is null and amount=` +
      data.amount;
    var cheques = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    return { suggestions: suggestions, searches: searches, cheques: cheques };
  } catch (e) {
    log.write("AccountsService ::: getDebitSuggestions :: exception : ", e);
    throw e;
  }
};
service.getPayoutEntry = async (data) => {
  try {
    log.write("AccountsService ::: getPayoutEntry :: data : ", data);
    var entry = await PayoutEntry.findOne({
      where: { id: data.id },
      include: [
        "linkedTo",
        "pettyCashAccount",
        "debitCardAccount",
        "building",
        {
          as: "opexType",
          required: false,
          model: OpexType,
          where: { active: 1 },
          include: [
            {
              as: "type",
              model: OpexType,
              required: false,
              include: ["category"],
            },
            { as: "category", model: OpexCategory, required: false },
          ],
        },
        {
          as: "payoutPayment",
          model: PayoutPayment,
          include: [
            {
              as: "purchaseOrder",
              model: PurchaseOrder,
              include: [
                "pdf",
                "vendor",
                "project",
                {
                  as: "taxInvoice",
                  model: PurchaseOrderInvoice,
                  include: ["file"],
                },
              ],
            },
            {
              as: "opexBill",
              model: OpexBill,
              include: [
                "image",
                "building",
                "serviceProvider",
                {
                  as: "opexType",
                  required: false,
                  model: OpexType,
                  where: { active: 1 },
                  include: [
                    {
                      as: "type",
                      model: OpexType,
                      required: false,
                      include: ["category"],
                    },
                    { as: "category", model: OpexCategory, required: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    var result = {
      info: entry.info,
      attributed: entry.attributed,
      noBill: entry.noBill,
      nonExpense: entry.nonExpense,
      suspense: entry.suspense,
    };
    if (entry.payoutPayment && entry.payoutPayment.purchaseOrder) {
      var purchaseOrder = {};
      purchaseOrder.id = entry.payoutPayment.purchaseOrder.id;
      purchaseOrder.refNo = entry.payoutPayment.purchaseOrder.refNo;
      purchaseOrder.vendor = entry.payoutPayment.purchaseOrder.vendor.name;
      purchaseOrder.project = entry.payoutPayment.purchaseOrder.project.title;
      purchaseOrder.pdf =
        entry.payoutPayment.purchaseOrder.pdf &&
        entry.payoutPayment.purchaseOrder.pdf.file;
      purchaseOrder.taxInvoice =
        entry.payoutPayment.purchaseOrder.taxInvoice &&
        entry.payoutPayment.purchaseOrder.taxInvoice.file.file;
      result.purchaseOrder = purchaseOrder;
    }
    if (entry.payoutPayment && entry.payoutPayment.opexBill) {
      var bill = {};
      bill.id = entry.payoutPayment.opexBill.id;
      bill.building = entry.payoutPayment.opexBill.building.name;
      bill.serviceProvider = entry.payoutPayment.opexBill.serviceProvider.name;
      bill.billImage =
        entry.payoutPayment.opexBill.image &&
        entry.payoutPayment.opexBill.image.file;
      if (entry.payoutPayment.opexBill.opexType) {
        var r = entry.payoutPayment.opexBill;
        bill.indexNo = r.indexNo;
        bill.opexCategoryId = r.opexType.category
          ? r.opexType.category.id
          : r.opexType.type.category.id;
        bill.opexCategory = r.opexType.category
          ? r.opexType.category.name
          : r.opexType.type.category.name;
        if (r.opexType.type) {
          bill.opexItem = r.opexType ? r.opexType.name : null;
          bill.opexType =
            r.opexType && r.opexType.type ? r.opexType.type.name : null;
        } else {
          bill.opexType = r.opexType ? r.opexType.name : null;
        }
      }
      result.bill = bill;
    }
    if (entry.opexType) {
      var r = entry;
      var noBill = {};
      noBill.opexCategory = r.opexType.category
        ? r.opexType.category.name
        : r.opexType.type.category.name;
      if (r.opexType.type) {
        noBill.opexItem = r.opexType ? r.opexType.name : null;
        noBill.opexType =
          r.opexType && r.opexType.type ? r.opexType.type.name : null;
      } else {
        noBill.opexType = r.opexType ? r.opexType.name : null;
      }
      if (entry.building) {
        noBill.building = entry.building.name;
      }
      result.noBill = noBill;
    }

    if (entry.pettyCashAccount) {
      result.pettyCashAccount = entry.pettyCashAccount.name;
    }
    if (entry.debitCardAccount) {
      result.debitCardAccount = entry.debitCardAccount.name;
    }
    return result;
  } catch (e) {
    log.write("AccountsService ::: getPayoutEntry :: exception : ", e);
    throw e;
  }
};
service.listPayoutEntries = async (data) => {
  try {
    log.write("AccountsService ::: listPayoutEntries :: data : ", data);
    var where = {};
    var attributes;
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    if (data.filters.type && data.filters.type != "") {
      where["type"] = data.filters.type;
    }
    if (data.filters.types && data.filters.types.length) {
      where["type"] = { $in: data.filters.types };
    }
    if (data.filters.statuses && data.filters.statuses.length) {
      where["status"] = { $in: data.filters.statuses };
    }
    if (data.filters.paymentModes && data.filters.paymentModes.length) {
      where["paymentMode"] = { $in: data.filters.paymentModes };
    }
    if (data.filters.paymentMode && data.filters.paymentMode.length) {
      where["paymentMode"] = data.filters.paymentMode;
    }
    // var startDate = utils.moment().add(-1, 'months').startOf('month');
    // var endDate = utils.moment().endOf('month');
    var startDate, endDate;
    if (data.filters && data.filters.startDate) {
      startDate = utils.moment(data.filters.startDate);
    }
    if (data.filters && data.filters.endDate) {
      endDate = utils.moment(data.filters.endDate);
    }
    if (
      data.filters.paymentMode == "PettyCash" &&
      data.filters.pettyCashAccountId
    ) {
      where.pettyCashAccountId = data.filters.pettyCashAccountId;
    }
    if (
      data.filters.paymentMode == "CardPayment" &&
      data.filters.debitCardAccountId
    ) {
      where.debitCardAccountId = data.filters.debitCardAccountId;
    }
    // if (data.filters.paymentMode == 'BankTransfer') {
    var $or = [];
    if (data.filters.suspense) {
      // where.suspense = 1;
      $or.push({ suspense: 1 });
    }
    if (data.filters.nonExpense) {
      // where.nonExpense = 1;
      $or.push({ nonExpense: 1 });
    }
    if (data.filters.noBill) {
      // where.noBill = 1;
      $or.push({ noBill: 1 });
    }
    if (data.filters.notAttributed) {
      $or.push({ status: { $ne: "Attributed" } });
    }
    if (data.filters.notLinked) {
      // where.linked = { $eq: null };
      $or.push({ linked: { $eq: null } });
    }
    if (data.filters.linked) {
      // where.linked = 1;
      $or.push({ linked: 1 });
    }
    // }
    if ($or.length) {
      where["$and"] = { $or: $or };
    }
    if (startDate && endDate) {
      where.paidOn = { $between: [startDate.toDate(), endDate.toDate()] };
    }

    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      if (query.search.indexOf("<") > -1) {
        var index = query.search.indexOf("<");
        var number = parseInt(query.search.substr(index + 1));
        if (number > 0) {
          where["amount"] = { $lte: number };
        }
      } else if (query.search.indexOf(">") > -1) {
        var index = query.search.indexOf(">");
        var number = parseInt(query.search.substr(index + 1));
        if (number > 0) {
          where["amount"] = { $gte: number };
        }
      } else if (query.search.indexOf("-") > -1) {
        var numbers = query.search.split("-");
        if (numbers.length > 1 && numbers[0] > 0 && numbers[1] > 0) {
          where["amount"] = {
            $and: [{ $gte: numbers[0] }, { $lte: numbers[1] }],
          };
        }
      } else {
        $or.push(
          Sequelize.where(
            Sequelize.fn("lower", Sequelize.literal("`payout_entries`.info")),
            {
              $like: query.search.toLowerCase() + "%",
            }
          )
        );
        $or.push(
          Sequelize.where(
            Sequelize.fn("round", Sequelize.literal("`payout_entries`.amount")),
            query.search
          )
        );
        where["$and"] = { $or: $or };
      }
    }
    if (data.companyId) {
      where.companyId = data.companyId;
    }
    var order = ["id", "desc"];
    if (data.sortBy) {
      order = [data.sortBy, data.sortOrder || "asc"];
    }
    // log.write("AccountsService ::: listPayoutEntries :: where : ", JSON.stringify(where, null, 2));
    var results = await PayoutEntry.findAll({
      where: where,
      include: [
        "linkedTo",
        "pettyCashAccount",
        {
          as: "payoutPayment",
          model: PayoutPayment,
          include: [
            {
              as: "purchaseOrder",
              model: PurchaseOrder,
              include: [
                "vendor",
                "building",
                {
                  as: "taxInvoice",
                  model: PurchaseOrderInvoice,
                  include: ["file"],
                },
              ],
            },
            {
              as: "opexBill",
              model: OpexBill,
              include: ["serviceProvider", "building", "image"],
            },
            {
              as: "exitRequest",
              model: ExitRequest,
              include: [{ as: "booking", model: Booking, include: ["client"] }],
            },
          ],
        },
      ],
      offset: data.offset,
      limit: data.limit,
      order: [order],
    });
    log.write(
      "AccountsService ::: listPayoutEntries :: results count : " +
        results.length
    );
    var payouts = [];
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      log.write("AccountsService ::: listPayoutEntries :: row : ", r.toJSON());
      var payout = {
        id: r.id,
        info: r.info,
        narration: r.narration,
        type: r.type,
        paymentMode: r.paymentMode,
        amount: r.amount,
        status: r.status,
        chequeNo: r.chequeNo,
        issuedOn: r.issuedOn,
        addedBy: r.addedBy,
        addedOn: r.addedOn,
        paidBy: r.paidBy,
        paidOn: r.paidOn,
        reason: r.reason,
        linkedTo: r.linkedTo,
        attributed: r.attributed || r.salary || r.noBill,
        suspense: r.suspense,
        nonExpense: r.nonExpense,
        purchaseOrderId: r.purchaseOrderId,
        providerBillId: r.providerBillId,
        payoutPaymentId: r.payoutPaymentId,
        // active: r.nonExpense ? 0 : 1,
        notAttributed:
          r.attributed || r.salary || r.noBill || r.nonExpense || r.suspense
            ? 0
            : 1,
        utr: r.utr,
      };
      if (r.payoutPayment && r.payoutPayment.exitRequest) {
        payout.billFile = r.payoutPayment.exitRequest.finalStatement
          ? r.payoutPayment.exitRequest.finalStatement.file
          : "";
        payout.info = r.payoutPayment.info;
      } else if (r.payoutPayment && r.payoutPayment.opexBill) {
        payout.billNo = r.payoutPayment.opexBill
          ? r.payoutPayment.opexBill.indexNo
          : "";
        payout.billFile = r.payoutPayment.opexBill.image
          ? r.payoutPayment.opexBill.image.file
          : "";
        // payout.info = r.payoutPayment.info + " - " + payout.billNo;
        if (
          r.payoutPayment.opexBill.serviceProvider &&
          r.payoutPayment.opexBill.building
        ) {
          payout.info =
            payout.billNo +
            " - " +
            r.payoutPayment.opexBill.serviceProvider.name +
            " - " +
            r.payoutPayment.opexBill.building.name;
        } else if (r.payoutPayment.opexBill.serviceProvider) {
          payout.info =
            payout.billNo +
            " - " +
            r.payoutPayment.opexBill.serviceProvider.name;
        } else {
          payout.info = payout.billNo;
        }
      } else if (r.payoutPayment && r.payoutPayment.purchaseOrder) {
        payout.billNo = r.payoutPayment.purchaseOrder
          ? r.payoutPayment.purchaseOrder.refNo
          : "";
        if (r.payoutPayment.purchaseOrder.taxInvoice) {
          log.write(
            "AccountsService ::: listPayoutEntries :: po taxInvoice : ",
            r.payoutPayment.purchaseOrder.taxInvoice.toJSON()
          );
          payout.billFile = r.payoutPayment.purchaseOrder.taxInvoice.file
            ? r.payoutPayment.purchaseOrder.taxInvoice.file.file
            : "";
        }
        // payout.info = payout.info + " - " + payout.billNo;
        if (
          r.payoutPayment.purchaseOrder.vendor &&
          r.payoutPayment.purchaseOrder.building
        ) {
          payout.info =
            payout.billNo +
            " - " +
            r.payoutPayment.purchaseOrder.vendor.name +
            " - " +
            r.payoutPayment.purchaseOrder.building.name;
        } else if (r.payoutPayment.purchaseOrder.vendor) {
          payout.info =
            payout.billNo + " - " + r.payoutPayment.purchaseOrder.vendor.name;
        } else if (r.payoutPayment.purchaseOrder.building) {
          payout.info =
            payout.billNo + " - " + r.payoutPayment.purchaseOrder.building.name;
        }
      }
      if (r.noBill) {
        payout.status = "NoBill";
        payout.info = r.reason;
      } else if (r.nonExpense) {
        payout.status = "NonExpense";
        payout.info = r.reason;
      } else if (r.suspense) {
        payout.status = "Suspense";
        payout.info = r.reason;
      } else if (r.notAttributed) {
        payout.status = "UnAttributed";
      } else if (r.toPayoutGateway && r.paymentMode == "BankTransfer") {
        payout.status = "ITB - PG";
        payout.info = "Credit to Payout PG";
      } else if (
        r.debitCardAccountId == -1 &&
        r.paymentMode == "BankTransfer"
      ) {
        payout.status = "ITB - Cards";
        payout.info = "Credit to Payout Card";
      } else if (r.pettyCashAccountId && r.paymentMode == "BankTransfer") {
        payout.status = "ITB - PettyCash";
        payout.info = "Credit to PettyCash / " + r.pettyCashAccount.name;
      }
      payouts.push(payout);
    }

    return payouts;
  } catch (e) {
    log.write("AccountsService ::: listPayoutEntries :: exception : ", e);
    throw e;
  }
};
service.savePayoutEntry = async (data, username) => {
  try {
    log.write("AccountsService ::: savePayoutEntry :: data : ", data);
    var item = {};
    if (!data.attributed) {
      if (data.paidOn) {
        data.paidBy = username;
        data.paidOn = data.paidOn || new Date();
        data.status = "Debited";
      } else if (data.issuedOn) {
        data.status = "Issued";
      }
    }
    if (data.id) {
      if (data.amountSearch) {
        var payoutEntries = await PayoutEntry.findAll({
          where: { payoutPaymentId: data.payoutPaymentId },
        });
        var totalAmount = _.sumBy(payoutEntries, "amount");
        log.write(
          "AccountsService ::: savePayoutEntry :: totalAmount of multiple bills : " +
            totalAmount
        );
        totalAmount = totalAmount + data.amount - 10;
        if (totalAmount > parseInt(data.amountSearch)) {
          throw "Bill Amount is already attributed and cannot attribute excess amount. ";
        }
      }
      data.updated = new Date();
      data.updatedBy = username;
      await PayoutEntry.update(data, { where: { id: data.id } });
      item = data;
    } else {
      data.addedOn = new Date();
      data.addedBy = username;
      data.status = "Debited";
      if (data.issuedOn) {
        data.status = "Issued";
      }
      var where = { utr: data.utr };
      if (!data.utr) {
        where = { narration: data.narration };
      }
      item = await PayoutEntry.findOne({ where: where });
      if (item) {
        log.write(
          "AccountService ::: savePayoutEntry :: duplicate found for " +
            item.utr
        );
      }
      if ((!item || !item.id) && data.amount && data.narration) {
        item = await PayoutEntry.create(data);
      }
    }
    return item;
  } catch (e) {
    log.write("AccountService ::: savePayoutEntry :: exception : ", e);
    throw e;
  }
};
service.listPayouts = async (data) => {
  try {
    log.write("AccountsService ::: listPayouts :: data : ", data);
    var where = {};
    var attributes;
    if (data.filters.type && data.filters.type != "") {
      where["type"] = data.filters.type;
    }
    if (data.filters.types && data.filters.types != "") {
      where["type"] = { $in: data.filters.types };
    }
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    if (data.filters.statuses && data.filters.statuses.length) {
      where["status"] = { $in: data.filters.statuses };
    }
    if (data.filters.paymentModes && data.filters.paymentModes != "") {
      where["paymentMode"] = { $in: data.filters.paymentModes };
      // var $or = [];
      // if (data.filters.paymentModes.indexOf("CashFree") > -1) {
      //   $or.push({ 'transferId': { $ne: null } });
      // }
      // if (data.filters.paymentModes.indexOf("BankTransfer") > -1) {
      //   $or.push({ $and: [{ paymentMode: 'BankTransfer' }, { 'transferId': { $eq: null } }] });
      // }
      // if (data.filters.paymentModes.indexOf("CardPayment") > -1) {
      //   $or.push({ paymentMode: 'CardPayment' });
      // }
      // if (data.filters.paymentModes.indexOf("Cheque") > -1) {
      //   $or.push({ paymentMode: 'Cheque' });
      // }
      // if (data.filters.paymentModes.indexOf("Cash") > -1) {
      //   $or.push({ paymentMode: 'Cash' });
      // }
      // log.write("AccountsService ::: listPayouts :: paymentModes where : ", $or);
      // where['$and'] = { $or: $or }
    }
    var startDate, endDate;
    if (data.filters && data.filters.startDate) {
      startDate = utils.moment(data.filters.startDate);
    }
    if (data.filters && data.filters.endDate) {
      endDate = utils.moment(data.filters.endDate);
    }
    // if (data.filters.showUnpaid) {
    //   where.status = { $notIn: ['Paid'] };
    //   delete where.paymentMode;
    // }
    if (startDate && endDate) {
      where.paidOn = { $between: [startDate.toDate(), endDate.toDate()] };
    }

    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("benificiary.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      // if (data.filters.type == 'VendorPayment') {
      // } else if (data.filters.type == 'ExitRefund') {
      //   $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('exitRequest.booking.client.name')), {
      //     $like: query.search.toLowerCase() + "%"
      //   }))
      //   $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('exitRequest.booking.office.name')), {
      //     $like: query.search.toLowerCase() + "%"
      //   }))
      // }
      where["$and"] = { $or: $or };
    }
    // var include = ['benificiary'];
    var include = [
      "benificiary",
      {
        as: "exitRequest",
        model: ExitRequest,
        include: [
          { as: "booking", model: Booking, include: ["client", "office"] },
        ],
      },
      {
        as: "purchaseOrder",
        model: PurchaseOrder,
        include: ["vendor"],
        attributes: ["isBill", "isOpex", "vendorId"],
      },
    ];
    // if (data.filters.type == 'VendorPayment') {
    // include = ['benificiary', { as: 'purchaseOrder', model: PurchaseOrder, include: ['vendor', 'office'] }];
    // } else if (data.filters.type == 'ExitRefund') {
    //   include = ['benificiary', { as: 'exitRequest', model: ExitRequest, include: [{ as: 'booking', model: Booking, include: ['client', 'office'] }] }];
    // }
    if (data.companyId) {
      where.companyId = data.companyId;
    }
    var order = ["id", "desc"];
    if (data.sortBy) {
      order = [data.sortBy, data.sortOrder || "asc"];
      if (data.sortBy == "benificiary") {
        order = ["benificiary", "name", data.sortOrder || "asc"];
      }
    }
    log.write("AccountsService ::: listPayouts :: where : ", where);
    var results = await PayoutPayment.findAll({
      where: where,
      include: include,
      offset: data.offset,
      limit: data.limit,
      order: [order],
    });
    log.write(
      "AccountsService ::: listPayouts :: results count : " + results.length
    );
    var payouts = [];
    // log.write("AccountsService ::: listPayouts :: row : ", results[0].toJSON());
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var type = "OpexBill";
      if (r.purchaseOrder) {
        if (r.purchaseOrder.isBill) {
          type = "CapexBill";
        } else if (r.purchaseOrder.isOpex) {
          type = "OpexPO";
        } else {
          type = "CapexPO";
        }
      } else if (r.exitRequest) {
        type = "ExitRefund";
      }
      var payout = {
        id: r.id,
        info: r.info,
        type: r.type,
        paymentMode: r.paymentMode,
        amount: r.amount,
        status: r.status,
        subType: type,
        paymentStatus: r.paymentStatus,
        approvedBy: r.approvedBy,
        chequeNo: r.chequeNo,
        issuedOn: r.issuedOn,
        purchaseOrderId: r.purchaseOrderId || "poid",
        providerBillId: r.providerBillId || "billid",
        approvedOn: r.approvedOn
          ? utils.moment(r.approvedOn).format("MMM DD, YYYY")
          : null,
        paidBy: r.paidBy,
        paidOn: r.paidOn ? utils.moment(r.paidOn).format("MMM DD, YYYY") : null,
        rejectedMessage: r.rejectedMessage,
        paymentRefId: r.paymentRefId,
        utr: r.utr,
      };
      if (r.status == "FuturePayout") {
        // payout.status = 'Approved';
        payout.utr =
          "To pay on " +
          utils
            .moment(r.futurePayoutDate)
            .add(8, "hours")
            .format("MMM DD, YYYY");
      }
      if (r.benificiary) {
        payout.benificiary =
          r.benificiary.name + "(" + r.benificiary.phone + ")";
      }
      if (r.purchaseOrder && r.purchaseOrder.vendor) {
        // log.write("AccountsService ::: listPayouts :: vendor : ", r.purchaseOrder.vendor.toJSON());
        // var vendor = await Vendor.findOne({ where: { id: r.purchaseOrder.vendorId } });
        payout.info = r.purchaseOrder.vendor.name;
        payout.vendorId = r.purchaseOrder.vendor.id;
        payout.link = "/#/purchases/vendor/" + payout.vendorId;
        log.write(
          "AccountsService ::: listPayouts :: vendor link  : ",
          payout.link
        );
      } else if (r.exitRequest) {
        payout.info =
          r.exitRequest.booking.client.company ||
          r.exitRequest.booking.client.name;
        payout.bookingId = r.exitRequest.booking.id;
        payout.link = "/#/bookings/view/" + payout.bookingId;
        log.write(
          "AccountsService ::: listPayouts :: booking link  : ",
          payout.link
        );
      }
      // if(r.type == 'ExitRefund'){
      //   r.context = r.exitRequest.office
      // }
      payouts.push(payout);
    }
    return payouts;
  } catch (e) {
    log.write("AccountsService ::: listPayouts :: exception : ", e);
    throw e;
  }
};
service.savePayout = async (data, username) => {
  try {
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      if (data.approved) {
        data.approvedBy = username;
        data.approvedOn = new Date();
        data.status = "Approved";
        data.paymentMode = "CashFree";
      }
      if (data.paid) {
        data.paidBy = username;
        data.paidOn = data.paidOn || new Date();
        data.status = "Paid";
      } else if (data.issuedOn) {
        data.status = "Issued";
      }
      await PayoutPayment.update(data, { where: { id: data.id } });

      if (data.status == "Issued") {
        await PurchaseOrderMilestone.update(
          {
            paidBy: username,
            paidOn: data.paidOn || new Date(),
            status: "Issued",
          },
          { where: { payoutId: data.id } }
        );
      } else if (data.paid) {
        var payout = await PayoutPayment.findOne({ where: { id: data.id } });

        var info = payout.info;
        if (payout.purchaseOrderId) {
          await PurchaseOrderMilestone.update(
            {
              paidBy: username,
              utr: data.utr,
              paidOn: data.paidOn || new Date(),
              status: "Paid",
            },
            { where: { payoutId: data.id } }
          );

          var poMileStones = await PurchaseOrderMilestone.findAll({
            where: { purchaseOrderId: payout.purchaseOrderId },
          });
          var paidMileStones = _.filter(poMileStones, { status: "Paid" });
          if (paidMileStones.length == poMileStones.length) {
            var purchaseOrder = await PurchaseOrder.findOne({
              include: ["project"],
              where: { id: payout.purchaseOrderId },
            });
            var poStatus = "Closed";
            if (purchaseOrder.isBill) {
              poStatus = "Paid";
            }
            if (purchaseOrder.project) {
              info = info + " / " + purchaseOrder.project.title;
            }
            await PurchaseOrder.update(
              {
                closedBy: username,
                closedOn: new Date(),
                status: poStatus,
              },
              { where: { id: payout.purchaseOrderId } }
            );
          }
        } else if (payout.providerBillId) {
          await OpexBill.update(
            {
              paidBy: username,
              utr: data.utr,
              paidOn: data.paidOn || new Date(),
              status: "Paid",
            },
            { where: { id: payout.providerBillId } }
          );
        }

        var payoutEntry = {
          payoutPaymentId: payout.id,
          utr: payout.utr,
          info: payout.info,
          status: "Attributed",
          attributed: 1,
          amount: payout.amount,
          paidOn: payout.paidOn,
          paidBy: payout.paidBy,
          chequeNo: payout.chequeNo,
          paymentMode: payout.paymentMode,
          addedOn: new Date(),
          addedBy: "system",
          companyId: data.companyId,
        };
        if (payout.paymentMode == "PettyCash") {
          payoutEntry.paymentMode = "PettyCash";
          payoutEntry.pettyCashAccountId = payout.pettyCashAccountId;
          payoutEntry = await PayoutEntry.create(payoutEntry);
          log.write(
            "AccountService ::: savePayout :: added debit entry : ",
            payoutEntry.toJSON()
          );
        } else if (payout.paymentMode == "CardPayment") {
          // payoutEntry.paymentMode = 'CardPayment';
          // payoutEntry.debitCardAccountId = payout.debitCardAccountId;
          // payoutEntry = await PayoutEntry.create(payoutEntry)
        }
      }
      item = data;
    } else {
      item = await PayoutPayment.create(data);
    }
    return item;
  } catch (e) {
    log.write("AccountService ::: savePayout :: exception : ", e);
    throw e;
  }
};
service.processPayout = async (data, username) => {
  try {
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      var payout = await PayoutPayment.findOne({
        where: { id: data.id },
        include: ["benificiary"],
      });
      item = await services.processPayout(payout, username);
    }
    return item;
  } catch (e) {
    log.write("AccountService ::: processPayout :: exception : ", e);
    throw e;
  }
};
service.updatePayoutStatus = async (data, username) => {
  try {
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      var payout = await PayoutPayment.findOne({ where: { id: data.id } });
      item = await services.updatePayoutStatus(payout, username);
    }
    return item;
  } catch (e) {
    log.write("AccountService ::: processPayout :: exception : ", e);
    throw e;
  }
};

service.listInvoiceServices = async (data) => {
  try {
    log.write("AccountsService ::: listInvoiceServices :: data : ", data);
    var where = { companyId: data.companyId };
    var attributes;
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    if (data.filters.statuses && data.filters.statuses.length) {
      where["status"] = { $in: data.filters.statuses };
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("name")), {
          $like: query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("category")), {
          $like: query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("type")), {
          $like: query.search.toLowerCase() + "%",
        })
      );
      where["$and"] = { $or: $or };
    }
    var order = ["id", "desc"];
    if (data.sortBy) {
      order = [data.sortBy, data.sortOrder || "asc"];
    } else {
      order = ["name", "asc"];
    }
    log.write("AccountsService ::: listInvoiceServices :: where : ", where);
    var services = await InvoiceService.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
      order: [order],
    });
    log.write(
      "AccountsService ::: listInvoiceServices :: services count : " +
        services.length
    );

    return services;
  } catch (e) {
    log.write("AccountsService ::: listInvoiceServices :: exception : ", e);
    throw e;
  }
};
service.saveInvoiceService = async (data, username) => {
  try {
    log.write("AccountsService ::: saveInvoiceService :: data : ", data);
    var invoiceService = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await InvoiceService.update(data, { where: { id: data.id } });
      invoiceService = data;
    } else {
      invoiceService = await InvoiceService.create(data);
    }
    return invoiceService;
  } catch (e) {
    log.write("AccountsService ::: saveInvoiceService :: exception : ", e);
    throw e;
  }
};

service.listServicePayments = async (data) => {
  try {
    log.write("AccountsService ::: listServicePayments :: data : ", data);
    var where = {};
    var attributes;
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    if (data.filters.type && data.filters.type != "") {
      where["type"] = data.filters.type;
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("serviceProvider.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("service.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("office.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      where["$and"] = { $or: $or };
    }
    var include = ["service", "serviceProvider", "office"];
    if (data.companyId) {
      where.companyId = data.companyId;
    }
    log.write("AccountsService ::: listServicePayments :: where : ", where);
    var results = await ProviderPayment.findAll({
      where: where,
      include: include,
      offset: data.offset,
      limit: data.limit,
      order: [["id", "desc"]],
    });
    log.write(
      "AccountsService ::: listServicePayments :: results count : " +
        results.length
    );
    return results;
  } catch (e) {
    log.write("AccountsService ::: listServicePayments :: exception : ", e);
    throw e;
  }
};
service.saveServicePayment = async (data, username) => {
  try {
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      if (data.approved) {
        data.approvedBy = username;
        data.approvedOn = new Date();
        data.status = "Approved";
      }
      await ProviderPayment.update(data, { where: { id: data.id } });
      item = data;
    } else {
      data.date = new Date();
      data.by = username;
      data.status = "Draft";
      item = await ProviderPayment.create(data);
      if (data.paymentMode == "BankTransfer") {
        var client = {
          id: item.id,
          accountNumber: data.bankAccountNumber,
          ifscCode: data.bankIfscCode,
          name: data.bankAccountName,
          email: data.contactEmail,
          phone: data.contactPhone,
        };
        var benificiary = await services.addCashFreeBenificiaryForRefund(
          client,
          item.companyId
        );
        item.set("benificiaryId", benificiary.id);
        item.save();
      }
    }
    return item;
  } catch (e) {
    log.write("AccountService ::: saveServicePayment :: exception : ", e);
    throw e;
  }
};
service.saveServiceBill = async (data, username) => {
  try {
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      if (data.processPayout) {
        var serviceBill = await ProviderBill.findOne({
          include: ["servicePayment"],
          where: { id: data.id },
        });
        data.status = "AwaitPay";
        var payoutPayment = await PayoutPayment.create({
          payoutBenificiaryId: serviceBill.servicePayment.benificiaryId,
          amount: serviceBill.amount,
          approvedBy: username,
          approvedOn: new Date(),
          type: "ProviderPayment",
          status: "Pending",
          providerBillId: serviceBill.id,
          updated: new Date(),
          updatedBy: username,
          companyId: serviceBill.companyId,
        });
        data.payoutPaymentId = payoutPayment.id;
      }
      await ProviderBill.update(data, { where: { id: data.id } });
      item = data;
    } else {
      data.date = new Date();
      data.by = username;
      data.status = "Draft";
      item = await ProviderBill.create(data);
    }
    return item;
  } catch (e) {
    log.write("AccountService ::: saveServiceBill :: exception : ", e);
    throw e;
  }
};
service.listServiceBills = async (data) => {
  try {
    log.write("AccountsService ::: listServiceBills :: data : ", data);
    var where = {};
    var attributes;
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(
          Sequelize.fn(
            "lower",
            Sequelize.literal("`servicePayment->serviceProvider`.name")
          ),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn(
            "lower",
            Sequelize.literal("`servicePayment->service`.name")
          ),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn(
            "lower",
            Sequelize.literal("`servicePayment->office`.name")
          ),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      where["$and"] = { $or: $or };
    }
    var include = {
      as: "servicePayment",
      model: ProviderPayment,
      include: ["service", "serviceProvider", "office"],
    };
    if (data.companyId) {
      where.companyId = data.companyId;
    }
    log.write("AccountsService ::: listServiceBills :: where : ", where);
    var results = await ProviderBill.findAll({
      where: where,
      include: include,
      offset: data.offset,
      limit: data.limit,
      order: [["id", "desc"]],
    });
    log.write(
      "AccountsService ::: listServiceBills :: results count : " +
        results.length
    );
    return results;
  } catch (e) {
    log.write("AccountsService ::: listServiceBills :: exception : ", e);
    throw e;
  }
};
// service.raiseServiceBills = async (data, username) => {
//   try {
//     var sql = `select x.id servicePaymentId,x.effectiveFrom, month(x.date_field) month, year(x.date_field) year, b.id billId from
//       (select m.id, m.effectiveFrom,m.isAdvancePayment, d.date_field
//       from service_provider_payments m
//       left join sys_date d on d.date_field >= m.effectiveFrom and (m.effectiveTo is null or d.date_field < m.effectiveTo) and date(d.date_field)<date(:nextMonthEndDate)
//       where m.status='Approved' and m.companyId=:companyId
//       group by year(d.date_field), month(d.date_field), m.id) x
//       left join service_provider_bills b on b.servicePaymentId = x.id and b.status not in ('Cancelled','Draft','Declined') and
//        ((b.dateFrom between :monthStartDate and :monthEndDate) or (x.isAdvancePayment=1 and b.dateFrom between :nextMonthStartDate and :nextMonthEndDate))
//       order by x.id, year(x.date_field), month(x.date_field)`;

//     var monthStartDate = moment().add(-1, 'months').startOf('month');
//     var monthEndDate = moment().add(-1, 'months').endOf('month');
//     var nextMonthStartDate = moment().startOf('month');
//     var nextMonthEndDate = moment().endOf('month');
//     var replacements = {
//       companyId: data.companyId,
//       monthStartDate: monthStartDate.toDate(),
//       monthEndDate: monthEndDate.toDate(),
//       nextMonthStartDate: nextMonthStartDate.toDate(),
//       nextMonthEndDate: nextMonthEndDate.toDate(),
//     };

//     log.write("AccountService ::: raiseServiceBills ::: replacements :: ", replacements);
//     var servicePayments = await session.db.query(sql, {
//       replacements: replacements,
//       type: Sequelize.QueryTypes.SELECT
//     })
//     log.write("AccountService ::: raiseServiceBills ::: servicePayments :: ", servicePayments);
//     var billsRaised = 0;
//     for (var i = 0; i < servicePayments.length; i++) {
//       var payment = servicePayments[i];
//       if (!payment.billId) {
//         var year = payment.year;
//         var month = payment.month;
//         var servicePayment = await ProviderPayment.findOne({ where: { id: payment.servicePaymentId } });
//         if (!servicePayment) {
//           continue;
//         }
//         var bill = {
//           companyId: servicePayment['companyId'],
//           status: 'New',
//           servicePaymentId: servicePayment.id,
//           officeId: servicePayment['officeId'],
//           updated: new Date(),
//           updatedBy: 'system',
//           approvalRequired: 0
//         }
//         bill['amount'] = servicePayment['amount'] || 0;

//         if (bill['amount'] < servicePayment['minCharge'] || bill['amount'] > servicePayment['maxCharge']) {
//           bill['approvalRequired'] = 1;
//         }
//         if (servicePayment.amountType == 'Fixed') {
//           bill['approvalRequired'] = 0;
//           bill.status = 'Approved';
//         }

//         // var startDate = month.startOf('month').add(servicePayment['invoice_start_day'] - 1, 'days');
//         var startDate = moment(year + '-' + month + '-' + servicePayment['invoiceStartDay'], 'YYYY-MM-DD');
//         log.write('AccountService ::: raiseServiceBills :: startDate ', startDate);
//         var endDate = startDate.clone().add(servicePayment['invoiceFrequency'], 'months').clone().add(-1, 'days');
//         log.write('AccountService ::: raiseServiceBills :: endDate ', endDate);
//         var dueDate = moment(year + '-' + month + '-' + servicePayment['invoiceDueDay'], 'YYYY-MM-DD');
//         log.write('AccountService ::: raiseServiceBills :: dueDate ', dueDate);
//         var billDate = moment(year + '-' + month + '-' + servicePayment['invoiceDay'], 'YYYY-MM-DD');
//         log.write('AccountService ::: raiseServiceBills :: billDate ', billDate);
//         if (!servicePayment['isAdvancePayment']) {
//           startDate = startDate.clone().add(-1, 'months');
//           endDate = startDate.clone().add(servicePayment['invoiceFrequency'], 'months').add(-1, 'days');
//         }
//         bill['dateFrom'] = startDate.toDate();
//         bill['dateTo'] = endDate.toDate();
//         bill['billDueDate'] = dueDate.toDate();
//         bill['billDate'] = billDate.toDate();

//         var previousStartDate = startDate.clone().add(servicePayment['invoiceFrequency'] * -1, 'months');
//         log.write('AccountService ::: raiseServiceBills :: previousStartDate ', previousStartDate);
//         if (servicePayment['invoiceFrequency'] > 1) {
//           var resBills = await ProviderBill.findAll({
//             where: {
//               servicePaymentId: servicePayment.id,
//               billDate: { $between: [previousStartDate.toDate(), startDate.clone().add(-1, 'days').toDate()] },
//               status: { $notIn: ['Cancelled'] }
//             }
//           });
//           log.write('AccountService ::: raiseServiceBills :: bills ' + resBills.length);
//           if (resBills.length > 0) {
//             log.write('AccountService ::: raiseServiceBills :: shouldnt raise this month bill ');
//             continue;
//           }
//         }

//         if (moment(servicePayment['effectiveTo']).isBefore(endDate)) {
//           endDate = moment(servicePayment['effectiveTo']);
//           bill['dateTo'] = endDate.toDate();
//           var noOfDays = endDate.diff(startDate, 'days') + 1;
//           var chargePerDay = bill.amount / startDate.daysInMonth();
//           if (servicePayment['invoiceFrequency'] > 1) {
//             chargePerDay = bill.amount / (30 * servicePayment['invoiceFrequency']);
//           }
//           log.write('AccountService ::: raiseServiceBills :: datediff ' + endDate.diff(startDate, 'days'));
//           log.write('AccountService ::: raiseServiceBills :: noOfDays ' + noOfDays);
//           log.write('AccountService ::: raiseServiceBills :: chargePerDay ' + chargePerDay);
//           bill['amount'] = Math.round(chargePerDay * noOfDays);
//           if (noOfDays > 0 && endDate.diff(startDate, 'days') > -1) {
//             await ProviderBill.create(bill);
//             billsRaised++;
//           }
//         } else if (moment(servicePayment['effectiveFrom']).isAfter(startDate)) {

//           log.write('AccountService ::: raiseServiceBills :: effectiveDateTo ', moment(servicePayment['effectiveTo']).toDate());
//           if (servicePayment['effectiveTo'] == null || !moment(servicePayment['effectiveTo']).isValid() || moment(servicePayment['effectiveTo']).isAfter(endDate)) {
//             startDate = moment(servicePayment['effectiveFrom']);
//             bill['dateFrom'] = startDate.toDate();
//             bill['billDate'] = startDate.toDate();
//           } else if (moment(servicePayment['effectiveTo']).isBefore(endDate)) {
//             startDate = moment(servicePayment['effectiveFrom']);
//             bill['dateFrom'] = startDate.toDate();
//             endDate = moment(servicePayment['effectiveTo']);
//             bill['dateTo'] = endDate.toDate();
//           }

//           var noOfDays = endDate.diff(startDate, 'days') + 1;
//           var chargePerDay = bill.amount / startDate.daysInMonth();
//           if (servicePayment['invoiceFrequency'] > 1) {
//             chargePerDay = bill.amount / (30 * servicePayment['invoiceFrequency']);
//           }
//           log.write('AccountService ::: raiseServiceBills :: datediff ' + endDate.diff(startDate, 'days'));
//           log.write('AccountService ::: raiseServiceBills :: noOfDays ' + noOfDays);
//           log.write('AccountService ::: raiseServiceBills :: chargePerDay ' + chargePerDay);
//           bill['amount'] = Math.round(chargePerDay * noOfDays);
//           if (noOfDays > 0 && endDate.diff(startDate, 'days') > -1) {
//             await ProviderBill.create(bill);
//             billsRaised++;
//           }
//         } else {
//           log.write('AccountService ::: raiseServiceBills :: normal case ');
//           await ProviderBill.create(bill);
//           billsRaised++;
//         }
//         log.write('AccountService ::: raiseServiceBills :: bill ', bill);

//         if (moment(servicePayment['effectiveFrom']).isAfter(previousStartDate) && moment(servicePayment['effectiveFrom']).isBefore(startDate)) {
//           log.write('AccountService ::: raiseServiceBills :: previousStartDate ', previousStartDate);
//           log.write('AccountService ::: raiseServiceBills :: curecnt start date ', billDate.clone().add(-1, 'days'));

//           var resBills = await ProviderBill.findAll({ where: { servicePaymentId: servicePayment.id, billDate: { $between: [previousStartDate.toDate(), billDate.clone().add(-1, 'days').toDate()] }, status: { $notIn: ['Cancelled'] } } });
//           log.write('AccountService ::: raiseServiceBills :: bills ' + resBills.length);
//           if (resBills.length == 0) {
//             var noOfDays = startDate.diff(moment(servicePayment['effectiveFrom']), 'days');
//             var chargePerDay = bill.amount / moment(servicePayment['effectiveFrom']).daysInMonth();
//             if (servicePayment['invoiceFrequency'] > 1) {
//               chargePerDay = bill.amount / (30 * servicePayment['invoiceFrequency']);
//             }
//             var effectiveDateFrom = moment(servicePayment['effectiveFrom']);
//             bill['dateFrom'] = effectiveDateFrom.toDate();
//             endDate = startDate.clone().add(-1, 'days');
//             bill['dateTo'] = endDate.toDate();
//             bill['billDate'] = effectiveDateFrom.toDate();

//             log.write('AccountService ::: raiseServiceBills :: old months : noOfDays ', noOfDays);
//             log.write('AccountService ::: raiseServiceBills ::  old months :  chargePerDay ', chargePerDay);
//             bill['amount'] = Math.round(chargePerDay * noOfDays);
//             if (noOfDays > 0) {
//               await ProviderBill.create(bill);
//               billsRaised++;
//             }

//             log.write('AccountService ::: raiseServiceBills :: previous bill ', bill);
//           }
//         }
//       }
//     }
//     return billsRaised + " are raised successfully.";
//   } catch (e) {
//     log.write("AccountService ::: raiseServiceBills :: exception : ", e)
//     throw (e);
//   }
// }

exports.service = service;
