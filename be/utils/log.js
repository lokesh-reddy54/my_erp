let fs = require('fs');

let log = {
  write: function(msg, object) {
    if (object) {
      console.log("\n" + msg, object);
      log.save("debug.log", msg + " : " + JSON.stringify(object));
    } else {
      console.log("\n" + msg);
      log.save("debug.log", msg);
    }
  },

  save: function(file, msg) {
    var stream = fs.createWriteStream("logs/" + file, { 'flags': 'a' });
    stream.once('open', function(fd) {
      stream.write(msg + "\n");
      stream.end();
    });
  }
}
exports.log = log;
