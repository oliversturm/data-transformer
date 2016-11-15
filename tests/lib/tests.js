"use strict";

require("babel-polyfill");

var _chai = require("chai");

var _dataTransformerMin = require("../../dist/data-transformer.min.js");

describe("#map", function () {
			it("should map values correctly", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.map)(function (x) {
									return x * 2;
						}, [1, 2]))).to.eql([2, 4]);
			});
			it("should pass indices into source", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.map)(function (x, i) {
									return x * i;
						}, [1, 2]))).to.eql([0, 2]);
			});
			it("should handle iterable input", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.map)(function (x) {
									return x * x;
						}, regeneratorRuntime.mark(function _callee() {
									return regeneratorRuntime.wrap(function _callee$(_context) {
												while (1) {
															switch (_context.prev = _context.next) {
																		case 0:
																					_context.next = 2;
																					return 1;

																		case 2:
																					_context.next = 4;
																					return 2;

																		case 4:
																		case "end":
																					return _context.stop();
															}
												}
									}, _callee, this);
						})()))).to.eql([1, 4]);
			});
			it("should handle strings, which are iterables", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.map)(function (x) {
									return x + x;
						}, "hello"))).to.eql(["hh", "ee", "ll", "ll", "oo"]);
			});
});

describe("#fold", function () {
			it("should fold correctly", function () {
						(0, _chai.expect)((0, _dataTransformerMin.fold)(function (r, v) {
									return r + v;
						}, 0, [1, 2, 3])).to.eql(6);
			});
			it("should handle large source lists", function () {
						(0, _chai.expect)((0, _dataTransformerMin.fold)(function (r, v) {
									return r + v;
						}, 0, regeneratorRuntime.mark(function _callee2() {
									var i;
									return regeneratorRuntime.wrap(function _callee2$(_context2) {
												while (1) {
															switch (_context2.prev = _context2.next) {
																		case 0:
																					i = 1;

																		case 1:
																					if (!(i <= 1000000)) {
																								_context2.next = 7;
																								break;
																					}

																					_context2.next = 4;
																					return i;

																		case 4:
																					i++;
																					_context2.next = 1;
																					break;

																		case 7:
																		case "end":
																					return _context2.stop();
															}
												}
									}, _callee2, this);
						})())).to.eql(500000500000);
			});
			it("should pass indices into source", function () {
						(0, _chai.expect)((0, _dataTransformerMin.fold)(function (r, v, i) {
									return r + v * i;
						}, 0, [1, 2, 3])).to.eql(8);
			});
});

describe("#iterableOfIterablesToObjects", function () {
			var _marked = [innerIterable, outerIterable].map(regeneratorRuntime.mark);

			var source = [[1, 2], ["one", "two"]];

			it("should return correct value for simple transformation", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.iterableOfIterablesToObjects)(source, ["one", "two"]))).to.eql([{ one: 1, two: 2 }, { one: "one", two: "two" }]);
			});
			it("should use default field names if not enough names are given", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.iterableOfIterablesToObjects)(source, ["one"]))).to.eql([{ one: 1, field1: 2 }, { one: "one", field1: "two" }]);
			});
			it("should use only default field names if no names are given", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.iterableOfIterablesToObjects)(source))).to.eql([{ field0: 1, field1: 2 }, { field0: "one", field1: "two" }]);
			});
			it("should use custom field prefix if given", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.iterableOfIterablesToObjects)(source, undefined, "xxx"))).to.eql([{ xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" }]);
			});
			it("should accept string as field prefix function return", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.iterableOfIterablesToObjects)(source, undefined, function () {
									return "xxx";
						}))).to.eql([{ xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" }]);
			});
			it("should accept object as field prefix function return", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.iterableOfIterablesToObjects)(source, undefined, function () {
									return { prefix: "xxx" };
						}))).to.eql([{ xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" }]);
			});
			it("should skip field numbering if told", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.iterableOfIterablesToObjects)(source, undefined, function (a, ai, v, vi) {
									return { prefix: "i" + ai + "-f" + (vi + 1), skipNumbering: true };
						}))).to.eql([{ "i0-f1": 1, "i0-f2": 2 }, { "i1-f1": "one", "i1-f2": "two" }]);
			});

			function innerIterable(x) {
						return regeneratorRuntime.wrap(function innerIterable$(_context3) {
									while (1) {
												switch (_context3.prev = _context3.next) {
															case 0:
																		_context3.next = 2;
																		return x * 3;

															case 2:
																		_context3.next = 4;
																		return x * 5;

															case 4:
															case "end":
																		return _context3.stop();
												}
									}
						}, _marked[0], this);
			}

			function outerIterable() {
						return regeneratorRuntime.wrap(function outerIterable$(_context4) {
									while (1) {
												switch (_context4.prev = _context4.next) {
															case 0:
																		_context4.next = 2;
																		return innerIterable(3);

															case 2:
																		_context4.next = 4;
																		return innerIterable(5);

															case 4:
															case "end":
																		return _context4.stop();
												}
									}
						}, _marked[1], this);
			}

			it("should work with iterables that are not arrays", function () {

						(0, _chai.expect)(Array.from((0, _dataTransformerMin.iterableOfIterablesToObjects)(outerIterable()))).to.eql([{
									field0: 9, field1: 15
						}, {
									field0: 15, field1: 25
						}]);
			});
});

describe("#flattenOneToN", function () {
			it("should work with basic 1-N", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.flattenOneToN)([{ country: "UK",
									cities: [{ city: "London", population: 10000000 }, { city: "Edinburgh", population: 800000 }] }]))).to.eql([{ country: 'UK', city: 'London', population: 10000000 }, { country: 'UK', city: 'Edinburgh', population: 800000 }]);
			});
			it("should work with basic 1-N, multiple master fields", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.flattenOneToN)([{ country: "UK",
									dialcode: "44",
									cities: [{ city: "London", population: 10000000 }, { city: "Edinburgh", population: 800000 }] }]))).to.eql([{ country: 'UK', dialcode: "44", city: 'London', population: 10000000 }, { country: 'UK', dialcode: "44", city: 'Edinburgh', population: 800000 }]);
			});
			it("should work with basic 1-N, multiple masters", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.flattenOneToN)([{ country: "UK",
									cities: [{ city: "London", population: 10000000 }, { city: "Edinburgh", population: 800000 }] }, { country: "USA",
									cities: [{ city: "New York", population: 12000000 }] }]))).to.eql([{ country: 'UK', city: 'London', population: 10000000 }, { country: 'UK', city: 'Edinburgh', population: 800000 }, { country: 'USA', city: 'New York', population: 12000000 }]);
			});
			it("should work with 2N", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.flattenOneToN)([{ country: "UK",
									cities: [{ city: "London", population: 10000000 }, { city: "Edinburgh", population: 800000 }],
									counties: [{ county: "Kent" }, { county: "Buckinghamshire" }, { county: "Warwickshire" }, { county: "Yorkshire" }]
						}]))).to.eql([{ "city": "London", "country": "UK", "county": "Kent", "population": 10000000 }, { "city": "London", "country": "UK", "county": "Buckinghamshire", "population": 10000000 }, { "city": "London", "country": "UK", "county": "Warwickshire", "population": 10000000 }, { "city": "London", "country": "UK", "county": "Yorkshire", "population": 10000000 }, { "city": "Edinburgh", "country": "UK", "county": "Kent", "population": 800000 }, { "city": "Edinburgh", "country": "UK", "county": "Buckinghamshire", "population": 800000 }, { "city": "Edinburgh", "country": "UK", "county": "Warwickshire", "population": 800000 }, { "city": "Edinburgh", "country": "UK", "county": "Yorkshire", "population": 800000 }]);
			});
			it("should work with 2N, two explicit n-fields", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.flattenOneToN)([{ country: "UK",
									cities: [{ city: "London", population: 10000000 }, { city: "Edinburgh", population: 800000 }],
									counties: [{ county: "Kent" }, { county: "Buckinghamshire" }, { county: "Warwickshire" }, { county: "Yorkshire" }]
						}], ["cities", "counties"]))).to.eql([{ "city": "London", "country": "UK", "county": "Kent", "population": 10000000 }, { "city": "London", "country": "UK", "county": "Buckinghamshire", "population": 10000000 }, { "city": "London", "country": "UK", "county": "Warwickshire", "population": 10000000 }, { "city": "London", "country": "UK", "county": "Yorkshire", "population": 10000000 }, { "city": "Edinburgh", "country": "UK", "county": "Kent", "population": 800000 }, { "city": "Edinburgh", "country": "UK", "county": "Buckinghamshire", "population": 800000 }, { "city": "Edinburgh", "country": "UK", "county": "Warwickshire", "population": 800000 }, { "city": "Edinburgh", "country": "UK", "county": "Yorkshire", "population": 800000 }]);
			});
			it("should work with 2N, one explicit n-field", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.flattenOneToN)([{ country: "UK",
									cities: [{ city: "London", population: 10000000 }, { city: "Edinburgh", population: 800000 }],
									counties: [{ county: "Kent" }, { county: "Buckinghamshire" }]
						}], ["cities"]))).to.eql([{ "city": "London", "country": "UK", "population": 10000000, counties: [{ county: "Kent" }, { county: "Buckinghamshire" }] }, { "city": "Edinburgh", "country": "UK", "population": 800000, counties: [{ county: "Kent" }, { county: "Buckinghamshire" }] }]);
			});
			it("should work with function returning n-field name(s)", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.flattenOneToN)([{ country: "UK",
									cities: [{ city: "London", population: 10000000 }, { city: "Edinburgh", population: 800000 }],
									counties: [{ county: "Kent" }, { county: "Buckinghamshire" }]
						}], undefined, {
									dynamicDetector: function dynamicDetector() {
												return ["cities"];
									}
						}))).to.eql([{ "city": "London", "country": "UK", "population": 10000000, counties: [{ county: "Kent" }, { county: "Buckinghamshire" }] }, { "city": "Edinburgh", "country": "UK", "population": 800000, counties: [{ county: "Kent" }, { county: "Buckinghamshire" }] }]);
			});
			it("should work with primitive types in N relation", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.flattenOneToN)([{
									order: "12345",
									productIds: [7, 8, 9]
						}]))).to.eql([{ order: "12345", productIds: 7 }, { order: "12345", productIds: 8 }, { order: "12345", productIds: 9 }]);
			});
			it("should work with primitive types in N relation - strings", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformerMin.flattenOneToN)([{
									order: "12345",
									productIds: ["seven", "eight", "nine"]
						}]))).to.eql([{ order: "12345", productIds: "seven" }, { order: "12345", productIds: "eight" }, { order: "12345", productIds: "nine" }]);
			});

			it("should work with individual object n-fields", function () {
						var result = Array.from((0, _dataTransformerMin.flattenOneToN)([{
									order: "12345",
									productIds: [7, 8, 9]
						}, {
									order: "87463",
									remoteRefs: ["one", "two", "three"]
						}], undefined, {
									perSourceObject: true
						}));

						(0, _chai.expect)(result).to.eql([{ order: '12345', productIds: 7 }, { order: '12345', productIds: 8 }, { order: '12345', productIds: 9 }, { order: '87463', remoteRefs: 'one' }, { order: '87463', remoteRefs: 'two' }, { order: '87463', remoteRefs: 'three' }]);
			});
			it("should work with individual object n-fields with dynamic detection", function () {
						var result = Array.from((0, _dataTransformerMin.flattenOneToN)([{
									type: "order",
									orderId: "987987",
									productIds: [7, 8]
						}, {
									type: "delivery",
									deliveryId: "432141",
									deliveryRefs: ["one", "two"]
						}], undefined, {
									perSourceObject: true,
									dynamicDetector: function dynamicDetector(o) {
												if (o.type === "order") {
															return ["productIds"];
												} else if (o.type === "delivery") {
															return ["deliveryRefs"];
												} else {
															return [];
												}
									}
						}));

						(0, _chai.expect)(result).to.eql([{ type: "order", orderId: '987987', productIds: 7 }, { type: "order", orderId: '987987', productIds: 8 }, { type: "delivery", deliveryId: '432141', deliveryRefs: "one" }, { type: "delivery", deliveryId: '432141', deliveryRefs: "two" }]);
			});
});
