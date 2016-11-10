import { expect } from "chai";
import { transformArrayOfArrays } from "../dist/data-transformer.js";

describe("#transformArrayOfArrays", function() {
    const source = [[1, 2], ["one", "two"]];
    
    it("should return correct value for simple transformation", function() {
	expect(transformArrayOfArrays(source, ["one", "two"])).to.
	    eql([ { one: 1, two: 2 }, { one: "one", two: "two" } ]);
    });
    it("should use default field names if not enough names are given", function() {
	expect(transformArrayOfArrays(source, ["one"])).to.
	    eql([ { one: 1, field1: 2 }, { one: "one", field1: "two" } ]);
    });
    it("should use only default field names if no names are given", function() {
	expect(transformArrayOfArrays(source)).to.
	    eql([ { field0: 1, field1: 2 }, { field0: "one", field1: "two" } ]);
    });
    it("should use custom field prefix if given", function() {
	expect(transformArrayOfArrays(source, undefined, "xxx")).to.
	    eql([ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]);
    });
    it("should accept string as field prefix function return", function() {
	expect(transformArrayOfArrays(source, undefined, () => "xxx")).to.
	    eql([ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]);
    });
    it("should accept object as field prefix function return", function() {
	expect(transformArrayOfArrays(source, undefined, () => ({ prefix: "xxx" }))).to.
	    eql([ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]);
    });
    it("should skip field numbering if told", function() {
	expect(transformArrayOfArrays(source, undefined, (a, ai, v, vi) => ({ prefix: "xxx" + vi * 2, skipNumbering: true }))).to.
	    eql([ { xxx0: 1, xxx2: 2 }, { xxx0: "one", xxx2: "two" } ]);
    });

});
