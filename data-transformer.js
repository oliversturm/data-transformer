/**
 * A module of data transformation helpers.
 * @module data-transformer
 */

/**
 * map is a generator function that accepts an iterable **source** parameter and an **iterator** function. It iterates the source and applies the iterator to each element, yielding the results.
 * map implements the standard map function known from many functional environments, differing from standard JavaScript language implementations as well as those in lodash or underscore by accepting and returning iterators.
 * @param {function(element, index)} iterator - The iterator function to apply to each element of **source**. For compatibility with other implementations, an index is passed as a second parameter. The **iterator** is expected to return the result of mapping the given element.
 * @param {iterable} source - The source iterable that will be iterated
 * @return {iterable} The iterable sequence of mapped values
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

/**
 * fold accepts an iterable **source** parameter, a **reducer** function and an **initialValue** for the reduction. It iterates the source and applies the **reducer** sequentially to the values of the sequence, passing in the result from the previous reduction to each new **reducer** call. This function is similar to the standard **reduce** function on JavaScript arrays, and to reduce and fold implementations in various libraries. It is supplied here to eliminate dependencies for data-transformer.js, and to supply an implementation that works with iterables as input.
* @param {function(result, value, index)} reducer - The reducer function that is called for each value from the source sequence. The result parameter receives **initialValue** on first call, afterwards the result from the previous reduction. An index is also passed for compatibility with other implementations. The **reducer** is expected to return the result of the value reduction step.
* @param {value} initialValue - The value used for **result** in the first call to **reducer**
* @param {iterable} source - The source iterable that will be iterated
* @return {value} The result returned by the final call to **reducer**
*/
export function fold(reducer, initialValue, source) { 
    let r = initialValue;
    let i = 0;
    
    for (let x of source){
	r = reducer(r, x, i++);
    }

    return r;
}

/**
 * iterableOfIterablesToObjects is a generator function that accepts a **source** parameter, which is expected to be an iterable containing other iterables. The outer iterable is iterated and each of the sub-iterables is converted into an object. The field names for this object can be passed in the parameter **fieldNames** and are applied sequentially to the data found in the sub-iterables. If fewer fieldNames are given then there are values in a given sub-iterable, field names for further values are generated automatically, by default using the **fieldPrefix** and a sequential number for the field position. **fieldPrefix** can also be a function, in which case it is invoked as a callback expected to return a field name.
 * @param {iterable} source - The source iterable that will be iterated
 * @param {array} fieldNames - Field names for elements of the sub-iterables. Default value: `[]`
 * @param {string | function} fieldPrefix - Defines the field name prefix used for generated field names, if there are fewer field names given in **fieldNames** than there are elements in a given sub-iterable. If the type of this parameter is `string`, it overrides the default field prefix of "field". 

If **fieldPrefix** is a function, it is called with four parameters when a field name needs to be generated: **(1)** the sub-iterable, **(2)** the index of the current sub-iterable in the top-level iterable, **(3)** the current element of the sub-iterable for which a field name is to be generated and **(4)** the index of the current element of the sub-iterable. 

A **fieldPrefix** function is expected to return either a `string` (the prefix) or an object of this structure: `{ prefix: string, skipNumbering: bool }`. If `skipNumbering` is true, no field position indicator is appended to the `prefix`.
 * @return {iterable} The iterable sequence of generated objects
 */
export function* iterableOfIterablesToObjects(source, fieldNames = [], fieldPrefix = "field") {
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
