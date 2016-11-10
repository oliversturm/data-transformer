(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
			value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	function transformArrayOfArrays(source) {
			var fieldNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
			var fieldPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "field";

			var defaultName = function defaultName(a, ai, v, vi) {
					var prefix = fieldPrefix;
					var skipNumbering = false;
					if (typeof fieldPrefix === "function") {
							var r = fieldPrefix(a, ai, v, vi);
							if ((typeof r === "undefined" ? "undefined" : _typeof(r)) === "object") {
									prefix = r.prefix;
									if (r.skipNumbering) {
											skipNumbering = r.skipNumbering;
									}
							} else {
									prefix = r;
							}
					}
					return prefix + (skipNumbering ? "" : vi);
			};

			return source.map(function (a, ai) {
					return a.reduce(function (r, v, vi) {
							r[vi < fieldNames.length ? fieldNames[vi] : defaultName(a, ai, v, vi)] = v;
							return r;
					}, {});
			});
	}

	function transformData(data) {
			return data.map(function (p) {
					return p.values.map(function (v) {
							return {
									place: p.place, month: v.month, degreesC: v.degreesC
							};
					});
			}).reduce(function (r, v) {
					return r.concat(v);
			});
	}

	function flattenOneToN(data) {
			var nFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			return data.map(function (d) {});
	}

	var people = [{ name: "Oli",
			phones: [{ country: "UK", number: "879879" }, { country: "US", number: "13123" }],
			addresses: [{ city: "London", postCode: "AB34 7EF" }, { city: "Los Angeles", postCode: "98743" }]
	}];

	exports.transformArrayOfArrays = transformArrayOfArrays;

/***/ }
/******/ ])
});
;