// 图片路径配置文件
// 集中管理所有图片路径，便于后续替换为远程链接
// 修改此文件即可更新所有模块的图片路径
// 支持单独图片配置：{ src, aspectRatio, displayMode }

// 默认图片显示配置
const DEFAULT_IMAGE_CONFIG = {
  aspectRatio: '3:4',      // 默认宽高比
  displayMode: 'contain'   // 默认显示模式
}

export const imagePaths = {
  // 全民脑洞版 (brain) 雪碧图
  brain: {
    '1-9': 'https://telegraph-image-92x.pages.dev/file/89c70bc6817bf4ba844da-b3ecc34995008e80f7.png',
    '10-18': 'https://telegraph-image-92x.pages.dev/file/f93fb0c1dd509c87c45ca-7a97f3083a126ddfdd.png',
    '19-27': 'https://telegraph-image-92x.pages.dev/file/81066f692681931a6f721-d8d36b3d53ee8c2d3e.png',
    '28-36': 'https://telegraph-image-92x.pages.dev/file/803d690d79d17dd73f2f8-af81a0e987762244e3.png',
    '37-45': 'https://telegraph-image-92x.pages.dev/file/ae08812b4f36bd66780c6-96caded446aa52f123.png',
    '46-54': 'https://telegraph-image-92x.pages.dev/file/09f84d6a1dc38b60ee8b4-476760f5b9e0748e85.png'
  },
  // 儿童启蒙版 (children) 图片配置
  // 1-9 关卡使用单独图片（对象配置），10-54 使用雪碧图（字符串路径）
  children: {
    // 1-9 关卡单独图片配置（对象结构，支持显示属性）
    '1': {
      src: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/children-1.png',
      aspectRatio: '3:4',
      displayMode: 'contain'
    },
    '2': {
      src: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/children-2.png',
      aspectRatio: '3:4',
      displayMode: 'contain'
    },
    '3': {
      src: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/children-3.png',
      aspectRatio: '3:4',
      displayMode: 'contain'
    },
    '4': {
      src: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/children-4.png',
      aspectRatio: '3:4',
      displayMode: 'contain'
    },
    '5': {
      src: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/children-5.png',
      aspectRatio: '3:4',
      displayMode: 'contain'
    },
    '6': {
      src: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/children-6.png',
      aspectRatio: '3:4',
      displayMode: 'contain'
    },
    '7': {
      src: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/children-7.png',
      aspectRatio: '3:4',
      displayMode: 'contain'
    },
    '8': {
      src: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/children-8.png',
      aspectRatio: '3:4',
      displayMode: 'contain'
    },
    '9': {
      src: 'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/children-9.png',
      aspectRatio: '3:4',
      displayMode: 'contain'
    },
    // 10-54 关卡雪碧图（字符串路径）
    '10-18': 'https://telegraph-image-92x.pages.dev/file/ea104041f4961505a5a4f-d69b540af96ec58e84.png',
    '19-27': 'https://telegraph-image-92x.pages.dev/file/7401a67f47e2047b69f5f-0e28e6162829e1ab9b.png',
    '28-36': 'https://telegraph-image-92x.pages.dev/file/a35cee32d06d56728dd51-35db80287fd440807c.png',
    '37-45': 'https://telegraph-image-92x.pages.dev/file/70ca4fcb8a04ddda90699-5ce277403caff2f349.png',
    '46-54': 'https://telegraph-image-92x.pages.dev/file/53cb4b75fcc0a40c70198-f0b7c42adef9b25406.png'
  },
  // 热门主题版 (theme) 雪碧图
  theme: {
    '1-9': 'https://telegraph-image-92x.pages.dev/file/8105c7bf279f97fd3c641-bad7f27afbd6c57288.png',
    '10-18': 'https://telegraph-image-92x.pages.dev/file/35f93982c933710df766d-7967c98f6f122e1eb7.png',
    '19-27': 'https://telegraph-image-92x.pages.dev/file/519de48d9e7f97aed768e-28ef50a8680b8df5f8.png',
    '28-36': 'https://telegraph-image-92x.pages.dev/file/9edeb46ef8dcca77bac69-078a4864d95954a78c.png',
    '37-45': 'https://telegraph-image-92x.pages.dev/file/0af815a3f498e57cff9a7-1d541139e5a8eea35a.png',
    '46-54': 'https://telegraph-image-92x.pages.dev/file/d33295f691f1a7cc67899-905f166dbd7767b4c6.png'
  }
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

  // 儿童启蒙版 1-9 关卡使用单独图片配置
  if (moduleId === 'children' && levelId >= 1 && levelId <= 9) {
    const config = moduleImages[String(levelId)]
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

  // 雪碧图配置
  let spriteKey = ''
  if (levelId >= 46 && levelId <= 54) spriteKey = '46-54'
  else if (levelId >= 37 && levelId <= 45) spriteKey = '37-45'
  else if (levelId >= 28 && levelId <= 36) spriteKey = '28-36'
  else if (levelId >= 19 && levelId <= 27) spriteKey = '19-27'
  else if (levelId >= 10 && levelId <= 18) spriteKey = '10-18'
  else if (levelId >= 1 && levelId <= 9) spriteKey = '1-9'

  if (!spriteKey) {
    console.warn(`Invalid levelId: ${levelId} for module ${moduleId}`)
    spriteKey = '1-9'
  }

  const config = moduleImages[spriteKey]
  // 雪碧图返回字符串路径
  const src = isImageConfigObject(config) ? config.src : config
  return { src, ...DEFAULT_IMAGE_CONFIG, isSprite: true }
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
