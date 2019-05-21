import { createIconSet } from 'react-native-vector-icons';

//字符串映射表
const glyphMap = require('./AliIcon.json');


const AliIcon =createIconSet(glyphMap,'AliIcon', 'AliIcons.ttf');


export default AliIcon;