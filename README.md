# data-transformer.js

**data-transformer.js** supplies assorted helper functions to facilitate transformations of data structures. It utilizes iterables for lazy evaluation behavior of data sequences. 

## Installation

### npm

```
npm install data-transformer
```

### bower

```
bower install data-transformer
```

## Usage

**data-transformer.js** relies on iterable support. It is built using Babel's regeneratorRuntime, so babel-polyfill is a requirement to use **data-transformer.js**.

### Using ES6

```javascript
import "babel-polyfill";
import {
    iterableOfIterablesToObjects,
    map,
    fold,
    flattenOneToN
} from "data-transformer";

console.log(Array.from(map(x => x * x, [1, 2, 3])));
```

### Without ES6

```javascript
require("babel-polyfill");
var dataTransformer = require("data-transformer");

console.log(Array.from(dataTransformer.map(function(x) { return x * x; }, [1, 2, 3])));
```

### In the browser

You can include both babel-polyfill and data-transformer directly from the bower_components directory:

```html
<html>
  <head>
    <script src="bower_components/babel-polyfill/browser-polyfill.js"></script>
    <script src="bower_components/data-transformer/dist/data-transformer-browser.js"></script>
  </head>
  <body>
    <div id="output"></div>
    <script>
      (function() {
      var result = Array.from(dataTransformer.map(function(x) { return x * x; }, [1, 2, 3]));
      document.getElementById("output").textContent = result;
      })();
    </script>
  </body>
</html>
```

## Examples

**Note that many the examples below show the use of the `Array.from` helper to convert resulting iterables to arrays. To preserve lazy evaluation behavior of the sequences, you should only convert iterables to arrays if necessary, and generally this should be done as late as possible.**


### map

**map** applies a function sequentially to elements of a source iterable and yields the result of each call.

Call map like this:

```javascript
Array.from(map(x => x * 2, [1, 2]))

[2, 4]
```

You can obtain the index of the element in the source sequence:

```javascript
Array.from(map((x, index) => x * i, [1, 2]))

[0, 2]
```

Since map works with iterables, your input data doesn't have to be an array:

```javascript
Array.from(map(x => x * x, (function*() => yield 3)()))

[9]
```

Any iterable data type is supported:

```javascript
Array.from(map(x=> x + x, "hello"))

["hh", "ee", "ll", "ll", "oo"]
```

### fold

**fold** aggregates values in a sequence using a reducer function and a starting value. It assumes an iterable as a source sequence, the behavior is unsurprising.

```javascript
fold((r, v) => r + v, 0, [1, 2, 3])

6
```

Indices can be obtained using a third parameter on the reducer:

```javascript
fold((r, v, i) => r + v * i, 0, [1, 2, 3])

8
```

### iterableOfIterablesToObjects

Assuming this source array of arrays:

```javascript
const source = [[1, 2], ["one", "two"]];
```

You can pass in the names for fields expected in the result objects:

```javascript
Array.from(iterableOfIterablesToObjects(source, ["one", "two"]))

[ { one: 1, two: 2 }, { one: "one", two: "two" } ]
```

If you don't pass in enough field names, they are generated automatically:

```javascript
Array.from(iterableOfIterablesToObjects(source))

[ { field0: 1, field1: 2 }, { field0: "one", field1: "two" } ]

Array.from(iterableOfIterablesToObjects(source, ["one"]))

[ { one: 1, field1: 2 }, { one: "one", field1: "two" } ]
```

To use a different field prefix instead of the standard "field", pass it as a third parameter:

```javascript
Array.from(iterableOfIterablesToObjects(source, [], "xxx"))

[ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]
```

Alternatively, pass a function that generates a field prefix, or generates a full field name and skips automatic field numbering:

```javascript
Array.from(iterableOfIterablesToObjects(source, [], () => "xxx"))

[ { xxx0: 1, xxx1: 2 }, { xxx0: "one", xxx1: "two" } ]

Array.from(iterableOfIterablesToObjects(source, [], (a, ai, v, vi) => 
    ({ prefix: "i" + ai + "-f" + (vi + 1), skipNumbering: true })))
	
[ { "i0-f1": 1, "i0-f2": 2 }, { "i1-f1": "one", "i1-f2": "two" } ]
```

Since input values don't have to be arrays, you can also use any other iterable data type:

```javascript
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

In a 1-N data structure, the top-level sequence is assumed to contain objects which have one or more properties that refer to sub-sequences. We call these fields "n-fields". They can either be auto-detected or specified manually.

#### Auto-detection

Assuming a 1-N structure of completely fictitious data, a simple call to **flattenOneToN** returns a flat data structure:

```javascript
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
  { country: "UK", city: "London", population: 10000000 },
  { country: "UK", city: "Edinburgh", population: 800000 },
  { country: "USA", city: "New York", population: 12000000 }
]
```

If there are several n-fields in the source objects, the resulting sequence contains permutations:

```javascript
Array.from(flattenOneToN([
  { country: "UK",
    cities: [
      { city: "London", population: 10000000 },
      { city: "Edinburgh", population: 800000 } ],
    counties: [
      { county: "Kent" },
      { county: "Buckinghamshire" },
      { county: "Warwickshire" },
      { county: "Yorkshire" } ]
  } 
]))
	
[
  { "city": "London", "country": "UK", "county": "Kent", "population": 10000000 },
  { "city": "London", "country": "UK", "county": "Buckinghamshire", "population": 10000000 },
  { "city": "London", "country": "UK", "county": "Warwickshire", "population": 10000000 },
  { "city": "London", "country": "UK", "county": "Yorkshire", "population": 10000000 },
  { "city": "Edinburgh", "country": "UK", "county": "Kent", "population": 800000 },
  { "city": "Edinburgh", "country": "UK", "county": "Buckinghamshire", "population": 800000 },
  { "city": "Edinburgh", "country": "UK", "county": "Warwickshire", "population": 800000 },
  { "city": "Edinburgh", "country": "UK", "county": "Yorkshire", "population": 800000 }
]
```

By default, the auto-detection of n-fields is performed once, using the first element of the top-level sequence. If the sequence contains objects with varying n-fields, you can run auto-detection for each object separately.

**Note:** This example also shows the handling of sub-sequences that use primitive types. These are projected to the result set using the sub-sequence name as a field name.

```javascript
Array.from(flattenOneToN([
  {
    order: "12345",
    productIds: [7, 8, 9]
  },
  {
    order: "87463",
    remoteRefs: ["one", "two", "three"]
  }
], undefined, {
  perSourceObject: true
}))

[
  { order: '12345', productIds: 7 },
  { order: '12345', productIds: 8 },
  { order: '12345', productIds: 9 },
  { order: '87463', remoteRefs: 'one' },
  { order: '87463', remoteRefs: 'two' },
  { order: '87463', remoteRefs: 'three' } 
]
```

It is possible to override the standard auto-detection mechanism for n-fields by passing a function. This works for both per-object detection (in the following sample) or one-time detection.

```javascript
Array.from(flattenOneToN([
  {
    type: "order",
    orderId: "987987",
    productIds: [7, 8]
  },
  {
    type: "delivery",
    deliveryId: "432141",
    deliveryRefs: ["one", "two"]
  }], undefined, {
    perSourceObject: true,
    dynamicDetector: o => {
      if (o.type === "order") {
        return ["productIds"];			
      }
      else if (o.type === "delivery") {
        return ["deliveryRefs"];
      }
      else {
        return [];
      }
    }
  }))
  
[
  { type: "order", orderId: '987987', productIds: 7 },
  { type: "order", orderId: '987987', productIds: 8 },
  { type: "delivery", deliveryId: '432141', deliveryRefs: "one" },
  { type: "delivery", deliveryId: '432141', deliveryRefs: "two" } 
]
```


#### Manual n-fields

Instead of relying on the automatic detection of n-fields, you can pass in their names explicitly. If there are fields that would automatically be recognized as n-fields but are excluded explicitly, they will become part of the result objects without flattening:

```javascript
Array.from(flattenOneToN([
  { country: "UK",
    cities: [
      { city: "London", population: 10000000 },
      { city: "Edinburgh", population: 800000 } ],
    counties: [
      { county: "Kent" },
      { county: "Buckinghamshire" } ]
  } ],
["cities"]))

[
  { "city": "London", "country": "UK",  "population": 10000000, counties: [
    { county: "Kent" },
    { county: "Buckinghamshire" }
  ] },
  { "city": "Edinburgh", "country": "UK", "population": 800000, counties: [
    { county: "Kent" },
    { county: "Buckinghamshire" }
  ] }
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
    * [.flattenOneToN(source, nFields, nFieldHandling)](#module_data-transformer.flattenOneToN) ⇒ <code>iterable</code>

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

### data-transformer.flattenOneToN(source, nFields, nFieldHandling) ⇒ <code>iterable</code>
flattenOneToN is a generator function that accepts a **source** parameter, which is expected to be an iterable yielding objects that include other iterables in their fields. These fields are called n-fields and a list of such n-fields can be passed in the **nFields** parameter. If no n-field names are passed, n-fields will be auto-detected. **flattenOneToN** returns a sequence of objects composed of all fields from the **source** objects, plus the fields from objects referred to by iterable n-fields.

**Kind**: static method of <code>[data-transformer](#module_data-transformer)</code>  
**Returns**: <code>iterable</code> - An iterable sequence of result objects. These objects contain all fields found in the **source** sequence objects with the exception of those declared as n-fields. In addition, the objects contain all fields from the sub-iterable objects of the n-fields. If there is more than one n-field, the sequence contains objects reflecting all permutations of the n-field sub-iterable combinations.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>iterable</code> | The source iterable, the "one" part of a 1-to-N data structure |
| nFields | <code>array</code> | fields of the **source** objects that should be projected to the result set. Default values is `[]`. N-fields are auto-detected if none are provided for this parameter. |
| nFieldHandling | <code>object</code> | Defines how n-field detection works. Default value is `{ perSourceObject: false, dynamicDetector: undefined }`, and n-field auto-detection is performed by analyzing the first object yielded by the **source** sequence. **dynamicDetector** can be set to a function that handles n-field detection instead of the built-in algorithm, and if **perSourceObject** is true, detection will be performed for each object instead of once for the sequence (this works both with the built-in detection algorithm and with a custom one). |

