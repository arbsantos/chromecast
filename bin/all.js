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
var goog = goog || {};
goog.global = this;
goog.isDef = function(val) {
  return void 0 !== val;
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split("."), cur = opt_objectToExportTo || goog.global;
  parts[0] in cur || !cur.execScript || cur.execScript("var " + parts[0]);
  for (var part;parts.length && (part = parts.shift());) {
    !parts.length && goog.isDef(opt_object) ? cur[part] = opt_object : cur = cur[part] ? cur[part] : cur[part] = {};
  }
};
goog.define = function(name, defaultValue) {
  goog.exportPath_(name, defaultValue);
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.DISALLOW_TEST_ONLY_CODE = !goog.DEBUG;
goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
goog.provide = function(name) {
  goog.constructNamespace_(name);
};
goog.constructNamespace_ = function(name, opt_obj) {
  goog.exportPath_(name, opt_obj);
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(name) {
  if (!goog.isString(name) || !name || -1 == name.search(goog.VALID_MODULE_RE_)) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + name + " has been loaded incorrectly.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = name;
};
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};
goog.module.getInternal_ = function() {
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return null != goog.moduleLoaderState_;
};
goog.module.declareTestMethods = function() {
  if (!goog.isInModuleLoader_()) {
    throw Error("goog.module.declareTestMethods must be called from within a goog.module");
  }
  goog.moduleLoaderState_.declareTestMethods = !0;
};
goog.module.declareLegacyNamespace = function() {
  goog.moduleLoaderState_.declareLegacyNamespace = !0;
};
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    throw opt_message = opt_message || "", Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function() {
};
goog.getObjectByName = function(name, opt_obj) {
  for (var parts = name.split("."), cur = opt_obj || goog.global, part;part = parts.shift();) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global, x;
  for (x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function(relPath, provides, requires, opt_isModule) {
  if (goog.DEPENDENCIES_ENABLED) {
    for (var provide, require, path = relPath.replace(/\\/g, "/"), deps = goog.dependencies_, i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path, deps.pathIsModule[path] = !!opt_isModule;
    }
    for (var j = 0;require = requires[j];j++) {
      path in deps.requires || (deps.requires[path] = {}), deps.requires[path][require] = !0;
    }
  }
};
goog.useStrictRequires = !1;
goog.ENABLE_DEBUG_LOADER = !0;
goog.logToConsole_ = function(msg) {
  goog.global.console && goog.global.console.error(msg);
};
goog.require = function() {
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor);
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.LOAD_MODULE_USING_EVAL = !0;
goog.SEAL_MODULE_EXPORTS = goog.DEBUG;
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !1;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathIsModule:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}}, goog.inHtmlDocument_ = function() {
  var doc = goog.global.document;
  return "undefined" != typeof doc && "write" in doc;
}, goog.findBasePath_ = function() {
  if (goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH;
  } else {
    if (goog.inHtmlDocument_()) {
      for (var scripts = goog.global.document.getElementsByTagName("SCRIPT"), i = scripts.length - 1;0 <= i;--i) {
        var src = scripts[i].src, qmark = src.lastIndexOf("?"), l = -1 == qmark ? src.length : qmark;
        if ("base.js" == src.substr(l - 7, 7)) {
          goog.basePath = src.substr(0, l - 7);
          break;
        }
      }
    }
  }
}, goog.importScript_ = function(src, opt_sourceText) {
  (goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_)(src, opt_sourceText) && (goog.dependencies_.written[src] = !0);
}, goog.IS_OLD_IE_ = !goog.global.atob && goog.global.document && goog.global.document.all, goog.importModule_ = function(src) {
  goog.importScript_("", 'goog.retrieveAndExecModule_("' + src + '");') && (goog.dependencies_.written[src] = !0);
}, goog.queuedModules_ = [], goog.wrapModule_ = function(srcUrl, scriptText) {
  return goog.LOAD_MODULE_USING_EVAL && goog.isDef(goog.global.JSON) ? "goog.loadModule(" + goog.global.JSON.stringify(scriptText + "\n//# sourceURL=" + srcUrl + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + scriptText + "\n;return exports});\n//# sourceURL=" + srcUrl + "\n";
}, goog.loadQueuedModules_ = function() {
  var count = goog.queuedModules_.length;
  if (0 < count) {
    var queue = goog.queuedModules_;
    goog.queuedModules_ = [];
    for (var i = 0;i < count;i++) {
      goog.maybeProcessDeferredPath_(queue[i]);
    }
  }
}, goog.maybeProcessDeferredDep_ = function(name) {
  goog.isDeferredModule_(name) && goog.allDepsAreAvailable_(name) && goog.maybeProcessDeferredPath_(goog.basePath + goog.getPathFromDeps_(name));
}, goog.isDeferredModule_ = function(name) {
  var path = goog.getPathFromDeps_(name);
  return path && goog.dependencies_.pathIsModule[path] ? goog.basePath + path in goog.dependencies_.deferred : !1;
}, goog.allDepsAreAvailable_ = function(name) {
  var path = goog.getPathFromDeps_(name);
  if (path && path in goog.dependencies_.requires) {
    for (var requireName in goog.dependencies_.requires[path]) {
      if (!goog.isProvided_(requireName) && !goog.isDeferredModule_(requireName)) {
        return !1;
      }
    }
  }
  return !0;
}, goog.maybeProcessDeferredPath_ = function(abspath) {
  if (abspath in goog.dependencies_.deferred) {
    var src = goog.dependencies_.deferred[abspath];
    delete goog.dependencies_.deferred[abspath];
    goog.globalEval(src);
  }
}, goog.loadModule = function(moduleDef) {
  var previousState = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {moduleName:void 0, declareTestMethods:!1};
    var exports;
    if (goog.isFunction(moduleDef)) {
      exports = moduleDef.call(goog.global, {});
    } else {
      if (goog.isString(moduleDef)) {
        exports = goog.loadModuleFromSource_.call(goog.global, moduleDef);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var moduleName = goog.moduleLoaderState_.moduleName;
    if (!goog.isString(moduleName) || !moduleName) {
      throw Error('Invalid module name "' + moduleName + '"');
    }
    goog.moduleLoaderState_.declareLegacyNamespace ? goog.constructNamespace_(moduleName, exports) : goog.SEAL_MODULE_EXPORTS && Object.seal && Object.seal(exports);
    goog.loadedModules_[moduleName] = exports;
    if (goog.moduleLoaderState_.declareTestMethods) {
      for (var entry in exports) {
        if (0 === entry.indexOf("test", 0) || "tearDown" == entry || "setUp" == entry || "setUpPage" == entry || "tearDownPage" == entry) {
          goog.global[entry] = exports[entry];
        }
      }
    }
  } finally {
    goog.moduleLoaderState_ = previousState;
  }
}, goog.loadModuleFromSource_ = function(source) {
  eval(source);
  return {};
}, goog.writeScriptSrcNode_ = function(src) {
  goog.global.document.write('<script type="text/javascript" src="' + src + '">\x3c/script>');
}, goog.appendScriptSrcNode_ = function(src) {
  var doc = goog.global.document, scriptEl = doc.createElement("script");
  scriptEl.type = "text/javascript";
  scriptEl.src = src;
  scriptEl.defer = !1;
  scriptEl.async = !1;
  doc.head.appendChild(scriptEl);
}, goog.writeScriptTag_ = function(src, opt_sourceText) {
  if (goog.inHtmlDocument_()) {
    var doc = goog.global.document;
    if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && "complete" == doc.readyState) {
      if (/\bdeps.js$/.test(src)) {
        return !1;
      }
      throw Error('Cannot write "' + src + '" after document load');
    }
    var isOldIE = goog.IS_OLD_IE_;
    if (void 0 === opt_sourceText) {
      if (isOldIE) {
        var state = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ";
        doc.write('<script type="text/javascript" src="' + src + '"' + state + ">\x3c/script>");
      } else {
        goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING ? goog.appendScriptSrcNode_(src) : goog.writeScriptSrcNode_(src);
      }
    } else {
      doc.write('<script type="text/javascript">' + opt_sourceText + "\x3c/script>");
    }
    return !0;
  }
  return !1;
}, goog.lastNonModuleScriptIndex_ = 0, goog.onScriptLoad_ = function(script, scriptIndex) {
  "complete" == script.readyState && goog.lastNonModuleScriptIndex_ == scriptIndex && goog.loadQueuedModules_();
  return !0;
}, goog.writeScripts_ = function() {
  function visitNode(path) {
    if (!(path in deps.written)) {
      if (!(path in deps.visited) && (deps.visited[path] = !0, path in deps.requires)) {
        for (var requireName in deps.requires[path]) {
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      path in seenScript || (seenScript[path] = !0, scripts.push(path));
    }
  }
  var scripts = [], seenScript = {}, deps = goog.dependencies_, path$$0;
  for (path$$0 in goog.included_) {
    deps.written[path$$0] || visitNode(path$$0);
  }
  for (var i = 0;i < scripts.length;i++) {
    path$$0 = scripts[i], goog.dependencies_.written[path$$0] = !0;
  }
  var moduleState = goog.moduleLoaderState_;
  goog.moduleLoaderState_ = null;
  for (i = 0;i < scripts.length;i++) {
    if (path$$0 = scripts[i]) {
      deps.pathIsModule[path$$0] ? goog.importModule_(goog.basePath + path$$0) : goog.importScript_(goog.basePath + path$$0);
    } else {
      throw goog.moduleLoaderState_ = moduleState, Error("Undefined script input");
    }
  }
  goog.moduleLoaderState_ = moduleState;
}, goog.getPathFromDeps_ = function(rule) {
  return rule in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[rule] : null;
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.normalizePath_ = function(path) {
  for (var components = path.split("/"), i = 0;i < components.length;) {
    "." == components[i] ? components.splice(i, 1) : i && ".." == components[i] && components[i - 1] && ".." != components[i - 1] ? components.splice(--i, 2) : i++;
  }
  return components.join("/");
};
goog.loadFileSync_ = function(src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src);
  }
  var xhr = new goog.global.XMLHttpRequest;
  xhr.open("get", src, !1);
  xhr.send();
  return xhr.responseText;
};
goog.retrieveAndExecModule_ = function() {
};
goog.typeOf = function(value) {
  var s = typeof value;
  if ("object" == s) {
    if (value) {
      if (value instanceof Array) {
        return "array";
      }
      if (value instanceof Object) {
        return s;
      }
      var className = Object.prototype.toString.call(value);
      if ("[object Window]" == className) {
        return "object";
      }
      if ("[object Array]" == className || "number" == typeof value.length && "undefined" != typeof value.splice && "undefined" != typeof value.propertyIsEnumerable && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == className || "undefined" != typeof value.call && "undefined" != typeof value.propertyIsEnumerable && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == s && "undefined" == typeof value.call) {
      return "object";
    }
  }
  return s;
};
goog.isNull = function(val) {
  return null === val;
};
goog.isDefAndNotNull = function(val) {
  return null != val;
};
goog.isArray = function(val) {
  return "array" == goog.typeOf(val);
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return "array" == type || "object" == type && "number" == typeof val.length;
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && "function" == typeof val.getFullYear;
};
goog.isString = function(val) {
  return "string" == typeof val;
};
goog.isBoolean = function(val) {
  return "boolean" == typeof val;
};
goog.isNumber = function(val) {
  return "number" == typeof val;
};
goog.isFunction = function(val) {
  return "function" == goog.typeOf(val);
};
goog.isObject = function(val) {
  var type = typeof val;
  return "object" == type && null != val || "function" == type;
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return !!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  "removeAttribute" in obj && obj.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if ("object" == type || "array" == type) {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = "array" == type ? [] : {}, key;
    for (key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments);
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw Error();
  }
  if (2 < arguments.length) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  }
  return function() {
    return fn.apply(selfObj, arguments);
  };
};
goog.bind = function(fn, selfObj, var_args) {
  goog.bind = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (null == goog.evalWorksForGlobals_) {
        if (goog.global.eval("var _evalTest_ = 1;"), "undefined" != typeof goog.global._evalTest_) {
          try {
            delete goog.global._evalTest_;
          } catch (ignore) {
          }
          goog.evalWorksForGlobals_ = !0;
        } else {
          goog.evalWorksForGlobals_ = !1;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document, scriptElt = doc.createElement("SCRIPT");
        scriptElt.type = "text/javascript";
        scriptElt.defer = !1;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  }, renameByParts = function(cssName) {
    for (var parts = cssName.split("-"), mapped = [], i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  }, rename;
  rename = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? getMapping : renameByParts : function(a) {
    return a;
  };
  return opt_modifier ? className + "-" + rename(opt_modifier) : rename(className);
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.getMsg = function(str, opt_values) {
  opt_values && (str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
    return key in opt_values ? opt_values[key] : match;
  }));
  return str;
};
goog.getMsgWithFallback = function(a) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    for (var args = Array(arguments.length - 2), i = 2;i < arguments.length;i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (caller.superClass_) {
    for (var ctorArgs = Array(arguments.length - 1), i = 1;i < arguments.length;i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    return caller.superClass_.constructor.apply(me, ctorArgs);
  }
  for (var args = Array(arguments.length - 2), i = 2;i < arguments.length;i++) {
    args[i - 2] = arguments[i];
  }
  for (var foundCaller = !1, ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = !0;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(fn) {
  fn.call(goog.global);
};
goog.MODIFY_FUNCTION_PROTOTYPES = !0;
goog.MODIFY_FUNCTION_PROTOTYPES && (Function.prototype.bind = Function.prototype.bind || function(selfObj, var_args) {
  if (1 < arguments.length) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(this, selfObj);
    return goog.bind.apply(null, args);
  }
  return goog.bind(this, selfObj);
}, Function.prototype.partial = function(var_args) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this, null);
  return goog.bind.apply(null, args);
}, Function.prototype.inherits = function(parentCtor) {
  goog.inherits(this, parentCtor);
});
goog.defineClass = function(superClass, def) {
  var constructor = def.constructor, statics = def.statics;
  constructor && constructor != Object.prototype.constructor || (constructor = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  superClass && goog.inherits(cls, superClass);
  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);
  null != statics && (statics instanceof Function ? statics(cls) : goog.defineClass.applyProperties_(cls, statics));
  return cls;
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
    if (superClass && superClass.prototype && superClass.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) {
      return ctr;
    }
    var wrappedCtr = function() {
      var instance = ctr.apply(this, arguments) || this;
      instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];
      this.constructor === wrappedCtr && Object.seal(instance);
      return instance;
    };
    return wrappedCtr;
  }
  return ctr;
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(target, source) {
  for (var key in source) {
    Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
  }
  for (var i = 0;i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i], Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
  }
};
goog.tagUnsealableClass = function() {
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
var cast = {games:{}};
cast.games.common = {};
cast.games.common.sender = {};
cast.games.common.sender.CommandDocs = function() {
  this.docs_ = ["Available commands:", "---"];
  cast.games.common.sender.CommandDocs.instance_ = this;
};
cast.games.common.sender.CommandDocs.instance_ = null;
cast.games.common.sender.CommandDocs.getInstance = function() {
  var instance = cast.games.common.sender.CommandDocs.instance_;
  return instance ? instance : new cast.games.common.sender.CommandDocs;
};
cast.games.common.sender.CommandDocs.prototype.help = function() {
  console.log(this.docs_.join("\n"));
  console.log("---");
  console.log("You can also use the gameManagerClient global variable.");
  console.log("For example, try this:");
  console.log("  state = gameManagerClient.getCurrentState()");
  console.log("  state.getApplicationName()");
  console.log("---");
};
cast.games.common.sender.CommandDocs.prototype.add = function(documentation) {
  this.docs_.push(documentation);
};
var commandDocs = cast.games.common.sender.CommandDocs.getInstance(), help = function() {
  cast.games.common.sender.CommandDocs.getInstance().help();
};
goog.exportSymbol("help", help);
commandDocs.add("help() - print available commands");
goog.exportSymbol("sendPlayerAvailable", function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error("No gameManagerClient defined.");
  }
  var successCallback = function(result) {
    console.log("### sendPlayerAvailable succeeded. Result:");
    console.dir(result);
  }, errorCallback = function(error) {
    console.log("### sendPlayerAvailable failed. Error:");
    console.dir(error);
  };
  opt_playerId ? gameManagerClient.sendPlayerAvailableRequestWithPlayerId(opt_playerId, opt_extraMessageData ? opt_extraMessageData : null, successCallback, errorCallback) : gameManagerClient.sendPlayerAvailableRequest(opt_extraMessageData ? opt_extraMessageData : null, successCallback, errorCallback);
});
commandDocs.add("sendPlayerAvailable(opt_playerId, opt_extraMessageData) - send player available request");
goog.exportSymbol("sendPlayerReady", function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error("No gameManagerClient defined.");
  }
  var successCallback = function(result) {
    console.log("### sendPlayerReady succeeded. Result:");
    console.dir(result);
  }, errorCallback = function(error) {
    console.log("### sendPlayerReady failed. Error:");
    console.dir(error);
  };
  opt_playerId ? gameManagerClient.sendPlayerReadyRequestWithPlayerId(opt_playerId, opt_extraMessageData ? opt_extraMessageData : null, successCallback, errorCallback) : gameManagerClient.sendPlayerReadyRequest(opt_extraMessageData ? opt_extraMessageData : null, successCallback, errorCallback);
});
commandDocs.add("sendPlayerReady(opt_playerId, opt_extraMessageData) - send player ready request");
goog.exportSymbol("sendPlayerPlaying", function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error("No gameManagerClient defined.");
  }
  var successCallback = function(result) {
    console.log("### sendPlayerPlaying succeeded. Result:");
    console.dir(result);
  }, errorCallback = function(error) {
    console.log("### sendPlayerPlaying failed. Error:");
    console.dir(error);
  };
  opt_playerId ? gameManagerClient.sendPlayerPlayingRequestWithPlayerId(opt_playerId, opt_extraMessageData ? opt_extraMessageData : null, successCallback, errorCallback) : gameManagerClient.sendPlayerPlayingRequest(opt_extraMessageData ? opt_extraMessageData : null, successCallback, errorCallback);
});
commandDocs.add("sendPlayerPlaying(opt_playerId, opt_extraMessageData) - send player ready request");
goog.exportSymbol("sendPlayerIdle", function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error("No gameManagerClient defined.");
  }
  var successCallback = function(result) {
    console.log("### sendPlayerIdle succeeded. Result:");
    console.dir(result);
  }, errorCallback = function(error) {
    console.log("### sendPlayerIdle failed. Error:");
    console.dir(error);
  };
  opt_playerId ? gameManagerClient.sendPlayerIdleRequestWithPlayerId(opt_playerId, opt_extraMessageData ? opt_extraMessageData : null, successCallback, errorCallback) : gameManagerClient.sendPlayerIdleRequest(opt_extraMessageData ? opt_extraMessageData : null, successCallback, errorCallback);
});
commandDocs.add("sendPlayerIdle(opt_playerId, opt_extraMessageData) - send player ready request");
goog.exportSymbol("sendPlayerQuit", function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error("No gameManagerClient defined.");
  }
  var successCallback = function(result) {
    console.log("### sendPlayerQuit succeeded. Result:");
    console.dir(result);
  }, errorCallback = function(error) {
    console.log("### sendPlayerQuit failed. Error:");
    console.dir(error);
  };
  opt_playerId ? gameManagerClient.sendPlayerQuitRequestWithPlayerId(opt_playerId, opt_extraMessageData ? opt_extraMessageData : null, successCallback, errorCallback) : gameManagerClient.sendPlayerQuitRequest(opt_extraMessageData ? opt_extraMessageData : null, successCallback, errorCallback);
});
commandDocs.add("sendPlayerQuit(playerId, opt_extraMessageData) - send player quit request");
goog.exportSymbol("sendGameRequest", function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error("No gameManagerClient defined.");
  }
  var successCallback = function(result) {
    console.log("### sendGameRequest succeeded. Result:");
    console.dir(result);
  }, errorCallback = function(error) {
    console.log("### sendGameRequest failed. Error:");
    console.dir(error);
  };
  opt_playerId ? gameManagerClient.sendGameRequestWithPlayerId(opt_playerId, opt_extraMessageData ? opt_extraMessageData : null, successCallback, errorCallback) : gameManagerClient.sendGameRequest(opt_extraMessageData ? opt_extraMessageData : null, successCallback, errorCallback);
});
commandDocs.add("sendGameRequest(playerId, opt_extraMessageData) - send game message request");
goog.exportSymbol("sendGameMessage", function(opt_playerId, opt_extraMessageData) {
  if (!gameManagerClient) {
    throw Error("No gameManagerClient defined.");
  }
  opt_playerId ? gameManagerClient.sendGameMessageWithPlayerId(opt_playerId, opt_extraMessageData ? opt_extraMessageData : null) : gameManagerClient.sendGameMessage(opt_extraMessageData ? opt_extraMessageData : null);
});
commandDocs.add("sendGameMessage(playerId, opt_extraMessageData) - send game message (no response) request");
cast.games.common.sender.debugGameManagerClient = function(gameManagerClient) {
  console.log("### Adding game manager listeners for console debugging.");
  gameManagerClient.addEventListener(chrome.cast.games.GameManagerEventType.STATE_CHANGED, cast.games.common.sender.debugGameManagerClient.onStateChanged_);
  gameManagerClient.addEventListener(chrome.cast.games.GameManagerEventType.GAME_MESSAGE_RECEIVED, cast.games.common.sender.debugGameManagerClient.onGameMessageReceived_);
};
cast.games.common.sender.debugGameManagerClient.onStateChanged_ = function(event) {
  var currentState = event.currentState, previousState = event.previousState;
  if (currentState.hasLobbyStateChanged(previousState)) {
    var previousLobbyState = cast.games.common.sender.debugGameManagerClient.getNameForValue_(chrome.cast.games.LobbyState, previousState.getLobbyState()), currentLobbyState = cast.games.common.sender.debugGameManagerClient.getNameForValue_(chrome.cast.games.LobbyState, currentState.getLobbyState());
    console.log("### Lobby state change: " + previousLobbyState + " -> " + currentLobbyState);
  }
  if (currentState.hasGameplayStateChanged(previousState)) {
    var previousGameplayState = cast.games.common.sender.debugGameManagerClient.getNameForValue_(chrome.cast.games.GameplayState, previousState.getGameplayState()), currentGameplayState = cast.games.common.sender.debugGameManagerClient.getNameForValue_(chrome.cast.games.GameplayState, currentState.getGameplayState());
    console.log("### Gameplay state change: " + previousGameplayState + " -> " + currentGameplayState);
  }
  currentState.hasGameDataChanged(previousState) && (console.log("### Game data change:"), console.dir(previousState.getGameData()), console.log(" -> "), console.dir(currentState.getGameData()));
  currentState.hasGameStatusTextChanged(previousState) && console.log("### Game status text change: " + previousState.getGameStatusText() + " -> " + currentState.getGameStatusText());
  for (var changedPlayers = currentState.getListOfChangedPlayers(previousState), i = 0;i < changedPlayers.length;i++) {
    var changedPlayerId = changedPlayers[i];
    console.log("### Player Info change");
    console.log("  previous player info:");
    cast.games.common.sender.debugGameManagerClient.printPlayerInfo_(previousState.getPlayer(changedPlayerId));
    console.log("  current player info:");
    cast.games.common.sender.debugGameManagerClient.printPlayerInfo_(currentState.getPlayer(changedPlayerId));
  }
};
cast.games.common.sender.debugGameManagerClient.onGameMessageReceived_ = function(event) {
  console.log("### Game message:");
  console.dir(event.gameMessage);
};
cast.games.common.sender.debugGameManagerClient.printPlayerInfo_ = function(playerInfo) {
  if (playerInfo) {
    var playerState = cast.games.common.sender.debugGameManagerClient.getNameForValue_(chrome.cast.games.PlayerState, playerInfo.getPlayerState());
    console.log("  playerId:" + playerInfo.getPlayerId());
    console.log("  playerState:" + playerState);
    console.log("  playerData:");
    console.dir(playerInfo.getPlayerData());
  } else {
    console.log("  null player info");
  }
};
cast.games.common.sender.debugGameManagerClient.getNameForValue_ = function(object, value) {
  for (var keys = Object.keys(object), i = 0;i < keys.length;i++) {
    var key = keys[i];
    if (object[key] == value) {
      return key;
    }
  }
  return "Unknown value: " + value;
};
cast.games.common.sender.setup = function(appId, sessionCallback) {
  console.log("### Preparing session request and cast sender API config with app ID " + appId);
  var sessionRequest = new chrome.cast.SessionRequest(appId), apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionCallback, cast.games.common.sender.setup.onCastReceiverChanged_);
  console.log("### Initializing cast sender API and requesting a session.");
  chrome.cast.initialize(apiConfig, cast.games.common.sender.setup.onCastInit_, cast.games.common.sender.setup.onCastError_);
};
cast.games.common.sender.setup.onCastReceiverChanged_ = function(receiverAvailability) {
  receiverAvailability == chrome.cast.ReceiverAvailability.AVAILABLE ? console.log("\n### Click cast button in the Google Cast extension to start!\n") : console.log("\n### Not ready. Do NOT click cast button in the Google Cast extension.\n");
};
cast.games.common.sender.setup.onCastInit_ = function() {
  console.log("### Cast sender API initialized.");
};
cast.games.common.sender.setup.onCastError_ = function(error) {
  console.log("### Cast sender API error:");
  console.dir(error);
};
var gameManagerClient = null, timeoutObject, lastMessageWasFire = !0, HUMAN_PLAYER_ID_SUFFIXES = {WSD:"WSD", IKL:"IKL", ARROW:"ARROW", NUMPAD:"NUMPAD"}, keyCodeActionMap = {87:{keySet:HUMAN_PLAYER_ID_SUFFIXES.WSD, fire:!1, move:-.1}, 83:{keySet:HUMAN_PLAYER_ID_SUFFIXES.WSD, fire:!1, move:.1}, 68:{keySet:HUMAN_PLAYER_ID_SUFFIXES.WSD, fire:!0, move:0}, 73:{keySet:HUMAN_PLAYER_ID_SUFFIXES.IKL, fire:!1, move:-.1}, 75:{keySet:HUMAN_PLAYER_ID_SUFFIXES.IKL, fire:!1, move:.1}, 76:{keySet:HUMAN_PLAYER_ID_SUFFIXES.IKL, 
fire:!0, move:0}, 38:{keySet:HUMAN_PLAYER_ID_SUFFIXES.ARROW, fire:!1, move:-.1}, 40:{keySet:HUMAN_PLAYER_ID_SUFFIXES.ARROW, fire:!1, move:.1}, 39:{keySet:HUMAN_PLAYER_ID_SUFFIXES.ARROW, fire:!0, move:0}, 104:{keySet:HUMAN_PLAYER_ID_SUFFIXES.NUMPAD, fire:!1, move:-.1}, 101:{keySet:HUMAN_PLAYER_ID_SUFFIXES.NUMPAD, fire:!1, move:.1}, 102:{keySet:HUMAN_PLAYER_ID_SUFFIXES.NUMPAD, fire:!0, move:0}}, playerIdPrefix = "ChromeSender" + Math.random() + ":", playerPositions = {};
window.__onGCastApiAvailable = function(loaded, errorInfo) {
  loaded ? cast.games.common.sender.setup("54E247D6", onSessionReady_) : (console.error("### Cast Sender SDK failed to load:"), console.dir(errorInfo));
};
var updatePlayerPosition_ = function(playerId, delta) {
  void 0 == playerPositions[playerId] && (playerPositions[playerId] = .5);
  var position = playerPositions[playerId] + delta, position = 1 < position ? 1 : position, position = 0 > position ? 0 : position;
  return playerPositions[playerId] = position;
}, onSessionReady_ = function(session) {
  console.log("### Creating game manager client.");
  chrome.cast.games.GameManagerClient.getInstanceFor(session, function(result) {
    console.log("### Game manager client initialized!");
    gameManagerClient = result.gameManagerClient;
    cast.games.common.sender.debugGameManagerClient(gameManagerClient);
    window.addEventListener("keydown", onKeyDown_, !0);
    help();
  }, function(error) {
    console.error("### Error initializing the game manager client: " + error.errorDescription + " Error code: " + error.errorCode);
  });
}, onKeyDown_ = function(event) {
  console.log("### Key detected: " + event.keyCode);
  var keyCodeAction = keyCodeActionMap[event.keyCode], playerId = playerIdPrefix + keyCodeAction.keySet, message = {};
  message.fire = keyCodeAction.fire;
  message.move = updatePlayerPosition_(playerId, keyCodeAction.move);
  playerId && message && (gameManagerClient.getCurrentState().getPlayer(playerId) ? gameManagerClient.sendGameMessageWithPlayerId(playerId, message) : gameManagerClient.sendPlayerAvailableRequestWithPlayerId(playerId, null, null, null));
};
goog.exportSymbol("startPeriodicMessages", function(playerId, messageFactory, frequency) {
  stopPeriodicMessages();
  if (!playerId) {
    var players = gameManagerClient.getCurrentState().getPlayers();
    0 < players.length && (playerId = players[0].playerId);
  }
  if (playerId) {
    var closure = function() {
      var message = messageFactory(playerId);
      gameManagerClient.sendGameMessageWithPlayerId(playerId, message);
      timeoutObject = setTimeout(closure, frequency);
    };
    closure();
  } else {
    console.log("### Can't start sending periodic messages. No players!");
  }
});
commandDocs.add("startPeriodicMessages(playerId, messageFactory, frequency) - send preriodic messages constructed by messageFactory");
var stopPeriodicMessages = function() {
  timeoutObject && clearTimeout(timeoutObject);
};
goog.exportSymbol("stopPeriodicMessages", stopPeriodicMessages);
commandDocs.add("stopPeriodicMessages() - stop sending periodic messages.");
goog.exportSymbol("randomMessageFactory", function() {
  var message = {fire:!1};
  .5 < Math.random() && (message.fire = !0);
  message.move = Math.random();
  return message;
});
commandDocs.add("randomMessageFactory - random message factory for starcast");
goog.exportSymbol("alignedMessageFactory", function(playerId) {
  var message = {fire:!1};
  lastMessageWasFire ? (message.move = updatePlayerPosition_(playerId, .1), 1 <= message.move && (playerPositions[playerId] = -.1)) : message.fire = !0;
  lastMessageWasFire = !lastMessageWasFire;
  return message;
});
commandDocs.add("alignedMessageFactory - message factory for starcast that sends a move message followed by a fire message");

