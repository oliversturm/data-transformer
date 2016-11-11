"use strict";

var _chai = require("chai");

var _dataTransformer = require("../../dist/data-transformer.js");

describe("#map", function () {
			it("should map values correctly", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformer.map)(function (x) {
									return x * 2;
						}, [1, 2]))).to.eql([2, 4]);
			});
			it("should pass indices into source", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformer.map)(function (x, i) {
									return x * i;
						}, [1, 2]))).to.eql([0, 2]);
			});
			it("should handle iterable input", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformer.map)(function (x) {
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
});

describe("#fold", function () {
			it("should fold correctly", function () {
						(0, _chai.expect)((0, _dataTransformer.fold)(function (r, v) {
									return r + v;
						}, 0, [1, 2, 3])).to.eql(6);
			});
			it("should handle large source lists", function () {
						(0, _chai.expect)((0, _dataTransformer.fold)(function (r, v) {
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
						(0, _chai.expect)((0, _dataTransformer.fold)(function (r, v, i) {
									return r + v * i;
						}, 0, [1, 2, 3])).to.eql(8);
			});
});

describe("#transformArrayOfArrays", function () {
			var source = [[1, 2], ["one", "two"]];

			it("should return correct value for simple transformation", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformer.transformArrayOfArrays)(source, ["one", "two"]))).to.eql([{ one: 1, two: 2 }, { one: "one", two: "two" }]);
			});
			it("should use default field names if not enough names are given", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformer.transformArrayOfArrays)(source, ["one"]))).to.eql([{ one: 1, field1: 2 }, { one: "one", field1: "two" }]);
			});
			it("should use only default field names if no names are given", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformer.transformArrayOfArrays)(source))).to.eql([{ field0: 1, field1: 2 }, { field0: "one", field1: "two" }]);
			});
			it("should use custom field prefix if given", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformer.transformArrayOfArrays)(source, undefined, "xxx"))).to.eql([{ xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" }]);
			});
			it("should accept string as field prefix function return", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformer.transformArrayOfArrays)(source, undefined, function () {
									return "xxx";
						}))).to.eql([{ xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" }]);
			});
			it("should accept object as field prefix function return", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformer.transformArrayOfArrays)(source, undefined, function () {
									return { prefix: "xxx" };
						}))).to.eql([{ xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" }]);
			});
			it("should skip field numbering if told", function () {
						(0, _chai.expect)(Array.from((0, _dataTransformer.transformArrayOfArrays)(source, undefined, function (a, ai, v, vi) {
									return { prefix: "xxx" + vi * 2, skipNumbering: true };
						}))).to.eql([{ xxx0: 1, xxx2: 2 }, { xxx0: "one", xxx2: "two" }]);
			});
});

// empty data edge case
