import VocaGroupDao from './VocaGroupDao'
import {
  COMMAND_GROUP_CREATE,
  COMMAND_GROUP_DELETE,
  COMMAND_GROUP_SET_DEFAULT,
  COMMAND_GROUP_MODIFY_NAME,
  COMMAND_GROUP_ADD_WORDS,
  COMMAND_GROUP_REMOVE_WORDS
}
  from "../../../common/constant";


export default class VocaGroupService {
  constructor() {
    this.vgDao = VocaGroupDao.getInstance();
  }

  /**
    * @description 通过id获取生词本详情
    * @memberof VocaGroupService
    */
  getGroupById = (id) => {
    return this.vgDao.getGroupById(id)
  }

  /**
   * @description 通过名字获取生词本详情
   * @memberof VocaGroupService
   */
  getGroupByName = (groupName) => {
    return this.vgDao.getGroupByName(groupName)
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
        createTime: vg.createTime,
        isDefault: vg.isDefault
      }
    }
    return vocaGroupsObj
  }

  /**
   * @description 添加生词本
   * @memberof VocaGroupService
   */
  addGroup = (addName) => {
    const group = this.vgDao.addGroup(addName)
    //添加到未同步池
    Storage.save({
      key: 'notSyncGroups',
      id: COMMAND_GROUP_CREATE.split('_').join('-') + group.id,
      data: {
        command: COMMAND_GROUP_CREATE,
        data: group
      }
    })
    return group.id
  }

  /**
   * @description 修改生词本名称
   * @memberof VocaGroupService
   */
  updateGroupName = (selectedName, updateName) => {
    const group = this.vgDao.updateGroupName(selectedName, updateName);
    //添加到未同步池
    Storage.save({
      key: 'notSyncGroups',
      id: COMMAND_GROUP_MODIFY_NAME.split('_').join('-') + group.id,
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
   * @description 删除生词本
   * @memberof VocaGroupService
   */
  deleteGroup = (groupId) => {
    const id = this.vgDao.deleteGroup(groupId)
    Storage.save({
      key: 'notSyncGroups',
      id: COMMAND_GROUP_DELETE.split('_').join('-') + id,
      data: {
        command: COMMAND_GROUP_DELETE,
        data: {
          id
        }
      }
    })
    return id
  }

  /**
   * @description 设置为默认生词本
   * @memberof VocaGroupService
   */
  updateToDefault = (groupId) => {
    const id = this.vgDao.updateToDefault(groupId)
    Storage.save({
      key: 'notSyncGroups',
      id: COMMAND_GROUP_SET_DEFAULT.split('_').join('-') + id,
      data: {
        command: COMMAND_GROUP_SET_DEFAULT,
        data: {
          id
        }
      }
    })
  }

  /**
   * @description 是否是默认生词本
   * @memberof VocaGroupService
   */
  isDefault = (groupId) => {
    return this.vgDao.isDefault(groupId)
  }

  /**
   * @description 是否存在于默认生词本
   * @memberof VocaGroupService
   */
  isExistInDefault = (word) => {
    return this.vgDao.isExistInDefault(word)
  }

  addWordToDefault = (groupWord) => {
    const result = this.vgDao.addWordToDefault(groupWord)
    Storage.save({
      key: 'notSyncGroups',
      id: COMMAND_GROUP_ADD_WORDS.split('_').join('-') + result.groupId + Date.now(),
      data: {
        command: COMMAND_GROUP_ADD_WORDS,
        data: {
          groupId: result.groupId,
          words: [{ word: result.addWord, isHidden: false }]
        }
      }
    })

    return true
  }

  /**
   * @description 移除生词
   * @memberof VocaGroupService
   */
  removeWordFromDefault = (groupWord) => {
    const result = this.vgDao.removeWordFromDefault(groupWord)
    Storage.save({
      key: 'notSyncGroups',
      id: COMMAND_GROUP_REMOVE_WORDS.split('_').join('-') + result.groupId + Date.now(),
      data: {
        command: COMMAND_GROUP_REMOVE_WORDS,
        data: {
          groupId: result.groupId,
          words: [result.deleteWord]
        }
      }
    })
    return true
  }


  deleteWords = (groupId, words) => {
    const result = this.vgDao.deleteWords(groupId, words)
    Storage.save({
      key: 'notSyncGroups',
      id: COMMAND_GROUP_REMOVE_WORDS.split('_').join('-') + result.groupId + Date.now(),
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

}