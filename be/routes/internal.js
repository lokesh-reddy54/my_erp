'use strict';

var routes = {
  admin: require('./internal/admin').route,
  assets: require('./internal/assets').route,
  accounts: require('./internal/accounts').route,
  bookings: require('./internal/bookings').route,
  leads: require('./internal/leads').route,
  support: require('./internal/support').route,
  reports: require('./internal/reports').route,
  pgs: require('./internal/pgs').route,
  visits: require('./internal/visits').route,
  purchases: require('./internal/purchases').route,
  client: require('./internal/client').route,
  selfcare: require('./internal/selfcare').route,
  dashboards: require('./internal/dashboards').route,
}

exports.routes = routes;