"use strict";

var Q = require("q");
var fs = require("fs");
var path = require("path");
var promisify = require("util").promisify;
var _ = require("lodash");
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
let request = require("async-request");
var requestPromise = require("request-promise");
var moment = require("moment");
var htmlToPdf = require("html-to-pdf");
var HTML5ToPDF = require("html5-to-pdf");
var pdfConversion = require("phantom-html-to-pdf")();

const Freemarker = require("freemarker");
const freemarker = new Freemarker();

const nodemailer = require("nodemailer");
var mailers = [];
var webpushers = [];
var whatsapps = [];

var config = require("../utils/config").config;
var session = require("./session");
var log = require("../utils/log").log;
var utils = require("../utils/utils").utils;
var systemUtils = require("./utils/system_util").utils;

var Doc = require("./models/base").Doc;
var Company = require("./models/base").Company;
var User = require("./models/base").User;
var UserNotification = require("./models/base").UserNotification;
var Mail = require("./models/base").Mail;
var BookingMail = require("./models/base").BookingMail;
var LeadMail = require("./models/base").LeadMail;
var TicketMail = require("./models/base").TicketMail;
var ExternalSystem = require("./models/base").ExternalSystem;
var Client = require("./models/base").Client;
var PayoutBenificiary = require("./models/base").PayoutBenificiary;
var OpexBill = require("./models/base").OpexBill;
var PayoutPayment = require("./models/base").PayoutPayment;
var PayoutEntry = require("./models/base").PayoutEntry;
var ResourceImage = require("./models/base").ResourceImage;
var PurchaseOrder = require("./models/base").PurchaseOrder;
var BuildingImage = require("./models/base").BuildingImage;
var PropertyImage = require("./models/base").PropertyImage;
var PurchaseItemStatusImage = require("./models/base").PurchaseItemStatusImage;
var PurchaseOrderMilestone = require("./models/base").PurchaseOrderMilestone;

var ExitRefund = require("./models/base").ExitRefund;
var OpexCategory = require("./models/base").OpexCategory;
var OpexType = require("./models/base").OpexType;
var OpexBill = require("./models/base").OpexBill;
var Vendor = require("./models/base").Vendor;
var VendorContact = require("./models/base").VendorContact;
var VendorBankAccount = require("./models/base").VendorBankAccount;
var VendorPaymentTerm = require("./models/base").VendorPaymentTerm;
var VendorSku = require("./models/base").VendorSku;
var PurchaseItem = require("./models/base").PurchaseItem;
var PurchaseOrderInvoice = require("./models/base").PurchaseOrderInvoice;
var PurchaseOrderMilestone = require("./models/base").PurchaseOrderMilestone;
var Provider = require("./models/base").Provider;
var ProviderContact = require("./models/base").ProviderContact;
var ProviderBankAccount = require("./models/base").ProviderBankAccount;
var ProviderPortal = require("./models/base").ProviderPortal;

var mailParser = require("../mailparser/mail.parser").parser;

var service = {};
var externalSystems = [];

service.initServices = async () => {
  try {
    externalSystems = await ExternalSystem.findAll({ where: { active: 1 } });
    log.write(
      "Services ::: initServices :: externalSystems : " +
        externalSystems.length +
        " are found .. !! "
    );

    var outboundMailSystems = _.filter(externalSystems, {
      type: "OutBoundMail",
    });
    _.each(outboundMailSystems, function (s) {
      var config = JSON.parse(s.config);
      var mailer = nodemailer.createTransport({
        // service: 'gmail',
        host: config.host,
        port: config.port,
        secure: config.secure ? true : false, // true for 465, 587 for false for other ports
        auth: {
          user: config.senderEmail, // generated ethereal user
          pass: config.password, // generated ethereal password
        },
      });
      mailers.push({ mailer: mailer, config: config, companyId: s.companyId });
      log.write(
        "Services ::: initServices :: OutBoundMail : " +
          s.name +
          " started .. ! "
      );
    });

    var inboundMailSystems = _.filter(externalSystems, { type: "InBoundMail" });
    if (inboundMailSystems.length && config.mailParser) {
      mailParser.init(inboundMailSystems);
    }

    var pushers = _.filter(externalSystems, { type: "PushNotification" });
    if (pushers.length) {
      _.each(pushers, async (s) => {
        var config = JSON.parse(s.config);
        var company = await Company.findOne({ where: { id: s.companyId } });
        webpushers.push({
          key: config.key,
          secret: config.secret,
          icon: company.squareLogo,
          url: company.erpDomain,
          companyId: s.companyId,
        });
      });
    }
  } catch (e) {
    log.write("Services ::: initServices :: exception : ", e);
    throw e;
  }
};

service.generatePdf = async (inputFile, outputPdf) => {
  try {
    log.write("Services ::: generatePdf :: inputFile : " + inputFile);
    var tmpHtmlFile = inputFile.replace("./tmp/", "");
    const html5ToPDF = new HTML5ToPDF({
      renderDelay: 200,
      launchOptions: {
        headless: true,
        args: ["--no-sandbox"],
      },
      inputPath: inputFile,
      outputPath: path.join(__dirname, "..", "resources", outputPdf),
    });

    await html5ToPDF.start();
    await html5ToPDF.build();
    await html5ToPDF.close();

    return outputPdf;
  } catch (e) {
    log.write("Services ::: generatePdf :: exception : ", e);
    throw e;
  }
};
service.parseContent = async (file, data) => {
  // log.write("Services :::  parseContent :: file : " + file);
  log.write("Services :::  parseContent :: data : ", data);
  log.write(
    "Services :::  parseContent :: inputFile : ",
    path.join(__dirname, "../templates/" + file)
  );

  try {
    for (var key in data) {
      console.log(key, data[key]);
      if (data[key] == null) {
        data[key] = "";
      }
    }
    var tmpFile = "./tmp/file_" + new Date().getTime() + ".html";
    var template = await fs.readFileSync("./templates/" + file, "utf8");
    log.write("Services :::  parseContent :: template : " + template.length);
    return new Promise((resolve, reject) => {
      freemarker.render(template, data, (err, content) => {
        if (err) {
          reject(new Error(err));
        }
        log.write("Services :::  parseContent :: content : " + content.length);
        if (content) {
          fs.writeFile(tmpFile, content, "utf8", function (err) {
            if (err) reject(err);
            resolve(tmpFile);
          });
        } else {
          log.write("Services :::  parseContent :: content not rendered  ");
          reject("unable to render freemarked template");
        }
      });
    });
  } catch (e) {
    log.write("Services :::  parseContent :: exception : ", e);
    throw e;
  }
};
service.createDoc = async (name, file) => {
  try {
    if (!file) {
      file = name.replace(/\s/g, "_");
    }
    var doc = await Doc.create({
      name: name,
      file: file,
      type: file.split(".").pop(),
      date: new Date(),
    });
    doc.set(
      "file",
      (config.uploadsUrl ? config.uploadsUrl : ``) +
        doc.id +
        "_" +
        file
    );
    doc.save();
    return doc.toJSON();
  } catch (e) {
    log.write("Services :::  createDoc :: exception : ", e);
    throw e;
  }
};
service.getMailBody = async (file, data) => {
  try {
    log.write("Services ::: getMailBody :: data : ", data);
    var tmpFile = await service.parseContent(file, data);
    log.write("Services ::: getMailBody :: tmpFile : ", tmpFile);
    var mailBody = await fs.readFileSync(tmpFile, "utf8");
    return mailBody;
  } catch (e) {
    log.write("Services ::: getMailBody :: exception : ", e);
    throw e;
  }
};

service.sendMail = async (subject, body, receivers, attachments, companyId) => {
  try {
    var mailer = _.find(mailers, { companyId: companyId || 1 });
    // log.write("Services :::  sendMail :: mailers : ", mailers);
    var status = "Waiting";
    if (mailer) {
      var to = [];
      _.each(receivers, function (r) {
        to.push('"' + r.name + '" <' + r.email + ">");
      });
      log.write("Services :::  sendMail :: to : ", to);
      if(config.sendEmails){
      let info = await mailer.mailer.sendMail({
        from:
          '"' +
          mailer.config.senderName +
          '" <' +
          mailer.config.senderEmail +
          ">",
        to: to.join(","),
        cc:"harishkumar@hustlehub.xyz,mohamed.m@hustlehub.xyz",
        subject: subject,
        html: body,
        attachments: attachments,
      });
      status = "Sent";
    }
  }
    var mail = await Mail.create({
      subject: subject,
      body: body,
      receivers: to.join(","),
      date: new Date(),
      type: "Outbox",
      status: status,
      by: "system",
    });

    log.write("Services :::  sendMail :: receivers: ", receivers);

    if (receivers[0].bookingId) {
      BookingMail.create({ mailId: mail.id, bookingId: receivers[0].bookingId });
    }
    _.each(receivers, function (r) {
      if (r.leadId) {
        LeadMail.create({ mailId: mail.id, leadId: r.leadId });
      }
      if (r.ticketId) {
        TicketMail.create({ mailId: mail.id, ticketId: r.ticketId });
      }
    });
    log.write("Services :::  sendMail :: mail : ", mail.toJSON());
    return mail;
  } catch (e) {
    log.write("Services :::  sendMail :: exception : ", e);
    throw e;
  }
};
service.sendSMS = async (to, message, sender) => {
  try {
    to = to.substr(to.length - 10);
    var msg = encodeURIComponent(message);
    var source = sender || "CLOOTP";
    // var source = sender || "ACCOOS";
    // var source = sender || "CLOMOS";

    var url =
      "http://sms6.rmlconnect.net:8080/bulksms/bulksms?username=Clomoso&password=CLOMOSO1&type=0&dlr=1&destination=" +
      to +
      "&source=" +
      source +
      "&message=" +
      msg;
    log.write("Services::: SendSMS :: url : " + url);
    var response = await request(url, {
      method: "GET",
    });

    return response;
  } catch (e) {
    log.write("Services::: SendSMS :: exception : ", e);
  }
};

service.sendNotifications = async (
  title,
  message,
  link,
  userIds,
  companyId
) => {
  try {
    var webpusher = _.find(webpushers, { companyId: companyId || 1 });
    log.write("Services :::  sendNotifications :: webpusher : ", webpusher);
    var status = "Waiting";
    if (webpusher) {
      var users = await User.findAll({
        where: {
          id: { $in: userIds },
          // $or: [{ $ne: { webPushId: null } }, { $ne: { mobilePushId: null } }]
        },
        attributes: ["id", "name", "webPushId", "mobilePushId"],
      });
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var data = {
          userId: user.id,
          title: title,
          message: message,
          link: webpusher.url + "/#/" + (link ? link : ""),
          key: webpusher.key,
          secret: webpusher.secret,
          icon: webpusher.icon,
        };
        if (user.webPushId) {
          data.webPushId = user.webPushId;
          await service.sendWebPushNotification(data);
        }
        if (user.mobilePushId) {
          delete data.webPushId;
          data.mobilePushId = user.mobilePushId;
          await service.sendWebPushNotification(data);
        }
        var userNotification = await UserNotification.create({
          userId: data.userId,
          title: data.title,
          message: data.message,
          link: data.link,
          webPushId: user.webPushId,
          mobilePushId: user.mobilePushId,
          date: new Date(),
        });
        log.write(
          "Services ::: sendWebPushNotification :: userNotification ",
          userNotification.toJSON()
        );
      }
    }

    return data;
  } catch (e) {
    log.write("Services :::  sendNotifications :: exception : ", e);
    throw e;
  }
};
service.sendWebPushNotification = async (data) => {
  try {
    if (data.webPushId) {
      var webpushResponse = await requestPromise({
        method: "POST",
        uri: "https://app.webpushr.com/api/v1/notification/send/sid",
        headers: {
          webpushrKey: data.key,
          webpushrAuthToken: data.secret,
          "Content-Type": "application/json",
        },
        body: {
          sid: data.webPushId,
          title: data.title,
          message: data.message,
          icon: data.icon,
          target_url: data.link,
        },
        json: true,
      });
      log.write(
        "Services ::: sendWebPushNotification :: webpushResponse ",
        webpushResponse
      );
    }
    if (data.mobilePushId) {
      var mobilepushResponse = await requestPromise({
        method: "POST",
        uri: "https://app.webpushr.com/api/v1/notification/send/sid",
        headers: {
          webpushrKey: data.key,
          webpushrAuthToken: data.secret,
          "Content-Type": "application/json",
        },
        body: {
          sid: data.mobilePushId,
          title: data.title,
          message: data.message,
          icon: data.icon,
          target_url: data.link,
        },
        json: true,
      });
      log.write(
        "Services ::: sendWebPushNotification :: mobilepushResponse ",
        mobilepushResponse
      );
    }
  } catch (e) {
    log.write("Services ::: sendWebPushNotification :: exception : ", e);
    throw e;
  }
};

service.getCashFreeToken = async (companyId) => {
  log.write("Services ::: payoutSystems :: companyId " + companyId);
  var _payout = await ExternalSystem.findOne({
    where: { companyId: companyId || 1, active: 1, type: "PayoutGateway" },
  });

  try {
    if (_payout) {
      // log.write("Services ::: payoutSystems :: _payout ", _payout.toJSON());
      var cashfree =
        _payout.config && _payout.config != ""
          ? JSON.parse(_payout.config)
          : {};
      log.write("Services ::: payoutSystems :: cashfree ", cashfree);
      // var tokenResponse = await request(cashfree.host + '/payout/v1/authorize', {
      //   method: 'POST',
      //   headers: {
      //     'X-Client-Id': cashfree.key,
      //     'X-Client-Secret': cashfree.secret,
      //     'Content-Type': 'application/json'
      //   },
      //   data: {}
      // });
      // tokenResponse = JSON.parse(tokenResponse.body);
      var tokenResponse = await requestPromise({
        method: "POST",
        //uri: cashfree.host + "/payout/v1/authorize",
        uri: "https://payout-gamma.cashfree.com/payout/v1/authorize",
        headers: {
          "X-Client-Id": cashfree.key,
          "X-Client-Secret": cashfree.secret,
          "Content-Type": "application/json",
        },
        body: {},
        json: true,
      });
      log.write("Services ::: payoutSystems :: tokenResponse ", tokenResponse);
      if (tokenResponse.status == "SUCCESS") {
        log.write(
          "Services ::: getCashFreeToken :: tokenResponse : token ",
          tokenResponse.data.token
        );
        cashfree.token = tokenResponse.data.token;
        return cashfree;
      } else {
        log.write(
          "Services ::: tokenResponse :: error " + tokenResponse.message
        );
        throw tokenResponse.message;
      }
    } else {
      throw {
        message: "No Payout third party system is configured and active",
      };
    }
  } catch (e) {
    log.write("Services ::: getCashFreeToken :: exception : ", e);
    throw e;
  }
};
service.addCashFreeBenificiaryForRefund = async (client, companyId) => {
  log.write(
    "Services ::: addBeneficiaryForRefund :: client ",
    client.toJSON ? client.toJSON() : client
  );
  try {
    var cashfree = await service.getCashFreeToken(companyId);

    var beneId = client.id + client.name;
    //client.id + "_" + client.name.replace(new RegExp(" ", "g"), "_");
    beneId = beneId.replace(/[^\w\s]/gi, "");
    var postData = {
      beneId: beneId,
      bankAccount: client.accountNumber,
      ifsc: client.ifscCode,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address1:
        client.address && client.address != "" ? client.address : "address1",
    };
    if (config.isDev) {
      postData.beneId = "clomosotest_benificiary";
      postData.bankAccount = "00011020001772";
      postData.ifsc = "HDFC0000001";
    }
    log.write("Services ::: addBeneficiaryForRefund :: postData ", postData);

    var response = await requestPromise({
      method: "POST",
      //uri: cashfree.host + "/payout/v1/addBeneficiary",
      uri: "https://payout-gamma.cashfree.com/payout/v1/addBeneficiary",
      headers: {
        Authorization: "Bearer " + cashfree.token,
      },
      body: postData,
      json: true,
    });
    log.write("Services ::: addBeneficiaryForRefund :: response ", response);
    if (response.status == "SUCCESS" || config.isDev) {
      var benificiary = await PayoutBenificiary.create({
        active: 1,
        addedOn: new Date(),
        address: postData.address1,
        accountNumber: postData.bankAccount,
        ifscCode: postData.ifsc,
        benificiaryId: postData.beneId,
        name: postData.name,
        email: postData.email,
        phone: postData.phone,
        clientId: client.id,
      });
      log.write(
        "Services ::: addCashFreeBenificiaryForRefund :: benificiary",
        benificiary.toJSON()
      );
      return benificiary;
    } else if (response.status == "ERROR") {
      throw response.message;
    }
  } catch (error) {
    log.write("Services ::: addBeneficiaryForRefund :: error ", error);
    throw error;
  }
};
service.processPayout = async (payout, username) => {
  try {
    var cashfree = await service.getCashFreeToken(payout.companyId);

    var postData = {
      beneId: payout.benificiary.benificiaryId,
      amount: payout["amount"],
      transferId: payout.id + "_" + new Date().getTime(),
    };
    postData.amount = postData.amount.toFixed(2);
    log.write(
      "Services ::: processPayout :: requestTransfer : postData ",
      postData
    );
    log.write(
      "Services ::: processPayout :: requestTransfer : cashfree ",
      cashfree
    );
    payout.set("transferId", postData.transferId);
    if (config.isDev) {
      postData.amount = 1;
    }
    if (payout.type == "VendorPayment") {
      postData.remarks = "HH PO Payment : " + payout.info;
    } else if (payout.type == "BillPayment") {
      postData.remarks = "HH Payment : " + payout.info;
    } else if (payout.type == "ExitRefund") {
      postData.remarks = "HH ExitRefund : " + payout.info;
    }

    postData.remarks = postData.remarks.replace("%", "percent");
    postData.remarks = postData.remarks.replace(/[^a-zA-Z0-9 ]/g, "");
    postData.remarks = postData.remarks.substr(0, 67);
    try {
      var response = await requestPromise({
        method: "POST",
        uri: cashfree.host + "/payout/v1/requestTransfer",
        headers: {
          Authorization: "Bearer " + cashfree.token,
        },
        body: postData,
        json: true,
      });
      log.write(
        "Services ::: processPayout :: requestTransfer : response ",
        response
      );
      if (response.status == "SUCCESS") {
        try {
          payout.set("paymentRefId", response.data.referenceId);
          payout.set("utr", response.data.utr);
          payout.set("paidBy", username);
          payout.set("paymentMode", "CashFree");
          payout.set("paidOn", utils.getCurrentTime().toDate());
          payout.set("status", "Paid");
          payout.set("paymentStatus", "SUCCESS");
          payout.set("response", response.message);

          var payoutEntry = {
            payoutPaymentId: payout.id,
            utr: payout.utr,
            status: "Attributed",
            attributed: 1,
            amount: payout.amount,
            paidOn: new Date(),
            paidBy: username,
            chequeNo: payout.chequeNo,
            paymentMode: "PG",
            addedOn: new Date(),
            addedBy: "system",
            companyId: payout.companyId,
          };
          await PayoutEntry.create(payoutEntry);

          if (payout["type"] == "ExitRefund") {
            await ExitRefund.update(
              {
                refundDate: utils.getCurrentTime().toDate(),
                fcpStatus: "Refunded",
                utr: response.data.transfer.utr,
              },
              { where: { id: payout.exitRequestId } }
            );
          } else if (payout["type"] == "TDSRefund") {
            // var contractEnd = await payout.getContractEnd();
            // contractEnd.set('tds_refund_date', utils.getCurrentTime().toDate());
            // contractEnd.set('tds_refund_status', 'Completed');
            // contractEnd.set('tds_refund_transaction_id', response.data.utr);
            // contractEnd.save();
          } else if (payout["type"] == "DeregistrationRefund") {
            // var contractEnd = await payout.getContractEnd();
            // contractEnd.set('address_deregistration_refund_date', utils.getCurrentTime().toDate());
            // contractEnd.set('address_deregistration_refund_status', 'Completed');
            // contractEnd.set('address_deregistration_refund_transaction_id', response.data.utr);
            // contractEnd.save();
          } else if (
            payout["type"] == "VendorPayment" ||
            payout["type"] == "BillPayment"
          ) {
            await PurchaseOrderMilestone.update(
              {
                paidOn: new Date(),
                paidBy: username,
                status: "Paid",
                utr: response.data.utr,
              },
              { where: { payoutId: payout.id, status: "Approved" } }
            );
            PurchaseOrder.update(
              { status: "Paid" },
              { where: { id: payout.purchaseOrderId, isBill: 1 } }
            );
            service.updatePurchaseOrderLedger(payout.purchaseOrderId);

            var purchaseOrder = await PurchaseOrder.findOne({
              include: ["project"],
              where: { id: payout.purchaseOrderId },
            });
            if (purchaseOrder.project) {
              var info = payout.info;
              info = info + " / " + purchaseOrder.project.title;
              payout.set("info", info);
            }
          }

          payout.save();
          log.write("Services ::: processPayout :: payout", payout.toJSON());
          return payout;
        } catch (e) {
          log.write("Services ::: processPayout :: inner exception ", e);
          throw e;
        }
      } else if (response.status == "ERROR") {
        payout.set("status", "Error");
        payout.set("paymentStatus", "ERROR");
        payout.set("response", response.message);
        payout.save();

        throw response.message;
      } else if (response.status == "PENDING") {
        payout.set("status", "PayoutPending");
        payout.set("paymentStatus", "PENDING");
        payout.set("response", response.message);
        payout.save();

        return payout;
      }
    } catch (error) {
      log.write("Services ::: processPayout :: promise exception ", error);
      throw error;
    }
  } catch (e) {
    log.write("Services ::: processPayout :: method exception ", e);
    throw e;
  }
};
service.updatePayoutStatus = async (payout, username) => {
  try {
    var cashfree = await service.getCashFreeToken(payout.companyId);

    log.write(
      "Services ::: updatePayoutStatus :: getTransferStatus : cashfree ",
      cashfree
    );
    try {
      var response = await requestPromise({
        method: "GET",
        uri:
          cashfree.host +
          "/payout/v1/getTransferStatus?transferId=" +
          payout.transferId,
        headers: {
          Authorization: "Bearer " + cashfree.token,
        },
        json: true,
      });
      log.write(
        "Services ::: updatePayoutStatus :: getTransferStatus : response ",
        response
      );
      if (response.status == "SUCCESS") {
        try {
          if (
            response.data &&
            response.data.transfer &&
            response.data.transfer.status == "SUCCESS"
          ) {
            payout.set("utr", response.data.transfer.utr);
            payout.set(
              "paidOn",
              utils.moment(response.data.transfer.processedOn).toDate()
            );
            payout.set("status", "Paid");
            payout.set("paymentMode", "CashFree");
            payout.set("paymentStatus", "SUCCESS");
            payout.set("response", response.message);

            var info = payout.info;

            if (payout["type"] == "ExitRefund") {
              await ExitRefund.update(
                {
                  refundDate: utils.getCurrentTime().toDate(),
                  fcpStatus: "Refunded",
                  utr: response.data.transfer.utr,
                },
                { where: { id: payout.exitRequestId } }
              );
            } else if (payout["type"] == "TDSRefund") {
              // var contractEnd = await payout.getContractEnd();
              // contractEnd.set('tds_refund_date', utils.getCurrentTime().toDate());
              // contractEnd.set('tds_refund_status', 'Completed');
              // contractEnd.set('tds_refund_transaction_id', response.data.utr);
              // contractEnd.save();
            } else if (payout["type"] == "DeregistrationRefund") {
              // var contractEnd = await payout.getContractEnd();
              // contractEnd.set('address_deregistration_refund_date', utils.getCurrentTime().toDate());
              // contractEnd.set('address_deregistration_refund_status', 'Completed');
              // contractEnd.set('address_deregistration_refund_transaction_id', response.data.utr);
              // contractEnd.save();
            } else if (
              payout["type"] == "VendorPayment" ||
              payout["type"] == "BillPayment"
            ) {
              await PurchaseOrderMilestone.update(
                {
                  paidOn: new Date(),
                  paidBy: username,
                  status: "Paid",
                  utr: response.data.transfer.utr,
                },
                { where: { payoutId: payout.id, status: "Approved" } }
              );

              PurchaseOrder.update(
                { status: "Paid" },
                { where: { id: payout.purchaseOrderId, isBill: 1 } }
              );
              service.updatePurchaseOrderLedger(payout.purchaseOrderId);

              var purchaseOrder = await PurchaseOrder.findOne({
                include: ["project"],
                where: { id: payout.purchaseOrderId },
              });
              if (purchaseOrder.project) {
                info = info + " / " + purchaseOrder.project.title;
                payout.set("info", info);
              }
            }
          } else if (response.data.status == "ERROR") {
            payout.set("status", "Error");
            payout.set("paymentStatus", "ERROR");
            payout.set("response", response.message);
            payout.save();

            throw response.message;
          } else if (response.data.status == "PENDING") {
            payout.set("status", "PayoutPending");
            payout.set("paymentStatus", "PENDING");
            payout.set("response", response.message);
          }

          payout.save();
          log.write(
            "Services ::: updatePayoutStatus :: payout",
            payout.toJSON()
          );
          return payout;
        } catch (e) {
          log.write("Services ::: updatePayoutStatus :: inner exception ", e);
          throw e;
        }
      } else if (response.status == "ERROR") {
        throw response.message;
      }
    } catch (error) {
      log.write("Services ::: updatePayoutStatus :: promise exception ", error);
      throw error;
    }
  } catch (e) {
    log.write("Services ::: updatePayoutStatus :: method exception ", e);
    throw e;
  }
};

service.addStatusImage = async (data) => {
  return await PurchaseItemStatusImage.create(data);
};
service.addResourceImage = async (data) => {
  return await ResourceImage.create(data);
};
service.addBuildingImage = async (data) => {
  return await BuildingImage.create(data);
};
service.addPropertyImage = async (data) => {
  return await PropertyImage.create(data);
};

service.updatePurchaseOrderLedger = async (id) => {
  try {
    var mileStones = await PurchaseOrderMilestone.findAll({
      where: {
        purchaseOrderId: id,
        status: { in: ["Draft", "Completed", "Confirmed", "Approved", "Paid"] },
      },
      include: ["purchaseOrder"],
    });
    if (mileStones.length) {
      var amount = _.sumBy(mileStones, "amount");
      var tds = _.sumBy(mileStones, "tds");
      var draftAmount = _.sumBy(
        _.filter(mileStones, { status: "Draft" }),
        "amount"
      );
      var releasedAmount = _.sumBy(
        _.filter(mileStones, { status: "Released" }),
        "amount"
      );
      var approvedAmount = _.sumBy(
        _.filter(mileStones, { status: "Approved" }),
        "amount"
      );
      var paidAmount = _.sumBy(
        _.filter(mileStones, { status: "Paid" }),
        "amount"
      );
      var dueAmount = _.sumBy(
        _.filter(mileStones, function (m) {
          var dueDate = m.actualDate || m.expectedDate;
          if (dueDate) {
            return utils.moment(dueDate).isBefore(utils.moment());
          }
          return false;
        }),
        "amount"
      );

      var update = {
        amount: amount + tds,
        draftAmount: draftAmount,
        releasedAmount: releasedAmount,
        approvedAmount: approvedAmount,
        paidAmount: paidAmount,
        dueAmount: dueAmount,
      };
      if (paidAmount >= amount && !mileStones[0].purchaseOrder.isBill) {
        update.status = "Closed";
      }
      log.write(
        "PurchaseService ::: updatePurchaseOrderLedger :: update for  " + id,
        update
      );
      await PurchaseOrder.update(update, { where: { id: id } });

      if (amount) {
        var projectId = mileStones[0].purchaseOrder.projectId;
        await session.db.query(
          "update vendor_projects set budgetAmount=(select sum(amount) paid from vendor_purchase_orders where projectId=" +
            projectId +
            ") where id=" +
            projectId
        );
        await session.db.query(
          "update vendor_projects set paidAmount=(select sum(paidAmount) paid from vendor_purchase_orders where projectId=" +
            projectId +
            ") where id=" +
            projectId
        );
        await session.db.query(
          "update vendor_projects set approvedAmount=(select sum(approvedAmount) paid from vendor_purchase_orders where projectId=" +
            projectId +
            ") where id=" +
            projectId
        );
        await session.db.query(
          "update vendor_projects set releasedAmount=(select sum(releasedAmount) paid from vendor_purchase_orders where projectId=" +
            projectId +
            ") where id=" +
            projectId
        );
        await session.db.query(
          "update vendor_projects set draftAmount=(select sum(draftAmount) paid from vendor_purchase_orders where projectId=" +
            projectId +
            ") where id=" +
            projectId
        );
        await session.db.query(
          "update vendor_projects set dueAmount=(select sum(dueAmount) paid from vendor_purchase_orders where projectId=" +
            projectId +
            ") where id=" +
            projectId
        );
      }
    }
  } catch (e) {
    log.write(
      "PurchaseService ::: updatePurchaseOrderLedger :: exception : ",
      e
    );
    throw e;
  }
};

service.migrateProviders = async () => {
  try {
    var providers = await Provider.findAll({
      include: [
        { as: "providerContacts", model: ProviderContact, required: false },
        { as: "bankAccount", model: ProviderBankAccount, required: false },
      ],
    });

    for (var pi = 0; pi < providers.length; pi++) {
      var pro = providers[pi];
      var vendor = await Vendor.findOne({ where: { name: pro.name } });
      if (!vendor) {
        vendor = await Vendor.create({
          vendorType: pro.type,
          name: pro.name,
          address: pro.address,
          date: pro.date,
          paymentMode: pro.paymentMode,
          companyId: pro.companyId,
          status: "Registered",
          active: pro.active,
          verified: 1,
          isServiceVendor: 1,
        });
        vendor.set("refNo", "VEN-HH-" + (10000 + vendor.id));
        vendor.save();
      }
      var sku = await VendorSku.create({
        vendorId: vendor.id,
        opexTypeId: pro.opexTypeId,
        status: "Approved",
        active: 1,
      });
      var ix = 0;
      if (pro.providerContacts) {
        _.each(pro.providerContacts, async (c) => {
          await VendorContact.create({
            vendorId: vendor.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            isMainContact: ix == 0 ? 1 : 0,
            active: 1,
            verified: 1,
            date: pro.date,
          });
          ix++;
        });
      }
      if (pro.bankAccount) {
        await VendorBankAccount.create({
          vendorId: vendor.id,
          accountNumber: pro.bankAccount.accountNumber,
          ifscCode: pro.bankAccount.ifscCode,
          benificiaryName: pro.bankAccount.accountHolderName,
          active: pro.bankAccount.active,
          verified: 1,
          date: pro.date,
        });
      }

      var bills = await OpexBill.findAll({
        where: {
          serviceProviderId: pro.id,
          status: { $in: ["Raised", "Approved", "Paid", "New", "PrePaid"] },
        },
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
      });
      for (var bi = 0; bi < bills.length; bi++) {
        var b = bills[bi];
        var billData = {
          vendorId: vendor.id,
          skuId: sku.id,
          opexTypeId: pro.opexTypeId,
          buildingId: b.buildingId,
          officeId: b.officeId,
          payoutPaymentId: b.payoutPaymentId,
          opexPaymentId: b.opexPaymentId,
          amount: b.amount,
          billDate: b.billDate,
          dateFrom: b.dateFrom,
          dateTo: b.dateTo,
          billDueDate: b.billDueDate,
          status: b.status,
          indexNo: b.indexNo,
          imageId: b.imageId,
          utr: b.utr,
          paidOn: b.paidOn,
          paidBy: b.paidBy,
          paymentMode: b.paymentMode,
          debitCardAccountId: b.debitCardAccountId,
          pettyCashAccountId: b.pettyCashAccountId,
          isPrepaid: b.isPrepaid,
          companyId: b.companyId,
        };
        if (b.opexType) {
          var bill = {};
          bill.opexCategory = b.opexType.category
            ? b.opexType.category.name
            : b.opexType.type.category.name;
          if (b.opexType.type) {
            bill.opexItem = b.opexType ? b.opexType.name : null;
            bill.opexType =
              b.opexType && b.opexType.type ? b.opexType.type.name : null;
            billData.item =
              bill.opexCategory + ", " + bill.opexType + ", " + bill.opexItem;
          } else {
            bill.opexType = b.opexType ? b.opexType.name : null;
            billData.item = bill.opexCategory + ", " + bill.opexType;
          }
        }
        var billPo = await service.addOpexBill(billData);
      }
      log.write(
        "Services ::: migrateProviders :: vendor " + pi,
        vendor.toJSON()
      );
    }
    log.write(
      "Services ::: migrateProviders :: providers count " + providers.length
    );
  } catch (e) {
    log.write("Services ::: migrateProviders :: exception : ", e);
    throw e;
  }
};
service.addOpexBill = async (data) => {
  try {
    // log.write("Services ::: addOpexBill :: data ", data);
    var bill = {
      vendorId: data.vendorId,
      buildingId: data.buildingId,
      officeId: data.officeId,
      opexPaymentId: data.opexPaymentId,
      amount: data.amount,
      date: data.billDate,
      status: data.status,
      companyId: data.companyId,
      isOpex: 1,
      isBill: 1,
    };
    if (bill.status == "Paid") {
      bill.paidAmount = bill.amount;
    } else if (bill.status == "Approved") {
      bill.approvedAmount = bill.amount;
    } else {
      bill.releasedAmount = bill.amount;
    }
    var refNo = await systemUtils.getRefNo("Bill", null, null, {
      id: 1,
      shortName: "HH",
    });
    bill.refNo = refNo;
    var po = await PurchaseOrder.create(bill);
    var item = await PurchaseItem.create({
      purchaseOrderId: po.id,
      opexTypeId: data.opexTypeId,
      units: 1,
      taxableAmount: data.amount - data.gst + data.tds,
      gst: data.gst,
      amount: data.amount,
      status: "Ordered",
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
      isPrepaid: data.isPrepaid,
    });
    var status = "Draft";
    if (data.status == "Approved") {
      status = "Approved";
    } else if (data.status == "Paid") {
      status = "Paid";
    }
    var mileStone = {
      purchaseOrderId: po.id,
      name: data.item || "Full Bill Payment",
      status: status,
      amount: data.amount,
      paymentMode: data.paymentMode || "BankTransfer",
      payoutId: data.payoutPaymentId,
      utr: data.utr,
      paidBy: data.paidBy,
      paidOn: data.paidOn,
    };
    mileStone = await PurchaseOrderMilestone.create(mileStone);
    if (data.imageId || data.billDueDate) {
      var doc = await PurchaseOrderInvoice.create({
        purchaseOrderId: po.id,
        amount: data.amount,
        docId: data.imageId,
        billNo: data.indexNo,
        invoiceDate: data.billDate,
        invoiceDueDate: data.billDueDate,
        udpated: new Date(),
        updatedBy: data.updatedBy,
      });
    }
    po.set("taxInvoiceId", doc.id);
    po.save();
    log.write("Services ::: addOpexBill :: po raised : ", po.refNo);
  } catch (e) {
    log.write("Services ::: addOpexBill :: exception : ", e);
    throw e;
  }
};

exports.service = service;
