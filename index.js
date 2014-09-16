var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/cu.Sphero-GGP-AMP-SPP' },
  device: { name: 'sphero', driver: 'sphero' },

  work: function(my) {
    var color = 0x00FF00,
        bitFilter = 0xFFFF00;

    after((1).seconds(), function() {
      console.log("Setting up Collision Detection...");
      my.sphero.detectCollisions();
      my.sphero.setDataStreaming(['locator', 'accelOne', 'velocity'], { n: 200, m: 1, pcnt: 0,});
      my.sphero.setBackLED(255);
      my.sphero.setRGB(color);
      my.sphero.stop();
    });

    my.sphero.on('data', function(data) {
      app.io.broadcast('draw', {color:color.toString(16), x:data[0], y:data[1]})
    });

    my.sphero.on('collision', function(data) {
      color = color ^ bitFilter;
      my.sphero.setRGB(color);
      my.sphero.roll(128, Math.floor(Math.random() * 360));
      app.io.broadcast('collision', {color:color.toString(16)})
    });

    every(5..seconds(), function() {
      my.sphero.roll(128, Math.floor(Math.random() * 360));
    });

  }
}).start();

var express = require('express.io')
var app = express().http().io()

// app.io.route('drawClick', function(req) {
//   req.io.broadcast('draw', req.data)
// })

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/client.html')
})

app.listen(7076)
