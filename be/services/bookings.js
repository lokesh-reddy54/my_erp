"use strict";

var Q = require("q");
var fs = require("fs");
const uuid = require("uuid/v4");
var path = require("path");
var _ = require("lodash");
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var request = require("request-promise");
var moment = require("moment");
var NtoWconverter = require('number-to-words');
const { ToWords } = require('to-words');
const toWords = new ToWords();


var config = require("../utils/config").config;
var session = require("./session");
var log = require("../utils/log").log;
var utils = require("../utils/utils").utils;
var systemUtils = require("./utils/system_util").utils;

var Constants = require("./models/constants");
const { format } = require("path");
const parking_spots = require("./models/parking_spots");
var PayoutPayment = require("./models/base").PayoutPayment;
var PayoutBenificiary = require("./models/base").PayoutBenificiary;
var Booking = require("./models/base").Booking;
var SelfcareLink = require("./models/base").SelfcareLink;
var Location = require("./models/base").Location;
var Building = require("./models/base").Building;
var Office = require("./models/base").Office;
var Floor = require("./models/base").Floor;
var Cabin = require("./models/base").Cabin;
var Desk = require("./models/base").Desk;
var Mail = require("./models/base").Mail;
var Sms = require("./models/base").Sms;
var Lead = require("./models/base").Lead;
var BookedDesk = require("./models/base").BookedDesk;
var Client = require("./models/base").Client;
var Contract = require("./models/base").Contract;
var ContractTerm = require("./models/base").ContractTerm;
var ContractAdditionalInvoice =
  require("./models/base").ContractAdditionalInvoice;
var ExitRequest = require("./models/base").ExitRequest;
var ExitAcr = require("./models/base").ExitAcr;
var ExitAcrItem = require("./models/base").ExitAcrItem;
var ExitComment = require("./models/base").ExitComment;
var ExitDeduction = require("./models/base").ExitDeduction;
var OfficePricing = require("./models/base").OfficePricing;
var FacilitySet = require("./models/base").FacilitySet;
var Invoice = require("./models/base").Invoice;
var InvoiceItem = require("./models/base").InvoiceItem;
var InvoiceService = require("./models/base").InvoiceService;
var Payment = require("./models/base").Payment;
var UrnPayment = require("./models/base").UrnPayment;
var Resource = require("./models/base").Resource;
var ResourceImage = require("./models/base").ResourceImage;
var ResourceBooking = require("./models/base").ResourceBooking;
var ClientEmployee = require("./models/base").ClientEmployee;
var CreditEntry = require("./models/base").CreditEntry;
var CreditUsed = require("./models/base").CreditUsed;
var Schedule = require("./models/base").Schedule;
var User = require("./models/base").User;
var Visit = require("./models/base").Visit;

var ParkingLots = require("./models/base").ParkingLots;
var ParkingSpots = require("./models/base").ParkingSpots;
var ParkingBookedSpots = require("./models/base").ParkingBookedSpots;
var ParkingBookings = require("./models/base").ParkingBookings;

var services = require("./services").service;
var adminService = require("./admin").service;
var mailsService = require("./mails").service;

var aprilfirst = utils.moment("2023-04-01").format("YYYY-MM-DD")



var service = {};

service.listBookings = async (data) => {
  try {
    log.write("BookingService ::: listBookings :: data : ", data);
    var where = { companyId: data.companyId, refNo: { $ne: null } };
    var whereoffice={};
    if (data.filters.role && data.filters.role != "") {
      where["role"] = data.filters.role;
    }
    if (data.filters.clientId && data.filters.clientId != "") {
      where.clientId = data.filters.clientId;
    }
    if (data.filters.officeId && data.filters.officeId != "") {
      where.officeId = data.filters.officeId;
    }
    if (data.filters.status && data.filters.status != "") {
      where.status = data.filters.status;
    }
    var statusesAnd = [];
    var excludeStatuses = {};
    if (data.filters.statuses && data.filters.statuses.length) {
      statusesAnd.push({ $in: data.filters.statuses });
    }
    if (data.filters.excludeStatuses && data.filters.excludeStatuses.length) {
      statusesAnd.push({ $notIn: data.filters.excludeStatuses });
    }
    if (statusesAnd.length) {
      where.status = { $and: statusesAnd };
    }
    if (data.filters.buildingIds && data.filters.buildingIds.length) {
      whereoffice["$office.buildingId$"] = { $in: data.filters.buildingIds };
    }
    var whereContractDesk ={};
    if (data.filters.deskType && data.filters.deskType.length) {
    whereContractDesk["$contract.deskType$"] = {
      $in: data.filters.deskType
    };    
    }
    if (data.filters.contractKind && data.filters.contractKind.length) {
      whereContractDesk["$contract.kind$"] = {
        $in: data.filters.contractKind
      };    
    }
    if (data.filters.contractTerm && data.filters.contractTerm.length) {
      whereContractDesk["$contract.term$"] = {
        $in: data.filters.contractTerm
      };    
    }

    var whereClient = {};
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.company")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.email")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.phone")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("refNo")), {
          $like: query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`bookings`.`id`")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`bookings`.`offices`")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      whereClient["$and"] = { $or: $or };
    }
    // whereContractDesk["$contract.deskType$"] = {
    //   $in: ["FixedDesk", "FlexiDesk", "PrivateOffice", "EnterpriseOffice"],
    // };

    log.write("whereeeee :::: ", where);

    var bookings = await Booking.findAll({
      where: where,
      include: [
      //  { as: "invoices", model: Invoice, attributes: ["id","type","startDate"],},
        {
          as: "office",
          model: Office,
          where:whereoffice,
          attributes: ["id", "name", "floor","buildingId"],
          include: [
            {
              as: "building",
              model: Building,
              attributes: ["id", "name", "address"],
            },
          ],
        },
      //  { as: "invoices", model: Invoice, attributes: ["id","type","startDate"],},
        {
          as: "client",
          model: Client,
          where: whereClient,
          attributes: ["name", "email", "phone", "company"],
        },
        { as: "contract", model: Contract,where:whereContractDesk, attributes: ["rent","security", "deskType", 'kind', 'term', 'effectiveDate'] },
        { as: "invoices", model: Invoice, attributes: ["id","type","startDate"], 
            //order: [["id", "desc"]],
          },
      ],
      offset: data.offset,
      limit: data.limit,
      order: [["id", "desc"],["reserved", "desc"],[{model: Invoice},"id", "desc"]],
    });
    log.write(
      "BookingService ::: listBookings :: bookings count : " + bookings.length
    );
    if (data.filters.getExitRequest) {
      for (var i = 0; i < bookings.length; i++) {
        bookings[i] = bookings[i].toJSON();
        bookings[i].exitRequest = await ExitRequest.findOne({
          attributes: ["fcpStatus"],
          where: { id: bookings[i].exitRequestId },
        });
      }
    }
    return bookings;
  } catch (e) {
    log.write("BookingService ::: listBookings :: exception : ", e);
    throw e;
  }
};
service.searchBookings = async (data) => {
  try {
    log.write("BookingService ::: searchBookings :: data : ", data);
    var where = {};
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("refNo")), {
          $like: query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.company")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.email")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.phone")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      where["$and"] = { $or: $or };
    }
    if (data.filters.withdue) {
      where["due"] = { $gt: 0 };
    }
    var results = await Booking.findAll({
      where: where,
      include: [
        {
          as: "client",
          model: Client,
          attributes: ["company", "name", "email", "phone"],
        },
        { as: "contract", model: Contract, attributes: ["status"] },
        { as: "office", model: Office, attributes: ["name"] },
      ],
      offset: data.offset || 0,
      limit: data.limit || 8,
      order: [["id", "desc"]],
    });
    log.write(
      "BookingService ::: searchBookings :: results count : " + results.length
    );
    var bookings = [];
    _.each(results, function (r) {
      bookings.push({
        id: r.id,
        company: r.client.company,
        name: r.client.name,
        refNo: r.refNo,
        office: r.office ? r.office.name : "",
        status: r.contract.status,
        due: r.due,
      });
    });
    return bookings;
  } catch (e) {
    log.write("BookingService ::: searchBookings :: exception : ", e);
    throw e;
  }
};
service.getBookings = async (data) => {
  try {
    log.write("BookingService ::: getBookings :: data : ", data);
    var where = {};
    where.locationId = data.locationId;
    if (data.officeId) {
      where.officeId = data.officeId;
    }
    if (data.clientId) {
      where.clientId = data.clientId;
    }
    var bookings = await Booking.findAll({
      where: where,
      include: [
        { as: "office", model: Office, attributes: ["name"] },
        { as: "client", model: Client, attributes: ["name", "company", "email", "phone"] },
        {
          as: "bookedDesks",
          model: BookedDesk,
          where: { status: { $in: ["InUse", "Booked"] } },
          include: [{ as: "desk", model: Desk, include: ["cabin"] }],
        },
      ],
      order: [["client", "name", "asc"]],
    });
    log.write(
      "BookingService ::: getBookings :: bookings count : " + bookings.length
    );
    var results = [];
    for (var i = 0; i < bookings.length; i++) {
      var booking = bookings[i];
      var cabins = [];
      _.each(booking.bookedDesks, function (d) {
        cabins.push({
          id: d.desk.cabin.id,
          name: d.desk.cabin.name,
        });
      });
      cabins = _.uniqBy(cabins, "id");
      var result = {
        id: booking.id,
        name: booking.client.name,
        refNo: booking.refNo,
        office: booking.office.name,
        // address: booking.office.address,
        cabins: cabins,
      };
      results.push(result);
    }
    return results;
  } catch (e) {
    log.write("BookingService ::: getBookings :: exception : ", e);
    throw e;
  }
};
service.saveBooking = async (data, username) => {
  try {
    log.write("BookingService ::: saveBooking :: data : ", data);
    var booking = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      await Booking.update(data, { where: { id: data.id } });
      booking = data;

      if (data.onBoarded) {
        await BookedDesk.update(
          {
            status: "InUse",
          },
          { where: { bookingId: data.id } }
        );
        service.updateFreeCredits({ bookingId: data.id });
      } else if (data.exited) {
        await BookedDesk.update(
          {
            status: "Released",
          },
          { where: { bookingId: data.id } }
        );
      }
    } else {
      booking = await Booking.create(data);
    }
    return booking;
  } catch (e) {
    log.write("BookingService ::: saveBooking :: exception : ", e);
    throw e;
  }
};

service.getBooking = async (id) => {
  try {
    log.write("BookingService ::: getBooking :: id : ", id);
    var booking = await Booking.findOne({
      where: { id: id },
      include: [
        "client",
        "company",
        {
          as: "contract",
          model: Contract,
          include: [
            {
              as: "additionalInvoices",
              required: false,
              model: ContractAdditionalInvoice,
              where: { status: "Published" },
              include: [
                {
                  as: "invoiceService",
                  required: false,
                  model: InvoiceService,
                },
              ],
            },
          ],
        },
        {
          as: "exitRequest",
          model: ExitRequest,
          where: { status: { $ne: "Cancelled" } },
          required: false,
          include: [
            "finalStatement",
            "exitForm",
            {
              as: "acrs",
              required: false,
              model: ExitAcr,
              where: { status: { $ne: "Archived" } },
            },
            {
              as: "comments",
              model: ExitComment,
              required: false,
              where: { status: { $ne: "Archived" } },
            },
            {
              as: "deductions",
              model: ExitDeduction,
              required: false,
              where: { status: { $ne: "Archived" } },
            },
          ],
        },
        {
          as: "bookedDesks",
          model: BookedDesk,
          required: false,
          where: {
            $or: [
              { status: { $in: ["InUse", "Booked", "Releasing", "Reserved"] } },
              // { $and: [{ status: 'Released' }, { $lte: { ended: utils.moment().format('YYYY-MM-DD') } }] }
            ],
          },
          include: [
            {
              as: "desk",
              model: Desk,
              required: false,
              attributes: ["name"],
              include: [
                {
                  as: "cabin",
                  model: Cabin,
                  attributes: ["name"],
                  include: [
                    { as: "office", model: Office, attributes: ["id", "name"] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

   // console.log(" Booking by id database result ::: ", JSON.stringify(booking));
    booking = booking.toJSON();
    log.write("BookingService ::: getBooking :: booking : ", booking.contract);
    booking.location = await systemUtils.getOfficeLocation(booking.officeId);
    var desks = [];
    _.each(booking.bookedDesks, function (d) {
      if (
        (booking.status == "New" ||
          booking.status == "Booked" ||
          booking.status == "Active" ||
          booking.status == "Exiting") &&
        d.status != "Released"
      ) {
        desks.push({
          desk: d.desk && d.desk.name,
          cabin: d.desk && d.desk.cabin.name,
          office: d.desk && d.desk.cabin.office.name,
          price: d.price,
        });
      } else {
        desks.push({
          desk: d.desk && d.desk.name,
          cabin: d.desk && d.desk.cabin.name,
          office: d.desk && d.desk.cabin.office.name,
          price: d.price,
        });
      }
    });
    booking.futureContract = await Contract.findOne({
      where: {
        bookingId: booking.id,
        status: { $ne: "Cancelled" },
        effectiveDate: { $gte: booking.contract.effectiveDate },
      },
      include: [
        {
          as: "additionalInvoices",
          required: false,
          model: ContractAdditionalInvoice,
          where: { status: "Published" },
          include: ["invoiceService"],
        },
      ],
      order: [
        ['id', 'DESC'],
    ],
    });




    log.write(
      "BookingService ::: getBooking :: futureContract : " +
        booking.futureContract !=
        null
    );
    if (booking.futureContract) {
      log.write(
        "BookingService ::: getBooking :: futureContract : ",
        booking.futureContract.toJSON()
      );
      if (
        utils
          .moment(booking.futureContract.effectiveDate)
          .isSameOrBefore(utils.moment()) &&
        booking.futureContract.status == "Confirmed"
      ) {
        log.write(
          "BookingService ::: getBooking :: futureContract : is real future contract ... !!"
        );

        if (booking.futureContract.kind == "Contraction") {
          await BookedDesk.update(
            { status: "Released" },
            { where: { contractId: booking.contract.id } }
          );
          await BookedDesk.update(
            { status: "InUse", bookingId: booking.id },
            { where: { contractId: booking.futureContract.id } }
          );
        } else if (booking.futureContract.kind == "ReLocation") {
          await BookedDesk.update(
            { status: "Released" },
            { where: { contractId: booking.contract.id } }
          );
          await BookedDesk.update(
            { status: "InUse" },
            { where: { contractId: booking.futureContract.id } }
          );
        } else if (booking.futureContract.kind == "Expansion") {
          await BookedDesk.update(
            { status: "InUse" },
            { where: { contractId: booking.futureContract.id } }
          );
        }

        Booking.update(
          { contractId: booking.futureContract.id },
          { where: { id: booking.id } }
        );
        booking.bookedDesksd = await BookedDesk.findAll({
          where: {
            bookingId: booking.id,
            status: { $in: ["Booked", "InUse", "Releasing"] },
          },
        });

        booking.contract = booking.futureContract;
        booking.futureContract = null;
      }
    }

    var offices = _.uniq(_.map(desks, "office")).join(", ");
    if (booking.offices != offices) {
      Booking.update({ offices: offices }, { where: { id: booking.id } });
    }
    booking.cabinNames = _.uniq(_.map(desks, "cabin")).join(", ");
    booking.deskNames = _.map(desks, "desk").join(", ");

 booking.bookedDesksd = await BookedDesk.findAll({
      where: { bookingId: booking.id, status: { $in: ["Booked", "InUse", "Reserved", "Releasing"] },}, });
   // console.log("booked desks count:: ", booking.bookedDesksd)


    var desksCount = _.filter(booking.bookedDesksd
      //{ status: 'InUse' }
      ).length;

      let officeId;
      if(booking.bookedDesks.length){
        officeId = booking.bookedDesks[0].desk.cabin.office.id;
        log.write("\n\n\nBooked Desked office id :: ", booking.bookedDesks[0].desk.cabin.office.id)
        // booking.location = await systemUtils.getOfficeLocation(officeId);
        Booking.update({ officeId: officeId }, { where: { id: booking.id } });
      }

    log.write("Desks=0");
    log.write("DesksCount::" + desksCount + " -- Desks " + booking.desks+":::"+JSON.stringify(booking.bookedDesksd));
    if (booking.desks != desksCount) {
      Booking.update({ desks: desksCount }, { where: { id: booking.id } });
    }
    if (booking.type = 'EnterpriseOffice') {

      Booking.update({ desks: desksCount }, { where: { id: booking.id } });
    }
    if (booking.exitRequest && booking.exitRequest.finalStatementId) {
      booking.exitRequest.finalStatement = await systemUtils.getFile(
        booking.exitRequest.finalStatementId
      );
    }
    if (booking.contract.agreementId) {
      booking.contract.agreement = await systemUtils.getFile(
        booking.contract.agreementId
      );
    }
    if (booking.contract.signedAgreementId) {
      booking.contract.signedAgreement = await systemUtils.getFile(
        booking.contract.signedAgreementId
      );
    }
    if (booking.client.panCardId) {
      booking.client.panCard = await systemUtils.getFile(
        booking.client.panCardId
      );
    }
    if (booking.client.companyRegistrationId) {
      booking.client.companyRegistration = await systemUtils.getFile(
        booking.client.companyRegistrationId
      );
    }
    if (booking.client.gstRegistrationId) {
      booking.client.gstRegistration = await systemUtils.getFile(
        booking.client.gstRegistrationId
      );
    }
//console.log("Booking by id return :::: ", booking)
    return booking;
  } catch (e) {
    log.write("BookingService ::: getBooking :: exception : ", e);
    throw e;
  }
};
service.getBookingExitRequest = async (id) => {
  try {
    log.write("BookingService ::: getBookingExitRequest :: id : ", id);
    var booking = await Booking.findOne({
      where: { id: id },
      attributes: ["id"],
      include: [
        {
          as: "exitRequest",
          model: ExitRequest,
          where: { status: { $ne: "Cancelled" } },
          required: false,
          include: [
            "finalStatement",
            "exitForm",
            {
              as: "acrs",
              required: false,
              model: ExitAcr,
              where: { status: { $ne: "Archived" } },
            },
            {
              as: "comments",
              model: ExitComment,
              required: false,
              where: { status: { $ne: "Archived" } },
            },
          ],
        },
      ],
    });
    booking = booking.toJSON();

    if (booking.exitRequest && booking.exitRequest.finalStatementId) {
      booking.exitRequest.finalStatement = await systemUtils.getFile(
        booking.exitRequest.finalStatementId
      );
    }

    return booking;
  } catch (e) {
    log.write("BookingService ::: getBookingExitRequest :: exception : ", e);
    throw e;
  }
};
service.getInvoices = async (id) => {
  try {
    log.write("BookingService ::: getInvoices :: id : ", id);
    var resourceBookings = await ResourceBooking.findAll({
      attributes: ["bookingId"],
      where: { parentBookingId: id, status: { $ne: "Cancelled" } },
    });
    var bookingIds = [id];
    bookingIds = bookingIds.concat(_.map(resourceBookings, "bookingId"));

    log.write("BookingService ::: getInvoices :: bookingIds : ", bookingIds);
    var invoices = await Invoice.findAll({
      where: {
        bookingId: { $in: bookingIds },
         isCancelled: 0,
      },
      include: ["pdf"],
      order: [
        [
          "id",
          //"date",
          "desc",
        ],
      ],
    });

    return invoices;
  } catch (e) {
    log.write("BookingService ::: getInvoices :: exception : ", e);
    throw e;
  }
};
service.getAllInvoices = async (data) => {
  try {
    log.write("BookingService ::: getInvoices :: id : ", data);
    var resourceBookings = await ResourceBooking.findAll({
      attributes: ["bookingId"],
      where: { status: { $ne: "Cancelled" }, date:{ $between: [data.startDate, data.endDate]} },
    });
    // var bookingIds = [id];
    // bookingIds = bookingIds.concat(_.map(resourceBookings, "bookingId"));

    // log.write("BookingService ::: getInvoices :: bookingIds : ", bookingIds);

    var whereoffice={};
    if (data.buildingIds && data.buildingIds.length) {
      whereoffice["$office.buildingId$"] = { $in: data.filters.buildingIds };
    }


    var invoices = await Invoice.findAll({
      where: {
        date:{ $between: [data.startDate, data.endDate]},
	isCancelled: 0,
        "$booking.client.company$": {$like: "%"+data.search+"%"}
        // company: data.search
        // bookingId: { $in: bookingIds },
        // isCancelled: 0,
      },
      include: ["pdf", "parkingPdf", "items", 
      { as: "booking", model: Booking, attributes: ["id","sendInvoice"],
      include: [ 
        {
          as: "office",
          model: Office,
          where:whereoffice,
          attributes: ["id", "name", "floor","buildingId"],
          include: [{as: "building", model: Building, attributes: ["id", "name", "address"], },],
        },
        {as: "contract", model: Contract, attributes: ["deskType","term"]},
        {as: "client", model: Client, attributes: ["company", "name", "email", "phone","gstNo","panNo"], include: [ 
          {as: "employees", model: ClientEmployee, attributes: ["name", "email", "phone"], where: { sendInvoice: 1 }, required: false
          },
        ] },
      ] 
  }
],
// limit: 10,
      order: [
        [
          "id",
          //"date",
          "desc",
        ],
      ],
    });

    return invoices;
  } catch (e) {
    log.write("BookingService ::: getAllInvoices :: exception : ", e);
    throw e;
  }
};
service.updateInvoiceStatus = async (data) =>{
  try{
    log.write("BookingService ::: getInvoices :: id : ", data);
    let invoices = data;
    if(data.id && data.isCorrect){
      invoices = await Invoice.update( { isCorrect: 1 },{ where: { id: data.id } });
    }
    if(data.id && data.isSent){
     invoices = await Invoice.update( { isSent: 1 },{ where: { id: data.id } });
    }

    return invoices;
  } catch (e) {
    log.write("BookingService ::: updateInvoiceStatus :: exception : ", e);
    throw e;
  }
}
service.getPayments = async (id) => {
  try {
    log.write("BookingService ::: getPayments :: id : ", id);
    var payments = await Payment.findAll({
      where: { bookingId: id, type: { $ne: "PgCharge" } },
      order: [["id", "desc"]],
    });

    return payments;
  } catch (e) {
    log.write("BookingService ::: getPayments :: exception : ", e);
    throw e;
  }
};
service.getContracts = async (id) => {
  try {
    log.write("BookingService ::: getContracts :: id : ", id);
    var _contracts = await Contract.findAll({
      where: { bookingId: id, status: { $ne: "Cancelled" } },
      include: [
        {
          as: "terms",
          model: ContractTerm,
          required: false,
          where: { status: "Published" },
        },
        {
          as: "additionalInvoices",
          required: false,
          model: ContractAdditionalInvoice,
          where: { status: "Published" },
          include: [
            { as: "invoiceService", required: false, model: InvoiceService },
          ],
        },
        {
          as: "bookedDesks",
          model: BookedDesk,
          attributes: ["started", "ended", "status", "price"],
          include: [
            {
              as: "desk",
              model: Desk,
              attributes: ["name"],
              include: [
                {
                  as: "cabin",
                  model: Cabin,
                  attributes: ["name"],
                  include: [
                    {
                      as: "office",
                      model: Office,
                      attributes: ["name"],
                      include: [
                        {
                          as: "building",
                          model: Building,
                          attributes: ["name"],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [["id", "asc"]],
    });

    var contracts = _(_contracts)
      .groupBy((x) => x.id)
      .map((value, key) => ({ id: key, contracts: value }))
      .value();

    _.each(contracts, function (c) {
      _.each(c.contracts, function (contract) {
        contract = contract.toJSON();
        var bookedDesks = [];
        _.each(contract.bookedDesks, function (bd) {
          // log.write("BookingService ::: getContracts : bookedDesk : ", bd);
          bookedDesks.push({
            office:
              bd.desk.cabin.office.name +
              ", " +
              bd.desk.cabin.office.building.name,
            cabin: bd.desk.cabin.name,
            desk: bd.desk.name,
            status: bd.status,
            price: bd.price,
          });
        });
        delete contract.bookedDesks;

        var offices = _(bookedDesks)
          .groupBy((x) => x.office)
          .map((value, key) => ({ office: key, cabins: value }))
          .value();
        _.each(offices, function (office) {
          office.cabins = _(office.cabins)
            .groupBy((x) => x.cabin)
            .map((value, key) => ({ cabin: key, desks: value }))
            .value();

          _.each(office.cabins, function (cabin) {
            var desks = [];
            _.each(cabin.desks, function (desk) {
              desks.push({
                name: desk.desk,
                status: desk.status,
                price: desk.price,
              });
            });
            cabin.desks = desks;
          });
        });
        c.offices = offices;
        c.contract = c.contracts[0].toJSON();
        c.contract.desks = bookedDesks.length;
        delete c.contracts;
        delete c.contract.bookedDesks;
      });
    });

    for (var i = 0; i < contracts.length; i++) {
      var contract = contracts[i].contract;
      if (contract.signedAgreementId) {
        contract.signedAgreement = await systemUtils.getFile(
          contract.signedAgreementId
        );
      }
    }

    return contracts;
  } catch (e) {
    log.write("BookingService ::: getContracts :: exception : ", e);
    throw e;
  }
};
service.getResourceBookings = async (id) => {
  try {
    log.write("BookingService ::: getResourceBookings :: id : ", id);
    var resourceBookings = await ResourceBooking.findAll({
      where: {
        $or: [{ parentBookingId: id }, { bookingId: id }],
        status: { $ne: "Cancelled" },
      },
      include: ["resource", "creditUsed"],
    });

    return resourceBookings;
  } catch (e) {
    log.write("BookingService ::: getResourceBookings :: exception : ", e);
    throw e;
  }
};
service.getEmployees = async (clientId) => {
  try {
    log.write("BookingService ::: getEmployees :: clientId : ", clientId);
    var employees = await ClientEmployee.findAll({
      where: { clientId: clientId },
    });

    return employees;
  } catch (e) {
    log.write("BookingService ::: getEmployees :: exception : ", e);
    throw e;
  }
};
service.listBookingMails = async (data) => {
  try {
    log.write("BookingService ::: listBookingMails :: data : ", data);
    var mails = await Mail.findAll({
      where: { "$bookings.id$": data.filters.id },
      include: [{ as: "bookings", model: Booking, attributes: ["id"] }],
      subQuery: false,
      offset: data.offset,
      limit: data.limit,
      order: [["id", "desc"]],
    });

    return mails;
  } catch (e) {
    log.write("BookingService ::: listBookingMails :: exception : ", e);
    throw e;
  }
};
service.deleteBooking = async (id) => {
  try {
    log.write("BookingService ::: deleteBooking :: id : ", id);
    var result = await Booking.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("BookingService ::: deleteBooking :: exception : ", e);
    throw e;
  }
};

service.searchOffices = async (data) => {
  try {
    log.write("BookingService ::: searchOffices :: data : ", data);
    var sql =
      `SELECT  g.id buildingId, g.name building, g.address, g.lat, g.lng, g.locationId, l.name location,
          o.id, o.name office, o.carpetArea, c.id as cabinId,c.name cabin,c.deskType,c.deskSize, c.totalArea, c.usedArea, d.id as deskId, d.name desk,bd.status, bd.ended, b.id bookingId 
          FROM buildings g
          left join offices o on o.buildingId=g.id and g.active=1
          left join locations l on g.locationId=l.id 
          left join cabins c on c.officeId=o.id and o.active=1 and c.active=1
          left join desks d on d.cabinId=c.id and d.active=1
          left join booked_desks bd on bd.deskId = d.id and bd.status !='Released'
          left join bookings b on b.id = bd.bookingId
          where 1=1 and g.active=1 and o.active=1 and c.deskType='` +
      data.deskTypes[0] +
      `' `;
    if (data.officeId) {
      sql = sql + " and o.id=" + data.officeId;
    } else if (data.buildingId) {
      sql = sql + " and g.id=" + data.buildingId;
    } else if (data.locationId) {
      sql = sql + " and g.locationId=" + data.locationId;
    } else if (data.cityId) {
      sql = sql + " and l.cityId=" + data.cityId;
    }
    sql = sql + " and g.companyId=" + data.companyId;
    // if (data.hideSold) {
    //   sql = sql + " and b.id is null ";
    // }
    sql = sql + ` group by o.id, c.id, d.id order by d.id, c.id`;

    log.write("BookingService ::: searchOffices :: sql : " + sql);
    var results = await session.db.query(sql, {
      replacements: {
        deskTypes: data.deskTypes,
        startDate: utils.moment(data.startDate).toDate(),
      },
      type: Sequelize.QueryTypes.SELECT,
    });
    log.write(
      "BookingService ::: searchOffices :: results count : " + results.length
    );



    // log.write("BookingService ::: searchOffices :: results : ", results);
    var buildings = [];
    var __cabins = [];

    // ---------------  Building  -------------//
    var _buildings = _(results)
      .groupBy((x) => x.buildingId)
      .map((value, key) => ({
        id: key,
        name: value[0].building,
        lat: value[0].lat,
        lng: value[0].lng,
        address: value[0].address,
        locationId: value[0].locationId,
        location: value[0].location,
        offices: value,
      }))
      .value();

     log.write("BookingService ::: searchOffices :: _buildings : ", _buildings);


    // ---------------  Offices  -------------//
    var offices = [];
    _buildings.forEach((building) => {
      offices = [];
      var _offices = _(building.offices)
        .groupBy((x) => x.id)
        .map((value, key) => ({
          id: key,
          name: value[0].office,
          carpetArea: value[0].carpetArea,
          cabins: value,
        }))
        .value();

       log.write("BookingService ::: searchOffices :: _offices : ", _offices);


      // ---------------  Cabins  -------------//
      _offices.forEach((office) => {
        // log.write("BookingService ::: searchOffices :: office name : ", office.name);
        var _cabins = _(office.cabins)
          .groupBy((x) => x.cabinId)
          .map((value, key) => ({
            id: key,
            name: value[0].cabin,
            totalArea: value[0].totalArea,
            usedArea: value[0].usedArea,
            deskType: value[0].deskType,
            deskSize: value[0].deskSize,
            desks: value,
          }))
          .value();

         log.write("BookingService ::: searchOffices :: _cabins : ", _cabins);



        // ---------------  Desks  -------------//
        var cabins = [];
        __cabins = [];
        _cabins.forEach((cabin) => {
          var desks = [];
          if (cabin.id) {
            // log.write("BookingService ::: searchOffices ::desks : ", cabin.desks.length);
            _.each(cabin.desks, function (d) {
              // log.write("BookingService ::: searchOffices :: desk ID : " + d.deskId);
              if (d.deskId) {
                desks.push({
                  id: d.deskId,
                  officeId: office.id,
                  cabinId: d.cabinId,
                  deskType: cabin.deskType,
                  name: d.desk,
                  status:
                    d.status &&
                    d.status != "Released" &&
                    d.status != "Releasing"
                      ? d.status
                      : "Available",
                  releaseDate: d.ended
                    ? utils.moment(d.ended).format("MMM DD, YYYY")
                    : null,
                });
              }
            });
            // log.write("BookingService ::: searchOffices :: desks length : " + desks.length);
            cabin.total = desks.length;
            var available = _.filter(desks, { status: "Available" });
            cabin.available = available.length;
            if (data.hideSold) {
              cabin.desks = available;
            } else if (data.deskTypes[0] != "EnterpriseOffice") {
              cabin.desks = desks;
            } else {
              cabin.desks = [];
            }
            // log.write("BookingService ::: searchOffices :: cabin : ", cabin);
            __cabins.push(cabin);
            if (
              !data.hideSold ||
              (data.deskTypes[0] == "EnterpriseOffice" && cabin.total)
            ) {
              if (data.isPrivate && cabin.available == cabin.total) {
                cabins.push(cabin);
              } else if (!data.isPrivate) {
                cabins.push(cabin);
              }
            }
            log.write(
              "BookingService ::: searchOffices :: cabins : ",
              cabins.length
            );
          }
        });

        // log.write("BookingService ::: searchOffices :: building : ", building);
        // ---------------  Filters  -------------//
        cabins = _.filter(cabins, function (c) {
          return c.available > 0;
        });
        office.cabins = __cabins.length;
        office.usedArea = _.sumBy(__cabins, "usedArea") || 0;
        office.availableArea = office.carpetArea - office.usedArea;
        office.total = _.sumBy(__cabins, "total");
        office.available = _.sumBy(__cabins, "available");
        delete office.cabins;
        log.write("BookingService ::: searchOffices :: office : ", office);
        office.cabins = cabins;
        if (
          office.cabins.length ||
          (data.deskTypes[0] == "EnterpriseOffice" && office.total)
        ) {
          offices.push(office);
        }
      });

      building.offices = _.clone(offices);
      building.carpetArea = _.sumBy(building.offices, "carpetArea");
      building.usedArea = _.sumBy(building.offices, "usedArea");
      building.availableArea = building.carpetArea - building.usedArea;
      building.total = _.sumBy(building.offices, "total");
      building.available = _.sumBy(building.offices, "available");

      log.write("BookingService ::: searchOffices :: building : ", building);
      log.write("BookingService ::: searchOffices :: buildings : ", buildings);
      // log.write("BookingService ::: searchOffices :: building.offices.length : " + building.offices.length);
      if (
        !data.hideSold ||
        (data.deskTypes[0] == "EnterpriseOffice" && building.total)
      ) {
        buildings.push(building);
      }
    });

    // log.write("BookingService ::: searchOffices :: buildings.length : " + buildings.length);
    for (var j = 0; j < buildings.length; j++) {
      var building = buildings[j];
      // log.write("BookingService ::: searchOffices :: buildings.offices.length : " + building.offices.length);
      for (var i = 0; i < building.offices.length; i++) {
        var location = await systemUtils.getLocation(
          building.offices[i].locationId
        );
        building.offices[i].location = location;
        // log.write("BookingService ::: searchOffices :: office name : " + building.offices[i].name);
        var _pricings = await OfficePricing.findAll({
          where: {
            officeId: building.offices[i].id,
            deskType: { $in: data.deskTypes },
            active: 1,
          },
          include: [
            { as: "facilitySet", model: FacilitySet, include: ["facilities"] },
          ],
        });
        // log.write("BookingService ::: searchOffices :: _pricings.length : " + _pricings.length);
        if (_pricings.length) {
          var pricings = [];
          _.each(_pricings, function (p) {
            log.write("BookingService ::: searchOffices :: p : ", p.toJSON());
            if (
              (p.deskType != "EnterpriseOffice" &&
                p.minPerson <= data.desks &&
                p.maxPerson >= data.desks) ||
              p.deskType == "EnterpriseOffice"
            ) {
              var facilities = p.facilitySet.facilities;
              facilities = _.map(facilities, "name");
              facilities = p.facilitySet.name + " - " + facilities.join(",");
              pricings.push({
                price: p.price,
                deskType: p.deskType,
                duration: p.duration,
                facilitySetId: p.facilitySetId,
                facilities: facilities,
                value: p.price + "," + p.facilitySetId,
              });
            }
          });
          building.offices[i].pricings = pricings;
        }

        _.each(building.offices[i].cabins, function (c) {
          var prices = _.filter(pricings, { deskType: c.deskType });
          prices = _.orderBy(prices, ["price"], ["asc"]);
          if (prices.length == 1) {
            c.price = prices[0].price;
          } else if (prices.length > 1) {
            c.minPrice = prices[0].price;
            c.maxPrice = prices[prices.length - 1].price;
          }
        });
      }
    }

    return buildings;
    // return results;
  } catch (e) {
    log.write("BookingService ::: searchOffices :: exception : ", e);
    throw e;
  }
};
service.searchParking = async (data) => {
  try {
    log.write("BookingService ::: searchParking :: data : ", data);
    // left join booked_desks bd on bd.deskId = d.id and bd.status !='Released'
    // left join bookings b on b.id = bd.bookingId
//     var sql =
//      `SELECT  bd.id, bd.name building, pl.id as LotId, pl.name LotName, 
//       pl.productType, pl.size,
//       ps.id SpotId, ps.name SpotName, ps.ParkingLotId
//                 FROM buildings bd
//                 join parking_lots pl on pl.buildingid=bd.id and pl.active=1 and bd.active=1
//                 join parking_spots ps on ps.parkingLotId=pl.id and ps.active=1
//                 where 1=1`;

//     if (data.buildingId) {
//       sql = sql + " and bd.id=" + data.buildingId;
//     } else if (data.locationId) {
//       sql = sql + " and bd.locationId=" + data.locationId;
//     } else if (data.cityId) 
//     sql = sql + " and bd.companyId=" + data.companyId;
//     // if (data.hideSold) {
//     //   sql = sql + " and b.id is null ";
//     // }
//    // sql = sql + ` group by o.id, c.id, d.id order by d.id, c.id`;

//     log.write("BookingService ::: searchParking :: sql : " + sql);
//     var results = await session.db.query(sql, {
//       replacements: {
//         deskTypes: data.deskTypes,
//         startDate: utils.moment(data.startDate).toDate(),
//       },
//       type: Sequelize.QueryTypes.SELECT,
//     });

    let buildindwhere = {  active: 1}
    if (data.buildingId) {
      buildindwhere.buildingId = data.buildingId;
    } else if (data.locationId) {
      buildindwhere.locationId = data.locationId;
    }
    buildindwhere.$and = [ 
      Sequelize.literal(
        '`parkingLots->parkingSpots`.`id`' +` NOT IN (select parkingSpotId from parking_booked_spots where status != 'Released')`),
      ];

    var parkings = []
    parkings = await Building.findAll({
      where: buildindwhere, 
      attributes: ["id", "name", "status", "locationId"],
      include: [ { as: "parkingLots",required: true, model: ParkingLots, 
                   include: [{as:"parkingSpots", model: ParkingSpots, 
                  //  attributes: [['id', 'parkingSpotId'], 'name', 'parkingLotId', 'active'],
                  //  where: {
                  //   $and: [ 
                  //     Sequelize.literal(`
                  //     parkingLots->parkingSpots.id NOT IN (select parkingSpotId from parking_booked_spots where status != 'Released')`),
                  //     ]
                  //   },
                   required: true}] },],
    });

    // if(parkings){
      var pkg =[]
      console.log("Building parking slots ::: ", JSON.stringify(parkings[0].parkingLots));
      parkings = JSON.parse(JSON.stringify(parkings))

      console.log(parkings)
      var parking = [];
      parkings.forEach((parking)=>{

        parking.total = parking.parkingLots.length

        // var pkg = parking
        // pkg.forEach((lot) =>{
        //   lot.totalSpots = lot.parkingSpots.length
        // })

      })

      // var tsd = []
      // for(let i=0;i<parkings.length;i++){

      //   parkings[i].total = parkings[i].parkingLots.length

      // }
    // }

// parkings[0].total=100;
    return parkings;
    // return results;
  } catch (e) {
    log.write("BookingService ::: searchOffices :: exception : ", e);
    throw e;
  }
};
service.createBooking = async (data, username) => {
  try {
    log.write("BookingService ::: createBooking :: data : ", data);
    var client = await service.saveClient(data.client, username);
    data.contract.date = new Date();
    data.contract.effectiveDate = utils
      .moment(data.started)
      .add(9, "hours")
      .toDate();
    data.contract.kind = "NewBooking";
    data.contract.type = data.contract.deskType;
    data.contract.status = data.contract.status || "Draft";
    data.contract.contractPeriod = 11;
    data.contract.desks = data.desks.length;
    var contract = await service.saveContract(data.contract, username);

    var booking = {};
    booking.status = "New";
    booking.offices = data.offices;
    booking.companyId = data.companyId || 1;
    booking.locationId = data.locationId;
    booking.officeId = data.officeId;
    booking.contractId = contract.id;
    booking.clientId = client.id;
    booking.reserved = new Date();
    booking.started = utils.moment(data.started).format("YYYY-MM-DD");
    booking.ended = data.ended
      ? utils.moment(data.ended).format("YYYY-MM-DD")
      : null;
    booking.cabins = data.cabins;
    booking.desks = data.desks.length;
    booking.updated = new Date();
    booking.updatedBy = username || "system";

    booking = await Booking.create(booking);
    var company = await systemUtils.getCompany(booking.companyId);
    // booking.set("refNo", "BOOKING_" + utils.moment().format("YY") + (100000 + booking.id));
    booking.set(
      "refNo",
      company.shortName + "BK" + utils.moment().format("YY") + "-" + booking.id
    );
    await booking.save();

    contract.set("bookingId", booking.id);
    contract.save();

    systemUtils.addActivity(
      {
        activity: "NewBooking",
        update:
          "New Booking for " +
          (client.company || client.name) +
          " is created for " +
          booking.offices +
          " for rent of " +
          contract.rent +
          ", moving on " +
          utils.moment(booking.started).format("MMM DD, YYYY"),
        companyId: booking.companyId,
      },
      username
    );

    if (
      (!data.desks || data.desks.length == 0) &&
      data.selectedCabins &&
      data.selectedCabins.length
    ) {
      if (data.selectedCabins.desks && data.selectedCabins.desks.length) {
        data.desks = data.selectedCabins.desks;
      } 
      else if(data.selectedCabins[0].deskType = 'EnterpriseOffice'){
        
        
    log.write("Createbooking :: EnterpriseOffice :: cabin id :", data.selectedCabins);

    var selectedCabinsIn =[]
    for (var i = 0; i < data.selectedCabins.length; i++) {
      selectedCabinsIn.push(data.selectedCabins[i].id);

  }
      data.desks = await Desk.findAll({
          where: {
            cabinId: {in: selectedCabinsIn},
            
          },
        });

        log.write("Createbooking :: EnterpriseOffice :: desks :", data.desks);
      
      }
      else {
        for (var i = 0; i < data.selectedCabins.length; i++) {
          var desk = await adminService.saveDesk({
            name: "Default Desk",
            cabinId: data.selectedCabins[i].id,
          });
          desk.area = data.selectedCabins[i].totalArea;
          data.desks.push(desk);

          // log.write("BookingService ::: createBooking :: update selectedCabin : ", data.selectedCabins[i]);
          await Cabin.update(
            { usedArea: data.selectedCabins[i].totalArea },
            { where: { id: parseInt(data.selectedCabins[i].id) } }
          );
        }
      }
    }
    for (var i = 0; i < data.desks.length; i++) {
      var d = data.desks[i];
      var desk = {
        bookingId: booking.id,
        deskId: d.id,
        area: d.area,
        contractId: contract.id,
        facilitySetId: d.facilitySetId,
        price: d.price,
        status: "Reserved",
        started: utils.moment(data.started).format("YYYY-MM-DD"),
        ended: data.ended
          ? utils.moment(data.ended).format("YYYY-MM-DD")
          : null,
      };
      // log.write("BookingService ::: createBooking :: desk : ", desk);
      desk = await service.saveBookedDesk(desk, username);
    }

    if (data.contract.status == "Confirmed") {
      service.raiseBookingInvoices(booking.id);
      if (!data.contract.agreementId) {
        if(utils.generateAgreementPdf){
        //service.generateAgreementPdf(booking.id, true);
      }
      } else {
        service.sendBookingConfirmation(booking.id);
      }
    }

    var schedule = {
      bookingId: booking.id,
      type: "OnBoarding",
      from: utils
        .moment(booking.started)
        .clone()
        .set({ hours: 9, minutes: 0 })
        .toDate(),
      status: "Scheduled",
      newBooking: true,
    };
    schedule.to = utils.moment(schedule.from).clone().add(1, "hours").toDate();
    service.saveSchedule(schedule);

    booking = booking.toJSON();
    booking.client = client.toJSON();
    return booking;
  } catch (e) {
    log.write("BookingService ::: createBooking :: exception : ", e);
    throw e;
  }
};
service.createParkingBooking = async (data, username) => {
  try {
    log.write("BookingService ::: createBooking :: data : ", data);
    if(!data.client.id){
      var client = await service.saveClient(data.client, username);
    }


    var booking = {};
    booking.clientId = data.client.id?data.client.id:client.id;
    booking.locationId = data.locationId;
    booking.status = "Draft";
    booking.reserved = new Date();
    booking.started = utils.moment(data.started).format("YYYY-MM-DD");
    booking.spots = data.ParkingSpots.length;
    booking.lots = data.Lots;
    booking.carPrice = data.contract.carPrice;
    booking.bikePrice = data.contract.bikePrice;
    booking.discount = data.contract.discount;
    booking.companyId = data.companyId || 1;
    booking.bookingId = data.client.booking.id?data.client.booking.id:null;
    booking.updated = new Date();
    booking.updatedBy = username || "system";
    booking.note = data.contract.note || "";
    
    console.log("booking :: booking ::", booking)
    
    booking = await ParkingBookings.create(booking);
    var company = await systemUtils.getCompany(booking.companyId);
    booking.set("refNo", "BOOKING_" + utils.moment().format("YY") + (100000 + booking.id));
    booking.set(
      "refNo",
      company.shortName + "PK" + utils.moment().format("YY") + "-" + booking.id
    );
    await booking.save();


    // systemUtils.addActivity(
    //   {
    //     activity: "NewBooking",
    //     update:
    //       "New Booking for " +
    //       (client.company || client.name) +
    //       " is created for " +
    //       booking.offices +
    //       " for rent of " +
    //       contract.rent +
    //       ", moving on " +
    //       utils.moment(booking.started).format("MMM DD, YYYY"),
    //     companyId: booking.companyId,
    //   },
    //   username
    // );

    for (var i = 0; i < data.ParkingSpots.length; i++) {
      var d = data.ParkingSpots[i];
      var spots = {
        ParkingBookingId: booking.id,
        parkingSpotId: d.id,
        parkingLotId: d.parkingLotId,
        status: "Reserved",
        started: utils.moment(data.started).format("YYYY-MM-DD"),
      };
      // log.write("BookingService ::: createBooking :: desk : ", desk);
      spots = await service.saveBookedParkingSpots(spots, username);
      booking.BookedSpots=spots;
    }
    var parkingLots = await ParkingLots.findAll({
      required:true,
      include: [
        { as: "parkingBookedSpots", model: ParkingBookedSpots, 
        where:{ParkingBookingId: booking.id}, required:true },
        // { as: "parkingSpots", model: ParkingSpots, required:true },
      ],
    });
    let cars = 0;
    let bikes = 0;
    parkingLots.forEach((lot)=>{
      if(lot.productType == "CarParking"){
          cars+=lot.parkingBookedSpots.length;
      }
      else if(lot.productType == "BikeParking"){
        bikes+=lot.parkingBookedSpots.length;
      }
    });
    console.log("parkingLots :: parkingLots ::", JSON.stringify(parkingLots))
    let bookings = await ParkingBookings.update({cars:cars, bikes:bikes}, { where: { id: booking.id } })
    // booking = booking.toJSON();
    // booking.client = client.toJSON();
    return booking;
  } catch (e) {
    log.write("BookingService ::: createBooking :: exception : ", e);
    throw e;
  }
};
service.listParkingBookings = async (data) => {
  try {
    log.write("BookingService ::: listBookings :: data : ", data);
    var where = { companyId: data.companyId, refNo: { $ne: null } };
    var whereoffice={};
    // if (data.filters.role && data.filters.role != "") {
    //   where["role"] = data.filters.role;
    // }
    // if (data.filters.clientId && data.filters.clientId != "") {
    //   where.clientId = data.filters.clientId;
    // }
    // if (data.filters.officeId && data.filters.officeId != "") {
    //   where.officeId = data.filters.officeId;
    // }
    // if (data.filters.status && data.filters.status != "") {
    //   where.status = data.filters.status;
    // }
    var statusesAnd = [];
    var excludeStatuses = {};
    // if (data.filters.statuses && data.filters.statuses.length) {
    //   statusesAnd.push({ $in: data.filters.statuses });
    // }
    // if (data.filters.excludeStatuses && data.filters.excludeStatuses.length) {
    //   statusesAnd.push({ $notIn: data.filters.excludeStatuses });
    // }
    // if (statusesAnd.length) {
    //   where.status = { $and: statusesAnd };
    // }
    if (data.filters.buildingIds && data.filters.buildingIds.length) {
      whereoffice["$office.buildingId$"] = { $in: data.filters.buildingIds };
    }
    var whereContractDesk ={};
    if (data.filters.deskType && data.filters.deskType.length) {
    whereContractDesk["$contract.deskType$"] = {
      $in: data.filters.deskType
    };    
    }

    var whereClient = {};
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.company")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.email")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.phone")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("refNo")), {
          $like: query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`bookings`.`id`")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`bookings`.`offices`")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      whereClient["$and"] = { $or: $or };
    }
    // whereContractDesk["$contract.deskType$"] = {
    //   $in: ["FixedDesk", "FlexiDesk", "PrivateOffice", "EnterpriseOffice"],
    // };

    log.write("whereeeee :::: ", where);

    var bookings = await ParkingBookings.findAll({
      where: where,
      include: [
      // //  { as: "invoices", model: Invoice, attributes: ["id","type","startDate"],},
      //   {
      //     as: "office",
      //     model: Office,
      //     where:whereoffice,
      //     attributes: ["id", "name", "floor","buildingId"],
      //     include: [
      //       {
      //         as: "building",
      //         model: Building,
      //         attributes: ["id", "name", "address"],
      //       },
      //     ],
      //   },
      // //  { as: "invoices", model: Invoice, attributes: ["id","type","startDate"],},
        {
          as: "client",
          model: Client,
          where: whereClient,
          attributes: ["name", "email", "phone", "company"],
        },
        // { as: "contract", model: Contract,where:whereContractDesk, attributes: ["rent","deskType"] },
        // { as: "invoices", model: Invoice, attributes: ["id","type","startDate"], 
            //order: [["id", "desc"]],
          // },
      ],
      offset: data.offset,
      limit: data.limit,
      order: [["id", "desc"],["reserved", "desc"],
      // [{model: Invoice},"id", "desc"]
    ],
    });
    log.write(
      "BookingService ::: listBookings :: bookings count : " + bookings.length
    );
    // if (data.filters.getExitRequest) {
    //   for (var i = 0; i < bookings.length; i++) {
    //     bookings[i] = bookings[i].toJSON();
    //     bookings[i].exitRequest = await ExitRequest.findOne({
    //       attributes: ["fcpStatus"],
    //       where: { id: bookings[i].exitRequestId },
    //     });
    //   }
    // }
    return bookings;
  } catch (e) {
    log.write("BookingService ::: listBookings :: exception : ", e);
    throw e;
  }
};
service.generateAgreementPdf = async (bookingId, confirmed) => {
  try {
    var booking = await service.getBooking(bookingId);
    var user = await systemUtils.getUser(booking.contract.approvedBy);
    var data = {
      authorizedPerson: user ? user.name || "Juliet" : "Juliet",
      companyLogo: booking.company.logo,
      companyName: booking.company.name,
      companyTradeName: booking.company.tradeName,
      companyAddress: booking.company.address,
      companyEmail: booking.company.email,
      clientCompanyName: booking.client.company || booking.client.name,
      clientName: booking.client.name,
      clientCompanyAddress: booking.client.address || "India",
      clientEmail: booking.client.email || "",
      officeAddress: booking.offices + ", " + booking.location,
      city: booking.company.city,
      contractDate: utils.moment(booking.contract.date).format("DD-MM-YYYY"),
      moveInDate: utils.moment(booking.started).format("DD-MM-YYYY"),
      rent: booking.contract.rent,
      rentInWords: utils.toWords(booking.contract.rent),
      deposit: booking.contract.security,
      depositInWords: utils.toWords(booking.contract.security),
      noticePeriod: booking.contract.noticePeriod * 30,
      noticePeriodInWords: utils.toWords(booking.contract.noticePeriod * 30),
      lockInPeriod: booking.contract.lockIn,
      cabinNames: booking.cabinNames,
      desksCount: booking.desks,
    };
    log.write("BookingService ::: generateAgreementPdf :: data : ", data);
    var tmpFile = await services.parseContent("pdfs/agreement.html", data);
    var doc = await services.createDoc("AGREEMENT_" + booking.refNo + ".pdf");
    await services.generatePdf(tmpFile, path.basename(doc.file));
    Contract.update(
      { agreementId: doc.id },
      { where: { id: booking.contract.id } }
    );
    log.write("BookingService ::: generateAgreementPdf :: doc : ", doc);

    if (confirmed) {
      service.sendBookingConfirmation(bookingId);
    }
    return doc;
  } catch (e) {
    log.write("BookingService ::: generateAgreementPdf :: exception : ", e);
    throw e;
  }
};

service.listResourceBookings = async (data) => {
  try {
    log.write("BookingService ::: listResourceBookings :: data : ", data);
    var where = { companyId: data.companyId };
    if (data.filters.status && data.filters.status != "") {
      where.status = data.filters.status;
    } else {
      where.status = { $ne: "Cancelled" };
    }
    if (data.filters.statuses && data.filters.statuses.length) {
      where.status = { $in: data.filters.statuses };
    }
    if (data.filters.clientId) {
      where.clientId = data.filters.clientId;
    }
    if (data.filters.buildingIds && data.filters.buildingIds.length) {
      where["$resource.office.buildingId$"] = { $in: data.filters.buildingIds };
    }
    if (data.filters.from && data.filters.to) {
      where["from"] = {
        $between: [
          utils.moment(data.filters.from).toDate(),
          utils.moment(data.filters.to).toDate(),
        ],
      };
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("resource.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("resource.type")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.name")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.company")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.email")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("client.phone")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("refNo")), {
          $like: query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`resource->office`.`name`")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      where["$and"] = { $or: $or };
    }
    var bookings = await ResourceBooking.findAll({
      where: where,
      include: [
        {
          as: "client",
          model: Client,
          attributes: ["name", "email", "phone", "company"],
        },
        { as: "creditUsed", model: CreditUsed, attributes: ["credits"] },
        {
          as: "resource",
          model: Resource,
          include: [
            {
              as: "office",
              model: Office,
              attribute: ["name", "buildingId"],
              include: [
                {
                  as: "building",
                  model: Building,
                  attributes: ["id", "name", "locationId", "address"],
                },
              ],
            },
          ],
        },
      ],
      offset: data.offset,
      limit: data.limit,
      order: [["id", "desc"]],
    });
    log.write(
      "BookingService ::: listResourceBookings :: bookings count : " +
        bookings.length
    );

    return bookings;
  } catch (e) {
    log.write("BookingService ::: listResourceBookings :: exception : ", e);
    throw e;
  }
};
service.searchResources = async (data) => {
  try {
    log.write("BookingService ::: searchResources :: data : ", data);
    var whereSql = " and g.companyId=" + data.companyId;

    if (data.officeId) {
      whereSql = whereSql + " and o.id = " + data.officeId;
    } else if (data.locationId) {
      whereSql = whereSql + " and g.locationId = " + data.locationId;
    } else if (data.cityId) {
      whereSql = whereSql + " and l.cityId = " + data.cityId;
    }
    if (data.subUnits) {
      whereSql =
        whereSql +
        " and r.subUnits >= " +
        data.subUnits +
        " and r.subUnits < " +
        (parseInt(data.subUnits) + 6);
    }
    if (data.subUnitType) {
      whereSql = whereSql + " and r.subUnitType = '" + data.subUnitType + "'";
    }
    if (data.style) {
      whereSql = whereSql + " and r.style = '" + data.style + "'";
    }
    if (data.facilities && data.facilities.length) {
      whereSql = whereSql + " and (";
      _.each(data.facilities, function (f) {
        whereSql = whereSql + " r.facilities like '%" + f + "%' or ";
      });
      whereSql = whereSql + "  1=0) ";
    }
    var sql =
      `SELECT r.id, r.name, r.type,r.facilities, r.subUnits, r.subUnitType, r.style, r.price, rb.from,rb.to,o.id officeId, o.name office, g.address
                FROM resources r left join offices o on r.officeId=o.id 
                left join buildings g on g.id=o.buildingId
                left join locations l on l.id=g.locationId
                left join resource_bookings rb on r.id=rb.resourceId and date(rb.from)=:date and rb.status !='Cancelled' 
                where 1=1  and r.status=1 and r.type=:type ` +
      whereSql +
      ` order by r.id, rb.from`;

    log.write("BookingService ::: searchResources :: sql : ", sql);
    var replacements = {
      type: data.type,
      date: utils.moment(data.date).toDate(),
    };
    log.write(
      "BookingService ::: searchResources :: replacements : ",
      replacements
    );
    var results = await session.db.query(sql, {
      replacements: replacements,
      type: Sequelize.QueryTypes.SELECT,
    });
    log.write(
      "BookingService ::: searchResources :: results count : " + results.length
    );
    var resources = [];
    var _resources = _(results)
      .groupBy((x) => x.id)
      .map((value, key) => ({
        resourceId: key,
        name: value[0].name,
        officeId: value[0].officeId,
        office: value[0].office,
        address: value[0].address,
        price: value[0].price,
        facilities: value[0].facilities,
        subUnits: value[0].subUnits,
        subUnitType: value[0].subUnitType,
        style: value[0].style,
        slots: value,
      }))
      .value();

    for (var i = 0; i < _resources.length; i++) {
      var resource = _resources[i];
      var slots = [];
      var lastSlot = "00:00";
      var lastTime = data.date + " 00:00";
      _.each(resource.slots, function (slot) {
        if (slot.from && slot.to) {
          if (lastSlot != utils.moment(slot.from).format("HH:mm")) {
            // console.log("last slot - from :: ", utils.moment(lastTime), utils.moment(slot.from));
            // while (utils.moment(lastTime).isBefore(utils.moment(slot.from))) {
            //   slots.push({ from: lastSlot, to: utils.moment(data.date + " " + lastSlot).add(60, 'minutes').format("HH:mm"), available: 1 });
            //   lastTime = utils.moment(lastTime).add(60, 'minutes');
            //   lastSlot = lastTime.format("HH:mm");
            //   // console.log("last slot  :: ", lastTime, lastSlot);
            // }
            slots.push({
              from: lastSlot,
              to: moment(slot.from).format("HH:mm"),
              available: 1,
            });
          }
          slots.push({
            from: moment(slot.from).format("HH:mm"),
            to: moment(slot.to).format("HH:mm"),
            available: 0,
          });
          lastSlot = moment(slot.to).format("HH:mm");
        }
      });

      // console.log("last slot : from :: " + data.date + " 23:59", utils.moment(lastTime), utils.moment(data.date + " 23:59"));
      // while (utils.moment(lastTime).isBefore(utils.moment(data.date + " 23:59"))) {
      //   var to = utils.moment(data.date + " " + lastSlot).add(60, 'minutes');
      //   if (to.isAfter(utils.moment(data.date + " 23:59"))) {
      //     to = utils.moment(data.date + " 23:59")
      //   }
      //   slots.push({ from: lastSlot, to: to.format("HH:mm"), available: 1 });
      //   lastTime = utils.moment(lastTime).add(60, 'minutes');
      //   lastSlot = lastTime.format("HH:mm");
      //   // console.log("last slot  :: ", lastTime, lastSlot);
      // }
      slots.push({ from: lastSlot, to: "23:59", available: 1 });
      resource.slots = slots;

      var resourceImages = await ResourceImage.findAll({
        where: { resourceId: resource.resourceId },
        include: ["image"],
      });
      var images = _.map(resourceImages, "image");
      resource.images = [];
      _.each(images, function (f) {
        resource.images.push({
          image: f.file,
          thumbImage: f.file,
          title: "",
          alt: "",
        });
      });
      resources.push(resource);
    }

    return resources;
  } catch (e) {
    log.write("BookingService ::: searchResources :: exception : ", e);
    throw e;
  }
};
service.createResourceBooking = async (data, username) => {
  try {
    log.write("BookingService ::: createResourceBooking :: data : ", data);
    var item = {};
    data.date = new Date();
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      await ResourceBooking.update(data, { where: { id: data.id } });
      item = data;
    } else {
      item = await ResourceBooking.create(data);
      item.set("refNo", "RES_" + (1000000 + item.id));

      if (!data.clientId) {
        data.client = await Client.create({
          name: data.client.name,
          company: data.client.company,
          phone: data.client.phone,
          email: data.client.email,
          companyId: data.companyId,
        });
      }
      var contract = {
        deskType: data.resourceType,
        frequency: "Hourly",
        term: "ShortTerm",
        kind: "NewBooking",
        date: new Date(),
        effectiveDate: data.from,
        status: "Confirmed",
        rent: data.amount,
      };
      contract = await Contract.create(contract);

      var parentBooking = {};
      if (item.parentBookingId) {
        parentBooking = await service.getBooking(item.parentBookingId);
      }

      var booking = await Booking.create({
        clientId: data.client.id,
        contractId: contract.id,
        officeId: data.officeId,
        locationId: parentBooking.locationId,
        offices: parentBooking.offices,
        status: "Booked",
        reserved: new Date(),
        started: data.from,
        ended: data.to,
        companyId: data.companyId,
      });
      contract.set("bookingId", booking.id);
      contract.save();

      item.set("clientId", data.client.id);
      item.set("bookingId", booking.id);
      item.save();

      data.bookingId = booking.id;

      var paxAmount = await service.getBuildingMeetingRoomPaxPrice(
        data.officeId
      );

      var creditsHistory = await service.getBookingCreditHistory(
        data.parentBookingId
      );
      log.write(
        "BookingService ::: createResourceBooking :: creditsHistory : ",
        creditsHistory
      );
      var creditsNeeded = item.amount / paxAmount;
      var creditUsed = {
        bookingId: data.parentBookingId,
        resourceBookingId: item.id,
        usedOn: new Date(),
        value: paxAmount,
      };
      creditUsed.credits = creditsNeeded;
      if (creditsHistory.availableCredits >= creditsNeeded) {
        item.set("status", "Booked");
      } else {
        item.set("status", "Pending");

        var booking = await service.getBooking(data.bookingId);
        var invoice;
        var creditsToBuy = creditsNeeded - creditsHistory.availableCredits;
        var amount = 0,
          taxableAmount = creditsToBuy * paxAmount,
          gst = 0,
          igst = 0,
          cgst = 0,
          sgst = 0,
          tds = 0;
        invoice = {
          bookingId: data.bookingId,
          status: "Pending",
          date: utils.moment().format("YYYY-MM-DD"),
          startDate: utils.moment(booking.started).format("YYYY-MM-DD"),
          endDate: utils.moment(booking.ended).format("YYYY-MM-DD"),
          dueDate: utils.moment(booking.started).format("YYYY-MM-DD"),
          type: "CreditInvoice",
          name: "Credit charge to buy " + creditsToBuy.toFixed(2) + " credits",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
        };
        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "ResourceRent",
            type: "MeetingRooms",
            status: "Published",
            companyId: booking.companyId,
          },
        });
        if (invoiceService) {
          invoice.invoiceServiceId = invoiceService.id;
        }
        gst = Math.round(taxableAmount * 0.18, 2);
        if (
          booking.client.stateCode &&
          booking.client.stateCode != booking.company.stateCode
        ) {
          igst = gst;
        } else {
          sgst = Math.round(gst / 2, 2);
          cgst = Math.round(gst / 2, 2);
        }
        amount = taxableAmount + gst - tds;

        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;
        invoice.due = amount;
        invoice.paid = 0;

        if (amount > 0) {
          invoice = await Invoice.create(invoice);
          var refNo = await systemUtils.getRefNo(
            "MonthlyInvoice",
            booking.id,
            invoice.date,
            booking.company,
            booking.contract
          );
          // invoice.set("refNo", "INV" + utils.moment().format("YY") + (100000 + invoice.id));
          invoice.set("refNo", refNo);
          await invoice.save();

          var invoiceItem = {
            invoiceId: invoice.id,
            invoiceServiceId: invoiceService ? invoiceService.id : null,
            item:
              "Credit charge to book " +
              item.name +
              " from " +
              utils.moment(item.from).format("MMM DD, YYYY hh:mm a") +
              " to " +
              utils.moment(item.to).format("hh:mm a"),
            qty: creditsToBuy,
            price: paxAmount,
            amount: taxableAmount,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            total: taxableAmount + gst,
          };
          await InvoiceItem.create(invoiceItem);

          var creditEntry = {};
          creditEntry.addedBy = username || "system";
          creditEntry.addedOn = new Date();
          creditEntry.value = paxAmount;
          creditEntry.credits = creditsToBuy;
          creditEntry.status = "Valid";
          creditEntry.type = "Paid";
          creditEntry.bookingId = data.parentBookingId;
          creditEntry.invoiceId = invoice.id;
          creditEntry = await CreditEntry.create(creditEntry);

          // log.write("BookingService ::: raiseBookingInvoices :: invoice : ", invoice.toJSON());
          invoice = await service.getInvoice(invoice.id);
          var pdf = await service.generateInvoicePdf(invoice);
          var resource = await Resource.findOne({
            where: { id: item.resourceId },
            include: [{ as: "office", model: Office, include: ["building"] }],
          });
          var items = [];
          _.each(invoice.items, function (i) {
            items.push({
              item: i.item,
              price: i.price,
              qty: creditsToBuy.toFixed(2),
              amount: i.amount,
              total: i.total,
              igst: i.igst,
              cgst: i.cgst,
              sgst: i.sgst,
            });
          });

          var linkId = uuid();
          var data = {
            bookingId: item.parentBookingId || item.bookingId,
          };
          var urlLink =
            config.selfcareUrl + "#/selfcare/pending-payment/" + linkId;
          SelfcareLink.create({
            linkId: linkId,
            url: urlLink,
            context: "PendingPayment",
            data: JSON.stringify(data),
            created: new Date(),
            companyId: booking.company.id,
          });

          var hasIgst =
            booking.client.stateCode &&
            booking.client.stateCode != booking.company.stateCode
              ? 1
              : 0;
          var data = {
            clientName: booking.client.name,
            resourceName: item.name,
            credits: creditsToBuy.toFixed(2),
            address:
              resource.office.name + ", " + resource.office.building.address,
            minutes:
              utils.moment(item.to).diff(utils.moment(item.from), "minutes") +
              1,
            startTime: utils.moment(item.from).format("MMM DD, YYYY hh:mm a"),
            hasIgst: hasIgst,
            hasPendings: 1,
            link: urlLink,
            items: items,
            grandTotal: invoice.amount,
            accountName: invoice.booking.company.accountName,
            bankName: invoice.booking.company.bankName,
            bankBranch: invoice.booking.company.branchName,
            accountNumber: invoice.booking.company.accountNumber,
            ifscCode: invoice.booking.company.ifscCode,
            supportPhone: invoice.booking.company.supportPhone,
            supportEmail: invoice.booking.company.supportEmail,
          };

          log.write(
            "BookingService ::: createResourceBooking :: html body data : ",
            data
          );
          var html = await services.getMailBody(
            "emails/resource_booked_notification.html",
            data
          );
          log.write(
            "BookingService ::: createResourceBooking :: html body : " +
              html.length
          );
          var attachments = [{ filename: pdf.name, path: pdf.file }];
          var subject =
            booking.company.name + " : Credit Charge payment Notification";
          var mail = await services.sendMail(
            subject,
            html,
            [
              {
                name: invoice.booking.client.name,
                email: invoice.booking.client.email,
                bookingId: invoice.booking.id,
              },
            ],
            attachments
          );
        }
      }
      CreditUsed.create(creditUsed);
      item.save();
    }
    return item;
  } catch (e) {
    log.write("BookingService ::: createResourceBooking :: exception : ", e);
    throw e;
  }
};
service.saveResourceBooking = async (data, username) => {
  try {
    log.write("BookingService ::: saveResourceBooking :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await ResourceBooking.update(data, { where: { id: data.id } });

      if (data.cancelled) {
        var invoices = await Invoice.findAll({
          where: { bookingId: data.bookingId },
        });
        if (invoices.length) {
          await Invoice.update(
            { status: "Cancelled", isCancelled: 1 },
            { where: { bookingId: data.bookingId } }
          );
          await Booking.update(
            { status: "Cancelled" },
            { where: { id: data.bookingId } }
          );

          await CreditEntry.destroy({
            where: { invoiceId: { $in: _.map(invoices, "id") } },
          });
        }
        await CreditUsed.destroy({ where: { resourceBookingId: data.id } });
      }
      item = data;
    }
    return item;
  } catch (e) {
    log.write("BookingService ::: saveResourceBooking :: exception : ", e);
    throw e;
  }
};
service.getBuildingMeetingRoomPaxPrice = async (officeId) => {
  try {
    var office = await Office.findOne({
      where: { id: officeId },
      attributes: ["name"],
      include: [
        { as: "building", model: Building, attributes: ["avgDeskPrice"] },
      ],
    });
    var avgDeskPrice = office.building.avgDeskPrice || 6000;
    return avgDeskPrice * 0.0116; 
  } catch (e) {
    log.write(
      "BookingService ::: getBuildingMeetingRoomPaxPrice :: exception : ",
      e
    );
    throw e;
  }
};
service.cancelBooking = async (id) => {
  try {
    log.write("BookingService ::: cancelBooking :: id : ", id);
    var booking = await Booking.findOne({
      where: { id: id },
      include: ["invoices", "client", "company"],
    });
    var invoices = _.filter(booking.invoices, function (i) {
      return i.status != "Cancelled";
    });
    var paidInvoices = _.filter(booking.invoices, function (i) {
      return i.status == "Paid";
    });
    var paidAmount = _.sumBy(paidInvoices, "amount");

    var amount = 0;
    if (paidAmount > 0) {
      var invoiceDate = new Date();
      var invoice = {
        bookingId: id,
        status: "Paid",
        date: invoiceDate,
        startDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
        endDate: utils.moment(invoiceDate).endOf("month").format("YYYY-MM-DD"),
        dueDate: utils.moment(invoiceDate).add(4, "days").format("YYYY-MM-DD"),
        type: "CancellationCharge",
        name: "Booking Cancellation Charge for booking " + booking.refNo,
        updated: new Date(),
        updatedBy: "system",
        isLiability: 0,
      };
      var invoiceService = await InvoiceService.findOne({
        where: {
          category: "Operations",
          type: "CancelledBookingTokenAmount",
          status: "Published",
          companyId: booking.companyId,
        },
      });
      if (invoiceService) {
        invoice.invoiceServiceId = invoiceService.id;
      }
      invoice.invoiceServiceId = invoiceService ? invoiceService.id : null;

      var taxableAmount = 0,
        gst = 0,
        igst = 0,
        cgst = 0,
        sgst = 0,
        tds = 0;
      taxableAmount = paidAmount / 1.18;
      gst = Math.round(taxableAmount * 0.18, 2);
      if (
        booking.client.stateCode &&
        booking.client.stateCode != booking.company.stateCode
      ) {
        igst = gst;
      } else {
        sgst = Math.round(gst / 2, 2);
        cgst = Math.round(gst / 2, 2);
      }
      amount = taxableAmount + gst - tds;

      invoice.amount = amount;
      invoice.taxableAmount = taxableAmount;
      invoice.gst = gst;
      invoice.tds = tds;
      invoice.due = 0;
      invoice.paid = amount;

      invoice = await Invoice.create(invoice);
      var refNo = await systemUtils.getRefNo(
        "MonthlyInvoice",
        booking.id,
        invoice.date,
        booking.company
      );
      invoice.set("refNo", refNo);

      var item = {
        invoiceId: invoice.id,
        invoiceServiceId: invoiceService ? invoiceService.id : null,
        item: "Booking Cancellation Charge for booking " + booking.refNo,
        qty: 1,
        amount: taxableAmount,
        cgst: cgst,
        sgst: sgst,
        igst: igst,
        total: taxableAmount + gst,
      };
      await InvoiceItem.create(item);
      var _invoice = await service.getInvoice(invoice.id);
      service.generateInvoicePdf(_invoice);
      log.write(
        "BookingService ::: raiseInvoice :: invoice : ",
        invoice.toJSON()
      );
    }
    _.each(invoices, function (i) {
      i.set("status", "Cancelled");
      i.set("isCancelled", 1);
      i.save();
    });

    Contract.update(
      { status: "Cancelled" },
      { where: { id: booking.contractId } }
    );

    booking.set("status", "Cancelled");
    booking.set("paid", amount);
    booking.set("due", 0);
    booking.set("invoiced", amount);
    await booking.save();

    var bookedDesks = await BookedDesk.findAll({
      where: { bookingId: booking.id, status: { $ne: "Cancelled" } },
      include: [{ as: "desk", model: Desk, include: ["cabin"] }],
    });
    var _bookedDesks = [];
    _.each(bookedDesks, function (d) {
      _bookedDesks.push({
        deskId: d.deskId,
        cabin: d.desk.cabin,
        cabinId: d.desk.cabinId,
        area: d.area,
      });
    });

    var cabins = _(_bookedDesks)
      .groupBy((x) => x.cabinId)
      .map((value, key) => ({
        cabinId: key,
        cabin: value[0].cabin,
        desks: value,
      }))
      .value();

    _.each(cabins, function (c) {
      var cabinId = c.cabinId;
      var usedArea = _.sumBy(c.desks, "area");
      log.write(
        "BookingService ::: cancelBooking :: decrementing cabin area of " +
          cabinId +
          " by " +
          usedArea
      );
      c.cabin.decrement({ usedArea: usedArea }, { where: { id: cabinId } });
    });

    BookedDesk.update(
      {
        status: "Released",
      },
      { where: { bookingId: booking.id } }
    );

    Schedule.update(
      { status: "Archived" },
      { where: { bookingId: booking.id } }
    );

    return booking;
  } catch (e) {
    log.write("BookingService ::: cancelBooking :: exception : ", e);
    throw e;
  }
};
service.extendedContract = async (data, username) => {
  try {
    log.write(
      "BookingService ::: extendedContract :: bookingId : ",
      data.bookingId
    );
    var booking = await Booking.findOne({
      where: { id: data.bookingId },
      include: ["client", "contract"],
    });
    var contract = booking.contract.toJSON();
    delete contract.id;

    var previousEndDate = booking.ended;
    contract.date = new Date();
    contract.kind = "Extension";
    contract.effectiveDate = utils
      .moment(previousEndDate)
      .clone()
      .add(1, "days")
      .toDate();
    contract = await Contract.create(contract);

    booking.set("ended", utils.moment(data.exitDate).toDate());
    booking.save();

    var invoiceService = await InvoiceService.findOne({
      where: {
        category: "OfficeRent",
        type: "Monthly",
        status: "Published",
        companyId: booking.companyId,
      },
    });

    // last month rent till exit date
    var startDate = utils.moment(contract.effectiveDate).format("YYYY-MM-DD");
    var dayRent =
      contract.rent /
      (utils
        .moment(previousEndDate)
        .diff(utils.moment(booking.started), "days") +
        2);
    var noOfDays =
      utils
        .moment(data.exitDate)
        .diff(utils.moment(contract.effectiveDate), "days") + 1;
    var extendedRent = Math.round(dayRent * noOfDays);
    log.write(
      "BookingService ::: extendedContract :: dayRent - noOfDays - startDate : " +
        dayRent +
        " - " +
        noOfDays +
        " - " +
        startDate
    );

    var invoice = {
      bookingId: booking.id,
      status: "Pending",
      date: new Date(),
      startDate: startDate,
      endDate: utils.moment(data.exitDate).format("YYYY-MM-DD"),
      dueDate: startDate,
      type: booking.contract.invoiceServiceType,
      name: "Extended Contract Rent for " + noOfDays + " days",
      updated: new Date(),
      updatedBy: "system",
      isLiability: 0,
    };

    if (invoiceService) {
      invoice.invoiceServiceId = invoiceService.id;
    }
    var rent = 0,
      amount = 0,
      taxableAmount = extendedRent,
      gst = 0,
      igst = 0,
      cgst = 0,
      sgst = 0,
      tds = 0;

    gst = Math.round(taxableAmount * 0.18, 2);
    if (
      booking.client.stateCode &&
      booking.client.stateCode != booking.company.stateCode
    ) {
      igst = gst;
    } else {
      sgst = Math.round(gst / 2, 2);
      cgst = Math.round(gst / 2, 2);
    }
    if (service.hasTds(rent, booking.started, invoice.date)) {
      tds = taxableAmount * 0.1;
    }
    amount = taxableAmount + gst - tds;

    invoice.amount = amount;
    invoice.taxableAmount = taxableAmount;
    invoice.gst = gst;
    invoice.tds = tds;
    invoice.due = amount;
    invoice.paid = 0;

    invoice = await Invoice.create(invoice);
    var refNo = await systemUtils.getRefNo(
      "MonthlyInvoice",
      booking.id,
      invoice.date,
      booking.company
    );
    invoice.set("refNo", refNo);
    await invoice.save();

    var item = {
      invoiceId: invoice.id,
      invoiceServiceId: invoiceService ? invoiceService.id : null,
      item:
        "Extended Month Rent for " +
        booking.desks +
        " desks <br> for period of " +
        utils.moment(invoice.startDate).format("MMM DD, YYYY") +
        " - " +
        utils.moment(invoice.endDate).format("MMM DD, YYYY"),
      qty: booking.desks || 1,
      price: booking.contract.rent / (booking.desks || 1),
      amount: taxableAmount,
      cgst: cgst,
      sgst: sgst,
      igst: igst,
      total: taxableAmount + gst,
    };
    console.log("Infinity is from", item);
    await InvoiceItem.create(item);
    log.write(
      "BookingService ::: extendedContract :: extendedRent invoice : ",
      invoice.toJSON()
    );
    var _invoice = await service.getInvoice(invoice.id);
    await service.generateInvoicePdf(_invoice);
    service.updateBookingLedger(booking.id);

    return invoice;
  } catch (e) {
    log.write("BookingService ::: extendedContract :: exception : ", e);
    throw e;
  }
};

service.cancelExitRequest = async (id, username) => {
  try {
    log.write("BookingService ::: cancelExitRequest :: id : ", id);
    return booking;
  } catch (e) {
    log.write("BookingService ::: cancelExitRequest :: exception : ", e);
    throw e;
  }
};
service.requestExit = async (data, username) => {
  try {
    log.write("BookingService ::: requestExit :: bookingId : ", data.bookingId);
    var booking = await Booking.findOne({ where: { id: data.bookingId } });

    var exitRequest = await ExitRequest.create({
      bookingId: data.bookingId,
      requestedDate: new Date(),
      status: "Requested",
      exitDate: utils.moment(data.exitDate).format("YYYY-MM-DD"),
      updated: new Date(),
      updatedBy: username,
    });
    booking.set("ended", utils.moment(data.exitDate).add(1, "days").format("YYYY-MM-DD"));
    booking.set("status", "Exiting");
    booking.set("exitRequestId", exitRequest.id);
    booking.save();

    var schedule = {
      bookingId: booking.id,
      type: "Exit",
      from: utils.moment(data.exitDate).clone().add(18, "hours").toDate(),
      status: "Scheduled",
      newBooking: true,
    };
    schedule.to = utils.moment(schedule.from).clone().add(1, "hours").toDate();
    service.saveSchedule(schedule);

    var booking = await service.getBooking(data.bookingId);

    await Invoice.update(
      { status: "Cancelled", isCancelled: 1 },
      {
        where: {
          bookingId: data.bookingId,
          date: { $gte: moment(data.exitDate).toDate() },
        },
      }
    );

    var invoiceService = await InvoiceService.findOne({
      where: {
        category: "OfficeRent",
        type: "Monthly",
        status: "Published",
        companyId: booking.companyId,
      },
    });

    // update last month rent
    log.write(
      "BookingService ::: requestExit :: last month rent for noOfDays : " +
        noOfDays +
        " : " +
        lastMonthRent
    );
    var lastMonthInvoices = await Invoice.findAll({
      where: {
        bookingId: booking.id,
        isCancelled: 0,
        invoiceServiceId: invoiceService ? invoiceService.id : null,
        date: {
          $between: [
            utils.moment(data.exitDate).startOf("month").format("YYYY-MM-DD"),
            utils.moment(data.exitDate).endOf("month").format("YYYY-MM-DD"),
          ],
        },
      },
    });
    _.each(lastMonthInvoices, function (i) {
      log.write(
        "BookingService ::: requestExit :: last month invoice to cancel : ",
        i.toJSON()
      );
      i.set("status", "Cancelled");
      i.set("isCancelled", 1);
      i.save();
    });

    // last month rent till exit date
    var startDate = utils.moment(data.exitDate).startOf("month").toDate();
    var contractRent = booking.contract.rent;
    var dayRent = contractRent / utils.moment().daysInMonth();
    var noOfDays = utils.moment(data.exitDate).date() + 1;

    if (
      utils.moment(booking.started).isSame(utils.moment(data.exitDate), "month")
    ) {
      startDate = utils.moment(booking.started).toDate();
      noOfDays = utils.moment(data.exitDate).diff(startDate, "days") + 1;
      log.write(
        "BookingService ::: requestExit :: same as movein month case : ",
        startDate
      );
    }
    var lastMonthRent = Math.round(dayRent * noOfDays);

    var invoice = {
      bookingId: booking.id,
      status: "Pending",
      date: utils.moment(data.exitDate).startOf("month").format("YYYY-MM-DD"),
      startDate: startDate,
      endDate: utils.moment(data.exitDate).add(1, "days").format("YYYY-MM-DD"),
      dueDate: utils.moment(startDate).add(4, "days").format("YYYY-MM-DD"),
      type: booking.contract.invoiceServiceType,
      name: "Last Month Rent for " + noOfDays + " days",
      updated: new Date(),
      updatedBy: "system",
      isLiability: 0,
    };

    if (invoiceService) {
      invoice.invoiceServiceId = invoiceService.id;
    }
    var rent = 0,
      amount = 0,
      taxableAmount = lastMonthRent,
      gst = 0,
      igst = 0,
      cgst = 0,
      sgst = 0,
      tds = 0;

    gst = Math.round(taxableAmount * 0.18, 2);
    if (
      booking.client.stateCode &&
      booking.client.stateCode != booking.company.stateCode
    ) {
      igst = gst;
    } else {
      sgst = Math.round(gst / 2, 2);
      cgst = Math.round(gst / 2, 2);
    }
    if (service.hasTds(rent, booking.started, invoice.date)) {
      tds = taxableAmount * 0.1;
    }
    amount = taxableAmount + gst - tds;

    invoice.amount = amount;
    invoice.taxableAmount = taxableAmount;
    invoice.gst = gst;
    invoice.tds = tds;
    invoice.due = amount;
    invoice.paid = 0;

    invoice = await Invoice.create(invoice);
    var refNo = await systemUtils.getRefNo(
      "MonthlyInvoice",
      booking.id,
      invoice.date,
      booking.company
    );
    // invoice.set("refNo", "INV" + utils.moment().format("YY") + (100000 + invoice.id));
    invoice.set("refNo", refNo);
    await invoice.save();

    var item = {
      invoiceId: invoice.id,
      invoiceServiceId: invoiceService ? invoiceService.id : null,
      item:
        "Last Month Rent for " +
        booking.desks +
        " desks <br> for period of " +
        utils.moment(invoice.startDate).format("MMM DD, YYYY") +
        " - " +
        utils.moment(invoice.endDate).format("MMM DD, YYYY"),
      qty: booking.desks || 1,
      price: booking.contract.rent / (booking.desks || 1),
      amount: taxableAmount,
      cgst: cgst,
      sgst: sgst,
      igst: igst,
      total: taxableAmount + gst,
    };
    await InvoiceItem.create(item);
    log.write(
      "BookingService ::: requestExit :: last month invoice : ",
      invoice.toJSON()
    );
    var _invoice = await service.getInvoice(invoice.id);
    await service.generateInvoicePdf(_invoice);

    await BookedDesk.update(
      { status: "Releasing", ended: new Date() },
      { where: { bookingId: booking.id } }
    );
    service.updateBookingLedger(booking.id);

    return exitRequest;
  } catch (e) {
    log.write("BookingService ::: requestExit :: exception : ", e);
    throw e;
  }
};
service.cancelExitRequest = async (id, username) => {
  try {
    log.write("BookingService ::: cancelExitRequest :: id : ", id);
    var booking = await Booking.findOne({
      where: { id: id },
      include: ["exitRequests"],
    });
    var exitDate;
    _.each(booking.exitRequests, function (r) {
      if (r.status == "Requested") {
        r.set("status", "Cancelled");
        r.set("updated", new Date());
        r.set("updatedBy", username);
        r.save();
        exitDate = r.exitDate;
      }
    });
    booking.set("status", "Active");
    booking.set("ended", null);
    await booking.save();

    BookedDesk.update(
      { status: "InUse", ended: null },
      { where: { bookingId: booking.id, contractId: booking.contractId } }
    );

    Schedule.update(
      { status: "Cancelled" },
      { where: { bookingId: id, type: "Exit" } }
    );

    if (exitDate) {
      log.write(
        "BookingService ::: cancelExitRequest :: exitDate : ",
        exitDate
      );
      await Invoice.update(
        { status: "Cancelled", isCancelled: 1 },
        {
          where: {
            bookingId: booking.id,
            isCancelled: 0,
            type: { $in: ["OfficeRent"] },
            date: {
              $between: [
                utils.moment(exitDate).startOf("month").toDate(),
                utils.moment(exitDate).endOf("month").toDate(),
              ],
            },
          },
        }
      );
      if (
        utils.moment(booking.started).isSame(utils.moment(exitDate), "month")
      ) {
        await service.raiseBookingInvoices(booking.id, true);
      } else {
        await service.raiseInvoices({
          bookingId: booking.id,
          ignoreCancelled: true,
        });
      }
    }

    return booking;
  } catch (e) {
    log.write("BookingService ::: cancelExitRequest :: exception : ", e);
    throw e;
  }
};
service.settleShortTermBookings = async (data, username) => {
  try {
    log.write("BookingService ::: settleShortTermBookings :: data : ", data);
    var bookings = await Booking.findAll({
      where: {
        companyId: data.companyId,
        status: { $notIn: ["Settled", "Cancelled"] },
        "$contract.term$": "ShortTerm",
        ended: { $lt: new Date() },
      },
      include: ["contract"],
    });
    var settledBookings = 0;
    _.each(bookings, function (b) {
      if (b.invoiced && b.paid >= b.invoiced) {
        b.set("status", "Settled");
        b.set("updatedBy", username);
        b.set("updated", new Date());
        b.save();

        BookedDesk.update(
          {
            status: "Released",
          },
          { where: { bookingId: b.id } }
        );

        settledBookings++;
      }
    });
    return settledBookings + " ShortTerm Bookings are marked as Settled.";
  } catch (e) {
    log.write("BookingService ::: settleShortTermBookings :: exception : ", e);
    throw e;
  }
};
service.settleShortTermBooking = async (id, username) => {
  try {
    log.write("BookingService ::: settleShortTermBooking :: id : ", id);
    var booking = await Booking.findOne({
      where: { id: id },
    });
    if (utils.moment(booking.ended).isBefore(utils.moment())) {
      if (booking.paid >= booking.invoiced) {
        booking.set("status", "Settled");
        await booking.save();

        await BookedDesk.update(
          {
            status: "Released",
          },
          { where: { bookingId: booking.id } }
        );
      }
    }
  } catch (e) {
    log.write("BookingService ::: settleShortTermBookings :: exception : ", e);
    throw e;
  }
};

service.saveAcr = async (data, username) => {
  try {
    log.write("BookingService ::: saveAcr :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await ExitAcr.update(data, { where: { id: data.id } });
      item = data;
    } else {
      item = await ExitAcr.create(data);
    }
    return item;
  } catch (e) {
    log.write("BookingService ::: saveAcr :: exception : ", e);
    throw e;
  }
};
service.saveDeduction = async (data, username) => {
  try {
    log.write("BookingService ::: saveDeduction :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await ExitDeduction.update(data, { where: { id: data.id } });
      item = data;
    } else {
      item = await ExitDeduction.create(data);
    }
    return item;
  } catch (e) {
    log.write("BookingService ::: saveDeduction :: exception : ", e);
    throw e;
  }
};
service.saveExitComment = async (data, username) => {
  try {
    log.write("BookingService ::: saveExitComment :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await ExitComment.update(data, { where: { id: data.id } });
      item = data;
    } else {
      item = await ExitComment.create(data);
    }
    return item;
  } catch (e) {
    log.write("BookingService ::: saveExitComment :: exception : ", e);
    throw e;
  }
};
service.saveExitRequest = async (data, username) => {
  try {
    log.write("BookingService ::: saveExitRequest :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await ExitRequest.update(data, { where: { id: data.id } });
      item = data;
    } else {
      item = await ExitRequest.create(data);
    }
    return item;
  } catch (e) {
    log.write("BookingService ::: saveExitRequest :: exception : ", e);
    throw e;
  }
};

service.approveFinalStatement = async (data, username) => {
  try {
    log.write("BookingService ::: approveFinalStatement :: data : ", data);
    data.fcpStatus = "Approved";
    await ExitRequest.update(data, { where: { id: data.id } });

    var exitRequest = await ExitRequest.findOne({
      where: { id: data.id },
      include: [
        {
          as: "acrs",
          required: false,
          model: ExitAcr,
          where: { status: { $ne: "Archived" } },
        },
        {
          as: "comments",
          model: ExitComment,
          required: false,
          where: { status: { $ne: "Archived" } },
        },
        {
          as: "deductions",
          model: ExitDeduction,
          required: false,
          where: { status: { $ne: "Archived" } },
        },
        { as: "booking", model: Booking, include: ["company", "client"] },
      ],
    });

    var data = {
      companyLogo: exitRequest.booking.company.logo,
      clientName: exitRequest.booking.client.name,
      companyName: exitRequest.booking.company.name,
      companyAddress: exitRequest.booking.company.address,
      office: exitRequest.booking.offices,
      refNo: exitRequest.booking.refNo,
      monthlyInvoices: exitRequest.monthlyInvoices,
      earlyExitCharge: exitRequest.earlyExitCharge,
      noticePeriodPenalty: exitRequest.noticePeriodPenalty,
      assetDamages: exitRequest.assetDamages,
      otherDeductions: exitRequest.otherDeductions,
      tdsLiability: exitRequest.tdsLiability,
      tdsPenality: exitRequest.tdsPenalty,
      deregistrationLiability: exitRequest.deregistrationLiability,
      expectedAmount: exitRequest.expectedAmount,
      totalPaid: exitRequest.booking.paid,
      refund: exitRequest.refund,
      due: exitRequest.due,
    };
    log.write("BookingService ::: approveFinalStatement :: data : ", data);
    var tmpFile = await services.parseContent(
      "pdfs/final_exit_statement.html",
      data
    );
    var doc = await services.createDoc(
      "FINAL_STATEMENT_" +
        exitRequest.booking.refNo +
        "_" +
        exitRequest.id +
        ".pdf"
    );
    log.write("BookingService ::: approveFinalStatement :: doc : ", doc);
    await services.generatePdf(tmpFile, path.basename(doc.file));
    exitRequest.set("finalStatementId", doc.id);
    await exitRequest.save();

    service.sendFinalStatementApprovalMail(exitRequest.id);

    return exitRequest;
  } catch (e) {
    log.write("BookingService ::: approveFinalStatement :: exception : ", e);
    throw e;
  }
};

service.acceptFinalStatement = async (data, username) => {
  try {
    log.write("BookingService ::: acceptFinalStatement :: data :: ", data);

    if (data.clientId) {
      log.write(
        "BookingService ::: acceptFinalStatement :: clientUpdate :: ",
        data.client
      );
      await Client.update(data, { where: { id: data.clientId } });
    }

    var exitRequest = await ExitRequest.findOne({
      where: { id: data.exitRequestId },
      include: [
        { as: "booking", model: Booking, include: ["client", "company"] },
      ],
    });

    log.write(
      "BookingService ::: acceptFinalStatement :: exitRequest",
      JSON.parse(JSON.stringify(exitRequest))
    );

    if (!exitRequest) {
      throw "Exit for this booking is not requested yet.";
    }
    if (data.fcpStatus == "Accepted") {
      if (exitRequest.earlyExitCharge > 0) {
        var invoice = {
          bookingId: exitRequest.booking.id,
          status: "Pending",
          date: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          startDate: utils
            .moment(exitRequest.exitDate)
            .startOf("month")
            .format("YYYY-MM-DD"),
          endDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          dueDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          type: "Others",
          name: "Early Exit Charge",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
        };
        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "Exits",
            type: "ExitCharge",
            status: "Published",
            companyId: exitRequest.booking.companyId,
          },
        });
        if (invoiceService) {
          invoice.invoiceServiceId = invoiceService.id;
        }
        var rent = 0,
          amount = 0,
          taxableAmount = exitRequest.earlyExitCharge,
          gst = 0,
          igst = 0,
          cgst = 0,
          sgst = 0,
          tds = 0;

        gst = Math.round(taxableAmount * 0.18, 2);
        if (
          exitRequest.booking.client.stateCode &&
          exitRequest.booking.client.stateCode !=
            exitRequest.booking.company.stateCode
        ) {
          igst = gst;
        } else {
          sgst = Math.round(gst / 2, 2);
          cgst = Math.round(gst / 2, 2);
        }

        amount = taxableAmount + gst - tds;
        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;
        invoice.due = amount;
        invoice.paid = 0;

        invoice = await Invoice.create(invoice);
        var refNo = await systemUtils.getRefNo(
          "MonthlyInvoice",
          exitRequest.booking.id,
          invoice.date,
          exitRequest.booking.company
        );
        invoice.set("refNo", refNo);
        await invoice.save();

        var item = {
          invoiceId: invoice.id,
          invoiceServiceId: invoiceService ? invoiceService.id : null,
          item: "Early Exit Charge for exiting before lockin period",
          qty: 1,
          price: taxableAmount,
          amount: taxableAmount,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          total: taxableAmount + gst,
        };
        await InvoiceItem.create(item);
        var _invoice = await service.getInvoice(invoice.id);
        service.generateInvoicePdf(_invoice);
      }

      if (exitRequest.noticePeriodPenalty > 0) {
        var invoice = {
          bookingId: exitRequest.booking.id,
          status: "Pending",
          date: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          startDate: utils
            .moment(exitRequest.exitDate)
            .startOf("month")
            .format("YYYY-MM-DD"),
          endDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          dueDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          type: "Others",
          name: "Notice Period Penalty Charge",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
        };
        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "Exits",
            type: "NoticePeriodPenaltyCharges",
            status: "Published",
            companyId: exitRequest.booking.companyId,
          },
        });
        if (invoiceService) {
          invoice.invoiceServiceId = invoiceService.id;
        }
        var rent = 0,
          amount = 0,
          taxableAmount = exitRequest.noticePeriodPenalty,
          gst = 0,
          igst = 0,
          cgst = 0,
          sgst = 0,
          tds = 0;

        gst = Math.round(taxableAmount * 0.18, 2);
        if (
          exitRequest.booking.client.stateCode &&
          exitRequest.booking.client.stateCode !=
            exitRequest.booking.company.stateCode
        ) {
          igst = gst;
        } else {
          sgst = Math.round(gst / 2, 2);
          cgst = Math.round(gst / 2, 2);
        }

        amount = taxableAmount + gst - tds;
        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;
        invoice.due = amount;
        invoice.paid = 0;

        invoice = await Invoice.create(invoice);
        var refNo = await systemUtils.getRefNo(
          "MonthlyInvoice",
          exitRequest.booking.id,
          invoice.date,
          exitRequest.booking.company
        );
        invoice.set("refNo", refNo);
        await invoice.save();

        var item = {
          invoiceId: invoice.id,
          invoiceServiceId: invoiceService ? invoiceService.id : null,
          item: "NoticePeriod Penalty Charge for exiting without serving notice period",
          qty: 1,
          price: taxableAmount,
          amount: taxableAmount,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          total: taxableAmount + gst,
        };
        await InvoiceItem.create(item);
        var _invoice = await service.getInvoice(invoice.id);
        service.generateInvoicePdf(_invoice);
      }

      if (exitRequest.assetDamages > 0) {
        var invoice = {
          bookingId: exitRequest.booking.id,
          status: "Pending",
          date: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          startDate: utils
            .moment(exitRequest.exitDate)
            .startOf("month")
            .format("YYYY-MM-DD"),
          endDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          dueDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          type: "Others",
          name: "Asset Damage Charges",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
        };
        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "Exits",
            type: "AssetDamageCharges",
            status: "Published",
            companyId: exitRequest.booking.companyId,
          },
        });
        if (invoiceService) {
          invoice.invoiceServiceId = invoiceService.id;
        }
        var rent = 0,
          amount = 0,
          taxableAmount = (exitRequest.assetDamages / 118) * 100,
          gst = 0,
          igst = 0,
          cgst = 0,
          sgst = 0,
          tds = 0;

        gst = Math.round(taxableAmount * 0.18, 2);
        if (
          exitRequest.booking.client.stateCode &&
          exitRequest.booking.client.stateCode !=
            exitRequest.booking.company.stateCode
        ) {
          igst = gst;
        } else {
          sgst = Math.round(gst / 2, 2);
          cgst = Math.round(gst / 2, 2);
        }

        amount = taxableAmount + gst - tds;
        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;
        invoice.due = amount;
        invoice.paid = 0;

        invoice = await Invoice.create(invoice);
        var refNo = await systemUtils.getRefNo(
          "MonthlyInvoice",
          exitRequest.booking.id,
          invoice.date,
          exitRequest.booking.company
        );
        invoice.set("refNo", refNo);
        await invoice.save();

        var item = {
          invoiceId: invoice.id,
          invoiceServiceId: invoiceService ? invoiceService.id : null,
          item: "Charges for Damaged Assets",
          qty: 1,
          price: taxableAmount,
          amount: taxableAmount,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          total: taxableAmount + gst,
        };
        await InvoiceItem.create(item);
        var _invoice = await service.getInvoice(invoice.id);
        service.generateInvoicePdf(_invoice);
      }

      if (exitRequest.otherDeductions > 0) {
        var invoice = {
          bookingId: exitRequest.booking.id,
          status: "Pending",
          date: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          startDate: utils
            .moment(exitRequest.exitDate)
            .startOf("month")
            .format("YYYY-MM-DD"),
          endDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          dueDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          type: "Others",
          name: "Other Deductions and Charges",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
        };
        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "Exits",
            type: "OtherExitDeductions",
            status: "Published",
            companyId: exitRequest.booking.companyId,
          },
        });
        if (invoiceService) {
          invoice.invoiceServiceId = invoiceService.id;
        }
        var rent = 0,
          amount = 0,
          taxableAmount = (exitRequest.otherDeductions / 118) * 100,
          gst = 0,
          igst = 0,
          cgst = 0,
          sgst = 0,
          tds = 0;

        gst = Math.round(taxableAmount * 0.18, 2);
        if (
          exitRequest.booking.client.stateCode &&
          exitRequest.booking.client.stateCode !=
            exitRequest.booking.company.stateCode
        ) {
          igst = gst;
        } else {
          sgst = Math.round(gst / 2, 2);
          cgst = Math.round(gst / 2, 2);
        }
        amount = taxableAmount + gst - tds;
        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;
        invoice.due = amount;
        invoice.paid = 0;

        invoice = await Invoice.create(invoice);
        var refNo = await systemUtils.getRefNo(
          "MonthlyInvoice",
          exitRequest.booking.id,
          invoice.date,
          exitRequest.booking.company
        );
        invoice.set("refNo", refNo);
        await invoice.save();

        var item = {
          invoiceId: invoice.id,
          invoiceServiceId: invoiceService ? invoiceService.id : null,
          item: "Other Exit Deductions",
          qty: 1,
          price: taxableAmount,
          amount: taxableAmount,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          total: taxableAmount + gst,
        };
        await InvoiceItem.create(item);
        var _invoice = await service.getInvoice(invoice.id);
        service.generateInvoicePdf(_invoice);
      }

      data.status = "Accepted";
      data.fcpStatus = "Accepted";
      await ExitRequest.update(data, { where: { id: data.exitRequestId } });

      Invoice.update(
        { isLiabilityCleared: 1 },
        {
          where: {
            bookingId: exitRequest.booking.id,
            isCancelled: 0,
            isLiability: 1,
          },
        }
      );
      var bookingStatus = "Settled";

      if (exitRequest.tdsLiability > 0) {
        var invoice = {
          bookingId: exitRequest.booking.id,
          status: "Pending",
          date: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          startDate: utils
            .moment(exitRequest.exitDate)
            .startOf("month")
            .format("YYYY-MM-DD"),
          endDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          dueDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          type: "Security",
          name: "TDS Liability ",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 1,
        };
        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "Security",
            type: "TDSDue",
            status: "Published",
            companyId: exitRequest.booking.companyId,
          },
        });
        if (invoiceService) {
          invoice.invoiceServiceId = invoiceService.id;
        }
        var rent = 0,
          amount = 0,
          taxableAmount = exitRequest.tdsLiability,
          gst = 0,
          igst = 0,
          cgst = 0,
          sgst = 0,
          tds = 0;
        amount = taxableAmount;
        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = 0;
        invoice.tds = 0;
        invoice.due = amount;
        invoice.paid = 0;

        invoice = await Invoice.create(invoice);
        var refNo = await systemUtils.getRefNo(
          "Liability",
          exitRequest.booking.id,
          invoice.date,
          exitRequest.booking.company
        );
        invoice.set("refNo", refNo);
        await invoice.save();

        var item = {
          invoiceId: invoice.id,
          invoiceServiceId: invoiceService ? invoiceService.id : null,
          item: "TDS Due Liability",
          qty: 1,
          price: taxableAmount,
          amount: taxableAmount,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          total: taxableAmount + gst,
        };
        await InvoiceItem.create(item);
        bookingStatus = "TDSHolded";
      }

      if (exitRequest.deregistrationLiability > 0) {
        var invoice = {
          bookingId: exitRequest.booking.id,
          status: "Pending",
          date: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          startDate: utils
            .moment(exitRequest.exitDate)
            .startOf("month")
            .format("YYYY-MM-DD"),
          endDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          dueDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          type: "Security",
          name: "DeRegistration Charge Liability ",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 1,
        };
        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "Security",
            type: "DeregistrationCharge",
            status: "Published",
            companyId: exitRequest.booking.companyId,
          },
        });
        if (invoiceService) {
          invoice.invoiceServiceId = invoiceService.id;
        }
        var rent = 0,
          amount = 0,
          taxableAmount = exitRequest.deregistrationLiability,
          gst = 0,
          igst = 0,
          cgst = 0,
          sgst = 0,
          tds = 0;
        amount = taxableAmount;
        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = 0;
        invoice.tds = 0;
        invoice.due = amount;
        invoice.paid = 0;

        invoice = await Invoice.create(invoice);
        var refNo = await systemUtils.getRefNo(
          "Liability",
          exitRequest.booking.id,
          invoice.date,
          exitRequest.booking.company
        );
        invoice.set("refNo", refNo);
        await invoice.save();

        var item = {
          invoiceId: invoice.id,
          invoiceServiceId: invoiceService ? invoiceService.id : null,
          item: "TDS Liability Deductions",
          qty: 1,
          price: taxableAmount,
          amount: taxableAmount,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          total: taxableAmount + gst,
        };
        await InvoiceItem.create(item);
        bookingStatus = "TDSHolded";
      }

      if (exitRequest.tdsPenalty > 0) {
        var invoice = {
          bookingId: exitRequest.booking.id,
          status: "Pending",
          date: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          startDate: utils
            .moment(exitRequest.exitDate)
            .startOf("month")
            .format("YYYY-MM-DD"),
          endDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          dueDate: utils.moment(exitRequest.exitDate).format("YYYY-MM-DD"),
          type: "Security",
          name: "TDS Penality Liability ",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 1,
        };
        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "Security",
            type: "TDSPenalty",
            status: "Published",
            companyId: exitRequest.booking.companyId,
          },
        });
        if (invoiceService) {
          invoice.invoiceServiceId = invoiceService.id;
        }
        var rent = 0,
          amount = 0,
          taxableAmount = exitRequest.tdsPenalty,
          gst = 0,
          igst = 0,
          cgst = 0,
          sgst = 0,
          tds = 0;
        amount = taxableAmount;
        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = 0;
        invoice.tds = 0;
        invoice.due = amount;
        invoice.paid = 0;

        invoice = await Invoice.create(invoice);
        var refNo = await systemUtils.getRefNo(
          "Liability",
          exitRequest.booking.id,
          invoice.date,
          exitRequest.booking.company
        );
        invoice.set("refNo", refNo);
        await invoice.save();

        var item = {
          invoiceId: invoice.id,
          invoiceServiceId: invoiceService ? invoiceService.id : null,
          item: "TDS Liability Deductions",
          qty: 1,
          price: taxableAmount,
          amount: taxableAmount,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          total: taxableAmount + gst,
        };
        await InvoiceItem.create(item);
        bookingStatus = "TDSHolded";
      }

      log.write("Update Booking :: " + bookingStatus);

      Booking.update(
        { status: bookingStatus },
        { where: { id: exitRequest.booking.id } }
      );
      await service.updateBookingLedger(exitRequest.booking.id);

      if (exitRequest.refund > 0) {
        var accountData = {
          id: exitRequest.booking.client.id,
          accountNumber: exitRequest.booking.client.accountNumber,
          ifscCode: exitRequest.booking.client.ifscCode,
          name: exitRequest.booking.client.benificiaryName,
          email: exitRequest.booking.client.email,
          phone: exitRequest.booking.client.phone,
          address: exitRequest.booking.client.address,
        };

        log.write(
          "Booking :: Service :: addCashFreeBenificiaryForRefund:: ",
          accountData
        );
        var benificiary = await services.addCashFreeBenificiaryForRefund(
          accountData,
          exitRequest.booking.companyId
        );

        var payoutPayment = await PayoutPayment.create({
          payoutBenificiaryId: benificiary.id,
          paymentMode: "CashFree",
          info:
            "ExitRefund to " +
            accountData.name +
            " for booking " +
            exitRequest.booking.refNo,
          amount: exitRequest.refund,
          approvedBy: username,
          approvedOn: new Date(),
          type: "ExitRefund",
          status: "Approved",
          exitRequestId: exitRequest.id,
          updated: new Date(),
          updatedBy: username,
          companyId: exitRequest.booking.companyId,
        });
        log.write(
          "BookingService ::: acceptFinalStatement :: payoutPayment : ",
          payoutPayment.toJSON()
        );
      }
    } else if (data.fcpStatus == "Rejected") {
      await ExitRequest.update(
        {
          status: data.fcpStatus,
          fcpStatus: data.fcpStatus,
          rejectedMessage: data.rejectedMessage,
        },
        { where: { id: data.exitRequestId } }
      );
    }

    log.write(
      "BookingService ::: acceptFinalStatement :: exitRequest:: data",
      data
    );
    return data;
  } catch (e) {
    log.write("BookingService ::: acceptFinalStatement :: exception : ", e);
    throw e;
  }
};

service.saveContract = async (data, username) => {
  try {

    log.write("BookingService ::: saveContract :: data : ", data);
    var contract = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    data.contractPeriod = 11;
    
    var onBoardDate =  utils.moment(data.effectiveDate).startOf("month").format("YYYY-MM-DD")


    if (data.id) {
      contract = data;
      if (data.approved) {
        data.approvedBy = username;
        data.approvedOn = new Date();
        if (data.kind == "NewBooking" && data.deskType != 'VirtualOffice') {
          await service.raiseBookingSDInvoice(data.bookingId);
          if(utils.generateAgreementPdf){
          // service.generateAgreementPdf(data.bookingId, true);
        }
      }
      } else if (data.confirmed) {
        var deskPrice;
        if (contract.additionalDesks || contract.desks) {
          deskPrice = Math.round(
            (contract.additionalRent || contract.rent) /
              (contract.additionalDesks || contract.desks),
            2
          );
        }
        if (data.term == "ShortTerm") {
          await service.raiseBookingInvoices(data.bookingId);
        } 
        else if (data.kind == "NewBooking") {
          if(data.deskType == 'VirtualOffice'){
            await service.raiseVirtualBookingInvoice(data.bookingId);
          }
          else {
           await service.raiseBookingFirstMonthInvoice(data.bookingId);
          if(utils.generateAgreementPdf){
          // service.generateAgreementPdf(data.bookingId, true);           
          }
        }
        } 
	else if (data.kind == "ReLocation") {
          await service.confirmRelocation(data);
        } else if (data.kind == "Expansion") {
          await service.confirmExpansion(data);
        } else if (data.kind == "Contraction") {
          // await service.confirmContraction();
        } else if (data.kind == "Renewal") {
          var booking = await Booking.findOne({ id: data.bookingId });
          await BookedDesk.update(
            {
              contractId: contract.id,
            },
            { where: { contractId: booking.contractId } }
          );
        }
        data.deskPrice = deskPrice;
        

        if (deskPrice) {
          await BookedDesk.update(
            {
              status: "Booked",
              price: deskPrice,
            },
            { where: { contractId: contract.id } }
          );
        }
        data.confirmedBy = username;
        data.confirmedOn = new Date();
      } else if (data.cancelled) {
        if (contract.term == "ShortTerm" && contract.kind == "Extension") {
          var contract = await Contract.findOne({ where: { id: data.id } });

          await session.db.query(
            `update invoices i, invoice_services ins set i.status='Cancelled', i.isCancelled=1 
              where isCancelled=0 and i.bookingId = ` +
              contract.bookingId +
              ` and ins.type='Monthly' and ins.category='OfficeRent' and
              i.date between '` +
              utils
                .moment(contract.effectiveDate)
                .startOf("month")
                .format("YYYY-MM-DD") +
              `' and '` +
              utils
                .moment(contract.effectiveDate)
                .endOf("month")
                .format("YYYY-MM-DD") +
              `' `
          );

          await Booking.update(
            {
              ended: utils
                .moment(contract.effectiveDate)
                .add(-1, "days")
                .toDate(),
            },
            { where: { id: contract.bookingId } }
          );
        } else {
          if (contract.status == "Confirmed") {
            var contracts = await Contract.findAll({
              where: { bookingId: data.bookingId, status: "Confirmed" },
            });
            var lastContract = contracts.pop();
            lastContract = contracts.pop();
            if (lastContract) {
              if (  utils .moment(contract.date) .isSame(utils.moment(contract.effectiveDate), "month")) {
                await session.db.query( );

                await Booking.update(
                  { contractId: lastContract.id },
                  { where: { id: contract.bookingId } }
                );
                if (data.kind == "ReLocation") {
                  await service.raiseInvoices({
                    bookingId: contract.bookingId,
                    ignoreCancelled: true,
                  });
                }
              } else if (  utils .moment() .isSame(utils.moment(contract.effectiveDate), "month")
              ) {
                await session.db.query(
                  `update invoices i, invoice_services ins set i.status='Cancelled', i.isCancelled=1 
              where isCancelled=0 and ins.type='Monthly' and ins.category='OfficeRent' and
              i.date between '` +
                    utils
                      .moment(contract.effectiveDate)
                      .startOf("month")
                      .format("YYYY-MM-DD") +
                    `' and '` +
                    utils
                      .moment(contract.effectiveDate)
                      .endOf("month")
                      .format("YYYY-MM-DD") +
                    `'`
                );

                await Booking.update(
                  { contractId: lastContract.id },
                  { where: { id: contract.bookingId } }
                );
                await service.raiseInvoices({
                  bookingId: contract.bookingId,
                  ignoreCancelled: true,
                });
              }
            }
          }
          await BookedDesk.update(
            {
              status: "Cancelled",
            },
            { where: { contractId: contract.id } }
          );

          await session.db.query(
            `update booked_desks bd, bookings b set bd.status='InUse',bd.ended=null
              where bd.bookingId=b.id and  bd.contractId=b.contractId and bd.bookingId=` +
              contract.bookingId
          );
        }
        data.status = "Cancelled";
      }

      await Contract.update(data, { where: { id: data.id } });

      if (  data.kind == "NewBooking" && contract.status == "Approved" &&
        (contract.token > 0 || contract.tokenSD > 0) ) {
        await service.raiseTokenInvoice(contract.bookingId);
      }
    } else {
      contract.date = new Date();
      contract = await Contract.create(data);
    }
    return contract;
  } catch (e) {
    log.write("BookingService ::: saveContract :: exception : ", e);
    throw e;
  }
};

service.listClients = async (data) => {
  try {
    log.write("BookingService ::: listClients :: data : ", data);
    var where = { companyId: data.companyId };
    if (data.filters.search) {
      var $or = [];
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("name")), {
          $like: "%" + data.filters.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("gstNo")), {
          $like: "%" + data.filters.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("company")), {
          $like: "%" + data.filters.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("email")), {
          $like: "%" + data.filters.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("phone")), {
          $like: "%" + data.filters.search.toLowerCase() + "%",
        })
      );
      where["$and"] = { $or: $or };
    }
    var result = await Client.findAll({
      attributes: [
        "id",
        "name",
        "company",
        "phone",
        "email",
        "gstNo",
        "panNo",
        "website",
        "address",
      ],
      where: where,
      include: [{ as: "booking", where: {status:"Active", id:{ [Op.not]: null }}, model: Booking, attributes: ["id"] }],
      offset: data.offset || 0,
      limit: data.limit || 10,
    });
    return result;
  } catch (e) {
    log.write("BookingService ::: listClients :: exception : ", e);
    throw e;
  }
};
service.saveContractTerm = async (data, username) => {
  try {
    log.write("BookingService ::: saveContractTerm :: data : ", data);
    var term = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      await ContractTerm.update(data, { where: { id: data.id } });
    } else {
      term = await ContractTerm.create(data);
    }
    return term;
  } catch (e) {
    log.write("BookingService ::: saveContractTerm :: exception : ", e);
    throw e;
  }
};
service.saveClient = async (data, username) => {
  try {
    log.write("BookingService ::: saveClient :: data : ", data);
    var client = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    // data.address = data.address || '';
    // data.company = data.company || '';
    if (data.id) {
      await Client.update(data, { where: { id: data.id } });
      client = await Client.findOne({ where: { id: data.id } });
    } else {
      client = await Client.create(data);
    }
    return client;
  } catch (e) {
    log.write("BookingService ::: saveClient :: exception : ", e);
    throw e;
  }
};
service.saveBookedDesk = async (data, username) => {
  try {
    log.write("BookingService ::: saveBookedDesk :: data : ", data);
    var desk = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      BookedDesk.update(data, { where: { id: data.id } });
      desk = data;
    } else {
      desk = await BookedDesk.create(data);
    }
    return desk;
  } catch (e) {
    log.write("BookingService ::: saveBookedDesk :: exception : ", e);
    throw e;
  }
};
service.saveBookedParkingSpots = async (data, username) => {
  try {
    log.write("BookingService ::: saveBookedParkingSpots :: data : ", data);
    var desk = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      BookedDesk.update(data, { where: { id: data.id } });
      desk = data;
    } else {
      desk = await ParkingBookedSpots.create(data);
    }
    return desk;
  } catch (e) {
    log.write("BookingService ::: saveBookedDesk :: exception : ", e);
    throw e;
  }
};
service.saveAdditionalInvoice = async (data, username) => {
  try {
    log.write("BookingService ::: saveAdditionalInvoice :: data : ", data);
    var desk = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      await ContractAdditionalInvoice.update(data, { where: { id: data.id } });
      desk = data;
    } else {
      data.status = "Published";
      desk = await ContractAdditionalInvoice.create(data);
    }
    return desk;
  } catch (e) {
    log.write("BookingService ::: saveAdditionalInvoice :: exception : ", e);
    throw e;
  }
};
service.saveEmployee = async (data, username) => {
  try {
    log.write("BookingService ::: saveEmployee :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      ClientEmployee.update(data, { where: { id: data.id } });
      item = data;
    } else {
      item = await ClientEmployee.create(data);
      service.sendEmployeeVerification({ id: item.id });
    }
    return item;
  } catch (e) {
    log.write("BookingService ::: saveEmployee :: exception : ", e);
    throw e;
  }
};
service.findEmployee = async (data) => {
  try {
    log.write("BookingService ::: findEmployee :: data : ", data);
    var where = {};
    if (data.otpVerified && data.phone) {
      where = { phone: data.phone };
    } else {
      where = { email: data.filters.email };
    }
    var result = await ClientEmployee.findOne({
      where: where,
      include: ["client", "company"],
    });
    return result;
  } catch (e) {
    log.write("BookingService ::: findEmployee :: exception : ", e);
    throw e;
  }
};
service.listEmployees = async (data) => {
  try {
    log.write("BookingService ::: listEmployees :: data : ", data);
    var where = {};
    if (data.filters.clientId) {
      where.clientId = data.filters.clientId;
    }
    if (data.filters.department) {
      where.department = data.filters.department;
    }
    var result = await ClientEmployee.findAll({ where: where });
    return result;
  } catch (e) {
    log.write("BookingService ::: listEmployees :: exception : ", e);
    throw e;
  }
};
service.deleteEmployee = async (id) => {
  try {
    log.write("BookingService ::: deleteEmployee :: id : ", id);
    var result = await ClientEmployee.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("BookingService ::: deleteEmployee :: exception : ", e);
    throw e;
  }
};
service.sendEmployeeVerification = async (data) => {
  try {
    log.write("BookingService ::: sendEmployeeVerification :: data : ", data);
    var where = { verified: null, hasAccess: 1 };
    if (data.id) {
      where.id = data.id;
    }
    if (data.clientId) {
      where.clientId = data.clientId;
    }
    log.write("BookingService ::: sendEmployeeVerification :: where : ", where);
    var unverifiedEmployees = await ClientEmployee.findAll({
      where: where,
      include: ["client"],
    });
    log.write(
      "BookingService ::: sendEmployeeVerification :: unverifiedEmployees : " +
        unverifiedEmployees.length
    );
    for (var i = 0; i < unverifiedEmployees.length; i++) {
      var employee = unverifiedEmployees[i];
      var linkData = {
        employeeId: employee.id,
        companyId: data.companyId,
      };
      var selfCareLink = await systemUtils.createSelfCareLink(
        "EmployeeVerification",
        "employee-verification",
        linkData,
        employee.companyId
      );

      var msg =
        "We are happy to announce <strong>SelfCare Portal for HustleHub</strong> clients. You can directly access our help for any of your company operational concerns with HustleHub through our Selfcare Portal. " +
        "<br><br> We request you to verify yourself as employee of <strong>" +
        employee.client.company +
        "</strong> at this link to proceed further. <a href='" +
        selfCareLink.url +
        "'> Click here to Verify</a>";

      msg = `Greetings from Hustlehub!!!<br><br>

      <strong>"The Internet has changed everything. We expect to know everything instantly. If you don't understand digital communication, you're at a disadvantage" - Bob Parsons</strong>
      <br><br>
      We at Hustlehub are constantly striving to better our processes and to provide the best client support to you. In order to take the client service to the next level so that you don't have to go through the hassle of sending mails or calling the support team, we have decided to go completely digital.
       <br><br>
      Every communication starting today will be completely through our mobile browser app and website. Users can login and access by visiting on <a href='https://my.hustlehub.xyz' target="_blank">https://my.hustlehub.xyz</a> or by visiting our website <a href='https://www.hustlehub.xyz' target="_blank">https://www.hustlehub.xyz</a> and Client SelfCare Portal link under Contact Menu.   
       <br><br>
      You can use the selfcare portal for the following -  <br>
      1) Issues with Services & Utilities  <br>
      2) Repairs to furnitures & fixtures <br>
      3) Sales <br>
      4) Financial <br>
      ...and many more.`;

      msg =
        msg +
        "<br><br> We request you to verify yourself as employee of <strong>" +
        employee.client.company +
        "</strong> at this link to start accesing our selfcare portal. <a href='" +
        selfCareLink.url +
        "'> Click here to Verify</a>";
      msg =
        msg +
        "<br><br>We look forward to hear your feedback and suggestions to help the Hustlehub family grow bigger and become better.";
      var company = await systemUtils.getCompany(employee.companyId);
      var mailData = {
        name: employee.name,
        msg: msg,
        supportPhone: company.supportPhone,
        supportEmail: company.supportEmail,
        teamName: "Team " + company.name,
      };
      log.write(
        "BookingService ::: sendEmployeeVerification :: mailData : ",
        mailData
      );

      var mailBody = await services.getMailBody(
        "emails/context_notification.html",
        mailData
      );
      log.write(
        "BookingService ::: sendEmployeeVerification :: mailBody : ",
        mailBody.length
      );
      var receivers = [];
      receivers.push({
        name: employee.name,
        email: employee.email,
      });
      await services.sendMail(
        company.name + " :: Welcome to Hustlehub Selfcare portal",
        mailBody,
        receivers
      );
    }
    return unverifiedEmployees.length;
  } catch (e) {
    log.write("BookingService ::: sendEmployeeVerification :: exception : ", e);
    throw e;
  }
};

service.saveInvoice = async (data, username) => {
  try {
    log.write("BookingService ::: saveInvoice :: data : ", data);
    var invoice = {};
    var refinvoice = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      if(!data.refNo){
        refinvoice = await Invoice.findOne({ where: { id: data.id } });
        var booking = await service.getBooking(refinvoice.bookingId);
        if (invoice.isLiability) {
          data.refNo = await systemUtils.getRefNo("Liability", booking.id, refinvoice.date, booking.company);
        } 
        else if(invoice.type=='AncillaryRevenue'){
          data.refNo = await systemUtils.getRefNo("AncillaryRevenue", booking.id, refinvoice.date, booking.company);
        }
        else if(invoice.type=='Parking'){
          data.refNo = await systemUtils.getRefNo("Parking", booking.id, refinvoice.date, booking.company);
        }
        else if(invoice.type=='FoodAndBeverages'){
          data.refNo = await systemUtils.getRefNo("FoodAndBeverages", booking.id, refinvoice.date, booking.company);
        }
        else {
          data.refNo = await systemUtils.getRefNo("MonthlyInvoice", booking.id, refinvoice.date, booking.company);
        }
      }
      if (!data.tdsSubmitted) {
        invoice = await Invoice.findOne({ where: { id: data.id } });
        console.log("Invoice :::::::::::::: ", invoice)
        data.gst = invoice.gst > 0 ? data.taxableAmount * 0.18 : 0;
        data.cgst = invoice.cgst > 0 ? data.taxableAmount * 0.09 : 0;
        data.sgst = invoice.sgst > 0 ? data.taxableAmount * 0.09 : 0;
        data.igst = invoice.igst > 0 ? data.taxableAmount * 0.18 : 0;
        //invoice.tds > 0 && 
        if ((data.taxableAmount*12)>=240000 && data.type!='Liability') {
          data.tds = data.taxableAmount * 0.1;
          data.hasTds = 1;
        } else {
          data.tds = 0;
          data.hasTds = 0;
        }

        data.amount = data.taxableAmount * 1.18 - data.tds;
      }
      //data.remarks = data.description;
      if(data.type=='FoodAndBeverages' || invoice.type=='FoodAndBeverages'){
        data.gst = invoice.gst > 0 ? data.taxableAmount * 0.05 : 0;
        data.cgst = invoice.cgst > 0 ? data.taxableAmount * 0.025 : 0;
        data.sgst = invoice.sgst > 0 ? data.taxableAmount * 0.025 : 0;
        data.tds = 0;
        data.hasTds = 0;

      }

      console.log("Save invoice : service:: data ::", data);

      await Invoice.update(data, { where: { id: data.id } });
      if (data.refNo) {
        let invoice_item = {
        price:data.taxableAmount,
        amount:data.taxableAmount,
        tds: data.tds > 0 ? data.taxableAmount * 0.1 : 0,
        gst: data.gst > 0 ? data.taxableAmount * 0.18 : 0,
        cgst:data.gst > 0 ? data.taxableAmount * 0.09 : 0,
        sgst:data.gst > 0 ? data.taxableAmount * 0.09 : 0,
        igst:invoice.igst > 0 ? data.taxableAmount * 0.18 : 0,
        total:data.taxableAmount+data.gst-data.tds,
        item: data.items[0].item
        }
        if(data.type=='FoodAndBeverages' || invoice.type=='FoodAndBeverages'){
          invoice_item.gst = invoice.gst > 0 ? data.taxableAmount * 0.05 : 0;
          invoice_item.cgst = invoice.cgst > 0 ? data.taxableAmount * 0.025 : 0;
          invoice_item.sgst = invoice.sgst > 0 ? data.taxableAmount * 0.025 : 0;
          data.tds = 0;
          data.hasTds = 0;
        }   
        await InvoiceItem.update(invoice_item, { where: { invoiceId: data.id } });
        invoice = await service.getInvoice(data.id);
       console.log("Invoiceeeeeeeeeeee ::: ",JSON.parse(JSON.stringify(invoice)))
        let doc = await service.generateInvoicePdf(invoice);
       // console.log(":::::::::::; DOC :::::::::", doc)
        let pdfIdUpdate = { pdfId: doc.id }
        await Invoice.update(pdfIdUpdate, { where: { id: data.id } });
      }
      invoice = data;
    } else {
      var booking = await service.getBooking(data.bookingId);
      if (data.isLiability) {
        data.amount = data.taxableAmount;
        data.sgst = 0;
        data.cgst = 0;
        data.igst = 0;
        data.gst = 0;
        data.tds = 0;
      } else {
        var hasTds = service.hasTds(
          booking.contract.rent,
          booking.startDate,
          data.date
        );
        data.tds=0;
        data.hasTds;
        if (data.taxableAmount>19000) {
          data.tds = data.taxableAmount * 0.1;
          data.hasTds = 1;
        }
        var invoiceService = await InvoiceService.findOne({
          where: { id: data.invoiceServiceId },
        });
        data.sgst = Math.round(
          data.taxableAmount * (invoiceService.sgst / 100),
          2
        );
        data.cgst = Math.round(
          data.taxableAmount * (invoiceService.cgst / 100),
          2
        );
        data.gst = data.sgst + data.cgst;
        if (hasTds) {
          data.tds = Math.round(
            data.taxableAmount * (invoiceService.tds / 100),
            2
          );
        }
        data.amount = data.taxableAmount + data.gst - data.tds;
      }
      data.status = "Pending";
      data.paid = 0;
      data.due = data.amount;
      invoice = await Invoice.create(data);
      var refNo;
      if (invoice.isLiability) {
        refNo = await systemUtils.getRefNo("Liability", booking.id, invoice.date, booking.company);
      } 
      else if(invoice.type=='AncillaryRevenue'){
        refNo = await systemUtils.getRefNo("AncillaryRevenue", booking.id, invoice.date, booking.company);
      }
      else if(invoice.type=='Parking'){
        refNo = await systemUtils.getRefNo("Parking", booking.id, invoice.date, booking.company);
      }
      else if(invoice.type=='FoodAndBeverages'){
        refNo = await systemUtils.getRefNo("FoodAndBeverages", booking.id, invoice.date, booking.company);
      }
      else {
        refNo = await systemUtils.getRefNo("MonthlyInvoice", booking.id, invoice.date, booking.company);
      }      invoice.set("refNo", refNo);
      invoice.save();

      var item = {
        invoiceId: invoice.id,
        invoiceServiceId: invoice.invoiceServiceId,
        item:
          data.description ||
          booking.deskNames.length + " desks in " + booking.offices,
        qty: booking.deskNames.length || 1,
        price: booking.contract.rent / booking.deskNames.length || 1,
        amount: data.taxableAmount,
        cgst: data.cgst || 0,
        sgst: data.sgst || 0,
        igst: data.igst || 0,
        total: data.taxableAmount + data.gst,
      };
      if (data.isLiability) {
        item.item = data.description || "Security Deposit Charge";
        item.price = data.taxableAmount;
        item.qty = 1;
      }
      await InvoiceItem.create(item);

      if (!invoice.pdfId && invoice.refNo) {
        invoice = await service.getInvoice(invoice.id);
        await service.generateInvoicePdf(invoice);
      }

      if (data.sendNotification) {
        await service.sendInvoice(invoice.id);
      }
    }
    if (!data.tdsSubmitted) {
      await service.updateBookingLedger(data.bookingId);
    }
    return invoice;
  } catch (e) {
    log.write("BookingService ::: saveInvoice :: exception : ", e);
    throw e;
  }
};
service.savePayment = async (data, username) => {
  try {
    log.write("BookingService ::: savePayment :: data : ", data);
    var payment = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id || (data.utr && !data.bookingId)) {
      var where = { id: data.id };
      if (data.cancelled) {
        data.cancelled = 1;
        data.cancelledBy = username;
        data.cancelledDate = new Date();
        data.active = 0;
        if (!where.id) {
          where = { utr: data.utr };
        }
      }
      await Payment.update(data, { where: where });
      payment = data;
    } else {
      data.active = 1;
      data.paidBy = username;
      payment = await Payment.create(data);
    }
    if (data.bookingId) {
      await service.updateBookingLedger(data.bookingId);
      if (!data.cancelled) {
        systemUtils.addActivity(
          {
            activity: "PaymentReceived",
            update:
              data.update ||
              "Amount of Rs. " +
                data.amount +
                " from bookingId : " +
                data.bookingId,
            companyId: data.companyId,
          },
          username
        );
        service.sendPaymentConfirmation(data.bookingId, data.amount);
      }
    }
    return payment;
  } catch (e) {
    log.write("BookingService ::: savePayment :: exception : ", e);
    throw e;
  }
};
service.saveUrnPayment = async (data, username) => {
  try {
    log.write("BookingService ::: saveUrnPayment :: data : ", data);
    var payment = {};
    if (data.id) {
      await UrnPayment.update(data, { where: { id: data.id } });
      payment = data;
    } else {
      data.submitedDate = new Date();
      payment = await UrnPayment.create(data);
    }
    return payment;
  } catch (e) {
    log.write("BookingService ::: saveUrnPayment :: exception : ", e);
    throw e;
  }
};

service.getInvoice = async (id) => {
  console.log(":::::::::: Get Invoice :::::::::")
  var invoice = await Invoice.findOne({
    where: { id: id },
    include: [
      { as: "items", model: InvoiceItem, include: ["invoiceService"] },
      "invoiceService",
      "pdf", "parkingPdf",
      { as: "booking", model: Booking, include: [{ as: "client", model: Client, include: [ "employees"] }, "company"] },
    ],
  });

  return invoice;
};
service.sendInvoice = async (invoiceId) => {
  try {
    var invoice = await service.getInvoice(invoiceId);
    if (invoice) {
      var pdf = invoice.pdf;

      console.log("Bookings :: BookingService: sendInvoice :: ", invoice.toJSON())
      if (!invoice.pdfId && invoice.refNo) {
        console.log("Bookings :: BookingService: sendInvoice :: generateInvoicePdf", invoice)
        pdf = await service.generateInvoicePdf(invoice);
      }

      var linkId = uuid();
      var data = {
        bookingId: invoice.bookingId,
      };
      var urlLink = config.selfcareUrl + "#/selfcare/pending-payment/" + linkId;
      SelfcareLink.create({
        linkId: linkId,
        url: urlLink,
        context: "PendingPayment",
        data: JSON.stringify(data),
        created: new Date(),
        companyId: invoice.booking.company.id,
      });

      var items = [];
      _.each(invoice.items, function (i) {
        items.push({
          item: i.item,
          amount: i.amount,
          igst: i.igst,
          cgst: i.cgst,
          sgst: i.sgst,
          total: i.total,
        });
      });
      var subTotal = _.sumBy(invoice.items, "total");
      var hasIgst =
        invoice.booking.client.stateCode &&
        invoice.booking.client.stateCode != invoice.booking.company.stateCode
          ? 1
          : 0;
      var data = {
        clientName: invoice.booking.client.name,
        refNo: invoice.booking.refNo,
        companyName: invoice.booking.company.name,
        startDate: utils.moment(invoice.booking.started).format("MMM DD, YYYY"),
        dueDate: utils.moment(invoice.dueDate).format("MMM DD, YYYY"),
        month: utils.moment(invoice.date).format("MMM YYYY"),
        hasIgst: hasIgst,
        link: urlLink,
        items: items,
        grandTotal: subTotal,
        accountName: invoice.booking.company.accountName,
        bankName: invoice.booking.company.bankName,
        bankBranch: invoice.booking.company.branchName,
        accountNumber: invoice.booking.company.accountNumber,
        ifscCode: invoice.booking.company.ifscCode,
        supportPhone: invoice.booking.company.supportPhone,
        supportEmail: invoice.booking.company.supportEmail,
      };

      var html = await services.getMailBody(
        "emails/invoice_notification_temp.html",
        data
      );
      log.write("BookingService ::: sendInvoice :: html body : " + html.length);
      var attachments;
      if (pdf) {
        attachments = [{ filename: pdf.name, path: pdf.file }];
      }
      if(invoice.parkingPdf != null){
        attachments.push({filename: invoice.parkingPdf.name, path: invoice.parkingPdf.file})
      }
      console.log("Send Invoice :: Attachements:: ", attachments)
      var subject = "HustleHub - Rental Invoice for " + data.month +" ("+invoice.refNo+")";
      //   data.companyName + " : " + data.month + " Tax Invoice Notification";
      // if (invoice.isLiability) {
      //   subject = data.companyName + " : SecurityDeposit Invoice Notification";
      // }

      let receivers =  [{
          name: invoice.booking.client.name,
          email: invoice.booking.client.email,
          bookingId: invoice.booking.id,
        },];

        if(invoice.booking.client.employees) {
          _.each(invoice.booking.client.employees, function (d) {
            if (d.id) {
              receivers.push({
                name: d.name,
                email: d.email,
                bookingId: invoice.booking.id,
              });
            }})
        }


      var mail = await services.sendMail(
        subject,
        html,
        receivers,
        attachments
      );
      if(mail.status == "Sent"){
        await Invoice.update( { isSent: 1 },{ where: { id: invoiceId } });
      }

      var message =
        subject +
        ". Dear " +
        data.clientName +
        ", an amount of Rs. " +
        data.grandTotal +
        " invoice is generated for the month of " +
        data.month +
        ". Please pay on or before due date " +
        data.dueDate +
        " to avoid penalities. Team " +
        data.companyName;
      var to = invoice.booking.client.phone + "";
      //var response = await services.sendSMS(to, message);

      return mail;
    } else {
      throw "Invoice not found for given ID " + invoiceId;
    }
  } catch (e) {
    log.write("BookingService ::: sendInvoice :: exception : ", e);
    throw e;
  }
};
service.generateInvoicePdf = async (invoice) => {
  try {
    var subTotal = _.sumBy(invoice.items, "total");
    var hasIgst = invoice.booking.client.stateCode &&
      invoice.booking.client.stateCode != invoice.booking.company.stateCode ? 1 : 0;
      var hasgst = invoice.isLiability ? 0 : 1;

    var hasTds = invoice.hasTds;        
    var items = [];
    _.each(invoice.items, function (i) {
      var description = invoice.invoiceService ? invoice.invoiceService.name : "";
      if (
        invoice.type == "CoWorkingOffice" ||
        invoice.type == "PrivateOffice" ||
        invoice.type == "FixedDeskRent" ||
        invoice.type == "Liability" ||
        invoice.type == "CreditInvoice"
      ) {  description = i.item; }

      items.push({
        item: i.item || description,
        sacCode: i.invoiceService ? i.invoiceService.sacCode : "-",
        amount: i.amount.toLocaleString('en-IN'),
        igst: i.igst.toLocaleString('en-IN'),
        cgst: i.cgst.toLocaleString('en-IN'),
        sgst: i.sgst.toLocaleString('en-IN'),
        gst: (i.cgst + i.sgst).toLocaleString('en-IN'),
        tds: i.tds.toLocaleString('en-IN'),
        total: i.total.toLocaleString('en-IN'),
        qty: '',
        unitPrice: '',
      });
    });
    var data = {
      companyLogo: invoice.booking.company.logo,
      companyName: invoice.booking.company.tradeName,
      gstIn: invoice.booking.company.gstNo,
      pan: invoice.booking.company.panNo,
      cin: invoice.booking.company.cin,
      stateCode: invoice.booking.company.stateCode,
      title: invoice.invoiceService
        ? invoice.isLiability
          ? "Security Deposit"
          : "Tax Invoice"
        : "Proforma Invoice",
      refNo: invoice.refNo,
      invoiceTaxableAmount:invoice.taxableAmount.toLocaleString('en-IN'),
      invoiceTotalGST: invoice.gst.toLocaleString('en-IN'),
      invoiceTotalCGST: (invoice.gst/2).toLocaleString('en-IN'),
      invoiceTotalSGST: (invoice.gst/2).toLocaleString('en-IN'),
      invoiceTotalTDS: invoice.tds.toLocaleString('en-IN'),
      invoiceGrandTotal:invoice.amount.toLocaleString('en-IN'),
      invoiceTotalDesks: invoice.booking.desks,
      invoiceTotalGSTText: toWords.convert(invoice.gst, { currency: true }),
      date: utils.moment(invoice.date).format("MMM DD, YYYY"),
      dueDate: utils.moment(invoice.dueDate).format("MMM DD, YYYY"),
      place: invoice.booking.company.city + ", " + invoice.booking.company.state,
      clientName: invoice.booking.client.company || invoice.booking.client.name,
      clientAddress: invoice.booking.client.address,
      clientGst: invoice.booking.client.gstNo,
      clientEmail: invoice.booking.client.email,
      clientPhone: invoice.booking.client.phone,
      companyName: invoice.booking.company.tradeName,
      companyAddress: invoice.booking.company.address,
      companyEmail: invoice.booking.company.email,
      hasIgst: hasIgst,
      hasgst: hasgst,
      hasTds: hasTds,
      igst: invoice.invoiceService ? invoice.invoiceService.igst : "-",
      cgst: invoice.invoiceService ? invoice.invoiceService.cgst : "-",
      sgst: invoice.invoiceService ? invoice.invoiceService.sgst : "-",
      tds: invoice.invoiceService ? invoice.invoiceService.tds : "-",
      items: items,
      grandTotal: subTotal.toLocaleString('en-IN'),
      grandTotalText: toWords.convert(subTotal, { currency: true }),
      accountName: invoice.booking.company.accountName,
      bankName: invoice.booking.company.bankName,
      bankBranch: invoice.booking.company.branchName,
      accountNumber: invoice.booking.company.accountNumber,
      ifscCode: invoice.booking.company.ifscCode,
    };
    let ClientCompanyName = data.clientName;
    let ccn = ClientCompanyName.toLowerCase().replace(/[^a-z0-9\-_\.]/g, "_")
    log.write("BookingService ::: generateInvoicePdf :: pdf  data : ", data);

console.log("\n\n\ninvoice.title\n\n\n", invoice)

    var tmpFile ;
    if(invoice.type == "Liability" || data.title == 'Security Deposit' || invoice.name == 'Security Deposit Charge'){
      tmpFile = await services.parseContent("pdfs/sd.html", data);
    }
    else {
      tmpFile = await services.parseContent("pdfs/tally.html", data);
    }  
  
	var doc = await services.createDoc(
      ccn + "_INV_" + invoice.booking.id + "_" +
        utils.moment(invoice.date).format("MMM_YYYY") + ".pdf");

    await services.generatePdf(tmpFile, path.basename(doc.file));
    invoice.set("pdfId", doc.id);
    await invoice.save();
    log.write("BookingService ::: generateInvoicePdf :: doc : ", doc);

    return doc;
  } catch (e) {
    log.write("BookingService ::: generateInvoicePdf :: exception : ", e);
    throw e;
  }
};

service.raiseNextMonthInvoice = async (data) => {
  try{
    log.write("BookingService ::: raiseNextMonthInvoice :: data : ", data);
    //var booking = await service.getBooking(data.bookingId);
    let gcrb = {"bookingId":data.bookingId,
                "companyId" :1,
                "startDate":"2000-08-01",
                "endDate":"2050-10-31"};
    let newContractDate = await service.getContractRenewalBookings(gcrb);
    log.write("BookingService ::: raiseNextMonthInvoice :: newContractDate : ", newContractDate);
    var invoice = await Invoice.findOne({ where: { bookingId: data.bookingId, type: { $in: ["OfficeRent", "Monthly"] }, isCancelled: 0 },
    order: [['startDate', 'DESC']],
    limit: 1
  });
    let a =parseInt(utils.moment(invoice.startDate).format("M"));
    let b = parseInt(utils.moment().format("M"));
    let c;
    if(newContractDate.length){
    log.write("BookingService ::: raiseNextMonthInvoice :: invoice : ", JSON.stringify(invoice));
    log.write("BookingService ::: raiseNextMonthInvoice :: invoice startDate month : ", a);
    log.write("BookingService ::: raiseNextMonthInvoice :: invoice This Month : ", b);
    log.write("BookingService ::: raiseNextMonthInvoice :: newEffectiveDate Month : ", utils.moment(newContractDate[0].newEffectiveDate).format("M YYYY"));
    log.write("Condition:: --- ", utils.moment(invoice.startDate).isBefore(utils.moment()));
    log.write("Condition:: ", utils.moment(invoice.startDate).isBefore(utils.moment(newContractDate[0].newEffectiveDate)));
    if( utils.moment(invoice.startDate).isBefore(utils.moment().add(1, "M"), 'month') && 
      utils.moment(invoice.startDate).isBefore(utils.moment(newContractDate[0].newEffectiveDate))){
     let Invoiceitem =   {
      id: data.bookingId,
      invoiceId: null,
      status: 'Active',
      refNo: null,
      invoiceDate: utils.moment(invoice.startDate).add(1, "M").startOf('month').format("YYYY-MM-DD"),
      started: '2023-08-10T00:00:00.000Z',
      ended: null
    }
    log.write("BookingService ::: raiseNextMonthInvoice :: Invoiceitem : ", Invoiceitem);
     await service.raiseInvoice(Invoiceitem, data.sendNotifications);
     return Invoiceitem;
  }
  else {
    if(utils.moment(invoice.startDate).isSameOrAfter(utils.moment().add(-1, "M"), 'month'))
    return `You are allowed to raise invoices till current month only`;
    else
    return `Please check contract renewal : ${utils.moment(newContractDate[0].newEffectiveDate).format("MMMM YYYY")}`;}    
  }
    else {return "Please Check if Client is onBoarded";}
  } catch (e) {
    log.write("BookingService ::: raiseNextMonthInvoice :: exception : ", e);
    throw e;
  }    
};  

service.raiseInvoice = async (data, sendNotifications) => {
  try {
    log.write("BookingService ::: raiseInvoice :: data : ", data);
    var booking = await service.getBooking(data.id);
    //console.log("LLLLLLLLLLLLLLLLLLLLL REFNO -- 1", invoice.refNo)
    if (booking) {
      var invoice;
      if (data.invoiceId) {
        invoice = await Invoice.findOne({ where: { id: data.invoiceId } });
        // if (utils.moment().isSame(utils.moment(invoice.date), 'month')) {
          console.log("LLLLLLLLLLLLLLLLLLLLL REFNO -- 2", invoice.refNo)  
        if (!invoice.refNo) {
          console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLL -- 1")
          var refNo = await systemUtils.getRefNo(
            "MonthlyInvoice",
            booking.id,
            invoice.date,
            booking.company,
            booking.contract
          );
          invoice.set("refNo", refNo);
          await invoice.save();
        }
      } else {
        invoice = {
          bookingId: data.id,
          status: "Pending",
          date: utils.moment(data.invoiceDate).format("YYYY-MM-DD"),
          startDate: utils.moment(data.invoiceDate).format("YYYY-MM-DD"),
          endDate: utils
            .moment(data.invoiceDate)
            .endOf("month")
            .format("YYYY-MM-DD"),
          dueDate: utils
            .moment(data.invoiceDate)
            .add(4, "days")
            .format("YYYY-MM-DD"),
          type: booking.contract.invoiceServiceType,
          name:
            booking.contract.invoiceServiceType +
            " Rent for " +
            utils.moment(data.invoiceDate).format("MMM YYYY"),
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
        };
        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "OfficeRent",
            type: "Monthly",
            status: "Published",
            companyId: booking.companyId,
          },
        });
        // log.write("BookingService ::: raiseInvoice :: invoiceService : " + booking.contract.invoiceServiceType + " " + booking.companyId, invoiceService);
        if (invoiceService) {
          invoice.invoiceServiceId = invoiceService.id;
        }
        if (data.ended) {
          invoice.endDate = utils.moment(data.ended).format("YYYY-MM-DD");
        }
        if (  utils.moment(booking.started) 
                   .isAfter(utils.moment(invoice.startDate)) ||
              utils.moment(booking.started)
                   .isSame(utils.moment(invoice.startDate)) ) {
          invoice.dueDate = utils
            .moment(invoice.startDate)
            .add(-1, "days")
            .format("YYYY-MM-DD");
        }
        var rent = booking.contract.rent,
          amount = 0,
          taxableAmount = 0,
          gst = 0,
          igst = 0,
          cgst = 0,
          sgst = 0,
          tds = 0;

        var futureContract = await Contract.findOne({
          where: {
            bookingId: booking.id,
            status: { $ne: "Cancelled" },
            effectiveDate: { $between: [invoice.startDate, invoice.endDate] },
          },
        });
        var oldRent = 0,
          newRent = 0;

        if (futureContract) {
          var noOfDays = utils.moment(futureContract.effectiveDate).date() - 1;
          oldRent =
            (booking.contract.rent / utils.moment(invoice.date).daysInMonth()) *
            noOfDays;
          var remainingDays =
            utils.moment(invoice.date).daysInMonth() - noOfDays;
          newRent =
            (futureContract.rent / utils.moment(invoice.date).daysInMonth()) *
            remainingDays;
          log.write(
            "BookingService ::: raiseInvoice :: new rents : " +
              oldRent +
              " - " +
              newRent
          );

          taxableAmount = oldRent + newRent;
        } else {
          log.write("BookingService ::: raiseInvoice :: invoice : ", invoice);
          var days =
            utils.moment(invoice.endDate).diff(invoice.startDate, "days") + 1;
          log.write("BookingService ::: raiseInvoice :: days : ", days);
          var rentPerDay = rent / utils.moment(invoice.date).daysInMonth();
          log.write(
            "BookingService ::: raiseInvoice :: rentPerDay : ",
            rentPerDay
          );

          taxableAmount = Math.round(rentPerDay * days, 2);
        }
        console.log("LLLLLLLLLLLLLLLLLLLLL REFNO -- 3", invoice.refNo)
        // if (booking.client.stateCode && booking.client.stateCode != booking.company.stateCode) {
        //   igst = Math.round(taxableAmount * (invoiceService.igst / 100), 2);
        //   gst = igst;
        // } else {  
        sgst = Math.round(taxableAmount * (invoiceService.sgst / 100), 2);
        cgst = Math.round(taxableAmount * (invoiceService.cgst / 100), 2);
        gst = sgst + cgst;
        // }
        if (service.hasTds(rent, booking.started, invoice.date)) {
          tds = Math.round(taxableAmount * (invoiceService.tds / 100), 2);
        }
        amount = taxableAmount + gst - tds;


        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;
        invoice.due = amount;
        invoice.paid = 0;
        let tdsFlag;
        if(taxableAmount>20000){ tdsFlag = 1; invoice.tds = Math.round(taxableAmount * 0.10, 2)}
        invoice.hasTds = tdsFlag;
        invoice = await Invoice.create(invoice);
        // if (utils.moment().isSame(utils.moment(invoice.date), 'month')) {
        var refNo = await systemUtils.getRefNo(
          "MonthlyInvoice",
          booking.id,
          invoice.date,
          booking.company,
          booking.contract
        );
        invoice.set("refNo", refNo);
        invoice.save();
        // }
        
        var itemDescription = "";
        var qty = 0,
          price = 0;
        var bookedDesks = await BookedDesk.findAll({
          where: { status: "InUse" },
        });

        if (futureContract) {
          itemDescription = "Business Services for period of " +
            utils
              .moment(futureContract.effectiveDate)
              .startOf("month")
              .format("MMM DD, YYYY") +
            " - " +
            utils
              .moment(futureContract.effectiveDate)
              .add(-1, "days")
              .format("MMM DD, YYYY");
          qty = booking.bookedDesks.length;
          price = oldRent / booking.bookedDesks.length;
          if (booking.contract.isSqftRent) {
            qty = booking.contract.sqFt;
            price = booking.contract.sqFtPrice;
            itemDescription = "Business Services for period of " +
              utils
                .moment(futureContract.effectiveDate)
                .startOf("month")
                .format("MMM DD, YYYY") +
              " - " +
              utils
                .moment(futureContract.effectiveDate)
                .add(-1, "days")
                .format("MMM DD, YYYY");
          }
          var item = {
            invoiceId: invoice.id,
            invoiceServiceId: invoiceService ? invoiceService.id : null,
            item: itemDescription,
            qty: qty,
            price: price,
            amount: oldRent,
            tds: oldRent * (invoiceService.tds / 100),
            cgst: oldRent * (invoiceService.cgst / 100),
            sgst: oldRent * (invoiceService.sgst / 100),
            igst: oldRent * (invoiceService.igst / 100),
          };

        console.log("Futurecontract after iteeeem deksts issue treacker:::",item );
          item.total = item.amount + item.igst;
          if (item.total) {
            await InvoiceItem.create(item);
          }

          var newBookedDesks = await BookedDesk.findAll({
            where: { contractId: futureContract.id },
            include: [
              {
                as: "desk",
                model: Desk,
                include: [
                  {
                    as: "cabin",
                    model: Cabin,
                    include: ["office"],
                  },
                ],
              },
            ],
          });
          var newOffices = [];
          if (newBookedDesks.length) {
            _.each(newBookedDesks, function (d) {
              newOffices.push(d.desk.cabin.office.name);
            });
            newOffices = _.uniq(newOffices);
          }

          var newBookedDesksCount = newBookedDesks.length;
          if (futureContract.kind == "Expansion") {
            newBookedDesksCount =
              newBookedDesksCount + booking.bookedDesks.length;
          }

          itemDescription = "Business Services for period of " +
            utils.moment(futureContract.effectiveDate).format("MMM DD, YYYY") +
            " - " +
            utils
              .moment(futureContract.effectiveDate)
              .endOf("month")
              .format("MMM DD, YYYY");
          qty = newBookedDesksCount;
          price = newRent / newBookedDesksCount;
          if (futureContract.isSqftRent) {
            qty = futureContract.sqFt;
            price = futureContract.sqFtPrice;
            itemDescription =
              "Rent4 for " +
              futureContract.sqFt +
              " SqFt at price of Rs." +
              futureContract.sqFtPrice +
              " per SqFt in " +
              booking.offices +
              " <br> for period of " +
              utils
                .moment(futureContract.effectiveDate)
                .startOf("month")
                .format("MMM DD, YYYY") +
              " - " +
              utils
                .moment(futureContract.effectiveDate)
                .add(-1, "days")
                .format("MMM DD, YYYY");
          }
          item = {
            invoiceId: invoice.id,
            invoiceServiceId: invoiceService ? invoiceService.id : null,
            item: itemDescription,
            qty: qty,
            price: price,
            amount: newRent,
            tds: newRent * (invoiceService.tds / 100),
            cgst: newRent * (invoiceService.cgst / 100),
            sgst: newRent * (invoiceService.sgst / 100),
            igst: newRent * (invoiceService.igst / 100),
          };
          item.total = item.amount + item.igst;
          await InvoiceItem.create(item);
        } else {
          booking.desks = _.filter(booking.bookedDesks, { status: "InUse" }).length;
          //console.log("booking desks sgh dj lengtthh:::: ", booking.desks);
          //booking.desks = bookedDesks.length;
          itemDescription = "Business Services for period of " +
            utils.moment(invoice.startDate).format("MMM DD, YYYY") +
            " - " +
            utils.moment(invoice.endDate).format("MMM DD, YYYY");
            itemDescription = "Business Services for the Month of " +
            utils.moment(invoice.startDate).format("MMM - YYYY"); 
          qty = booking.desks || 1;
          price = booking.contract.rent / (booking.desks || 1);
          if (booking.contract.isSqftRent) {
            qty = booking.contract.sqFt;
            price = booking.contract.sqFtPrice;
            itemDescription = "Business Services for period of " +
              utils
                .moment(invoice.startDate)
                .startOf("month")
                .format("MMM DD, YYYY") +
              " - " +
              utils.moment(invoice.endDate).format("MMM DD, YYYY");
          }
          let tdsFlag;
          if(taxableAmount>20000){
            tds = taxableAmount * 0.1;
            tdsFlag = 1;
          }
          console.log("::::::::::::::::::INVOICE:::::::::::::::::::::::::;;;")
          var item = {
            invoiceId: invoice.id,
            invoiceServiceId: invoiceService ? invoiceService.id : null,
            item: itemDescription,
            qty: qty,
            price: price,
            amount: taxableAmount,
            hasTds: tdsFlag,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            tds: tds,
            total: taxableAmount + gst-tds,
          };
          console.log("::::::::::::::::::ITEMMM:::::::::::::::::::::::::;;;", item)
          await InvoiceItem.create(item);
        }
      }

      log.write(
        "BookingService ::: raiseInvoice :: additionalInvoices : " +
          booking.contract.additionalInvoices.length
      );
      if (booking.contract.additionalInvoices.length) {
        var invoiceAmount = invoice.amount;
        var invoiceGst = invoice.gst;
        var invoiceTds = invoice.tds;
        var invoiceTaxableAmount = invoice.taxableAmount;
        for (var i = 0; i < booking.contract.additionalInvoices.length; i++) {
          var additionalInvoice = booking.contract.additionalInvoices[i];
          log.write(
            "BookingService ::: raiseInvoice :: additionalInvoices : ",
            additionalInvoice
          );
          var price = additionalInvoice.amount / booking.desks;
          var qty = bookedDesks.length;
          if (booking.contract.isSqftRent) {
            price = additionalInvoice.amount / booking.contract.sqFt;
            qty = booking.contract.sqFt;
          }

          taxableAmount = additionalInvoice.amount;
          tds = Math.round(
            taxableAmount * (additionalInvoice.invoiceService.tds / 100),
            2
          );
          // if (booking.client.stateCode && booking.client.stateCode != booking.company.stateCode) {
          //   igst = Math.round(taxableAmount * (additionalInvoice.invoiceService.igst / 100), 2);
          //   gst = igst;
          // } else {
          sgst = Math.round(
            taxableAmount * (additionalInvoice.invoiceService.sgst / 100),
            2
          );
          cgst = Math.round(
            taxableAmount * (additionalInvoice.invoiceService.cgst / 100),
            2
          );
          gst = sgst + cgst;
          // }
          var item = {
            invoiceId: invoice.id,
            invoiceServiceId: additionalInvoice.invoiceServiceId,
            item:
              additionalInvoice.item +
              " <br> for period of " +
              utils
                .moment(invoice.startDate)
                .startOf("month")
                .format("MMM DD, YYYY") +
              " - " +
              utils.moment(invoice.endDate).format("MMM DD, YYYY"),
            qty: qty,
            price: price,
            amount: taxableAmount,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            tds: tds,
            total: taxableAmount + gst,
          };
          await InvoiceItem.create(item);

          invoiceTaxableAmount = invoiceTaxableAmount + taxableAmount;
          invoiceGst = invoiceGst + gst;
          invoiceTds = invoiceTds + tds;
          invoiceAmount = invoiceAmount + (taxableAmount + gst - tds);
        }

        invoice.set("taxableAmount", invoiceTaxableAmount);
        invoice.set("gst", invoiceGst);
        invoice.set("tds", invoiceTds);
        invoice.set("amount", invoiceAmount);
        await invoice.save();
      }

       log.write("BookingService ::: raiseInvoice :: invoice : ", invoice.toJSON());
      if (invoice.refNo && sendNotifications) {
        console.log("Noooooooooooooooootofication senddong")
        invoice = await service.sendInvoice(invoice.id);
      } else if (invoice.refNo && !invoice.pdfId) {
        console.log("No - ------ - - - Noooooooooooooooootofication senddong")
        invoice = await service.getInvoice(invoice.id);
        await service.generateInvoicePdf(invoice);
      }

      return invoice;
    }
  } catch (e) {
    log.write("BookingService ::: raiseInvoice :: exception : ", e);
    throw e;
  }
};
service.raiseInvoices = async (data) => {
  try {
    var bookingIdSql = "";
    if (data.bookingId) {
      bookingIdSql = " and b.id = " + data.bookingId;
    }
    var dateSql = "20240601";
    if (data.forDate) {
      dateSql = "'" + data.forDate + "'";
    }
    var ignoreCancelled = "";
    ignoreCancelled = " or i.isCancelled=1 ";
    if (data.ignoreCancelled) {
      ignoreCancelled = " or i.isCancelled=1 ";
    }
//and b.id not in (328,340,342,343,344,345,361,363) 
    var sql =
      `SELECT b.id,i.id invoiceId,i.status,i.refNo, d.date_field invoiceDate, b.started, b.ended, b.status bstatus  
              FROM bookings b 
              left join sys_date d on d.date_field >= b.started 
              left join invoices i on i.bookingId = b.id and month(i.date) = month(d.date_field) and  year(i.date) = year(d.date_field) 
              left join invoice_services ins on i.invoiceServiceId=ins.id and ins.category in ('OfficeRent') and ins.type in ('Monthly')
              where 1=1 and b.status in ("Active","Exiting") and b.id not in(82) and (b.ended is null or b.ended> ` +
      dateSql +
      `) 
              and (i.id is null or i.refNo is null or i.refNo like "%HHSD%" or i.refNo like "%PRKIN%" ` +
      ignoreCancelled +
      `) ` +
      bookingIdSql +
      `
              and month(d.date_field)=month(` +
      dateSql +
      `) and year(d.date_field)=year(` +
      dateSql +
      `)
              group by month(date_field), year(date_field), b.id, i.id, i.status
              order by b.id, i.status,  d.date_field`;

     log.write("BookingService ::: raiseInvoices :: sql : " + sql);
    var results = await session.db.query(sql, {
      replacements: {},
      type: Sequelize.QueryTypes.SELECT,
    });
    log.write(
      "BookingService ::: raiseInvoices :: results count : " + results.length
    );
    log.write("BookingService ::: raiseInvoices :: results : ", results);

    var bookings = _(results)
      .groupBy((x) => x.id)
      .map((value, key) => ({ id: key, invoices: value }))
      .value();
   log.write("BookingService ::: raiseInvoices :: bookings :::::::::::::::::::::: : ", bookings);

    var count = 0;
    data.sendNotifications = true;
////////////////////////////////////////////////////////////////////////////////////////////////
for (var i = 0; i < bookings.length; i++) {
  var booking = bookings[i];
   log.write("For ::: BookingService ::: raiseInvoices :: booking.invoices : ", booking.invoices);
  for (var j = 0; j < booking.invoices.length; j++) {
    var invoice = booking.invoices[j];
    if (invoice.status == null || invoice.status == "Cancelled" || invoice.refNo.includes('HHSD') || invoice.refNo.includes('PRKIN')) {
      invoice.invoiceId = null;
      invoice.refNo = null;
      await service.raiseInvoice(invoice, data.sendNotifications);
      count++;
    } else if (invoice.refNo == null) {
      console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEE")
      await service.raiseInvoice(invoice, data.sendNotifications);
      count++;
    }
    // log.write("BookingService ::: raiseInvoices :: invoice : ", invoice);
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////
    // if (data.bookingId) {
    //   return results.length + " invoices generated successfully.";
    // } else {
    //   return results.length + " invoices are getting generated.";
    // }
    return count;
  } catch (e) {
    log.write("BookingService ::: raiseInvoice :: exception : ", e);
    throw e;
  }
};



service.hasTds = function (rent, rentStartedDate, invoiceDate) {
  var checkInMonth = moment(rentStartedDate).month();
  var remainingMonths = (11 - checkInMonth + 3) % 12;
  if (
    invoiceDate &&
    ((moment(rentStartedDate).year() < moment(invoiceDate).year() &&
      moment(invoiceDate).month() <= 2) ||
      (moment(rentStartedDate).year() == moment(invoiceDate).year() &&
        moment(rentStartedDate).month() < 3 &&
        moment(invoiceDate).month() > 2))
  ) {
    remainingMonths = 12;
    if (rent * remainingMonths >= 240000) {
      return true;
    } else {
      return false;
    }
  }

  var noOfDaysLeft =
    utils.moment(rentStartedDate).daysInMonth() -
    utils.moment(rentStartedDate).date() +
    1;
  var rentPerDay = rent / utils.moment(rentStartedDate).daysInMonth();
  var firstMonthRent = rentPerDay * noOfDaysLeft;

  if (firstMonthRent + rent * remainingMonths >= 240000) {
    return true;
  } else {
    return false;
  }
};

service.raiseParkingInvoice = async (data, sendNotifications) => {
  try {
    log.write("BookingService ::: raiseInvoice :: data : ", data);
    var booking = await service.getBooking(data.bookingid);
    var parkingbooking = await ParkingBookings.findOne({where: { id: data.id }})

    console.log("BookingService ::: raiseParkingInvoice :: data : ", JSON.stringify(parkingbooking))

    var taxableAmount = parkingbooking.carPrice+parkingbooking.bikePrice;
    var gst = taxableAmount * 0.18;

    if (parkingbooking) {
      var invoice;
        invoice = {
          bookingId: parkingbooking.bookingId,
          status: "Pending",
          date: utils.moment(data.invoiceDate).format("YYYY-MM-DD"),
          startDate: utils.moment(data.invoiceDate).format("YYYY-MM-DD"),
          endDate: utils.moment(data.invoiceDate).endOf("month").format("YYYY-MM-DD"),
          dueDate: utils.moment(data.invoiceDate).add(4, "days").format("YYYY-MM-DD"),
          type: "ParkingRent",
          name: "ParkingRent Rent for " + utils.moment(data.invoiceDate).format("MMM YYYY"),
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
          invoiceServiceId: 4,
          taxableAmount: taxableAmount,
          gst: gst,
          amount: taxableAmount + gst,
          tds: 0,
          hasTds: 0,
        };
        invoice.refNo = await systemUtils.getRefNo( "Parking", booking.id, invoice.date, booking.company,  booking.contract);
        invoice = await Invoice.create(invoice);
        // if (utils.moment().isSame(utils.moment(invoice.date), 'month')) {
       // var refNo = await systemUtils.getRefNo( "ParkingInvoice", booking.id, invoice.date, booking.company,  booking.contract);
       // invoice.set("refNo", refNo);
       // invoice.save();

         var itemDescription = "Vehicle Parking Services Fee for the Month of " +  utils.moment(invoice.startDate).format("MMM - YYYY") + "<br>Note: " + parkingbooking.note;
        //  " (Units: "+parkingbooking.cars+" | Amount: "+parkingbooking.carPrice+")<br>Bike Parking Services Fee for the Month of " + utils.moment(invoice.startDate).format("MMM - YYYY") +" (Units: "+parkingbooking.bikes+" | Amount: "+parkingbooking.bikePrice+")"; 
          var qty = parkingbooking.cars+parkingbooking.bikes || 1;
          var price = taxableAmount/qty;

          var item = {
            invoiceId: invoice.id,
            invoiceServiceId: 4,
            item: itemDescription,
            qty: qty,
            price: price,
            amount: taxableAmount,
            hasTds: 0,
            cgst: gst/2,
            sgst: gst/2,
            igst: 0,
            tds: 0,
            total: taxableAmount + gst,
          };
          await InvoiceItem.create(item);
        

      log.write("BookingService ::: raiseInvoice :: invoice : ", invoice.toJSON());
      if (invoice.refNo) {
        invoice = await service.sendInvoice(invoice.id);
      } else if (invoice.refNo && !invoice.pdfId) {
        invoice = await service.getInvoice(invoice.id);
        await service.generateInvoicePdf(invoice);
      }

      return invoice;
    }
  } catch (e) {
    log.write("BookingService ::: raiseInvoice :: exception : ", e);
    throw e;
  }
};

service.raiseParkingInvoices = async (data) => {
  try {
    var bookingIdSql = "";
    if (data.bookingId) {
      bookingIdSql = " and b.id = " + data.bookingId;
    }
    var dateSql = "20240601";
    if (data.forDate) {
      dateSql = "'" + data.forDate + "'";
    }
    var ignoreCancelled = "";
    ignoreCancelled = " or i.isCancelled=1 ";
    if (data.ignoreCancelled) {
      ignoreCancelled = " or i.isCancelled=1 ";
    }

    var sql =
      `SELECT b.id,b.bookingid,i.id invoiceId,i.status,i.refNo, d.date_field invoiceDate, b.started, b.ended, b.status bstatus 
              FROM parking_bookings b 
              left join sys_date d on d.date_field >= b.started 
              left join invoices i on i.bookingId = b.bookingId and month(i.date) = month(d.date_field) and  year(i.date) = year(d.date_field) 
              left join invoice_services ins on i.invoiceServiceId=ins.id and ins.category in ('OfficeRent') and ins.type in ('Monthly')
              where 1=1 and b.status in ("Active","Draft") and (b.ended is null or b.ended> ` +
      dateSql +
      `) 
              and (i.id is null or i.refNo is null or i.refNo like "%HHSD%" or i.refNo like "%HHIN%" or i.refNo like "%SBIN%" ` +
      ignoreCancelled +
      `) ` +
      bookingIdSql +
      `
              and month(d.date_field)=month(` +
      dateSql +
      `) and year(d.date_field)=year(` +
      dateSql +
      `)
              group by month(date_field), year(date_field), b.id, i.id, i.status
              order by b.id, i.status,  d.date_field`;

     log.write("BookingService ::: raiseInvoices :: sql : " + sql);
    var results = await session.db.query(sql, {
      replacements: {},
      type: Sequelize.QueryTypes.SELECT,
    });
    log.write("BookingService ::: raiseInvoices :: results count : " + results.length
    );
    log.write("BookingService ::: raiseInvoices :: results : ", results);

    var bookings = _(results)
      .groupBy((x) => x.id)
      .map((value, key) => ({ id: key, invoices: value }))
      .value();
   log.write("BookingService ::: raiseParkingggInvoices :: bookings :::::::::::::::::: ", bookings);


    var count = 0;
    data.sendNotifications = true;
//////////////////////////////////////////////////////////
    for (var i = 0; i < bookings.length; i++) {
      var booking = bookings[i];
       log.write("For ::: BookingService ::: raiseInvoices :: booking.invoices : ", booking.invoices);
      for (var j = 0; j < booking.invoices.length; j++) {
        var invoice = booking.invoices[j];
        if (invoice.status == null || invoice.status == "Cancelled" || invoice.refNo.includes('HHSD') || invoice.refNo.includes('HHIN') || invoice.refNo.includes('SBIN')) {
          invoice.invoiceId = null;
          invoice.refNo = null;
          await service.raiseParkingInvoice(invoice, data.sendNotifications);
          count++;
        } else if (invoice.refNo == null) {

          console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEE")
          await service.raiseParkingInvoice(invoice, data.sendNotifications);
          count++;
        }
        // log.write("BookingService ::: raiseInvoices :: invoice : ", invoice);
      }
    }
/////////////////////////////////////////////////////////
    // if (data.bookingId) {
    //   return results.length + " invoices generated successfully.";
    // } else {
    //   return results.length + " invoices are getting generated.";
    // }
    return count;
  } catch (e) {
    log.write("BookingService ::: raiseInvoice :: exception : ", e);
    throw e;
  }
};


service.raiseBookingSDInvoice = async (bookingId) => {
  try {
    log.write("BookingService ::: raiseBookingInvoices :: bookingId : ", bookingId);
    var booking = await service.getBooking(bookingId);
    log.write("BookingService ::: raiseBookingInvoices :: bookingId :: Bookings: ",booking);

    var invoice;
    if (booking) {
      Invoice.update({ isCancelled: 1, status: "Cancelled" }, { where: { bookingId: bookingId } } );
      var rent = booking.contract.rent,
        amount = 0,
        taxableAmount = 0,
        gst = 0,
        igst = 0,
        cgst = 0,
        sgst = 0,
        tds = 0;

      //*************** Short Term Booking Invoices Start ***************//
      if (booking.contract.term == "ShortTerm") {
        invoice = {
          bookingId: bookingId,
          status: "Pending",
          date: new Date(),
          startDate: utils.moment(booking.started).format("YYYY-MM-DD"),
          endDate: utils.moment(booking.ended).format("YYYY-MM-DD"),
          dueDate: utils.moment(booking.started).format("YYYY-MM-DD"),
          type: booking.contract.deskType + "Rent",
          name: booking.contract.deskType +  " Rent for " +  utils.moment(booking.started).format("MMM YYYY") +  " - " + utils.moment(booking.ended).format("MMM YYYY"),
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
        };
        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "OfficeRent", type: "Monthly",
            status: "Published", companyId: booking.companyId,
          },
        });

        log.write("BookingService ::: raiseInvoice :: invoiceService : " + booking.contract.invoiceServiceType +  " " + booking.companyId, invoiceService );
        if (invoiceService) { invoice.invoiceServiceId = invoiceService.id; }
        taxableAmount = Math.round(booking.contract.rent, 2);
        gst = Math.round(taxableAmount * 0.18, 2);
        sgst = Math.round(gst / 2, 2);
        cgst = Math.round(gst / 2, 2);
        if (service.hasTds(taxableAmount, booking.started, invoice.date)) {
          tds = Math.round(taxableAmount * (invoiceService.tds / 100), 2);
        }
        amount = taxableAmount + gst - tds;

        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;
        invoice.due = amount;
        invoice.paid = 0;

        
        if (amount > 0) {
          invoice = await Invoice.create(invoice);
          var refNo = await systemUtils.getRefNo("MonthlyInvoice", booking.id, invoice.date, booking.company, booking.contract);
          invoice.set("refNo", refNo);
          invoice.save();

          var item = {
            invoiceId: invoice.id,
            invoiceServiceId: invoiceService ? invoiceService.id : null,
            item:"Business Services for period of " + utils.moment(invoice.startDate).format("MMM DD, YYYY") +  " - " +  utils.moment(invoice.endDate).format("MMM DD, YYYY"),
            qty: booking.bookedDesks.length,
            price: booking.contract.rent / booking.bookedDesks.length,
            amount: taxableAmount,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            tds: tds,
            total: taxableAmount + gst,
          };
          await InvoiceItem.create(item);
          invoice = await service.sendInvoice(invoice.id);
        }
      } 
      //*************** Short Term Booking Invoices End ***************//

      //*************** Long Term Booking Invoices Start ***************//
      else {
        var invoiceDate = booking.reserved;
          taxableAmount = booking.contract.security;

          invoice = {
            bookingId: bookingId,
            status: "Pending",
            date: invoiceDate,
            startDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
            endDate: utils.moment(invoiceDate).add(1, "months").add(-1, "days").format("YYYY-MM-DD"),
            dueDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
            type: "Liability",
            name: "Security Deposit",
            updated: new Date(),
            updatedBy: "system",
            isLiability: 1,
          };
		var refNo = await systemUtils.getRefNo( "Liability", booking.id, invoice.date, booking.company);
          invoice.amount = taxableAmount;
          invoice.taxableAmount = taxableAmount;
          invoice.gst = 0;
          invoice.hasTds = 0;
          invoice.tds = 0;
          invoice.due = taxableAmount;
          invoice.paid = 0;
		invoice.refNo = refNo;

          if (taxableAmount > 0) {
            var invoiceService = await InvoiceService.findOne({
              where: {
                category: "SecurityDeposit", type: "DepositCharge",
                status: "Published", companyId: booking.companyId,
              },
            });
            log.write("BookingService ::: raiseInvoice :: invoiceService : " + " " + booking.companyId,invoiceService );

            if (invoiceService) {  invoice.invoiceServiceId = invoiceService.id; }

            invoice = await Invoice.create(invoice);


            var item = {
              invoiceId: invoice.id,
              invoiceServiceId: invoiceService ? invoiceService.id : null,
              item: "Security Deposit",
              qty: 1,
              price: taxableAmount,
              amount: taxableAmount,
              cgst: 0,
              sgst: 0,
              igst: 0,
              tds: 0,
              total: taxableAmount,
            };
            await InvoiceItem.create(item);
            invoice = await service.sendInvoice(invoice.id);
          }
      }
      //*************** Long Term Booking Invoices End ***************//

      service.updateBookingLedger(booking.id);
      return invoice;
    }
  } catch (e) {
    log.write("BookingService ::: raiseBookingInvoices :: exception : ", e);
    throw e;
  }
};
service.raiseBookingFirstMonthInvoice = async (bookingId) => {
  try {
    log.write("BookingService ::: raiseBookingInvoices :: bookingId : ", bookingId);
    var booking = await service.getBooking(bookingId);
    log.write("BookingService ::: raiseBookingInvoices :: bookingId :: Bookings: ",booking);

    var invoice;
    if (booking) {
      //Invoice.update({ isCancelled: 1, status: "Cancelled" }, { where: { bookingId: bookingId } } );
      var rent = booking.contract.rent,
        amount = 0,
        taxableAmount = 0,
        gst = 0,
        igst = 0,
        cgst = 0,
        sgst = 0,
	hasTds = 0,
        tds = 0;

      //*************** Long Term Booking Invoices Start ***************//

        var invoiceDate = booking.started;

        ///////////// Fist month rent invoice //////////////////
        ////////////////////////////////////////////////////////
        taxableAmount = booking.contract.rent;
        let bookingStarted = utils.moment(booking.started).format("YYYY-MM-DD")
        let invoicedatecondition = moment(bookingStarted).isBefore(aprilfirst);
        var invoiceDate = invoicedatecondition?aprilfirst:bookingStarted;
        console.log("Fist month rent invoice Date Condition:: ", 
        invoiceDate, "bookingStarted ::", bookingStarted, "April First ::",aprilfirst);
       /////////////////////////////////////////////////////////
        invoice = {
          bookingId: bookingId,
          status: "Pending",
          date: utils.moment(invoiceDate).format("YYYY-MM-DD"),
          startDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
          endDate: utils.moment(invoiceDate).endOf("months").format("YYYY-MM-DD"),
          dueDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
          type: "OfficeRent",
          name: booking.contract.deskType + " Rent for first month",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
        };

        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "OfficeRent", type: "Monthly",
            status: "Published", companyId: booking.companyId,
          },
        });
        log.write("BookingService ::: raiseInvoice :: invoiceService : " + booking.contract.invoiceServiceType + " " + booking.companyId, invoiceService);

        if (invoiceService) { invoice.invoiceServiceId = invoiceService.id; }

        var noOfDays =  utils.moment().daysInMonth() - utils.moment(invoiceDate).date() +  1;
        taxableAmount = (taxableAmount / utils.moment().daysInMonth()) * noOfDays; 
        taxableAmount = Math.round(taxableAmount, 2);
        gst = Math.round(taxableAmount * 0.18, 2);
        sgst = Math.round(gst / 2, 2);
        cgst = Math.round(gst / 2, 2);

        if (taxableAmount>240000) {
          tds = Math.round((taxableAmount * 0.10), 2);
	  hasTds = 1;
        }
        amount = taxableAmount + gst - tds;

	   var refNo = await systemUtils.getRefNo( "MonthlyInvoice", booking.id, invoice.date, booking.company);
        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;
        invoice.hasTds = hasTds;        
        invoice.due = amount;
        invoice.paid = 0;
	   invoice.refNo = refNo;

        log.write( "BookingService ::: raiseTokenInvoice : First Month Rent invoice : ", invoice);
        if (amount > 0) {
          invoice = await Invoice.create(invoice);
         // if (utils.moment(invoice.date).isBefore(utils.moment().endOf("month"))) {
         //   var refNo = await systemUtils.getRefNo( "MonthlyInvoice", booking.id, invoice.date, booking.company);
         //   invoice.set("refNo", refNo);
         //   invoice.save();
         // }

          var qty = '-';
          var price = 0;
          if(booking.bookedDesks){
            qty = booking.bookedDesks.length;
            if(qty>0){price = booking.contract.rent / qty;}
          }

          var item = {
            invoiceId: invoice.id,
            invoiceServiceId: invoiceService ? invoiceService.id : null,
            item: "Business Services for period of " + utils.moment(invoice.startDate).format("MMM DD, YYYY") + " - " +  utils.moment(invoice.endDate).format("MMM DD, YYYY"),
            qty: qty,
            price: price,
            amount: taxableAmount,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            tds: tds,
            total: taxableAmount + gst - tds,
          };
         // log.write( "Infinity is from ::" + JSON.stringify(item) + "\n booking.contract.rent::" +  booking.contract.rent +
         //            "\nbooking.bookedDesks.length::" +  booking.bookedDesks.length  );
          await InvoiceItem.create(item);
          invoice = await service.sendInvoice(invoice.id);
        }

      //*************** Long Term Booking Invoices End ***************//

      service.updateBookingLedger(booking.id);
      return invoice;
    }
  } catch (e) {
    log.write("BookingService ::: raiseBookingInvoices :: exception : ", e);
    throw e;
  }
};

service.raiseVirtualBookingInvoice = async (bookingId) => {
  try {
    log.write("BookingService ::: raiseBookingInvoices :: bookingId : ", bookingId);
    var booking = await service.getBooking(bookingId);
    log.write("BookingService ::: raiseBookingInvoices :: bookingId :: Bookings: ",booking);

    var invoice;
    if (booking) {
      // Invoice.update({ isCancelled: 1, status: "Cancelled" }, { where: { bookingId: bookingId } } );
      var rent = booking.contract.rent,
        amount = 0,
        taxableAmount = 0,
        gst = 0,
        igst = 0,
        cgst = 0,
        sgst = 0,
        tds = 0,
        hasTds=0;

      //*************** Long Term Booking Invoices Start ***************//

        var invoiceDate = booking.started;

        ///////////// Fist month rent invoice //////////////////
        ////////////////////////////////////////////////////////
        taxableAmount = booking.contract.rent;
        let bookingStarted = utils.moment(booking.started).format("YYYY-MM-DD")
        let invoicedatecondition = moment(bookingStarted).isBefore(aprilfirst);
        var invoiceDate = invoicedatecondition?aprilfirst:bookingStarted;
        console.log("Fist month rent invoice Date Condition:: ", 
        invoiceDate, "bookingStarted ::", bookingStarted, "April First ::",aprilfirst);
       /////////////////////////////////////////////////////////
        invoice = {
          bookingId: bookingId,
          status: "Pending",
          date: utils.moment(invoiceDate).format("YYYY-MM-DD"),
          startDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
          endDate: utils.moment(invoiceDate).endOf("months").format("YYYY-MM-DD"),
          dueDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
          type: "VirtualOffice",
          name: booking.contract.deskType + " Rent",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
        };

        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "OfficeRent", type: "Monthly",
            status: "Published", companyId: booking.companyId,
          },
        });
        log.write("BookingService ::: raiseInvoice :: invoiceService : " + booking.contract.invoiceServiceType + " " + booking.companyId, invoiceService);

        if (invoiceService) { invoice.invoiceServiceId = invoiceService.id; }

        var noOfDays =  utils.moment().daysInMonth() - utils.moment(invoiceDate).date() +  1;
        taxableAmount = (taxableAmount / utils.moment().daysInMonth()) * noOfDays; 
        taxableAmount = Math.round(taxableAmount, 2);
        gst = Math.round(taxableAmount * 0.18, 2);
        sgst = Math.round(gst / 2, 2);
        cgst = Math.round(gst / 2, 2);


        amount = taxableAmount + gst - tds;
        var refNo = await systemUtils.getRefNo( "AncillaryRevenue", booking.id, invoice.date, booking.company);
        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;      
        invoice.due = amount;
        invoice.paid = 0;
        invoice.refNo = refNo;

        log.write( "BookingService ::: raiseTokenInvoice : First Month Rent invoice : ", invoice);
        if (amount > 0) {
          invoice = await Invoice.create(invoice);
          // if (utils.moment(invoice.date).isBefore(utils.moment().endOf("month"))) {
          //   var refNo = await systemUtils.getRefNo( "MonthlyInvoice", booking.id, invoice.date, booking.company);
          //   invoice.set("refNo", refNo);
          //   invoice.save();
          // }

          var qty = '-';
          var price = 0;
          if(booking.bookedDesks){
            qty = booking.bookedDesks.length;
            if(qty>0){price = booking.contract.rent / qty;}
          }

          var item = {
            invoiceId: invoice.id,
            invoiceServiceId: invoiceService ? invoiceService.id : null,
            item: "Business Services Rental Fee for Virtual Office",
            qty: qty,
            price: price,
            amount: taxableAmount,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            tds: tds,
            total: taxableAmount + gst - tds,
          };
          log.write( "Infinity is from ::" + JSON.stringify(item) + "\n booking.contract.rent::" +  booking.contract.rent +
                     "\nbooking.bookedDesks.length::" +  booking.bookedDesks.length  );
          await InvoiceItem.create(item);
          invoice = await service.sendInvoice(invoice.id);
        }

      //*************** Long Term Booking Invoices End ***************//

      service.updateBookingLedger(booking.id);
      return invoice;
    }
  } catch (e) {
    log.write("BookingService ::: raiseBookingInvoices :: exception : ", e);
    throw e;
  }
};

service.cancelInvoice = async (invoice, username) => {
  try {
    log.write("BookingService ::: cancelInvoice :: id : ", invoice.id);
    await Invoice.update(
      {
        status: "Cancelled",
        isCancelled: 1,
        cancelledReason: invoice.cancelledReason,
        updated: new Date(),
        updatedBy: username,
      },
      { where: { id: invoice.id } }
    );

    var invoice = await Invoice.findOne({
      where: { id: invoice.id },
      attributes: ["bookingId"],
    });
    if (invoice) {
      await service.updateBookingLedger(invoice.bookingId);
    }
    return {};
  } catch (e) {
    log.write("BookingService ::: cancelInvoice :: exception : ", e);
    throw e;
  }
};
service.raiseBookingInvoices = async (bookingId, dontRaiseSD) => {
  try {
    log.write(
      "BookingService ::: raiseBookingInvoices :: bookingId : ",
      bookingId
    );
    var booking = await service.getBooking(bookingId);
    log.write(
      "BookingService ::: raiseBookingInvoices :: bookingId :: Bookings: ",
      booking
    );
    var invoice;
    if (booking) {
      Invoice.update(
        { isCancelled: 1, status: "Cancelled" },
        { where: { bookingId: bookingId } }
      );
      var rent = booking.contract.rent,
        amount = 0,
        taxableAmount = 0,
        gst = 0,
        igst = 0,
        cgst = 0,
        sgst = 0,
        tds = 0;
      if (booking.contract.term == "ShortTerm") {
        invoice = {
          bookingId: bookingId,
          status: "Pending",
          date: new Date(),
          startDate: utils.moment(booking.started).format("YYYY-MM-DD"),
          endDate: utils.moment(booking.ended).format("YYYY-MM-DD"),
          dueDate: utils.moment(booking.started).format("YYYY-MM-DD"),
          type: booking.contract.deskType + "Rent",
          name:
            booking.contract.deskType +
            " Rent for " +
            utils.moment(booking.started).format("MMM YYYY") +
            " - " +
            utils.moment(booking.ended).format("MMM YYYY"),
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
        };
        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "OfficeRent",
            type: "Monthly",
            status: "Published",
            companyId: booking.companyId,
          },
        });
        log.write(
          "BookingService ::: raiseInvoice :: invoiceService : " +
            booking.contract.invoiceServiceType +
            " " +
            booking.companyId,
          invoiceService
        );
        if (invoiceService) {
          invoice.invoiceServiceId = invoiceService.id;
        }
        taxableAmount = Math.round(booking.contract.rent, 2);
        gst = Math.round(taxableAmount * 0.18, 2);
        // if (booking.client.stateCode && booking.client.stateCode != booking.company.stateCode) {
        //   igst = gst;
        // } else {
        sgst = Math.round(gst / 2, 2);
        cgst = Math.round(gst / 2, 2);
        // }
        if (service.hasTds(taxableAmount, booking.started, invoice.date)) {
          tds = Math.round(taxableAmount * (invoiceService.tds / 100), 2);
        }
        amount = taxableAmount + gst - tds;

        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;
        invoice.due = amount;
        invoice.paid = 0;

        
        if (amount > 0) {
          invoice = await Invoice.create(invoice);
          var refNo = await systemUtils.getRefNo(
            "MonthlyInvoice",
            booking.id,
            invoice.date,
            booking.company,
            booking.contract
          );
          // invoice.set("refNo", "INV" + utils.moment().format("YY") + (100000 + invoice.id));
          invoice.set("refNo", refNo);
          invoice.save();

          var item = {
            invoiceId: invoice.id,
            invoiceServiceId: invoiceService ? invoiceService.id : null,
            item: "Business Services for period of " +
              utils.moment(invoice.startDate).format("MMM DD, YYYY") +
              " - " +
              utils.moment(invoice.endDate).format("MMM DD, YYYY"),
            qty: booking.bookedDesks.length,
            price: booking.contract.rent / booking.bookedDesks.length,
            amount: taxableAmount,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            tds: tds,
            total: taxableAmount + gst,
          };
          await InvoiceItem.create(item);
          // log.write("BookingService ::: raiseBookingInvoices :: invoice : ", invoice.toJSON());
          invoice = await service.sendInvoice(invoice.id);
        }
      } else {
        var invoiceDate = booking.started;
        if (!dontRaiseSD) {
          taxableAmount = booking.contract.security;
          invoice = {
            bookingId: bookingId,
            status: "Pending",
            date: invoiceDate,
            startDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
            endDate: utils
              .moment(invoiceDate)
              .add(1, "months")
              .add(-1, "days")
              .format("YYYY-MM-DD"),
            dueDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
            type: "Liability",
            name: "Security Deposit",
            updated: new Date(),
            updatedBy: "system",
            isLiability: 1,
          };
          invoice.amount = taxableAmount;
          invoice.taxableAmount = taxableAmount;
          invoice.gst = 0;
          invoice.tds = 0;
          invoice.hasTds = 0;
          invoice.due = taxableAmount;
          invoice.paid = 0;

          if (taxableAmount > 0) {
            var invoiceService = await InvoiceService.findOne({
              where: {
                category: "SecurityDeposit",
                type: "DepositCharge",
                status: "Published",
                companyId: booking.companyId,
              },
            });
            log.write(
              "BookingService ::: raiseInvoice :: invoiceService : " +
                booking.contract.invoiceServiceType +
                " " +
                booking.companyId,
              invoiceService
            );
            if (invoiceService) {
              invoice.invoiceServiceId = invoiceService.id;
            }

            invoice = await Invoice.create(invoice);
            // if (utils.moment(invoice.date).isBefore(utils.moment().endOf('month'))) {
            var refNo = await systemUtils.getRefNo(
              "Liability",
              booking.id,
              invoice.date,
              booking.company
            );
            // invoice.set("refNo", "INV" + utils.moment().format("YY") + (100000 + invoice.id));
            invoice.set("refNo", refNo);
            invoice.save();
            // }

            var item = {
              invoiceId: invoice.id,
              invoiceServiceId: invoiceService ? invoiceService.id : null,
              item: "Security Deposit",
              qty: 1,
              price: taxableAmount,
              amount: taxableAmount,
              cgst: 0,
              sgst: 0,
              igst: 0,
              tds: 0,
              total: taxableAmount,
            };
            await InvoiceItem.create(item);
            invoice = await service.sendInvoice(invoice.id);
          }
        }
        // Fist month rent invoice
        /////////////////////////////////////////////////////////
        taxableAmount = booking.contract.rent;
        let bookingStarted =utils.moment(booking.started).format("YYYY-MM-DD")
        let invoicedatecondition = moment(bookingStarted).isBefore(aprilfirst);
        var invoiceDate = invoicedatecondition?aprilfirst:bookingStarted;
        console.log("Fist month rent invoice Date Condition:: ", 
        invoiceDate, "bookingStarted ::", bookingStarted, "April First ::",aprilfirst);
       /////////////////////////////////////////////////////////
        invoice = {
          bookingId: bookingId,
          status: "Pending",
          date: utils.moment(invoiceDate).format("YYYY-MM-DD"),
          startDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
          endDate: utils
            .moment(invoiceDate)
            .endOf("months")
            .format("YYYY-MM-DD"),
          dueDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
          // type: booking.contract.invoiceServiceType,
          type: "OfficeRent",
          name: booking.contract.deskType + " Rent for first month",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
        };

        console.log("IIIIIIIIIIII", invoice);
        var invoiceService = await InvoiceService.findOne({
          where: {
            category: "OfficeRent",
            type: "Monthly",
            status: "Published",
            companyId: booking.companyId,
          },
        });
        log.write(
          "BookingService ::: raiseInvoice :: invoiceService : " +
            booking.contract.invoiceServiceType +
            " " +
            booking.companyId,
          invoiceService
        );
        if (invoiceService) {
          invoice.invoiceServiceId = invoiceService.id;
        }

        var noOfDays =
          utils.moment().daysInMonth() -
          utils.moment(invoiceDate).date() +
          1;
        taxableAmount =
          (taxableAmount / utils.moment().daysInMonth()) * noOfDays;
        taxableAmount = Math.round(taxableAmount, 2);
        //invoice.endDate = utils.moment(invoiceDate).endOf("month");

        gst = Math.round(taxableAmount * 0.18, 2);
        // if (booking.client.stateCode && booking.client.stateCode != booking.company.stateCode) {
        //   igst = gst;
        // } else {
        sgst = Math.round(gst / 2, 2);
        cgst = Math.round(gst / 2, 2);
        // }
        if (service.hasTds(rent, booking.started, invoice.date)) {
          tds = Math.round(taxableAmount * (invoiceService.tds / 100), 2);
        }
        amount = taxableAmount + gst - tds;

        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;
        invoice.hasTds = 1;
        invoice.due = amount;
        invoice.paid = 0;

        log.write( "BookingService ::: raiseTokenInvoice : First Month Rent invoice : ", invoice);
        if (amount > 0) {
          invoice = await Invoice.create(invoice);
          if (
            utils.moment(invoice.date).isBefore(utils.moment().endOf("month"))
          ) {
            var refNo = await systemUtils.getRefNo(
              "MonthlyInvoice",
              booking.id,
              invoice.date,
              booking.company
            );
            // invoice.set("refNo", "INV" + utils.moment().format("YY") + (100000 + invoice.id));
            invoice.set("refNo", refNo);
            invoice.save();
          }

          // log.write("BookingService ::: raiseBookingInvoices :: booking : ", booking);
          var item = {
            invoiceId: invoice.id,
            invoiceServiceId: invoiceService ? invoiceService.id : null,
            item: "Business Services for period of " +
              utils.moment(invoice.startDate).format("MMM DD, YYYY") +
              " - " +
              utils.moment(invoice.endDate).format("MMM DD, YYYY"),
            qty: booking.bookedDesks.length,
            price: booking.contract.rent / booking.bookedDesks.length,
            amount: taxableAmount,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            tds: tds,
            total: taxableAmount + gst,
          };
          log.write(
            "Infinity is from ::" +
              JSON.stringify(item) +
              "\n booking.contract.rent::" +
              booking.contract.rent +
              "\nbooking.bookedDesks.length::" +
              booking.bookedDesks.length
          );
          await InvoiceItem.create(item);
          // log.write("BookingService ::: raiseBookingInvoices :: invoice : ", invoice.toJSON());
          invoice = await service.sendInvoice(invoice.id);
        }
      }
      service.updateBookingLedger(booking.id);
      return invoice;
    }
  } catch (e) {
    log.write("BookingService ::: raiseBookingInvoices :: exception : ", e);
    throw e;
  }
};
service.raiseTokenInvoice = async (bookingId) => {
  try {
    log.write(
      "BookingService ::: raiseTokenInvoice :: bookingId : ",
      bookingId
    );
    var booking = await service.getBooking(bookingId);
    // log.write("BookingService ::: raiseTokenInvoice :: booking : ", booking);
    var invoice;
    if (booking) {
      var tokenPdf = {},
        tokenSdPdf = {};
      var invoiceDate = booking.started;
      var rent = booking.contract.rent,
        amount = 0,
        taxableAmount = 0,
        gst = 0,
        igst = 0,
        cgst = 0,
        sgst = 0,
        tds = 0;
      if (booking.contract.token > 0) {
        invoice = {
          bookingId: bookingId,
          status: "Pending",
          date: utils.moment(booking.contract.date).toDate(),
          startDate: utils.moment(invoiceDate).toDate(),
          endDate: utils.moment(invoiceDate).add(1, "months").toDate(),
          dueDate: utils.moment(invoiceDate).toDate(),
          type: booking.contract.invoiceServiceType,
          name: "Booking Rent Token Charge",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 0,
        };
        taxableAmount = Math.round(booking.contract.token, 2);

        gst = Math.round(taxableAmount * 0.18, 2);
        // if (booking.client.stateCode && booking.client.stateCode != booking.company.stateCode) {
        //   igst = gst;
        // } else {
        sgst = Math.round(gst / 2, 2);
        cgst = Math.round(gst / 2, 2);
        // }
        amount = taxableAmount + gst - tds;

        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;
        invoice.due = amount;
        invoice.paid = 0;

        log.write(
          "BookingService ::: raiseTokenInvoice : Rent Token invoice : ",
          invoice
        );
        if (amount > 0) {
          invoice = await Invoice.create(invoice);
          invoice.set(
            "refNo",
            "PRO-INV-" + booking.id + "-" + (10000 + invoice.id)
          );
          invoice.save();

          // log.write("BookingService ::: raiseTokenInvoice :: booking : ", booking);
          var item = {
            invoiceId: invoice.id,
            // invoiceServiceId: 0,
            item:
              "Booking Rent Token charge for " +
              booking.bookedDesks.length +
              " desks in " +
              booking.offices,
            qty: booking.bookedDesks.length,
            price: booking.contract.token / booking.bookedDesks.length,
            amount: taxableAmount,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            tds: tds,
            total: taxableAmount + gst,
          };
          await InvoiceItem.create(item);

          var _invoice = await service.getInvoice(invoice.id);
          tokenPdf = await service.generateInvoicePdf(_invoice);
          _invoice.set("pdfId", tokenPdf.id);
          _invoice.save();
        }
      }

      if (booking.contract.tokenSD > 0) {
        var amount = 0,
          taxableAmount = 0,
          gst = 0,
          igst = 0,
          cgst = 0,
          sgst = 0,
          tds = 0;
        invoice = {
          bookingId: bookingId,
          status: "Pending",
          date: utils.moment(booking.contract.date).toDate(),
          startDate: utils.moment(invoiceDate).toDate(),
          endDate: utils.moment(invoiceDate).add(1, "months").toDate(),
          dueDate: utils.moment(invoiceDate).toDate(),
          type: booking.contract.invoiceServiceType,
          name: "Booking Security Token Charge",
          updated: new Date(),
          updatedBy: "system",
          isLiability: 1,
        };
        taxableAmount = Math.round(booking.contract.tokenSD, 2);

        amount = taxableAmount;

        invoice.amount = amount;
        invoice.taxableAmount = taxableAmount;
        invoice.gst = gst;
        invoice.tds = tds;
        invoice.due = amount;
        invoice.paid = 0;

        log.write( "BookingService ::: raiseTokenInvoice : SD Token invoice : ",  invoice);
        if (amount > 0) {
          invoice = await Invoice.create(invoice);
          invoice.set(
            "refNo",
            "PRO-SD-INV-" + booking.id + "-" + (10000 + invoice.id)
          );
          invoice.save();

          var item = {
            invoiceId: invoice.id,
            // invoiceServiceId: 0,
            item:
              "Security Token charge for " +
              booking.bookedDesks.length +
              " desks in " +
              booking.offices,
            qty: booking.bookedDesks.length,
            price: booking.contract.token / booking.bookedDesks.length,
            amount: taxableAmount,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            tds: tds,
            total: taxableAmount + gst,
          };

          log.write("InvoiceItem:::::::" + item);
          await InvoiceItem.create(item);

          var _invoice = await service.getInvoice(invoice.id);
          tokenSdPdf = await service.generateInvoicePdf(_invoice);
          _invoice.set("pdfId", tokenSdPdf.id);
          _invoice.save();
        }
      }
      service.sendBookingWelcomeMail(booking.id, tokenPdf.id, tokenSdPdf.id);
    }
    return invoice;
  } catch (e) {
    log.write("BookingService ::: raiseTokenInvoice :: exception : ", e);
    throw e;
  }
};
service.regenerateInvoices = async (data) => {
  try {
    var where = { pdfId: { $eq: null }, status: { $ne: "Cancelled" } };
    if (data.bookingId) {
      where.bookingId = data.bookingId;
    }
    if (data.fromDate && data.toDate) {
      where.date = {
        $between: [
          utils.moment(data.fromDate + " 00:00").toDate(),
          utils.moment(data.toDate + " 23:59").toDate(),
        ],
      };
    }
    var limit = data.limit || 100;
    var invoices = await Invoice.findAll({ attributes: ["id"], where: where });
    var generated = 0;
    for (var i = 0; i < invoices.length; i++) {
      var invoice = await service.getInvoice(invoices[i]["id"]);
      if (invoice) {
        if (!invoice.refNo && data.generateRefNo) {
          if (moment().isSame(utils.moment(invoice.date), "month")) {
            var invoiceType = "MonthlyInvoice";
            if (invoice.isLiability) {
              invoiceType = "Liability";
            }
            var refNo = await systemUtils.getRefNo(
              invoiceType,
              invoice.bookingId,
              invoice.date,
              invoice.booking.company
            );
            invoice.set("refNo", refNo);
            invoice.save();
          }
        }
        if (invoice.items.length == 0) {
          var booking = await service.getBooking(invoice.bookingId);
          var item = {
            invoiceId: invoice.id,
            invoiceServiceId: invoice.invoiceServiceId,
            item:
              "Rent for " +
              booking.desks +
              " desks in " +
              booking.offices +
              " <br> for period of " +
              utils.moment(invoice.startDate).format("MMM DD, YYYY") +
              " - " +
              utils.moment(invoice.endDate).format("MMM DD, YYYY"),
            qty: booking.desks || 1,
            price: booking.contract.rent / (booking.desks || 1),
            amount: invoice.taxableAmount,
            cgst: invoice.gst / 2,
            sgst: invoice.gst / 2,
            igst: invoice.gst,
            tds: invoice.tds,
            total: invoice.taxableAmount + invoice.gst,
          };
          await InvoiceItem.create(item);
          invoice = await service.getInvoice(invoice.id);
        }
        if (invoice.refNo) {
          var pdf = await service.generateInvoicePdf(invoice);
          invoice.set("pdfId", pdf.id);
          invoice.save();
          generated++;
        }
      }
    }
    return generated + " invoices are generated .. !";
  } catch (e) {
    log.write("BookingService ::: regenerateInvoices :: exception : ", e);
    throw e;
  }
};
service.sendInvoiceNotifications = async (data) => {
  try {
    log.write("BookingService ::: sendInvoiceNotifications :: data : ", data);
    var where = { isCancelled: 0, status: { $ne: "Cancelled" } };
    if (data.bookingId) {
      where.bookingId = data.bookingId;
    }
    if (data.fromDate && data.toDate) {
      where.date = {
        $between: [
          utils.moment(data.fromDate).toDate(),
          utils.moment(data.toDate).toDate(),
        ],
      };
    }
    var invoices = await Invoice.findAll({ attributes: ["id"], where: where });
    for (var i = 0; i < invoices.length; i++) {
      var invoice = await service.sendInvoice(invoices[i]["id"]);
    }
    return invoices.length + " invoice notifications are send .. !";
  } catch (e) {
    log.write("BookingService ::: sendInvoiceNotifications :: exception : ", e);
    throw e;
  }
};
service.updateRentFreePeriod = async (data) => {
  try {
    await Contract.update(
      { rentFreePeriod: data.rentFreePeriod },
      { where: { id: data.contractId } }
    );

    var booking = await Booking.findOne({
      where: { id: data.bookingId },
      include: ["contract", "client", "bookedDesks"],
    });

    var invoiceService = await InvoiceService.findOne({
      where: {
        category: "OfficeRent",
        type: "Monthly",
        status: "Published",
        companyId: booking.companyId,
      },
    });
    // log.write("BookingService ::: raiseInvoice :: invoiceService : " + booking.contract.invoiceServiceType + " " + booking.companyId, invoiceService.toJSON());

    var oldInvoice = await Invoice.findOne({
      where: { bookingId: data.bookingId, invoiceServiceId: invoiceService.id },
      include: ["items"],
    });
    var taxableAmount = booking.contract.rent;
    var invoiceDate = utils
      .moment(booking.started)
      .add(data.rentFreePeriod, "days");
    var invoice = {
      bookingId: data.bookingId,
      status: "Pending",
      date: utils.moment(booking.contract.date).format("YYYY-MM-DD"),
      startDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
      endDate: utils.moment(invoiceDate).endOf("months").format("YYYY-MM-DD"),
      dueDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
      type: booking.contract.invoiceServiceType,
      name: booking.contract.deskType + " Rent for first month",
      updated: new Date(),
      updatedBy: "system",
      isLiability: 0,
    };
    if (invoiceService) {
      invoice.invoiceServiceId = invoiceService.id;
    }

    var noOfDays =
      utils.moment().daysInMonth() - utils.moment(invoiceDate).date() + 1;
    taxableAmount = (taxableAmount / utils.moment().daysInMonth()) * noOfDays;
    taxableAmount = Math.round(taxableAmount, 2);
    invoice.endDate = utils.moment(booking.started).endOf("month");

    var cgst = 0,
      sgst = 0,
      igst = 0,
      tds = 0,
      gst = Math.round(taxableAmount * 0.18, 2);
    if (
      booking.client.stateCode &&
      booking.client.stateCode != booking.company.stateCode
    ) {
      igst = gst;
    } else {
      sgst = Math.round(gst / 2, 2);
      cgst = Math.round(gst / 2, 2);
    }
    if (service.hasTds(booking.contract.rent, booking.started, invoice.date)) {
      tds = taxableAmount * 0.1;
    }
    var amount = taxableAmount + gst - tds;

    invoice.amount = amount;
    invoice.taxableAmount = taxableAmount;
    invoice.gst = gst;
    invoice.tds = tds;
    invoice.due = amount;
    invoice.paid = 0;

    log.write("BookingService ::: updateRentFreePeriod :: invoice : ", invoice);
    if (amount > 0) {
      await Invoice.update(invoice, { where: { id: oldInvoice.id } });

      var oldItem = oldInvoice.items[0];
      var item = {
        invoiceId: oldInvoice.id,
        invoiceServiceId: invoiceService ? invoiceService.id : null,
        item:
          booking.bookedDesks.length +
          " desks in " +
          booking.offices +
          " <br> for period of " +
          utils.moment(invoice.startDate).format("MMM DD, YYYY") +
          " - " +
          utils.moment(invoice.endDate).format("MMM DD, YYYY"),
        qty: booking.bookedDesks.length,
        price: booking.contract.rent / booking.bookedDesks.length,
        amount: taxableAmount,
        cgst: cgst,
        sgst: sgst,
        igst: igst,
        tds: tds,
        total: taxableAmount + gst,
      };
      await InvoiceItem.update(item, { where: { id: oldItem.id } });
      // log.write("BookingService ::: raiseBookingInvoices :: invoice : ", invoice.toJSON());
      invoice = await service.sendInvoice(oldInvoice.id);
    }
    return data;
  } catch (e) {
    log.write("BookingService ::: updateRentFreePeriod :: exception : ", e);
    throw e;
  }
};

service.updateBookingsLedger = async (data, username) => {
  try {
    log.write("BookingService ::: updateBookingsLedger :: data : ", data);
    var where = {
      companyId: data.companyId,
      status: { $notIn: ["Cancelled", "Failed"] },
    };
    if (data.bookingIds && data.bookingIds.length) {
      where.id = { $in: data.bookingIds };
    }
    var bookings = await Booking.findAll({ attributes: ["id"], where: where });
    log.write(
      "BookingService ::: updateBookingsLedger :: bookings : " + bookings.length
    );
    for (var i = 0; i < bookings.length; i++) {
      await service.updateBookingLedger(bookings[i].id);
    }
  } catch (e) {
    log.write("BookingService ::: updateBookingsLedger :: exception : ", e);
    throw e;
  }
};
service.updateBookingLedger = async (bookingId) => {
  try {
    log.write(
      "BookingService ::: updateBookingLedger :: bookingId : ",
      bookingId
    );
    var booking = await Booking.findOne({
      where: { id: bookingId },
      include: ["invoices", "payments"],
    });
    if (booking) {
      // var invoices = _.filter(booking.invoices, function(i) { return i.isCancelled == 0 }); // && utils.moment(i.dueDate).isBefore(utils.moment())
      var invoices = await service.getInvoices(bookingId);
      invoices = _.orderBy(invoices, function (i) {
        return new Date(i.date);
      });
      // log.write("BookingService ::: updateBookingLedger :: invoices length : " + invoices.length);
      var invoiced = _.sumBy(invoices, "amount");
      // log.write("BookingService ::: updateBookingLedger :: invoiced amount : " + invoiced);

      // log.write("BookingService ::: updateBookingLedger :: booking payments length : " + booking.payments.length);
      var payments = _.filter(booking.payments, function (i) {
        return i.type != "PgCharge" && i.cancelled != 1;
      });
      // log.write("BookingService ::: updateBookingLedger :: payments length : " + payments.length);
      var payment = _.sumBy(payments, "amount");
      if (payment > 0 && booking.status == "New") {
        booking.set("status", "Booked");
      }
      var paid = 0,
        due = 0;
      log.write(
        "BookingService ::: updateBookingLedger :: invoiced - payment : " +
          invoiced +
          " - " +
          payment
      );

      var balance = payment;
      for (var i = 0; i < invoices.length; i++) {
        var invoice = invoices[i];
        log.write(
          "BookingService ::: updateBookingLedger :: balance - amount : " +
            balance +
            " - " +
            invoice.amount +
            " " +
            invoice.isLiabilityCleared
        );
        invoice.amount = invoice.amount || 0;
        if (invoice.amount <= balance) {
          invoice.set("paid", invoice.amount);
          invoice.set("due", 0);
          invoice.set("status", "Paid");
          paid = paid + invoice.amount;
          if (!invoice.isLiabilityCleared) {
            balance = balance - invoice.amount;
          } else if (invoice.isLiability && invoice.isLiabilityCleared) {
            invoice.set("status", "Cleared");
          }
        } else if (balance > 0) {
          invoice.set("paid", balance);
          invoice.set("due", invoice.amount - balance);
          invoice.set("status", "Due");
          paid = paid + balance;
          due = due + (invoice.amount - balance);
          balance = 0;
        } else {
          invoice.set("due", invoice.amount);
          invoice.set("paid", 0);
          invoice.set("status", "Due");
          due = due + invoice.amount;
        }
        await invoice.save();
      }
      booking.set("invoiced", invoiced);
      booking.set("due", due);
      booking.set("paid", payment);
      await booking.save();
      return invoices;
    }
  } catch (e) {
    log.write("BookingService ::: updateBookingLedger :: exception : ", e);
    throw e;
  }
};
service.updateFreeCredits = async (data) => {
  try {
    var where = {
      status: { $in: ["Active", "Exiting"] },
      "$contract.freeCredits$": { $gt: 0 },
    };
    if (data && data.bookingId) {
      where.id = data.bookingId;
    }
    var bookings = await Booking.findAll({
      where: where,
      attributes: ["id", "officeId"],
      include: [
        { as: "contract", model: Contract, attributes: ["freeCredits"] },
      ],
    });

    var bookingsUpdated = 0;
    log.write(
      "BookingService ::: updateFreeCredits :: bookings: " + bookings.length
    );
    for (var i = 0; i < bookings.length; i++) {
      var booking = bookings[i];
      var creditEntries = await CreditEntry.findAll({
        where: {
          bookingId: booking.id,
          type: "Free",
          addedOn: {
            $between: [
              utils.moment().startOf("month").toDate(),
              utils.moment().endOf("month").toDate(),
            ],
          },
        },
      });

      var paxValue = await service.getBuildingMeetingRoomPaxPrice(
        booking.officeId
      );
      log.write(
        "BookingService ::: updateFreeCredits :: creditEntries  for " +
          booking.id,
        creditEntries.length
      );
      if (!creditEntries.length) {
        await CreditEntry.update(
          { status: "InValid" },
          {
            where: {
              bookingId: booking.id,
              type: "Free",
              addedOn: { $lte: utils.moment().startOf("month") },
            },
          }
        );
        var newCredit = await CreditEntry.create({
          bookingId: booking.id,
          credits: booking.contract.freeCredits,
          value: paxValue,
          type: "Free",
          status: "Valid",
          addedOn: new Date(),
          addedBy: "system",
        });
        bookingsUpdated++;

        log.write(
          "BookingService ::: updateFreeCredits :: newCredit: ",
          newCredit.toJSON()
        );
      }
    }
    return bookingsUpdated;
  } catch (e) {
    log.write("BookingService ::: updateFreeCredits :: exception: ", e);
    throw e;
  }
};

service.getBookingCreditHistory = async (bookingId) => {
  try {
    var result = {};
    result.entries = await CreditEntry.findAll({
      where: { bookingId: bookingId, status: "Valid" },
      order: [["id", "desc"]],
    });
    result.used = await CreditUsed.findAll({
      where: { bookingId: bookingId },
      include: ["resourceBooking"],
      order: [["id", "desc"]],
    });

    result.validCredits = _.sumBy(result.entries, "credits").toFixed(2);
    result.usedCredits = _.sumBy(result.used, "credits").toFixed(2);
    result.availableCredits = (
      result.validCredits - result.usedCredits
    ).toFixed(2);

    return result;
  } catch (e) {
    log.write("BookingService ::: getBookingCreditHistory :: exception: ", e);
    throw e;
  }
};
service.saveCreditEntry = async (data, username) => {
  try {
    log.write("BookingService ::: saveCreditEntry :: data : ", data);
    var creditEntry = {};
    data.addedBy = username || "system";
    data.addedOn = new Date();
    data.value = 100;
    if (data.id) {
      await CreditEntry.update(data, { where: { id: data.id } });
      creditEntry = data;
    } else {
      data.status = "Valid";
      data.type = data.type || "Free";
      creditEntry = await CreditEntry.create(data);
    }
    return creditEntry;
  } catch (e) {
    log.write("BookingService ::: saveCreditEntry :: exception : ", e);
    throw e;
  }
};
service.deleteCreditEntry = async (id, username) => {
  try {
    log.write("BookingService ::: deleteCreditEntry :: data : ", id);
    if (id) {
      await CreditEntry.update(
        { status: "Archived", addedBy: username, addedOn: new Date() },
        { where: { id: id } }
      );
    }
    return "";
  } catch (e) {
    log.write("BookingService ::: deleteCreditEntry :: exception : ", e);
    throw e;
  }
};
service.saveCreditUsed = async (data, username) => {
  try {
    log.write("BookingService ::: saveCreditUsed :: data : ", data);
    var creditUsed = {};
    data.usedOn = new Date();
    if (data.id) {
      await CreditUsed.update(data, { where: { id: data.id } });
      creditUsed = data;
    } else {
      creditUsed = await CreditUsed.create(data);
    }
    return creditUsed;
  } catch (e) {
    log.write("BookingService ::: saveCreditUsed :: exception : ", e);
    throw e;
  }
};

service.getSchedules = async (data, username) => {
  try {
    log.write("BookingService ::: getSchedules :: data : ", data);
    var where = {};
    if (data.filters.type && data.filters.type != "") {
      where["type"] = data.filters.type;
    }
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    if (data.filters.from && data.filters.to) {
      where["from"] = {
        $between: [
          utils.moment(data.filters.from).toDate(),
          utils.moment(data.filters.to).toDate(),
        ],
      };
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`booking->client`.`name`")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`booking->client`.`email`")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`booking->client`.`phone`")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn(
            "lower",
            Sequelize.literal("`booking->client`.`company`")
          ),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("booking.refNo")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("booking.id")),
          {
            $like: query.search.toLowerCase() + "%",
          }
        )
      );
      where["$and"] = { $or: $or };
    }
    var results = await Schedule.findAll({
      where: where,
      include: [
        {
          as: "booking",
          model: Booking,
          attributes: ["refNo", "id", "started", "offices"],
          include: [
            {
              as: "office",
              model: Office,
              attributes: ["name"],
              include: ["building"],
            },
            {
              as: "client",
              model: Client,
              attributes: ["name", "email", "phone", "company"],
            },
          ],
        },
      ],
      offset: data.offset,
      limit: data.limit,
    });
    log.write(
      "BookingService ::: getSchedules :: results count : " + results.length
    );
    var schedules = [];
    for (var i = 0; i < results.length; i++) {
      var r = results[i].toJSON();
      r.from = utils.moment(r.from).format("YYYY-MM-DD HH:mm");
      r.to = utils.moment(r.to).format("YYYY-MM-DD HH:mm");
      r.location =
        r.booking && r.booking.office
          ? await systemUtils.getLocation(r.booking.office.building.locationId)
          : "";
      schedules.push(r);
    }

    return schedules;
  } catch (e) {
    log.write("BookingsService ::: getSchedules :: exception :", e);
    throw e;
  }
};
service.getSchedule = async (id) => {
  try {
    log.write("BookingService ::: getSchedule :: id : ", id);
    var where = { id: id };
    var schedule = await Schedule.findOne({
      where: where,
      include: [
        { as: "assigned", model: User, attributes: ["name", "phone"] },
        {
          as: "booking",
          model: Booking,
          include: [
            {
              as: "client",
              model: Client,
              attributes: [
                "id",
                "name",
                "email",
                "phone",
                "company",
                "panCardId",
                "gstRegistrationId",
                "companyRegistrationId",
              ],
            },
            {
              as: "contract",
              model: Contract,
              attributes: [
                "id",
                "status",
                "term",
                "kind",
                "rent",
                "type",
                "agreementId",
                "signedAgreementId",
                "agreementAccepted",
              ],
            },
          ],
        },
      ],
    });
    log.write(
      "BookingService ::: getSchedule :: schedule : ",
      schedule.toJSON()
    );
    var booking = schedule.booking;
    var schedule = {
      id: schedule.id,
      type: schedule.type,
      status: schedule.status,
      from: utils.moment(schedule.from).format("MMM DD, YYYY hh:mm a"),
      to: utils.moment(schedule.to).format("MMM DD, YYYY hh:mm a"),
      booking: {
        id: booking.id,
        contractId: booking.contract.id,
        contractStatus: booking.contract.status,
        contractTerm: booking.contract.term,
        contractKind: booking.contract.kind,
        reserved: utils.moment(booking.reserved).format("MMM DD, YYYY"),
        started: utils.moment(booking.started).format("MMM DD, YYYY"),
        ended: booking.ended
          ? utils.moment(booking.ended).format("MMM DD, YYYY")
          : null,
        status: booking.status,
        refNo: booking.refNo,
        desks: booking.desks,
        type: booking.contract.type,
        rent: booking.contract.rent,
        agreementAccepted: booking.contract.agreementAccepted,
        panCard: await systemUtils.getFile(booking.client.panCardId),
        gstRegistration: await systemUtils.getFile(
          booking.client.gstRegistrationId
        ),
        companyRegistration: await systemUtils.getFile(
          booking.client.companyRegistrationId
        ),
        agreement: await systemUtils.getFile(booking.contract.agreementId),
        signedAgreement: await systemUtils.getFile(
          booking.contract.signedAgreementId
        ),
        offices: booking.offices,
        location: await systemUtils.getLocation(booking.locationId),
        assigned: booking.assigned,
        client: booking.client,
        due: booking.due,
      },
    };
    return schedule;
  } catch (e) {
    log.write("BookingsService ::: getSchedule :: exception :", e);
    throw e;
  }
};
service.saveSchedule = async (data, username) => {
  try {
    log.write("BookingService ::: saveSchedule :: data : ", data);
    var schedule = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      await Schedule.update(data, { where: { id: data.id } });
      schedule = data;
    } else if (data.bookingId && !data.newBooking) {
      await Schedule.update(data, { where: { bookingId: data.bookingId } });
      schedule = data;
    } else {
      schedule = await Schedule.create(data);
    }
    return schedule;
  } catch (e) {
    log.write("BookingService ::: saveSchedule :: exception : ", e);
    throw e;
  }
};

service.sendBookingWelcomeMail = async (id, tokenPdfId, tokenSdPdfId) => {
  try {
    var booking = await service.getBooking(id);
    var linkId = uuid();
    var data = {
      bookingId: booking.id,
    };
    var urlLink = config.selfcareUrl + "#/selfcare/pending-payment/" + linkId;
    SelfcareLink.create({
      linkId: linkId,
      url: urlLink,
      context: "PendingPayment",
      data: JSON.stringify(data),
      created: new Date(),
      companyId: booking.company.id,
    });

    var data = {
      companyName: booking.client.name,
      teamName: booking.company.name,
      address:
        booking.offices +
        ", " +
        (await systemUtils.getLocation(booking.locationId)),
      startDate: moment(booking.startDate).format("MMM DD, YYYY"),
      refNo: booking.refNo,
      tokenPaymentLink: urlLink,
      tokenAmount: booking.contract.token,
      supportPhone: booking.company.supportPhone,
      supportEmail: booking.company.supportEmail,
    };
    log.write("MailsService ::: sendBookingWelcomeMail :: data : ", data);

    var mailBody = await services.getMailBody(
      "emails/booking_welcome.html",
      data
    );
    log.write(
      "MailsService ::: sendBookingWelcomeMail :: mailBody : ",
      mailBody.length
    );
    var receivers = [];
    receivers.push({
      name: booking.client.name,
      email: booking.client.email,
      bookingId: booking.id,
    });
    var attachments = [];
    if (tokenPdfId) {
      var pdf = await systemUtils.getFile(tokenPdfId);
      attachments.push({ filename: pdf.name, path: pdf.file });
    }
    if (tokenSdPdfId) {
      var sdPdf = await systemUtils.getFile(tokenSdPdfId);
      attachments.push({ filename: sdPdf.name, path: sdPdf.file });
    }
    return await services.sendMail(
      booking.company.name + " :: New Booking Initimation Notification",
      mailBody,
      receivers,
      attachments
    );
  } catch (e) {
    log.write("MailsService ::: sendBookingWelcomeMail :: exception : ", e);
    throw e;
  }
};
service.sendBookingConfirmation = async (id) => {
  try {
    var booking = await service.getBooking(id);
    var data = {
      companyName: booking.client.name,
      teamName: booking.company.name,
      address:
        booking.offices +
        ", " +
        (await systemUtils.getLocation(booking.locationId)),
      startDate: moment(booking.startDate).format("MMM DD, YYYY"),
      refNo: booking.refNo,
      supportPhone: booking.company.supportPhone,
      supportEmail: booking.company.supportEmail,
    };
    log.write("MailsService ::: sendBookingConfirmation :: data : ", data);

    var mailBody = await services.getMailBody(
      "emails/booking_intimation.html",
      data
    );
    log.write(
      "MailsService ::: sendBookingConfirmation :: mailBody : ",
      mailBody.length
    );
    var receivers = [];
    receivers.push({
      name: booking.client.name,
      email: booking.client.email,
      bookingId: booking.id,
    });
    var pdf = await systemUtils.getFile(booking.contract.agreementId);
    var attachments = [{ filename: pdf.name, path: pdf.file }];
    return await services.sendMail(
      booking.company.name + " :: New Booking Confirmation Notification",
      mailBody,
      receivers,
      attachments
    );
  } catch (e) {
    log.write("MailsService ::: sendBookingConfirmation :: exception : ", e);
    throw e;
  }
};
service.sendFinalStatementApprovalMail = async (id) => {
  try {
    var exitRequest = await ExitRequest.findOne({
      where: { id: id },
      include: [
        { as: "booking", model: Booking, include: ["company", "client"] },
      ],
    });

    var linkId = uuid();
    var data = {
      exitRequestId: exitRequest.id,
      bookingId: exitRequest.bookingId,
    };
    var urlLink =
      config.selfcareUrl + "#/selfcare/accept-final-statement/" + linkId;
    SelfcareLink.create({
      linkId: linkId,
      url: urlLink,
      context: "AcceptFinalStatement",
      data: JSON.stringify(data),
      created: new Date(),
      companyId: exitRequest.booking.company.id,
    });

    var data = {
      companyLogo: exitRequest.booking.company.logo,
      clientName: exitRequest.booking.client.name,
      companyName: exitRequest.booking.company.name,
      supportPhone: exitRequest.booking.company.supportPhone,
      supportEmail: exitRequest.booking.company.supportEmail,
      office: exitRequest.booking.offices,
      link: urlLink,
      from: utils.moment(exitRequest.booking.started).format("MMM DD, YYYY"),
      to: utils.moment(exitRequest.exitDate).format("MMM DD, YYYY"),
      location: await systemUtils.getLocation(exitRequest.booking.locationId),
      refNo: exitRequest.booking.refNo,
      monthlyInvoices: exitRequest.monthlyInvoices
        ? parseInt(exitRequest.monthlyInvoices)
        : 0,
      earlyExitCharge: exitRequest.earlyExitCharge
        ? parseInt(exitRequest.earlyExitCharge)
        : 0,
      noticePeriodPenalty: exitRequest.noticePeriodPenalty
        ? parseInt(exitRequest.noticePeriodPenalty)
        : 0,
      assetDamages: exitRequest.assetDamages
        ? parseInt(exitRequest.assetDamages)
        : 0,
      otherDeductions: exitRequest.otherDeductions
        ? parseInt(exitRequest.otherDeductions)
        : 0,
      tdsLiability: exitRequest.tdsLiability
        ? parseInt(exitRequest.tdsLiability)
        : 0,
      tdsPenality: exitRequest.tdsPenalty
        ? parseInt(exitRequest.tdsPenalty)
        : 0,
      deregistrationLiability: exitRequest.deregistrationLiability
        ? parseInt(exitRequest.deregistrationLiability)
        : 0,
      expectedAmount: exitRequest.expectedAmount
        ? parseInt(exitRequest.expectedAmount)
        : 0,
      totalPaid: exitRequest.totalPaid ? parseInt(exitRequest.totalPaid) : 0,
      refund: exitRequest.refund ? parseInt(exitRequest.refund) : 0,
      due: exitRequest.due ? parseInt(exitRequest.due) : 0,
    };
    log.write(
      "MailsService ::: sendFinalStatementApprovalMail :: data : ",
      data
    );

    var mailBody = await services.getMailBody(
      "emails/final_statement_approval.html",
      data
    );
    log.write(
      "MailsService ::: sendFinalStatementApprovalMail :: mailBody : ",
      mailBody.length
    );
    var receivers = [];
    receivers.push({
      name: exitRequest.booking.client.name,
      email: exitRequest.booking.client.email,
      bookingId: exitRequest.booking.id,
    });
    var pdf = await systemUtils.getFile(exitRequest.finalStatementId);
    var attachments = [{ filename: pdf.name, path: pdf.file }];
    return await services.sendMail(
      exitRequest.booking.company.name +
        " :: Requesting for Final Settlement Approval",
      mailBody,
      receivers,
      attachments
    );
  } catch (e) {
    log.write(
      "MailsService ::: sendFinalStatementApprovalMail :: exception : ",
      e
    );
    throw e;
  }
};
service.sendPaymentConfirmation = async (id, amount) => {
  try {
    var booking = await Booking.findOne({
      where: { id: id },
      include: ["client", "company"],
    });
    var data = {
      clientName: booking.client.name,
      grandTotal: amount,
      paymentDate: moment().format("MMM DD, YYYY"),
      refNo: booking.refNo,
      teamName: booking.company.name,
      supportPhone: booking.company.supportPhone,
      supportEmail: booking.company.supportEmail,
    };
    log.write("MailsService ::: sendBookingConfirmation :: data : ", data);

    var mailBody = await services.getMailBody(
      "emails/payment_received.html",
      data
    );
    log.write(
      "MailsService ::: sendBookingConfirmation :: mailBody : ",
      mailBody.length
    );
    var receivers = [];
    receivers.push({
      name: booking.client.name,
      email: booking.client.email,
      bookingId: booking.id,
    });
    return await services.sendMail(
      booking.company.name + " :: New Payment of Rs." + amount + " received",
      mailBody,
      receivers
    );
  } catch (e) {
    log.write("MailsService ::: sendBookingConfirmation :: exception : ", e);
    throw e;
  }
};

service.bookingExpansion = async (data, username) => {
  try {
    log.write("BookingService ::: bookingExpansion : data : ", data);
    var contract = _.clone(data.contract);
    delete contract.agreementId;
    delete contract.agreement;
    delete contract.signedAgreementId;
    delete contract.signedAgreement;
    contract.date = moment().format("YYYY-MM-DD");
    contract.effectiveDate = moment(data.expansionDate).format("YYYY-MM-DD");
    contract.status = "Draft";
    contract.kind = "Expansion";
    contract.additionalDesks = data.desks.length;
    contract.bookingId = data.bookingId;
    var contract = await service.saveContract(contract, username);

    if (
      (!data.desks || data.desks.length == 0) &&
      data.selectedCabins &&
      data.selectedCabins.length
    ) {
      if (data.selectedCabins.desks && data.selectedCabins.desks.length) {
        data.desks = data.selectedCabins.desks;
      } 
      else if(data.selectedCabins[0].deskType = 'EnterpriseOffice'){
        
        
    log.write("Createbooking :: EnterpriseOffice :: cabin id :", data.selectedCabins);

    var selectedCabinsIn =[]
    for (var i = 0; i < data.selectedCabins.length; i++) {
      selectedCabinsIn.push(data.selectedCabins[i].id);

  }
      data.desks = await Desk.findAll({
          where: {
            cabinId: {in: selectedCabinsIn},
            
          },
        });

        log.write("Createbooking :: EnterpriseOffice :: desks :", data.desks);
      
      }
      else {
        for (var i = 0; i < data.selectedCabins.length; i++) {
          var desk = await adminService.saveDesk({
            name: "Default Desk",
            cabinId: data.selectedCabins[i].id,
          });
          desk.area = data.selectedCabins[i].totalArea;
          data.desks.push(desk);

          // log.write("BookingService ::: createBooking :: update selectedCabin : ", data.selectedCabins[i]);
          await Cabin.update(
            { usedArea: data.selectedCabins[i].totalArea },
            { where: { id: parseInt(data.selectedCabins[i].id) } }
          );
        }
      }
    }

    for (var i = 0; i < data.desks.length; i++) {
      var d = data.desks[i];
      var desk = await service.saveBookedDesk(
        {
          bookingId: data.bookingId,
          deskId: d.id,
          facilitySetId: d.facilitySetId,
          contractId: contract.id,
          price: Math.round(data.additionalRent / data.desks.length, 2),
          status: "Reserved",
          started: moment(data.expansionDate).format("YYYY-MM-DD"),
        },
        username
      );
    }

    return contract;
  } catch (e) {
    log.write("BookingService ::: bookingExpansion : exception : ", e);
    throw e;
  }
};
service.bookingContraction = async (data, username) => {
  try {
    log.write("BookingService ::: bookingContraction : data : ", data);
    var contract = data.contract;
    delete contract.agreementId;
    delete contract.agreement;
    delete contract.signedAgreementId;
    delete contract.signedAgreement;
    delete contract.additionalDesks;
    delete contract.additionalRent;
    delete contract.deskPrice;
    contract.date = moment().format("YYYY-MM-DD");
    contract.effectiveDate = moment(data.contractionDate).format("YYYY-MM-DD");
    contract.status = "Draft";
    contract.kind = "Contraction";
    contract.bookingId = data.bookingId;
    contract = await service.saveContract(contract, username);

    var oldDesks = _.clone(data.desks);
    for (var i = 0; i < oldDesks.length; i++) {
      var d = _.clone(data.desks[i]);
      d.status = "Releasing";
      d.ended = utils.moment(data.contractionDate).format("YYYY-MM-DD");

      var desk = await service.saveBookedDesk(d, username);
    }

    var remainingDesks = _.filter(data.desks, { status: "InUse" });
    var deskprice = contract.rent / remainingDesks.length;
    contract.set("deskPrice", deskprice);
    contract.set("desks", remainingDesks.length);
    contract.save();

    for (var i = 0; i < remainingDesks.length; i++) {
      var d = remainingDesks[i];
      var desk = await service.saveBookedDesk(
        {
          bookingId: data.bookingId,
          deskId: d.deskId,
          facilitySetId: d.facilitySetId,
          contractId: contract.id,
          price: Math.round(deskprice, 2),
          status: "Reserved",
          started: utils.moment(data.contractionDate).format("YYYY-MM-DD"),
        },
        username
      );
    }

    return contract;
  } catch (e) {
    log.write("BookingService ::: bookingContraction : exception : ", e);
    throw e;
  }
};
service.bookingRelocation = async (data, username) => {
  try {
    log.write("BookingService ::: bookingRelocation : data : ", data);
    var contract = _.clone(data.contract);
    delete contract.agreementId;
    delete contract.agreement;
    delete contract.signedAgreementId;
    delete contract.signedAgreement;
    contract.date = utils.moment().format("YYYY-MM-DD");
    contract.effectiveDate = utils
      .moment(data.relocationDate)
      .format("YYYY-MM-DD");
    contract.status = "Draft";
    contract.kind = "ReLocation";
    contract.bookingId = data.bookingId;

    if(data.deskTypes[0] != contract.deskType || data.deskTypes[0] != contract.type){
      contract.deskType = data.deskTypes[0];
      contract.type = data.deskTypes[0];
    }

    contract = await service.saveContract(contract, username);

    if (
      (!data.desks || data.desks.length == 0) &&
      data.selectedCabins &&
      data.selectedCabins.length
    ) {
      if (data.selectedCabins.desks && data.selectedCabins.desks.length) {
        data.desks = data.selectedCabins.desks;
      } 
      else if(data.selectedCabins[0].deskType = 'EnterpriseOffice'){
        
        
    log.write("Createbooking :: EnterpriseOffice :: cabin id :", data.selectedCabins);

    var selectedCabinsIn =[]
    for (var i = 0; i < data.selectedCabins.length; i++) {
      selectedCabinsIn.push(data.selectedCabins[i].id);

  }
      data.desks = await Desk.findAll({
          where: {
            cabinId: {in: selectedCabinsIn},
            
          },
        });

        log.write("Createbooking :: EnterpriseOffice :: desks :", data.desks);
      
      }
      else {
        for (var i = 0; i < data.selectedCabins.length; i++) {
          var desk = await adminService.saveDesk({
            name: "Default Desk",
            cabinId: data.selectedCabins[i].id,
          });
          desk.area = data.selectedCabins[i].totalArea;
          data.desks.push(desk);

          // log.write("BookingService ::: createBooking :: update selectedCabin : ", data.selectedCabins[i]);
          await Cabin.update(
            { usedArea: data.selectedCabins[i].totalArea },
            { where: { id: parseInt(data.selectedCabins[i].id) } }
          );
        }
      }
    }

    for (var i = 0; i < data.desks.length; i++) {
      var d = data.desks[i];
      var desk = await service.saveBookedDesk(
        {
          bookingId: data.bookingId,
          deskId: d.id,
          facilitySetId: d.facilitySetId,
          contractId: contract.id,
          price: Math.round(contract.rent / data.desks.length, 2),
          status: "Reserved",
          started: utils.moment(data.relocationDate).format("YYYY-MM-DD"),
        },
        username
      );
    }

    return contract;
  } catch (e) {
    log.write("BookingService ::: bookingRelocation : exception : ", e);
    throw e;
  }
};

service.confirmRelocation = async (contract, username) => {
  try {
    log.write("BookingService ::: confirmRelocation : contract : ", contract);

    var booking = await service.getBooking(contract.bookingId);
    if (contract.security > booking.contract.security) {
      var taxableAmount = contract.security - booking.contract.security;
      var invoiceDate = new Date();
      var invoice = {
        bookingId: booking.id,
        status: "Pending",
        date: invoiceDate,
        startDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
        endDate: utils.moment(invoiceDate).endOf("month").format("YYYY-MM-DD"),
        dueDate: utils.moment(contract.effectiveDate).format("YYYY-MM-DD"),
        type: "Liability",
        name: "ReLocation Security Deposit",
        updated: new Date(),
        updatedBy: "system",
        isLiability: 1,
      };
      invoice.amount = taxableAmount;
      invoice.taxableAmount = taxableAmount;
      invoice.gst = 0;
      invoice.tds = 0;
      invoice.due = taxableAmount;
      invoice.paid = 0;

      var invoiceService = await InvoiceService.findOne({
        where: {
          category: "SecurityDeposit",
          type: "DepositCharge",
          status: "Published",
          companyId: booking.companyId,
        },
      });
      log.write(
        "BookingService ::: raiseInvoice :: invoiceService : " +
          booking.contract.invoiceServiceType +
          " " +
          booking.companyId,
        invoiceService
      );
      if (invoiceService) {
        invoice.invoiceServiceId = invoiceService.id;
      }

      invoice = await Invoice.create(invoice);
      var refNo = await systemUtils.getRefNo(
        "Liability",
        booking.id,
        invoice.date,
        booking.company
      );
      // invoice.set("refNo", "INV" + utils.moment().format("YY") + (100000 + invoice.id));
      invoice.set("refNo", refNo);
      invoice.save();

      var item = {
        invoiceId: invoice.id,
        invoiceServiceId: invoiceService ? invoiceService.id : null,
        item: "Relocation Security Deposit",
        qty: 1,
        price: taxableAmount,
        amount: taxableAmount,
        cgst: 0,
        sgst: 0,
        igst: 0,
        total: taxableAmount,
      };
      await InvoiceItem.create(item);
      invoice = await service.sendInvoice(invoice.id);
    }

    if (utils.moment(contract.date).isSame(contract.effectiveDate, "month")) {
      var newBookedDesks = await BookedDesk.findAll({
        where: { contractId: contract.id, status: { $notIn: ["Cancelled"] } },
        include: [
          {
            as: "desk",
            model: Desk,
            include: [
              {
                as: "cabin",
                model: Cabin,
                include: ["office"],
              },
            ],
          },
        ],
      });
      var newOffices = [];
      if (newBookedDesks.length) {
        _.each(newBookedDesks, function (d) {
          newOffices.push(d.desk.cabin.office.name);
        });
        newOffices = _.uniq(newOffices);
      }

      log.write(
        "BookingService ::: bookingRelocation :: Generating new invoice with effective rent for this month ..!! month rents " +
          contract.rent +
          " - " +
          booking.contract.rent
      );
      var noOfDays = utils.moment(contract.effectiveDate).date() - 1;
      var oldRent =
        (booking.contract.rent / utils.moment().daysInMonth()) * noOfDays;
      var remainingDays = utils.moment().daysInMonth() - noOfDays;
      var newRent =
        (contract.rent / utils.moment().daysInMonth()) * remainingDays;
      log.write(
        "BookingService ::: bookingRelocation :: new rents : " +
          oldRent +
          " - " +
          newRent
      );

      var taxableAmount = oldRent + newRent;
      var amount = 0,
        gst = 0,
        igst = 0,
        cgst = 0,
        sgst = 0,
        tds = 0;
      var invoice = {
        bookingId: booking.id,
        status: "Pending",
        date: utils.moment().format("YYYY-MM-DD"),
        startDate: utils
          .moment(contract.effectiveDate)
          .startOf("month")
          .format("YYYY-MM-DD"),
        endDate: utils
          .moment(contract.effectiveDate)
          .add(-1, "days")
          .format("YYYY-MM-DD"),
        dueDate: utils.moment(contract.effectiveDate).format("YYYY-MM-DD"),
        type: booking.contract.invoiceServiceType,
        name: "ReLocation Revised Month Rent",
        updated: new Date(),
        updatedBy: "system",
        isLiability: 0,
      };
      var invoiceService = await InvoiceService.findOne({
        where: {
          category: "OfficeRent",
          type: "Monthly",
          status: "Published",
          companyId: booking.companyId,
        },
      });
      // log.write("BookingService ::: raiseInvoice :: invoiceService : " + booking.contract.invoiceServiceType + " " + booking.companyId, invoiceService);
      if (invoiceService) {
        invoice.invoiceServiceId = invoiceService.id;
      }
      await Invoice.update(
        { status: "Cancelled", isCancelled: 0 },
        {
          where: {
            bookingId: booking.id,
            invoiceServiceId: invoiceService ? invoiceService.id : null,
            date: { $between: [invoice.startDate, invoice.endDate] },
          },
        }
      );

      taxableAmount = Math.round(taxableAmount, 2);
      gst = Math.round(taxableAmount * 0.18, 2);
      if (
        booking.client.stateCode &&
        booking.client.stateCode != booking.company.stateCode
      ) {
        igst = gst;
      } else {
        sgst = Math.round(gst / 2, 2);
        cgst = Math.round(gst / 2, 2);
      }
      if (service.hasTds(contract.rent, booking.started, invoice.date)) {
        tds = taxableAmount * 0.1;
      }
      amount = taxableAmount + gst - tds;

      invoice.amount = amount;
      invoice.taxableAmount = taxableAmount;
      invoice.gst = gst;
      invoice.tds = tds;
      invoice.due = amount;
      invoice.paid = 0;

      if (amount > 0) {
        invoice = await Invoice.create(invoice);
        var refNo = await systemUtils.getRefNo(
          "MonthlyInvoice",
          booking.id,
          invoice.date,
          booking.company
        );
        // invoice.set("refNo", "INV" + utils.moment().format("YY") + (100000 + invoice.id));
        invoice.set("refNo", refNo);
        invoice.save();

        // log.write("BookingService ::: raiseBookingInvoices :: booking : ", booking);
        var item = {
          invoiceId: invoice.id,
          invoiceServiceId: invoiceService ? invoiceService.id : null,
          item:
            booking.bookedDesks.length +
            " desks rent in " +
            booking.offices +
            " <br> for period of " +
            utils
              .moment(contract.effectiveDate)
              .startOf("month")
              .format("MMM DD, YYYY") +
            " - " +
            utils
              .moment(contract.effectiveDate)
              .add(-1, "days")
              .format("MMM DD, YYYY"),
          qty: booking.bookedDesks.length,
          price: oldRent / booking.bookedDesks.length,
          amount: oldRent,
          cgst: oldRent * 0.09,
          sgst: oldRent * 0.09,
          igst: oldRent * 0.18,
        };
        item.total = item.amount + item.igst;
        await InvoiceItem.create(item);

        item = {
          invoiceId: invoice.id,
          invoiceServiceId: invoiceService ? invoiceService.id : null,
          item:
            newBookedDesks.length +
            " desks rent in " +
            newOffices.join(",") +
            " <br> for period of " +
            utils.moment(contract.effectiveDate).format("MMM DD, YYYY") +
            " - " +
            utils
              .moment(contract.effectiveDate)
              .endOf("month")
              .format("MMM DD, YYYY"),
          qty: newBookedDesks.length,
          price: newRent / newBookedDesks.length,
          amount: newRent,
          cgst: newRent * 0.09,
          sgst: newRent * 0.09,
          igst: newRent * 0.18,
        };
        item.total = item.amount + item.igst;
        await InvoiceItem.create(item);

        await service.sendInvoice(invoice.id);
      }
    }
    BookedDesk.update({
        status: "Releasing",
        // status: "Released", 
        ended: utils.moment(contract.effectiveDate).add(-1, "days").toDate(),},{ where: 
        { $and: [{ contractId: { $not: contract.id} }, { bookingId: booking.id },]}
      });

    await service.updateBookingLedger(booking.id);
    return contract;
  } catch (e) {
    log.write("BookingService ::: confirmRelocation : exception : ", e);
    throw e;
  }
};
service.confirmExpansion = async (contract, username) => {
  try {
    log.write("BookingService ::: confirmExpansion : contract : ", contract);
    var booking = await service.getBooking(contract.bookingId);

    if (contract.security > booking.contract.security) {
      var taxableAmount = contract.security - booking.contract.security;
      var invoiceDate = new Date();
      var invoice = {
        bookingId: booking.id,
        status: "Pending",
        date: invoiceDate,
        startDate: utils.moment(invoiceDate).format("YYYY-MM-DD"),
        endDate: utils.moment(invoiceDate).endOf("month").format("YYYY-MM-DD"),
        dueDate: utils.moment(contract.effectiveDate).format("YYYY-MM-DD"),
        type: "Liability",
        name: "Expansion Security Deposit",
        updated: new Date(),
        updatedBy: "system",
        isLiability: 1,
      };
      invoice.amount = taxableAmount;
      invoice.taxableAmount = taxableAmount;
      invoice.gst = 0;
      invoice.tds = 0;
      invoice.due = taxableAmount;
      invoice.paid = 0;

      var invoiceService = await InvoiceService.findOne({
        where: {
          category: "SecurityDeposit",
          type: "DepositCharge",
          status: "Published",
          companyId: booking.companyId,
        },
      });
      log.write(
        "BookingService ::: raiseInvoice :: invoiceService : " +
          booking.contract.invoiceServiceType +
          " " +
          booking.companyId,
        invoiceService
      );
      if (invoiceService) {
        invoice.invoiceServiceId = invoiceService.id;
      }

      invoice = await Invoice.create(invoice);
      var refNo = await systemUtils.getRefNo(
        "Liability",
        booking.id,
        invoice.date,
        booking.company
      );
      // invoice.set("refNo", "INV" + utils.moment().format("YY") + (100000 + invoice.id));
      invoice.set("refNo", refNo);
      invoice.save();

      var item = {
        invoiceId: invoice.id,
        invoiceServiceId: invoiceService ? invoiceService.id : null,
        item: "Expansion Security Deposit",
        qty: 1,
        price: taxableAmount,
        amount: taxableAmount,
        cgst: 0,
        sgst: 0,
        igst: 0,
        total: taxableAmount,
      };
      await InvoiceItem.create(item);
      invoice = await service.sendInvoice(invoice.id);
    }

    if (
      utils
        .moment(contract.date)
        .isSame(utils.moment(contract.effectiveDate), "month")
    ) {
      var newBookedDesks = await BookedDesk.findAll({
        where: { contractId: contract.id },
        include: [
          {
            as: "desk",
            model: Desk,
            include: [
              {
                as: "cabin",
                model: Cabin,
                include: ["office"],
              },
            ],
          },
        ],
      });
      var newOffice = "";
      if (newBookedDesks.length) {
        newOffice = newBookedDesks[0].desk.cabin.office.name;
      }

      var remainingDays =
        utils.moment().daysInMonth() -
        utils.moment(contract.effectiveDate).date() +
        1;
      var expansionRent =
        ((contract.rent - booking.contract.rent) /
          utils.moment().daysInMonth()) *
        remainingDays;
      log.write(
        "BookingService ::: bookingExpansion :: remainingDays : " +
          remainingDays +
          " - contract.rent : " +
          contract.rent +
          ", booking.contract.rent : " +
          booking.contract.rent +
          " - expansionRent : " +
          expansionRent
      );

      var taxableAmount = expansionRent;
      var amount = 0,
        gst = 0,
        igst = 0,
        cgst = 0,
        sgst = 0,
        tds = 0;
      var invoice = {
        bookingId: booking.id,
        status: "Pending",
        date: utils.moment().format("YYYY-MM-DD"),
        startDate: utils.moment(contract.effectiveDate).format("YYYY-MM-DD"),
        endDate: utils
          .moment(contract.effectiveDate)
          .endOf("month")
          .add(-10, "hours")
          .format("YYYY-MM-DD"),
        dueDate: utils.moment(contract.effectiveDate).format("YYYY-MM-DD"),
        type: booking.contract.invoiceServiceType,
        name: "Expansion Desk Rent",
        updated: new Date(),
        updatedBy: "system",
        isLiability: 0,
      };
      var invoiceService = await InvoiceService.findOne({
        where: {
          category: "OfficeRent",
          type: "Monthly",
          status: "Published",
          companyId: booking.companyId,
        },
      });
      // log.write("BookingService ::: raiseInvoice :: invoiceService : " + booking.contract.invoiceServiceType + " " + booking.companyId, invoiceService);
      if (invoiceService) {
        invoice.invoiceServiceId = invoiceService.id;
      }

      await Invoice.update(
        { status: "Cancelled", isCancelled: 1 },
        {
          where: {
            bookingId: booking.id,
            invoiceServiceId: invoiceService ? invoiceService.id : null,
            date: { $between: [invoice.startDate, invoice.endDate] },
          },
        }
      );

      taxableAmount = Math.round(taxableAmount, 2);
      gst = Math.round(taxableAmount * 0.18, 2);
      if (
        booking.client.stateCode &&
        booking.client.stateCode != booking.company.stateCode
      ) {
        igst = gst;
      } else {
        sgst = Math.round(gst / 2, 2);
        cgst = Math.round(gst / 2, 2);
      }
      if (service.hasTds(contract.rent, booking.started, invoice.date)) {
        tds = taxableAmount * 0.1;
      }
      amount = taxableAmount + gst - tds;

      invoice.amount = amount;
      invoice.taxableAmount = taxableAmount;
      invoice.gst = gst;
      invoice.tds = tds;
      invoice.due = amount;
      invoice.paid = 0;

      if (amount > 0) {
        invoice = await Invoice.create(invoice);
        var refNo = await systemUtils.getRefNo(
          "MonthlyInvoice",
          booking.id,
          invoice.date,
          booking.company
        );
        // invoice.set("refNo", "INV" + utils.moment().format("YY") + (100000 + invoice.id));
        invoice.set("refNo", refNo);
        invoice.save();

        // log.write("BookingService ::: raiseBookingInvoices :: booking : ", booking);
        var item = {
          invoiceId: invoice.id,
          invoiceServiceId: invoice.invoiceServiceId,
          invoiceServiceId: invoiceService ? invoiceService.id : null,
          item:
            newBookedDesks.length +
            " desks expansion rent in " +
            newOffice +
            " <br> for period of " +
            utils.moment(contract.effectiveDate).format("MMM DD, YYYY") +
            " - " +
            utils
              .moment(contract.effectiveDate)
              .endOf("month")
              .format("MMM DD, YYYY"),
          qty: newBookedDesks.length,
          //price: Math.round(expansionRent / newBookedDesks.length, 2),
          amount: expansionRent,
          cgst: expansionRent * 0.09,
          sgst: expansionRent * 0.09,
          igst: expansionRent * 0.18,
        };
        item.total = item.amount + item.igst;
        await InvoiceItem.create(item);

        await service.sendInvoice(invoice.id);
      }
    }

    await service.updateBookingLedger(booking.id);
    return contract;
  } catch (e) {
    log.write("BookingService ::: confirmExpansion : exception : ", e);
    throw e;
  }
};
service.confirmContraction = async (contract, username) => {
  try {
    log.write("BookingService ::: confirmContraction : contract : ", contract);

    return contract;
  } catch (e) {
    log.write("BookingService ::: confirmContraction : exception : ", e);
    throw e;
  }
};

service.vacateOffice = async (data, username) => {
  try {
    log.write("BookingService ::: vacateOffice : vacateOffice : ", data);
    var result = BookedDesk.update({
      // status: "Releasing", ended: utils.moment(contract.effectiveDate).add(-1, "days").toDate(),
       status: "Released", 
    },{ where: { $and: [{ contractId: data.contractId }, { bookingId: data.bookingId },]}
    });
    return result;
  } catch (e) {
    log.write("BookingService ::: vacateOffice : exception : ", e);
    throw e;
  }
};

service.renewContract = async (data, username) => {
  try {
    log.write("BookingService ::: renewContract :: data : ", data);
    var contract = await Contract.findOne({ where: { id: data.contractId } });
    contract = contract.toJSON();
    delete contract.id;
    contract.kind = "Renewal";
    contract.date = new Date();
    contract.rent = data.newRent;
    contract.lockIn = 0;
    contract.effectiveDate = data.newEffectiveDate;
    contract.status = "Draft";
    return await service.saveContract(contract, username);
  } catch (e) {
    log.write("BookingService ::: renewContract :: exception : ", e);
    throw e;
  }
};
service.getContractRenewalBookings = async (data) => {
  try {

    let extendedSql = '';
    if (data.bookingId) {
      extendedSql = `OR (DATE_ADD(ct.effectiveDate, INTERVAL 11 MONTH) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 600 DAY))`;
    }    

    var sql = `select b.id, b.id bookingid, ct.id contractId, ifnull(c.company,c.name) company, ct.kind, b.offices, b.started, ct.rent, (ct.rent*1.1) newRent, ct.effectiveDate, DATE_ADD(ct.effectiveDate,INTERVAL 11 MONTH) newEffectiveDate
    from bookings b, clients c, contracts ct where b.clientId=c.id and b.id=ct.bookingid and b.status in ('Active')  and ct.status!='Cancelled'  and
     b.companyId=:companyId 
    and (
	(DATE_ADD(ct.effectiveDate, INTERVAL 11 MONTH) < CURDATE()) 
     OR (DATE_ADD(ct.effectiveDate, INTERVAL 11 MONTH) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 60 DAY)) ${extendedSql}
	) `
    
    if (data.bookingId) {
      sql = sql + " and b.id=" + data.bookingId;
    }
    sql = sql + ` order by ct.effectiveDate`; 
//   and  DATE_ADD(ct.effectiveDate,INTERVAL 60 MONTH) BETWEEN :startDate AND :endDate 
    var startDate = utils.moment().add(-1, "months").startOf("month");
    var endDate = utils.moment().add(1, "months").endOf("month");
    
    if (data.filters && data.filters.startDate) {
      startDate = utils.moment(data.filters.startDate).add(-12, "months");
    }
    if (data.filters && data.filters.endDate) {
      endDate = utils.moment(data.filters.endDate).add(-12, "months");
      console.log("endDate...", endDate, data.filters.endDate, startDate);
    }
    if (data.startDate) {
      startDate = utils.moment(data.startDate);
    }
    if (data.endDate) {
      endDate = utils.moment(data.endDate);
    }
    var replacements = {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      companyId: data.companyId,
    };
    // log.write("ReservationService ::: getContractRenewalBookings :: sql : ", sql);
    log.write(
      "ReservationService ::: getContractRenewalBookings :: replacements : ",
      replacements
    );
    var results = await session.db.query(sql, {
      replacements: replacements,
      type: Sequelize.QueryTypes.SELECT,
    });
    log.write(
      "ReservationService ::: getContractRenewalBookings :: results length : ",
      results.length
    );

    var bookings = [];
    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      var sql1 =
        `select id from contracts where status!='Cancelled' and bookingId=` +
        result.id +
        ` and date(effectiveDate)='` +
        utils.moment(result.newEffectiveDate).format("YYYY-MM-DD") +
        `'`;
      // log.write("ReservationService ::: getContractRenewalBookings :: sql1 : ", sql1);
      var contracts = await session.db.query(sql1, {
        type: Sequelize.QueryTypes.SELECT,
      });
      // log.write("ReservationService ::: getContractRenewalBookings :: contracts length : ", contracts.length);
      if (contracts.length == 0) {
        bookings.push(result);
      }
    }
    return bookings;
  } catch (e) {
    log.write(
      "BookingService ::: getContractRenewalBookings :: exception : ",
      e
    );
    throw e;
  }
};

service.refundLiability = async (data, username) => {
  try {
    var booking = await Booking.findOne({
      where: { id: data.bookingId },
      include: ["client", "company", "exitRequest"],
    });
    var benificiary = await PayoutBenificiary.findOne({
      where: { clientId: booking.clientId },
    });
    if (!benificiary) {
      var accountData = {
        id: exitRequest.booking.client.id,
        accountNumber: booking.client.accountNumber,
        ifscCode: booking.client.ifscCode,
        name: booking.client.company || booking.client.name,
        email: booking.client.email,
        phone: booking.client.phone,
        address: booking.client.address,
      };
      benificiary = await services.addCashFreeBenificiaryForRefund(
        accountData,
        booking.companyId
      );
    }

    var payoutPayment = await PayoutPayment.create({
      payoutBenificiaryId: benificiary.id,
      paymentMode: "CashFree",
      info:
        "TDSRefund to " + benificiary.name + " for booking " + booking.refNo,
      amount: data.amount,
      approvedBy: username,
      approvedOn: new Date(),
      type: "ExitRefund",
      status: "Approved",
      exitRequestId: booking.exitRequest.id,
      updated: new Date(),
      updatedBy: username,
      companyId: booking.companyId,
    });
    log.write(
      "BookingService ::: refundLiability :: payoutPayment : ",
      payoutPayment.toJSON()
    );

    await Invoice.update(
      { isLiabilityCleared: 1, isCancelled: 1 },
      { where: { id: data.id } }
    );
    return payoutPayment;
  } catch (e) {
    log.write("BookingService ::: refundLiability :: exception : ", e);
    throw e;
  }
};

exports.service = service;