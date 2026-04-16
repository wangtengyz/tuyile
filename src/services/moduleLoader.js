// src/services/moduleLoader.js

import { loadModuleData } from '../data/index.js'
import { preloadModuleImages } from './imagePreloader.js'

/**
 * 加载模块资源（数据+图片）
 * @param {string} moduleName
 * @returns {Promise<{data: Array, imagesLoaded: number}>}
 */
export async function loadModuleResources(moduleName) {
  const [data, imageResults] = await Promise.all([
    loadModuleData(moduleName),
    preloadModuleImages(moduleName)
  ])

  const imagesLoaded = imageResults.filter(r => r.status === 'fulfilled').length

  return {
    data,
    imagesLoaded
  }
}