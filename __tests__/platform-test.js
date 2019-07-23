
const diff = require('jest-diff');
const getType = require('jest-get-type');

//比较数据
test('visualizing changes in data', ()=>{
    const a = {a: {b: {c: 5}}};
    const b = {a: {b: {c: 5}}};
    const result = diff(a, b);   //比较a,b 的区别
    // print diff ，如果有区别打印，没区别不打印
    console.log(result);
})


//判断类型
test('get type of data', ()=>{
    const array = [1, 2, 3];
    const nullValue = null;
    const undefinedValue = undefined;

// prints 'array'
    console.log(getType(array));
// prints 'null'
    console.log(getType(nullValue));
// prints 'undefined'
    console.log(getType(undefinedValue));
})

