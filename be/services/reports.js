'use strict';

var Q = require('q');
var moment = require('moment');
var _ = require('lodash');
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var nodemailer = require('nodemailer');
var request = require('request-promise');
var atob = require('atob');
// var request = require("request");

var config = require('../utils/config').config;
var session = require("./session");
var log = require('../utils/log').log;
var utils = require('../utils/utils').utils;
var systemUtils = require('./utils/system_util').utils;

var Constants = require("./models/constants");
var Doc = require("./models/base").Doc;
var Booking = require("./models/base").Booking;
var Company = require("./models/base").Company;
var BuildingContact = require("./models/base").BuildingContact;
var BuildingContractTerm = require("./models/base").BuildingContractTerm;
var BuildingAmc = require("./models/base").BuildingAmc;
var BuildingAmcItem = require("./models/base").BuildingAmcItem;
var ResourceBooking = require("./models/base").ResourceBooking;
var Resource = require("./models/base").Resource;
var Office = require("./models/base").Office;
var Schedule = require("./models/base").Schedule;
var Client = require("./models/base").Client;
var ClientEmployee = require("./models/base").ClientEmployee;
var Invoice = require("./models/base").Invoice;
var Priority = require("./models/base").Priority;
var Ticket = require("./models/base").Ticket;
var ExitRequest = require("./models/base").ExitRequest;
var Contract = require("./models/base").Contract;
var Activity = require("./models/base").Activity;
var ArCallHistory = require("./models/base").ArCallHistory;
var Provider = require("./models/base").Provider;
var MiData = require("./models/base").MiData;
var WorkOrder = require("./models/base").WorkOrder;
var PurchaseOrder = require("./models/base").PurchaseOrder;
var PurchaseItem = require("./models/base").PurchaseItem;
var Project = require("./models/base").Project;
var Vendor = require("./models/base").Vendor;
var VendorContact = require("./models/base").VendorContact;
var BillsQueue = require("./models/base").BillsQueue;
var OpexBill = require("./models/base").OpexBill;
var OpexType = require("./models/base").OpexType;
var OpexCategory = require("./models/base").OpexCategory;
var Provider = require("./models/base").Provider;
var ProviderContact = require("./models/base").ProviderContact;
var Visits = require("./models/base").Visits;
var Payment = require("./models/base").Payment;
var PayoutPayment = require("./models/base").PayoutPayment;
var OpexBill = require("./models/base").OpexBill;
var Visit = require("./models/base").Visit;
var Building = require("./models/base").Building;
var User = require("./models/base").User;
var Sku = require("./models/base").Sku;
var SkuCategory = require("./models/base").SkuCategory;
var SkuType = require("./models/base").SkuType;
var User = require("./models/base").User;
var Lead = require("./models/base").Lead;
var PurchaseOrderMilestone = require("./models/base").PurchaseOrderMilestone;

var services = require("./services").service;
var bookingsService = require("./bookings").service;

var service = {};


service.downloadBills = async (data) => {
  try {
    var startDate = utils.moment(data.month + "-01");
    var endDate = startDate.clone().endOf('month');
    var where = "";
    startDate = utils.moment(startDate).format("YYYY-MM-DD HH:mm:ss");
    endDate = utils.moment(endDate).format("YYYY-MM-DD HH:mm:ss");
    where = where + " and i.invoiceDate between '" + startDate + "' and '" + endDate + "'";
    var sql = `select  d.file, d.name
                from vendor_purchase_order_invoices i
                left join docs d on d.id=i.docId
                left join vendor_purchase_orders p on p.id=i.purchaseOrderId
                where d.file is not null and p.isBill=1 and p.status not in ('Deleted','Draft') and p.companyId=` + data.companyId + where;

    log.write("ReportsService ::: downloadBills :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: downloadBills :: results count : " + results.length);
    var files = [];
    _.each(results, function(r) {
      if (r.file && r.file.split("/").length) {
        files.push({
          path: './resources/' + r.file.split("/").pop(),
          name: r.name
        })
      }
    })
    return files;
  } catch (e) {
    log.write("ReportsService ::: downloadInvoices :: exception : ", e);
    throw (e);
  }
}
service.downloadInvoices = async (data) => {
  try {
    var startDate = utils.moment(data.month + "-01");
    var endDate = startDate.clone().endOf('month');
    var where = " and b.companyId = 1";
    startDate = utils.moment(startDate).format("YYYY-MM-DD HH:mm:ss");
    endDate = utils.moment(endDate).format("YYYY-MM-DD HH:mm:ss");
    where = where + " and i.date between '" + startDate + "' and '" + endDate + "'";
    var sql = `select d.file, d.name from invoices i
            left join docs d on d.id = i.pdfId
            left join bookings b on i.bookingId = b.id
            where b.status not in ('Cancelled','Failed') and i.isCancelled=0 and i.isLiability=0 ` + where + `
            order by i.date`;

    log.write("ReportsService ::: downloadInvoices :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: downloadInvoices :: results count : " + results.length);
    var files = [];
    _.each(results, function(r) {
      if (r.file && r.file.split("/").length) {
        files.push({
          path: './resources/' + r.file.split("/").pop(),
          name: r.name
        })
      }
    })
    return files;
  } catch (e) {
    log.write("ReportsService ::: downloadInvoices :: exception : ", e);
    throw (e);
  }
}
// service.getExitStatement = async(data) => {
//     log.write("ReportsService ::: getExitStatement :: data : ", data);
//   try {
//     var exit = await ExitRequest.findOne({where:{bookingId: data.bookingId, status:}})
//    return exit;
//   } catch (e) {
//     log.write("ReportsService ::: getExitStatement :: exception : ", e);
//     throw (e);
//   }
// }
service.listCustomers = async (data) => {
  try {
    var filters = data;
    var whereSql = "";
    if (filters.search) {
      whereSql = whereSql + " and lower(c.company) like '%" + filters.search.toLowerCase() + "%'"
    }
    if (filters.itLedgerNotAdded) {
      whereSql = whereSql + " and (b.itLedgerAdded is null or b.itLedgerAdded=0) ";
    }
    if (filters.itLedgerNotsettled) {
      whereSql = whereSql + " and (b.ended is not null and b.itLedgerSettled is null or b.itLedgerSettled=0) ";
    }
    if (filters.statuses && filters.statuses.length) {
      var statuses = [];
      _.each(filters.statuses, function(s) {
        statuses.push("'" + s + "'")
      })
      whereSql = whereSql + " and b.status in (" + statuses.join(",") + ")";
    }
    var sql = `select ifnull(c.gstNo,c.id) id, i.amount, trim(company) company, c.name, c.gstNo,c.panNo, e.security, e.refund, e.refundDate,
       b.id bookingId,  ifnull(b.refNo,rbb.refNo) refNo, b.refNo brefNo, rb.refNo rbrefNo, b.status, b.started, b.ended,b.status, b.itLedgerAdded, b.itLedgerSettled,
       gst.file gstFile, pan.file panFile
      from invoices i
      left join bookings b on i.bookingId=b.id
      left join exit_requests e on e.bookingId=b.id and e.fcpStatus='Refunded'
      left join clients c on c.id=b.clientId
      left join resource_bookings rb on rb.bookingId=b.id
      left join bookings rbb on rbb.id = rb.parentBookingId
      left join docs gst on gst.id = c.gstRegistrationId
      left join docs pan on pan.id = c.panCardId 
      where b.companyId=` + data.companyId + ` and i.isCancelled=0 and i.status!='Cancelled'  ` + whereSql +
      ` group by b.id order by c.company asc`;

    log.write("ReportsService ::: listCustomers :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: listCustomers :: results count : " + results.length);
    return results;
  } catch (e) {
    log.write("ReportsService ::: listCustomers :: exception : ", e);
    throw (e);
  }
}
service.listProducts = async (data) => {
  try {
    var sql = `select ins.category, ins.type, ins.sacCode, ins.hasGst, ins.igst, ins.cgst, ins.sgst, ins.tds
              from invoices i
              left join bookings b on b.id=i.bookingId
              left join invoice_items ii on ii.invoiceId=i.id
              left join invoice_services ins on ins.id = ii.invoiceServiceId
              where b.companyId=` + data.companyId + ` and b.status not in ('Cancelled','Failed') and ins.id is not null and i.isCancelled=0 and i.isLiability=0 and b.companyId=` + data.companyId + ` 
              group by ins.type
              order by i.isLiability, ins.category`;
    log.write("ReportsService ::: listProducts :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: listProducts :: results count : " + results.length);
    return results;
  } catch (e) {
    log.write("ReportsService ::: listProducts :: exception : ", e);
    throw (e);
  }
}
service.getRevenueInvoices = async (data) => {
  try {
    var where = " and b.companyId=" + data.companyId;
    if (data.search) {
      where = where + " and (c.name like '%" + data.search + "%' or c.company like '%" + data.search + "%' or ins.name like '%" + data.search + "%' or  DATE_FORMAT(i.date,'%b %y')  like '%" + data.search + "%' )";
    }

    if (data.fromDate && data.toDate) {
      data.fromDate = utils.moment(data.fromDate).add(9, 'hours').format("YYYY-MM-DD");
      data.toDate = utils.moment(data.toDate).format("YYYY-MM-DD");

      where = where + " and i.date between '" + data.fromDate + "' and '" + data.toDate + "'";
    }
    var sql = `select c.id, ifnull(c.company, c.name) client, ins.category, ins.type, ii.invoiceId, i.amount invoiceAmount, d.file, i.date, i.refNo, i.taxableAmount, i.gst, i.tds,
             DATE_FORMAT(i.date,'%b %y') month, DATE_FORMAT(i.date,'%y%m') mon, ins.sacCode, ii.item, ii.amount, ii.tds, ii.cgst,ii.sgst,ii.igst, ii.total, c.gstNo, c.panNo, b.itLedgerAdded, b.itLedgerSettled
            from invoices i
            left join invoice_items ii on ii.invoiceId=i.id
            left join docs d on d.id = i.pdfId
            left join invoice_services ins on ins.id = ii.invoiceServiceId
            left join bookings b on i.bookingId = b.id
            left join clients c on c.id = b.clientId
            where b.status not in ('Cancelled','Failed') and ins.id is not null and i.isCancelled=0 and i.isLiability=0 ` + where + `
            order by i.date, i.isLiability, ins.category`;

    log.write("ReportsService ::: getRevenueInvoices :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getRevenueInvoices :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: getRevenueInvoices :: exception : ", e);
    throw (e);
  }
}
service.listTdsDueClients = async (data) => {
  try {
    var where = " and b.companyId=" + data.companyId;
    if (data.filters && data.filters.search) {
      where = where + " and (c.name like '%" + data.filters.search + "%' or c.company like '%" + data.filters.search + "%'  or b.refNo like '%" + data.filters.search + "%') ";
    }
    if (data.fromDate && data.toDate) {
      data.fromDate = utils.moment(data.fromDate).add(9, 'hours').format("YYYY-MM-DD");
      data.toDate = utils.moment(data.toDate).format("YYYY-MM-DD");

      where = where + " and i.date between '" + data.fromDate + "' and '" + data.toDate + "'";
    }
    var orderBy = "ROUND((sum(tds-tdsPaid)/security)*100) desc";
    if (data.sortBy && data.sortOrder) {
      if (data.sortBy == "client") {
        orderBy = " ifnull(c.company,c.name) " + data.sortOrder;
      } else if (data.sortBy == "tdsdue") {
        orderBy = " sum(tds-tdsPaid) " + data.sortOrder;
      } else if (data.sortBy == "duepercent") {
        orderBy = " ROUND((sum(tds-tdsPaid)/security)*100)  " + data.sortOrder;
      } else {
        orderBy = data.sortBy + " " + data.sortOrder;
      }
    }
    var sql = `SELECT i.bookingId, ifnull(c.company,c.name) client, b.refNo, c.gstNo, sum(tds-tdsPaid) tdsdue, security, ROUND((sum(tds-tdsPaid)/security)*100) duepercent
                FROM invoices i 
                left join bookings b on i.bookingId=b.id
                left join clients c on b.clientId=c.id
                left join contracts ct on b.contractId=ct.id
                where b.refNo is not NULL and i.isCancelled=0 and i.isLiability=0 and ct.term='LongTerm'
                and b.status not  in ('Failed','Cancelled','Settled') and b.companyId=` + data.companyId + where +
      ` GROUP BY b.id HAVING sum(tds-tdsPaid)>0 order by ` + orderBy;

    log.write("ReportsService ::: listTdsDueClients :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: listTdsDueClients :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: listTdsDueClients :: exception : ", e);
    throw (e);
  }
}
service.listVendors = async (data) => {
  try {
    var filters = data;
    var whereSql = "";
    if (filters.search) {
      whereSql = whereSql + " and (lower(v.name) like '%" + filters.search.toLowerCase() + "%' or lower(c.name) like '%" + filters.search.toLowerCase() + "%' or lower(c.email) like '%" + filters.search.toLowerCase() + "%' or lower(c.phone) like '%" + filters.search.toLowerCase() + "%')"
    }
    if (filters.itLedgerNotAdded) {
      whereSql = whereSql + " and (v.itLedgerAdded is null or v.itLedgerAdded=0) ";
    }
    var sql = `select v.name, v.id vendorId, v.vendorType type,v.gst,v.pan,c.phone,c.email,c.name contact, v.itLedgerAdded
                from vendor_purchase_orders p, vendors v, vendor_contacts c 
                where v.id=p.vendorId and p.companyId=` + data.companyId + ` and c.vendorId=v.id and p.status not in ('Deleted','Declined') ` + whereSql + `
                group by v.id order by v.name`;
    log.write("ReportsService ::: listVendors :: sql : " + sql);
    var vendors = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: listVendors :: vendors count : " + vendors.length);

    whereSql = "";
    if (filters.search) {
      whereSql = whereSql + " and (lower(p.name) like '%" + filters.search.toLowerCase() + "%' or lower(c.name) like '%" + filters.search.toLowerCase() + "%' or lower(c.email) like '%" + filters.search.toLowerCase() + "%' or lower(c.phone) like '%" + filters.search.toLowerCase() + "%')"
    }
    if (filters.itLedgerNotAdded) {
      whereSql = whereSql + " and (p.itLedgerAdded is null or p.itLedgerAdded=0) ";
    }
    sql = `select p.name, p.id providerId, p.type ,p.gst,p.pan,c.phone,c.email,c.name contact,p.itLedgerAdded
              from service_providers p, service_provider_contacts c 
              where p.companyId=` + data.companyId + ` and c.serviceProviderId=p.id ` + whereSql + ` 
              group by p.id order by p.name`;
    log.write("ReportsService ::: listVendorProviders :: sql : " + sql);
    var providers = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: listVendorProviders :: vendors count : " + vendors.length);

    return { vendors: vendors, providers: providers };
  } catch (e) {
    log.write("ReportsService ::: listVendors :: exception : ", e);
    throw (e);
  }
}
service.getExpenseBills = async (data) => {
  try {
    var where = " and b.companyId=" + data.companyId;
    // if (data.search) {
    //   where = where + " and (p.name like '%" + data.search + "%' or g.name like '%" + data.search + "%')";
    // }
    // if (data.fromDate && data.toDate) {
    //   data.fromDate = utils.moment(data.fromDate).add(9, 'hours').format("YYYY-MM-DD HH:mm:ss");
    //   data.toDate = utils.moment(data.toDate).format("YYYY-MM-DD HH:mm:ss");
    //   where = where + " and b.billDate between '" + data.fromDate + "' and '" + data.toDate + "'";
    // }
    // var sql = `select p.name provider, g.name building, oc.name category, ifnull(ott.name, ot.name) type, ott.id ottId, ot.name item, 
    //             b.amount, inv.billNo, inv.invoiceDate date, inv.invoiceDueDate dueDate 
    //             from vendor_purchase_orders b
    //             left join vendor_purchase_order_invoices inv on inv.id=b.taxInvoiceId
    //             left join buildings g on g.id=b.buildingId
    //             left join vendor_purchase_items i on i.purchaseOrderId=b.id
    //             left join opex_types ot on ot.id = i.opexTypeId
    //             left join opex_types ott on ot.typeId = ott.id
    //             left join opex_categories oc on oc.id=ot.catId or oc.id=ott.catId
    //             left join service_providers p on p.id=b.serviceProviderId
    //             where b.status in ('Raised','Approved','PrePaid','Paid') ` + where + `
    //             order by p.name`;

    // log.write("ReportsService ::: getExpenseBills :: sql : " + sql);
    // var opexBills = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    // log.write("ReportsService ::: getExpenseBills :: opexBills count : " + opexBills.length);
    // var buildingBills = _.filter(opexBills, function(i) {
    //   return i.building != null
    // });
    // var hoBills = _.filter(poBills, function(i) {
    //   return i.building == null
    // });


    where = " and p.companyId=" + data.companyId;
    if (data.search) {
      where = where + " and (v.name like '%" + data.search + "%' or g.name like '%" + data.search + "%')";
    }
    if (data.fromDate && data.toDate) {
      data.fromDate = utils.moment(data.fromDate).format("YYYY-MM-DD");
      data.toDate = utils.moment(data.toDate).format("YYYY-MM-DD");
      where = where + " and i.invoiceDate between '" + data.fromDate + "' and '" + data.toDate + "'";
    }
    var sql = `select v.name vendor, g.name building,p.buildingId, p.refNo, i.invoiceNo, d.file, p.amount, i.invoiceDate date, i.invoiceDueDate dueDate, p.isBill, p.isOpex
                from vendor_purchase_order_invoices i
                left join docs d on d.id=i.docId
                left join vendor_purchase_orders p on p.id=i.purchaseOrderId
                left join buildings g on g.id=p.buildingId
                left join vendors v on v.id = p.vendorId
                where p.companyId=` + data.companyId + where + `
                order by v.name`;

    log.write("ReportsService ::: getExpenseBills :: sql : " + sql);
    var poBills = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getExpenseBills :: poBills count : " + poBills.length);

    var capexPos = _.filter(poBills, function(i) {
      return i.isBill == 0 && i.isOpex == 0
    });
    var opexPos = _.filter(poBills, function(i) {
      return i.isOpex == 1 && i.isBill == 0
    });



    where = " and p.companyId=" + data.companyId;
    if (data.search) {
      where = where + " and (v.name like '%" + data.search + "%' or g.name like '%" + data.search + "%')";
    }
    if (data.fromDate && data.toDate) {
      data.fromDate = utils.moment(data.fromDate).format("YYYY-MM-DD");
      data.toDate = utils.moment(data.toDate).format("YYYY-MM-DD");
      where = where + " and p.date between '" + data.fromDate + "' and '" + data.toDate + "'";
    }
    var sql = `select v.name vendor, g.name building,p.buildingId, p.refNo, i.invoiceNo, d.file, p.amount, i.invoiceDate date, i.invoiceDueDate dueDate, p.isBill, p.isOpex
                from vendor_purchase_order_invoices i
                left join docs d on d.id=i.docId
                left join vendor_purchase_orders p on p.id=i.purchaseOrderId
                left join buildings g on g.id=p.buildingId
                left join vendors v on v.id = p.vendorId
                where p.companyId=` + data.companyId + where + `
                order by v.name`;

    log.write("ReportsService ::: getExpenseBills :: sql : " + sql);
    var opexBills = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getExpenseBills :: opexBills count : " + opexBills.length);


    var capexBills = _.filter(opexBills, function(i) {
      return i.isBill == 1 && i.isOpex == 0
    });
    var buildingBills = _.filter(opexBills, function(i) {
      return i.isOpex == 1 && i.isBill == 1 && i.buildingId > 0
    });
    var hoBills = _.filter(opexBills, function(i) {
      return i.isOpex == 1 && i.isBill == 1 && i.buildingId < 0
    });
    return {
      buildingBills: buildingBills,
      hoBills: hoBills,
      capexPos: capexPos,
      capexBills: capexBills,
      opexPos: opexPos,
    };
  } catch (e) {
    log.write("ReportsService ::: getExpenseBills :: exception : ", e);
    throw (e);
  }
}

service.listActivities = async (data) => {
  try {
    log.write("ReportsService ::: listActivities :: data : ", data);
    var where = {};
    if (data.filters.search && data.filters.search != '') {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('updatedBy')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('activity')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('update')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push()
      where['$and'] = { $or: $or }
    }
    var results = await Activity.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("ReportsService ::: listActivities :: ArCallHistory count : " + results.length);
    return results;
  } catch (e) {
    log.write("ReportsService ::: listActivities :: exception : ", e);
    throw (e);
  }
}

service.getExpensesReport = async (data) => {
  try {
    var groupBy = "i.id,g.id";
    var where = "";
    if (data.filters.locationId) {
      where = where + " and g.locationid=" + data.filters.locationId;
    }
    if (data.filters.isOpex) {
      where = where + " and po.isOpex=" + data.filters.isOpex;
    }
    if (data.filters.isHq) {
      where = where + " and po.buildingId=-1";
    }
    // var sql = `select co.id countryId, co.name country, c.id cityId, c.name city, l.id locationId, l.name location,
    var sql = `select g.id buildingId, g.name building, v.id vendorId, v.name vendor, s.catId, sc.name category, s.typeId, st.name type, 
              s.id skuId, s.name sku, sum(i.amount) expense, sum(i.amount) amount, DATE_FORMAT(ifnull(i.dateFrom, po.date),'%b %y') month, DATE_FORMAT(ifnull(i.dateFrom, po.date),'%y%m') mon
              from vendor_purchase_items i
              left join skus s on s.id = i.skuId
              left join sku_categories sc on sc.id = s.catId
              left join sku_types st on st.id = s.typeId
              left join vendor_purchase_orders po on po.id=i.purchaseOrderId
              left join vendors v on v.id = po.vendorId
              left join buildings g on po.buildingId = g.id
              left join locations l on l.id = g.locationId
              left join cities c on c.id = l.cityId
              left join countries co on co.id = c.countryId
              where po.companyId=` + data.companyId + ` and po.status in ('Approved','Paid','PrePaid','Closed') 
              and i.status not in ('Archived') and po.isBill=0 ` + where + ` group by ` + groupBy;

    log.write("ReportsService ::: getExpensesReport :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getExpensesReport :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: getExpensesReport :: exception : ", e);
    throw (e);
  }
}
service.getBillsReport = async (data) => {
  try {
    var groupBy = " i.purchaseOrderId, ifnull(i.dateFrom, b.date)";
    var where = "";
    if (data.locationId) {
      where = where + " and o.locationid=" + data.locationId;
    }
    if (data.onlyAp) {
      where = where + " and b.status!='Paid' and b.status!='Cancelled'";
    } else {
      where = where + "  and b.status in ('Approved','Paid','PrePaid','Closed')";
    }
    if (data.filters.isHq) {
      where = where + " and b.buildingId=-1 and oc.office=1";
    } else {
      where = where + " and oc.office = 0";
    }
    if (!data.toDate || data.toDate == '') {
      data.toDate = utils.moment().format("YYYY-MM-DD")
    }
    if (!data.fromDate || data.fromDate == '') {
      data.fromDate = utils.moment().add(-8, 'months').startOf('month');
    }
    data.fromDate = utils.moment(data.fromDate).add(9, 'hours').format("YYYY-MM-DD");
    data.toDate = utils.moment(data.toDate).endOf('month').format("YYYY-MM-DD");

    if (data.fromDate && data.toDate) {
      where = where + " and b.date between '" + data.fromDate + "' and '" + data.toDate + "'";
    }
    var sql = `select g.id buildingId, g.name building, o.id officeId, o.name office, p.id serviceProviderId, p.name serviceProvider, 
              oc.name category, ot.name type, oitc.name itemCategory,ifnull(oc.office,oitc.office) isOfficeExpense, oit.name itemType, oi.name item, pp.paymentMode,
              b.date billDate, DATE_FORMAT(ifnull(i.dateFrom, b.date),'%b %y') month, DATE_FORMAT(ifnull(i.dateFrom, b.date),'%y%m') mon, ifnull(i.taxableAmount, 0) amount, inv.invoiceDueDate billDueDate
              from vendor_purchase_orders b
              left join vendors p on p.id = b.vendorId
              left join opex_recurring_payments pp on pp.id = b.opexPaymentId
              left join buildings g on g.id = b.buildingId
              left join offices o on o.id = b.officeId  
              left join vendor_purchase_order_invoices inv on inv.id=b.taxInvoiceId
              left join vendor_purchase_items i on i.purchaseOrderId=b.id
              left join opex_types oi on oi.id = i.opexTypeId          
              left join opex_types oit on oit.id = oi.typeId
              left join opex_categories oitc on oitc.id = oit.catId        
              left join opex_types ot on ot.id = i.opexTypeId
              left join opex_categories oc on oc.id = ot.catId
              where b.companyId=` + data.companyId + ` and b.buildingId is not null and b.isBill=1 and b.isOpex=1 
              and i.status not in ('Archived')  ` + where + ` group by ` + groupBy + ` order by ifnull(i.dateFrom, b.date) `;

    log.write("ReportsService ::: getBillsReport :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getBillsReport :: results count : " + results.length);

    _.each(results, function(r) {
      if (r.category) {
        r.item = null;
      } else {
        r.category = r.itemCategory;
        r.type = r.itemType;
      }
      r.building = r.building ? r.building : "Head Office";
      delete r.itemCategory;
      delete r.itemType;
    })
    return results;
  } catch (e) {
    log.write("ReportsService ::: getBillsReport :: exception : ", e);
    throw (e);
  }
}
service.getRevenueReport = async (data) => {
  try {
    var where = " and o.companyId=" + data.companyId;
    if (data.filters && data.filters.search) {
      data.search = data.filters.search;
    }
    if (data.search) {
      where = where + " and (o.name like '%" + data.search + "%' or  ifnull(c.company, c.name) like '%" + data.search + "%' or ins.name like '%" + data.search + "%' or  DATE_FORMAT(i.date,'%b %y')  like '%" + data.search + "%' )";
    }
    if (!data.toDate || data.toDate == '') {
      data.toDate = utils.moment().endOf('month').format("YYYY-MM-DD")
    }
    if (!data.fromDate || data.fromDate == '') {
      data.fromDate = utils.moment(data.toDate).add(-6, 'months').startOf('month');
    }
    if (data.filters && data.filters.fromDate && data.filters.toDate) {
      data.fromDate = data.filters.fromDate;
      data.toDate = data.filters.toDate;
    }
    data.fromDate = utils.moment(data.fromDate).startOf('month').startOf('date').format("YYYY-MM-DD HH:mm:ss");
    data.toDate = utils.moment(data.toDate).endOf('month').endOf('date').format("YYYY-MM-DD HH:mm:ss");

    if (data.fromDate && data.toDate) {
      where = where + " and i.startDate between '" + data.fromDate + "' and '" + data.toDate + "'";
    }

    var orderBy = "i.date, i.isLiability, ins.category";
    if (data.sortBy) {
      orderBy = "i." + data.sortBy + " " + data.sortOrder;
      if (data.sortBy == 'client') {
        orderBy = "ifnull(c.company, c.name) " + data.sortOrder;
      } else if (data.sortBy == 'bookingRefNo') {
        orderBy = "b.refNo " + data.sortOrder;
      }
    } else {
      // orderBy = "i.refNo asc";
    }
    var limitSql = "";
    if (data.limit != null && data.offset != null) {
      limitSql = " limit " + data.offset + "," + data.limit;
    }

    // where = where + " and g.id=3 ";
    var sql = `select c.id, ifnull(c.company, c.name) client, g.id buildingId, g.name building,
            ins.category, ins.type, b.itLedgerAdded, b.itLedgerSettled, i.cancelledReason,
            DATE_FORMAT(i.startDate,'%b %y') month, DATE_FORMAT(i.startDate,'%y%m') mon,ifnull(rbb.refNo, b.refNo) bookingRefNo,
             ifnull(rbb.id, b.id) bookingId, i.refNo, i.startDate date, d.file, cast(sum(ii.amount) as UNSIGNED) amount, i.dueDate,
             ii.cgst, ii.sgst, ii.total, i.gst
            from invoices i
            left join docs d on d.id = i.pdfId
            left join invoice_items ii on ii.invoiceId=i.id
            left join invoice_services ins on ins.id = ii.invoiceServiceId
            left join bookings b on i.bookingId = b.id
            left join resource_bookings rb on rb.bookingId=b.id
            left join bookings rbb on rbb.id = rb.parentBookingId
            left join clients c on c.id = b.clientId
            left join offices o on b.officeId=o.id
            left join buildings g on g.id=o.buildingId
            where b.status not in ('Cancelled','Failed') and ins.id is not null 
            and i.isCancelled=` + (data.filters.cancelled || 0) + ` and i.isLiability=0 ` + where + `
            group by ins.id,i.id
            order by ` + orderBy + limitSql;

    log.write("ReportsService ::: getRevenueReport :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getRevenueReport :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: getRevenueReport :: exception : ", e);
    throw (e);
  }
}
service.getProductsAnalysis = async (data) => {
  try {
    var where = " and o.companyId=" + data.companyId;
    if (data.search) {
      where = where + " and (o.name like '%" + data.search + "%' or g.name like '%" + data.search + "%' or c.deskType like '%" + data.search + "%' or c.officeType like '%" + data.search + "%'  )";
    }
    // var sql = `select b.id, IFNULL(cl.company, cl.name) client, g.name building, o.name office,
    //             sum(bd.area) usedArea, o.chargeableArea, b.paid, c.deskType, c.officeType
    //             from bookings b
    //             left join contracts c on c.bookingId = b.id
    //             left join clients cl on cl.id = b.clientId
    //             left join booked_desks bd on bd.bookingId = b.id and bd.status != 'Cancelled'
    //             left join desks d on d.id = bd.deskId
    //             left join cabins cb on cb.id = d.cabinId
    //             left join offices o on o.id = cb.officeId
    //             left join buildings g on g.id = o.buildingId
    //             where b.status not in ('Failed', 'Cancelled') and b.companyId = ` + data.companyId + `
    //             group by b.id
    //             order by g.id, cl.company, c.deskType`;

    if (!data.toDate || data.toDate == '') {
      data.toDate = utils.moment().format("YYYY-MM-DD")
    }
    if (!data.fromDate || data.fromDate == '') {
      data.fromDate = utils.moment(data.toDate).endOf('month').add(-6, 'months');
    }
    data.fromDate = utils.moment(data.fromDate).add(9, 'hours').format("YYYY-MM-DD");
    data.toDate = utils.moment(data.toDate).endOf('day').format("YYYY-MM-DD HH:mm");

    if (data.fromDate && data.toDate) {
      where = where + " and i.date between '" + data.fromDate + "' and '" + data.toDate + "'";
    }
    // where = where + " and g.id=3 ";
    var sql = `select c.id, ifnull(c.company, c.name) client, g.id buildingId, g.name building, ct.deskType,ct.officeType, ii.amount amount, 
            DATE_FORMAT(i.date,'%b %y') month, DATE_FORMAT(i.date,'%y%m') mon
            from invoices i
            left join invoice_items ii on ii.invoiceId=i.id
            left join bookings b on i.bookingId = b.id
            left join clients c on c.id = b.clientId
            left join contracts ct on ct.id = b.contractId
            left join offices o on b.officeId=o.id
            left join buildings g on g.id=o.buildingId
            where b.status not in ('Cancelled','Failed') and ct.deskType is not null and i.isCancelled=0 and i.isLiability=0 ` + where + `
            order by i.date, ct.deskType`;

    log.write("ReportsService ::: getProductsAnalysis :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getProductsAnalysis :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: getProductsAnalysis :: exception : ", e);
    throw (e);
  }
}
service.getLiabilityReport = async (data) => {
  try {
    var where = " and o.companyId=" + data.companyId;
    if (data.search) {
      where = where + " and (o.name like '%" + data.search + "%' or g.name like '%" + data.search + "%'  or c.company like '%" + data.search + "%' or c.name like '%" + data.search + "%' ";
    }
    // where = where + " and g.id=3 ";
    var sql = `select c.id, ifnull(c.company, c.name) client, ct.name city, l.name location,g.id buildingId, g.name building, 
            CONVERT(sum(ifnull(i.liability,i.taxableAmount)),UNSIGNED INTEGER) amount, b.status, b.started,b.ended
            from invoices i
            left join invoice_items ii on ii.invoiceId=i.id
            left join invoice_services ins on ins.id = ii.invoiceServiceId
            left join bookings b on i.bookingId = b.id
            left join clients c on c.id = b.clientId
            left join offices o on b.officeId=o.id
            left join buildings g on g.id=o.buildingId
            left join locations l on l.id = g.locationId
            left join cities ct on ct.id = l.cityId
            where ins.id is not null and b.status not in ('Settled')
            and i.isCancelled=0 and i.isLiability=1 and (i.isLiabilityCleared=0 or i.liability>0) ` + where + `
            group by b.id order by i.date `;

    log.write("ReportsService ::: getLiabilityReport :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getLiabilityReport :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: getLiabilityReport :: exception : ", e);
    throw (e);
  }
}

service.getARReport = async (data) => {
  try {
    var groupBy = "g.id";
    var where = " and o.companyId=" + data.companyId;
    if (data.countryId) {
      where = where + " and c.countryId=" + data.countryId;
    }
    if (data.cityId) {
      where = where + " and c.id=" + data.cityId;
    }
    if (data.cityIds) {
      where = where + " and c.id in (" + data.cityIds + ") ";
    }
    if (data.locationId) {
      where = where + " and l.id=" + data.locationId;
    }
    if (data.locationIds) {
      where = where + " and l.id in (" + data.locationIds + ") ";
    }
    if (data.buildingId) {
      where = where + " and g.id=" + data.buildingId;
      groupBy = groupBy + ",o.id";
    }
    if (data.buildingIds) {
      where = where + " and g.id in (" + data.buildingIds + ") ";
    }
    if (data.officeId) {
      where = where + " and o.id=" + data.officeId + " and b.due>0 ";
      groupBy = groupBy + ",b.id";
    }
    if (data.search) {
      where = where + " and (o.name like '%" + data.search + "%' or l.name like '%" + data.search + "%' or ct.name like '%" + data.search + "' or cl.name like '%" + data.search + "'  or cl.company like '%" + data.search + "' )";
    }
    var sql = `SELECT g.id buildingId, g.name building, b.officeId, g.locationId, l.cityId, c.countryId, b.id bookingId, o.name office, ifnull(cl.company, cl.name) client, sum(invoiced) invoiced, sum(paid) paid, sum(due) due
                FROM bookings b
                left join clients cl on cl.id=b.clientId 
                left join offices o on o.id = b.officeId
                left join buildings g on o.buildingId = g.id
                left join locations l on g.locationId = l.id
                left join cities c on c.id=l.cityId
                where 1=1 and b.status not in ('Failed','New') and due>0 ` + where + ` group by ` + groupBy;
    log.write("ReportsService ::: getARReport :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getARReport :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: getARReport :: exception : ", e);
    throw (e);
  }
}

service.getInvoiceSummery = async (data) => {
  try {
    var groupBy = "g.id";
    var where = " and o.companyId=" + data.companyId;
    if (data.countryId) {
      where = where + " and c.countryId=" + data.countryId;
    }
    if (data.cityId) {
      where = where + " and c.id=" + data.cityId;
    }
    if (data.cityIds) {
      where = where + " and c.id in (" + data.cityIds + ") ";
    }
    if (data.locationId) {
      where = where + " and l.id=" + data.locationId;
    }
    if (data.locationIds) {
      where = where + " and l.id in (" + data.locationIds + ") ";
    }
    if (data.buildingId) {
      where = where + " and g.id=" + data.buildingId;
      groupBy = groupBy + ",o.id";
    }
    if (data.buildingIds) {
      where = where + " and g.id in (" + data.buildingIds + ") ";
    }
    if (data.officeId) {
      where = where + " and o.id=" + data.officeId ;
      groupBy = groupBy + ",b.id";
    }
    if (data.search) {
      where = where + " and (o.name like '%" + data.search + "%' or l.name like '%" + data.search + "%' or ct.name like '%" + data.search + "' or cl.name like '%" + data.search + "'  or cl.company like '%" + data.search + "' )";
    }
    if(data.startDate && data.endDate) {
      where = where + " and i.date BETWEEN '" + data.startDate + "' and '" + data.endDate +"'";
    }
    if(data.deskType) {
      where = where + " and ct.deskType in ('" + data.deskType.join("','")+"')";
    }
    var sql = `SELECT distinct(i.id), g.id buildingId, g.name building, b.officeId, g.locationId, l.cityId, c.countryId, b.id bookingId, o.name office, ifnull(cl.company, cl.name) client, 
		sum(b.invoiced) invoiced, sum(b.paid) paid, sum(ct.rent) rent, sum(i.taxableAmount) taxableAmount, sum(i.gst) gst, sum(i.tds) tds, sum(i.amount) total, count(b.id) bookingsCount
                FROM bookings b
                left join invoices i on b.id=i.bookingid 
                left join clients cl on cl.id=b.clientId 
                left join contracts ct on ct.id=b.contractId 
                left join offices o on o.id = b.officeId 
                left join buildings g on o.buildingId = g.id 
                left join locations l on g.locationId = l.id 
                left join cities c on c.id=l.cityId 
                where 1=1 and b.status not in ('Failed','New') and i.type in ('OfficeRent','Monthly') and i.isCancelled = 0  ` +  where 
                + ` group by ` + groupBy;
    log.write("ReportsService ::: getInvoiceSummery :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getInvoiceSummery :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: getInvoiceSummery :: exception : ", e);
    throw (e);
  }
}

service.getTDSARReport = async (data) => {
  try {
    var groupBy = "g.id";
    var columns = "g.id buildingId, g.name building, b.officeId, g.locationId, l.cityId, c.countryId, b.id bookingId, o.name office, ifnull(cl.company, cl.name) client, sum(tds - tdsPaid) tdsDue, sum(tdsPaid) tdsPaid, sum(tds) tds ";
    var where = " and o.companyId=" + data.companyId;
    if (data.countryId) {
      where = where + " and c.countryId=" + data.countryId;
    }
    if (data.cityId) {
      where = where + " and c.id=" + data.cityId;
    }
    if (data.locationId) {
      where = where + " and l.id=" + data.locationId;
    }
    if (data.buildingId) {
      where = where + " and g.id=" + data.buildingId;
      groupBy = groupBy + ",o.id";
    }
    if (data.officeId) {
      where = where + " and o.id=" + data.officeId;
      groupBy = groupBy + ",b.id";
    }
    if (data.bookingId) {
      where = where + " and b.id=" + data.bookingId;
      groupBy = " i.id";
      columns = " i.id, i.bookingId, i.amount, i.tds, i.tdsPaid, i.isTdsCleared, i.tdsForm, i.date, i.refNo ";
    }

    if (!data.toDate || data.toDate == '') {
      data.toDate = utils.moment().format("YYYY-MM-DD")
    }
    if (!data.fromDate || data.fromDate == '') {
      data.fromDate = utils.moment(data.toDate).endOf('month').add(-6, 'months');
    }
    data.fromDate = utils.moment(data.fromDate).add(9, 'hours').format("YYYY-MM-DD");
    data.toDate = utils.moment(data.toDate).format("YYYY-MM-DD");
    if (data.fromDate && data.toDate) {
      where = where + " and i.date between '" + data.fromDate + "' and '" + data.toDate + "'";
    }
    if (data.search) {
      where = where + " and (o.name like '%" + data.search + "%' or l.name like '%" + data.search + "%' or ct.name like '%" + data.search + "' or cl.name like '%" + data.search + "'  or cl.company like '%" + data.search + "' )";
    }
    var sql = `SELECT ` + columns + `
                FROM invoices i 
                left join bookings b on b.id = i.bookingId
                left join clients cl on cl.id=b.clientId 
                left join offices o on o.id = b.officeId
                left join buildings g on o.buildingId = g.id
                left join locations l on g.locationId = l.id
                left join cities c on c.id=l.cityId
                where 1=1 and i.isCancelled=0 and i.tds>0 and b.status not in ('Failed','New') ` + where + ` group by ` + groupBy;
    log.write("ReportsService ::: getTDSARReport :: SQL : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getTDSARReport :: results count : " + results.length);

    if (data.bookingId) {
      for (var i = 0; i < results.length; i++) {
        results[i].tdsFormFile = await systemUtils.getFile(results[i].tdsForm);
      }
    }
    return results;
  } catch (e) {
    log.write("ReportsService ::: getTDSARReport :: exception : ", e);
    throw (e);
  }
}
service.getTDSAPReport = async (data) => {
  try {
    var sql = `select v.name vendor, m.name milestone, d.year, d.tdsDeducted, d.date,d.status from 
              vendor_tds_deductions d, vendors v, vendor_purchase_order_milestones m, vendor_purchase_orders po, vendor_projects p
              where v.id=d.vendorId and m.id=d.milestoneId and m.purchaseOrderId=po.id and po.projectId=p.id `;
    if (data.year) {
      sql = sql + ` and d.year='` + data.year + `'`;
    }
    log.write("ReportsService ::: getTDSAPReport :: SQL : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getTDSAPReport :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: getTDSAPReport :: exception : ", e);
    throw (e);
  }
}

service.getSupportReport = async (data) => {
  try {
    var where = " and t.companyId=" + data.companyId;
    if (data.search) {
      where = where + " and (g.name like '%" + data.search + "%' or o.name like '%" + data.search + "%' or ifnull(cl.name,cl.company) like '%" + data.search + "%' or t.category like '%" + data.search + "%' or t.context like '%" + data.search + "%'  )";
    }
    if (!data.toDate || data.toDate == '') {
      data.toDate = utils.moment().format("YYYY-MM-DD")
    }
    if (!data.fromDate || data.fromDate == '') {
      data.fromDate = utils.moment(data.toDate).endOf('month').add(-6, 'months');
    }
    data.fromDate = utils.moment(data.fromDate).add(9, 'hours').format("YYYY-MM-DD");
    data.toDate = utils.moment(data.toDate).format("YYYY-MM-DD");

    if (data.fromDate && data.toDate) {
      where = where + " and date between '" + data.fromDate + "' and '" + data.toDate + "'";
    }
    var setAside = 0;
    if (data.setAside) {
      setAside = 1;
    }
    where = where + " and setAside = " + setAside;
    // where = where + " and g.id=3 ";
    var sql = `select c.id, ifnull(c.company, c.name) client,t.bookingId, g.id buildingId, g.name building,
            trim(ifnull(u.name,'UnAssigned')) assignedTo, t.category, ifnull(t.subCategory,'None') subCategory, ct.context, t.status, 
            DATE_FORMAT(t.date,'%b %y') month, DATE_FORMAT(t.date,'%y%m') mon
            from tickets t
            left join ticket_contexts ct on ct.id = t.contextId
            left join users u on u.id = t.assignedTo
            left join bookings b on t.bookingId = b.id
            left join clients c on c.id = b.clientId
            left join offices o on b.officeId=o.id
            left join buildings g on g.id=o.buildingId
            where 1=1 ` + where + `
            order by t.date`;

    log.write("ReportsService ::: getSupportReport :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getSupportReport :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: getSupportReport :: exception : ", e);
    throw (e);
  }
}

service.sendTDSARNotifications = async (data) => {
  try {
    log.write("ReportsService ::: sendTDSARNotifications :: data : ", data);
    var where = "";
    if (!data.toDate || data.toDate == '') {
      data.toDate = utils.moment().format("YYYY-MM-DD")
    }
    if (!data.fromDate || data.fromDate == '') {
      data.fromDate = utils.moment(data.toDate).endOf('month').add(-6, 'months');
    }
    data.fromDate = utils.moment(data.fromDate).add(9, 'hours').format("YYYY-MM-DD");
    data.toDate = utils.moment(data.toDate).format("YYYY-MM-DD");
    if (data.fromDate && data.toDate) {
      where = where + " and i.date between '" + data.fromDate + "' and '" + data.toDate + "'";
    }
    if (data.bookingId) {
      where = where + " b.id=" + data.bookingId;
    }
    var sql = `SELECT b.id, b.refNo, ifnull(c.company, c.name) client, c.email, i.refNo invoiceNo,
                i.name, i.date, i.taxableAmount, i.tds, i.tdsPaid
                FROM invoices i 
                left join bookings b on b.id = i.bookingId
                left join clients c on c.id=b.clientId 
                where 1=1 and i.isCancelled=0 and i.tds>0 and b.status not in ('Failed','New') ` + where;
    log.write("ReportsService ::: sendTDSARNotifications :: SQL : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: sendTDSARNotifications :: results count : " + results.length);

    var bookings = _(results)
      .groupBy(x => x.id)
      .map((value, key) => ({
        id: key,
        client: value[0].client,
        email: value[0].email,
        refNo: value[0].refNo,
        invoices: value
      }))
      .value();

    var company = await systemUtils.getCompany(data.companyId);
    var quarter = utils.moment(data.fromDate).format("MMM") + " - " + utils.moment(data.toDate).format("MMM, YYYY")

    for (var i = 0; i < bookings.length; i++) {
      var booking = bookings[i];
      _.each(booking.invoices, function(i) {
        i.date = utils.moment(i.date).format("MMM DD, YYYY");
        if (!i.tds) {
          i.tds = 0;
        }
        if (!i.invoiceNo) {
          i.invoiceNo = '-';
        }
        if (!i.tdsPaid) {
          i.tdsPaid = 0;
        }
        i.tdsDue = i.tds - i.tdsPaid;
      });
      var totalDue = _.sumBy(booking.invoices, 'tdsDue');
      if (totalDue > 0) {
        var data = {
          clientName: booking.client,
          quarter: quarter,
          refNo: booking.refNo,
          companyName: company.name,
          items: booking.invoices,
          tdsDue: totalDue,
          supportPhone: company.supportPhone,
          supportEmail: company.supportEmail,
          accountsEmail: company.email,
        }
        log.write("BookingService ::: sendTDSARNotifications :: email data : ", data);
        var html = await services.getMailBody("emails/tds_ar_notification.html", data);
        log.write("BookingService ::: sendTDSARNotifications :: html body : " + html.length);
        var subject = data.companyName + " : TDS Due Notification for " + quarter;
        var mail = await services.sendMail(subject, html, [{
          name: booking.client,
          email: booking.email,
          bookingId: booking.id
        }]);
      }
    };

    return bookings.length;
  } catch (e) {
    log.write("ReportsService ::: sendTDSARNotifications :: exception : ", e);
    throw (e);
  }
}

service.getAvailabilityReport = async (data) => {
  try {
    var groupBy = "g.id";
    var where = " and o.companyId=" + data.companyId;
    if (data.countryId) {
      where = where + " and ct.countryId=" + data.countryId;
    }
    if (data.cityId) {
      where = where + " and ct.id=" + data.cityId;
    }
    if (data.locationId) {
      where = where + " and l.id=" + data.locationId;
    }
    if (data.buildingId) {
      where = where + " and g.id=" + data.buildingId;
      groupBy = groupBy + ",o.id";
    }
    if (data.officeId) {
      where = where + " and o.id=" + data.officeId;
      groupBy = groupBy + ",c.id";
    }
    if (data.search) {
      where = where + " and (o.name like '%" + data.search + "%' or l.name like '%" + data.search + "%' or ct.name like '%" + data.search + "' )";
    }
    if (data.cabinId) {
      where = where + " and c.id=" + data.cabinId;
      groupBy = groupBy + ",d.id";
    }
    var sql = `SELECT g.id buildingId, g.name building, o.id, o.name office, c.id as cabinId,c.name cabin, d.id deskId,d.name desk, bd.status,  bd.bookingId, ifnull(cl.company, cl.name) client,
              count(distinct(d.cabinId)) cabinsCount, count(distinct(d.id)) total, sum(if(bd.status='InUse',1,0)) as booked, (count(distinct(d.id)) - sum(if(bd.status='InUse',1,0))) available, 
              sum(if(bd.status='Booked',1,0)) as futureBookings,sum(if(bd.status ='Releasing',1,0)) as futureExits, b.started, DATE_ADD(bd.ended, INTERVAL 1 DAY) releaseDate
              FROM offices o 
              left join buildings g on o.buildingId = g.id
              left join locations l on g.locationId = l.id
              left join cities ct on ct.id=l.cityId
              left join cabins c on c.officeId=o.id and o.active=1 and c.active=1
              left join desks d on d.cabinId=c.id and d.active=1
              left join booked_desks bd on bd.deskId = d.id and bd.status !='Released'
              left join bookings b on b.id = bd.bookingId
              left join clients cl on cl.id = b.clientId
              where 1=1 and o.active=1 and c.active=1 and d.active=1 ` + where + `
              group by ` + groupBy + ` order by ct.countryId,ct.id,l.id,o.id,c.id`;
    log.write("ReportsService ::: getARReport :: SQL : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getARReport :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: getARReport :: exception : ", e);
    throw (e);
  }
}

service.listArCallHistory = async (data) => {
  try {
    log.write("ReportsService ::: listArCallHistory :: data : ", data);
    var where = {};
    if (data.filters.bookingId) {
      where.bookingId = data.filters.bookingId
    }
    if (data.filters.search && data.filters.search != '') {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`booking->client`.`name`')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`booking->client`.`company`')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`booking->client`.`email`')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`booking->client`.`phone`')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`ar_calls_history`.`updatedBy`')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push()
      where['$and'] = { $or: $or }
    }
    var results = await ArCallHistory.findAll({
      include: [{ as: 'booking', model: Booking, include: ['client'] }],
      where: where,
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'desc']
      ]
    });
    log.write("ReportsService ::: listArCallHistory :: ArCallHistory count : " + results.length);
    return results;
  } catch (e) {
    log.write("ReportsService ::: listArCallHistory :: exception : ", e);
    throw (e);
  }
}

service.saveArCallHistory = async (data, username) => {
  try {
    log.write("ReportsService ::: saveArCallHistory :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await ArCallHistory.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await ArCallHistory.create(data);
    }
    return item;
  } catch (e) {
    log.write("ReportsService ::: saveArCallHistory :: exception : ", e);
    throw (e);
  }
}

service.listMiData = async (data) => {
  try {
    log.write("ReportsService ::: listMiData :: data : ", data);
    var where = {};
    if (data.filters.bookingId) {
      where.bookingId = data.filters.bookingId
    }
    if (data.filters.search && data.filters.search != '') {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('competitor')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('location')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('city.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push()
      where['$and'] = { $or: $or }
    }
    var attributes, include = ['city'];
    if (searchCompetitor) {
      attributes = ['competitor'];
      data.offset = 0;
      data.limit = 8;
    }
    var results = await MiData.findAll({
      include: include,
      where: where,
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'desc']
      ]
    });
    log.write("ReportsService ::: listMiData :: MiData count : " + results.length);
    return results;
  } catch (e) {
    log.write("ReportsService ::: listMiData :: exception : ", e);
    throw (e);
  }
}

service.saveMiData = async (data, username) => {
  try {
    log.write("ReportsService ::: saveMiData :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await MiData.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await MiData.create(data);
    }
    return item;
  } catch (e) {
    log.write("ReportsService ::: saveMiData :: exception : ", e);
    throw (e);
  }
}

service.getUserDashboards = async (data, username) => {
  try {
    log.write("ReportsService ::: getUserDashboards :: data : ", data);
    var dashboard = {};
    var where = {};
    var buildingIds;
    if (data.buildingIds && data.buildingIds.length) {
      buildingIds = data.buildingIds;
    }
    where = {
      companyId: data.companyId,
      '$contract.status$': { $in: ['Draft', 'Approved'] },
      status: { $in: ['New', 'Booked'] }
    }
    if (buildingIds) {
      where['$office.buildingId$'] = { $in: buildingIds };
    }
    var results = await Booking.findAll({
      where: where,
      attributes: ['id', 'started'],
      include: [{ as: 'client', model: Client, attributes: ['name', 'company'] },
        { as: 'office', model: Office, attributes: ['buildingId'] },
        { as: 'contract', model: Contract, attributes: ['rent', 'security', 'status'] }
      ]
    });
    dashboard.contractPendingBookings = results;

    where = { companyId: data.companyId, status: { $in: ['Active'] } }
    if (buildingIds) {
      where['$office.buildingId$'] = { $in: buildingIds };
    }
    var futureContracts = await Booking.findAll({
      where: where,
      attributes: ['id', 'started'],
      include: [{ as: 'client', model: Client, attributes: ['name', 'company'] },
        { as: 'office', model: Office, attributes: ['buildingId'] },
        {
          as: 'futureContract',
          model: Contract,
          where: { effectiveDate: { $gt: new Date() }, kind: { $in: ['ReLocation', 'Expansion', 'Contraction'] } },
          attributes: ['rent', 'security', 'status', 'effectiveDate', 'kind']
        }
      ]
    });
    dashboard.futureContracts = futureContracts;

    where = { companyId: data.companyId, status: { $in: ['Exiting', 'Exited'] } };
    if (buildingIds) {
      where['$office.buildingId$'] = { $in: buildingIds };
    }
    var exits = await Booking.findAll({
      where: where,
      attributes: ['id', 'started', 'ended', 'status'],
      include: [{ as: 'exitRequest', model: ExitRequest, attributes: ['fcpStatus', 'refund'] },
        { as: 'office', model: Office, attributes: ['buildingId'] },
        { as: 'client', model: Client, attributes: ['name', 'company'] }
      ]
    });
    dashboard.exits = exits;

    var sql = "select count(b.id) count from bookings b, offices o where b.officeId=o.id and  b.status in ('Active','Exiting') and b.companyId=" + data.companyId;
    if (buildingIds && buildingIds.length) {
      sql = sql + " and o.buildingId in (" + buildingIds.join(",") + ")";
    }
    var activeBookings = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    dashboard.activeBookings = activeBookings[0]['count'];

    sql = `SELECT g.name building,
              CONVERT(sum(if(b.status='Active' or b.status='Exiting',b.due, 0)),UNSIGNED INTEGER) activeDue, 
              CONVERT(sum(if(b.status='Booked' or b.status='New',b.due, 0)),UNSIGNED INTEGER) inActiveDue
              FROM bookings b
              left join offices o on o.id = b.officeId
              left join buildings g on g.id=o.buildingId
              where 1=1 and b.status not in ('Cancelled','Failed') and b.companyId=` + data.companyId;
    if (buildingIds && buildingIds.length) {
      sql = sql + " and g.id in (" + buildingIds.join(",") + ")";
    }
    sql = sql + " group by g.id";
    log.write("ReportsService ::: getUserDashboards :: OverallAr :: SQL : " + sql);
    results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    dashboard.overAllAr = results;

    sql = `SELECT g.name building, CONVERT(sum(if(ii.isLiability=1,i.amount, 0)),UNSIGNED INTEGER) sd, 
          CONVERT(sum(if(i.isLiability=0 and ii.category!='Other',i.amount, 0)),UNSIGNED INTEGER) rents,
          CONVERT(sum(if( ii.category='Other',i.amount, 0)),UNSIGNED INTEGER) others, 
          CONVERT(sum(i.amount),UNSIGNED INTEGER) total
          FROM invoices i
          left join invoice_services ii on i.invoiceServiceId = ii.id
          left join bookings b on i.bookingId = b.id
          left join offices o on o.id = b.officeId
          left join buildings g on g.id=o.buildingId
          where 1=1 and i.isCancelled=0 and b.status not in ('Cancelled','Failed') and i.date between :startDate and :endDate and b.companyId=` + data.companyId;
    if (buildingIds && buildingIds.length) {
      sql = sql + " and g.id in (" + buildingIds.join(",") + ")";
    }
    sql = sql + " group by g.id order by g.id";
    log.write("ReportsService ::: getUserDashboards :: monthlyInvoices :: SQL : " + sql);
    results = await session.db.query(sql, {
      replacements: {
        startDate: utils.moment().startOf('month').add(-1, 'days').toDate(),
        endDate: utils.moment().endOf('month').toDate(),
      },
      type: Sequelize.QueryTypes.SELECT
    });
    dashboard.monthlyInvoices = results;

    return dashboard;
  } catch (e) {
    log.write("ReportsService ::: getUserDashboards :: exception : ", e);
    throw (e);
  }
}

service.getClientDashboards = async (data, username) => {
  try {
    log.write("ReportsService ::: getClientDashboards :: data : ", data);
    var dashboard = {};

    var results = await Booking.findAll({
      where: { clientId: data.clientId, refNo: { $ne: null } },
      attributes: ['id', 'started', 'desks', 'refNo', 'status', 'officeId'],
      include: [{
        as: 'company',
        model: Company,
        attributes: ['accountName', 'accountNumber', 'ifscCode', 'bankName', 'branchName']
      }, {
        as: 'client',
        model: Client,
        attributes: ['name', 'phone', 'email']
      }, {
        as: 'contract',
        model: Contract,
        attributes: ['deskType', 'rent']
      }, {
        as: 'office',
        model: Office,
        attributes: ['name', 'floor'],
        include: [{ as: 'building', model: Building, attributes: ['name', 'image', 'address'] }]
      }]
      // include: [{ as: 'contract', model: Contract, attributes: ['rent', 'security', 'status', 'effectiveDate', 'kind'] }]
    });
    dashboard.myBookings = results;

    // var futureContracts = await Booking.findAll({
    //   where: { status: { $in: ['Active'] }, clientId: data.clientId },
    //   attributes: ['id', 'started', 'offices'],
    //   include: [{ as: 'client', model: Client, attributes: ['name', 'company'] },
    //     {
    //       as: 'futureContract',
    //       model: Contract,
    //       where: { effectiveDate: { $gt: new Date() }, kind: { $in: ['ReLocation', 'Expansion', 'Contraction'] } },
    //       attributes: ['rent', 'security', 'status', 'effectiveDate', 'kind']
    //     }
    //   ]
    // });
    // dashboard.futureContracts = futureContracts;

    var exits = await Booking.findAll({
      where: { status: { $in: ['Exiting', 'Exited'] }, clientId: data.clientId },
      attributes: ['id', 'started', 'ended', 'status', 'offices'],
      include: [{ as: 'exitRequest', model: ExitRequest, attributes: ['fcpStatus', 'refund'] }]
    });
    dashboard.exits = exits;

    dashboard.todaysVisits = 0;

    var bookingIds = _.map(dashboard.myBookings, 'id');

    // var openedTickets = await session.db.query("select count(id) count from tickets where status not in ('Closed') and companyId=" + data.companyId + "  and bookingId in (" + bookingIds.join(",") + ")", { type: Sequelize.QueryTypes.SELECT });
    // dashboard.openedTickets = openedTickets[0]['count'];

    var employees = await session.db.query("select count(id) count from client_employees where companyId=" + data.companyId + "  and clientId in (" + data.clientId + ")", { type: Sequelize.QueryTypes.SELECT });
    dashboard.employees = employees[0]['count'];

    var openedTickets = await Ticket.findAll({
      attributes: ['id', 'category', 'subCategory', 'context', 'refNo', 'status', 'setAside'],
      where: {
        bookingId: { $in: bookingIds },
        status: { $notIn: ['Closed'] }
      }
    })
    dashboard.openedTickets = _.filter(openedTickets, { setAside: 0 });
    dashboard.openedRfcs = _.filter(openedTickets, { setAside: 1 });

    dashboard.pendingInvoices = await Invoice.findAll({
      attributes: ['name', 'due', 'date', 'status', 'bookingId'],
      where: {
        bookingId: { $in: bookingIds },
        status: { $in: ['Pending', 'Due'] }
      }
    })

    dashboard.thisMonthPayments = [];
    if (dashboard.pendingInvoices.length == 0) {
      dashboard.thisMonthPayments = await Payment.findAll({
        attributes: ['amount', 'utr', 'date'],
        where: {
          bookingId: { $in: bookingIds },
          date: { $between: [utils.moment().startOf('month').toDate(), utils.moment().endOf('month').toDate()] },
          cancelled: 0
        }
      })
    }

    // dashboard.employees = await ClientEmployee.findAll({
    //   attributes: ['id', 'name'],
    //   where: {
    //     clientId: data.clientId
    //   }
    // })

    dashboard.upcomingResourceBookings = await ResourceBooking.findAll({
      attributes: ['id', 'name', 'from', 'to', 'refNo', 'status'],
      where: { clientId: data.clientId, status: { $notIn: ['Cancelled', 'Done'] } }
    })

    var creditHistory = await bookingsService.getBookingCreditHistory(bookingIds[0]);
    dashboard.availableCredits = creditHistory.availableCredits;

    return dashboard;
  } catch (e) {
    log.write("ReportsService ::: getClientDashboards :: exception : ", e);
    throw (e);
  }
}

service.getWorkBenches = async (data) => {
  try {
    var workbenches = {
      // deskBookings: {},
      // resourceBookings: {},
      // moveIns: {},
      // exits: {},
      // payins: {},
      // payouts: {},
      // renewals: {},
      // capexPayouts: {},
      // opexPayouts: {},
      // refundPayouts: {},
      // directory: {},
      // visits: {},
      // support: {},
      // notifications: {},
      // workOrders: {},
      // purchaseOrders: {},
      // purchaseCapex: {},
    };
    var where, results;
    var buildingIds;
    if (data.buildingIds && data.buildingIds.length) {
      buildingIds = data.buildingIds;
    }
    if (data.workbenches.indexOf('deskBookings') > -1) {
      workbenches.deskBookings = {};

      where = { status: { $in: ['New', 'Booked', 'Active', 'Exiting'] }, companyId: data.companyId };
      if (buildingIds) {
        where['$office.buildingId$'] = { $in: buildingIds };
      }
      results = await Booking.findAll({
        where: where,
        attributes: ['id', 'status', 'started', 'offices', 'desks', 'refNo'],
        include: [{ as: 'client', model: Client, attributes: ['name', 'company'] },
          { as: 'office', model: Office, attributes: ['buildingId'] },
          { as: 'contract', model: Contract, attributes: ['id', 'signedAgreementId', 'rent', 'security', 'status', 'kind', 'additionalDesks', 'additionalRent', 'desks'] }
        ],
        order: [
          ['started', 'asc']
        ]
      });
      workbenches.deskBookings.new = _.filter(results, { status: 'New' });
      workbenches.deskBookings.pendingSalesApproval = _.filter(results, function(b) { return b.refNo != null && b.contract && b.contract.status == 'Draft' });
      workbenches.deskBookings.pendingAccountsApproval = _.filter(results, function(b) { return b.refNo != null && b.contract && b.contract.status == 'Approved' });
      workbenches.deskBookings.pendingSignedAgreements = _.filter(results, function(b) { return b.refNo != null && b.contract && b.contract.status == 'Confirmed' && b.contract.signedAgreementId == null });
      workbenches.deskBookings.pendingActives = _.filter(results, function(b) { return b.refNo != null && ['New', 'Booked'].indexOf(b.status) > -1 && utils.moment(b.started).isBefore(utils.moment().startOf('day')) });
    }

    if (data.workbenches.indexOf('resourceBookings') > -1) {
      workbenches.resourceBookings = {};

      where = {
        companyId: data.companyId,
        status: { $in: ['Pending', 'Paid'] },
        'date': { $between: [utils.moment().startOf('date').toDate(), utils.moment().add(7, 'days').toDate()] }
      }
      if (buildingIds) {
        where['$`resource->office`.buildingId$'] = { $in: buildingIds };
      }
      results = await ResourceBooking.findAll({
        where: where,
        attributes: ['id', 'from', 'to', 'amount', 'refNo'],
        include: [{ as: 'resource', model: Resource, attributes: ['name', 'type'], include: [{ as: 'office', model: Office, attributes: ['name'] }] },
          { as: 'booking', model: Booking, attributes: ['refNo'], include: [{ as: 'client', model: Client, attributes: ['name', 'company'] }] }
        ],
        order: [
          ['date', 'asc']
        ]
      });
      workbenches.resourceBookings.paid = _.filter(results, { status: 'Paid' });
      workbenches.resourceBookings.pending = _.filter(results, { status: 'Pending' });
    }

    if (data.workbenches.indexOf('moveIns') > -1) {
      workbenches.moveIns = {};

      where = { status: { $in: ['New', 'Booked'] }, companyId: data.companyId };
      if (buildingIds) {
        where['$office.buildingId$'] = { $in: buildingIds };
      }
      results = await Booking.findAll({
        where: where,
        attributes: ['id', 'started', 'offices', 'refNo'],
        include: [{ as: 'client', model: Client, attributes: ['name', 'company'] },
          { as: 'office', model: Office, attributes: ['buildingId'] }
        ],
        order: [
          ['started', 'asc']
        ]
      });
      workbenches.moveIns.futureMoveIns = _.filter(results, function(b) { return b.refNo != null && utils.moment(b.started).isAfter(utils.moment().startOf('day')) && utils.moment(b.started).isBefore(utils.moment().add(7, 'days')) });
      workbenches.moveIns.missedMoveIns = _.filter(results, function(b) { return b.refNo != null && utils.moment(b.started).isBefore(utils.moment().startOf('day')) });
    }

    if (data.workbenches.indexOf('exits') > -1) {
      workbenches.exits = {};

      where = { status: { $in: ['Exiting'] }, companyId: data.companyId };
      if (buildingIds) {
        where['$office.buildingId$'] = { $in: buildingIds };
      }
      results = await Booking.findAll({
        where: where,
        attributes: ['id', 'ended', 'offices', 'refNo', 'status'],
        include: [{ as: 'client', model: Client, attributes: ['name', 'company'] },
          { as: 'office', model: Office, attributes: ['buildingId'] }
        ],
        order: [
          ['ended', 'asc']
        ]
      });
      workbenches.exits.upcomingExits = _.filter(results, function(b) { return b.refNo != null && utils.moment(b.ended).isAfter(utils.moment().startOf('day')) && utils.moment(b.ended).isBefore(utils.moment().add(7, 'days')) });
      workbenches.exits.missedExits = _.filter(results, function(b) { return b.refNo != null && utils.moment(b.ended).isBefore(utils.moment().startOf('day')) });


      where = { status: { $in: ['Exiting', 'Exited'] }, ended: { $not: null }, companyId: data.companyId };
      if (buildingIds) {
        where['$office.buildingId$'] = { $in: buildingIds };
      }
      results = await Booking.findAll({
        where: where,
        attributes: ['id', 'ended', 'offices', 'refNo'],
        include: [{ as: 'client', model: Client, attributes: ['name', 'company'] },
          { as: 'office', model: Office, attributes: ['buildingId'] },
          { as: 'exitRequest', model: ExitRequest, attributes: ['status', 'fcpStatus', 'refund', 'requestedDate', 'updated'] }
        ],
        order: [
          ['ended', 'asc']
        ]
      });

      workbenches.exits.pendingApprovals = _.filter(results, function(b) { return b.refNo != null && b.exitRequest && b.exitRequest.status == 'Requested' });
      workbenches.exits.pendingAcceptance = _.filter(results, function(b) { return b.refNo != null && b.exitRequest && (b.exitRequest.fcpStatus == 'Approved') });
      workbenches.exits.pendingRefunds = _.filter(results, function(b) { return b.refNo != null && b.exitRequest && b.exitRequest.refund > 0 && (b.exitRequest.fcpStatus == 'Accepted') });
    }

    if (data.workbenches.indexOf('payIns') > -1) {
      workbenches.payins = {};

      where = {
        '$booking.companyId$': data.companyId,
        cancelled: 0,
        'date': { $between: [utils.moment().startOf('month').toDate(), utils.moment().endOf('month').toDate()] }
      }
      if (buildingIds) {
        where['$`booking->office`.buildingId$'] = { $in: buildingIds };
      }
      results = await Payment.findAll({
        where: where,
        attributes: ['id', 'bookingId', 'amount', 'date'],
        include: [{
          as: 'booking',
          model: Booking,
          attributes: ['id', 'refNo', 'started', 'offices'],
          include: [{ as: 'client', model: Client, attributes: ['name', 'company'] },
            { as: 'office', model: Office, attributes: ['buildingId'] }
          ]
        }]
      });
      workbenches.payins.count = _.uniqBy(results, 'bookingId').length;
      workbenches.payins.amount = _.sumBy(results, 'amount');
      workbenches.payins.list = results;
    }

    if (data.workbenches.indexOf('renewals') > -1) {
      workbenches.renewals = {};
      workbenches.renewals.list = await bookingsService.getContractRenewalBookings(data);
    }

    if (data.workbenches.indexOf('visits') > -1) {
      workbenches.visits = {};

      where = { status: { $in: ['Scheduled'] }, '$office.companyId$': data.companyId };
      if (buildingIds) {
        where['$office.buildingId$'] = { $in: buildingIds };
      }
      results = await Visit.findAll({
        where: where,
        attributes: ['id', 'date'],
        include: [{ as: 'lead', model: Lead, attributes: ['name', 'companyName', 'phone'] },
          { as: 'office', model: Office, attributes: ['name'] }
        ],
        order: [
          ['date', 'asc']
        ]
      });
      workbenches.visits.todaysVisits = _.filter(results, function(b) { return b.status != 'Cancelled' && utils.moment(b.date).isSame(utils.moment()) });
      workbenches.visits.futureVisits = _.filter(results, function(b) { return b.status != 'Cancelled' && utils.moment(b.date).isAfter(utils.moment().startOf('day')) && utils.moment(b.date).isBefore(utils.moment().add(7, 'days')) });
      workbenches.visits.missedVisits = _.filter(results, function(b) { return b.status != 'Cancelled' && utils.moment(b.date).isBefore(utils.moment().startOf('day')) });
    }

    if (data.workbenches.indexOf('support') > -1) {
      workbenches.support = {};

      where = {
        '$booking.companyId$': data.companyId,
        status: { $notIn: ['Closed'] },
        setAside: 0
      }
      if (data.assignedTo) {
        where.assignedTo = data.assignedTo;
      }
      if (buildingIds) {
        where['$`booking->office`.buildingId$'] = { $in: buildingIds };
      }
      results = await Ticket.findAll({
        where: where,
        attributes: ['id', 'issue', 'description', 'setAside', 'assignedTo', 'refNo', 'status', 'date', 'category', 'context', 'attended', 'resolved', 'closed',
          'expectedAttended', 'expectedResolved', 'expectedClosed'
        ],
        include: ['priority', { as: 'assigned', model: User, attributes: ['name'] }, {
          as: 'booking',
          model: Booking,
          attributes: ['refNo', 'started', 'offices'],
          include: [{ as: 'client', model: Client, attributes: ['name', 'company'] },
            { as: 'office', model: Office, attributes: ['name'] }
          ]
        }],
        order: [
          ['date', 'asc']
        ]
      });
      workbenches.support.new = _.filter(results, { status: 'New' })
      workbenches.support.unassigned = _.filter(results, function(t) { return t.assignedTo == null })
      workbenches.support.unattended = _.filter(results, function(t) { return t.attended == null })
      workbenches.support.yetToResolve = _.filter(results, function(t) { return t.status != 'Resolved' && t.status != 'Closed' })
      workbenches.support.yetToClosed = _.filter(results, function(t) { return t.status == 'Resolved' })

      // workbenches.support.slaViolated = _.filter(results, function(t) {
      //   var violated = false;

      //   if (t.attended && utils.moment(t.expectedAttended).isBefore(utils.moment(t.attended))) {
      //     violated = true;
      //   }
      //   if (t.resolved && utils.moment(t.expectedResolved).isBefore(utils.moment(t.resolved))) {
      //     violated = true;
      //   }
      //   if (t.closed && utils.moment(t.expectedClosed).isBefore(utils.moment(t.closed))) {
      //     violated = true;
      //   }

      //   return violated;
      // })
      workbenches.support.slaAttendedViolated = _.filter(results, function(t) {
        var violated = false;
        if (t.status == 'New') {
          if (t.attended && utils.moment(t.expectedAttended).isBefore(utils.moment(t.attended))) {
            violated = true;
          }
        }
        return violated;
      })
      workbenches.support.slaResolvedViolated = _.filter(results, function(t) {
        var violated = false;
        if (t.status != 'Closed' && t.status != 'Resolved') {
          if (t.attended && utils.moment(t.expectedResolved).isBefore(utils.moment(t.resolved))) {
            violated = true;
          }
        }
        return violated;
      })
      workbenches.support.slaClosedViolated = _.filter(results, function(t) {
        var violated = false;
        if (t.status != 'Closed') {
          if (t.attended && utils.moment(t.expectedClosed).isBefore(utils.moment(t.closed))) {
            violated = true;
          }
        }
        return violated;
      })

      where = {
        'companyId': data.companyId,
        status: { $notIn: ['Closed'] },
        setAside: 0
      }
      if (data.assignedTo) {
        where.assignedTo = data.assignedTo;
      }
      results = await Ticket.findAll({
        where: where,
        attributes: ['id', 'status', 'date', 'setAside'],
        include: [{ as: 'priority', model: Priority, attributes: ['name'] }],
      });

      var priorities = await Priority.findAll({ where: { active: 1 }, attributes: ['name'] });
      priorities = _.map(priorities, 'name');

      workbenches.support.priorityWiseTickets = [];
      var priorityTotals = { name: 'Totals', total: 0, new: 0, attended: 0, awaitingClientReply: 0, awaitingInternalReply: 0, resolved: 0 };
      _.each(priorities, function(p) {
        var _priority = { name: p };
        _priority.new = _.filter(results, function(i) { return i.priority.name == p && i.status == 'New' }).length;
        _priority.attended = _.filter(results, function(i) { return i.priority.name == p && i.status == 'Attended' }).length;
        // _priority.awaitingClientReply = _.filter(results, function(i) { return i.priority.name == p && i.status == 'AwaitingClientReply' }).length;
        _priority.awaitingInternalReply = _.filter(results, function(i) { return i.priority.name == p && i.status == 'AwaitingInternalReply' }).length;
        _priority.resolved = _.filter(results, function(i) { return i.priority.name == p && i.status == 'Resolved' }).length;
        _priority.total = _priority.new + _priority.attended + _priority.awaitingInternalReply + _priority.resolved;

        priorityTotals.new = priorityTotals.new + _priority.new;
        priorityTotals.attended = priorityTotals.attended + _priority.attended;
        // priorityTotals.awaitingClientReply = priorityTotals.awaitingClientReply + _priority.awaitingClientReply;
        priorityTotals.awaitingInternalReply = priorityTotals.awaitingInternalReply + _priority.awaitingInternalReply;
        priorityTotals.resolved = priorityTotals.resolved + _priority.resolved;
        priorityTotals.total = priorityTotals.total + _priority.total;

        workbenches.support.priorityWiseTickets.push(_priority);
      })
      workbenches.support.priorityWiseTickets.push(priorityTotals);


      workbenches.support.todaysTickets = await Ticket.findAll({
        attributes: ['id'],
        where: {
          'companyId': data.companyId,
          setAside: 0,
          date: { $gt: utils.moment().startOf('date').toDate() }
        }
      })
      workbenches.support.todaysNewTickets = await Ticket.findAll({
        attributes: ['id'],
        where: {
          'companyId': data.companyId,
          setAside: 0,
          status: 'New',
          date: { $gt: utils.moment().startOf('date').toDate() }
        }
      })
      workbenches.support.olderNewTickets = await Ticket.findAll({
        attributes: ['id'],
        where: {
          'companyId': data.companyId,
          setAside: 0,
          status: 'New',
          date: { $lt: utils.moment().startOf('date').toDate() }
        }
      })
      workbenches.support.todaysResolvedTickets = await Ticket.findAll({
        attributes: ['id'],
        where: {
          'companyId': data.companyId,
          setAside: 0,
          status: 'Resolved',
          date: { $gt: utils.moment().startOf('date').toDate() },
          resolved: { $gt: utils.moment().startOf('date').toDate() }
        }
      })
      workbenches.support.olderResolvedTickets = await Ticket.findAll({
        attributes: ['id'],
        where: {
          'companyId': data.companyId,
          setAside: 0,
          status: 'Resolved',
          resolved: { $gt: utils.moment().startOf('date').toDate() },
          date: { $lt: utils.moment().startOf('date').toDate() }
        }
      })
      workbenches.support.todaysClosedTickets = await Ticket.findAll({
        attributes: ['id'],
        where: {
          'companyId': data.companyId,
          setAside: 0,
          status: 'Closed',
          date: { $gt: utils.moment().startOf('date').toDate() },
          closed: { $gt: utils.moment().startOf('date').toDate() }
        }
      })
      workbenches.support.olderClosedTickets = await Ticket.findAll({
        attributes: ['id'],
        where: {
          'companyId': data.companyId,
          setAside: 0,
          status: 'Closed',
          closed: { $gt: utils.moment().startOf('date').toDate() },
          date: { $lt: utils.moment().startOf('date').toDate() }
        }
      })
    }

    if (data.workbenches.indexOf('payOuts') > -1) {
      workbenches.payouts = {};

      results = await PayoutPayment.findAll({
        attributes: ['id', 'amount', 'status', 'type', 'approvedOn'],
        where: { 'status': 'Approved', companyId: data.companyId },
        include: [{
          as: 'exitRequest',
          model: ExitRequest,
          attributes: ['id'],
          required: false,
          include: [{
            as: 'booking',
            model: Booking,
            attributes: ['id', 'refNo', 'ended'],
            include: [{ as: 'client', model: Client, attributes: ['name', 'company'] }]
          }]
        }, {
          as: 'purchaseOrder',
          model: PurchaseOrder,
          where: { id: { $ne: null } },
          attributes: ['id', 'refNo'],
          required: false,
          include: [{ as: 'vendor', model: Vendor, attributes: ['name'] }, { as: 'project', model: Project, attributes: ['title'] }]
        }, {
          as: 'opexBill',
          model: OpexBill,
          attributes: ['id', 'amount', 'billDueDate'],
          required: false,
          include: [{ as: 'serviceProvider', model: Provider, attributes: ['name'] }]
        }],
        order: [
          ['approvedOn', 'asc']
        ]
      });

      workbenches.payouts.capexPayouts = _.filter(results, { type: 'VendorPayment' });
      workbenches.payouts.capexPayoutsVendorsCount = workbenches.payouts.capexPayouts.length;
      workbenches.payouts.capexPayoutsTotalAmount = _.sumBy(workbenches.payouts.capexPayouts, 'amount');

      workbenches.payouts.opexPayouts = _.filter(results, { type: 'BillPayment' });
      workbenches.payouts.opexPayoutsVendorsCount = workbenches.payouts.opexPayouts.length;
      workbenches.payouts.opexPayoutsTotalAmount = _.sumBy(workbenches.payouts.opexPayouts, 'amount');

      workbenches.payouts.refunds = _.filter(results, { type: 'ExitRefund' });
      workbenches.payouts.refundsTenantsCount = workbenches.payouts.refunds.length;
      workbenches.payouts.refundsTotalAmount = _.sumBy(workbenches.payouts.refunds, 'amount');
    }

    if (data.workbenches.indexOf('tenantsList') > -1) {
      where = {
        companyId: data.companyId,
        refNo: { $ne: null },
        status: { $in: ['Booked', 'Active', 'Exiting'] }
      }
      if (buildingIds) {
        where['$office.buildingId$'] = { $in: buildingIds };
      }
      var clients = await Booking.findAll({
        where: where,
        attributes: ['id', 'offices', 'status'],
        include: [{ as: 'office', model: Office, attributes: ['buildingId', 'name'], include: [{ as: 'building', model: Building, attributes: ['name'] }] },
          { as: 'client', model: Client, attributes: ['name', 'company', 'phone', 'email'] }
        ],
        group: ['`client`.id']
      })
      workbenches.clients = clients;
    }

    if (data.workbenches.indexOf('buildingContracts') > -1) {
      where = {
        'companyId': data.companyId,
        active: 1,
      }
      if (buildingIds) {
        where['id'] = { $in: buildingIds };
      }
      var buildingContracts = await Building.findAll({
        where: where,
        attributes: ['id'],
        include: [{ as: 'agreement', model: Doc, required: true },
          { as: 'terms', model: BuildingContractTerm, required: false, where: { status: 'Published' } }
        ]
      })
      workbenches.buildingContracts = buildingContracts;
    }

    if (data.workbenches.indexOf('buildingAmcs') > -1) {
      where = {
        '$building.companyId$': data.companyId,
        active: 1
      }
      if (buildingIds) {
        where['buildingId'] = { $in: buildingIds };
      }
      var buildingAmcs = await BuildingAmc.findAll({
        where: where,
        attributes: ['id', 'buildingId', 'responsibility', 'notes'],
        include: [{ as: 'amcItem', model: BuildingAmcItem, attributes: ['name'] },
          { as: 'building', model: Building, attributes: ['name'] }
        ]
      })
      workbenches.buildingAmcs = buildingAmcs;
    }

    if (data.workbenches.indexOf('ownerContacts') > -1) {
      where = {
        '$building.companyId$': data.companyId,
        active: 1
      }
      if (buildingIds) {
        where['buildingId'] = { $in: buildingIds };
      }
      var ownerContacts = await BuildingContact.findAll({
        where: where,
        attributes: ['id', 'buildingId', 'name', 'phone', 'email', 'purposes'],
        include: [{ as: 'building', model: Building, attributes: ['name'] }]
      })
      workbenches.ownerContacts = ownerContacts;
    }

    if (data.workbenches.indexOf('vendorsList') > -1) {
      where = {
        companyId: data.companyId,
        '$vendor.status$': { $in: ['Registered'] }
      }
      if (buildingIds) {
        where['buildingId'] = { $in: buildingIds };
      }
      var pos = await PurchaseOrder.findAll({
        where: where,
        attributes: ['id', 'buildingId'],
        include: [{ as: 'building', model: Building, attributes: ['name'] },
          {
            as: 'vendor',
            model: Vendor,
            attributes: ['id', 'name'],
            include: [{ as: 'contact', model: VendorContact, required: false, attributes: ['name', 'phone', 'email'], where: { isMainContact: 1 } }]
          }, {
            as: 'items',
            model: PurchaseItem,
            attributes: ['id'],
            include: [{
              as: 'sku',
              model: Sku,
              attributes: ['id'],
              include: [{ as: 'type', model: SkuType, attributes: ['name'] }]
            }]
          }
        ]
      })
      var vendors = [];
      _.each(pos, function(p) {
        var vendor = _.find(vendors, { id: p.vendor.id, buildingId: p.buildingId });
        var skuTypes = [];
        _.each(p.items, function(i) {
          if (i.sku) {
            skuTypes.push(i.sku.type);
          }
        })
        skuTypes = _.map(_.uniqBy(skuTypes, "name"), "name");
        if (!vendor) {
          vendor = {
            id: p.vendor.id,
            buildingId: p.buildingId,
            building: p.building ? p.building.name : null,
            name: p.vendor.name,
            contactName: p.vendor && p.vendor.contact ? p.vendor.contact.name : null,
            contactPhone: p.vendor && p.vendor.contact ? p.vendor.contact.phone : null,
            contactEmail: p.vendor && p.vendor.contact ? p.vendor.contact.email : null,
            skuTypes: []
          }
          vendor.skuTypes = vendor.skuTypes.concat(skuTypes);
          // log.write("ReportsService ::: skuTypes added :: vendorId " + p.vendor.id + " : " + vendor.skuTypes.length);
          vendors.push(vendor);
        } else {
          vendor.skuTypes = vendor.skuTypes.concat(skuTypes);
          vendor.skuTypes = _.uniqBy(vendor.skuTypes);
          // log.write("ReportsService ::: skuTypes inserted :: vendorId " + p.vendor.id + " : " + vendor.skuTypes.length);
        }
      })
      workbenches.vendors = vendors;
    }

    if (data.workbenches.indexOf('serviceProvidersList') > -1) {
      where = {
        companyId: data.companyId
      }
      if (buildingIds) {
        where['buildingId'] = { $in: buildingIds };
      }
      var bills = await OpexBill.findAll({
        where: where,
        attributes: ['id', 'buildingId'],
        include: [{ as: 'building', model: Building, attributes: ['name'] },
          {
            as: 'serviceProvider',
            model: Provider,
            attributes: ['id', 'name'],
            include: [{ as: 'providerContact', model: ProviderContact, required: false, attributes: ['name', 'phone', 'email'], where: { active: 1 } }]
          }, {
            as: 'opexType',
            model: OpexType,
            attributes: ['name'],
            include: [
              { as: 'category', model: OpexCategory, attributes: ['name'] },
              { as: 'type', model: OpexType, attributes: ['name'], include: [{ as: 'category', model: OpexCategory, attributes: ['name'] }] }
            ]
          }
        ],
        group: ['`opex_bills`.`serviceProviderId`']
      })
      var providers = [];
      _.each(bills, function(p) {
        if (p.serviceProvider) {
          var provider = _.find(providers, { id: p.serviceProvider.id, buildingId: p.buildingId });
          if (!provider) {
            if (p.serviceProvider && p.serviceProvider.providerContact) {
              provider = {
                id: p.serviceProvider.id,
                buildingId: p.buildingId,
                building: p.building ? p.building.name : null,
                name: p.serviceProvider.name,
                contactName: p.serviceProvider.providerContact.name,
                contactPhone: p.serviceProvider.providerContact.phone,
                contactEmail: p.serviceProvider.providerContact.email,
                category: null
              }
            } else if (p.serviceProvider) {
              provider = {
                id: p.serviceProvider.id,
                buildingId: p.buildingId,
                building: p.building ? p.building.name : null,
                name: p.serviceProvider.name,
                category: null
              }
            }
            if (provider && p.opexType.category) {
              provider.category = p.opexType.category.name;
            } else if (provider) {
              provider.category = p.opexType.type.category.name;
            }
            providers.push(provider);
          }
        }
      })
      workbenches.providers = providers;
    }

    if (data.workbenches.indexOf('purchaseCapex') > -1) {
      workbenches.workOrders = {};
      workbenches.purchaseOrders = {};

      where = { status: { $notIn: ['Cancelled', 'PORaised', 'Declined'] }, companyId: data.companyId };
      if (buildingIds) {
        where['buildingId'] = { $in: buildingIds };
      }
      var workOrders = await WorkOrder.findAll({
        attributes: ['id', 'refNo', 'budget', 'proposedOn', 'status'],
        where: where,
        include: [{ as: 'vendor', model: Vendor, attributes: ['name'] },
          { as: 'project', model: Project, attributes: ['title'] }
        ]
      })
      workbenches.workOrders.draft = _.filter(workOrders, { status: 'Draft' });
      workbenches.workOrders.pendingApproval = _.filter(workOrders, { status: 'Proposed' });
      workbenches.workOrders.pendingVendorConfirmation = _.filter(workOrders, { status: 'Approved' });

      where = { status: { $notIn: ['Cancelled', 'Closed', 'Declined', 'Archived'] }, companyId: data.companyId };
      if (buildingIds) {
        where['buildingId'] = { $in: buildingIds };
      }
      var purchaseOrders = await PurchaseOrder.findAll({
        attributes: ['id', 'refNo', 'amount', 'date', 'status'],
        where: where,
        include: [{ as: 'vendor', model: Vendor, attributes: ['name'] },
          { as: 'project', model: Project, attributes: ['title'] }
        ]
      })
      workbenches.purchaseOrders.pendingStarted = _.filter(purchaseOrders, { status: 'Raised' });
      workbenches.purchaseOrders.pendingProformaInvoice = _.filter(purchaseOrders, { proformaInvoiceId: { $eq: null } });

      where = { status: { $notIn: ['Paid', 'Declined', ] }, '$purchaseOrder.companyId$': data.companyId };
      if (buildingIds) {
        where['$purchaseOrder.buildingId$'] = { $in: buildingIds };
      }
      var milestones = await PurchaseOrderMilestone.findAll({
        attributes: ['id', 'name', 'amount', 'paymentMode', 'status', 'expectedDate', 'actualDate'],
        where: where,
        include: [{
          as: 'purchaseOrder',
          attributes: ['id', 'refNo', 'proformaInvoiceId', 'taxInvoiceId'],
          model: PurchaseOrder,
          where: { companyId: data.companyId },
          include: [{ as: 'vendor', model: Vendor, attributes: ['name'] },
            { as: 'project', model: Project, attributes: ['title'] }
          ]
        }]
      })
      workbenches.purchaseOrders.pendingMilestonesRelease = _.filter(milestones, function(m) { return m.status == 'Draft' && m.amount > 0 });
      workbenches.purchaseOrders.pendingMilestonesApprovals = _.filter(milestones, function(m) { return m.status == 'Released' && m.amount > 0 });
      workbenches.purchaseOrders.pendingMilestonesPayments = _.filter(milestones, function(m) { return m.status == 'Approved' && m.amount > 0 });

      workbenches.purchaseOrders.pendingPayouts = _.sumBy(milestones, 'amount');
    }

    if (data.workbenches.indexOf('bills') > -1) {
      workbenches.bills = {};

      where = { status: { $notIn: ['Mapped'] }, 'companyId': data.companyId };
      if (buildingIds) {
        where['buildingId'] = { $in: buildingIds };
      }
      results = await BillsQueue.findAll({
        where: where,
        attributes: ['id', 'amount', 'billType', 'paymentType', 'billDate'],
        order: [
          ['billDate', 'desc']
        ]
      });
      workbenches.bills.unmapped = results;
    }

    return workbenches;
  } catch (e) {
    log.write("ReportsService ::: getWorkBenches :: e : ", e);
    throw (e);
  }
}

service.loadBuildingBookings = async (data) => {
  try {
    console.log("loadBuildingBookings :: loadBuildingBookings ::",data)
    var statuses = [],
      excludes = [], deskType = [], kind = [], term = [];
    _.each(data.statuses, function(s) {
      statuses.push("'" + s + "'");
    })
    _.each(data.excludes, function(s) {
      excludes.push("'" + s + "'");
    })
    _.each(data.deskType, function(s) {
      deskType.push("'" + s + "'");
    })
    if (data.contractKind && data.contractKind.length) {
      _.each(data.contractKind, function(s) {
        kind.push("'" + s + "'");
      })
    }
    if (data.contractTerm && data.contractTerm.length) {
      _.each(data.contractTerm, function(s) {
        term.push("'" + s + "'");
      })
    }

    var sql = `select count(b.id) count,g.id, g.name from bookings b, offices o, buildings g, contracts ct
      where b.companyId=` + data.companyId + ` and b.officeId=o.id and o.buildingId=g.id and b.refNo is not null
      and b.refNo is not null and ct.id=b.contractId `;
      
      //and ct.deskType in ('FixedDesk', 'FlexiDesk', 'PrivateOffice', 'EnterpriseOffice')`;
    if (kind.length) {
      sql = sql + `and ct.kind in (` + kind.join(',') + `)`;
    }
    if (term.length) {
      sql = sql + `and ct.term in (` + term.join(',') + `)`;
    }
    if (deskType.length) {
      sql = sql + `and ct.deskType in (` + deskType.join(',') + `)`;
    }
    if (statuses.length) {
      sql = sql + `and b.status in (` + statuses.join(',') + `)`;
    }
    if (excludes.length) {
      sql = sql + `and b.status not in (` + excludes.join(',') + `)`;
    }
    sql = sql + ` group by g.id order by g.name`;
    // log.write("ReportService ::: loadBuildingBookings :: sql : ", sql)
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (e) {
    log.write("ReportService ::: loadBuildingBookings :: exception : ", e)
  }
}

service.loadBuildingTickets = async (data) => {
  try {
    var statuses = [],
      excludes = [];
    _.each(data.statuses, function(s) {
      statuses.push("'" + s + "'");
    })
    _.each(data.excludes, function(s) {
      excludes.push("'" + s + "'");
    })
    var setAside = 0;
    if (data.setAside) {
      setAside = 1;
    }
    var sql = `select count(t.id) count,g.id, g.name from tickets t, bookings b, offices o, buildings g
      where b.companyId=` + data.companyId + ` and t.setAside=` + setAside + ` and b.officeId=o.id and o.buildingId=g.id and t.bookingId=b.id `;
    if (statuses.length) {
      sql = sql + ` and t.status in (` + statuses.join(',') + `)`;
    }
    if (excludes.length) {
      sql = sql + ` and t.status not in (` + excludes.join(',') + `)`;
    }
    sql = sql + ` group by g.id order by g.name`;
    // log.write("ReportService ::: loadBuildingTickets :: sql : ", sql)
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (e) {
    log.write("ReportService ::: loadBuildingTickets :: exception : ", e)
  }
}
service.getTicketsByStatus = async (data) => {
  try {
    var statuses = [],
      excludes = [];
    _.each(data.statuses, function(s) {
      statuses.push("'" + s + "'");
    })
    _.each(data.excludes, function(s) {
      excludes.push("'" + s + "'");
    })
    var setAside = 0;
    if (data.setAside) {
      setAside = 1;
    }
    var sql = `select count(t.id) count,t.status from tickets t, bookings b, offices o
      where b.companyId=` + data.companyId + ` and b.officeId=o.id and t.bookingId=b.id  and t.setAside=` + setAside;
    if (data.buildingIds && data.buildingIds.length) {
      sql = `select count(t.id) count,t.status from tickets t, bookings b, offices o
      where b.companyId=` + data.companyId + ` and b.officeId=o.id and t.bookingId=b.id and t.setAside=` + setAside;
    }
    if (data.buildingWise) {
      sql = `select count(t.id) count,t.status,g.name from tickets t, bookings b, offices o, buildings g
      where b.companyId=` + data.companyId + ` and b.officeId=o.id and t.bookingId=b.id and g.id=o.buildingId  and t.setAside=` + setAside;
    }
    if (statuses.length) {
      sql = sql + ` and t.status in (` + statuses.join(',') + `)`;
    }
    if (data.buildingIds && data.buildingIds.length) {
      sql = sql + ` and o.buildingId in (` + data.buildingIds.join(',') + `) `;
    }
    if (excludes.length) {
      sql = sql + ` and t.status not in (` + excludes.join(',') + `)`;
    }
    if (data.buildingWise) {
      sql = sql + ` and g.active=1 group by g.id, t.status`;
    } else {
      sql = sql + ` group by t.status`;
    }
    log.write("ReportService ::: getTicketsByStatus :: sql : ", sql)
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (e) {
    log.write("ReportService ::: getTicketsByStatus :: exception : ", e)
  }
}

service.loadBuildingProjects = async (data) => {
  try {
    var statuses = [],
      excludes = [];
    _.each(data.statuses, function(s) {
      statuses.push("'" + s + "'");
    })
    _.each(data.excludes, function(s) {
      excludes.push("'" + s + "'");
    })
    var sql = `select count(t.id) count,g.id, g.name from vendor_projects t, buildings g
      where t.companyId=` + data.companyId + ` and t.buildingId=g.id `;
    if (statuses.length) {
      sql = sql + ` and t.status in (` + statuses.join(',') + `)`;
    }
    sql = sql + ` group by g.id order by g.name`;
    // log.write("ReportService ::: loadBuildingProjects :: sql : ", sql)
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (e) {
    log.write("ReportService ::: loadBuildingProjects :: exception : ", e)
  }
}
service.getProjectsByStatus = async (data) => {
  try {
    var sql = `select count(t.id) count,t.status from vendor_projects t
      where t.companyId=` + data.companyId;
    sql = sql + ` group by t.status`;
    log.write("ReportService ::: getProjectsByStatus :: sql : ", sql)
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (e) {
    log.write("ReportService ::: getProjectsByStatus :: exception : ", e)
  }
}

service.loadBuildingPurchaseOrders = async (data) => {
  try {
    // log.write("ReportService ::: loadBuildingPurchaseOrders :: data : ", data);
    var statuses = [],
      excludes = [];
    _.each(data.statuses, function(s) {
      statuses.push("'" + s + "'");
    })
    _.each(data.excludes, function(s) {
      excludes.push("'" + s + "'");
    })
    var billsSql = "";
    if (data.isOpex != null) {
      billsSql = " and t.isOpex=" + data.isOpex;
    } else {
      billsSql = " and t.isOpex=0";
    }
    if (data.dateFrom && data.dateTo) {
      billsSql = billsSql + " and t.date between '" + data.dateFrom + "' and '" + data.dateTo + "' ";
    }
    if (data.awaitingAdvancePayment) {
      billsSql = billsSql + " and (t.hasAdvancePayment =1 and t.paidAmount=0)";
    }
    if (data.isBill != null) {
      billsSql = billsSql + " and t.isBill=" + data.isBill;
    } else {
      billsSql = billsSql + " and t.isBill=0";
    }
    var sql = `select count(t.id) count,g.id, g.name from vendor_purchase_orders t, buildings g
      where t.companyId=` + data.companyId + ` and t.buildingId=g.id ` + billsSql
    if (statuses.length) {
      sql = sql + ` and t.status in (` + statuses.join(',') + `)`;
    }
    sql = sql + ` group by g.id order by g.name`;
    log.write("ReportService ::: loadBuildingPurchaseOrders :: sql : ", sql)
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (e) {
    log.write("ReportService ::: loadBuildingPurchaseOrders :: exception : ", e)
  }
}
service.getPurchaseOrdersByStatus = async (data) => {
  try {
    var statuses = [],
      excludes = [];
    _.each(data.statuses, function(s) {
      statuses.push("'" + s + "'");
    })
    var billsSql = "";
    if (data.isOpex != null) {
      billsSql = " and t.isOpex=" + data.isOpex;
    } else {
      billsSql = " and t.isOpex=0";
    }
    if (data.isBill != null) {
      billsSql = billsSql + " and t.isBill=" + data.isBill;
    } else {
      billsSql = billsSql + " and t.isBill=0";
    }
    if (statuses.length) {
      billsSql = billsSql + ` and t.status in (` + statuses.join(',') + `)`;
    }
    if (data.projectId) {
      billsSql = billsSql + ` and t.projectId=` + data.projectId;
    }
    if (data.awaitingAdvancePayment) {
      billsSql = billsSql + " and (t.hasAdvancePayment =1 and t.paidAmount=0)";
    }
    if (data.buildingId) {
      billsSql = billsSql + ` and t.buildingId=` + data.buildingId;
    } else if (data.buildingIds && data.buildingIds.length) {
      billsSql = billsSql + ` and t.buildingId in (` + data.buildingIds.join(",") + `)`;
    } else
    if (!data.isHq) {
      billsSql = billsSql + ` and t.buildingId>0`;
    } else {
      billsSql = billsSql + ` and t.buildingId = -1`;
    }
    if (data.dateFrom && data.dateTo) {
      billsSql = billsSql + " and t.date between '" + data.dateFrom + "' and '" + data.dateTo + "' ";
    }
    var sql = `select count(t.id) count,t.status from vendor_purchase_orders t
      where t.companyId=` + data.companyId + ` ` + billsSql;
    sql = sql + ` group by t.status`;
    log.write("ReportService ::: getPurchaseOrdersByStatus :: sql : ", sql)
    var statusesRows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });

    var oneMonthbackDate = utils.moment().add(-30, 'days').format("YYYY-MM-DD");
    var redPoSql = `select count(t.id) count from vendor_purchase_orders t
      where t.companyId=` + data.companyId + ` and (t.paidAmount=0 or t.paidAmount is null) and t.date<='` + oneMonthbackDate + `' ` + billsSql;

    log.write("ReportService ::: getPurchaseOrdersByStatus :: redPoSql : ", redPoSql);
    var redPos = await session.db.query(redPoSql, { type: Sequelize.QueryTypes.SELECT });

    var halfMonthbackDate = utils.moment().add(-15, 'days').format("YYYY-MM-DD");
    var yellowPoSql = `select count(t.id) count from vendor_purchase_orders t
      where t.companyId=` + data.companyId + ` and (t.paidAmount=0 or t.paidAmount is null)
       and t.date>'` + oneMonthbackDate + `'  and t.date<='` + halfMonthbackDate + `' ` + billsSql;
    log.write("ReportService ::: getPurchaseOrdersByStatus :: yellowPoSql : ", yellowPoSql);
    var yellowPos = await session.db.query(yellowPoSql, { type: Sequelize.QueryTypes.SELECT });

    return {
      statuses: statusesRows,
      redPos: redPos,
      yellowPos: yellowPos,
    };
  } catch (e) {
    log.write("ReportService ::: getPurchaseOrdersByStatus :: exception : ", e)
  }
}

service.loadBuildingWorkOrders = async (data) => {
  try {
    var statuses = [],
      excludes = [];
    _.each(data.statuses, function(s) {
      statuses.push("'" + s + "'");
    })
    _.each(data.excludes, function(s) {
      excludes.push("'" + s + "'");
    })
    var sql = `select count(t.id) count,g.id, g.name from vendor_work_orders t, buildings g
      where t.companyId=` + data.companyId + ` and t.buildingId=g.id `;
    if (statuses.length) {
      sql = sql + ` and t.status in (` + statuses.join(',') + `)`;
    }
    if (data.isOpex) {
      sql = sql + ` and t.isOpex=1`;
    } else {
      sql = sql + ` and t.isOpex=0`;
    }
    sql = sql + ` group by g.id order by g.name`;
    // log.write("ReportService ::: loadBuildingWorkOrders :: sql : ", sql)
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (e) {
    log.write("ReportService ::: loadBuildingWorkOrders :: exception : ", e)
  }
}
service.getWorkOrdersByStatus = async (data) => {
  try {
    var statuses = [],
      excludes = [];
    _.each(data.statuses, function(s) {
      statuses.push("'" + s + "'");
    })
    var sql = `select count(t.id) count,t.status from vendor_work_orders t
      where t.status is not null and t.companyId=` + data.companyId;
    if (data.projectId) {
      sql = sql + ` and t.projectId=` + data.projectId;
    }
    if (data.buildingId) {
      sql = sql + ` and t.buildingId=` + data.buildingId;
    } else if (data.buildingIds && data.buildingIds.length) {
      sql = sql + ` and t.buildingId in (` + data.buildingIds.join(",") + `)`;
    }
    if (data.isOpex) {
      sql = sql + ` and t.isOpex=1`;
    } else {
      sql = sql + ` and t.isOpex=0`;
    }
    if (statuses.length) {
      sql = sql + ` and t.status in (` + statuses.join(',') + `)`;
    }
    sql = sql + ` group by t.status`;
    log.write("ReportService ::: getWorkOrdersByStatus :: sql : ", sql)
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (e) {
    log.write("ReportService ::: getWorkOrdersByStatus :: exception : ", e)
  }
}

service.loadBuildingBills = async (data) => {
  try {
    var statuses = [],
      excludes = [];
    _.each(data.statuses, function(s) {
      statuses.push("'" + s + "'");
    })
    _.each(data.excludes, function(s) {
      excludes.push("'" + s + "'");
    })
    var searchTables = ""
    if (data.search) {
      searchTables = ` left join vendors v on v.id=t.vendorId
      left join opex_types ot on ot.id=i.opexTypeId
      left join opex_categories oc on oc.id=ot.catId `;
    }
    var sql = `select count(t.id) count,g.id, g.name from vendor_purchase_orders t 
      left join buildings g on g.id=t.buildingId
      left join vendor_purchase_items i on i.purchaseOrderId = t.id ` + searchTables + `
      where t.companyId=` + data.companyId + ` and t.isBill=1 and t.isOpex=1 `;
    if (statuses.length) {
      sql = sql + ` and t.status in (` + statuses.join(',') + `)`;
    }
    if (data.isHq) {
      sql = sql + ` and t.buildingId=-1`;
    } else {
      sql = sql + ` and (t.buildingId>0 or t.buildingId is null)`;
    }
    if (data.dateFrom && data.dateTo) {
      sql = sql + " and t.date between '" + data.dateFrom + "' and '" + data.dateTo + "' ";
    }
    if (data.accountedFrom && data.accountedTo) {
      sql = sql + " and i.dateFrom between '" + data.accountedFrom + "' and '" + data.accountedTo + "' ";
    }
    if (data.search && data.search != "") {
      var amount = "";
      if (parseInt(data.search) > 0) {
        amount = ` or t.amount=` + data.search
      }
      var search = data.search.toLowerCase();
      sql = sql + ` and (1=0  ` + amount + ` or lower(g.name) like '%` + search + `%'  or lower(v.name) like '%` + search + `%' 
       or lower(oc.name) like '%` + search + `%'  or lower(ot.name) like '%` + search + `%' or lower(t.refNo) like '%` + search + `%' )`
    }
    // if (data.noImages) {
    //   sql = sql + " and t.imageId is null ";
    // }
    // if (data.noPostingData) {
    //   sql = sql + " and (t.serviceProviderId is null or t.buildingId is null or t.opexTypeId is null) ";
    // }
    sql = sql + ` group by g.id order by g.name`;
    log.write("ReportService ::: loadBuildingBills :: sql : ", sql)
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (e) {
    log.write("ReportService ::: loadBuildingBills :: exception : ", e)
  }
}
service.getBillsByStatus = async (data) => {
  try {
    var statuses = [],
      excludes = [];
    _.each(data.statuses, function(s) {
      statuses.push("'" + s + "'");
    })
    // var sql = `select count(t.id) count,t.status from opex_bills t
    var searchTables = ""
    if (data.search) {
      searchTables = ` left join vendors v on v.id=t.vendorId
      left join buildings b on b.id = t.buildingId
      left join opex_types ot on ot.id=i.opexTypeId
      left join opex_categories oc on oc.id=ot.catId `;
    }
    var sql = `select count(t.id) count,t.status from vendor_purchase_orders t
      left join vendor_purchase_items i on i.purchaseOrderId=t.id ` + searchTables + `      
      where t.isBill=1 and t.isOpex=1 and t.companyId=` + data.companyId;
    if (data.buildingId) {
      sql = sql + ` and t.buildingId=` + data.buildingId;
    } else if (data.isHq) {
      sql = sql + ` and t.buildingId=-1`;
    } else {
      sql = sql + ` and (t.buildingId>0 or t.buildingId is null)`;
    }
    if (data.search && data.search != "") {
      var amount = "";
      if (parseInt(data.search) > 0) {
        amount = ` or t.amount=` + data.search
      }
      var search = data.search.toLowerCase();
      sql = sql + ` and (1=0  ` + amount + ` or lower(b.name) like '%` + search + `%'  or lower(v.name) like '%` + search + `%' 
       or lower(oc.name) like '%` + search + `%'  or lower(ot.name) like '%` + search + `%'  or lower(t.refNo) like '%` + search + `%' )`
    }
    if (data.dateFrom && data.dateTo) {
      sql = sql + " and t.date between '" + data.dateFrom + "' and '" + data.dateTo + "' ";
    }
    if (data.accountedFrom && data.accountedTo) {
      sql = sql + " and i.dateFrom between '" + data.accountedFrom + "' and '" + data.accountedTo + "' ";
    }
    if (statuses.length) {
      sql = sql + ` and t.status in (` + statuses.join(',') + `)`;
    }
    // if (data.noImages) {
    //   sql = sql + " and t.imageId is null ";
    // }
    // if (data.noPostingData) {
    //   sql = sql + " and (t.serviceProviderId is null or t.buildingId is null or t.opexTypeId is null) ";
    // }
    sql = sql + ` group by t.status`;
    log.write("ReportService ::: getBillsByStatus :: sql : ", sql)
    var statusesRows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });

    var redBills, yellowBills;
    if (data.noImages) {
      var noImgSql = `select count(t.id) count from vendor_purchase_orders t
      where t.companyId=` + data.companyId + ` and t.imageId is null  `;
      if (statuses.length) {
        noImgSql = noImgSql + ` and t.status in (` + statuses.join(',') + `)`;
      }
      if (data.buildingId) {
        noImgSql = noImgSql + ` and t.buildingId=` + data.buildingId;
      }
      if (data.buildingIds && data.buildingIds.length) {
        noImgSql = noImgSql + ` and t.buildingId in (` + data.buildingIds.join(",") + `)`;
      }
    }
    if (data.noPostingData) {
      log.write("ReportService ::: getPurchaseOrdersByStatus :: noImgSql : ", noImgSql);
      redBills = await session.db.query(noImgSql, { type: Sequelize.QueryTypes.SELECT });

      var noDataSql = `select count(t.id) count from vendor_purchase_orders t
      where t.companyId=` + data.companyId + ` and (t.serviceProviderId is null or t.opexTypeId is null or t.buildingId is null )`;
      if (statuses.length) {
        noDataSql = noDataSql + ` and t.status in (` + statuses.join(',') + `)`;
      }
      if (data.buildingIds) {
        noDataSql = noDataSql + ` and t.buildingId in (` + data.buildingIds.join(",") + `)`;
      }
      if (data.buildingId) {
        noDataSql = noDataSql + ` and t.buildingId=` + data.buildingId;
      }

      log.write("ReportService ::: getPurchaseOrdersByStatus :: noDataSql : ", noDataSql);
      yellowBills = await session.db.query(noDataSql, { type: Sequelize.QueryTypes.SELECT });
    }

    return {
      statuses: statusesRows,
      redBills: redBills,
      yellowBills: yellowBills,
    };
  } catch (e) {
    log.write("ReportService ::: getBillsByStatus :: exception : ", e)
  }
}
service.loadBuildingBillsQueue = async (data) => {
  try {
    var statuses = [],
      excludes = [];
    _.each(data.statuses, function(s) {
      statuses.push("'" + s + "'");
    })
    _.each(data.excludes, function(s) {
      excludes.push("'" + s + "'");
    })
    var sql = `select count(t.id) count,g.id, g.name from bills_queue t, buildings g
      where t.companyId=` + data.companyId + ` and t.buildingId=g.id `;
    if (statuses.length) {
      sql = sql + ` and t.status in (` + statuses.join(',') + `)`;
    }
    sql = sql + ` group by g.id order by g.name`;
    // log.write("ReportService ::: loadBuildingBillsQueue :: sql : ", sql)
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (e) {
    log.write("ReportService ::: loadBuildingBillsQueue :: exception : ", e)
  }
}
service.getBillsQueueByStatus = async (data) => {
  try {
    var statuses = [],
      excludes = [];
    _.each(data.statuses, function(s) {
      statuses.push("'" + s + "'");
    })
    var sql = `select count(t.id) count,t.status from bills_queue t
      where t.companyId=` + data.companyId;
    if (data.buildingId) {
      sql = sql + ` and t.buildingId=` + data.buildingId;
    }
    if (statuses.length) {
      sql = sql + ` and t.status in (` + statuses.join(',') + `)`;
    }
    sql = sql + ` group by t.status`;
    log.write("ReportService ::: getBillsQueueByStatus :: sql : ", sql)
    var statusesRows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });

    return {
      statuses: statusesRows,
    };
  } catch (e) {
    log.write("ReportService ::: getBillsQueueByStatus :: exception : ", e)
  }
}

service.getVendorStats = async (data) => {
  try {
    log.write("ReportService ::: getVendorStats :: data : ", data)
    var results = {}
    var sql = `select count(t.id) count,t.status from vendors t
      where t.companyId=` + data.companyId + ` group by t.status`;
    // log.write("ReportService ::: getVendorStats :: sql : ", sql)
    var statusesRows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    // log.write("ReportService ::: getVendorStats :: statusesRows : ", statusesRows);
    statusesRows.push({ status: 'Total', count: _.sumBy(statusesRows, 'count') });
    results.statuses = statusesRows;

    sql = `select count(t.id) count,t.vendorType type from vendors t
      where t.companyId=` + data.companyId + ` group by t.vendorType`;
    var orgTypes = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportService ::: getVendorStats :: orgTypes : ", orgTypes);

    results.orgTypes = orgTypes;

    return results;
  } catch (e) {
    log.write("ReportService ::: getVendorStats :: exception : ", e)
  }
}

service.getPurchaseBuilingWisePayables = async (data) => {
  try {
    var statuses = [];
    var sql = `SELECT vp.title, vp.status projectStatus, vp.date proposedDate, p.projectId, p.buildingId, 
                  b.name building, v.id vendorId, v.name vendor, p.id, p.refNo, p.status, p.isBill,
                  p.date, amount, p.draftAmount, p.releasedAmount, p.approvedAmount, p.paidAmount, (p.amount - p.paidAmount) yetToPay,
                  DATE_FORMAT(p.date,'%b %y') month, DATE_FORMAT(p.date,'%y%m') mon
                FROM vendor_purchase_orders p
                left join vendor_projects vp on vp.id=p.projectId 
                left join buildings b on b.id=p.buildingId
                left join vendors v on v.id = p.vendorId
                where p.status not in ('Deleted','Declined') and p.isOpex=0 and p.buildingId>0 
                and p.date is not null and p.companyId = ` + data.companyId + `
                order by b.name`;
    // where (p.status in ('Raised', 'Started','Closed') or p.isBill=1) and p.isOpex=0 and p.date is not null and p.companyId = ` + data.companyId + `

    log.write("ReportService ::: getPurchaseBuilingWisePayables :: sql : ", sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (e) {
    log.write("ReportService ::: getPurchaseBuilingWisePayables :: exception : ", e)
  }
}
service.getPurchaseDueMilestones = async (data) => {
  try {
    var statuses = [];
    var sql = `SELECT vp.title project, v.name vendor,v.id vendorId, p.id poId,p.refNo, p.status poStatus, m.status, m.amount, m.releasedOn,
               m.approvedOn, ifnull(m.actualDate, m.expectedDate) dueDate
              FROM vendor_purchase_order_milestones m
              left join vendor_purchase_orders p on p.id=m.purchaseOrderId
              left join vendors v on v.id = p.vendorId
              left join vendor_projects vp on vp.id = p.projectId
              where p.status in ('Raised', 'Started','Closed') and m.status in ('Draft','Approved','Released','Issued') and p.isOpex=0
              and p.projectId is not null and ifnull(m.actualDate, m.expectedDate) is not null and  p.companyId = ` + data.companyId;

    log.write("ReportService ::: getTicketsByStatus :: sql : ", sql)
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    return results;
  } catch (e) {
    log.write("ReportService ::: getTicketsByStatus :: exception : ", e)
  }
}



exports.service = service;