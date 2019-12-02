/* global chrome */

/*!
 * This file is part of Random User-Agent Browser Extension
 * @link https://github.com/tarampampam/random-user-agent
 *
 * Copyright (C) 2016 tarampampam <github.com/tarampampam>
 *
 * Everyone is permitted to copy and distribute verbatim or modified copies of this license
 * document, and changing it is allowed as long as the name is changed.
 *
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE TERMS AND CONDITIONS FOR COPYING,
 * DISTRIBUTION AND MODIFICATION
 *
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 */


// Do not execute JS protection on Firefox. Could become a problem if the extension is ported
// to Edge or Chrome starts to support the "browser" object.

function setGIFake(params) {
  var webgl = document.createElement('canvas').getContext('webgl');
  var extensionDebugRendererInfo = webgl.getExtension('WEBGL_debug_renderer_info');
  var vendorKey = extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL;
  var rendererKey = extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL;
  params = params || {
    evalLength: 37,
    webglVendor: 'Apple Inc.',
    webglRenderer: 'Apple GPU'
  };
  var evalLength = params.evalLength;
  var webglVendor = params.webglVendor;
  var webglRenderer = params.webglRenderer;
  return " \
    String = function () { \
    if (arguments[0] === eval) { \
      return { \
        length: "+ evalLength + " \
      } \
    }; \
    return arguments[0].toString(); \
    }; \
    eval.toString = function(){ \
      return { \
        length: "+ evalLength + " \
      } \
    }; \
    var document = window.document || document; \
    document.createElement = function () { \
      var el = document.createElementNS('http://www.w3.org/1999/xhtml', arguments[0]); \
      if (arguments[0] === 'canvas') { \
        var gl = el.getContext('webgl'); \
        el.getContext = function () { \
          if (arguments[0] === 'webgl' || arguments[0] === 'experimental-webgl') { \
            var gpFunc = gl.getParameter; \
            gl.getParameter = function () { \
              if (arguments[0] === " + vendorKey + ") { \
                return '"+ webglVendor + "'; \
              } else if (arguments[0] === " + rendererKey + ") { \
                return '"+ webglRenderer + "'; \
              }; \
              return document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas').getContext('webgl').getParameter.apply(this, arguments); \
            }; \
            return gl; \
          } \
          return document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas').getContext('2d'); \
        }; \
      }; \
      return el; \
    }; \
  "
}


if (typeof browser == 'undefined') {
  // document.createElement('canvas')
  chrome.runtime.sendMessage([
    { action: 'settings.getEnabled' },
    { action: 'settings.getJavascriptProtectionEnabled' },
    { action: 'settings.getFakeData' },
    { action: 'exceptions.uriMatch', data: { uri: window.location.href } } // Make wildcard search in exceptions list
  ], function (results) {
    var enabled = results[0],
      js_protection_enabled = results[1],
      fakeData = results[2],
      uri_match = results[3];

    var consoleMessage = function (message_text) {
      // if (typeof message_text === 'string') {
      //   console.log('[Random User-Agent] ' + message_text);
      // }
    };

    fakeData = fakeData || {
      width: 414,
      height: 896,
      availWidth: 414,
      availHeight: 896,
      evalLength: 37,
      platform: 'iPhone',
      vendor: 'Apple Computer, Inc.',
      colorDepth: 32,
      devicePixelRatio: 2,
      outerWidth: 414,
      outerHeight: 896,
      innerWidth: 414,
      innerHeight: 719,
      openDatabase: '',
      hardwareConcurrency: '',
      webglVendor: 'Apple Inc.',
      webglRenderer: 'Apple GPU',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1',
      plugins: '',
      referrer: ''
    };

    var width = fakeData.width;
    var height = fakeData.height;
    var availWidth = fakeData.availWidth;
    var availHeight = fakeData.availHeight;
    var platform = fakeData.platform;
    var vendor = fakeData.vendor;
    var colorDepth = fakeData.colorDepth;
    var devicePixelRatio = fakeData.devicePixelRatio;
    var outerWidth = fakeData.outerWidth;
    var outerHeight = fakeData.outerHeight;
    var innerWidth = fakeData.innerWidth;
    var innerHeight = fakeData.innerHeight;
    var openDatabase = fakeData.openDatabase;
    var hardwareConcurrency = fakeData.hardwareConcurrency;
    var userAgent = fakeData.userAgent;
    var plugins = fakeData.plugins;
    var referrer = fakeData.referrer;

    var fakeWindow = {
      devicePixelRatio: { get: function () { return devicePixelRatio; } },
      outerWidth: { get: function () { return outerWidth; } },
      outerHeight: { get: function () { return outerHeight; } },
      innerWidth: { get: function () { return innerWidth; } },
      innerHeight: { get: function () { return innerHeight; } },
      openDatabase: { get: function () { return openDatabase } }
    };
    var fakeNavigator = {
      userAgent: { get: function () { return userAgent; } },
      appVersion: { get: function () { return userAgent; } },
      platform: { get: function () { return platform; } },
      vendor: { get: function () { return vendor; } },
      hardwareConcurrency: { get: function () { return hardwareConcurrency } },
      plugins: { get: function () { return plugins } }
    };

    var fakeScreen = {
      width: { get: function () { return width; } },
      height: { get: function () { return height; } },
      availWidth: { get: function () { return availWidth; } },
      availHeight: { get: function () { return availHeight; } },
      colorDepth: { get: function () { return colorDepth; } },
    };

    var fakeDocument = {
      referrer: { get: function () { return referrer }}
    }

    consoleMessage('Use fake data: ' + String(JSON.stringify(fakeData)));

    if (enabled === true) {
      if (js_protection_enabled === true) {
        if (uri_match === false) {

          var injection_code = '(' + function (fakeData) {
            
            fakeData = fakeData || {
              width: 414,
              height: 896,
              availWidth: 414,
              availHeight: 896,
              evalLength: 37,
              platform: 'iPhone',
              vendor: 'Apple Computer, Inc.',
              colorDepth: 32,
              devicePixelRatio: 2,
              outerWidth: 414,
              outerHeight: 896,
              innerWidth: 414,
              innerHeight: 719,
              openDatabase: '',
              hardwareConcurrency: '',
              webglVendor: 'Apple Inc.',
              webglRenderer: 'Apple GPU',
              userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1',
              plugins: '',
              referrer: ''
            };

            var width = fakeData.width;
            var height = fakeData.height;
            var availWidth = fakeData.availWidth;
            var availHeight = fakeData.availHeight;
            var platform = fakeData.platform;
            var vendor = fakeData.vendor;
            var colorDepth = fakeData.colorDepth;
            var devicePixelRatio = fakeData.devicePixelRatio;
            var outerWidth = fakeData.outerWidth;
            var outerHeight = fakeData.outerHeight;
            var innerWidth = fakeData.innerWidth;
            var innerHeight = fakeData.innerHeight;
            var openDatabase = fakeData.openDatabase;
            var hardwareConcurrency = fakeData.hardwareConcurrency;
            var userAgent = fakeData.userAgent;
            var plugins = fakeData.plugins;
            var referrer = fakeData.referrer;

            var fakeWindow = {
              devicePixelRatio: { get: function () { return devicePixelRatio; } },
              outerWidth: { get: function () { return outerWidth; } },
              outerHeight: { get: function () { return outerHeight; } },
              innerWidth: { get: function () { return innerWidth; } },
              innerHeight: { get: function () { return innerHeight; } },
              openDatabase: { get: function () { return openDatabase } }
            };
            var fakeNavigator = {
              userAgent: { get: function () { return userAgent; } },
              appVersion: { get: function () { return userAgent; } },
              platform: { get: function () { return platform; } },
              vendor: { get: function () { return vendor; } },
              hardwareConcurrency: { get: function () { return hardwareConcurrency } },
              plugins: { get: function () { return plugins } }
            };

            var fakeScreen = {
              width: { get: function () { return width; } },
              height: { get: function () { return height; } },
              availWidth: { get: function () { return availWidth; } },
              availHeight: { get: function () { return availHeight; } },
              colorDepth: { get: function () { return colorDepth; } },
            };

            var fakeDocument = {
              referrer: { get: function () { return referrer } }
            }

            if (typeof window === 'object' && typeof window.navigator === 'object') {
              Object.defineProperties(window, fakeWindow);
              Object.defineProperties(screen, fakeScreen);
              Object.defineProperties(navigator, fakeNavigator);
              Object.defineProperties(document, fakeDocument);
            }
          } + ')(' + JSON.stringify(fakeData) +');';

          var script = document.createElement('script');
          script.textContent = injection_code;
          document.documentElement.appendChild(script);
          script.remove();

          if (typeof navigator === 'object') {
            Object.defineProperties(window, fakeWindow);
            Object.defineProperties(screen, fakeScreen);
            Object.defineProperties(navigator, fakeNavigator);
            Object.defineProperties(document, fakeDocument);
          }

          // fake GI
          var fakeGIScript = document.createElement('script');
          fakeGIScript.textContent = setGIFake({
            evalLength: fakeData.evalLength,
            webglVendor: fakeData.webglVendor,
            webglRenderer: fakeData.webglRenderer
          });
          document.documentElement.appendChild(fakeGIScript);
          fakeGIScript.remove()
        }
      } else {
        consoleMessage('User-Agent JavaScript protection disabled!');
      }
    }
  });
}
// //
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
//   console.log('我收到了你的消息！')
//   console.log(request.requestBody.formData);
//   // console.log(performance.timing)
//   // axios.post('https://trace2.rtbasia.com/mstr', Qs.stringify({ mark: 1 }))
//   //   .then(function (response) {
//   //     // console.log(response);
//   //   })
//   //   .catch(function (error) {
//   //     // console.log(error);
//   //   });
// });
