'use strict';

var Q = require('q');
var moment = require('moment');
var _ = require('lodash');
// var MailListener = require("mail-listener2");
var htmlToText = require('html-to-text');
var MailListener = require("mail-listener2-updated");
var { NlpManager, ConversationContext } = require('node-nlp');
var nlp = new NlpManager({ languages: ['en'] });

var io;
var config = require('../utils/config').config;
var log = require('../utils/log').log;
var utils = require('../utils/utils').utils;
var values = require('../utils/values').values;
var systemUtils = require('../services/utils/system_util').utils;
var classifier = require('./training').classifier;

var session = require("../services/session");
var Mail = require("../services/models/base").Mail;
var Doc = require("../services/models/base").Doc;
var BillsQueue = require("../services/models/base").BillsQueue;

var parser = {};

parser.init = async (mailParsers) => {
  try {
    _.each(mailParsers, function(p) {
      var config = p.config && p.config != "" ? JSON.parse(p.config) : null;
      if (config) {
        log.write("MailParser Initialising .... !! ");
        var mailListener = new MailListener({
          username: config.user,
          password: config.password, // works for me: https://accounts.google.com/b/0/IssuedAuthSubTokens?hide_authsub=1
          host: config.host || "imap.gmail.com",
          mailbox: "INBOX",
          port: config.port || 993, // imap port
          tls: config.tls ? true : false,
          tlsOptions: { rejectUnauthorized: false },
          debug: log.write,
          markSeen: config.markSeen ? true : false,
          // searchFilter: ["UNSEEN", "FLAGGED"],
          // fetchUnreadOnStart: true,
          attachments: true, // download attachments as they are encountered to the project directory
          attachmentOptions: { directory: "resources/" } // specify a download directory for attachments
        });
        log.write(p.name + " MailParser Initiated .... !! ");

        mailListener.on("server:connected", function() {
          log.write(p.name + " imapConnected");
        });

        mailListener.on("server:disconnected", function() {
          log.write(p.name + " imapDisconnected");
        });

        mailListener.on("error", function(err) {
          log.write(err);
        });

        mailListener.on("mail", function(mail, seqno, attributes) {
          log.write(p.name + " MailParser ::: emailParsed :: mail subject : ", mail.subject);
          // log.write("emailParsed :: mail from : ", mail.from);
          // log.write("emailParsed :: mail text : ", mail.text);
          // log.write("emailParsed :: mail html : ", mail.html);
          // log.write("emailParsed :: seqno : ", seqno);
          // log.write("emailParsed :: attributes : date : ", attributes.date);
          // log.write("emailParsed :: email : ", mail);
          // log.write("emailParsed :: attributes : ", attributes);
          // processEmail(mail, attributes);
          log.write("------------------------\n")
        });

        mailListener.on("attachment", async (attachment) => {
          log.write("attachment :: ", attachment);
          var doc = await Doc.create({
            file: values.uploadsUrl + attachment.fileName,
            name: attachment.fileName,
            type: attachment.fileName.split(".").pop(),
            date: new Date()
          })
          var billsQueue = await BillsQueue.create({
            imageId: doc.id,
            status: "Draft",
            addedOn: new Date(),
            addedBy: "MailParser",
            companyId: p.companyId
          })
          log.write("NewBill added to BillsQueue : ", billsQueue.toJSON());
        });

        mailListener.start();
      }
    })
  } catch (e) {
    log.write("MailParser ::: exception: ", e);
  }
}

async function processEmail(mail, attributes) {
  if (!io) {
    io = require("../socket").io;
  }
  try {
    var data = {
      subject: mail.subject,
      body: mail.text
    }
    var subResult = classifier.getClassifications(data.subject);
    // log.write("MailParser ::: processEmail :: subResult : ", subResult);
    var text = mail.text,
      bodyResult;
    if (mail.html) {
      text = htmlToText.fromString(mail.html);
    }
    if (text) {
      bodyResult = classifier.getClassifications(text);
    }
    // log.write("MailParser ::: processEmail :: bodyResult : ", bodyResult);

    var tags = [];
    var classifications = subResult.classifications;
    if (bodyResult) {
      classifications = classifications.concat(bodyResult.classifications);
    }
    // log.write("MailParser ::: processEmail :: classifications : ", classifications);

    var topClassifications = _.orderBy(classifications, ['value'], ['desc']);
    var intent = topClassifications[0].label;
    if (subResult.intent == intent) {
      tags.push(subResult.domain);
      tags.push(subResult.intent);
    } else if (bodyResult && bodyResult.intent == intent) {
      tags.push(bodyResult.domain);
      tags.push(bodyResult.intent);
    }

    var bodyEntities = await nlp.process('en', mail.text);
    // log.write("MailParser ::: processEmail :: bodyEntities : ", bodyEntities.entities);
    var emailEntity = _.find(bodyEntities.entities, { "entity": "email" });
    if (emailEntity) {
      tags.push(emailEntity.sourceText);
    }
    var phoneEntity = _.find(bodyEntities.entities, { "entity": "phonenumber" });
    if (phoneEntity) {
      tags.push(phoneEntity.sourceText);
    }

    // log.write("MailParser ::: processEmail :: new mail : data ", data);
    if (tags.length && tags[0] != "None") {
      log.write("MailParser ::: processEmail :: new mail : tags ", tags);
      data.tags = tags;
      io.emit('new_mail', data);
      // mailListener.imap.addFlags(attributes.uid, '\\Seen', function(err) {
      //   if (err) {
      //     log.write('MailParser :: mail not marked as read : ', err);
      //   }
      // });

      var mail = await Mail.create({
        subject: data.subject,
        body: mail.html || mail.text,
        from: JSON.stringify(mail.from),
        status: "Received",
        date: new Date(),
        type: 'Inbox',
        by: 'system',
        tags: JSON.stringify(tags)
      });
      log.write("MailParser ::: processEmail :: added new mail : ", mail.toJSON());
    }
  } catch (e) {
    log.write("MailParser ::: processEmail :: exception : ", e);
  }
}


exports.parser = parser;