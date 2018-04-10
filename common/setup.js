// Copyright 2015 Google Inc. All Rights Reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
goog.provide('cast.games.common.sender.setup');


/**
 * A helper that sets up the cast sender SDK with console debugging information.
 * @param {string} appId The app ID to create a cast session with.
 * @param {function(!chrome.cast.Session)} sessionCallback Callback that is
 *     called when a cast sender session is ready.
 */
cast.games.common.sender.setup = function(appId, sessionCallback) {
  console.log('### Preparing session request and cast sender API config with ' +
      'app ID ' + appId);
  var sessionRequest = new chrome.cast.SessionRequest(appId);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionCallback,
      cast.games.common.sender.setup.onCastReceiverChanged_);

  console.log('### Initializing cast sender API and requesting a session.');
  chrome.cast.initialize(apiConfig, cast.games.common.sender.setup.onCastInit_,
      cast.games.common.sender.setup.onCastError_);
};


/**
 * Callback when there is a receiver change. When the receiver is available, the
 * user can click on the chromecast button, which will create a session (and
 * call the sessionCallback passed in #setup).
 * @param {!chrome.cast.ReceiverAvailability} receiverAvailability
 * @private
 */
cast.games.common.sender.setup.onCastReceiverChanged_ =
    function(receiverAvailability) {
  if (receiverAvailability == chrome.cast.ReceiverAvailability.AVAILABLE) {
    console.log('\n### Click cast button in the Google Cast extension to ' +
        'start!\n');
  } else {
    console.log('\n### Not ready. Do NOT click cast button in the Google ' +
        'Cast extension.\n');
  }
};


/**
 * Callback when the cast API is initialized.
 * @private
 */
cast.games.common.sender.setup.onCastInit_ = function() {
  console.log('### Cast sender API initialized.');
};


/**
 * Callback when there is a cast API error.
 * @param {chrome.cast.Error} error
 * @private
 */
cast.games.common.sender.setup.onCastError_ = function(error) {
  console.log('### Cast sender API error:');
  console.dir(error);
};
