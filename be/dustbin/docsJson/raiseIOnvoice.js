service.raiseInvoice = async (data, sendNotifications) => {
  try {
    log.write("BookingService ::: raiseInvoice :: data : ", data);
    var booking = await service.getBooking(data.id);
    //console.log("LLLLLLLLLLLLLLLLLLLLL REFNO -- 1", invoice.refNo)
    if (booking) {
      var invoice;
      if (data.invoiceId) {
        invoice = await Invoice.findOne({ where: { id: data.invoiceId } });
        if (!invoice.refNo) {
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


        var rent = booking.contract.rent,
          amount = 0,
          taxableAmount = 0,
          gst = 0,
          igst = 0,
          cgst = 0,
          sgst = 0,
          tds = 0;





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

 {
          itemDescription = "Advance Business Services"; 
          qty = booking.desks || 1;
          price = booking.contract.rent / (booking.desks || 1);

          var item = {
            invoiceId: invoice.id,
            invoiceServiceId: invoiceService ? invoiceService.id : null,
            item: itemDescription,
            qty: qty,
            price: price,
            amount: taxableAmount,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            tds: tds,
            total: taxableAmount + gst-tds,
          };
          await InvoiceItem.create(item);
        }
      }



      return invoice;
    }
  } catch (e) {
    log.write("BookingService ::: raiseInvoice :: exception : ", e);
    throw e;
  }
};