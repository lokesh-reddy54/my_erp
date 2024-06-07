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
    // log.write("BookingService ::: searchOffices :: _buildings : ", _buildings);


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
      // log.write("BookingService ::: searchOffices :: _offices : ", _offices);


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

        // log.write("BookingService ::: searchOffices :: _cabins : ", _cabins.length);



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

      // log.write("BookingService ::: searchOffices :: building : ", building);
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