// 存储管理工具，根据浏览器支持情况选择合适的存储方式

import indexDBStore from './indexDB.js';
import localStorageStore from './localStorage.js';

class StoreManager {
  constructor() {
    this.store = null;
    this.init();
  }

  // 初始化存储方式
  async init() {
    // 检测浏览器是否支持IndexDB
    if ('indexedDB' in window) {
      try {
        await indexDBStore.init();
        this.store = indexDBStore;
        console.log('使用IndexDB存储');
      } catch (error) {
        console.error('IndexDB初始化失败，使用LocalStorage:', error);
        this.store = localStorageStore;
      }
    } else {
      console.log('浏览器不支持IndexDB，使用LocalStorage');
      this.store = localStorageStore;
    }
  }

  // 保存用户信息
  async saveUser(user) {
    if (this.store) {
      if (this.store.saveUser) {
        return this.store.saveUser(user);
      } else {
        return this.store.save('user', user);
      }
    }
    return false;
  }

  // 获取用户信息
  async getUser(userId) {
    if (this.store) {
      if (this.store.getUser) {
        return this.store.getUser(userId);
      } else {
        return this.store.get('user');
      }
    }
    return null;
  }

  // 保存游戏进度
  async saveGameProgress(userId, progress) {
    if (this.store) {
      if (this.store.saveGameProgress) {
        return this.store.saveGameProgress(userId, progress);
      } else {
        return this.store.save('gameProgress', progress);
      }
    }
    return false;
  }

  // 获取游戏进度
  async getGameProgress(userId) {
    if (this.store) {
      if (this.store.getGameProgress) {
        return this.store.getGameProgress(userId);
      } else {
        return this.store.get('gameProgress');
      }
    }
    return null;
  }

  // 保存成就
  async saveAchievement(achievement) {
    if (this.store) {
      if (this.store.saveAchievement) {
        return this.store.saveAchievement(achievement);
      } else if (this.store.addAchievement) {
        return this.store.addAchievement(achievement);
      }
    }
    return false;
  }

  // 获取用户成就
  async getUserAchievements(userId) {
    if (this.store) {
      if (this.store.getUserAchievements) {
        return this.store.getUserAchievements(userId);
      } else if (this.store.getAchievements) {
        return this.store.getAchievements();
      }
    }
    return [];
  }
}

// 导出单例
export default new StoreManager();