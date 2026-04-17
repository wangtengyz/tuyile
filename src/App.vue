<template>
  <div class="app">
    <header class="app-header" v-if="currentView !== 'game'">
      <div class="resurrection-countdown" v-if="isInResurrectionPeriod">
        距离可答题：{{ formatTime(resurrectionTimeLeft) }}
      </div>
      <div class="header-content">
        <h1>图一乐</h1>
        <p>一眼会认，二眼烧脑</p>
      </div>
      <div class="header-actions" v-if="username">
        <div class="user-info">
          <span class="username">{{ username }}</span>
          <span class="correct-count">答对: {{ totalCorrectAnswers }}</span>
        </div>
        <button class="settings-btn" @click="openSettings">设置</button>
      </div>
      <div class="header-actions" v-else>
        <button class="settings-btn" @click="openSettings">设置</button>
      </div>
    </header>
    
    <main class="app-main">
      <UserConfig v-if="currentView === 'userConfig'" @start-game="startGame" @config-saved="configSaved" />
      <LevelSelect v-if="currentView === 'levelSelect'"
        :module-progress="moduleProgress"
        :debug-mode="debugMode"
        @start-game="startGame"
        @test-honor="showTestHonorModal"
        @open-honor-wall="currentView = 'honorWall'"
        @toggle-debug="toggleDebugMode" />
      <GameBoard v-else-if="currentView === 'game'"
        :level-data="currentLevelData"
        :username="username"
        @game-over="gameOver"
        @back-to-menu="backToMenu"
        @start-game="startGame"
        @game-reset="resetGame"
        @show-resurrection="showResurrectionModal"
        @honor-unlocked="showHonorModal"
        @module-complete="showModuleCompleteModal" />
      <ResultModal v-if="showResult" :result="gameResult" @close="closeResult" />
      <ShareModal v-if="showShare" :module-name="shareModalData.moduleName" :correct-answers="shareModalData.correctAnswers" @close="closeShare" />
      <ResurrectionModal v-if="showResurrection" :remainingTime="resurrectionTimeLeft" @close="closeResurrection" />
      <HonorDetailModal
        v-if="showHonorDetail"
        :honor="currentHonorData"
        @close="closeHonorModal"
        @next="goToNextLevel"
      />
      <ModuleCompleteModal
        v-if="showModuleComplete"
        :module-name="moduleCompleteData.moduleName"
        @close="closeModuleCompleteModal"
        @go-honor="goToHonorWallFromComplete"
      />
      <HonorWall
        v-else-if="currentView === 'honorWall'"
        :unlocked-honors="unlockedHonors"
        :debug-mode="debugMode"
        @back="backToMenu"
      />
    </main>
    
    <footer class="app-footer">
      <p>©2026 宸汐宝的猜图乐园</p>
    </footer>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import UserConfig from './components/UserConfig.vue'
import LevelSelect from './components/LevelSelect.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import HonorWall from './components/HonorWall.vue'
import HonorDetailModal from './components/HonorDetailModal.vue'
import { HONOR_CONFIG } from './data/honors.js'
import {
  getUsername, setUsername,
  initStorage, migrateOldData,
  getModuleProgress, completeLevel,
  setResurrectionTime, getResurrectionTime, clearResurrectionTime,
  getDefaultModuleProgress,
  getUnlockedHonors, getDefaultUnlockedHonors
} from './services/storageService.js'

const GameBoard = defineAsyncComponent({
  loader: () => import('./components/GameBoard.vue'),
  loadingComponent: LoadingSpinner,
  delay: 200
})

const ResultModal = defineAsyncComponent(() => import('./components/ResultModal.vue'))
const ShareModal = defineAsyncComponent(() => import('./components/ShareModal.vue'))
const ResurrectionModal = defineAsyncComponent(() => import('./components/ResurrectionModal.vue'))

const ModuleCompleteModal = defineAsyncComponent(() => import('./components/ModuleCompleteModal.vue'))

export default {
  name: 'App',
  components: {
    LevelSelect,
    GameBoard,
    ResultModal,
    ShareModal,
    UserConfig,
    ResurrectionModal,
    HonorWall,
    HonorDetailModal,
    ModuleCompleteModal
  },
  data() {
    return {
      currentView: 'userConfig',
      currentLevelData: { moduleId: 'children', levelId: 1 },
      showResult: false,
      showShare: false,
      showResurrection: false,
      resurrectionTimeLeft: 0,
      isInResurrectionPeriod: false,
      gameResult: {
        correct: false,
        answer: '',
        explanation: ''
      },
      username: '',
      moduleProgress: getDefaultModuleProgress(),
      unlockedHonors: {
        children: [],
        brain: [],
        theme: []
      },
      shareModalData: {
        moduleName: 'children',
        correctAnswers: 0
      },
      resurrectionTimer: null,
      showHonorDetail: false,
      currentHonorData: null,
      honorUnlockCallback: null,
      debugMode: false,
      showModuleComplete: false,
      moduleCompleteData: {
        moduleId: '',
        moduleName: ''
      }
    }
  },
  computed: {
    totalCorrectAnswers() {
      let total = 0
      for (const moduleName of ['children', 'brain', 'theme']) {
        const moduleData = this.moduleProgress[moduleName]
        if (moduleData && moduleData.completedLevels) {
          total += moduleData.completedLevels.length
        }
      }
      return total
    }
  },
  async mounted() {
    try {
      await initStorage()
      this.username = getUsername()
      if (this.username) {
        await migrateOldData(this.username)
        this.moduleProgress = await getModuleProgress(this.username)
        this.unlockedHonors = await getUnlockedHonors(this.username)
        this.currentView = 'levelSelect'
        await this.checkResurrectionStatus()
      }
    } catch (error) {
      console.error('初始化失败:', error)
    }
  },
  methods: {
    startGame(levelData) {
      this.currentLevelData = levelData
      this.currentView = 'game'
    },
    backToMenu() {
      this.currentView = 'levelSelect'
      // 刷新模块进度
      this.refreshModuleProgress()
    },
    async refreshModuleProgress() {
      if (this.username) {
        this.moduleProgress = await getModuleProgress(this.username)
      }
    },
    async refreshUnlockedHonors() {
      if (this.username) {
        this.unlockedHonors = await getUnlockedHonors(this.username)
      }
    },
    async gameOver(result) {
      try {
        this.gameResult = result
        this.showResult = true

        if (result.correct && this.username) {
          await completeLevel(this.username, result.moduleId, result.levelId)
          this.moduleProgress = await getModuleProgress(this.username)
        }
      } catch (error) {
        console.error('游戏结束处理失败:', error)
      }
    },
    closeResult() {
      this.showResult = false
    },
    closeShare() {
      this.showShare = false
      this.currentView = 'levelSelect'
    },
    async configSaved(username) {
      try {
        setUsername(username)
        await initStorage()
        this.username = username
        await migrateOldData(username)
        this.moduleProgress = await getModuleProgress(username)
        this.unlockedHonors = await getUnlockedHonors(username)
        this.currentView = 'levelSelect'
        await this.checkResurrectionStatus()
      } catch (error) {
        console.error('保存配置失败:', error)
      }
    },
    resetGame() {
      this.currentView = 'levelSelect'
    },
    async showResurrectionModal(data) {
      try {
        const resurrectionTime = Date.now() + 3 * 60 * 1000
        await setResurrectionTime(this.username, resurrectionTime)
        this.resurrectionTimeLeft = 180
        this.isInResurrectionPeriod = true

        const moduleName = data?.moduleName || 'children'
        const moduleCorrect = data?.correctAnswers || 0

        if (moduleCorrect >= 10) {
          this.shareModalData = { moduleName, correctAnswers: moduleCorrect }
          this.showShare = true
        }

        this.showResurrection = true
        this.startResurrectionTimer()
      } catch (error) {
        console.error('设置复活时间失败:', error)
      }
    },
    showTestHonorModal() {
      this.shareModalData = { moduleName: 'children', correctAnswers: 10 }
      this.showShare = true
    },
    // 显示荣誉弹窗
    showHonorModal(data) {
      const { moduleId, completedCount, newlyUnlocked } = data
      // 获取最新解锁的荣誉等级（取最大的）
      const latestLevel = Math.max(...newlyUnlocked)
      const moduleConfig = HONOR_CONFIG[moduleId]
      const honorConfig = moduleConfig.honors.find(h => h.level === latestLevel)

      this.currentHonorData = {
        ...honorConfig,
        moduleName: moduleConfig.name,
        completedCount
      }
      this.showHonorDetail = true
      // 保存回调，关闭弹窗后进入下一题
      this.honorUnlockCallback = () => {
        this.startGame(this.currentLevelData)
      }
    },
    // 关闭荣誉弹窗
    closeHonorModal() {
      this.showHonorDetail = false
      this.currentHonorData = null
      // 关闭后进入下一题
      if (this.honorUnlockCallback) {
        this.honorUnlockCallback()
        this.honorUnlockCallback = null
      }
    },
    // 荣誉弹窗点击下一题
    goToNextLevel() {
      this.showHonorDetail = false
      this.currentHonorData = null
      // 找到下一关
      const nextLevelId = this.currentLevelData.levelId + 1
      if (nextLevelId <= 54) {
        this.startGame({
          moduleId: this.currentLevelData.moduleId,
          levelId: nextLevelId
        })
      } else {
        // 模块完成，返回菜单
        this.backToMenu()
      }
    },
    // 显示模块完成弹窗
    showModuleCompleteModal(data) {
      const moduleNames = {
        children: '儿童启蒙版',
        brain: '全民脑洞版',
        theme: '热门主题版'
      }
      this.moduleCompleteData = {
        moduleId: data.moduleId,
        moduleName: moduleNames[data.moduleId] || data.moduleId
      }
      this.showModuleComplete = true
    },
    // 关闭模块完成弹窗
    closeModuleCompleteModal() {
      this.showModuleComplete = false
      this.backToMenu()
    },
    // 从模块完成弹窗跳转到荣誉墙
    goToHonorWallFromComplete() {
      this.showModuleComplete = false
      this.currentView = 'honorWall'
    },
    closeResurrection() {
      this.showResurrection = false
    },
    startResurrectionTimer() {
      // Clear any existing timer
      if (this.resurrectionTimer) {
        clearInterval(this.resurrectionTimer)
      }
      this.resurrectionTimer = setInterval(() => {
        if (this.resurrectionTimeLeft > 0) {
          this.resurrectionTimeLeft--
        } else {
          clearInterval(this.resurrectionTimer)
          this.resurrectionTimer = null
          this.onResurrectionTimerEnd()
        }
      }, 1000)
    },
    async onResurrectionTimerEnd() {
      // 倒计时结束时自动继续游戏
      try {
        await clearResurrectionTime(this.username)
        this.isInResurrectionPeriod = false
        this.showResurrection = false
        this.resurrectionTimeLeft = 0
        // 自动进入当前关卡继续答题
        this.startGame(this.currentLevelData)
      } catch (error) {
        console.error('复活结束处理失败:', error)
      }
    },
    openSettings() {
      this.currentView = 'userConfig'
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    },
    async checkResurrectionStatus() {
      if (!this.username) return
      try {
        const savedResurrectionTime = await getResurrectionTime(this.username)
        if (savedResurrectionTime && savedResurrectionTime > Date.now()) {
          this.isInResurrectionPeriod = true
          this.resurrectionTimeLeft = Math.floor((savedResurrectionTime - Date.now()) / 1000)
          this.startResurrectionTimer()
        } else {
          this.isInResurrectionPeriod = false
        }
      } catch (error) {
        console.error('检查复活状态失败:', error)
      }
    },
    toggleDebugMode() {
      this.debugMode = !this.debugMode
      console.log('调试模式:', this.debugMode ? '开启' : '关闭')
    }
  },
  beforeUnmount() {
    if (this.resurrectionTimer) {
      clearInterval(this.resurrectionTimer)
      this.resurrectionTimer = null
    }
  }
}
</script>

<style>
/* 全局样式 - 像素风格 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff3fd;
  font-family: 'Arial', sans-serif;
  position: relative;
  overflow-x: hidden;
  /* 游戏页面时防止键盘唤起滚动 */
  overflow-y: auto;
}

/* 头部样式 - 像素风格 */
.app-header {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #f4a261 0%, #e76f51 50%, #2a9d8f 100%);
  color: white;
  box-shadow: 0 4px 0 #264653;
  position: relative;
  border-bottom: 4px solid #264653;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.resurrection-countdown {
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  color: #ffd166;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
  border-radius: 0;
  border: 2px solid #ffd166;
  animation: pulse 1s infinite;
}

.header-content {
  text-align: center;
  width: 100%;
  margin-top: 4px;
}

.header-content h1 {
  font-size: 1.4rem;
  margin-bottom: 4px;
  font-weight: bold;
  text-shadow: 2px 2px 0 #264653, -1px -1px 0 #264653;
  letter-spacing: 1px;
  color: #ffffff;
}

.header-content p {
  font-size: 0.8rem;
  opacity: 0.95;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  max-width: 90%;
  margin: 0 auto;
  color: #ffffff;
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 4px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.username {
  font-size: 0.8rem;
  font-weight: bold;
  color: #ffd166;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
  border-radius: 0;
  border: 2px solid #ffd166;
  text-align: center;
}

.correct-count {
  font-size: 0.8rem;
  font-weight: bold;
  color: #06d6a0;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
  border-radius: 0;
  border: 2px solid #06d6a0;
  text-align: center;
}

.settings-btn {
  padding: 8px 16px;
  border: 2px solid #8b6914;
  border-radius: 0;
  background: linear-gradient(145deg, #ffd709, #ffd166);
  color: #5c3d00;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 0 #6c5a00;
  font-family: 'Arial', sans-serif;
  min-width: 80px;
  min-height: 44px;
  z-index: 100;
  position: relative;
}

.settings-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #6c5a00;
}

.settings-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #6c5a00;
}

/* 主内容区样式 - 像素风格 */
.app-main {
  flex: 1;
  width: 100%;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 5;
  gap: 8px;
}

/* 底部样式 - 像素风格 */
.app-footer {
  width: 100%;
  padding: 12px;
  text-align: center;
  background: #264653;
  color: white;
  font-size: 0.75rem;
  margin-top: auto;
  border-top: 4px solid #f4a261;
  position: relative;
  z-index: 10;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式设计 - 像素风格 */
@media (min-width: 768px) {
  .app-header {
    flex-direction: row;
    justify-content: space-between;
    padding: 16px;
    gap: 12px;
  }

  .resurrection-countdown {
    top: 12px;
    left: 16px;
    font-size: 0.8rem;
    padding: 6px 12px;
  }

  .header-content {
    flex: 2;
    margin-top: 0;
  }

  .header-content h1 {
    font-size: 1.8rem;
    margin-bottom: 8px;
  }

  .header-content p {
    font-size: 0.9rem;
  }

  .header-actions {
    flex: 1;
    justify-content: flex-end;
    margin-top: 0;
    gap: 12px;
  }

  .user-info {
    flex-direction: row;
    gap: 8px;
  }

  .username,
  .correct-count {
    font-size: 0.9rem;
    padding: 6px 12px;
  }

  .settings-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
    min-width: 100px;
  }

  .app-main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px 16px;
  }

  .app-footer {
    padding: 16px;
    font-size: 0.85rem;
  }
}
</style>