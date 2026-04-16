// LocalStorage存储操作

class LocalStorageStore {
  constructor() {
    this.prefix = 'puzzleGuessGame_';
  }

  // 生成带前缀的键
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  // 保存数据
  save(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(this.getKey(key), jsonData);
      return true;
    } catch (error) {
      console.error('LocalStorage保存失败:', error);
      return false;
    }
  }

  // 获取数据
  get(key) {
    try {
      const jsonData = localStorage.getItem(this.getKey(key));
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('LocalStorage获取失败:', error);
      return null;
    }
  }

  // 删除数据
  remove(key) {
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('LocalStorage删除失败:', error);
      return false;
    }
  }

  // 清空所有数据
  clear() {
    try {
      // 只清除带前缀的数据
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      }
      return true;
    } catch (error) {
      console.error('LocalStorage清空失败:', error);
      return false;
    }
  }

  // 保存用户信息
  saveUser(user) {
    return this.save('user', user);
  }

  // 获取用户信息
  getUser() {
    return this.get('user');
  }

  // 保存游戏进度
  saveGameProgress(userId, progress) {
    // 将进度按用户存储
    const allProgress = this.get('gameProgressAll') || {};
    allProgress[userId] = progress;
    return this.save('gameProgressAll', allProgress);
  }

  // 获取游戏进度
  getGameProgress(userId) {
    const allProgress = this.get('gameProgressAll') || {};
    return allProgress[userId] || null;
  }

  // 保存成就
  saveAchievements(achievements) {
    return this.save('achievements', achievements);
  }

  // 获取成就
  getAchievements() {
    return this.get('achievements') || [];
  }

  // 添加成就
  addAchievement(achievement) {
    const achievements = this.getAchievements();
    achievements.push(achievement);
    return this.saveAchievements(achievements);
  }
}

// 导出单例
export default new LocalStorageStore();