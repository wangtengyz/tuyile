// 图片路径配置文件
// 集中管理所有图片路径，便于后续替换为远程链接
// 所有模块使用单独图片配置：{ src, aspectRatio, displayMode }

// 默认图片显示配置
const DEFAULT_IMAGE_CONFIG = {
  aspectRatio: '3:4',      // 默认宽高比
  displayMode: 'contain'   // 默认显示模式
}

// 生成关卡图片配置的辅助函数
function createLevelConfig(src) {
  return {
    src,
    aspectRatio: '3:4',
    displayMode: 'contain'
  }
}

// 生成1-54关的图片URL
function generateLevelUrls(moduleId) {
  const urls = {}
  for (let i = 1; i <= 54; i++) {
    urls[String(i)] = createLevelConfig(`https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/${moduleId}-${i}.png`)
  }
  return urls
}

export const imagePaths = {
  // 儿童启蒙版 (children) - 全部54关使用单独图片
  children: generateLevelUrls('children'),
  
  // 全民脑洞版 (brain) - 全部54关使用单独图片
  brain: generateLevelUrls('brain'),
  
  // 热门主题版 (theme) - 全部54关使用单独图片
  theme: generateLevelUrls('theme')
}

/**
 * 判断配置是否为对象结构（单独图片配置）
 * @param {*} config - 配置值
 * @returns {boolean}
 */
function isImageConfigObject(config) {
  return config && typeof config === 'object' && config.src
}

/**
 * 根据模块ID和关卡ID获取完整的图片配置
 * @param {string} moduleId - 模块ID: 'brain' | 'children' | 'theme'
 * @param {number} levelId - 关卡ID: 1-54
 * @returns {object} 图片配置对象 { src, aspectRatio, displayMode, isSprite }
 */
export function getImageConfig(moduleId, levelId) {
  const moduleImages = imagePaths[moduleId]
  if (!moduleImages) {
    console.warn(`Unknown moduleId: ${moduleId}`)
    return { src: '', ...DEFAULT_IMAGE_CONFIG, isSprite: false }
  }

  // 所有模块都使用单独图片配置
  const config = moduleImages[String(levelId)]
  if (!config) {
    console.warn(`Invalid levelId: ${levelId} for module ${moduleId}`)
    return { src: '', ...DEFAULT_IMAGE_CONFIG, isSprite: false }
  }

  if (isImageConfigObject(config)) {
    return {
      src: config.src,
      aspectRatio: config.aspectRatio || DEFAULT_IMAGE_CONFIG.aspectRatio,
      displayMode: config.displayMode || DEFAULT_IMAGE_CONFIG.displayMode,
      isSprite: false
    }
  }

  // 兼容旧配置（字符串路径）
  return { src: config, ...DEFAULT_IMAGE_CONFIG, isSprite: false }
}

/**
 * 根据模块ID和关卡ID获取对应的图片路径
 * @param {string} moduleId - 模块ID: 'brain' | 'children' | 'theme'
 * @param {number} levelId - 关卡ID: 1-54
 * @returns {string} 图片路径
 */
export function getImagePath(moduleId, levelId) {
  const config = getImageConfig(moduleId, levelId)
  return config.src
}

export default imagePaths