<template>
  <div class="game-board">
        
    <div class="game-content">
      <!-- 图片显示区域 -->
      <div class="image-container">
        <!-- 图片加载中 -->
        <div v-if="imageLoading" class="image-loading">
          <LoadingSpinner />
        </div>
        <!-- 图片显示 -->
        <div v-else class="image" :class="{ 'sprite-image': isSpriteImage(currentLevelData.variantImage, currentLevelData.moduleId, currentLevelData.id) }">
          <img 
            v-if="!isSpriteImage(currentLevelData.variantImage, currentLevelData.moduleId, currentLevelData.id)" 
            :src="currentLevelData.variantImage" 
            :alt="currentLevelData.variantDescription"
            :style="getImageStyle(currentLevelData.moduleId, currentLevelData.id)"
            @load="onImageLoad"
            @error="onImageError"
          />
          <div 
            v-else 
            class="sprite" 
            :style="getSpriteStyle(currentLevelData.variantImage, 'variant', currentLevelData.id, currentLevelData.moduleId)"
            ref="spriteElement"
          ></div>
        </div>
      </div>
      
      <!-- 答题区域 -->
      <div class="answer-container" v-if="!isAnswered">
                <div class="answer-boxes">
          <input
            v-for="(char, index) in answerChars"
            :key="index"
            type="text"

            v-model="answerChars[index]"
            @input="onInput(index, $event)"
            @keydown="onKeydown(index, $event)"
            @compositionstart="onCompositionStart"
            @compositionend="onCompositionEnd"
            class="answer-box"
            ref="answerInputs"
          />
        </div>
        <button class="submit-btn" @click="submitAnswer" :disabled="!isAnswerComplete">
          提交
        </button>
      </div>
      
      <!-- 倒计时 - 图片加载完成后才显示 -->
      <div class="timer" v-if="!isAnswered && imageLoaded">
        倒计时: {{ countdown }}s
      </div>
      <!-- 图片加载中提示 -->
      <div class="timer loading-text" v-else-if="!isAnswered && imageLoading">
        图片加载中...
      </div>
      
            
      <!-- 结果反馈 -->
      <div class="result-message" v-if="isAnswered">
        <div v-if="isCorrect" class="correct-message">
          <div class="correct-title">猜对了！</div>
          <div class="correct-subtitle">{{ getCorrectMessage() }}</div>
          <div v-if="consecutiveCorrect >= 3" class="combo-message">
            {{ getComboMessage() }}
          </div>
        </div>
        <div v-else class="incorrect-message">
          <div class="incorrect-title">你被第一眼骗到了</div>
          <div class="incorrect-subtitle">这类题专门治"我以为"。</div>
        </div>
        
        <!-- 答案解析区域 -->
        <div v-if="isCorrect || showAnswer" class="answer-section">
          <div class="answer-reveal">
            <div class="answer-title">原来答案是</div>
            <div class="answer-text">{{ currentLevelData.correctAnswer }}</div>
          </div>
          <div class="explanation">
            <div class="explanation-title">脑洞解析</div>
            <div class="explanation-text">{{ currentLevelData.explanation }}</div>
          </div>
        </div>
        
        <!-- 答案解析按钮（仅答错时显示） -->
        <div v-else-if="isAnswered && !isCorrect" class="answer-button-section">
          <button 
            class="answer-btn"
            @click="showAnswerWithLimit"
            :disabled="answerCountLeft <= 0"
          >
            <span v-if="answerCountLeft > 0">答案解析 (剩余{{ answerCountLeft }}次)</span>
            <span v-else>次数已用完 ({{ formatResetTime }})</span>
          </button>
          <div class="answer-hint">每小时可查看30次答案</div>
        </div>
      </div>
    </div>
    
    <div class="game-footer">
      <button 
        class="next-btn"
        @click="nextLevel"
        v-if="isAnswered && isCorrect"
      >
        {{ isLastLevel ? '返回菜单' : '下一题' }}
      </button>
      <button 
        class="back-btn"
        @click="backToMenu"
      >
        返回模块
      </button>
    </div>
  </div>
</template>

<script>
import { getLevel, buildLevelKey, getNextLevelKey } from '../data/index.js'
import { completeLevel, getSingleModuleProgress, checkAndUnlockHonors } from '../services/storageService.js'
import { HONOR_LEVELS } from '../data/honors.js'
import { getImageConfig } from '../data/imageConfig.js'
import LoadingSpinner from './LoadingSpinner.vue'

export default {
  name: 'GameBoard',
  components: {
    LoadingSpinner
  },
  props: {
    levelData: {
      type: Object,
      required: true
      // { moduleId: 'children', levelId: 5 }
    },
    username: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentLevelData: {},
      answerChars: [],
      isAnswered: false,
      isCorrect: false,
      showAnswer: false, // 是否显示答案
      countdown: 30,
      consecutiveCorrect: 0,
      attempts: 3,
      timer: null,
      isComposing: false,
      // 图片加载状态
      imageLoaded: false,
      imageLoading: false,
      correctMessages: [
        '猜对了！',
        '漂亮，这题没骗到你！',
        '你这脑回路有点东西。'
      ],
      // 答案解析次数限制
      answerCountLeft: 30, // 剩余次数
      lastResetTime: null, // 上次重置时间
      // 【全民脑洞版】雪碧图位置配置 - 每张图可单独调整
      // 修改对应图片的数值来调试显示位置
      brainSpriteConfigs: {
        // 第1-9关：brain-1-9.png
        'brain-1-9': {
          xPositions: [1, 50, 99],  // 左、中、右
          yPositions: [1, 50, 99],  // 上、中、下
          backgroundSize: '300% 300%'
        },
        // 第10-18关：brain-10-18.png
        'brain-10-18': {
          xPositions: [1, 50, 99],  // 左、中、右
          yPositions: [1, 55, 105],  // 上、中、下
          backgroundSize: '320% 280%'
        },
        // 第19-27关：brain-19-27.png
        'brain-19-27': {
           xPositions: [1, 50, 99],  // 左、中、右
          yPositions: [1, 55, 105],  // 上、中、下
          backgroundSize: '300% 280%'
        },
        // 第28-36关：brain-28-36.png
        'brain-28-36': {
          xPositions: [1, 50, 99],  // 左、中、右
          yPositions: [1, 55, 105],  // 上、中、下
          backgroundSize: '300% 280%'
        },
        // 第37-45关：brain-37-45.png
        'brain-37-45': {
          xPositions: [1, 50, 99],  // 左、中、右
          yPositions: [1, 55, 105],  // 上、中、下
          backgroundSize: '300% 280%'
        },
        // 第46-54关：brain-46-54.png
        'brain-46-54': {
          xPositions: [1, 50, 99],  // 左、中、右
          yPositions: [1, 50, 99],  // 上、中、下
          backgroundSize: '300% 300%'
        },
        // 【热门主题版】雪碧图配置
        // 第1-9关：theme-1-9.png
        'theme-1-9': {
          xPositions: [1, 50, 99],  // 左、中、右
          yPositions: [1, 50, 99],  // 上、中、下
          backgroundSize: '300% 300%'
        },
        // 第10-18关：theme-10-18.png
        'theme-10-18': {
          xPositions: [1, 50, 99],  // 左、中、右
          yPositions: [1, 50, 99],  // 上、中、下
          backgroundSize: '300% 300%'
        },
        // 第19-27关：theme-19-27.png
        'theme-19-27': {
          xPositions: [1, 50, 99],  // 左、中、右
          yPositions: [1, 50, 99],  // 上、中、下
          backgroundSize: '300% 300%'
        },
        // 第28-36关：theme-28-36.png
        'theme-28-36': {
          xPositions: [1, 50, 99],  // 左、中、右
          yPositions: [1, 50, 99],  // 上、中、下
          backgroundSize: '300% 300%'
        },
        // 第37-45关：theme-37-45.png
        'theme-37-45': {
          xPositions: [1, 50, 99],  // 左、中、右
          yPositions: [1, 50, 99],  // 上、中、下
          backgroundSize: '300% 300%'
        },
        // 第46-54关：theme-46-54.png
        'theme-46-54': {
          xPositions: [1, 50, 99],  // 左、中、右
          yPositions: [1, 50, 99],  // 上、中、下
          backgroundSize: '300% 300%'
        }
      }
    }
  },
  computed: {
    levelKey() {
      return buildLevelKey(this.levelData.moduleId, this.levelData.levelId)
    },
    isLastLevel() {
      return this.levelData.levelId >= 54
    },
    isAnswerComplete() {
      return this.answerChars.every(char => char.trim() !== '')
    },
    // 格式化重置时间显示
    formatResetTime() {
      if (!this.lastResetTime) return ''
      const resetTime = new Date(this.lastResetTime + 60 * 60 * 1000) // 1小时后重置
      const now = new Date()
      const diff = resetTime - now
      if (diff <= 0) return '即将重置'
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      return `${minutes}分${seconds}秒后重置`
    }
  },
  mounted() {
    this.loadLevelData()
    this.loadAnswerLimitData()
    // 注意：倒计时现在由图片加载完成后自动启动
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    loadLevelData() {
      this.currentLevelData = getLevel(this.levelKey) || {}
      this.answerChars = Array(this.currentLevelData.answerLength || 2).fill('')
      this.isAnswered = false
      this.isCorrect = false
      this.showAnswer = false
      this.countdown = 30
      // 重置图片加载状态
      this.imageLoaded = false
      this.imageLoading = true

      // 预加载图片
      this.preloadImage()

      // 注意：输入框聚焦已移到图片加载完成后，防止键盘唤起时页面滚动
    },
    // 预加载图片
    preloadImage() {
      const imageUrl = this.currentLevelData.variantImage
      if (!imageUrl) {
        this.imageLoaded = true
        this.imageLoading = false
        this.startCountdown()
        return
      }

      // 判断是否为雪碧图
      if (this.isSpriteImage(imageUrl, this.currentLevelData.moduleId, this.currentLevelData.id)) {
        // 雪碧图使用 background-image，需要特殊处理
        this.preloadSpriteImage(imageUrl)
      } else {
        // 普通图片使用 Image 对象预加载
        const img = new Image()
        img.onload = () => {
          this.onImageLoad()
        }
        img.onerror = () => {
          this.onImageError()
        }
        img.src = imageUrl
      }
    },
    // 预加载雪碧图
    preloadSpriteImage(imageUrl) {
      const img = new Image()
      img.onload = () => {
        this.onImageLoad()
      }
      img.onerror = () => {
        this.onImageError()
      }
      img.src = imageUrl
    },
    // 图片加载完成
    onImageLoad() {
      this.imageLoaded = true
      this.imageLoading = false
      // 图片加载完成后启动倒计时
      this.startCountdown()
      // 图片加载完成后聚焦输入框，使用 preventScroll 防止页面滚动
      this.$nextTick(() => {
        if (this.$refs.answerInputs && this.$refs.answerInputs[0]) {
          // 使用 preventScroll 选项防止键盘唤起时页面滚动
          this.$refs.answerInputs[0].focus({ preventScroll: true })
        }
      })
    },
    // 图片加载失败
    onImageError() {
      console.error('图片加载失败:', this.currentLevelData.variantImage)
      this.imageLoaded = true
      this.imageLoading = false
      // 即使加载失败也启动倒计时，避免卡住
      this.startCountdown()
    },
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--
        } else {
          clearInterval(this.timer)
          if (!this.isAnswered) {
            // 倒计时结束，未答题也算答错
            this.handleTimeout()
          }
        }
      }, 1000)
    },
    // 倒计时结束处理
    async handleTimeout() {
      this.isCorrect = false
      this.isAnswered = true
      this.consecutiveCorrect = 0
      this.attempts--

      if (this.attempts <= 0) {
        // 显示复活弹窗
        const progress = await getSingleModuleProgress(this.username, this.levelData.moduleId)
        this.$emit('show-resurrection', {
          moduleName: this.levelData.moduleId,
          correctAnswers: progress.completedLevels.length
        })
      }
    },
    onKeydown(index, event) {
      const inputs = this.$refs.answerInputs;

      // 左右箭头切换
      if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        this.focusInput(index - 1);
      } else if (event.key === 'ArrowRight' && index < this.answerChars.length - 1) {
        event.preventDefault();
        this.focusInput(index + 1);
      } else if (event.key === 'Enter' && this.isAnswerComplete) {
        this.submitAnswer();
      } else if (event.key === 'Backspace' && !this.answerChars[index] && index > 0) {
        // 退格且当前为空，返回上一个输入框
        event.preventDefault();
        this.focusInput(index - 1);
      }
    },
    // 中文输入法开始
    onCompositionStart() {
      this.isComposing = true;
    },

    // 中文输入法结束
    onCompositionEnd(event) {
      this.isComposing = false;
      // 获取当前输入框的索引
      const index = this.getInputIndex(event.target);
      if (index === -1) return;
      this.handleMultiCharInput(index, event.target);
    },

    // 获取输入框索引
    getInputIndex(target) {
      const inputs = this.$refs.answerInputs;
      if (!inputs) return -1;
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] === target) return i;
      }
      return -1;
    },

    // 输入处理 - 多字符自动分配
    onInput(index, event) {
      // 中文输入法输入中，不处理
      if (this.isComposing) return;

      this.handleMultiCharInput(index, event.target);
    },

    // 处理多字符输入
    handleMultiCharInput(index, target) {
      const value = target.value;
      if (!value) return;

      // 提取有效字符（过滤空格）
      const chars = value.replace(/\s/g, '').split('');
      if (chars.length === 0) return;

      // 如果只有一个字符，直接更新并返回
      if (chars.length === 1) {
        this.answerChars[index] = chars[0];
        return;
      }

      // 多个字符：第一个字符留在当前输入框
      this.answerChars[index] = chars[0];

      // 剩余字符分配到后续输入框
      let charIndex = 1;
      for (let i = index + 1; i < this.answerChars.length && charIndex < chars.length; i++) {
        this.answerChars[i] = chars[charIndex];
        charIndex++;
      }

      // 强制更新当前输入框显示（只显示第一个字符）
      target.value = chars[0];

      // 触发 input 事件以更新 v-model
      target.dispatchEvent(new Event('input'));

      // 自动聚焦到下一个输入框
      const nextIndex = Math.min(index + charIndex - 1, this.answerChars.length - 1);
      this.focusInput(nextIndex);
    },

    // 聚焦到指定输入框
    focusInput(index) {
      this.$nextTick(() => {
        const inputs = this.$refs.answerInputs;
        if (inputs && inputs[index]) {
          inputs[index].focus();
          if (this.answerChars[index]) {
            inputs[index].select();
          }
        }
      });
    },

    async submitAnswer() {
      if (!this.isAnswerComplete) return

      const answer = this.answerChars.join('')
      const correct = answer === this.currentLevelData.correctAnswer

      this.isCorrect = correct
      this.isAnswered = true

      if (this.timer) {
        clearInterval(this.timer)
      }

      if (correct) {
        // 更新模块进度
        if (this.username) {
          await completeLevel(this.username, this.levelData.moduleId, this.levelData.levelId)
        }

        this.consecutiveCorrect++

        // 检查是否解锁新荣誉（需要用户名）
        if (this.username) {
          const progress = await getSingleModuleProgress(this.username, this.levelData.moduleId)
          const completedCount = progress.completedLevels.length
          const newlyUnlocked = await checkAndUnlockHonors(
            this.username,
            this.levelData.moduleId,
            completedCount
          )

          // 如果解锁了新荣誉，显示荣誉弹窗
          if (newlyUnlocked.length > 0) {
            this.$emit('honor-unlocked', {
              moduleId: this.levelData.moduleId,
              completedCount: completedCount,
              newlyUnlocked: newlyUnlocked
            })
            // 荣誉弹窗关闭后再进入下一题
            return
          }
        }

        // 检查是否是第54关（模块最后一关）
        if (this.levelData.levelId === 54) {
          // 模块完成，显示完成弹窗
          this.$emit('module-complete', {
            moduleId: this.levelData.moduleId
          })
          return
        }

        // 答对后直接进入下一题，不显示结果
        setTimeout(() => {
          this.nextLevel()
        }, 500) // 延迟500ms给用户一个反馈时间
      } else {
        this.consecutiveCorrect = 0
        this.attempts--

        // 答错后显示错误提示，但不跳转下一题
        this.isAnswered = true
        this.isCorrect = false

        if (this.timer) {
          clearInterval(this.timer)
        }

        if (this.attempts <= 0) {
          // 显示复活弹窗
          const progress = await getSingleModuleProgress(this.username, this.levelData.moduleId)
          this.$emit('show-resurrection', {
            moduleName: this.levelData.moduleId,
            correctAnswers: progress.completedLevels.length
          })
        }
        // 答错后停留在当前题，不自动跳转
      }
    },
    nextLevel() {
      if (this.isLastLevel) {
        // 模块完成，返回菜单
        this.$emit('back-to-menu')
      } else {
        // 下一关
        const nextKey = getNextLevelKey(this.levelKey)
        if (nextKey) {
          const parts = nextKey.split('-')
          this.$emit('start-game', {
            moduleId: parts[0],
            levelId: parseInt(parts[1])
          })
        }
      }
    },
    backToMenu() {
      this.$emit('back-to-menu')
    },
    // 加载答案次数限制数据
    loadAnswerLimitData() {
      try {
        const savedData = localStorage.getItem('answerLimitData')
        if (savedData) {
          const data = JSON.parse(savedData)
          const now = Date.now()
          const oneHour = 60 * 60 * 1000

          // 检查是否需要重置次数（超过1小时）
          if (data.lastResetTime && now - data.lastResetTime >= oneHour) {
            this.answerCountLeft = 30
            this.lastResetTime = now
            this.saveAnswerLimitData()
          } else {
            this.answerCountLeft = data.answerCountLeft ?? 5
            this.lastResetTime = data.lastResetTime || now
          }
        } else {
          // 首次使用，初始化数据
          this.answerCountLeft = 30
          this.lastResetTime = Date.now()
          this.saveAnswerLimitData()
        }
      } catch (error) {
        console.error('加载答案限制数据失败:', error)
        this.answerCountLeft = 5
        this.lastResetTime = Date.now()
      }
    },
    // 保存答案次数限制数据
    saveAnswerLimitData() {
      try {
        const data = {
          answerCountLeft: this.answerCountLeft,
          lastResetTime: this.lastResetTime
        }
        localStorage.setItem('answerLimitData', JSON.stringify(data))
      } catch (error) {
        console.error('保存答案限制数据失败:', error)
      }
    },
    // 显示答案（带次数限制）
    showAnswerWithLimit() {
      // 检查是否需要重置次数
      const now = Date.now()
      const oneHour = 60 * 60 * 1000
      if (this.lastResetTime && now - this.lastResetTime >= oneHour) {
        this.answerCountLeft = 30
        this.lastResetTime = now
      }

      // 检查剩余次数
      if (this.answerCountLeft > 0) {
        this.answerCountLeft--
        this.showAnswer = true
        this.saveAnswerLimitData()
      }
    },
    // 获取单独图片的显示样式
    getImageStyle(moduleId, levelId) {
      const config = getImageConfig(moduleId, levelId)
      if (!config || config.isSprite) {
        return {} // 雪碧图不需要额外样式
      }
      
      // 根据 aspectRatio 计算显示尺寸
      // aspectRatio 格式: '3:4' 表示宽:高
      const [widthRatio, heightRatio] = config.aspectRatio.split(':').map(Number)
      const ratio = widthRatio / heightRatio
      
      // 容器尺寸: 280px x 360px
      const containerWidth = 280
      const containerHeight = 360
      const containerRatio = containerWidth / containerHeight
      
      let maxWidth, maxHeight
      
      if (ratio > containerRatio) {
        // 图片比容器更宽，以宽度为基准
        maxWidth = containerWidth - 60 // 留出边距
        maxHeight = maxWidth / ratio
      } else {
        // 图片比容器更高，以高度为基准
        maxHeight = containerHeight - 80 // 留出边距
        maxWidth = maxHeight * ratio
      }
      
      return {
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
        objectFit: config.displayMode,
        objectPosition: 'center'
      }
    },
    isSpriteImage(imagePath, moduleId, levelId) {
      // 所有模块现在都使用单独图片，不再使用雪碧图
      return false
    },
    getSpriteStyle(imagePath, type, levelId, moduleId) {
      // 雪碧图是 3x3 网格
      // 根据 moduleId 和 levelId 计算索引，不再依赖图片路径
      let spriteIndex
      
      // 全民脑洞版雪碧图 (brain)
      if (moduleId === 'brain') {
        if (levelId >= 46 && levelId <= 54) {
          spriteIndex = (levelId - 46) % 9 // 46->0, 47->1, ..., 54->8
        } else if (levelId >= 37 && levelId <= 45) {
          spriteIndex = (levelId - 37) % 9 // 37->0, 38->1, ..., 45->8
        } else if (levelId >= 28 && levelId <= 36) {
          spriteIndex = (levelId - 28) % 9 // 28->0, 29->1, ..., 36->8
        } else if (levelId >= 19 && levelId <= 27) {
          spriteIndex = (levelId - 19) % 9 // 19->0, 20->1, ..., 27->8
        } else if (levelId >= 10 && levelId <= 18) {
          spriteIndex = (levelId - 10) % 9 // 10->0, 11->1, ..., 18->8
        } else {
          spriteIndex = (levelId - 1) % 9 // 1-9 -> 0-8
        }
      }
      // 热门主题版雪碧图 (theme)
      else if (moduleId === 'theme') {
        if (levelId >= 46 && levelId <= 54) {
          spriteIndex = (levelId - 46) % 9
        } else if (levelId >= 37 && levelId <= 45) {
          spriteIndex = (levelId - 37) % 9
        } else if (levelId >= 28 && levelId <= 36) {
          spriteIndex = (levelId - 28) % 9
        } else if (levelId >= 19 && levelId <= 27) {
          spriteIndex = (levelId - 19) % 9
        } else if (levelId >= 10 && levelId <= 18) {
          spriteIndex = (levelId - 10) % 9
        } else {
          spriteIndex = (levelId - 1) % 9
        }
      }
      // 儿童启蒙版雪碧图 (children)
      else if (moduleId === 'children') {
        if (levelId >= 46 && levelId <= 54) {
          spriteIndex = (levelId - 46) % 9
        } else if (levelId >= 37 && levelId <= 45) {
          spriteIndex = (levelId - 37) % 9
        } else if (levelId >= 28 && levelId <= 36) {
          spriteIndex = (levelId - 28) % 9
        } else if (levelId >= 19 && levelId <= 27) {
          spriteIndex = (levelId - 19) % 9
        } else if (levelId >= 10 && levelId <= 18) {
          spriteIndex = (levelId - 10) % 9
        } else {
          spriteIndex = (levelId - 1) % 9 // 1-9 -> 0-8
        }
      } else {
        // 默认情况
        spriteIndex = (levelId - 1) % 9
      }

      const row = Math.floor(spriteIndex / 3) // 0, 0, 0, 1, 1, 1, 2, 2, 2
      const col = spriteIndex % 3 // 0, 1, 2, 0, 1, 2, 0, 1, 2

      let xPercent, yPercent, bgSize

      // 全民脑洞版 + 热门主题版使用精确定位（基于实际布局计算）
      if (moduleId === 'brain' || moduleId === 'theme') {
        // 根据 moduleId 和 levelId 获取对应配置
        let configKey = ''
        if (moduleId === 'brain') {
          if (levelId >= 1 && levelId <= 9) configKey = 'brain-1-9'
          else if (levelId >= 10 && levelId <= 18) configKey = 'brain-10-18'
          else if (levelId >= 19 && levelId <= 27) configKey = 'brain-19-27'
          else if (levelId >= 28 && levelId <= 36) configKey = 'brain-28-36'
          else if (levelId >= 37 && levelId <= 45) configKey = 'brain-37-45'
          else if (levelId >= 46 && levelId <= 54) configKey = 'brain-46-54'
        } else if (moduleId === 'theme') {
          if (levelId >= 1 && levelId <= 9) configKey = 'theme-1-9'
          else if (levelId >= 10 && levelId <= 18) configKey = 'theme-10-18'
          else if (levelId >= 19 && levelId <= 27) configKey = 'theme-19-27'
          else if (levelId >= 28 && levelId <= 36) configKey = 'theme-28-36'
          else if (levelId >= 37 && levelId <= 45) configKey = 'theme-37-45'
          else if (levelId >= 46 && levelId <= 54) configKey = 'theme-46-54'
        }

        // 获取对应配置，如果不存在则使用默认值
        const config = this.brainSpriteConfigs[configKey] || {
          xPositions: [17, 50, 83],
          yPositions: [17, 50, 83],
          backgroundSize: '300% 300%'
        }
        xPercent = config.xPositions[col]
        yPercent = config.yPositions[row]
        bgSize = config.backgroundSize
      } else {
        // 儿童启蒙版使用标准定位：0%, 50%, 100%
        xPercent = col * 50
        yPercent = row * 50
        bgSize = '300% 300%'
      }

      return {
        backgroundImage: `url(${imagePath})`,
        backgroundPosition: `${xPercent}% ${yPercent}%`,
        backgroundSize: bgSize,
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%'
      }
    },
    getCorrectMessage() {
      const randomIndex = Math.floor(Math.random() * this.correctMessages.length)
      return this.correctMessages[randomIndex]
    },
    getComboMessage() {
      if (this.consecutiveCorrect >= 10) {
        return '10连对：这不像第一次玩'
      } else if (this.consecutiveCorrect >= 8) {
        return '8连对：出题人开始慌了'
      } else if (this.consecutiveCorrect >= 5) {
        return '5连对：你有点难骗'
      } else if (this.consecutiveCorrect >= 3) {
        return '3连对：脑子开始热机了'
      }
      return ''
    }
  },
  watch: {
    levelData() {
      this.loadLevelData()
      this.startCountdown()
    }
  }
}
</script>

<style>
.game-board {
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #fff3fd;
  /* 防止键盘唤起时页面滚动 */
  position: relative;
  overflow: hidden;
}


/* 游戏内容区 */
.game-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 图片显示区域 */
.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* 图片加载中 */
.image-loading {
  width: 280px;
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 0;
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.1);
  border: 3px solid #264653;
}

.image {
  width: 280px;
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 0;
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.1);
  border: 3px solid #264653;
}

.image img {
  /* 默认样式，会被动态样式覆盖 */
  display: block;
  margin: auto;
  object-fit: contain;
  object-position: center;
}

.sprite-image {
  position: relative;
}

.sprite {
  display: block;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
}

.image-text {
  font-size: 1.1rem;
  font-weight: bold;
  color: #264653;
  text-align: center;
}

/* 答题区域 */
.answer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}


.answer-boxes {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.answer-box {
  width: 55px;
  height: 65px;
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  border: 3px solid #8b6914;
  border-radius: 0;
  background: #fff;
  color: #5c3d00;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 0 #8b6914;
  font-family: 'Arial', sans-serif;
  text-transform: uppercase;
  min-width: 55px;
}

.answer-box:focus {
  border-color: #f4a261;
  box-shadow: 0 0 0 3px rgba(244, 162, 97, 0.3), 0 4px 0 #8b6914;
  transform: translateY(-2px);
}

.submit-btn {
  padding: 14px 32px;
  border: 2px solid #8b6914;
  border-radius: 0;
  background: linear-gradient(145deg, #06d6a0, #05b591);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 0 #048b72;
  min-width: 160px;
  text-align: center;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #048b72;
}

.submit-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #048b72;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 倒计时 */
.timer {
  font-size: 1.1rem;
  font-weight: bold;
  color: #e63946;
  text-align: center;
  padding: 12px 24px;
  background: #f5d1fd;
  border-radius: 0;
  border: 2px solid #e63946;
  animation: pulse 1s infinite;
  align-self: center;
}

/* 加载中文字样式 */
.timer.loading-text {
  color: #6b0dab;
  border-color: #6b0dab;
  background: #f0e6ff;
  animation: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}


/* 结果反馈 */
.result-message {
  padding: 20px;
  border-radius: 0;
  text-align: center;
  background: #feebff;
  border: 2px solid #6b0dab;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.correct-message,
.incorrect-message {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.correct-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #06d6a0;
  text-shadow: 1px 1px 0 #fff;
}

.correct-subtitle {
  font-size: 1rem;
  color: #06d6a0;
  font-weight: bold;
}

.incorrect-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #e63946;
  text-shadow: 1px 1px 0 #fff;
}

.incorrect-subtitle {
  font-size: 1rem;
  color: #e63946;
  font-weight: bold;
}

.combo-message {
  font-size: 1rem;
  font-weight: bold;
  color: #ffd709;
  background: #5c3d00;
  padding: 8px 16px;
  border-radius: 0;
  margin-top: 8px;
}

.answer-reveal {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f5d1fd;
  padding: 16px;
  border-radius: 0;
  border: 2px solid #6b0dab;
}

.answer-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: #6b0dab;
}

.answer-text {
  font-size: 1.3rem;
  font-weight: bold;
  color: #264653;
}

.explanation {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #feebff;
  padding: 16px;
  border-radius: 0;
  border: 2px solid #6b0dab;
}

.explanation-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: #6b0dab;
}

.explanation-text {
  font-size: 0.9rem;
  color: #264653;
  line-height: 1.6;
  text-align: left;
}

/* 答案解析按钮区域 */
.answer-button-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  padding: 20px;
  background: #f5d1fd;
  border-radius: 0;
  border: 2px solid #6b0dab;
}

.answer-btn {
  padding: 14px 32px;
  border: 2px solid #8b6914;
  border-radius: 0;
  background: linear-gradient(145deg, #f4a261, #e76f51);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 0 #8b6914;
  min-width: 200px;
  text-align: center;
}

.answer-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #8b6914;
}

.answer-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #8b6914;
}

.answer-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: linear-gradient(145deg, #ccc, #999);
  border-color: #666;
  box-shadow: 0 4px 0 #666;
}

.answer-hint {
  font-size: 0.85rem;
  color: #6b0dab;
  font-weight: bold;
}

/* 答案区域 */
.answer-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 底部按钮区 */
.game-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.back-btn,
.next-btn {
  padding: 14px 24px;
  border: 2px solid #8b6914;
  border-radius: 0;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 0 #8b6914;
  text-align: center;
}

.back-btn {
  background: linear-gradient(145deg, #ffd709, #ffd166);
  color: #5c3d00;
}

.next-btn {
  background: linear-gradient(145deg, #f4a261, #e76f51);
  color: white;
}

.back-btn:hover,
.next-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #8b6914;
}

.back-btn:active,
.next-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #8b6914;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .game-board {
    max-width: 600px;
    margin: 0 auto;
    padding: 24px;
  }
  
  .game-footer {
    flex-direction: row;
    justify-content: space-between;
  }
  
  .back-btn,
  .next-btn {
    flex: 1;
    max-width: 200px;
  }
}
</style>