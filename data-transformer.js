
function transformArrayOfArrays(source, fieldNames = [], fieldPrefix = "field") {
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
    
    return source.map((a, ai) => {
	return a.reduce((r, v, vi) => {
	    r[vi < fieldNames.length ? fieldNames[vi] : defaultName(a, ai, v, vi)] = v;
	    return r;
	}, {});
    });
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
    transformArrayOfArrays
};

