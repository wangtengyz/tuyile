// IndexDB存储操作

class IndexDBStore {
  constructor() {
    this.dbName = 'puzzleGuessGame';
    this.dbVersion = 3;
    this.db = null;
  }

  // 初始化数据库
  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('IndexDB打开失败:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const transaction = event.target.transaction;

        // 创建用户表
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('username', 'username', { unique: false });
        }

        // 创建游戏进度表或升级现有表
        if (!db.objectStoreNames.contains('gameProgress')) {
          // 新建数据库：创建所有索引
          const progressStore = db.createObjectStore('gameProgress', { keyPath: 'userId' });
          progressStore.createIndex('unlockedLevel', 'unlockedLevel', { unique: false });
          progressStore.createIndex('correctAnswers', 'correctAnswers', { unique: false });
          progressStore.createIndex('consecutiveCorrect', 'consecutiveCorrect', { unique: false });
          progressStore.createIndex('resurrectionTime', 'resurrectionTime', { unique: false });
          progressStore.createIndex('lastPlayedAt', 'lastPlayedAt', { unique: false });
        } else if (event.oldVersion < 2) {
          // 升级现有数据库：添加新索引
          const progressStore = transaction.objectStore('gameProgress');

          // 添加新索引（如果不存在）
          if (!progressStore.indexNames.contains('unlockedLevel')) {
            progressStore.createIndex('unlockedLevel', 'unlockedLevel', { unique: false });
          }
          if (!progressStore.indexNames.contains('correctAnswers')) {
            progressStore.createIndex('correctAnswers', 'correctAnswers', { unique: false });
          }
          if (!progressStore.indexNames.contains('consecutiveCorrect')) {
            progressStore.createIndex('consecutiveCorrect', 'consecutiveCorrect', { unique: false });
          }
          if (!progressStore.indexNames.contains('resurrectionTime')) {
            progressStore.createIndex('resurrectionTime', 'resurrectionTime', { unique: false });
          }
          if (!progressStore.indexNames.contains('lastPlayedAt')) {
            progressStore.createIndex('lastPlayedAt', 'lastPlayedAt', { unique: false });
          }
        }
        // Version 3: moduleProgress stored in gameProgress object (no new indexes needed)

        // 创建成就表
        if (!db.objectStoreNames.contains('achievements')) {
          const achievementStore = db.createObjectStore('achievements', { keyPath: 'id', autoIncrement: true });
          achievementStore.createIndex('userId', 'userId', { unique: false });
          achievementStore.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  // 保存用户信息
  saveUser(user) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error('数据库未初始化'));
      }

      const transaction = this.db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.put(user);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 获取用户信息
  getUser(userId) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error('数据库未初始化'));
      }

      const transaction = this.db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 保存游戏进度
  saveGameProgress(userId, progress) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error('数据库未初始化'));
      }

      const transaction = this.db.transaction(['gameProgress'], 'readwrite');
      const store = transaction.objectStore('gameProgress');
      const request = store.put({ userId, ...progress });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 获取游戏进度
  getGameProgress(userId) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error('数据库未初始化'));
      }

      const transaction = this.db.transaction(['gameProgress'], 'readonly');
      const store = transaction.objectStore('gameProgress');
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 保存成就
  saveAchievement(achievement) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error('数据库未初始化'));
      }

      const transaction = this.db.transaction(['achievements'], 'readwrite');
      const store = transaction.objectStore('achievements');
      const request = store.add(achievement);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 获取用户成就
  getUserAchievements(userId) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error('数据库未初始化'));
      }

      const transaction = this.db.transaction(['achievements'], 'readonly');
      const store = transaction.objectStore('achievements');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 关闭数据库
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// 导出单例
export default new IndexDBStore();