'use strict';

var _      = require('lodash'),
	cp     = require('child_process'),
	should = require('should'),
	connector;

describe('Connector', function () {
	this.slow(8000);

	after('terminate child process', function () {
		connector.send({
			type: 'close'
		});

		setTimeout(function () {
			connector.kill('SIGKILL');
		}, 4000);
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			should.ok(connector = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 8 seconds', function (done) {
			this.timeout(8000);

			connector.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			connector.send({
				type: 'ready',
				data: {
					options: {
						apiKey: '12345'
					}
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});

	describe('#data', function (done) {
		it('should process the data', function () {
			connector.send({
				type: 'data',
				data: {
					registrationTokens: ['1234', '4321'],
					objectProps: {
						key1: 'value1',
						key2: 'value2'
					}
				}
			}, done);
		});
	});
});
