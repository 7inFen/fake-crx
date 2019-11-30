/* global chrome, API */

/**
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

"use strict";

/**
 * Hook for header replacement
 */
function sendMessageToContentScript(message, callback)
{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
  {
    setTimeout(() => {
      chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
        if (callback) callback(response);
      });
    }, 5000);
  });
}
// chrome.webRequest.onBeforeRequest.addListener(function (details){
//   if (details.url === 'https://trace2.rtbasia.com/mstr' && !details.requestBody.formData.mark) {
//     // details.requestBody.formData.url[0] = "https://www.baidu.com"
//     sendMessageToContentScript(details, res => {
//       console.log(res)
//     })
//     return {
//       cancel: true
//     }
//     // return {requestBody: details.requestBody};
//   }
// }, {urls: ["<all_urls>"]}, ["blocking", "requestBody"])

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {

  //                 !!! IMPORTANT !!!
  // --------------------------------------------------
  // chrome.runtime.sendMessage API does not works here
  // --------------------------------------------------
  //                 !!! IMPORTANT !!!
  // sendMessageToContentScript(details, function(response)
  // {
  //   console.log('来自content的回复：'+response);
  // });
  if (API.settings.getEnabled() === true) {
    var fakeData = API.settings.getFakeData() || {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1'
    };
    var userAgent = fakeData.userAgent
    if (typeof userAgent === 'string') {
      // Make wildcard search in exceptions list
      //console.log('Catch URI "' + details.url + '"');
      if (API.exceptions.uriMatch({uri: details.url})) {
        console.info('Ignore URI "' + details.url + '"');
        return;
      }
      // Find User-Agent header, and modify it
      for (var i = 0, len = details.requestHeaders.length; i < len; ++i) {
        if (details.requestHeaders[i].name === 'User-Agent') {
          details.requestHeaders[i].value = userAgent;
          break;
        }
      }
      return {requestHeaders: details.requestHeaders};
    }
  }
}, {urls: ["<all_urls>"]}, ["blocking", "requestHeaders"]);
