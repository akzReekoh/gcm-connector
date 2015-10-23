'use strict';

var _ = require('lodash'),
	platform = require('./platform'),
	gcm = require('node-gcm'),
	apiKey;


/*
 * Listen for the data event.
 */
platform.on('data', function (data) {

	var message = new gcm.Message(),
		regTokens = data.registrationTokens, //array of registered device IDs
		sender = new gcm.Sender(apiKey);

	_.forEach(data.objectProps, function (value, key) {
		message.addData(key, value);
	});

	//or simpply add the data object
	//message.addData(data.objectProps);

	sender.send(message, { registrationTokens: regTokens }, function (err, result) {
		if(err)
			console.error(err);
		else
			console.log(result);
	});

	console.log(data);
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	conn.logout(function () {
		platform.notifyClose();
	});
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {

	apiKey = options.apiKey;

	console.log(options);
	platform.notifyReady();
});