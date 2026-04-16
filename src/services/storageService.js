// 数据存储统一接口 - 模块化进度存储
// 用户名使用 localStorage 快速访问,关卡进度使用 IndexedDB 结构化存储

import storeManager from '../stores/storeManager.js'
import { HONOR_LEVELS } from '../data/honors.js'

// ==================== 常量定义 ====================

/**
 * 有效模块名称列表
 * @constant {string[]}
 */
export const VALID_MODULES = ['children', 'brain', 'theme']

// 用户名快速访问（localStorage）
const USERNAME_KEY = 'guessGameUsername'

// ==================== 基础用户功能 ====================

/**
 * 获取当前用户名
 * @returns {string} 用户名或空字符串
 */
export function getUsername() {
  return localStorage.getItem(USERNAME_KEY) || ''
}

/**
 * 设置用户名
 * @param {string} username - 用户名
 */
export function setUsername(username) {
  localStorage.setItem(USERNAME_KEY, username)
}

// ==================== 存储初始化 ====================

/**
 * 初始化存储系统
 * @returns {Promise<boolean>} 初始化是否成功
 */
export async function initStorage() {
  try {
    await storeManager.init()
    return true
  } catch (error) {
    console.error('[storageService] Failed to initialize storage:', error)
    return false
  }
}

// ==================== 默认进度结构 ====================

/**
 * 获取默认模块进度结构
 * @returns {Object} 默认进度对象
 */
export function getDefaultModuleProgress() {
  return {
    children: { currentLevel: 1, completedLevels: [] },
    brain: { currentLevel: 1, completedLevels: [] },
    theme: { currentLevel: 1, completedLevels: [] }
  }
}

/**
 * 获取默认荣誉解锁进度
 * @returns {Object} 默认荣誉解锁对象
 */
export function getDefaultUnlockedHonors() {
  return {
    children: [],
    brain: [],
    theme: []
  };
}

// ==================== 模块验证 ====================

/**
 * 验证模块名称是否有效
 * @param {string} moduleName - 模块名称
 * @returns {boolean} 是否有效
 */
export function isValidModule(moduleName) {
  return VALID_MODULES.includes(moduleName)
}

// ==================== 进度管理函数 ====================

/**
 * 获取用户所有模块进度
 * @param {string} username - 用户名
 * @returns {Promise<Object>} 所有模块进度
 */
export async function getModuleProgress(username) {
  try {
    const progress = await getUserProgress(username)
    return progress?.moduleProgress || getDefaultModuleProgress()
  } catch (error) {
    console.error('[storageService] Failed to get module progress:', error)
    return getDefaultModuleProgress()
  }
}

/**
 * 获取单个模块进度
 * @param {string} username - 用户名
 * @param {string} moduleName - 模块名称
 * @returns {Promise<Object>} 单个模块进度
 */
export async function getSingleModuleProgress(username, moduleName) {
  if (!isValidModule(moduleName)) {
    console.error('[storageService] Invalid moduleName:', moduleName)
    return { currentLevel: 1, completedLevels: [] }
  }

  try {
    const allProgress = await getModuleProgress(username)
    return allProgress[moduleName] || { currentLevel: 1, completedLevels: [] }
  } catch (error) {
    console.error('[storageService] Failed to get single module progress:', error)
    return { currentLevel: 1, completedLevels: [] }
  }
}

/**
 * 完成关卡并更新进度
 * @param {string} username - 用户名
 * @param {string} moduleName - 模块名称
 * @param {number} levelId - 关卡ID
 * @returns {Promise<boolean>} 更新是否成功
 */
export async function completeLevel(username, moduleName, levelId) {
  if (!isValidModule(moduleName)) {
    console.error('[storageService] Invalid moduleName:', moduleName)
    return false
  }

  try {
    const progress = await getUserProgress(username) || {}
    const moduleProgress = progress.moduleProgress || getDefaultModuleProgress()

    const moduleData = moduleProgress[moduleName] || { currentLevel: 1, completedLevels: [] }

    // 添加到已完成关卡列表（避免重复）
    if (!moduleData.completedLevels.includes(levelId)) {
      moduleData.completedLevels.push(levelId)
      moduleData.completedLevels.sort((a, b) => a - b)
    }

    // 更新当前关卡为下一关
    const nextLevel = levelId + 1
    moduleData.currentLevel = nextLevel

    moduleProgress[moduleName] = moduleData

    await saveUserProgress(username, { moduleProgress })
    return true
  } catch (error) {
    console.error('[storageService] Failed to complete level:', error)
    return false
  }
}

/**
 * 检查关卡是否已解锁
 * @param {string} username - 用户名
 * @param {string} moduleName - 模块名称
 * @param {number} levelId - 关卡ID
 * @returns {Promise<boolean>} 是否已解锁
 */
export async function isLevelUnlocked(username, moduleName, levelId) {
  if (!isValidModule(moduleName)) {
    console.error('[storageService] Invalid moduleName:', moduleName)
    return false
  }

  try {
    const moduleData = await getSingleModuleProgress(username, moduleName)
    return levelId <= moduleData.currentLevel
  } catch (error) {
    console.error('[storageService] Failed to check if level is unlocked:', error)
    return false
  }
}

/**
 * 检查关卡是否已完成
 * @param {string} username - 用户名
 * @param {string} moduleName - 模块名称
 * @param {number} levelId - 关卡ID
 * @returns {Promise<boolean>} 是否已完成
 */
export async function isLevelCompleted(username, moduleName, levelId) {
  if (!isValidModule(moduleName)) {
    console.error('[storageService] Invalid moduleName:', moduleName)
    return false
  }

  try {
    const moduleData = await getSingleModuleProgress(username, moduleName)
    return moduleData.completedLevels.includes(levelId)
  } catch (error) {
    console.error('[storageService] Failed to check if level is completed:', error)
    return false
  }
}

// ==================== 存储基础功能 ====================

/**
 * 保存用户进度
 * @param {string} username - 用户名
 * @param {Object} progress - 进度数据
 * @returns {Promise<boolean>} 保存是否成功
 */
export async function saveUserProgress(username, progress) {
  try {
    const existing = await storeManager.getGameProgress(username) || {}
    return storeManager.saveGameProgress(username, { ...existing, ...progress })
  } catch (error) {
    console.error('[storageService] Failed to save user progress:', error)
    return false
  }
}

/**
 * 获取用户进度
 * @param {string} username - 用户名
 * @returns {Promise<Object|null>} 用户进度数据
 */
export async function getUserProgress(username) {
  try {
    return storeManager.getGameProgress(username)
  } catch (error) {
    console.error('[storageService] Failed to get user progress:', error)
    return null
  }
}

// ==================== 复活时间管理 ====================

/**
 * 设置复活时间
 * @param {string} username - 用户名
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {Promise<boolean>} 设置是否成功
 */
export async function setResurrectionTime(username, timestamp) {
  try {
    return saveUserProgress(username, { resurrectionTime: timestamp })
  } catch (error) {
    console.error('[storageService] Failed to set resurrection time:', error)
    return false
  }
}

/**
 * 获取复活时间
 * @param {string} username - 用户名
 * @returns {Promise<number|null>} 复活时间戳或null
 */
export async function getResurrectionTime(username) {
  try {
    const progress = await getUserProgress(username)
    return progress?.resurrectionTime || null
  } catch (error) {
    console.error('[storageService] Failed to get resurrection time:', error)
    return null
  }
}

/**
 * 清除复活时间
 * @param {string} username - 用户名
 * @returns {Promise<boolean>} 清除是否成功
 */
export async function clearResurrectionTime(username) {
  try {
    const progress = await getUserProgress(username)
    if (progress) {
      delete progress.resurrectionTime
      return storeManager.saveGameProgress(username, progress)
    }
    return false
  } catch (error) {
    console.error('[storageService] Failed to clear resurrection time:', error)
    return false
  }
}

// ==================== 数据迁移 ====================

/**
 * 从旧格式迁移数据到新格式
 * 旧格式: { currentLevel, completedLevels, correctAnswers, resurrectionTime }
 * 新格式: { moduleProgress: { children: { currentLevel, completedLevels }, ... }, resurrectionTime }
 * @param {string} username - 用户名
 * @returns {Promise<boolean>} 迁移是否成功
 */
export async function migrateOldData(username) {
  try {
    // 从 localStorage 读取旧数据
    const oldCorrect = localStorage.getItem(`${username}_correctAnswers`)
    const oldLevel = localStorage.getItem(`${username}_unlockedLevel`)
    const oldResurrection = localStorage.getItem(`${username}_resurrectionTime`)

    // 获取现有的 IndexedDB 数据
    const existingProgress = await getUserProgress(username) || {}

    // 如果已经存在新格式的 moduleProgress，说明已经迁移过
    if (existingProgress.moduleProgress) {
      // 确保荣誉字段存在
      if (!existingProgress.unlockedHonors) {
        existingProgress.unlockedHonors = getDefaultUnlockedHonors();
        await saveUserProgress(username, existingProgress);
      }
      // 清理旧 localStorage 数据
      localStorage.removeItem(`${username}_correctAnswers`)
      localStorage.removeItem(`${username}_unlockedLevel`)
      localStorage.removeItem(`${username}_resurrectionTime`)
      return true
    }

    // 需要迁移 - 创建新格式的 moduleProgress
    const moduleProgress = getDefaultModuleProgress()

    // 如果有旧进度数据，将其迁移到 children 模块（默认）
    if (oldLevel) {
      const unlockedLevel = parseInt(oldLevel) || 1
      // 生成已完成的关卡列表（假设从1到unlockedLevel-1都已完成）
      const completedLevels = []
      for (let i = 1; i < unlockedLevel; i++) {
        completedLevels.push(i)
      }
      moduleProgress.children = {
        currentLevel: unlockedLevel,
        completedLevels: completedLevels
      }
    }

    // 保存新格式的数据
    const newProgress = {
      moduleProgress,
      unlockedHonors: getDefaultUnlockedHonors(),
      resurrectionTime: oldResurrection ? parseInt(oldResurrection) : null
    }

    await saveUserProgress(username, newProgress)

    // 清理旧 localStorage 数据
    localStorage.removeItem(`${username}_correctAnswers`)
    localStorage.removeItem(`${username}_unlockedLevel`)
    localStorage.removeItem(`${username}_resurrectionTime`)

    console.log('[storageService] Successfully migrated old data for user:', username)
    return true
  } catch (error) {
    console.error('[storageService] Failed to migrate old data:', error)
    return false
  }
}

// ==================== 废弃的API（保留但标记为deprecated） ====================

/**
 * @deprecated 请使用模块化的进度管理函数（completeLevel, getModuleProgress等）
 * 更新已解锁关卡
 * @param {string} username - 用户名
 * @param {number} level - 关卡等级
 * @returns {Promise<boolean>} 更新是否成功
 */
export async function updateUnlockedLevel(username, level) {
  console.warn('[storageService] updateUnlockedLevel is deprecated. Use module progress functions instead.')
  try {
    return saveUserProgress(username, { unlockedLevel: level })
  } catch (error) {
    console.error('[storageService] Failed to update unlocked level:', error)
    return false
  }
}

/**
 * @deprecated 请使用模块化的进度管理函数
 * 更新答对题数
 * @param {string} username - 用户名
 * @param {number} count - 答对题数
 * @returns {Promise<boolean>} 更新是否成功
 */
export async function updateCorrectAnswers(username, count) {
  console.warn('[storageService] updateCorrectAnswers is deprecated. Use module progress functions instead.')
  try {
    return saveUserProgress(username, { correctAnswers: count })
  } catch (error) {
    console.error('[storageService] Failed to update correct answers:', error)
    return false
  }
}

/**
 * @deprecated 请使用模块名称常量 VALID_MODULES
 * 根据关卡ID获取模块名称
 * @param {number} levelId - 关卡ID
 * @returns {string} 模块名称
 */
export function getModuleName(levelId) {
  console.warn('[storageService] getModuleName is deprecated. Use VALID_MODULES constant instead.')
  if (typeof levelId !== 'number' || levelId < 1) {
    console.warn('[storageService] Invalid levelId, defaulting to children:', levelId)
    return 'children'
  }
  if (levelId <= 54) return 'children'
  if (levelId <= 108) return 'brain'
  return 'theme'
}

/**
 * @deprecated 请使用 getSingleModuleProgress 获取完整进度
 * 获取模块答对数
 * @param {string} username - 用户名
 * @param {string} moduleName - 模块名称
 * @returns {Promise<number>} 答对题数
 */
export async function getModuleCorrectAnswers(username, moduleName) {
  console.warn('[storageService] getModuleCorrectAnswers is deprecated. Use getSingleModuleProgress instead.')
  try {
    const moduleData = await getSingleModuleProgress(username, moduleName)
    return moduleData.correctAnswers || moduleData.completedLevels?.length || 0
  } catch (error) {
    console.error('[storageService] Failed to get module correct answers:', error)
    return 0
  }
}

/**
 * @deprecated 请使用 completeLevel 管理进度
 * 更新模块答对数
 * @param {string} username - 用户名
 * @param {string} moduleName - 模块名称
 * @param {number} count - 答对题数
 * @returns {Promise<boolean>} 更新是否成功
 */
export async function updateModuleCorrectAnswers(username, moduleName, count) {
  console.warn('[storageService] updateModuleCorrectAnswers is deprecated. Use completeLevel instead.')
  if (!isValidModule(moduleName)) {
    console.error('[storageService] Invalid moduleName:', moduleName)
    return false
  }

  try {
    const progress = await getUserProgress(username) || {}
    const moduleProgress = progress.moduleProgress || getDefaultModuleProgress()

    // 保持兼容：如果模块数据中不存在 completedLevels，则从 count 生成
    if (!moduleProgress[moduleName].completedLevels) {
      const completedLevels = []
      for (let i = 1; i <= count; i++) {
        completedLevels.push(i)
      }
      moduleProgress[moduleName] = {
        ...moduleProgress[moduleName],
        completedLevels
      }
    }

    return saveUserProgress(username, { moduleProgress })
  } catch (error) {
    console.error('[storageService] Failed to update module correct answers:', error)
    return false
  }
}

// ==================== 荣誉解锁管理 ====================

/**
 * 解锁荣誉图
 * @param {string} username 用户名
 * @param {string} moduleName 模块名称
 * @param {number} honorLevel 荣誉等级
 * @returns {Promise<boolean>}
 */
export async function unlockHonor(username, moduleName, honorLevel) {
  if (!isValidModule(moduleName)) {
    console.error('[storageService] Invalid moduleName:', moduleName);
    return false;
  }

  if (!HONOR_LEVELS.includes(honorLevel)) {
    console.error('[storageService] Invalid honorLevel:', honorLevel);
    return false;
  }

  try {
    const progress = await getUserProgress(username) || {};
    const unlockedHonors = progress.unlockedHonors || getDefaultUnlockedHonors();

    // 避免重复解锁（检查对象数组中是否已存在该等级）
    const moduleHonors = unlockedHonors[moduleName];
    if (!Array.isArray(moduleHonors)) {
      unlockedHonors[moduleName] = [];
    }
    const isAlreadyUnlocked = moduleHonors.some(h => h && h.level === honorLevel);
    if (isAlreadyUnlocked) {
      return true;
    }

    // 添加解锁并记录时间
    unlockedHonors[moduleName].push({
      level: honorLevel,
      unlockedAt: Date.now()
    });

    // 按等级排序
    unlockedHonors[moduleName].sort((a, b) => a.level - b.level);

    await saveUserProgress(username, { unlockedHonors });
    console.log('[storageService] Honor unlocked:', { moduleName, honorLevel });
    return true;
  } catch (error) {
    console.error('[storageService] Failed to unlock honor:', error);
    return false;
  }
}

/**
 * 获取已解锁荣誉列表
 * @param {string} username 用户名
 * @returns {Promise<Object>}
 */
export async function getUnlockedHonors(username) {
  try {
    const progress = await getUserProgress(username);
    return progress?.unlockedHonors || getDefaultUnlockedHonors();
  } catch (error) {
    console.error('[storageService] Failed to get unlocked honors:', error);
    return getDefaultUnlockedHonors();
  }
}

/**
 * 检查荣誉是否已解锁
 * @param {string} username 用户名
 * @param {string} moduleName 模块名称
 * @param {number} honorLevel 荣誉等级
 * @returns {Promise<boolean>}
 */
export async function isHonorUnlocked(username, moduleName, honorLevel) {
  if (!isValidModule(moduleName)) {
    console.error('[storageService] Invalid moduleName:', moduleName);
    return false;
  }

  try {
    const unlockedHonors = await getUnlockedHonors(username);
    const moduleHonors = unlockedHonors[moduleName];
    // 确保是数组
    if (!Array.isArray(moduleHonors)) {
      return false;
    }
    return moduleHonors.some(h => h && h.level === honorLevel);
  } catch (error) {
    console.error('[storageService] Failed to check honor unlock status:', error);
    return false;
  }
}

/**
 * 检查并解锁符合条件的荣誉
 * @param {string} username 用户名
 * @param {string} moduleName 模块名称
 * @param {number} completedCount 已完成题目数
 * @returns {Promise<Array>} 新解锁的荣誉等级数组
 */
export async function checkAndUnlockHonors(username, moduleName, completedCount) {
  if (!isValidModule(moduleName)) {
    console.error('[storageService] Invalid moduleName:', moduleName);
    return [];
  }

  const newlyUnlocked = [];

  try {
    for (const level of HONOR_LEVELS) {
      if (completedCount >= level) {
        const isAlreadyUnlocked = await isHonorUnlocked(username, moduleName, level);
        if (!isAlreadyUnlocked) {
          const success = await unlockHonor(username, moduleName, level);
          if (success) {
            newlyUnlocked.push(level);
          }
        }
      }
    }

    if (newlyUnlocked.length > 0) {
      console.log('[storageService] Newly unlocked honors:', newlyUnlocked);
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('[storageService] Failed to check and unlock honors:', error);
    return [];
  }
}
