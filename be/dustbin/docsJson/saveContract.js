service.saveContract = async (data, username) => {
  try {
    log.write("BookingService ::: saveContract :: data : ", data);
    var contract = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    data.contractPeriod = 11;
    if (data.id) {
      contract = data;
      if (data.approved) {
        data.approvedBy = username;
        data.approvedOn = new Date();
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
        } else if (data.kind == "NewBooking") {
          await service.raiseBookingInvoices(data.bookingId);
          service.generateAgreementPdf(data.bookingId, true);
        } else if (data.kind == "ReLocation") {
          await service.confirmRelocation(data);
        } else if (data.kind == "Expansion") {
          await service.confirmExpansion(data);
        } else if (data.kind == "Contraction") {
          // await service.confirmContraction();
        } else if (data.kind == "Renewal") {
          var booking = await Booking.findOne({ id: data.bookingId });
          await BookedDesk.update(
            { contractId: contract.id, },
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
              if (
                utils
                  .moment(contract.date)
                  .isSame(utils.moment(contract.effectiveDate), "month")
              ) {
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
                  { contractId: lastContract.id },
                  { where: { id: contract.bookingId } }
                );
                if (data.kind == "ReLocation") {
                  await service.raiseInvoices({
                    bookingId: contract.bookingId,
                    ignoreCancelled: true,
                  });
                }
              } else if (
                utils
                  .moment()
                  .isSame(utils.moment(contract.effectiveDate), "month")
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

      if (
        data.kind == "NewBooking" &&
        contract.status == "Approved" &&
        (contract.token > 0 || contract.tokenSD > 0)
      ) { await service.raiseTokenInvoice(contract.bookingId);  }
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