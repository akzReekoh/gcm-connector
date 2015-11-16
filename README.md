# GCM Connector

[![Build Status](https://travis-ci.org/Reekoh/gcm-connector.svg)](https://travis-ci.org/Reekoh/gcm-connector)
![Dependencies](https://img.shields.io/david/Reekoh/gcm-connector.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/gcm-connector.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

Google Cloud Messaging Connector Plugin for the Reekoh IoT platform. Integrates a Reekoh instance to GCM API for Google/Android Push Notifications.

Uses node-gcm library.

## Input Data

* title - Indicates notification title.
* body - Indicates notification body text.
* icon - Indicates notification icon. On Android: sets value to myicon for drawable resource myicon.png.
* sound - Indicates sound to be played. Supports only default currently.
* badge - Indicates the badge on client app home icon.
