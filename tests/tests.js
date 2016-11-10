import { expect } from "chai";
import { transformArrayOfArrays } from "../dist/data-transformer.js";

describe("#transformArrayOfArrays", function() {
    it("should return correct value for simple transformation", function() {
	expect(transformArrayOfArrays([[1, 2], ["one", "two"]], "one", "two")).to.
	    eql([ { one: 1, two: 2 }, { one: "one", two: "two" } ]);
    });
});
