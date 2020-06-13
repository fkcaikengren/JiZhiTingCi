import { retry } from "redux-saga/effects";



export default class ReadUtil {

  static strMapToObj = (strMap) => {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
      obj[k] = v;
    }
    return obj;
  }

  static getOptionObj = (options, no) => {
    for (let o of options) {
      if (o.no === no)
        return o
    }
    return {}
  }

  static letterToIndex = (letter) => {
    switch (letter) {
      case 'A':
        return 0
      case 'a':
        return 0

      case 'B':
        return 1
      case 'b':
        return 1

      case 'C':
        return 2
      case 'c':
        return 2

      case 'D':
        return 3
      case 'd':
        return 3
      default:
        return -1
    }
  }


}