'use strict'

let reekoh = require('demo-reekoh-node')
let _plugin = new reekoh.plugins.Connector()
let isEmpty = require('lodash.isempty')
let isArray = require('lodash.isarray')
let isPlainObject = require('lodash.isplainobject')
let async = require('async')
let GCM = require('node-gcm')
let sender = null
let defaults = {}

let sendData = (data, callback) => {
  if (isEmpty(data.title) && isEmpty(defaults.title)) { callback(new Error('Missing data parameter: title')) }

  if (isEmpty(data.icon) && isEmpty(defaults.icon)) {
    callback(new Error('Missing data parameter: icon'))
  }

  if (isEmpty(data.sound) && isEmpty(defaults.sound)) {
    callback(new Error('Missing data parameter: sound'))
  }

  if (isEmpty(data.badge) && isEmpty(defaults.badge)) {
    callback(new Error('Missing data parameter: badge'))
  }

  if (isEmpty(data.body)) {
    callback(new Error('Missing data parameter: body'))
  }

  let message = new GCM.Message()
  let regTokens = data.registrationTokens // array of registered device IDs

  if (!isEmpty(data.objectProps)) message.addData(data.objectProps)

  message.addNotification('title', data.title || defaults.title)
  message.addNotification('body', data.body)
  message.addNotification('icon', data.icon || defaults.icon)
  message.addNotification('sound', data.sound || defaults.sound)
  message.addNotification('badge', data.badge || defaults.badge)

  sender.send(message, {registrationTokens: regTokens}, (err, result) => {
    if (!err) {
      _plugin.log(result)
    }

    callback(err)
  })
}

/**
 * Emitted when device data is received.
 * This is the event to listen to in order to get real-time data feed from the connected devices.
 * @param {object} data The data coming from the device represented as JSON Object.
 */
_plugin.on('data', (data) => {
  if (isPlainObject(data)) {
    sendData(data, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else if (isArray(data)) {
    async.each(data, (datum, done) => {
      sendData(datum, done)
    }, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else {
    _plugin.logException(new Error(`Invalid data received. Data must be a valid Array/JSON Object or a collection of objects. Data: ${data}`))
  }
})

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 */
_plugin.once('ready', () => {
  sender = new GCM.sender(_plugin.config.apiKey)

  defaults.title = _plugin.config.defaultTitle
  defaults.icon = _plugin.config.defaultIcon
  defaults.sound = _plugin.config.defaultSound
  defaults.badge = _plugin.config.defaultBadge

  _plugin.log('GCM Connector has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
