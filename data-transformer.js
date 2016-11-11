/**
 * A module of data transformation helpers.
 * @module data-transformer
 */

/**
 * map is a generator function that accepts an iterable **source** parameter and an **iterator** function. It iterates the source and applies the iterator to each element, yielding the results.
 * @param {function} iterator - The iterator function to apply to each element of **source**
 * @param {iterable} source - The source iterable that will be iterated
 */
export function* map(iterator, source) {
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

export function fold(reducer, initialValue, source) { 
    let r = initialValue;
    let i = 0;
    
    for (let x of source){
	r = reducer(r, x, i++);
    }

    return r;
}

/**
 * This is the transformArrayOfArrays function
 */
export function* transformArrayOfArrays(source, fieldNames = [], fieldPrefix = "field") {
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

export function* flattenOneToN(data, nFields = [], detectNfields = true) {
    function* findNfields(o) {
	for (let field in o) {
	    if (typeof o[field] != "string" && typeof o[field][Symbol.iterator] === "function"){
		yield field;
	    }
	}
    }

    let actualNfields = Array.from((() => {
	if (nFields.length == 0 && detectNfields) {
	    const { value: firstValue, done } = data[Symbol.iterator]().next();
	    if (!done) {
		return (typeof detectNfields === "function") ?
		    detectNfields(firstValue) : findNfields(firstValue);
	    }
	}

	return nFields;	    
    })());

    function copyFields(source, target, exclusions=[]) {
	for (let f in source) {
	    if (! exclusions.includes(f)) {
		target[f] = source[f];
	    }
	}
	return target;
    }

    function cloneObject(source) {
	return copyFields(source, {});
    }
    
    for (let d of data) {
	let o = copyFields(d, {}, actualNfields);
	
	function* recurse(fieldIndex, o) {
	    if (actualNfields.length - fieldIndex < 1) {
		return;
	    }
	    
	    const myList = d[actualNfields[fieldIndex]];
	    if (myList.length > 0) {
		const originalO = cloneObject(o);
		
		for (let value of d[actualNfields[fieldIndex]]) {
		    let iterationO = cloneObject(originalO);
		    copyFields(value, iterationO);
		    
		    yield* recurse(fieldIndex + 1, iterationO);
		    if (fieldIndex === actualNfields.length - 1){
			yield iterationO;
		    }
		}
	    }
	    else {
		yield* recurse(fieldIndex + 1, o);
		if (fieldIndex === actualNfields.length - 1){
		    yield o;
		}
	    }
	}

	if (actualNfields.length > 0){
	    yield* recurse(0, o);
	}
	else {
	    yield o;
	}
    }
}

/*export {
    transformArrayOfArrays,
    map,
    fold,
    flattenOneToN
};*/

