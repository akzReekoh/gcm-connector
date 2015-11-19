'use strict';

var isEmpty  = require('lodash.isempty'),
	gcm      = require('node-gcm'),
	platform = require('./platform'),
	sender, apiKey,
	defaults = {};

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {
	if (isEmpty(data.title) && isEmpty(defaults.title))
		return platform.handleException(new Error('Missing data parameter: title'));

	if (isEmpty(data.icon) && isEmpty(defaults.icon))
		return platform.handleException(new Error('Missing data parameter: icon'));

	if (isEmpty(data.sound) && isEmpty(defaults.sound))
		return platform.handleException(new Error('Missing data parameter: sound'));

	if (isEmpty(data.badge) && isEmpty(defaults.badge))
		return platform.handleException(new Error('Missing data parameter: badge'));

	if (isEmpty(data.body))
		return platform.handleException(new Error('Missing data parameter: body'));

	var message   = new gcm.Message(),
		regTokens = data.registrationTokens; //array of registered device IDs

	if (!isEmpty(data.objectProps))
		message.addData(data.objectProps);

	message.addNotification('title', data.title || defaults.title);
	message.addNotification('body', data.body);
	message.addNotification('icon', data.icon || defaults.icon);
	message.addNotification('sound', data.sound || defaults.sound);
	message.addNotification('badge', data.badge || defaults.badge);

	sender.send(message, {registrationTokens: regTokens}, function (err, result) {
		if (err)
			platform.handleException(err);
		else
			platform.log(result);
	});
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	platform.notifyClose();
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	apiKey = options.apiKey;
	sender = new gcm.sender(apiKey);

	defaults.title = options.default_title;
	defaults.icon = options.default_icon;
	defaults.sound = options.default_sound;
	defaults.badge = options.default_badge;

	platform.log('GCM Connector has initialized');
	platform.notifyReady();
});