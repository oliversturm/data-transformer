
function transformArrayOfArrays(source, ...names) {
  const defaultName = i => "field" + i;
  return source.map(a => {
     return a.reduce((r, v, i) => {
       r[i < names.length ? names[i] : defaultName(i)] = v;
       return r;
     }, {});
  });
}

export {
    transformArrayOfArrays
};

