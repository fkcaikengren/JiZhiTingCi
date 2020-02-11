import VocaGroupDao from './VocaGroupDao'
import {
  COMMAND_GROUP_CREATE,
  COMMAND_GROUP_DELETE,
  COMMAND_GROUP_SET_DEFAULT,
  COMMAND_GROUP_MODIFY_NAME,
  COMMAND_GROUP_ADD_WORDS,
  COMMAND_GROUP_REMOVE_WORDS,

  COMMAND_GROUP_MODIFY_LISTEN_TIMES,
  COMMAND_GROUP_MODIFY_TEST_TIMES,
  COMMAND_GROUP_SORT
} from "../../../common/constant";
const uuidv4 = require('uuid/v4');

export default class VocaGroupService {
  constructor() {
    this.vgDao = VocaGroupDao.getInstance();
  }

  /**
     * 获取具体某生词本
     * @param id
     * @returns {any} 
     */
  getGroupById = (id) => {
    return this.vgDao.getGroupById(id)
  }
  /**
    * @description 通过id获取生词本详情
    * @memberof VocaGroupService
    */
  getGroupAndWordsById = (id) => {
    const vg = this.vgDao.getGroupById(id)
    const obj = {
      id: vg.id,
      groupName: vg.groupName,
      count: vg.count,
      isDefault: vg.isDefault,
      listenTimes: vg.listenTimes,
      testTimes: vg.testTimes,
      createTime: vg.createTime,
    }
    let words = []
    for (let section of vg.sections) {
      const sWords = section.words.map((w, _) => w.word)
      words = words.concat(sWords)
    }
    obj.words = words
    return obj
  }

  /**
   * @description 获取所有生词本
   * @memberof VocaGroupService
   */
  getAllGroups = () => {
    const vocaGroups = this.vgDao.getAllGroups();
    const vocaGroupsObj = {}
    for (let vg of vocaGroups) {
      vocaGroupsObj[vg.id] = {
        id: vg.id,
        groupName: vg.groupName,
        count: vg.count,
        isDefault: vg.isDefault,
        listenTimes: vg.listenTimes,
        testTimes: vg.testTimes,
        createTime: vg.createTime,
      }
    }
    return vocaGroupsObj
  }

  /**
   * @description 添加生词本
   */
  addGroup = async (addName) => {
    // 1.修改数据
    const group = this.vgDao.addGroup(addName)
    const groupOrdersString = await Storage.load({ key: 'groupOrdersString' })
    const oldOrders = JSON.parse(groupOrdersString)
    const newOrders = [...oldOrders, group.id]
    const groupOrdersData = JSON.stringify(newOrders)
    await Storage.save({
      key: 'groupOrdersString',
      data: groupOrdersData,
    })
    // 2.添加到未同步池
    await Storage.save({
      key: 'notSyncGroups',
      id: uuidv4(),
      data: {
        command: COMMAND_GROUP_CREATE,
        data: {
          vocaGroup: group,
          groupOrders: groupOrdersData
        }
      }
    })
    return newOrders
  }



  /**
   * @description 删除生词本
   */
  deleteGroup = async (groupId) => {
    // 1.修改数据
    const deleteId = this.vgDao.deleteGroup(groupId)
    const groupOrdersString = await Storage.load({ key: 'groupOrdersString' })
    const oldOrders = JSON.parse(groupOrdersString)
    const newOrders = oldOrders.filter((item, _) => {
      return !(deleteId === item)
    })
    const groupOrdersData = JSON.stringify(newOrders)
    await Storage.save({
      key: 'groupOrdersString',
      data: groupOrdersData,
    })
    // 2.添加到未同步池
    Storage.save({
      key: 'notSyncGroups',
      id: uuidv4(),
      data: {
        command: COMMAND_GROUP_DELETE,
        data: {
          id: deleteId,
          groupOrders: groupOrdersData
        }
      }
    })
    return newOrders
  }

  /**
   * @description 设置为默认生词本
   */
  updateToDefault = (groupId) => {
    const group = this.vgDao.modifyToDefault(groupId)
    Storage.save({
      key: 'notSyncGroups',
      id: uuidv4(),
      data: {
        command: COMMAND_GROUP_SET_DEFAULT,
        data: {
          id: group.id
        }
      }
    })
  }

  /**
   * @description 是否是默认生词本
   */
  isDefault = (groupId) => {
    return this.vgDao.isDefault(groupId)
  }

  /**
   * @description 是否存在于默认生词本
   */
  isExistInDefault = (word) => {
    return this.vgDao.isExistInDefault(word)
  }

  addWordToDefault = (groupWord) => {
    const result = this.vgDao.addWordToDefault(groupWord)
    Storage.save({
      key: 'notSyncGroups',
      id: uuidv4(),
      data: {
        command: COMMAND_GROUP_ADD_WORDS,
        data: {
          groupId: result.groupId,
          words: [{ word: result.addWord, isHidden: false }]
        }
      }
    })
    return result
  }

  /**
   * @description 移除生词
   */
  removeWordFromDefault = (groupWord) => {
    const result = this.vgDao.removeWordFromDefault(groupWord)
    Storage.save({
      key: 'notSyncGroups',
      id: uuidv4(),
      data: {
        command: COMMAND_GROUP_REMOVE_WORDS,
        data: {
          groupId: result.groupId,
          words: [result.deleteWord]
        }
      }
    })
    return result
  }


  /**
   * 删除生词本单词
   */
  deleteWords = (groupId, words) => {
    const result = this.vgDao.deleteWords(groupId, words)
    Storage.save({
      key: 'notSyncGroups',
      id: uuidv4(),
      data: {
        command: COMMAND_GROUP_REMOVE_WORDS,
        data: {
          groupId: result.groupId,
          words: result.deletedWords
        }
      }
    })
    return result
  }

  /**
   * @description 修改生词本名称
   */
  updateGroupName = async (selectedName, updateName) => {
    const group = this.vgDao.modifyGroupName(selectedName, updateName);
    //添加到未同步池
    await Storage.save({
      key: 'notSyncGroups',
      id: uuidv4(),
      data: {
        command: COMMAND_GROUP_MODIFY_NAME,
        data: {
          id: group.id,
          groupName: group.groupName
        }
      }
    })
  }


  /**
   * 修改生词本的listenTimes
   */
  updateListenTimes = async (id, listenTimes) => {
    const group = this.vgDao.modifyListenTimes(id, listenTimes)
    const saveKey = 'notSyncGroups'
    const saveId = COMMAND_GROUP_MODIFY_LISTEN_TIMES.split('_').join('-')
    //若存在则删除
    await Storage.remove({
      key: saveKey,
      id: saveId,
    })
    await Storage.save({
      key: saveKey,
      id: saveId,
      data: {
        data: {
          id: group.id,
          listenTimes: group.listenTimes
        },
        command: COMMAND_GROUP_MODIFY_LISTEN_TIMES
      }
    })

  }

  /**
   * 修改生词本的testTimes
   */
  updateTestTimes = async (id, testTimes) => {
    const group = this.vgDao.modifyTestTimes(id, testTimes)
    const saveKey = 'notSyncGroups'
    const saveId = COMMAND_GROUP_MODIFY_TEST_TIMES.split('_').join('-')
    //若存在则删除
    await Storage.remove({
      key: saveKey,
      id: saveId,
    })
    await Storage.save({
      key: saveKey,
      id: saveId,
      data: {
        data: {
          id: group.id,
          testTimes: group.testTimes
        },
        command: COMMAND_GROUP_MODIFY_TEST_TIMES
      }
    })
  }


  sortGroups = async (groupOrders) => {

    const groupOrdersData = JSON.stringify(groupOrders)
    const saveKey = 'notSyncGroups'
    const saveId = COMMAND_GROUP_SORT.split('_').join('-')

    //1.修改数据
    await Storage.save({
      key: 'groupOrdersString',
      data: groupOrdersData,
    })

    //2.添加到未同步池
    //若存在则删除
    await Storage.remove({
      key: saveKey,
      id: saveId,
    })
    await Storage.save({
      key: saveKey,
      id: saveId,
      data: {
        data: {
          groupOrders: groupOrdersData
        },
        command: COMMAND_GROUP_SORT
      }
    })
  }

}