// src/services/imagePreloader.js

const loadedImages = new Set()

/**
 * 预加载单个图片
 * @param {string} url 图片URL
 * @returns {Promise<void>}
 */
export function preloadImage(url) {
  if (loadedImages.has(url)) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      loadedImages.add(url)
      resolve()
    }
    img.onerror = () => {
      console.warn(`[imagePreloader] Failed to load: ${url}`)
      reject(new Error(`Image load failed: ${url}`))
    }
    img.src = url
  })
}

/**
 * 预加载模块所有雪碧图
 * @param {string} moduleName 模块名 (children/brain/theme)
 * @returns {Promise<void[]>}
 */
export function preloadModuleImages(moduleName) {
  const images = getModuleSpriteImages(moduleName)
  return Promise.allSettled(images.map(preloadImage))
}

/**
 * 获取模块雪碧图URL列表
 * @param {string} moduleName
 * @returns {string[]}
 */
function getModuleSpriteImages(moduleName) {
  const modulePrefix = moduleName === 'children' ? '第一模块'
    : moduleName === 'brain' ? '第二模块'
    : '第三模块'

  return [
    `/question/${modulePrefix}1-9.png`,
    `/question/${modulePrefix}10-18.png`,
    `/question/${modulePrefix}19-27.png`,
    `/question/${modulePrefix}28-36.png`,
    `/question/${modulePrefix}37-45.png`,
    `/question/${modulePrefix}46-54.png`
  ]
}

/**
 * 首屏预加载第一张雪碧图
 * @returns {Promise<void>}
 */
export function preloadFirstImage() {
  return preloadImage('/question/第一模块1-9.png')
}

/**
 * 检查图片是否已加载
 * @param {string} url
 * @returns {boolean}
 */
export function isImageLoaded(url) {
  return loadedImages.has(url)
}