# data-transformer.js

**data-transformer.js** supplies assorted helper functions to facilitate transformations of data structures. It utilizes iterables for lazy evaluation behavior of data sequences. 

## Installation

## Usage

## Examples

**Note that many the examples below show the use of the `Array.from` helper to convert resulting iterables to arrays. To preserve lazy evaluation behavior of the sequences, you should only convert iterables to arrays if necessary, and generally this should be done as late as possible.**


### map

**map** applies a function sequentially to elements of a source iterable and yields the result of each call.

Call map like this:

```
Array.from(map(x => x * 2, [1, 2]))

[2, 4]
```

You can obtain the index of the element in the source sequence:

```
Array.from(map((x, index) => x * i, [1, 2]))

[0, 2]
```

Since map works with iterables, your input data doesn't have to be an array:

```
Array.from(map(x => x * x, (function*() => yield 3)()))

[9]
```

Any iterable data type is supported:

```
Array.from(map(x=> x + x, "hello"))

["hh", "ee", "ll", "ll", "oo"]
```

### fold

**fold** aggregates values in a sequence using a reducer function and a starting value. It assumes an iterable as a source sequence, the behavior is unsurprising.

```
fold((r, v) => r + v, 0, [1, 2, 3])

6
```

Indices can be obtained using a third parameter on the reducer:

```
fold((r, v, i) => r + v * i, 0, [1, 2, 3])

8
```

### iterableOfIterablesToObjects

Assuming this source array of arrays:

```
const source = [[1, 2], ["one", "two"]];
```

You can pass in the names for fields expected in the result objects:

```
Array.from(iterableOfIterablesToObjects(source, ["one", "two"]))

[ { one: 1, two: 2 }, { one: "one", two: "two" } ]
```

If you don't pass in enough field names, they are generated automatically:

```
Array.from(iterableOfIterablesToObjects(source))

[ { field0: 1, field1: 2 }, { field0: "one", field1: "two" } ]

Array.from(iterableOfIterablesToObjects(source, ["one"]))

[ { one: 1, field1: 2 }, { one: "one", field1: "two" } ]
```

To use a different field prefix instead of the standard "field", pass it as a third parameter:

```
Array.from(iterableOfIterablesToObjects(source, [], "xxx"))

[ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]
```

Alternatively, pass a function that generates a field prefix, or generates a full field name and skips automatic field numbering:

```
Array.from(iterableOfIterablesToObjects(source, [], () => "xxx"))

[ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]

Array.from(iterableOfIterablesToObjects(source, [], (a, ai, v, vi) => 
    ({ prefix: "i" + ai + "-f" + (vi + 1), skipNumbering: true })))
	
[ { "i0-f1": 1, "i0-f2": 2 }, { "i1-f1": "one", "i1-f2": "two" } ]
```

Since input values don't have to be arrays, you can also use any other iterable data type:

```
function* innerIterable(x) {
    yield x * 3;
    yield x * 5;
}

function* outerIterable() {
    yield innerIterable(3);
    yield innerIterable(5);
}
    
Array.from(iterableOfIterablesToObjects(outerIterable()))

[ { field0: 9, field1: 15 }, { field0: 15, field1: 25 } ]
```



### flattenOneToN

Assuming a structure of completely fictitious data, a simple call to **flattenOneToN** returns a flat data structure:

```
const data = [
  { country: "UK",
    cities: [
      { city: "London", population: 10000000 },
      { city: "Edinburgh", population: 800000 } ] },
  { country: "USA",
    cities: [
      { city: "New York", population: 12000000 }] } 
]

Array.from(flattenOneToN(data))

[
  { country: 'UK', city: 'London', population: 10000000 },
  { country: 'UK', city: 'Edinburgh', population: 800000 },
  { country: 'USA', city: 'New York', population: 12000000 }
]
```




# API Reference

<a name="module_data-transformer"></a>

## data-transformer
A module of data transformation helpers.


* [data-transformer](#module_data-transformer)
    * [.map(iterator, source)](#module_data-transformer.map) ⇒ <code>iterable</code>
    * [.fold(reducer, initialValue, source)](#module_data-transformer.fold) ⇒ <code>value</code>
    * [.iterableOfIterablesToObjects(source, fieldNames, fieldPrefix)](#module_data-transformer.iterableOfIterablesToObjects) ⇒ <code>iterable</code>
    * [.flattenOneToN(source, nFields, detectNfields)](#module_data-transformer.flattenOneToN) ⇒ <code>iterable</code>

<a name="module_data-transformer.map"></a>

### data-transformer.map(iterator, source) ⇒ <code>iterable</code>
map is a generator function that accepts an iterable **source** parameter and an **iterator** function. It iterates the source and applies the iterator to each element, yielding the results.
map implements the standard map function known from many functional environments, differing from standard JavaScript language implementations as well as those in lodash or underscore by accepting and returning iterators.

**Kind**: static method of <code>[data-transformer](#module_data-transformer)</code>  
**Returns**: <code>iterable</code> - The iterable sequence of mapped values  

| Param | Type | Description |
| --- | --- | --- |
| iterator | <code>function</code> | The iterator function to apply to each element of **source**. For compatibility with other implementations, an index is passed as a second parameter. The **iterator** is expected to return the result of mapping the given element. |
| source | <code>iterable</code> | The source iterable that will be iterated |

<a name="module_data-transformer.fold"></a>

### data-transformer.fold(reducer, initialValue, source) ⇒ <code>value</code>
fold accepts an iterable **source** parameter, a **reducer** function and an **initialValue** for the reduction. It iterates the source and applies the **reducer** sequentially to the values of the sequence, passing in the result from the previous reduction to each new **reducer** call. This function is similar to the standard **reduce** function on JavaScript arrays, and to reduce and fold implementations in various libraries. It is supplied here to eliminate dependencies for data-transformer.js, and to supply an implementation that works with iterables as input.

**Kind**: static method of <code>[data-transformer](#module_data-transformer)</code>  
**Returns**: <code>value</code> - The result returned by the final call to **reducer**  

| Param | Type | Description |
| --- | --- | --- |
| reducer | <code>function</code> | The reducer function that is called for each value from the source sequence. The result parameter receives **initialValue** on first call, afterwards the result from the previous reduction. An index is also passed for compatibility with other implementations. The **reducer** is expected to return the result of the value reduction step. |
| initialValue | <code>value</code> | The value used for **result** in the first call to **reducer** |
| source | <code>iterable</code> | The source iterable that will be iterated |

<a name="module_data-transformer.iterableOfIterablesToObjects"></a>

### data-transformer.iterableOfIterablesToObjects(source, fieldNames, fieldPrefix) ⇒ <code>iterable</code>
iterableOfIterablesToObjects is a generator function that accepts a **source** parameter, which is expected to be an iterable containing other iterables. The outer iterable is iterated and each of the sub-iterables is converted into an object. The field names for this object can be passed in the parameter **fieldNames** and are applied sequentially to the data found in the sub-iterables. If fewer fieldNames are given then there are values in a given sub-iterable, field names for further values are generated automatically, by default using the **fieldPrefix** and a sequential number for the field position. **fieldPrefix** can also be a function, in which case it is invoked as a callback expected to return a field name.

**Kind**: static method of <code>[data-transformer](#module_data-transformer)</code>  
**Returns**: <code>iterable</code> - The iterable sequence of generated objects  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>iterable</code> | The source iterable that will be iterated |
| fieldNames | <code>array</code> | Field names for elements of the sub-iterables. Default value: `[]` |
| fieldPrefix | <code>string</code> &#124; <code>function</code> | Defines the field name prefix used for generated field names, if there are fewer field names given in **fieldNames** than there are elements in a given sub-iterable. If the type of this parameter is `string`, it overrides the default field prefix of "field".  If **fieldPrefix** is a function, it is called with four parameters when a field name needs to be generated: **(1)** the sub-iterable, **(2)** the index of the current sub-iterable in the top-level iterable, **(3)** the current element of the sub-iterable for which a field name is to be generated and **(4)** the index of the current element of the sub-iterable.  A **fieldPrefix** function is expected to return either a `string` (the prefix) or an object of this structure: `{ prefix: string, skipNumbering: bool }`. If `skipNumbering` is true, no field position indicator is appended to the `prefix`. |

<a name="module_data-transformer.flattenOneToN"></a>

### data-transformer.flattenOneToN(source, nFields, detectNfields) ⇒ <code>iterable</code>
flattenOneToN is a generator function that accepts a **source** parameter, which is expected to be an iterable yielding objects that include other iterables in their fields. These fields are called n-fields and a list of such n-fields can be passed in the **nFields** parameter. If no n-fields are passed and the **detectNfields** parameter is `true`, n-fields will be auto-detected in the first object yielded by the **source** sequence. **detectNfields** can also be a function, in which case it will be called to return a list of n-fields on the basis of the first **source** object. flattenOneToN returns a sequence of objects composed of all fields from the **source objects**, plus the fields from any iterable fields declared or detected as n-fields.

**Kind**: static method of <code>[data-transformer](#module_data-transformer)</code>  
**Returns**: <code>iterable</code> - An iterable sequence of result objects. These objects contain all fields found in the **source** sequence objects with the exception of those declared as n-fields. In addition, the objects contain all fields from the sub-iterable objects of the n-fields. If there is more than one n-field, the sequence contains objects reflecting all permutations of the n-field sub-iterable combinations.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>iterable</code> | The source iterable, the "one" part of a 1-to-N data structure |
| nFields | <code>array</code> | fields of the **source** objects that should be projected to the result set. Default values is `[]`. |
| detectNfields | <code>bool</code> &#124; <code>function</code> | If this is a `bool`, the value is `true` and **nFields** is empty, n-fields will be auto-detected. If this is a function (and **nFields** is empty), the function is called with a single parameter, the first object from the **source** sequence, and it is expected to return a list of n-fields. |

