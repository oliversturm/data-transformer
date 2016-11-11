
function* map(iterator, source) {
    let index = 0;

    for (let v of source) {
	yield iterator(v, index++);	
    }
}

// Hm... if Babel ever gets working tail call optimization, this might be nice.
// function foldRecursive(reducer, initialValue, source) {
//     const iterator = source[Symbol.iterator]();
//     function fold_(r, v, xs, i) {
// 	const x = xs.next();
// 	return x.done ?
// 	    v : fold_(r, r(v, x.value, i), xs, i + 1);
//     }
//     return fold_(reducer, initialValue, iterator, 0);    
// }

function fold(reducer, initialValue, source) { 
    let r = initialValue;
    let i = 0;
    
    for (let x of source){
	r = reducer(r, x, i++);
    }

    return r;
}


function* transformArrayOfArrays(source, fieldNames = [], fieldPrefix = "field") {
    const defaultName = (a, ai, v, vi) => {
	let prefix = fieldPrefix;
	let skipNumbering = false;
	if (typeof fieldPrefix === "function") {
	    let r = fieldPrefix(a, ai, v, vi);
	    if (typeof r === "object") {
		prefix = r.prefix;
		if (r.skipNumbering) {
		    skipNumbering = r.skipNumbering;
		}
	    }
	    else {
		prefix = r;
	    }
	}
	return prefix + (skipNumbering ? "" : vi);
    };
    
    yield* map((a, ai) => {
	return fold((r, v, vi) => {
	    r[vi < fieldNames.length ? fieldNames[vi] : defaultName(a, ai, v, vi)] = v;
	    return r;
	}, {}, a);
    }, source);
}

function flattenOneToN(data, nFields = [], detectNfields = true) {
    function* findNfields(o) {
	for (let field in o) {
	    if (typeof o[field][Symbol.iterator] === "function"){
		yield field;
	    }
	}
    }
    
    let actualNfields = (() => {
	if (nFields === [] && detectNfields && data.length > 0) {
	    return (typeof detectNfields === "function") ?
		detectNfields(data) : findNfields(data[0]);
	}
	else {
	    return nFields;	    
	}
    })();
    
    
}

/*
// Not in use yet
function transformData(data) {
  return data.map(p => 
    p.values.map(v => ({
      place: p.place, month: v.month, degreesC: v.degreesC
    }))).reduce((r, v) => r.concat(v));
}

function flattenOneToN(data, nFields = []) {
    return data.map(d =>
		    {});
    
		   }

var people = [
    { name: "Oli",
      phones: [
	  { country: "UK", number: "879879" },
	  { country: "US", number: "13123" }
      ],
      addresses: [
	  { city: "London", postCode: "AB34 7EF" },
	  { city: "Los Angeles", postCode: "98743" }
      ]
    }
];

*/

export {
    transformArrayOfArrays,
    map,
    fold
};

