const {Client, Location, List, Buttons, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

var bookingsService = require("../services/bookings").service;
var reportsService = require('../services/reports').service;
var utils = require("../utils/utils.js").utils;

const client = new Client({ authStrategy: new LocalAuth() });


client.on('qr', (qr) => {
  qrcode.generate(qr, {small: true});
});


client.on('ready', () => {
  console.log('Client is READY...!');
  client.sendMessage("919000021909@c.us", "hello");
});

client.on('message', async msg => {
  console.log('MESSAGE RECEIVED', msg);
    if (msg.body == 'Hi') {
        console.log("Replay ::: ", msg.reply('pong'));
    }else if (msg.body === 'Buttons') {
      let button = new Buttons('Button body', [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }], 'title', 'footer');
     let b = client.sendMessage(msg.from, button);
      console.log("Buttons::: ", b);
  } else if (msg.body === 'List') {
      let sections = [{ title: 'sectionTitle', rows: [{ title: 'ListItem1', description: 'desc' }, { title: 'ListItem2' }] }];
      let list = new List('List body', 'btnText', sections, 'Title', 'footer');
     let l = client.sendMessage(msg.from, list);
     client.sendMessage(msg.from, list);
      console.log("List ::: ", l, msg.from, " ::L::", list);
  }
  else if(msg.from =='918328414899@c.us'){
    if(msg.body == 'Bc'){
      let req = {"companyId":1,"statuses":["Active"],"deskType":["PrivateOffice","EnterpriseOffice"]};
      var data = await reportsService.loadBuildingBookings(req, 'loki');
      console.log("BC data",data)
      let rly = '';
      data.forEach(d => {rly = rly + d.name+ " : " +d.count+"\n";}); 
      console.log("Replay ::: ", msg.reply(rly));
    }
    else if(msg.body.slice(0,2) == 'Sc'){
      let ser = msg.body.slice(3, 70);
      let req = `{
        filters: {
          statuses: [],
          excludeStatuses: [ 'Cancelled', 'Settled' ],
          deskType: [ 'PrivateOffice', 'EnterpriseOffice' ],
          search: '${ser}'
        },
        limit: 20,
        offset: 0,
        companyId: 1,
        timezone: null
      }`;
      // `{"filters":{"statuses":[],"excludeStatuses":["Cancelled","Settled"],"deskType":["PrivateOffice","EnterpriseOffice"],"search":"${ser}"},"limit":20,"offset":0}`;
      var data = await bookingsService.listBookings(JSON.parse(req));
      console.log("BC data",data)
      let rly = '';
      data.forEach(d => {
        rly = rly + d.id + " :: " +d.client.company
        +"\nCabins: "+d.cabins +", Desks: "+d.desks
        +"\n"+d.office.building.name+", "+d.office.name
        +"\nType: "+d.contract.deskType+", Status: "+d.status
        +"\nRent: "+d.contract.rent+"\n\n\n";});

      console.log("Replay ::: ", msg.reply(rly));
    }
  }
});

client.initialize();


