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

service.getBuildingMetrics = async (data) => {
  try {
    return await Building.findAll({
      where: { companyId: data.companyId },
      attributes: ['name', 'carpetArea', 'sba', 'expectedLive', 'lastDate'],
      order: [
        ['expectedLive', 'asc']
      ]
    });
  } catch (e) {
    log.write("ReportsService ::: getCapexDashboard :: exception : ", e);
    throw (e);
  }
}

service.getCapexDashboard = async (data) => {
  try {
    var groupBy = "i.id,g.id";
    var where = "";
    if (data.filters.isHq) {
      where = where + " and po.buildingId=-1";
    }
    if (data.filters.startDate && data.filters.endDate) {
      where = where + " and po.date between '" + data.filters.startDate + "' and '" + data.filters.endDate + "'";
    }
    var sql = `select  g.title project, sc.name category, st.name type,s.name sku, sum(i.amount) amount
              from vendor_purchase_items i
              left join skus s on s.id = i.skuId
              left join sku_categories sc on sc.id = s.catId
              left join sku_types st on st.id = s.typeId
              left join vendor_purchase_orders po on po.id=i.purchaseOrderId
              left join vendor_projects g on po.projectId = g.id
              where po.companyId=` + data.companyId + where + ` and g.id is not null and  po.status not in ('Declined', 'Deleted') 
              and po.isOpex=0  and i.skuId is not null and i.status not in ('Archived')
              group by s.typeId, month(po.date), year(po.date), g.id
              order by year(po.date), month(po.date), g.id`;

    log.write("ReportsService ::: getCapexDashboard :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getCapexDashboard :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: getCapexDashboard :: exception : ", e);
    throw (e);
  }
}
service.getExpensesDashboard = async (data) => {
  try {
    var groupBy = "i.id,g.id";
    var where = "";
    if (data.filters.isHq) {
      where = where + " and b.buildingId=-1";
    } else {
      where = where + " and b.buildingId>0";
    }
    if (data.filters.startDate && data.filters.endDate) {
      where = where + " and ifnull(i.dateFrom, b.date) between '" + data.filters.startDate + "' and '" + data.filters.endDate + "'";
    }
    var monthLastDate = utils.moment().endOf('month').format("YYYY-MM-DD");
    var sql = `select g.name building, oc.name category, ot.name type, oitc.name itemCategory, oit.name itemType, oi.name item, 
              date(ifnull(i.dateFrom, b.date)) date, DATE_FORMAT(ifnull(i.dateFrom, b.date),'%b %y') month, sum(i.taxableAmount) amount
              from vendor_purchase_items i  
              left join vendor_purchase_orders b on i.purchaseOrderId=b.id
              left join vendors p on p.id = b.vendorId
              left join opex_recurring_payments pp on pp.id = b.opexPaymentId
              left join buildings g on g.id = b.buildingId
              left join offices o on o.id = b.officeId  
              left join vendor_purchase_order_invoices inv on inv.id=b.taxInvoiceId
              left join opex_types oi on oi.id = i.opexTypeId          
              left join opex_types oit on oit.id = oi.typeId
              left join opex_categories oitc on oitc.id = oit.catId        
              left join opex_types ot on ot.id = i.opexTypeId
              left join opex_categories oc on oc.id = ot.catId
              where b.companyId=` + data.companyId + where + ` and ifnull(i.dateFrom, b.date)<='` + monthLastDate + `'
               and b.buildingId is not null and b.isBill=1 and b.isOpex=1 and  i.status not in ('Archived') 
               and (ot.id is not null or oi.id is not null) and b.status in ('Approved','Paid','PrePaid','Closed')
        group by  oit.id,ot.id, g.id,  month(ifnull(i.dateFrom, b.date)), year(ifnull(i.dateFrom, b.date))
        order by year(ifnull(i.dateFrom, b.date)), month(ifnull(i.dateFrom, b.date)), g.id`;

    log.write("ReportsService ::: getExpensesDashboard :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    log.write("ReportsService ::: getExpensesDashboard :: results count : " + results.length);

    return results;
  } catch (e) {
    log.write("ReportsService ::: getExpensesDashboard :: exception : ", e);
    throw (e);
  }
}
service.getRevenueDashboard = async (data) => {
  try {
    var groupBy = "";
    var where = "";
    if (data.filters.startDate && data.filters.endDate) {
      where = where + " and i.startDate between '" + data.filters.startDate + "' and '" + data.filters.endDate + "'";
    }
    var monthLastDate = utils.moment().endOf('month').format("YYYY-MM-DD");
    var sql = `select g.name building, ins.category, ins.type, DATE_FORMAT(i.startDate,'%b %y') month, cast(sum(ii.amount) as UNSIGNED) amount
            from invoices i
            left join invoice_items ii on ii.invoiceId=i.id
            left join invoice_services ins on ins.id = ii.invoiceServiceId
            left join bookings b on i.bookingId = b.id
            left join resource_bookings rb on rb.bookingId=b.id
            left join bookings rbb on rbb.id = rb.parentBookingId
            left join offices o on o.id=b.officeId
            left join buildings g on g.id=o.buildingId
            where b.companyId=` + data.companyId + where + ` and i.startDate<='` + monthLastDate + `' and b.status not in ('Cancelled','Failed') 
            and ins.id is not null and i.isCancelled=0 and i.isLiability=0
            group by ins.type, ins.category, g.id, month(i.startDate), year(i.startDate)
            order by year(i.startDate), month(i.startDate),  g.id`;

    log.write("ReportsService ::: getRevenueDashboard :: sql : " + sql);
    var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });

    log.write("ReportsService ::: getRevenueDashboard :: results count : " + results.length);
    return results;
  } catch (e) {
    log.write("ReportsService ::: getRevenueDashboard :: exception : ", e);
    throw (e);
  }
}

service.getProfitandLossDashboard = async (data) => {
  try {
    var groupBy = "";
    var where = "";
    if (data.filters.startDate && data.filters.endDate) {
      where = where + " and ifnull(i.dateFrom, b.date) between '" + data.filters.startDate + "' and '" + data.filters.endDate + "'";
    }
    var monthLastDate = utils.moment().endOf('month').format("YYYY-MM-DD");

    var sql = `select ifnull(g.name,'HO') building, date(ifnull(i.dateFrom, b.date)) date, 
                DATE_FORMAT(ifnull(i.dateFrom, b.date),'%b %y') month, sum(i.taxableAmount) amount
              from vendor_purchase_items i  
              left join vendor_purchase_orders b on i.purchaseOrderId=b.id
              left join vendors p on p.id = b.vendorId
              left join opex_recurring_payments pp on pp.id = b.opexPaymentId
              left join buildings g on g.id = b.buildingId
              left join offices o on o.id = b.officeId  
              left join vendor_purchase_order_invoices inv on inv.id=b.taxInvoiceId
              left join opex_types oi on oi.id = i.opexTypeId          
              left join opex_types oit on oit.id = oi.typeId
              left join opex_categories oitc on oitc.id = oit.catId        
              left join opex_types ot on ot.id = i.opexTypeId
              left join opex_categories oc on oc.id = ot.catId
              where b.companyId=` + data.companyId + where + ` and ifnull(i.dateFrom, b.date)<='` + monthLastDate + `'
               and b.buildingId is not null and b.isBill=1 and b.isOpex=1 and i.status not in ('Archived') 
               and (ot.id is not null or oi.id is not null) and b.status in ('Approved','Paid','PrePaid','Closed')
        group by  oit.id,ot.id, g.id,  month(ifnull(i.dateFrom, b.date)), year(ifnull(i.dateFrom, b.date))
        order by year(ifnull(i.dateFrom, b.date)), month(ifnull(i.dateFrom, b.date)), g.id`;

    log.write("ReportsService ::: getProfitandLossDashboard :: sql : " + sql);
    var expenses = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });


    if (data.filters.startDate && data.filters.endDate) {
      where = " and i.startDate between '" + data.filters.startDate + "' and '" + data.filters.endDate + "'";
    }
    sql = `select g.name building, DATE_FORMAT(i.startDate,'%b %y') month, cast(sum(ii.amount) as UNSIGNED) amount
            from invoices i
            left join invoice_items ii on ii.invoiceId=i.id
            left join bookings b on i.bookingId = b.id
            left join resource_bookings rb on rb.bookingId=b.id
            left join bookings rbb on rbb.id = rb.parentBookingId
            left join offices o on o.id=b.officeId
            left join buildings g on g.id=o.buildingId
            where  b.companyId=` + data.companyId + where + ` and i.startDate is not null and i.startDate<='` + monthLastDate + `'
            and b.status not in ('Cancelled','Failed') 
            and i.isCancelled=0 and i.isLiability=0
            group by g.id, month(i.startDate), year(i.startDate)
            order by year(i.startDate), month(i.startDate),  g.id`;

    log.write("ReportsService ::: getProfitandLossDashboard :: sql : " + sql);
    var revenues = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });

    return { expenses: expenses, revenues: revenues };
  } catch (e) {
    log.write("ReportsService ::: getProfitandLossDashboard :: exception : ", e);
    throw (e);
  }
}


service.getAccountsCards = async (data) => {
  try {
    var results = {
      credits: [],
      debits: [],
      expenses: [],
      payouts: [],
      ar: [],
      ap: [],
      lastTdsNotificationTriggered: [],
      tdsDue: [],
      uploadedTds: [],
      pendingTds: [],
      tdsDueWarningClients: [],
      posGstPostings: [],
      billsGstPostings: [],
      pendingTdsVendors: [],
      vendorTdsDues: [],
      paidVendorTds: [],
    };

    // ###### credits #######
    var sql = "select count(id) count from payin_entries where suspense=1 and companyId=" + data.companyId
    var rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows[0]['count'] > 20) {
      level = "full-red";
    } else if (rows[0]['count'] > 10) {
      level = "red";
    } else if (rows[0]['count'] > 5) {
      level = "orange";
    } else if (rows[0]['count'] > 0) {
      level = "light";
    }
    results.credits.push({
      name: "Suspenses",
      type: "creditSuspenses",
      value: rows[0]['count'],
      level: level,
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good",
      desc: "Count of Suspense credit entries to be addressed"
    });

    sql = "select count(id) count from payin_entries where nonRevenue=1 and companyId=" + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    results.credits.push({ name: "Non Revenue", type: "nonRevenue", value: rows[0]['count'], level: "normal", desc: " Count of the CreditEntries which are not from any revenue source" });

    sql = "select count(id) count from payin_entries where attributed=0 and companyId=" + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows[0]['count'] > 20) {
      level = "full-red";
    } else if (rows[0]['count'] > 10) {
      level = "red";
    } else if (rows[0]['count'] > 5) {
      level = "orange";
    } else if (rows[0]['count'] > 0) {
      level = "light";
    }
    results.credits.push({
      name: "Non Attributed",
      type: "creditNonAttributed",
      value: rows[0]['count'],
      level: level,
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good",
      desc: " Count of the creditEntries which are not yet attributed"
    });
    results.credits.push({
      name: "Pending PG Credit",
      value: 0,
      level: "normal",
      desc: "Count of the Credit Entries which are occured from PaymentGateways which are to be attributed"
    });

    sql = "select addedOn from payin_entries where paymentMode='BankTransfer' and companyId=" + data.companyId + " order by id desc;"
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    if (rows.length) {
      results.credits.push({ name: "Last BankCredit", value: utils.moment(rows[0]['addedOn']).format("MMM DD, YYYY"), level: "normal", desc: "It is the date on which the latest credit entries from bank are imported into the ERP" });
    } else {
      results.credits.push({ name: "Last BankCredit", value: "None", level: "normal", desc: "It is the date on which the latest credit entries from bank are imported into the ERP" });
    }

    sql = "select addedOn from payin_entries where paymentMode='PG' and companyId=" + data.companyId + " order by id desc;"
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    if (rows.length) {
      results.credits.push({ name: "Last PGCredit", value: utils.moment(rows[0]['addedOn']).format("MMM DD, YYYY"), level: "normal", desc: "It is the date on which the latest credit entry happend through the payment gateway" });
    } else {
      results.credits.push({ name: "Last PGCredit", value: "None", level: "normal", desc: "It is the date on which the latest credit entry happend through the payment gateway" });
    }

    // ###### debits #######
    var sql = "select count(id) count from payout_entries where suspense=1 and companyId=" + data.companyId
    var rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows[0]['count'] > 20) {
      level = "full-red";
    } else if (rows[0]['count'] > 10) {
      level = "red";
    } else if (rows[0]['count'] > 5) {
      level = "orange";
    } else if (rows[0]['count'] > 0) {
      level = "light";
    }
    results.debits.push({
      name: "Suspenses",
      type: "debitSuspenses",
      value: rows[0]['count'],
      level: level,
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good",
      desc: "Count of the suspense debit entries to be addressed "
    });

    sql = "select count(id) count from payout_entries where nonExpense=1 and companyId=" + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    results.debits.push({ name: "Non Expense", type: "nonExpense", value: rows[0]['count'], level: "normal", desc: "Count of the Debit Entries which are not actual debits ( intrabank transfers)" });

    sql = "select count(id) count from payout_entries where attributed=0 and companyId=" + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows[0]['count'] > 20) {
      level = "full-red";
    } else if (rows[0]['count'] > 10) {
      level = "red";
    } else if (rows[0]['count'] > 5) {
      level = "orange";
    } else if (rows[0]['count'] > 0) {
      level = "light";
    }
    results.debits.push({
      name: "Non Attributed",
      type: "debitNonAttributed",
      value: rows[0]['count'],
      level: level,
      desc: "Count of the debit entries which are to be attributed",
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good"
    });

    results.debits.push({ name: "Pending PG Errors", value: 0, level: "normal", desc: "Count of the transaction which have errors in processing the payments" });

    sql = "select addedOn from payout_entries where paymentMode='BankTransfer' and companyId=" + data.companyId + " order by id desc;"
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    if (rows.length) {
      results.debits.push({ name: "Last BankDebit", value: utils.moment(rows[0]['addedOn']).format("MMM DD, YYYY"), level: "normal", desc: "It is the date on which latest debit entries imported in to the ERP" });
    } else {
      results.debits.push({ name: "Last BankDebit", value: "None", level: "normal", desc: "It is the date on which latest debit entries imported in to the ERP" });
    }

    sql = "select addedOn from payout_entries where paymentMode='PG' and companyId=" + data.companyId + " order by id desc;"
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    if (rows.length) {
      results.debits.push({ name: "Last PGDebit", value: utils.moment(rows[0]['addedOn']).format("MMM DD, YYYY"), level: "normal", desc: "It is the date on which lastest debit happened through the payment gateway" });
    } else {
      results.debits.push({ name: "Last PGDebit", value: "None", level: "normal", desc: "It is the date on which lastest debit happened through the payment gateway" });
    }

    // ###### expenses #######
    sql = "select count(id) count from bills_queue where status in ('Draft','New','Raised') and companyId=" + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows[0]['count'] > 20) {
      level = "full-red";
    } else if (rows[0]['count'] > 10) {
      level = "red";
    } else if (rows[0]['count'] > 5) {
      level = "orange";
    } else if (rows[0]['count'] > 0) {
      level = "light";
    }
    results.expenses.push({
      name: "Bills in BillsQueue",
      type: "billsInBillsQueue",
      value: rows[0]['count'],
      level: level,
      desc: "Count of the bills in the bill queue to be mapped",
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good"
    });

    sql = "select count(id) count from vendor_purchase_orders where isBill=1 and isOpex=1 and buildingId>0  and status in ('New') and companyId=" + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    results.expenses.push({ name: "Building Bills", type: "buildingBills", value: rows[0]['count'], level: "normal", desc: "Count of the bills in Building bills which are to be addressed" });

    sql = "select count(id) count from vendor_purchase_orders where isBill=1 and isOpex=1 and buildingId>0  and status in ('Raised') and companyId=" + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    results.expenses.push({ name: "Building Recurring Bills", type: "buildingRecurringBills", value: rows[0]['count'], level: "normal", desc: "Count of the building  recurring bills which are in raised status and actions to be taken" });

    sql = "select count(id) count from vendor_purchase_orders where isBill=1 and isOpex=1 and buildingId=-1  and status in ('New') and companyId=" + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    results.expenses.push({ name: "HO Bills", type: "hoBills", value: rows[0]['count'], level: "normal", desc: "Count of the HO bills which are in raised status and actions to be taken" });

    sql = "select count(id) count from vendor_purchase_orders where isBill=1 and isOpex=1 and buildingId=-1  and status in ('Raised') and companyId=" + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    results.expenses.push({ name: "HO Recurring Bills", type: "hoRecurringBills", value: rows[0]['count'], level: "normal", desc: "Count of the HO recurring bills which are in Raised status and actions to be taken" });

    sql = "select count(id) count from vendor_purchase_orders where isBill=1 and isOpex=0 and status in ('New','Raised') and companyId=" + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    results.expenses.push({ name: "Project Bills", type: "projectBills", value: rows[0]['count'], level: "normal", desc: "Count of the projects bills which are in raised status and actions to be taken" });

    // ###### payouts #######
    sql = `select sum(pm.amount) amount from vendor_purchase_order_milestones pm, vendor_purchase_orders po 
          where pm.purchaseOrderId=po.id and po.status not in ('Deleted', 'Declined','Paid','Closed') and pm.status in ('Draft','Approved','Released')
          and ifnull(pm.actualDate, pm.expectedDate)<CURDATE() and po.companyId=` + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows[0]['amount'] > 5000000) {
      level = "full-red";
    } else if (rows[0]['amount'] > 2500000) {
      level = "red";
    } else if (rows[0]['amount'] > 1000000) {
      level = "orange";
    } else if (rows[0]['amount'] > 500000) {
      level = "light";
    }
    results.payouts.push({
      name: "Due Amount",
      type: "dueAmount",
      value: Math.round(rows[0]['amount']),
      amount: true,
      level: level,
      info: "More than 50lak : Very High, 25 - 50lak : High, 10 - 25lak : Medium, 5 - 10lak : Ok, 0 : Good",
      desc: "Sum of the amount which is to be paid by the company to vendors till today",
    });

    sql = `select count(DISTINCT(po.vendorId)) count from vendor_purchase_order_milestones pm, vendor_purchase_orders po 
          where pm.purchaseOrderId=po.id and po.status not in ('Deleted', 'Declined','Paid','Closed')  and pm.status in ('Draft','Approved','Released')
          and ifnull(pm.actualDate, pm.expectedDate)<CURDATE() and po.companyId=` + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows[0]['count'] > 20) {
      level = "full-red";
    } else if (rows[0]['count'] > 10) {
      level = "red";
    } else if (rows[0]['count'] > 5) {
      level = "orange";
    } else if (rows[0]['count'] > 0) {
      level = "light";
    }
    results.payouts.push({
      name: "Due Vendor Count",
      type: "dueAmount",
      value: rows[0]['count'],
      level: level,
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good",
      desc: "Count of the vendors to whom the company has to pay"
    });

    // ###### AP #######
    sql = `select sum(pm.amount) amount from vendor_purchase_order_milestones pm, vendor_purchase_orders po 
          where pm.purchaseOrderId=po.id and po.status not in ('Deleted', 'Declined','Paid','Closed')  and pm.status in ('Draft','Approved','Released')  and po.companyId=` + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows[0]['amount'] > 5000000) {
      level = "full-red";
    } else if (rows[0]['amount'] > 2500000) {
      level = "red";
    } else if (rows[0]['amount'] > 1000000) {
      level = "orange";
    } else if (rows[0]['amount'] > 500000) {
      level = "light";
    }
    results.ap.push({
      name: "Payable Amount",
      type: "payableAmount",
      value: Math.round(rows[0]['amount']),
      amount: true,
      level: level,
      desc: "Sum of the amount which is yet to pay to vendors",
      info: "More than 50lak : Very High, 25 - 50lak : High, 10 - 25lak : Medium, 5 - 10lak : Ok, 0 : Good"
    });

    sql = `select count(DISTINCT(po.vendorId)) count from vendor_purchase_order_milestones pm, vendor_purchase_orders po 
          where pm.purchaseOrderId=po.id and po.status not in ('Deleted', 'Declined','Paid','Closed')  and pm.status in ('Draft','Approved','Released')  and po.companyId=` + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows[0]['count'] > 50) {
      level = "full-red";
    } else if (rows[0]['count'] > 25) {
      level = "red";
    } else if (rows[0]['count'] > 10) {
      level = "orange";
    } else if (rows[0]['count'] > 5) {
      level = "light";
    }
    results.ap.push({
      name: "Payable Vendor Count",
      type: "payableAmount",
      value: rows[0]['count'],
      level: level,
      desc: "Count of vendors to whom we are due",
      info: "More than 50 : Very High,  25 - 50 : High, 10 - 25 : Medium, Below 10 : Ok, 0 : Good"
    });

    // ###### AR ######
    sql = "select sum(due) amount from bookings where status not in ('Cancelled','Failed') and refNo is not null and due>0 and companyId=" + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows[0]['amount'] > 5000000) {
      level = "full-red";
    } else if (rows[0]['amount'] > 2500000) {
      level = "red";
    } else if (rows[0]['amount'] > 1000000) {
      level = "orange";
    } else if (rows[0]['amount'] > 500000) {
      level = "light";
    }
    results.ar.push({
      name: "Total AR Amount",
      type: "totalARAmount",
      value: Math.round(rows[0]['amount']),
      amount: true,
      level: level,
      desc: "Sum of the amount which is to be collected from the clients tilldate",
      info: "More than 50lak : Very High, 25 - 50lak : High, 10 - 25lak : Medium, 5 - 10lak : Ok, 0 : Good"
    });

    sql = "select count(distinct(id)) count from bookings where status not in ('Cancelled','Failed') and refNo is not null and due>0 and companyId=" + data.companyId
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows[0]['count'] > 20) {
      level = "full-red";
    } else if (rows[0]['count'] > 10) {
      level = "red";
    } else if (rows[0]['count'] > 5) {
      level = "orange";
    } else if (rows[0]['count'] > 0) {
      level = "light";
    }
    results.ar.push({
      name: "Client Count",
      type: "totalARAmount",
      value: rows[0]['count'],
      level: level,
      desc: "Sum of the clients who has to pay to the company",
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good"
    });

    // ########## pos gst postings #############
    var gstPostedPOs = 0;
    var gstVerifiedPOs = 0;
    sql = `SELECT count(po.id) pos 
          FROM vendor_purchase_orders po 
          left join vendor_purchase_order_invoices i on po.id = i.purchaseOrderId
          where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=0 and po.status in ('Raised','Started','Closed')
          group by po.id having count(i.id)=0`;
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows.length > 20) {
      level = "full-red";
    } else if (rows.length > 10) {
      level = "red";
    } else if (rows.length > 5) {
      level = "orange";
    } else if (rows.length > 0) {
      level = "light";
    }
    results.posGstPostings.push({
      name: "POs with no Invoices",
      type: "noPOSInvoices",
      value: Math.round(rows.length),
      level: level,
      desc: "Count of the POS for which dont have any invoice uploaded yet.",
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good"
    });

    sql = `SELECT po.id, i.gstFileId, count(ig.id) gsts FROM vendor_purchase_order_invoices i
          left join vendor_purchase_orders po on po.id = i.purchaseOrderId
          left join vendor_purchase_order_invoice_gsts ig on ig.purchaseOrderInvoiceId=i.id
          where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=0  and po.status in ('Raised','Started','Closed')
          group by po.id having count(ig.id)>0`;
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    gstPostedPOs = rows.length;
    results.posGstPostings.push({
      name: "GST Posted POs",
      // type: "gstPostedPOs",
      value: Math.round(rows.length),
      level: "normal",
      desc: "Count of the POS for which the GST posting is completed",
    });

    sql = `SELECT po.id, i.gstFileId, count(ig.id) gsts FROM vendor_purchase_order_invoices i
          left join vendor_purchase_orders po on po.id = i.purchaseOrderId
          left join vendor_purchase_order_invoice_gsts ig on ig.purchaseOrderInvoiceId=i.id
          where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=0 and po.status in ('Raised','Started','Closed')
          group by po.id having count(ig.id)=0`;
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows.length > 20) {
      level = "full-red";
    } else if (rows.length > 10) {
      level = "red";
    } else if (rows.length > 5) {
      level = "orange";
    } else if (rows.length > 0) {
      level = "light";
    }
    results.posGstPostings.push({
      name: "GST Posted Pending POs",
      type: "gstPostedPendingPOs",
      value: Math.round(rows.length),
      level: level,
      desc: "Count of the POS for which GST Posting to be done which are having tax invoices",
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good"
    });

    sql = `SELECT po.id, i.gstFileId, count(ig.id) gsts FROM vendor_purchase_order_invoices i
          left join vendor_purchase_orders po on po.id = i.purchaseOrderId
          left join vendor_purchase_order_invoice_gsts ig on ig.purchaseOrderInvoiceId=i.id
          where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=0 and i.gstFileId is not null  
          and po.status in ('Raised','Started','Closed')
          group by po.id`;
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    gstVerifiedPOs = rows.length;
    results.posGstPostings.push({
      name: "GSTR Verified POs",
      // type: "gstrVerifiedPOs",
      value: Math.round(rows.length),
      level: "normal",
      desc: "Count of the POS whose GST is verified in the Government Portal and GST Submission fils is uploaded",
    });

    // sql = `SELECT po.id, i.gstFileId, count(ig.id) gsts FROM vendor_purchase_order_invoices i
    //       left join vendor_purchase_orders po on po.id = i.purchaseOrderId
    //       left join vendor_purchase_order_invoice_gsts ig on ig.purchaseOrderInvoiceId=i.id
    //       where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=0 and i.gstFileId is null
    //       group by po.id`;
    // rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    // var level = "green";
    // if (rows.length > 20) {
    //   level = "full-red";
    // } else if (rows.length > 10) {
    //   level = "red";
    // } else if (rows.length > 5) {
    //   level = "orange";
    // } else if (rows.length > 0) {
    //   level = "light";
    // }
    var gstVerificationPendingPOs = gstPostedPOs - gstVerifiedPOs;
    var level = "green";
    if (gstVerificationPendingPOs > 20) {
      level = "full-red";
    } else if (gstVerificationPendingPOs > 10) {
      level = "red";
    } else if (gstVerificationPendingPOs > 5) {
      level = "orange";
    } else if (gstVerificationPendingPOs > 0) {
      level = "light";
    }
    results.posGstPostings.push({
      name: "GSTR Verification Pending POs",
      // type: "gstrVerificationPendingPOs",
      value: Math.round(gstVerificationPendingPOs),
      level: level,
      desc: "Count of the POS whose GST verification is to be done on the Government Portal",
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good"
    });

    // ########## bills gst postings #############
    var gstPostedBills = 0;
    var gstVerifiedBills = 0;
    sql = `SELECT count(po.id) pos 
          FROM vendor_purchase_orders po 
          left join vendor_purchase_order_invoices i on po.id = i.purchaseOrderId
          where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=1 and po.status in ('Approved','Paid','PrePaid','Closed')
          group by po.id having count(po.id)=0`;
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows.length > 20) {
      level = "full-red";
    } else if (rows.length > 10) {
      level = "red";
    } else if (rows.length > 5) {
      level = "orange";
    } else if (rows.length > 0) {
      level = "light";
    }
    results.billsGstPostings.push({
      name: "Bills with no Invoices",
      type: "noBillsInvoices",
      value: Math.round(rows.length),
      level: level,
      desc: "Count of the Bills for which dont have any invoice uploaded yet.",
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good"
    });

    sql = `SELECT po.id, i.gstFileId, count(ig.id) gsts FROM vendor_purchase_order_invoices i
          left join vendor_purchase_orders po on po.id = i.purchaseOrderId
          left join vendor_purchase_order_invoice_gsts ig on ig.purchaseOrderInvoiceId=i.id
          where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=1
            and po.status in ('Approved','Paid','PrePaid','Closed')
          group by po.id having count(ig.id)>0`;
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    gstPostedBills = rows.length;
    results.billsGstPostings.push({
      name: "GST Posted Bills",
      // type: "gstPostedBills",
      value: Math.round(rows.length),
      level: "normal",
      desc: "Count of the bills whose GST posting is done"
    });

    sql = `SELECT po.id, i.gstFileId, count(ig.id) gsts FROM vendor_purchase_order_invoices i
          left join vendor_purchase_orders po on po.id = i.purchaseOrderId
          left join vendor_purchase_order_invoice_gsts ig on ig.purchaseOrderInvoiceId=i.id
          where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=1  and po.status in ('Approved','Paid','PrePaid','Closed')
          group by po.id having count(ig.id)=0`;
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    if (rows.length > 20) {
      level = "full-red";
    } else if (rows.length > 10) {
      level = "red";
    } else if (rows.length > 5) {
      level = "orange";
    } else if (rows.length > 0) {
      level = "light";
    }
    results.billsGstPostings.push({
      name: "GST Posted Pending Bills",
      type: "gstPostedPendingBills",
      value: Math.round(rows.length),
      level: level,
      desc: "Count of the Bills for which GST posting is to be done which are having tax invoices",
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good"
    });

    sql = `SELECT po.id, i.gstFileId, count(ig.id) gsts FROM vendor_purchase_order_invoices i
          left join vendor_purchase_orders po on po.id = i.purchaseOrderId
          left join vendor_purchase_order_invoice_gsts ig on ig.purchaseOrderInvoiceId=i.id
          where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=1 and i.gstFileId is not null
           and po.status in ('Approved','Paid','PrePaid','Closed')
          group by po.id`;
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var level = "green";
    gstVerifiedBills = rows.length;
    results.billsGstPostings.push({
      name: "GSTR Verified Bills",
      // type: "gstrVerifiedBills",
      value: Math.round(rows.length),
      level: "normal",
      desc: "Count of the Bills whose GST is verified in the Government Portal and GST Submission files is uploaded in ERP"
    });

    // sql = `SELECT po.id, i.gstFileId, count(ig.id) gsts FROM vendor_purchase_order_invoices i
    //       left join vendor_purchase_orders po on po.id = i.purchaseOrderId
    //       left join vendor_purchase_order_invoice_gsts ig on ig.purchaseOrderInvoiceId=i.id
    //       where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=1  and ig.id is not null and i.gstFileId is null
    //       group by po.id`;
    // rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var gstVerificationPendingBills = gstPostedBills - gstVerifiedBills;
    var level = "green";
    if (gstVerificationPendingBills > 20) {
      level = "full-red";
    } else if (gstVerificationPendingBills > 10) {
      level = "red";
    } else if (gstVerificationPendingBills > 5) {
      level = "orange";
    } else if (gstVerificationPendingBills > 0) {
      level = "light";
    }
    results.billsGstPostings.push({
      name: "GSTR Verification Pending Bills",
      // type: "gstrVerificationPendingBills",
      value: Math.round(gstVerificationPendingBills),
      level: level,
      desc: "Count of the Bills whose GST verification is to be done in the Government Portal",
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good"
    });


    // ########## tds due by quarter #############
    var quarters = [];
    var currMonth = utils.moment().month();
    var quarter;
    if (currMonth >= 0 && currMonth < 3) {
      quarter = { start: utils.moment().month(0).startOf('month'), end: utils.moment().month(2).endOf('month') };
    } else if (currMonth >= 3 && currMonth < 6) {
      quarter = { start: utils.moment().month(3).startOf('month'), end: utils.moment().month(5).endOf('month') };
    } else if (currMonth >= 6 && currMonth < 9) {
      quarter = { start: utils.moment().month(6).startOf('month'), end: utils.moment().month(8).endOf('month') };
    } else if (currMonth >= 9 && currMonth <= 11) {
      quarter = { start: utils.moment().month(9).startOf('month'), end: utils.moment().month(11).endOf('month') };
    }
    // log.write("ReportsService ::: getAccountsCards :: TDS Due quarter :", quarter.end);
    for (var i = 0; i < 6; i++) {
      sql = `SELECT sum(tds-tdsPaid) due FROM invoices i, bookings b
             where i.bookingId=b.id and b.status not  in ('Failed','Cancelled','Settled') and i.isCancelled=0 and i.isLiability=0
             and tds-tdsPaid > 0 and date>='` + quarter.start.format("YYYY-MM-DD") + `'
             and date<='` + quarter.end.format("YYYY-MM-DD") + `' and b.companyId=` + data.companyId;
      rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
      var level = "green";
      if (rows[0]['due'] > 5000000) {
        level = "full-red";
      } else if (rows[0]['due'] > 2500000) {
        level = "red";
      } else if (rows[0]['due'] > 1000000) {
        level = "orange";
      } else if (rows[0]['due'] > 500000) {
        level = "light";
      } else if (rows[0]['due'] > 0) {
        level = "light";
      }
      results.tdsDue.push({
        name: quarter.start.format("MMM YY") + " - " + quarter.end.format("MMM YY"),
        type: 'tdsDue',
        fromDate: quarter.start.format("YYYY-MM-DD"),
        toDate: quarter.end.format("YYYY-MM-DD"),
        amount: true,
        value: Math.round(rows[0]['due']),
        level: level,
        desc: "Sum of the TDS amount which are to be collected from the clients in this Quarter",
        info: "More than 50lak : Very High, 25 - 50lak : High, 10 - 25lak : Medium, 5 - 10lak : Ok, 0 : Good"
      });

      sql = `SELECT count(i.bookingId) due, ifnull(c.company,c.name) company, c.gstNo FROM invoices i, bookings b, clients c
             where b.clientId=c.id and i.bookingId=b.id and b.refNo is not NULL and c.gstNo is not null
             and tds-tdsPaid > 0  and b.status not  in ('Failed','Cancelled','Settled') and i.isCancelled=0 and i.isLiability=0
             and date>='` + quarter.start.format("YYYY-MM-DD") + `'
             and date<='` + quarter.end.format("YYYY-MM-DD") + `' and b.companyId=` + data.companyId + ` group by c.gstNo`;
      rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
      var level = "green";
      if (rows.length > 20) {
        level = "full-red";
      } else if (rows.length > 10) {
        level = "red";
      } else if (rows.length > 5) {
        level = "orange";
      } else if (rows.length > 0) {
        level = "light";
      }
      results.pendingTds.push({
        name: quarter.start.format("MMM YY") + " - " + quarter.end.format("MMM YY"),
        type: 'tdsDue',
        fromDate: quarter.start.format("YYYY-MM-DD"),
        toDate: quarter.end.format("YYYY-MM-DD"),
        value: rows.length,
        level: level,
        desc: "Count of the clients from whom we need to collect the TDS form in this Quarter",
        info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good"
      });

      sql = `SELECT count(i.bookingId) due, ifnull(c.company,c.name) company, c.gstNo FROM invoices i, bookings b, clients c
             where b.clientId=c.id and i.bookingId=b.id and b.refNo is not NULL and c.gstNo is not null
             and tds-tdsPaid = 0  and b.status not  in ('Failed','Cancelled','Settled') and i.isCancelled=0 and i.isLiability=0
             and date>='` + quarter.start.format("YYYY-MM-DD") + `'
             and date<='` + quarter.end.format("YYYY-MM-DD") + `' and b.companyId=` + data.companyId + ` group by c.gstNo`;
      rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });

      results.uploadedTds.push({
        name: quarter.start.format("MMM YY") + " - " + quarter.end.format("MMM YY"),
        value: rows.length,
        // type: 'tdsPaidClients',
        fromDate: quarter.start.format("YYYY-MM-DD"),
        toDate: quarter.end.format("YYYY-MM-DD"),
        desc: "Count of the clients who has submitted the TDS form in this Quarter",
        level: "normal",
      });

      quarter = { start: quarter.start.subtract(3, 'months').startOf('month'), end: quarter.end.subtract(3, 'months').endOf('month') }
    }


    sql = `SELECT (i.bookingId), ifnull(c.company,c.name) company, c.gstNo, sum(tds-tdsPaid) tdsdue, security sd, ROUND((sum(tds-tdsPaid)/security)*100) duepercent
      FROM invoices i 
      left join bookings b on i.bookingId=b.id
      left join clients c on b.clientId=c.id
      left join contracts ct on b.contractId=ct.id
      where b.refNo is not NULL
      and i.isCancelled=0
      and i.isLiability=0
      and b.status not  in ('Failed','Cancelled','Settled') and b.companyId=` + data.companyId + `
      GROUP BY b.id
      HAVING sum(tds-tdsPaid)>0`;
    rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    var tdsDueWarningClients = _.filter(rows, function(c) { return c.duepercent >= 25 });
    var level = "green";
    if (tdsDueWarningClients.length > 20) {
      level = "full-red";
    } else if (tdsDueWarningClients.length > 10) {
      level = "red";
    } else if (tdsDueWarningClients.length > 5) {
      level = "orange";
    } else if (tdsDueWarningClients.length > 0) {
      level = "light";
    }
    results.tdsDueWarningClients.push({
      name: "Clients with TDS due more than 25% of their SD",
      type: "highTdsDueClients",
      value: tdsDueWarningClients.length,
      level: level,
      desc: "Cliens with TDS Due more than 25% SD : Count of the clients whose TDS Due Crossed 25% of the SD amount",
      info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good"
    });
    results.tdsDueWarningClients.push({ name: "Last TDS Notification Trigerred", value: "None", level: "normal", desc: "It is the date on which TDS Notification is sent to the Clients for collecting the TDS form" });


    // ####### vendor tds payments ###############
    var year = utils.moment().year();
    var month = utils.moment().month();
    if (month < 3) {
      year = year - 1;
    }
    sql = 'select * from vendor_tds_compliance_terms where archieved=0 and year=' + year + ' order by dateFrom';
    var terms = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      sql = `select i.id,v.id vendorId, v.name vendor, i.invoiceDate, ifnull(sum(i.taxableAmount),0) taxableAmount, ifnull(sum(i.tds),0) tds, count(i.id) invoices,
               tp.amount, tp.date, ct.dueDate,tp.id paymentId, d.file
              from vendor_purchase_order_invoices i
              left join vendor_purchase_orders p on p.id=i.purchaseOrderId 
              left join vendors v on v.id = p.vendorId
              left join vendor_tds_compliance_terms ct on  ct.dateFrom='` + term.dateFrom + `'
              left join vendor_tds_payments tp on ct.id=tp.complianceTermId and tp.vendorId=p.vendorId 
              left join docs d on d.id=tp.tdsFileId
               where p.companyId=` + data.companyId + ` and p.isBill=0 
               and i.invoiceDate BETWEEN '` + term.dateFrom + `' and '` + term.dateTo + `' group by v.id`;
      log.write("Dashboard ::: vendor tds sql : " + sql);
      var tdsPayments = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });

      var duePayments = _.filter(tdsPayments, function(t) {
        return t.paymentId == null
      })
      var dues = _.sumBy(duePayments, 'tds');
      if (dues > 0) {
        var level = "green";
        if (dues > 5000000) {
          level = "full-red";
        } else if (dues > 2500000) {
          level = "red";
        } else if (dues > 1000000) {
          level = "orange";
        } else if (dues > 500000) {
          level = "light";
        } else if (dues > 0) {
          level = "light";
        }
        results.vendorTdsDues.push({
          name: utils.moment(term.dateFrom).format("MMM DD, YY") + " - " + utils.moment(term.dateTo).format("MMM DD, YY"),
          type: 'vendorTdsDues',
          fromDate: utils.moment(term.dateFrom).format("YYYY-MM-DD"),
          toDate: utils.moment(term.dateTo).format("YYYY-MM-DD"),
          amount: true,
          value: Math.round(dues),
          level: level,
          desc: "Sum of the TDS amount which need to be paid to vendors in this Term",
          info: "More than 50lak : Very High, 25 - 50lak : High, 10 - 25lak : Medium, 5 - 10lak : Ok, 0 : Good"
        });

        var level = "green";
        if (duePayments.length > 20) {
          level = "full-red";
        } else if (duePayments.length > 10) {
          level = "red";
        } else if (duePayments.length > 5) {
          level = "orange";
        } else if (duePayments.length > 0) {
          level = "light";
        }
        results.pendingTdsVendors.push({
          name: utils.moment(term.dateFrom).format("MMM DD, YY") + " - " + utils.moment(term.dateTo).format("MMM DD, YY"),
          type: 'vendorTdsDues',
          fromDate: utils.moment(term.dateFrom).format("YYYY-MM-DD"),
          toDate: utils.moment(term.dateTo).format("YYYY-MM-DD"),
          value: duePayments.length,
          level: level,
          desc: "Count of the vendors to whom we need to pay form in this Term",
          info: "More than 20 : Very High,  10 - 20 : High, 5 - 10 : Medium, Below 5 : Ok, 0 : Good"
        });
      }

      var paidPayments = _.filter(tdsPayments, function(t) {
        return t.paymentId != null
      })
      if (paidPayments.length) {
        results.paidVendorTds.push({
          name: utils.moment(term.dateFrom).format("MMM YY") + " - " + utils.moment(term.dateTo).format("MMM YY"),
          value: paidPayments.length,
          // type: 'tdsPaidClients',
          fromDate: utils.moment(term.dateFrom).format("YYYY-MM-DD"),
          toDate: utils.moment(term.dateTo).format("YYYY-MM-DD"),
          desc: "Count of the vendors to whom we have paid TDS form in this Term",
          level: "normal",
        });
      }
    }

    return results;
  } catch (e) {
    log.write("ReportsService ::: getAccountsCards :: exception : ", e);
    throw (e);
  }
}

service.getAccountsCardsList = async (data) => {
  try {
    var results = [];
    var sql = "";
    if (data.type == "creditSuspenses") {
      sql = "select narration, amount, addedOn, paymentMode, receivedDate from payin_entries where suspense=1 and companyId=" + data.companyId;
    } else if (data.type == "nonRevenue") {
      sql = "select narration, amount, addedOn, paymentMode, receivedDate from payin_entries where nonRevenue=1 and companyId=" + data.companyId;
    } else if (data.type == "creditNonAttributed") {
      sql = "select narration, amount, addedOn, paymentMode, receivedDate from payin_entries where attributed=0 and companyId=" + data.companyId;
    } else if (data.type == "debitSuspenses") {
      sql = "select narration, amount, paidOn, paymentMode from payout_entries where suspense=1 and companyId=" + data.companyId;
    } else if (data.type == "nonExpense") {
      sql = "select narration, amount, paidOn, paymentMode from payout_entries where nonExpense=1 and companyId=" + data.companyId;
    } else if (data.type == "debitNonAttributed") {
      sql = "select narration, amount, paidOn, paymentMode from payout_entries where attributed=0 and companyId=" + data.companyId;
    } else if (data.type == "billsInBillsQueue") {
      sql = `select v.name vendor, b.name building, p.title project, q.amount, q.billType, 
              q.paymentType,q.billDate, q.paidOn, d.file
              from bills_queue q 
              left join docs d on d.id=q.imageId
              left join buildings b on b.id=q.buildingId
              left join vendors v on v.id=q.vendorId
              left join vendor_projects p on p.id=q.projectId
              where q.status in ('Draft','New','Raised') and q.companyId=` + data.companyId;
    } else if (data.type == "buildingBills") {
      sql = `select v.name vendor, b.name building, t.amount, i.taxableAmount, i.dateFrom accountedMonth, t.date
              from vendor_purchase_orders t
              left join vendor_purchase_items i on i.purchaseOrderId=t.id
              left join buildings b on b.id=t.buildingId
              left join vendors v on v.id=t.vendorId
              where t.isBill=1 and t.isOpex=1 and t.buildingId>0  and t.status in ('New') and t.companyId=` + data.companyId
    } else if (data.type == "buildingRecurringBills") {
      sql = `select v.name vendor, b.name building, t.amount, i.taxableAmount, i.dateFrom accountedMonth, t.date
              from vendor_purchase_orders t
              left join vendor_purchase_items i on i.purchaseOrderId=t.id
              left join buildings b on b.id=t.buildingId
              left join vendors v on v.id=t.vendorId
              where t.isBill=1 and t.isOpex=1 and t.buildingId>0  and t.status in ('Raised') and t.companyId=` + data.companyId
    } else if (data.type == "hoBills") {
      sql = `select v.name vendor, b.name building, t.amount, i.taxableAmount, i.dateFrom accountedMonth, t.date
              from vendor_purchase_orders t
              left join vendor_purchase_items i on i.purchaseOrderId=t.id
              left join buildings b on b.id=t.buildingId
              left join vendors v on v.id=t.vendorId
              where t.isBill=1 and t.isOpex=1 and t.buildingId=-1  and t.status in ('New') and t.companyId=` + data.companyId
    } else if (data.type == "hoRecurringBills") {
      sql = `select v.name vendor, b.name building, t.amount, i.taxableAmount, i.dateFrom accountedMonth, t.date
              from vendor_purchase_orders t
              left join vendor_purchase_items i on i.purchaseOrderId=t.id
              left join buildings b on b.id=t.buildingId
              left join vendors v on v.id=t.vendorId
              where t.isBill=1 and t.isOpex=1 and t.buildingId=-1  and t.status in ('Raised') and t.companyId=` + data.companyId
    } else if (data.type == "projectBills") {
      sql = `select v.name vendor, p.title project, t.amount, i.taxableAmount, i.dateFrom accountedMonth, t.date
              from vendor_purchase_orders t
              left join vendor_purchase_items i on i.purchaseOrderId=t.id
              left join buildings b on b.id=t.buildingId
              left join vendors v on v.id=t.vendorId
              left join vendor_projects p on p.id=t.projectId
              where t.isBill=1 and t.isOpex=0 and t.buildingId=-1  and t.status in ('New') and t.companyId=` + data.companyId
    } else if (data.type == "dueAmount") {
      sql = `select sum(pm.amount) amount, p.title project, b.name building, v.name vendor, po.date, ifnull(pm.actualDate, pm.expectedDate) dueDate
               from vendor_purchase_order_milestones pm
               left join vendor_purchase_orders po on po.id=pm.purchaseOrderId
               left join vendors v on v.id=po.vendorId
               left join buildings b on b.id=po.buildingId
               left join vendor_projects p on p.id=po.projectId
              where v.id is not null and po.status not in ('Deleted', 'Declined','Paid','Closed') and pm.status in ('Draft','Approved','Released')
              and ifnull(pm.actualDate, pm.expectedDate)<CURDATE() and po.companyId=` + data.companyId + ` group by v.id`;
    } else if (data.type == "payableAmount") {
      sql = `select sum(pm.amount) amount, p.title project, b.name building, v.name vendor,  po.date, ifnull(pm.actualDate, pm.expectedDate) dueDate
               from vendor_purchase_order_milestones pm
               left join vendor_purchase_orders po on po.id=pm.purchaseOrderId
               left join vendors v on v.id=po.vendorId
               left join buildings b on b.id=po.buildingId
               left join vendor_projects p on p.id=po.projectId
              where v.id is not null and po.status not in ('Deleted', 'Declined','Paid','Closed') and pm.status in ('Draft','Approved','Released')
               and po.companyId=` + data.companyId + ` group by v.id`;
    } else if (data.type == "totalARAmount") {
      sql = `select b.due, ifnull(c.company, c.name) client, b.refNo, b.status, g.name building, o.name office
              from bookings b
              left join clients c on c.id=b.clientId
              left join offices o on o.id=b.officeId
              left join buildings g on g.id=o.buildingId
              where b.status not in ('Cancelled','Failed') and b.refNo is not null and b.due>0 and b.companyId=` + data.companyId
    } else if (data.type == "noPOSInvoices") {
      sql = `SELECT p.title project, v.name vendor, po.amount, po.date
          FROM vendor_purchase_orders po 
          left join vendor_purchase_order_invoices i on po.id = i.purchaseOrderId
          left join vendor_projects p on p.id=po.projectId
          left join vendors v on v.id=po.vendorId
          where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=0 and po.status in ('Raised','Started','Closed')
          group by po.id having count(i.id)=0`
    } else if (data.type == "gstPostedPendingPOs") {
      sql = `SELECT p.title project, v.name vendor, po.amount, po.date
           FROM vendor_purchase_order_invoices i
           left join vendor_purchase_orders po on po.id = i.purchaseOrderId
          left join vendor_purchase_order_invoice_gsts ig on ig.purchaseOrderInvoiceId=i.id
          left join vendor_projects p on p.id=po.projectId
          left join vendors v on v.id=po.vendorId
          where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=0 and po.status in ('Raised','Started','Closed')
          group by po.id having count(ig.id)=0`;
    } else if (data.type == "gstrVerificationPendingPOs") {
      // sql = `SELECT p.title project, v.name vendor, po.amount, po.date
      //      FROM vendor_purchase_order_invoices i
      //      left join vendor_purchase_orders po on po.id = i.purchaseOrderId
      //     left join vendor_purchase_order_invoice_gsts ig on ig.purchaseOrderInvoiceId=i.id
      //     left join vendor_projects p on p.id=po.projectId
      //     left join vendors v on v.id=po.vendorId
      //     where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=0 and po.status in ('Raised','Started','Closed')
      //     group by po.id having count(ig.id)=0`;
    } else if (data.type == "noBillsInvoices") {
      sql = `SELECT p.name building, v.name vendor, po.amount, po.date
          FROM vendor_purchase_orders po 
          left join vendor_purchase_order_invoices i on po.id = i.purchaseOrderId
          left join buildings p on p.id=po.buildingId
          left join vendors v on v.id=po.vendorId
          where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=1 and po.status in ('Approved','Paid','PrePaid','Closed')
          group by po.id having count(i.id)=0`
    } else if (data.type == "gstPostedPendingBills") {
      sql = `SELECT p.name building, v.name vendor, po.amount, po.date
           FROM vendor_purchase_order_invoices i
           left join vendor_purchase_orders po on po.id = i.purchaseOrderId
          left join vendor_purchase_order_invoice_gsts ig on ig.purchaseOrderInvoiceId=i.id
          left join buildings p on p.id=po.buildingId
          left join vendors v on v.id=po.vendorId
          where po.companyId=` + data.companyId + ` and po.date>'2020-04-01' and po.isBill=1 and po.status in ('Approved','Paid','PrePaid','Closed')
          group by po.id having count(ig.id)=0`;
    } else if (data.type == "tdsDue") {
      sql = `SELECT sum(tds-tdsPaid) due, ifnull(c.company,c.name) company, c.gstNo FROM invoices i, bookings b, clients c
             where b.clientId=c.id and i.bookingId=b.id and b.refNo is not NULL and c.gstNo is not null
             and tds-tdsPaid > 0  and b.status not  in ('Failed','Cancelled','Settled') and i.isCancelled=0 and i.isLiability=0
             and date>='` + data.fromDate + `'
             and date<='` + data.toDate + `' and b.companyId=` + data.companyId + ` group by c.gstNo`;
    }
    if (sql != "") {
      results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
    } else if (data.type == "highTdsDueClients") {
      sql = `SELECT (i.bookingId), ifnull(c.company,c.name) company, c.gstNo, sum(tds-tdsPaid) tdsdue, security sd, ROUND((sum(tds-tdsPaid)/security)*100) duepercent
      FROM invoices i 
      left join bookings b on i.bookingId=b.id
      left join clients c on b.clientId=c.id
      left join contracts ct on b.contractId=ct.id
      where b.refNo is not NULL
      and i.isCancelled=0
      and i.isLiability=0
      and b.status not  in ('Failed','Cancelled','Settled') and b.companyId=` + data.companyId + `
      GROUP BY b.id
      HAVING sum(tds-tdsPaid)>0`;
      var rows = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
      results = _.filter(rows, function(c) { return c.duepercent >= 25 });
    }
    return results;
  } catch (e) {
    log.write("ReportsService ::: getAccountsCards :: exception : ", e);
    throw (e);
  }
}


exports.service = service;