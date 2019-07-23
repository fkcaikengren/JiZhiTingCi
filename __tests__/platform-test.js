
const diff = require('jest-diff');

test('visualizing changes in data', ()=>{

    const a = {a: {b: {c: 5}}};
    const b = {a: {b: {c: 5}}};
    const result = diff(a, b);   //比较a,b 的区别
    // print diff ，如果有区别打印，没区别不打印
    console.log(result);
})