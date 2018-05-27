"use strict";
const mongoose = require('mongoose');

exports = module.exports = function(io) { 
  // Set socket.io listeners.
  io.on('connection', (socket) => {
  	console.log("user connected");
  });	
};