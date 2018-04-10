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
/**
 * @fileoverview Adds console command line commands via global variables and
 * functions.
 */
goog.provide('cast.games.common.sender.CommandDocs');



/**
 * Manages documentation available from the console command line. This is a
 * singleton. Use commandDocs global variable to use the singleton.
 * @constructor
 */
cast.games.common.sender.CommandDocs = function() {
  /** @private {!Array.<string>} Documentation for all commands. */
  this.docs_ = [
    'Available commands:',
    '---'
  ];

  cast.games.common.sender.CommandDocs.instance_ = this;
};


/** @private {cast.games.common.sender.CommandDocs} */
cast.games.common.sender.CommandDocs.instance_ = null;


/**
 * @return {!cast.games.common.sender.CommandDocs} Returns singleton instance.
 */
cast.games.common.sender.CommandDocs.getInstance = function() {
  var instance = cast.games.common.sender.CommandDocs.instance_;
  if (instance) {
    return instance;
  }

  return new cast.games.common.sender.CommandDocs();
};


/**
 * Prints documentation for all commands to the console.
 */
cast.games.common.sender.CommandDocs.prototype.help = function() {
  console.log(this.docs_.join('\n'));
  console.log('---');
  console.log('You can also use the gameManagerClient global variable.');
  console.log('For example, try this:');
  console.log('  state = gameManagerClient.getCurrentState()');
  console.log('  state.getApplicationName()');
  console.log('---');
};


/**
 * Adds documentation for a command.
 * @param {string} documentation
 */
cast.games.common.sender.CommandDocs.prototype.add = function(documentation) {
  this.docs_.push(documentation);
};


/**
 * Defines a global reference for sender applications to add their own commands.
 */
var commandDocs = cast.games.common.sender.CommandDocs.getInstance();


/**
 * Prints all commands.
 * @export
 */
var help = function() {
  cast.games.common.sender.CommandDocs.getInstance().help();
};
commandDocs.add('help() - print available commands');


/**
 * Sends a player available request. Assumes gameManagerClient global reference
 * is defined.
 * @param {string=} opt_playerId Optional player ID.
 * @param {Object=} opt_extraMessageData Optional extra message data.
 * @export
 */
var sendPlayerAvailable = function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error('No gameManagerClient defined.');
  }

  var successCallback = function(result) {
    console.log('### sendPlayerAvailable succeeded. Result:');
    console.dir(result);
  };
  var errorCallback = function(error) {
    console.log('### sendPlayerAvailable failed. Error:');
    console.dir(error);
  };

  if (opt_playerId) {
    gameManagerClient.sendPlayerAvailableRequestWithPlayerId(opt_playerId,
        opt_extraMessageData ? opt_extraMessageData : null,
        successCallback, errorCallback);
  } else {
    gameManagerClient.sendPlayerAvailableRequest(
        opt_extraMessageData ? opt_extraMessageData : null,
        successCallback, errorCallback);
  }
};
commandDocs.add('sendPlayerAvailable(opt_playerId, opt_extraMessageData) - ' +
    'send player available request');


/**
 * Sends a player ready request. Assumes gameManagerClient global reference
 * is defined.
 * @param {string=} opt_playerId Optional player ID.
 * @param {Object=} opt_extraMessageData Optional extra message data.
 * @export
 */
var sendPlayerReady = function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error('No gameManagerClient defined.');
  }

  var successCallback = function(result) {
    console.log('### sendPlayerReady succeeded. Result:');
    console.dir(result);
  };
  var errorCallback = function(error) {
    console.log('### sendPlayerReady failed. Error:');
    console.dir(error);
  };

  if (opt_playerId) {
    gameManagerClient.sendPlayerReadyRequestWithPlayerId(opt_playerId,
        opt_extraMessageData ? opt_extraMessageData : null,
        successCallback, errorCallback);
  } else {
    gameManagerClient.sendPlayerReadyRequest(
        opt_extraMessageData ? opt_extraMessageData : null,
        successCallback, errorCallback);
  }
};
commandDocs.add('sendPlayerReady(opt_playerId, opt_extraMessageData) - ' +
    'send player ready request');


/**
 * Sends a player playing request. Assumes gameManagerClient global reference
 * is defined.
 * @param {string=} opt_playerId Optional player ID.
 * @param {Object=} opt_extraMessageData Optional extra message data.
 * @export
 */
var sendPlayerPlaying = function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error('No gameManagerClient defined.');
  }

  var successCallback = function(result) {
    console.log('### sendPlayerPlaying succeeded. Result:');
    console.dir(result);
  };
  var errorCallback = function(error) {
    console.log('### sendPlayerPlaying failed. Error:');
    console.dir(error);
  };

  if (opt_playerId) {
    gameManagerClient.sendPlayerPlayingRequestWithPlayerId(opt_playerId,
        opt_extraMessageData ? opt_extraMessageData : null,
        successCallback, errorCallback);
  } else {
    gameManagerClient.sendPlayerPlayingRequest(
        opt_extraMessageData ? opt_extraMessageData : null,
        successCallback, errorCallback);
  }
};
commandDocs.add('sendPlayerPlaying(opt_playerId, opt_extraMessageData) - ' +
    'send player ready request');


/**
 * Sends a player idle request. Assumes gameManagerClient global reference
 * is defined.
 * @param {string=} opt_playerId Optional player ID.
 * @param {Object=} opt_extraMessageData Optional extra message data.
 * @export
 */
var sendPlayerIdle = function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error('No gameManagerClient defined.');
  }

  var successCallback = function(result) {
    console.log('### sendPlayerIdle succeeded. Result:');
    console.dir(result);
  };
  var errorCallback = function(error) {
    console.log('### sendPlayerIdle failed. Error:');
    console.dir(error);
  };

  if (opt_playerId) {
    gameManagerClient.sendPlayerIdleRequestWithPlayerId(opt_playerId,
        opt_extraMessageData ? opt_extraMessageData : null,
        successCallback, errorCallback);
  } else {
    gameManagerClient.sendPlayerIdleRequest(
        opt_extraMessageData ? opt_extraMessageData : null,
        successCallback, errorCallback);
  }
};
commandDocs.add('sendPlayerIdle(opt_playerId, opt_extraMessageData) - ' +
    'send player ready request');


/**
 * Sends a player quit request. Assumes gameManagerClient global reference
 * is defined.
 * @param {string=} opt_playerId Optional player ID.
 * @param {Object=} opt_extraMessageData Optional extra message data.
 * @export
 */
var sendPlayerQuit = function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error('No gameManagerClient defined.');
  }

  var successCallback = function(result) {
    console.log('### sendPlayerQuit succeeded. Result:');
    console.dir(result);
  };
  var errorCallback = function(error) {
    console.log('### sendPlayerQuit failed. Error:');
    console.dir(error);
  };

  if (opt_playerId) {
    gameManagerClient.sendPlayerQuitRequestWithPlayerId(opt_playerId,
        opt_extraMessageData ? opt_extraMessageData : null,
        successCallback, errorCallback);
  } else {
    gameManagerClient.sendPlayerQuitRequest(
        opt_extraMessageData ? opt_extraMessageData : null,
        successCallback, errorCallback);
  }
};
commandDocs.add('sendPlayerQuit(playerId, opt_extraMessageData) - ' +
    'send player quit request');


/**
 * Sends a game message request. Assumes gameManagerClient global reference is
 * defined.
 * @param {string=} opt_playerId Optional player ID.
 * @param {Object=} opt_extraMessageData Optional extra message data.
 * @export
 */
var sendGameRequest = function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error('No gameManagerClient defined.');
  }

  var successCallback = function(result) {
    console.log('### sendGameRequest succeeded. Result:');
    console.dir(result);
  };
  var errorCallback = function(error) {
    console.log('### sendGameRequest failed. Error:');
    console.dir(error);
  };

  if (opt_playerId) {
    gameManagerClient.sendGameRequestWithPlayerId(opt_playerId,
        opt_extraMessageData ? opt_extraMessageData : null,
        successCallback, errorCallback);
  } else {
    gameManagerClient.sendGameRequest(
        opt_extraMessageData ? opt_extraMessageData : null,
        successCallback, errorCallback);
  }
};
commandDocs.add('sendGameRequest(playerId, opt_extraMessageData) - send game ' +
    'message request');


/**
 * Sends a game message (no response) request.
 * Assumes gameManagerClient global reference is defined.
 * @param {string=} opt_playerId Optional player ID.
 * @param {Object=} opt_extraMessageData Optional extra message data.
 * @export
 */
var sendGameMessage = function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error('No gameManagerClient defined.');
  }
  if (opt_playerId) {
    gameManagerClient.sendGameMessageWithPlayerId(opt_playerId,
        opt_extraMessageData ? opt_extraMessageData : null);
  } else {
    gameManagerClient.sendGameMessage(
        opt_extraMessageData ? opt_extraMessageData : null);
  }
};
commandDocs.add('sendGameMessage(playerId, opt_extraMessageData) - ' +
    'send game message (no response) request');
