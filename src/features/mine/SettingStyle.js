
import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  mainView: {
    marginTop: 16,
    borderTopColor: '#DFDFDF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DFDFDF',
    borderBottomWidth: StyleSheet.hairlineWidth,

  },


  itemWrapper: {
    paddingLeft: 12,
    backgroundColor: '#FDFDFD'
  },
  itemView: {
    height: 60,
    backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DFDFDF',
    paddingLeft: 10,
  },
  timesBtn: {
    width: 36,
    height: 34,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DFDFDF',
  },
  times: {
    width: 26,
    height: 34,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#DFDFDF',
  },
  subBtn: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  plusBtn: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  version: {
    width: "100%",
    position: 'absolute',
    bottom: 30,
  }
})
export default styles