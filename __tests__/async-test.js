
import 'react-native'
import React from 'react'
import axios from 'axios'


test('promise', () => {
    axios.get('http://rap2api.taobao.org/app/mock/167294/vocaBook/getAll')
        .then(res=>{
            console.log(res.data.data)
            expect(res).toEqual({});
        })
});


test('async await', async() => {
    try{
        const res = await axios.get('http://rap2api.taobao.org/app/mock/167294/vocaBook/getAll')
        console.log(res.data.data)
    }catch (e) {
        expect(e).toMatch('error');
    }
    

});


describe('matching cities to foods', () => {
    // Applies only to tests in this describe block
    beforeEach(() => {
        return initializeFoodDatabase();
    });

    test('Vienna <3 sausage', () => {
        expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
    });

    test('San Juan <3 plantains', () => {
        expect(isValidCityFoodPair('San Juan', 'Mofongo')).toBe(true);
    });
});