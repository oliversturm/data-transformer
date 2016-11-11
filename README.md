# data-transformer.js

library bah bah

# API Reference

<a name="module_data-transformer"></a>

## data-transformer
A module of data transformation helpers.


* [data-transformer](#module_data-transformer)
    * [.map(iterator, source)](#module_data-transformer.map)
    * [.transformArrayOfArrays()](#module_data-transformer.transformArrayOfArrays)

<a name="module_data-transformer.map"></a>

### data-transformer.map(iterator, source)
map is a generator function that accepts an iterable **source** parameter and an **iterator** function. It iterates the source and applies the iterator to each element, yielding the results.

**Kind**: static method of <code>[data-transformer](#module_data-transformer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| iterator | <code>function</code> | The iterator function to apply to each element of **source** |
| source | <code>iterable</code> | The source iterable that will be iterated |

<a name="module_data-transformer.transformArrayOfArrays"></a>

### data-transformer.transformArrayOfArrays()
This is the transformArrayOfArrays function

**Kind**: static method of <code>[data-transformer](#module_data-transformer)</code>  
