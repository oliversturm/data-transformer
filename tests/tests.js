import { expect } from "chai";
import {
    transformArrayOfArrays,
    map,
    fold
} from "../../dist/data-transformer.js";

describe("#map", function() {
    it("should map values correctly", function() {
	expect(Array.from(map(x => x * 2, [1, 2]))).to.
	       eql([2, 4]);
    });
    it("should pass indices into source", function() {
	expect(Array.from(map((x, i) => x * i, [1, 2]))).to.
	    eql([0, 2]);
    });
    it("should handle iterable input", function() {
	expect(Array.from(map(
	    x => x * x,
	    (function*() {
		yield 1;
		yield 2;
	    })()
	))).to.
	    eql([1, 4]);
    });    
});

describe("#fold", function() {
    it("should fold correctly", function() {
	expect(fold((r, v) => r + v, 0, [1, 2, 3])).to.
	    eql(6);
    });
    it("should handle large source lists", function() {
	expect(fold((r, v) => r + v, 0,
		    (function*() {
			for (let i = 1; i <= 1000000; i++) {
			    yield i;
			}
		    })()
		   )).to.eql(500000500000);
    });
    it("should pass indices into source", function() {
	expect(fold((r, v, i) => r + v * i, 0, [1, 2, 3])).to.
	    eql(8);
	
    });
    
});



describe("#transformArrayOfArrays", function() {
    const source = [[1, 2], ["one", "two"]];
    
    it("should return correct value for simple transformation", function() {
	expect(Array.from(transformArrayOfArrays(source, ["one", "two"]))).to.
	    eql([ { one: 1, two: 2 }, { one: "one", two: "two" } ]);
    });
    it("should use default field names if not enough names are given", function() {
	expect(Array.from(transformArrayOfArrays(source, ["one"]))).to.
	    eql([ { one: 1, field1: 2 }, { one: "one", field1: "two" } ]);
    });
    it("should use only default field names if no names are given", function() {
	expect(Array.from(transformArrayOfArrays(source))).to.
	    eql([ { field0: 1, field1: 2 }, { field0: "one", field1: "two" } ]);
    });
    it("should use custom field prefix if given", function() {
	expect(Array.from(transformArrayOfArrays(source, undefined, "xxx"))).to.
	    eql([ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]);
    });
    it("should accept string as field prefix function return", function() {
	expect(Array.from(transformArrayOfArrays(source, undefined, () => "xxx"))).to.
	    eql([ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]);
    });
    it("should accept object as field prefix function return", function() {
	expect(Array.from(transformArrayOfArrays(source, undefined, () => ({ prefix: "xxx" })))).to.
	    eql([ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]);
    });
    it("should skip field numbering if told", function() {
	expect(Array.from(transformArrayOfArrays(source, undefined, (a, ai, v, vi) => ({ prefix: "xxx" + vi * 2, skipNumbering: true })))).to.
	    eql([ { xxx0: 1, xxx2: 2 }, { xxx0: "one", xxx2: "two" } ]);
    });

});

// empty data edge case
