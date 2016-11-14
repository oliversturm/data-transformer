# data-transformer.js

library bah bah

# API Reference

<a name="module_data-transformer"></a>

## data-transformer
A module of data transformation helpers.


* [data-transformer](#module_data-transformer)
    * [.map(iterator, source)](#module_data-transformer.map) ⇒ <code>iterable</code>
    * [.fold(reducer, initialValue, source)](#module_data-transformer.fold) ⇒ <code>value</code>
    * [.iterableOfIterablesToObjects(source, fieldNames, fieldPrefix)](#module_data-transformer.iterableOfIterablesToObjects) ⇒ <code>iterable</code>

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

