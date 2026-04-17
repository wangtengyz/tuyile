<template>
  <div class="app" @click="closeDebugMenu">
    <header class="app-header" v-if="showHeader">
      <div class="header-main">
        <div class="brand-area">
          <button
            v-if="showBackButton"
            class="icon-btn"
            @click.stop="goBackFromHeader"
            aria-label="返回首页"
          >
            ←
          </button>
          <div class="brand-text">
            <h1>图一乐 <span>TYL</span></h1>
            <p>{{ currentSubtitle }}</p>
          </div>
        </div>

        <div class="header-tools">
          <div class="user-pill" v-if="username">
            <span class="user-name">{{ username }}</span>
            <span class="user-score">答对 {{ totalCorrectAnswers }}</span>
          </div>
          <div class="debug-entry" @click.stop>
            <button class="icon-btn" @click="toggleDebugMenu" aria-label="打开调试菜单">
              ⚙
            </button>
            <div class="debug-menu" v-if="showDebugMenu">
              <button @click="toggleDebugMode">{{ debugMode ? '关闭' : '开启' }}调试模式</button>
              <button @click="showTestHonorModalAndClose">测试荣誉弹窗</button>
              <button @click="openSettings">切换用户名</button>
            </div>
          </div>
        </div>
      </div>

      <div class="resurrection-countdown" v-if="isInResurrectionPeriod">
        距离可答题：{{ formatTime(resurrectionTimeLeft) }}
      </div>
    </header>

    <main class="app-main">
      <UserConfig
        v-if="currentView === 'userConfig'"
        @start-game="startGame"
        @config-saved="configSaved"
      />

      <HomePage
        v-else-if="currentView === 'home'"
        :username="username"
        :total-correct-answers="totalCorrectAnswers"
        @start-challenge="startChallenge"
        @open-module-challenge="goToModuleChallenge"
        @open-honor-wall="goToHonorWall"
      />

      <LevelSelect
        v-else-if="currentView === 'moduleChallenge'"
        :module-progress="moduleProgress"
        :debug-mode="debugMode"
        @start-game="startGame"
      />

      <HonorWall
        v-else-if="currentView === 'honorWall'"
        :unlocked-honors="unlockedHonors"
        :debug-mode="debugMode"
        @back="goHome"
      />

      <GameBoard
        v-else-if="currentView === 'game'"
        :level-data="currentLevelData"
        :username="username"
        @game-over="gameOver"
        @back-to-menu="backToMenu"
        @start-game="startGame"
        @game-reset="resetGame"
        @show-resurrection="showResurrectionModal"
        @honor-unlocked="showHonorModal"
        @module-complete="showModuleCompleteModal"
      />

      <ResultModal v-if="showResult" :result="gameResult" @close="closeResult" />
      <ShareModal
        v-if="showShare"
        :module-name="shareModalData.moduleName"
        :correct-answers="shareModalData.correctAnswers"
        @close="closeShare"
      />
      <ResurrectionModal
        v-if="showResurrection"
        :remainingTime="resurrectionTimeLeft"
        @close="closeResurrection"
      />
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
    </main>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import UserConfig from './components/UserConfig.vue'
import HomePage from './components/HomePage.vue'
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
  getUnlockedHonors
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
    UserConfig,
    HomePage,
    LevelSelect,
    HonorWall,
    HonorDetailModal,
    GameBoard,
    ResultModal,
    ShareModal,
    ResurrectionModal,
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
      showDebugMenu: false,
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
    },
    showHeader() {
      return this.currentView !== 'game' && this.currentView !== 'userConfig'
    },
    showBackButton() {
      return this.currentView === 'moduleChallenge' || this.currentView === 'honorWall'
    },
    currentSubtitle() {
      if (this.currentView === 'moduleChallenge') return '挑战模式选择'
      if (this.currentView === 'honorWall') return '荣誉墙'
      return '一眼会认，二眼烧脑'
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
        this.currentView = 'home'
        await this.checkResurrectionStatus()
      }
    } catch (error) {
      console.error('初始化失败:', error)
    }
  },
  methods: {
    startChallenge() {
      this.currentView = 'moduleChallenge'
      this.closeDebugMenu()
    },
    goHome() {
      this.currentView = 'home'
      this.closeDebugMenu()
      this.refreshModuleProgress()
    },
    goToModuleChallenge() {
      this.currentView = 'moduleChallenge'
      this.closeDebugMenu()
      this.refreshModuleProgress()
    },
    goToHonorWall() {
      this.currentView = 'honorWall'
      this.closeDebugMenu()
      this.refreshUnlockedHonors()
    },
    goBackFromHeader() {
      if (this.currentView === 'moduleChallenge' || this.currentView === 'honorWall') {
        this.goHome()
      }
    },
    toggleDebugMenu() {
      this.showDebugMenu = !this.showDebugMenu
    },
    closeDebugMenu() {
      this.showDebugMenu = false
    },
    startGame(levelData) {
      this.currentLevelData = levelData
      this.currentView = 'game'
      this.closeDebugMenu()
    },
    backToMenu() {
      this.currentView = 'moduleChallenge'
      this.refreshModuleProgress()
      this.closeDebugMenu()
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
      this.currentView = 'moduleChallenge'
      this.closeDebugMenu()
    },
    async configSaved(username) {
      try {
        setUsername(username)
        await initStorage()
        this.username = username
        await migrateOldData(username)
        this.moduleProgress = await getModuleProgress(username)
        this.unlockedHonors = await getUnlockedHonors(username)
        this.currentView = 'home'
        await this.checkResurrectionStatus()
      } catch (error) {
        console.error('保存配置失败:', error)
      }
    },
    resetGame() {
      this.currentView = 'moduleChallenge'
      this.closeDebugMenu()
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
    showTestHonorModalAndClose() {
      this.showTestHonorModal()
      this.closeDebugMenu()
    },
    showHonorModal(data) {
      const { moduleId, completedCount, newlyUnlocked } = data
      const latestLevel = Math.max(...newlyUnlocked)
      const moduleConfig = HONOR_CONFIG[moduleId]
      const honorConfig = moduleConfig.honors.find(h => h.level === latestLevel)

      this.currentHonorData = {
        ...honorConfig,
        moduleName: moduleConfig.name,
        completedCount
      }
      this.showHonorDetail = true
      this.honorUnlockCallback = () => {
        this.startGame(this.currentLevelData)
      }
    },
    closeHonorModal() {
      this.showHonorDetail = false
      this.currentHonorData = null
      if (this.honorUnlockCallback) {
        this.honorUnlockCallback()
        this.honorUnlockCallback = null
      }
    },
    goToNextLevel() {
      this.showHonorDetail = false
      this.currentHonorData = null
      const nextLevelId = this.currentLevelData.levelId + 1
      if (nextLevelId <= 54) {
        this.startGame({
          moduleId: this.currentLevelData.moduleId,
          levelId: nextLevelId
        })
      } else {
        this.backToMenu()
      }
    },
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
    closeModuleCompleteModal() {
      this.showModuleComplete = false
      this.backToMenu()
    },
    goToHonorWallFromComplete() {
      this.showModuleComplete = false
      this.currentView = 'honorWall'
      this.closeDebugMenu()
    },
    closeResurrection() {
      this.showResurrection = false
    },
    startResurrectionTimer() {
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
      try {
        await clearResurrectionTime(this.username)
        this.isInResurrectionPeriod = false
        this.showResurrection = false
        this.resurrectionTimeLeft = 0
        this.startGame(this.currentLevelData)
      } catch (error) {
        console.error('复活结束处理失败:', error)
      }
    },
    openSettings() {
      this.currentView = 'userConfig'
      this.closeDebugMenu()
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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.app {
  min-height: 100vh;
  background: #fff3fd;
  color: #3b2841;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 12px 12px 10px;
  background: #fff3fd;
  border-bottom: 2px solid #bfa5c4;
  box-shadow: 0 3px 0 rgba(59, 40, 65, 0.12);
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.brand-area {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.brand-text h1 {
  font-size: 1.2rem;
  line-height: 1.1;
  color: #3b2841;
  white-space: nowrap;
}

.brand-text h1 span {
  font-size: 0.88rem;
  color: #6c5a00;
  margin-left: 2px;
}

.brand-text p {
  font-size: 0.72rem;
  color: #6a546f;
  margin-top: 2px;
}

.header-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-pill {
  display: none;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.7rem;
  border: 1px solid #866f8c;
  background: #f5d1fd;
  padding: 4px 8px;
}

.user-name {
  color: #3b2841;
  font-weight: 700;
}

.user-score {
  color: #6c5a00;
  font-weight: 700;
}

.icon-btn {
  min-width: 36px;
  min-height: 36px;
  border: 2px solid #6c5a00;
  background: #ffd709;
  color: #5b4b00;
  font-weight: 800;
  font-size: 0.92rem;
  cursor: pointer;
  box-shadow: 2px 2px 0 #3b2841;
}

.icon-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #3b2841;
}

.debug-entry {
  position: relative;
}

.debug-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 176px;
  border: 2px solid #866f8c;
  background: #fff;
  box-shadow: 4px 4px 0 #3b2841;
  overflow: hidden;
}

.debug-menu button {
  width: 100%;
  border: none;
  border-bottom: 1px solid #e0c6e5;
  background: #fff;
  color: #3b2841;
  text-align: left;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 10px 12px;
  cursor: pointer;
}

.debug-menu button:last-child {
  border-bottom: none;
}

.debug-menu button:hover {
  background: #feebff;
}

.resurrection-countdown {
  margin-top: 8px;
  border: 1px solid #b02500;
  background: #ffefec;
  color: #b02500;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 4px 8px;
}

.app-main {
  width: 100%;
}

@media (min-width: 768px) {
  .app-header {
    padding: 14px 20px 12px;
  }

  .brand-text h1 {
    font-size: 1.34rem;
  }

  .brand-text p {
    font-size: 0.8rem;
  }

  .user-pill {
    display: flex;
  }
}
</style>
