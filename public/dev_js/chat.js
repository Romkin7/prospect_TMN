$(function() {
	var socket = io();
	socket.on("connect", function() {
		console.log('User connected');
	 });
	socket.on("open-chat", function() {

	});
	socket.on("new-message", function() {
		
	})
});