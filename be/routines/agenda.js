const Agenda = require('agenda');

const mongoConnectionString = 'mongodb://localhost:27017/agenda';

// or override the default collection name:
let agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'jobs' } });

let jobTypes = ["raise-invoices"];

jobTypes.forEach(function(type) {
  require('./jobs/' + type)(agenda);
});

if (jobTypes.length) {
  // agenda.on('ready', function() {
  // agenda.start();
  // });
}

function graceful() {
  agenda.stop(function() {
    process.exit(0);
  });
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

module.exports = agenda;