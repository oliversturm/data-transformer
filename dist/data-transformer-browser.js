(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(); else if (typeof define === "function" && define.amd) define([], factory); else if (typeof exports === "object") exports["dataTransformer"] = factory(); else root["dataTransformer"] = factory();
})(this, function() {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                exports: {},
                id: moduleId,
                loaded: false
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.loaded = true;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.p = "";
        return __webpack_require__(0);
    }([ function(module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        exports.map = map;
        exports.fold = fold;
        exports.iterableOfIterablesToObjects = iterableOfIterablesToObjects;
        exports.flattenOneToN = flattenOneToN;
        var _marked = [ map, iterableOfIterablesToObjects, flattenOneToN ].map(regeneratorRuntime.mark);
        function map(iterator, source) {
            var index, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, v;
            return regeneratorRuntime.wrap(function map$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        index = 0;
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 4;
                        _iterator = source[Symbol.iterator]();

                      case 6:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 13;
                            break;
                        }
                        v = _step.value;
                        _context.next = 10;
                        return iterator(v, index++);

                      case 10:
                        _iteratorNormalCompletion = true;
                        _context.next = 6;
                        break;

                      case 13:
                        _context.next = 19;
                        break;

                      case 15:
                        _context.prev = 15;
                        _context.t0 = _context["catch"](4);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                      case 19:
                        _context.prev = 19;
                        _context.prev = 20;
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                      case 22:
                        _context.prev = 22;
                        if (!_didIteratorError) {
                            _context.next = 25;
                            break;
                        }
                        throw _iteratorError;

                      case 25:
                        return _context.finish(22);

                      case 26:
                        return _context.finish(19);

                      case 27:
                      case "end":
                        return _context.stop();
                    }
                }
            }, _marked[0], this, [ [ 4, 15, 19, 27 ], [ 20, , 22, 26 ] ]);
        }
        function fold(reducer, initialValue, source) {
            var r = initialValue;
            var i = 0;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;
            try {
                for (var _iterator2 = source[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var x = _step2.value;
                    r = reducer(r, x, i++);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
            return r;
        }
        function iterableOfIterablesToObjects(source) {
            var fieldNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var fieldPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "field";
            var defaultName;
            return regeneratorRuntime.wrap(function iterableOfIterablesToObjects$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        defaultName = function defaultName(a, ai, v, vi) {
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
                        return _context2.delegateYield(map(function(a, ai) {
                            return fold(function(r, v, vi) {
                                r[vi < fieldNames.length ? fieldNames[vi] : defaultName(a, ai, v, vi)] = v;
                                return r;
                            }, {}, a);
                        }, source), "t0", 2);

                      case 2:
                      case "end":
                        return _context2.stop();
                    }
                }
            }, _marked[1], this);
        }
        function flattenOneToN(source) {
            var _this = this;
            var nFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var nFieldHandling = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
                perSourceObject: false,
                dynamicDetector: undefined
            };
            var _marked2, findNfields, _nFields, _source$Symbol$iterat, firstValue, done, copyFields, cloneObject, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _loop, _iterator3, _step3;
            return regeneratorRuntime.wrap(function flattenOneToN$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        cloneObject = function cloneObject(source) {
                            return copyFields(source, {});
                        };
                        copyFields = function copyFields(source, target) {
                            var exclusions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
                            var sourceName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
                            if (source != null && (typeof source === "undefined" ? "undefined" : _typeof(source)) === "object") {
                                for (var f in source) {
                                    if (!exclusions.includes(f)) {
                                        target[f] = source[f];
                                    }
                                }
                            } else {
                                if (!sourceName) {
                                    throw "copyFields encountered a non-object source (" + source + "), but no sourceName was provided.";
                                }
                                target[sourceName] = source;
                            }
                            return target;
                        };
                        findNfields = function findNfields(o) {
                            var field;
                            return regeneratorRuntime.wrap(function findNfields$(_context3) {
                                while (1) {
                                    switch (_context3.prev = _context3.next) {
                                      case 0:
                                        _context3.t0 = regeneratorRuntime.keys(o);

                                      case 1:
                                        if ((_context3.t1 = _context3.t0()).done) {
                                            _context3.next = 8;
                                            break;
                                        }
                                        field = _context3.t1.value;
                                        if (!(typeof o[field] != "string" && typeof o[field][Symbol.iterator] === "function")) {
                                            _context3.next = 6;
                                            break;
                                        }
                                        _context3.next = 6;
                                        return field;

                                      case 6:
                                        _context3.next = 1;
                                        break;

                                      case 8:
                                      case "end":
                                        return _context3.stop();
                                    }
                                }
                            }, _marked2[0], this);
                        };
                        _marked2 = [ findNfields ].map(regeneratorRuntime.mark);
                        _nFields = nFields;
                        if (nFields.length == 0 && !nFieldHandling.perSourceObject) {
                            _source$Symbol$iterat = source[Symbol.iterator]().next(), firstValue = _source$Symbol$iterat.value, 
                            done = _source$Symbol$iterat.done;
                            if (!done) {
                                _nFields = Array.from(nFieldHandling.dynamicDetector ? nFieldHandling.dynamicDetector(firstValue) : findNfields(firstValue));
                            }
                        }
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context6.prev = 9;
                        _loop = regeneratorRuntime.mark(function _loop() {
                            var _marked3, d, o, recurse;
                            return regeneratorRuntime.wrap(function _loop$(_context5) {
                                while (1) {
                                    switch (_context5.prev = _context5.next) {
                                      case 0:
                                        recurse = function recurse(fieldIndex, o) {
                                            var myList, originalO, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, value, iterationO;
                                            return regeneratorRuntime.wrap(function recurse$(_context4) {
                                                while (1) {
                                                    switch (_context4.prev = _context4.next) {
                                                      case 0:
                                                        if (!(_nFields.length - fieldIndex < 1)) {
                                                            _context4.next = 2;
                                                            break;
                                                        }
                                                        return _context4.abrupt("return");

                                                      case 2:
                                                        myList = d[_nFields[fieldIndex]];
                                                        if (!(myList && myList.length > 0)) {
                                                            _context4.next = 37;
                                                            break;
                                                        }
                                                        originalO = cloneObject(o);
                                                        _iteratorNormalCompletion4 = true;
                                                        _didIteratorError4 = false;
                                                        _iteratorError4 = undefined;
                                                        _context4.prev = 8;
                                                        _iterator4 = d[_nFields[fieldIndex]][Symbol.iterator]();

                                                      case 10:
                                                        if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                                                            _context4.next = 21;
                                                            break;
                                                        }
                                                        value = _step4.value;
                                                        iterationO = cloneObject(originalO);
                                                        copyFields(value, iterationO, [], _nFields[fieldIndex]);
                                                        return _context4.delegateYield(recurse(fieldIndex + 1, iterationO), "t0", 15);

                                                      case 15:
                                                        if (!(fieldIndex === _nFields.length - 1)) {
                                                            _context4.next = 18;
                                                            break;
                                                        }
                                                        _context4.next = 18;
                                                        return iterationO;

                                                      case 18:
                                                        _iteratorNormalCompletion4 = true;
                                                        _context4.next = 10;
                                                        break;

                                                      case 21:
                                                        _context4.next = 27;
                                                        break;

                                                      case 23:
                                                        _context4.prev = 23;
                                                        _context4.t1 = _context4["catch"](8);
                                                        _didIteratorError4 = true;
                                                        _iteratorError4 = _context4.t1;

                                                      case 27:
                                                        _context4.prev = 27;
                                                        _context4.prev = 28;
                                                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                                            _iterator4.return();
                                                        }

                                                      case 30:
                                                        _context4.prev = 30;
                                                        if (!_didIteratorError4) {
                                                            _context4.next = 33;
                                                            break;
                                                        }
                                                        throw _iteratorError4;

                                                      case 33:
                                                        return _context4.finish(30);

                                                      case 34:
                                                        return _context4.finish(27);

                                                      case 35:
                                                        _context4.next = 41;
                                                        break;

                                                      case 37:
                                                        return _context4.delegateYield(recurse(fieldIndex + 1, o), "t2", 38);

                                                      case 38:
                                                        if (!(fieldIndex === _nFields.length - 1)) {
                                                            _context4.next = 41;
                                                            break;
                                                        }
                                                        _context4.next = 41;
                                                        return o;

                                                      case 41:
                                                      case "end":
                                                        return _context4.stop();
                                                    }
                                                }
                                            }, _marked3[0], this, [ [ 8, 23, 27, 35 ], [ 28, , 30, 34 ] ]);
                                        };
                                        _marked3 = [ recurse ].map(regeneratorRuntime.mark);
                                        d = _step3.value;
                                        if (nFields.length == 0 && nFieldHandling.perSourceObject) {
                                            _nFields = Array.from(nFieldHandling.dynamicDetector ? nFieldHandling.dynamicDetector(d) : findNfields(d));
                                        }
                                        o = copyFields(d, {}, _nFields);
                                        if (!(_nFields.length > 0)) {
                                            _context5.next = 9;
                                            break;
                                        }
                                        return _context5.delegateYield(recurse(0, o), "t0", 7);

                                      case 7:
                                        _context5.next = 11;
                                        break;

                                      case 9:
                                        _context5.next = 11;
                                        return o;

                                      case 11:
                                      case "end":
                                        return _context5.stop();
                                    }
                                }
                            }, _loop, _this);
                        });
                        _iterator3 = source[Symbol.iterator]();

                      case 12:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context6.next = 17;
                            break;
                        }
                        return _context6.delegateYield(_loop(), "t0", 14);

                      case 14:
                        _iteratorNormalCompletion3 = true;
                        _context6.next = 12;
                        break;

                      case 17:
                        _context6.next = 23;
                        break;

                      case 19:
                        _context6.prev = 19;
                        _context6.t1 = _context6["catch"](9);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context6.t1;

                      case 23:
                        _context6.prev = 23;
                        _context6.prev = 24;
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                      case 26:
                        _context6.prev = 26;
                        if (!_didIteratorError3) {
                            _context6.next = 29;
                            break;
                        }
                        throw _iteratorError3;

                      case 29:
                        return _context6.finish(26);

                      case 30:
                        return _context6.finish(23);

                      case 31:
                      case "end":
                        return _context6.stop();
                    }
                }
            }, _marked[2], this, [ [ 9, 19, 23, 31 ], [ 24, , 26, 30 ] ]);
        }
    } ]);
});

