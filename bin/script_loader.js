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
 * Loads scripts in order and appends timestamp GET parameter to prevent the
 * browser from caching them.
 * @param {!Array.<string>} paths The paths to the js files to load.
 */
function loadScriptsNoCache(paths) {
  if (paths.length == 0) {
    return;
  }

  // Load the first path in the array, shift it, and call loadScriptsNoCache
  // again with the shifted path array when the script loads.
  var fileRef = document.createElement('script');
  fileRef.setAttribute('type', 'text/javascript');
  var path = paths.shift();
  var separator = path[path.length - 1] == '?' ? '&' : '?';
  fileRef.setAttribute('src', path + separator + 'ts=' + Date.now());
  fileRef.onload = function() {
    loadScriptsNoCache(paths);
  };

  document.getElementsByTagName('head')[0].appendChild(fileRef);
}

loadScriptsNoCache([
'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadGamesSDK&',
  'all.js'
]);
