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
'use strict';

/** @suppress {extraRequire} Needed to set up global command docs. */
goog.require('cast.games.common.sender.CommandDocs');
goog.require('cast.games.common.sender.debugGameManagerClient');
goog.require('cast.games.common.sender.setup');


/** @define {string} Application ID used when running the sender. */
var APP_ID = '54E247D6';

// Global reference to game session manager for console debugging.
var gameManagerClient = null;

// Used to send repeated messages.
var timeoutObject;

// Starcast message factory variables.
var lastMessageWasFire = true;

// Player Ids suffixes for the different control schemes.
var HUMAN_PLAYER_ID_SUFFIXES = {
  WSD: 'WSD',
  IKL: 'IKL',
  ARROW: 'ARROW',
  NUMPAD: 'NUMPAD'
};

// A map from keycodes to player identifiers and actions.
var keyCodeActionMap = {
  // WSD keys.
  87 : {keySet: HUMAN_PLAYER_ID_SUFFIXES.WSD, fire: false, move: -0.1},
  83 : {keySet: HUMAN_PLAYER_ID_SUFFIXES.WSD, fire: false, move: 0.1},
  68 : {keySet: HUMAN_PLAYER_ID_SUFFIXES.WSD, fire: true, move: 0},
  // IKL keys.
  73 : {keySet: HUMAN_PLAYER_ID_SUFFIXES.IKL, fire: false, move: -0.1},
  75 : {keySet: HUMAN_PLAYER_ID_SUFFIXES.IKL, fire: false, move: 0.1},
  76 : {keySet: HUMAN_PLAYER_ID_SUFFIXES.IKL, fire: true, move: 0},
  // Arrow keys.
  38 : {keySet: HUMAN_PLAYER_ID_SUFFIXES.ARROW, fire: false, move: -0.1},
  40 : {keySet: HUMAN_PLAYER_ID_SUFFIXES.ARROW, fire: false, move: 0.1},
  39 : {keySet: HUMAN_PLAYER_ID_SUFFIXES.ARROW, fire: true, move: 0},
  // Number pad keys.
  104 : {keySet: HUMAN_PLAYER_ID_SUFFIXES.NUMPAD, fire: false, move: -0.1},
  101 : {keySet: HUMAN_PLAYER_ID_SUFFIXES.NUMPAD, fire: false, move: 0.1},
  102 : {keySet: HUMAN_PLAYER_ID_SUFFIXES.NUMPAD, fire: true, move: 0},
};

// Necessary to be able to have multiple chrome senders.
var playerIdPrefix = 'ChromeSender' + Math.random() + ':';

// A map from playerIds to current player positions.
var playerPositions = {};

// JSON message field used to fire
var FIRE_FIELD = 'fire';

// JSON message field used to move
var MOVE_FIELD = 'move';


/**
 * Request a cast session when Cast Sender API loads.
 * @param {boolean} loaded
 * @param {Object} errorInfo
 */
window['__onGCastApiAvailable'] = function(loaded, errorInfo) {
  if (!loaded) {
    console.error('### Cast Sender SDK failed to load:');
    console.dir(errorInfo);
    return;
  }

  cast.games.common.sender.setup(APP_ID, onSessionReady_);
};


/**
 * Updates the internal map that keeps track of player's positions with the
 * given delta. Also makes sure positions are alway in the range [0,1];
 * @param {string} playerId The playerId of the player to be updated.
 * @param {number} delta The delta with respect to the previous position.
 * @return {number} The new position.
 * @private
 */
var updatePlayerPosition_ = function(playerId, delta) {
  if (playerPositions[playerId] == undefined) {
    playerPositions[playerId] = 0.5;
  }
  var position = playerPositions[playerId] + delta;
  position = position > 1 ? 1 : position;
  position = position < 0 ? 0 : position;
  playerPositions[playerId] = position;
  return position;
};


/**
 * Callback when a cast session is ready. Connects the game manager.
 * @param {!chrome.cast.Session} session
 * @private
 */
var onSessionReady_ = function(session) {
  console.log('### Creating game manager client.');
  chrome.cast.games.GameManagerClient.getInstanceFor(session,
      function(result) {
        console.log('### Game manager client initialized!');
        gameManagerClient = result.gameManagerClient;
        cast.games.common.sender.debugGameManagerClient(gameManagerClient);
        // Register an event listener for when a key is pressed.
        window.addEventListener('keydown', onKeyDown_, true);
        help();
      },
      function(error) {
        console.error('### Error initializing the game manager client: ' +
            error.errorDescription + ' ' +
            'Error code: ' + error.errorCode);
      });
};


/**
 * Callback for keyPress events.
 * @param {!Event} event
 * @private
 */
var onKeyDown_ = function(event) {
  console.log('### Key detected: ' + event.keyCode);
  var keyCodeAction = keyCodeActionMap[event.keyCode];
  var playerId = playerIdPrefix + keyCodeAction.keySet;
  var message = {};
  message[FIRE_FIELD] = keyCodeAction.fire;
  message[MOVE_FIELD] = updatePlayerPosition_(playerId, keyCodeAction.move);

  // Send the message.
  if (playerId && message) {
    var player = gameManagerClient.getCurrentState().getPlayer(playerId);
    if (!player) {
      gameManagerClient.sendPlayerAvailableRequestWithPlayerId(playerId,
          /* extraMessageData */ null,
          /* successCallback */ null, /* errorCallback */ null);
    } else {
      gameManagerClient.sendGameMessageWithPlayerId(playerId, message);
    }
  }
};


/**
 * Sends periodic messages to the receiver. Each message is constructured using
 * the #messageFactory paramter.
 * @param {string} playerId The player ID used to send messages.
 * @param {!Function} messageFactory A function that constructs a new message
 *     and returns a string representing it. It should already contain the
 *     header.
 * @param {number} frequency How often to send the messages (in milliseconds).
 * @export
 */
var startPeriodicMessages = function(playerId, messageFactory, frequency) {
  stopPeriodicMessages();

  if (!playerId) {
    var players = gameManagerClient.getCurrentState().getPlayers();
    if (players.length > 0) {
      playerId = players[0].playerId;
    }
  }

  if (!playerId) {
    console.log('### Can\'t start sending periodic messages. No players!');
    return;
  }

  var closure = function() {
    var message = messageFactory(playerId);
    gameManagerClient.sendGameMessageWithPlayerId(playerId, message);
    timeoutObject = setTimeout(closure, frequency);
  };
  closure();
};
commandDocs.add('startPeriodicMessages(playerId, messageFactory, frequency)' +
    ' - send preriodic messages constructed by messageFactory');


/**
 * Stops a previously started periodic message.
 * @export
 */
var stopPeriodicMessages = function() {
  if (timeoutObject) {
    clearTimeout(timeoutObject);
  }
};
commandDocs.add('stopPeriodicMessages() - stop sending periodic messages.');


/**
 * Creates a random starcast game message. Can also be used with
 * #startPeriodicMessages
 * @param {string} playerId The playerId.
 * @return {!Object} The message JSON object.
 * @export
 */
var randomMessageFactory = function(playerId) {
  var message = {};
  message[FIRE_FIELD] = false;

  if (Math.random() > 0.5) {
    message[FIRE_FIELD] = true;
  }
  message[MOVE_FIELD] = Math.random();
  return message;
};
commandDocs.add('randomMessageFactory - random message factory for ' +
    'starcast');


/**
 * Message factory for starcast messages, ready to be used with
 * #startPeriodicMessages. This will send one move message followed by a fire
 * message.
 * @param {string} playerId The playerId.
 * @return {!Object} The message JSON object.
 * @export
 */
var alignedMessageFactory = function(playerId) {
  var message = {};
  message[FIRE_FIELD] = false;

  if (lastMessageWasFire) {
    message[MOVE_FIELD] = updatePlayerPosition_(playerId, 0.1);
    if (message[MOVE_FIELD] >= 1) {
      playerPositions[playerId] = -0.1;
    }
  } else {
    message[FIRE_FIELD] = true;
  }

  lastMessageWasFire = !lastMessageWasFire;
  return message;
};
commandDocs.add('alignedMessageFactory - message factory ' +
    'for starcast that sends a move message followed by a fire message');
