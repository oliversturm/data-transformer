import { expect } from "chai";
import {
    iterableOfIterablesToObjects,
    map,
    fold,
    flattenOneToN
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



describe("#iterableOfIterablesToObjects", function() {
    const source = [[1, 2], ["one", "two"]];
    
    it("should return correct value for simple transformation", function() {
	expect(Array.from(iterableOfIterablesToObjects(source, ["one", "two"]))).to.
	    eql([ { one: 1, two: 2 }, { one: "one", two: "two" } ]);
    });
    it("should use default field names if not enough names are given", function() {
	expect(Array.from(iterableOfIterablesToObjects(source, ["one"]))).to.
	    eql([ { one: 1, field1: 2 }, { one: "one", field1: "two" } ]);
    });
    it("should use only default field names if no names are given", function() {
	expect(Array.from(iterableOfIterablesToObjects(source))).to.
	    eql([ { field0: 1, field1: 2 }, { field0: "one", field1: "two" } ]);
    });
    it("should use custom field prefix if given", function() {
	expect(Array.from(iterableOfIterablesToObjects(source, undefined, "xxx"))).to.
	    eql([ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]);
    });
    it("should accept string as field prefix function return", function() {
	expect(Array.from(iterableOfIterablesToObjects(source, undefined, () => "xxx"))).to.
	    eql([ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]);
    });
    it("should accept object as field prefix function return", function() {
	expect(Array.from(iterableOfIterablesToObjects(source, undefined, () => ({ prefix: "xxx" })))).to.
	    eql([ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]);
    });
    it("should skip field numbering if told", function() {
	expect(Array.from(iterableOfIterablesToObjects(source, undefined, (a, ai, v, vi) => ({ prefix: "xxx" + vi * 2, skipNumbering: true })))).to.
	    eql([ { xxx0: 1, xxx2: 2 }, { xxx0: "one", xxx2: "two" } ]);
    });

    function* innerIterable(x) {
	yield x * 3;
	yield x * 5;
    }

    function* outerIterable() {
	yield innerIterable(3);
	yield innerIterable(5);
    }
    
    it("should work with iterables that are not arrays", function() {

	expect(Array.from(iterableOfIterablesToObjects(outerIterable()))).to.
	    eql([ {
		field0: 9, field1: 15
	    }, {
		field0: 15, field1: 25
	    }]);
	
    });
    

});

describe("#flattenOneToN", function() {
    it("should work with basic 1-N", function() {
	expect(Array.from(flattenOneToN(
	    [
		{ country: "UK",
		  cities: [
		      { city: "London", population: 10000000 },
		      { city: "Edinburgh", population: 800000 } ] } 
	    ]
	))).to.eql([
	    { country: 'UK', city: 'London', population: 10000000 },
	    { country: 'UK', city: 'Edinburgh', population: 800000 }
	]);
    });
    it("should work with basic 1-N, multiple master fields", function() {
	expect(Array.from(flattenOneToN(
	    [
		{ country: "UK",
		  dialcode: "44",
		  cities: [
		      { city: "London", population: 10000000 },
		      { city: "Edinburgh", population: 800000 } ] } 
	    ]
	))).to.eql([
	    { country: 'UK', dialcode: "44", city: 'London', population: 10000000 },
	    { country: 'UK', dialcode: "44", city: 'Edinburgh', population: 800000 }
	]);
    });
    it("should work with basic 1-N, multiple masters", function() {
	expect(Array.from(flattenOneToN(
	    [
		{ country: "UK",
		  cities: [
		      { city: "London", population: 10000000 },
		      { city: "Edinburgh", population: 800000 } ] },
		{ country: "USA",
		  cities: [
		      { city: "New York", population: 12000000 }] } 
	    ]
	))).to.eql([
	    { country: 'UK', city: 'London', population: 10000000 },
	    { country: 'UK', city: 'Edinburgh', population: 800000 },
	    { country: 'USA', city: 'New York', population: 12000000 }
	]);
    });
    it("should work with 2N", function() {
	expect(Array.from(flattenOneToN(
	    [
		{ country: "UK",
		  cities: [
		      { city: "London", population: 10000000 },
		      { city: "Edinburgh", population: 800000 } ],
		  counties: [
		      { county: "Kent" },
		      { county: "Buckinghamshire" },
		      { county: "Warwickshire" },
		      { county: "Yorkshire" }
		  ]
		} 
	    ]
	))).to.eql([
            { "city": "London", "country": "UK", "county": "Kent", "population": 10000000 },
            { "city": "London", "country": "UK", "county": "Buckinghamshire", "population": 10000000 },
            { "city": "London", "country": "UK", "county": "Warwickshire", "population": 10000000 },
            { "city": "London", "country": "UK", "county": "Yorkshire", "population": 10000000 },
            { "city": "Edinburgh", "country": "UK", "county": "Kent", "population": 800000 },
            { "city": "Edinburgh", "country": "UK", "county": "Buckinghamshire", "population": 800000 },
            { "city": "Edinburgh", "country": "UK", "county": "Warwickshire", "population": 800000 },
            { "city": "Edinburgh", "country": "UK", "county": "Yorkshire", "population": 800000 }
	]);
    });
    it("should work with 2N, two explicit n-fields", function() {
	expect(Array.from(flattenOneToN(
	    [
		{ country: "UK",
		  cities: [
		      { city: "London", population: 10000000 },
		      { city: "Edinburgh", population: 800000 } ],
		  counties: [
		      { county: "Kent" },
		      { county: "Buckinghamshire" },
		      { county: "Warwickshire" },
		      { county: "Yorkshire" }
		  ]
		} 
	    ],
	    ["cities", "counties"]
	))).to.eql([
            { "city": "London", "country": "UK", "county": "Kent", "population": 10000000 },
            { "city": "London", "country": "UK", "county": "Buckinghamshire", "population": 10000000 },
            { "city": "London", "country": "UK", "county": "Warwickshire", "population": 10000000 },
            { "city": "London", "country": "UK", "county": "Yorkshire", "population": 10000000 },
            { "city": "Edinburgh", "country": "UK", "county": "Kent", "population": 800000 },
            { "city": "Edinburgh", "country": "UK", "county": "Buckinghamshire", "population": 800000 },
            { "city": "Edinburgh", "country": "UK", "county": "Warwickshire", "population": 800000 },
            { "city": "Edinburgh", "country": "UK", "county": "Yorkshire", "population": 800000 }
	]);
    });
    it("should work with 2N, one explicit n-field", function() {
	expect(Array.from(flattenOneToN(
	    [
		{ country: "UK",
		  cities: [
		      { city: "London", population: 10000000 },
		      { city: "Edinburgh", population: 800000 } ],
		  counties: [
		      { county: "Kent" },
		      { county: "Buckinghamshire" }
		  ]
		} 
	    ],
	    ["cities"]
	))).to.eql([
            { "city": "London", "country": "UK",  "population": 10000000, counties: [
		{ county: "Kent" },
		{ county: "Buckinghamshire" }
	    ] },
            { "city": "Edinburgh", "country": "UK", "population": 800000, counties: [
		{ county: "Kent" },
		{ county: "Buckinghamshire" }
	    ] }
	]);
    });
});
