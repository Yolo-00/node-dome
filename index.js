// 分析是否排序
function change(array, comparator) {
  if (!Array.isArray(array)) return "not an array";
  function defaultComparator(a, b) {
    return a - b;
  }
  comparator = comparator || defaultComparator;
  for (let i = 0; i < array.length; i++) {
    if (comparator(array[i], array[i + 1]) > 0) return false;
  }

  return true;
}

console.log(change([1, 2, 3])); // true
console.log(change([2, 3, 1])); // false
console.log(
  change([3, 2, 1], function (a, b) {
    return b - a;
  })
); // true

// ***********

// 数组解耦
function Decoupling(array, data) {
  if (!Array.isArray(array)) return "not an array";
  for (let i = 0; i < array.length; i++) {
    Array.isArray(array[i]) ? Decoupling(array[i], data) : data.push(array[i]);
  }
  return data;
}

console.log(Decoupling([1, [2, 3], [4, [5, 6]]], [])); // [1, 2, 3, 4, 5, 6]

// 数组去重
function dedupe(array, hasher = JSON.stringify) {
  if (!Array.isArray(array)) return "not an array";
  const lookup = new Map();
  for (let i = 0; i < array.length; i++) {
    lookup.set(hasher(array[i]), array[i]);
  }
  return Array.from(lookup.values());
}

console.log(dedupe([{ a: 2 }, { a: 1 }, { a: 1 }, { a: 1 }])); // [1, 2, 3, 4, 5]
console.log(
  dedupe(
    [
      { a: 2, b: 1 },
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 1, b: 4 },
      { a: 3, b: 1 },
    ],
    (value) => value.a
  )
);

// 数组位置替换
function SomeArray(array, fo, to) {
  array[fo] = array.splice(to, 1, array[fo])[0];
  return array;
}

console.log(SomeArray([1, 2, 3, 4, 5], 0, 4)); // [5, 2, 3, 4, 1]


