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


if (typeof browser == 'undefined')
{
  // document.createElement('canvas')
  chrome.runtime.sendMessage([
    {action: 'settings.getEnabled'},
    {action: 'settings.getJavascriptProtectionEnabled'},
    {action: 'useragent.get'},
    {action: 'exceptions.uriMatch', data: {uri: window.location.href}} // Make wildcard search in exceptions list
  ], function(results) {
    var enabled = results[0],
      js_protection_enabled = results[1],
      useragent = results[2],
      uri_match = results[3];
    var consoleMessage = function (message_text) {
      if (typeof message_text === 'string') {
        console.log('[Random User-Agent] '+message_text);
      }
    };
    if (enabled === true) {
      if (js_protection_enabled === true) {
        if (typeof useragent === 'string' && useragent !== '') {
          if (uri_match === false) {
            consoleMessage('Use fake User-Agent: ' + useragent);
            var injection_code = '(' + function(new_useragent) {
              var fakeWindow = {
                devicePixelRatio: { get: function () { return 2; } },
                outerWidth: { get: function () { return 414; } },
                outerHeight: { get: function () { return 896; } },
                innerWidth: { get: function () { return 414; } },
                innerHeight: { get: function () { return 719; } },
                openDatabase: { get: function () { return '' } }
              };
              var ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1'

              var fakeNavigator = {
                userAgent: { get: function () { return ua; } },
                appVersion: { get: function () { return ua; } },
                platform: { get: function () { return 'iPhone'; } },
                vendor: { get: function () { return 'Apple Computer, Inc.'; } },
                hardwareConcurrency: { get: function () { return '' } },
                plugins: { get: function () { return '' } }
              };

              var fakeScreen = {
                width: { get: function () { return 414; } },
                height: { get: function () { return 896; } },
                availWidth: { get: function () { return 414; } },
                availHeight: { get: function () { return 896; } },
                colorDepth: { get: function () { return 32; } },
              };

                  if (typeof window === 'object' && typeof window.navigator === 'object') {
                    Object.defineProperties(window, fakeWindow);
                    Object.defineProperties(screen, fakeScreen);
                    Object.defineProperties(navigator, fakeNavigator);
                  }
                } + ')("' + useragent.replace(/([\"\'])/g, '\\$1') + '");';
            var script = document.createElement('script');
            script.textContent = injection_code;
            document.documentElement.appendChild(script);
            script.remove();
            if (typeof navigator === 'object') {
              var fakeWindow = {
                devicePixelRatio: { get: function () { return 2; } },
                outerWidth: { get: function () { return 414; } },
                outerHeight: { get: function () { return 896; } },
                innerWidth: { get: function () { return 414; } },
                innerHeight: { get: function () { return 719; } },
                openDatabase: { get: function () { return '' } }
              };

              var ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1'

              var fakeNavigator = {
                userAgent: { get: function () { return ua; } },
                appVersion: { get: function () { return ua; } },
                platform: { get: function () { return 'iPhone'; } },
                vendor: { get: function () { return 'Apple Computer, Inc.'; } },
                hardwareConcurrency : { get: function () { return '' } },
                plugins: { get: function () { return '' } }
              };

              var fakeScreen = {
                width: { get: function () { return 414; } },
                height: { get: function () { return 896; } },
                availWidth: { get: function () { return 414; } },
                availHeight: { get: function () { return 896; } },
                colorDepth: { get: function () { return 32; } },
              };

              Object.defineProperties(navigator, fakeNavigator);
              Object.defineProperties(window, fakeWindow);
              Object.defineProperties(screen, fakeScreen);
            }
          }
        }
      } else {
        consoleMessage('User-Agent JavaScript protection disabled!');
      }
    }
  });
}
//
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
  // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
  console.log('我收到了你的消息！')
  console.log(request.requestBody.formData);
  // console.log(performance.timing)
  // axios.post('https://trace2.rtbasia.com/mstr', Qs.stringify({ mark: 1 }))
  //   .then(function (response) {
  //     // console.log(response);
  //   })
  //   .catch(function (error) {
  //     // console.log(error);
  //   });
});
