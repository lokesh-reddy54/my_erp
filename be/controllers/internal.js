'use strict';

var controllers = {
  accounts: require('./internal/accounts').controller,
  admin: require('./internal/admin').controller,
  assets: require('./internal/assets').controller,
  bookings: require('./internal/bookings').controller,
  leads: require('./internal/leads').controller,
  support: require('./internal/support').controller,
  selfcare: require('./internal/selfcare').controller,
  pgs: require('./internal/pgs').controller,
  reports: require('./internal/reports').controller,
  purchases: require('./internal/purchases').controller,
  visits: require('./internal/visits').controller,
  client: require('./internal/client').controller,
  dashboards: require('./internal/dashboards').controller,
}

exports.controllers = controllers;