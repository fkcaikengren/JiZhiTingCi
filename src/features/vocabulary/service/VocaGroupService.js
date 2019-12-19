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
   * @description 获取生词本详情
   * @memberof VocaGroupService
   */
  getGroup = (groupName)=>{
    return this.vgDao.getGroup(groupName)
  }

  /**
   * @description 获取所有生词本
   * @memberof VocaGroupService
   */
  getAllGroups = () => {
    const vocaGroups = this.vgDao.getAllGroups();
    console.log('all groups:')
    console.log(vocaGroups.length)
    if (vocaGroups.length == 0) {
      this.vgDao.addGroup('默认生词本')
      this.vgDao.updateToDefault('默认生词本')
    }
    return vocaGroups
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
  deleteGroup = (deleteName) => {
    const id = this.vgDao.deleteGroup(deleteName)
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
  }

  /**
   * @description 设置为默认生词本
   * @memberof VocaGroupService
   */
  updateToDefault = (groupName) => {
    const id = this.vgDao.updateToDefault(groupName)
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
  isDefault = (groupName) => {
    return this.vgDao.isDefault(groupName)
  }

  /**
   * @description 是否存在于默认生词本
   * @memberof VocaGroupService
   */
  isExistInDefault = (word)=>{
    return this.vgDao.isExistInDefault(word)
  }

  addWordToDefault = (groupWord)=>{
    const result = this.vgDao.addWordToDefault(groupWord)
    Storage.save({
      key:'notSyncGroups',
      id:COMMAND_GROUP_ADD_WORDS.split('_').join('-')+result.groupId+Date.now(),
      data:{
        command:COMMAND_GROUP_ADD_WORDS,
        data:{
          groupId:result.groupId,
          words:[{word:result.addWord,isHidden:false}]
        }
      }
    })

    return true
  }

  /**
   * @description 移除生词
   * @memberof VocaGroupService
   */
  removeWordFromDefault = (groupWord) =>{
    const result = this.vgDao.removeWordFromDefault(groupWord)
    Storage.save({
      key:'notSyncGroups',
      id:COMMAND_GROUP_REMOVE_WORDS.split('_').join('-')+result.groupId+Date.now(),
      data:{
        command:COMMAND_GROUP_REMOVE_WORDS,
        data:{
          groupId:result.groupId,
          words:[result.deleteWord]
        }
      }
    })
    return true
  }


  deleteWords = (groupName, words) =>{
    const result = this.vgDao.deleteWords(groupName,words)
    Storage.save({
      key:'notSyncGroups',
      id:COMMAND_GROUP_REMOVE_WORDS.split('_').join('-')+result.groupId+Date.now(),
      data:{
        command:COMMAND_GROUP_REMOVE_WORDS,
        data:{
          groupId:result.groupId,
          words:result.deletedWords
        }
      }
    })
    return result
  }

}