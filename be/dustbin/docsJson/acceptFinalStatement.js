service.acceptFinalStatement = async (data, username) => {
  log.write("BookingService ::: acceptFinalStatement :: data : ", data);

  if (data.clientId) {
    await Client.update(data, { where: { id: data.clientId } });
  }

  var exitRequest = await ExitRequest.findOne({
    where: { id: data.exitRequestId },
    include: [
      { as: "booking", model: Booking, include: ["client", "company"] },
    ],
  });

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
  }

  return data;
};
