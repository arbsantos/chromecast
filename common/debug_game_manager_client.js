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
goog.provide('cast.games.common.sender.debugGameManagerClient');


/**
 * A helper function that adds console debugging listeners to a game manager.
 * @param {chrome.cast.games.GameManagerClient} gameManagerClient
 */
cast.games.common.sender.debugGameManagerClient =
    function(gameManagerClient) {
  console.log('### Adding game manager listeners for console debugging.');
  gameManagerClient.addEventListener(
      chrome.cast.games.GameManagerEventType.STATE_CHANGED,
      cast.games.common.sender.debugGameManagerClient.onStateChanged_);
  gameManagerClient.addEventListener(
      chrome.cast.games.GameManagerEventType.GAME_MESSAGE_RECEIVED,
      cast.games.common.sender.debugGameManagerClient.onGameMessageReceived_);
};


/**
 * Callback when the game manager state changed.
 * @param {!chrome.cast.games.GameManagerEvent} event
 * @private
 */
cast.games.common.sender.debugGameManagerClient.onStateChanged_ =
    function(event) {
  var currentState = event.currentState;
  var previousState = event.previousState;

  if (currentState.hasLobbyStateChanged(previousState)) {
    var previousLobbyState = cast.games.common.sender.debugGameManagerClient.
        getNameForValue_(chrome.cast.games.LobbyState,
        previousState.getLobbyState());
    var currentLobbyState = cast.games.common.sender.debugGameManagerClient.
        getNameForValue_(chrome.cast.games.LobbyState,
        currentState.getLobbyState());
    console.log('### Lobby state change: ' + previousLobbyState + ' -> ' +
        currentLobbyState);
  }

  if (currentState.hasGameplayStateChanged(previousState)) {
    var previousGameplayState = cast.games.common.sender.debugGameManagerClient.
        getNameForValue_(chrome.cast.games.GameplayState,
        previousState.getGameplayState());
    var currentGameplayState = cast.games.common.sender.debugGameManagerClient.
        getNameForValue_(chrome.cast.games.GameplayState,
        currentState.getGameplayState());
    console.log('### Gameplay state change: ' + previousGameplayState + ' -> ' +
        currentGameplayState);
  }

  if (currentState.hasGameDataChanged(previousState)) {
    console.log('### Game data change:');
    console.dir(previousState.getGameData());
    console.log(' -> ');
    console.dir(currentState.getGameData());
  }

  if (currentState.hasGameStatusTextChanged(previousState)) {
    console.log('### Game status text change: ' +
        previousState.getGameStatusText() + ' -> ' +
        currentState.getGameStatusText());
  }

  var changedPlayers = currentState.getListOfChangedPlayers(previousState);
  for (var i = 0; i < changedPlayers.length; i++) {
    var changedPlayerId = changedPlayers[i];
    console.log('### Player Info change');
    console.log('  previous player info:');
    cast.games.common.sender.debugGameManagerClient.printPlayerInfo_(
        previousState.getPlayer(changedPlayerId));
    console.log('  current player info:');
    cast.games.common.sender.debugGameManagerClient.printPlayerInfo_(
        currentState.getPlayer(changedPlayerId));
  }
};


/**
 * Callback when a game message is received.
 * @param {!chrome.cast.games.GameManagerEvent} event
 * @private
 */
cast.games.common.sender.debugGameManagerClient.onGameMessageReceived_ =
    function(event) {
  console.log('### Game message:');
  console.dir(event.gameMessage);
};


/**
 * Helper that prints player info.
 * @param {chrome.cast.games.PlayerInfo} playerInfo
 * @private
 */
cast.games.common.sender.debugGameManagerClient.printPlayerInfo_ =
    function(playerInfo) {
  if (!playerInfo) {
    console.log('  null player info');
    return;
  }
  var playerState = cast.games.common.sender.debugGameManagerClient.
      getNameForValue_(chrome.cast.games.PlayerState,
      playerInfo.getPlayerState());
  console.log('  playerId:' + playerInfo.getPlayerId());
  console.log('  playerState:' + playerState);
  console.log('  playerData:');
  console.dir(playerInfo.getPlayerData());
};


/**
 * Gets the name of the key that holds a value in an object.
 * @param {!Object} object The object that contains the value.
 * @param {*} value The value to test.
 * @return {string} The name of the property holding the given value.
 * @private
 */
cast.games.common.sender.debugGameManagerClient.getNameForValue_ =
    function(object, value) {
  var keys = Object.keys(object);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (object[key] == value) {
      return key;
    }
  }
  return 'Unknown value: ' + value;
};
