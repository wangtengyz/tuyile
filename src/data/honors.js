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
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%B8%8010%E8%8D%A3%E8%AA%89.png',
        title: '启蒙新手',
        description: '答对10题解锁'
      },
      {
        level: 20,
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%B8%8020%E8%8D%A3%E8%AA%89.png',
        title: '认图达人',
        description: '答对20题解锁'
      },
      {
        level: 30,
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%B8%8030%E8%8D%A3%E8%AA%89.png',
        title: '小小智者',
        description: '答对30题解锁'
      },
      {
        level: 40,
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%B8%8040%E8%8D%A3%E8%AA%89.png',
        title: '脑洞萌芽',
        description: '答对40题解锁'
      },
      {
        level: 50,
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%B8%8050%E8%8D%A3%E8%AA%89.png',
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
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%BA%8C10%E8%8D%A3%E8%AA%89.png',
        title: '脑洞开启',
        description: '答对10题解锁'
      },
      {
        level: 20,
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%BA%8C20%E8%8D%A3%E8%AA%89.png',
        title: '思维活跃',
        description: '答对20题解锁'
      },
      {
        level: 30,
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%BA%8C30%E8%8D%A3%E8%AA%89.png',
        title: '联想高手',
        description: '答对30题解锁'
      },
      {
        level: 40,
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%BA%8C40%E8%8D%A3%E8%AA%89.png',
        title: '创意达人',
        description: '答对40题解锁'
      },
      {
        level: 50,
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%BA%8C50%E8%8D%A3%E8%AA%89.png',
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
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%B8%8910%E8%8D%A3%E8%AA%89.png',
        title: '主题新手',
        description: '答对10题解锁'
      },
      {
        level: 20,
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%B8%8920%E8%8D%A3%E8%AA%89.png',
        title: '流行追踪',
        description: '答对20题解锁'
      },
      {
        level: 30,
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%B8%8930%E8%8D%A3%E8%AA%89.png',
        title: '话题达人',
        description: '答对30题解锁'
      },
      {
        level: 40,
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%B8%8940%E8%8D%A3%E8%AA%89.png',
        title: '潮流先锋',
        description: '答对40题解锁'
      },
      {
        level: 50,
        image: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/%E6%A8%A1%E5%9D%97%E4%B8%8950%E8%8D%A3%E8%AA%89.png',
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
