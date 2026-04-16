// 荣誉图数据配置文件
// 每个模块包含5个荣誉等级：10, 20, 30, 40, 50

// 有效模块名称列表
export const VALID_MODULES = ['children', 'brain', 'theme'];

// 荣誉等级常量
export const HONOR_LEVELS = [10, 20, 30, 40, 50];

// 荣誉图配置
export const HONOR_CONFIG = {
  children: {
    name: '儿童启蒙版',
    moduleId: 'children',
    honors: [
      {
        level: 10,
        image: 'https://telegraph-image-92x.pages.dev/file/ac6eb101028dc867246f5-c5c30add2435aa5373.png',
        title: '启蒙新手',
        description: '答对10题解锁'
      },
      {
        level: 20,
        image: 'https://telegraph-image-92x.pages.dev/file/5b1b09e722d98ac541b8c-12f361d6f76d6e3922.png',
        title: '认图达人',
        description: '答对20题解锁'
      },
      {
        level: 30,
        image: 'https://telegraph-image-92x.pages.dev/file/cfad2f3d99381fa921fd4-782963c7599ee7d59a.png',
        title: '小小智者',
        description: '答对30题解锁'
      },
      {
        level: 40,
        image: 'https://telegraph-image-92x.pages.dev/file/c91e367e397544ad73b5a-a324b34cd2deac95f0.png',
        title: '脑洞萌芽',
        description: '答对40题解锁'
      },
      {
        level: 50,
        image: 'https://telegraph-image-92x.pages.dev/file/7c81d97d2f02604dc5fde-41ac6d9eb7dacb33a8.png',
        title: '启蒙大师',
        description: '答对50题解锁'
      }
    ]
  },
  brain: {
    name: '全民脑洞版',
    moduleId: 'brain',
    honors: [
      {
        level: 10,
        image: 'https://telegraph-image-92x.pages.dev/file/29656c8452d1caaabd762-b58ceedce952f99d02.png',
        title: '脑洞开启',
        description: '答对10题解锁'
      },
      {
        level: 20,
        image: 'https://telegraph-image-92x.pages.dev/file/afbefe9c058b114f2ddbd-e05232efa4ae74cf01.png',
        title: '思维活跃',
        description: '答对20题解锁'
      },
      {
        level: 30,
        image: 'https://telegraph-image-92x.pages.dev/file/e261c3607c57bd23f6ebb-0591a8a8b95f5da55a.png',
        title: '联想高手',
        description: '答对30题解锁'
      },
      {
        level: 40,
        image: 'https://telegraph-image-92x.pages.dev/file/1851515266d604ab6ab25-4b395ef9b7fc8f1c6e.png',
        title: '创意达人',
        description: '答对40题解锁'
      },
      {
        level: 50,
        image: 'https://telegraph-image-92x.pages.dev/file/b79d55231227c8627ef06-c60fa3fbe9d7c50b72.png',
        title: '脑洞王者',
        description: '答对50题解锁'
      }
    ]
  },
  theme: {
    name: '热门主题版',
    moduleId: 'theme',
    honors: [
      {
        level: 10,
        image: 'https://telegraph-image-92x.pages.dev/file/e3a8cf612e1c7d335258d-b526ea55392b1662a0.png',
        title: '主题新手',
        description: '答对10题解锁'
      },
      {
        level: 20,
        image: 'https://telegraph-image-92x.pages.dev/file/f8974b3e34ca252510cb4-11002d40d481a1bfd9.png',
        title: '流行追踪',
        description: '答对20题解锁'
      },
      {
        level: 30,
        image: 'https://telegraph-image-92x.pages.dev/file/ac2f8768e6755a4dd40a9-c09e5f6f307c18864d.png',
        title: '话题达人',
        description: '答对30题解锁'
      },
      {
        level: 40,
        image: 'https://telegraph-image-92x.pages.dev/file/15a8d631afb8a2d1f15b4-9ec66cb7f123b56843.png',
        title: '潮流先锋',
        description: '答对40题解锁'
      },
      {
        level: 50,
        image: 'https://telegraph-image-92x.pages.dev/file/09e94a2c7e976bf024c5d-1a10d82e4dd2d97a97.png',
        title: '主题大师',
        description: '答对50题解锁'
      }
    ]
  }
};

/**
 * 获取指定模块的荣誉配置
 * @param {string} moduleId - 模块ID (children|brain|theme)
 * @returns {Object|null} 模块荣誉配置对象
 */
export function getModuleHonorConfig(moduleId) {
  return HONOR_CONFIG[moduleId] || null;
}

/**
 * 获取所有荣誉配置
 * @returns {Object} 包含所有模块荣誉配置的对象
 */
export function getAllHonorConfigs() {
  return HONOR_CONFIG;
}

/**
 * 获取模块解锁进度
 * @param {string} moduleId - 模块ID
 * @param {number} completedCount - 已完成题目数量
 * @returns {Object} 解锁进度信息
 */
export function getModuleUnlockProgress(moduleId, completedCount) {
  const config = HONOR_CONFIG[moduleId];
  if (!config) {
    return null;
  }

  const honors = config.honors;
  const unlockedHonors = honors.filter(h => completedCount >= h.level);
  const nextHonor = honors.find(h => completedCount < h.level);

  return {
    moduleId,
    moduleName: config.name,
    completedCount,
    unlockedCount: unlockedHonors.length,
    totalCount: honors.length,
    unlockedHonors: unlockedHonors.map(h => ({
      level: h.level,
      title: h.title,
      image: h.image
    })),
    nextHonor: nextHonor ? {
      level: nextHonor.level,
      title: nextHonor.title,
      image: nextHonor.image,
      remaining: nextHonor.level - completedCount
    } : null,
    isComplete: unlockedHonors.length === honors.length
  };
}

/**
 * 获取指定荣誉的详细信息
 * @param {string} moduleId - 模块ID
 * @param {number} level - 荣誉等级 (10|20|30|40|50)
 * @returns {Object|null} 荣誉详细信息
 */
export function getHonorInfo(moduleId, level) {
  const config = HONOR_CONFIG[moduleId];
  if (!config) {
    return null;
  }

  const honor = config.honors.find(h => h.level === level);
  if (!honor) {
    return null;
  }

  return {
    ...honor,
    moduleId,
    moduleName: config.name
  };
}

// 默认导出
export default {
  HONOR_LEVELS,
  HONOR_CONFIG,
  getModuleHonorConfig,
  getAllHonorConfigs,
  getModuleUnlockProgress,
  getHonorInfo
};
