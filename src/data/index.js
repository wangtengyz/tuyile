// 模块化题库数据入口
// 三个模块独立编号(1-54)，各自维护进度

import childrenLevels from './modules/children.js';
import brainLevels from './modules/brain.js';
import themeLevels from './modules/theme.js';

// 分类常量
export const CATEGORIES = {
  CHILDREN: 'children',    // 儿童启蒙版
  BRAIN: 'brain',          // 全民脑洞版
  THEME: 'theme'           // 热门主题版
};

// 有效模块ID数组
export const VALID_MODULES = ['children', 'brain', 'theme'];

// 模块数据映射
const moduleDataMap = {
  children: childrenLevels,
  brain: brainLevels,
  theme: themeLevels
};

// 模块信息配置
const moduleInfoMap = {
  children: {
    id: 'children',
    name: '儿童启蒙版',
    description: '适合3-8岁儿童的趣味猜图',
    icon: '👶',
    color: '#FFB800',
    levelCount: 54
  },
  brain: {
    id: 'brain',
    name: '全民脑洞版',
    description: '挑战你的想象力极限',
    icon: '🧠',
    color: '#00D4AA',
    levelCount: 54
  },
  theme: {
    id: 'theme',
    name: '热门主题版',
    description: '紧跟潮流的趣味题目',
    icon: '🔥',
    color: '#FF6B6B',
    levelCount: 54
  }
};

/**
 * 验证模块ID是否有效
 * @param {string} moduleId 模块ID
 * @returns {boolean} 是否有效
 */
export function isValidModule(moduleId) {
  return VALID_MODULES.includes(moduleId);
}

/**
 * 解析关卡Key，格式 "moduleId-levelId" 如 "children-5"
 * @param {string} levelKey 关卡Key
 * @returns {Object|null} { moduleId, levelId } 或 null
 */
export function parseLevelKey(levelKey) {
  if (!levelKey || typeof levelKey !== 'string') return null;
  const parts = levelKey.split('-');
  if (parts.length !== 2) return null;
  const moduleId = parts[0];
  const levelId = parseInt(parts[1], 10);
  if (!isValidModule(moduleId) || isNaN(levelId) || levelId < 1) return null;
  return { moduleId, levelId };
}

/**
 * 构建关卡Key
 * @param {string} moduleId 模块ID
 * @param {number} levelId 关卡ID
 * @returns {string|null} 关卡Key 如 "children-5"
 */
export function buildLevelKey(moduleId, levelId) {
  if (!isValidModule(moduleId) || levelId < 1) return null;
  return `${moduleId}-${levelId}`;
}

/**
 * 获取模块的所有关卡数据
 * @param {string} moduleId 模块ID
 * @returns {Array} 关卡数据数组
 */
export function getModuleLevels(moduleId) {
  return moduleDataMap[moduleId] || [];
}

/**
 * 通过关卡Key获取关卡数据
 * @param {string} levelKey 关卡Key 如 "children-5"
 * @returns {Object|null} 关卡数据
 */
export function getLevel(levelKey) {
  const parsed = parseLevelKey(levelKey);
  if (!parsed) return null;
  return getModuleLevel(parsed.moduleId, parsed.levelId);
}

/**
 * 获取指定模块的指定关卡数据
 * @param {string} moduleId 模块ID
 * @param {number} levelId 关卡ID
 * @returns {Object|null} 关卡数据
 */
export function getModuleLevel(moduleId, levelId) {
  const levels = getModuleLevels(moduleId);
  return levels.find(l => l.id === levelId) || null;
}

/**
 * 获取模块关卡数量
 * @param {string} moduleId 模块ID
 * @returns {number} 关卡数量
 */
export function getModuleLevelCount(moduleId) {
  return getModuleLevels(moduleId).length;
}

/**
 * 获取下一关的关卡Key
 * @param {string} levelKey 当前关卡Key
 * @returns {string|null} 下一关Key 或 null（已是最后一关）
 */
export function getNextLevelKey(levelKey) {
  const parsed = parseLevelKey(levelKey);
  if (!parsed) return null;
  const { moduleId, levelId } = parsed;
  const count = getModuleLevelCount(moduleId);
  if (levelId >= count) return null;
  return buildLevelKey(moduleId, levelId + 1);
}

/**
 * 获取上一关的关卡Key
 * @param {string} levelKey 当前关卡Key
 * @returns {string|null} 上一关Key 或 null（已是第一关）
 */
export function getPrevLevelKey(levelKey) {
  const parsed = parseLevelKey(levelKey);
  if (!parsed) return null;
  const { moduleId, levelId } = parsed;
  if (levelId <= 1) return null;
  return buildLevelKey(moduleId, levelId - 1);
}

/**
 * 获取模块信息
 * @param {string} moduleId 模块ID
 * @returns {Object|null} 模块信息
 */
export function getModuleInfo(moduleId) {
  return moduleInfoMap[moduleId] || null;
}

/**
 * 获取所有模块信息
 * @returns {Array} 模块信息数组
 */
export function getAllModuleInfo() {
  return VALID_MODULES.map(id => moduleInfoMap[id]);
}

/**
 * 根据分类获取关卡（兼容旧API）
 * @param {string} category 分类
 * @returns {Array} 关卡数据数组
 */
export function getLevelsByCategory(category) {
  return getModuleLevels(category);
}

/**
 * 获取指定难度的关卡数据（兼容旧API）
 * @param {number} difficulty 难度等级
 * @param {string} category 分类
 * @returns {Array} 筛选后的关卡数据
 */
export function getLevelsByDifficulty(difficulty, category = 'children') {
  const levels = getModuleLevels(category);
  return levels.filter(level => level.difficulty === difficulty);
}

/**
 * 获取指定类型的关卡数据（兼容旧API）
 * @param {string} type 题目类型
 * @param {string} category 分类
 * @returns {Array} 筛选后的关卡数据
 */
export function getLevelsByType(type, category = 'children') {
  const levels = getModuleLevels(category);
  return levels.filter(level => level.type === type);
}

// 兼容 GameBoard.vue 的默认导出
export default childrenLevels;
