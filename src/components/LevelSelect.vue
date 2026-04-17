<template>
  <div class="level-select">
    <div class="top-actions">
      <div class="test-honor-btn" @click="$emit('test-honor')">
        测试荣誉弹窗
      </div>
      <div class="honor-wall-entry" @click="$emit('open-honor-wall')">
        🏆 荣誉墙
      </div>
    </div>
    <div class="debug-bar">
      <label class="debug-switch">
        <input type="checkbox" :checked="debugMode" @change="$emit('toggle-debug')">
        <span class="debug-label">调试模式 {{ debugMode ? 'ON' : 'OFF' }}</span>
      </label>
      <span v-if="debugMode" class="debug-hint">所有关卡和荣誉已解锁</span>
    </div>
    <div class="page-header">
      <h1>选择你的挑战模式</h1>
      <p>三种玩法，三种翻车方式。</p>
    </div>

    <div class="module-cards">
      <!-- 儿童启蒙版 -->
      <div class="module-card">
        <div class="module-header">
          <h2>儿童启蒙版</h2>
          <p class="module-desc">看着最简单，最容易让大人破防。</p>
        </div>
        <div class="progress-bar">
          <span class="progress-text">已完成 {{ getCompletedCount('children') }}/54 关</span>
        </div>
        <div class="module-tags">
          <span class="tag">认图</span>
          <span class="tag">联想</span>
          <span class="tag">可爱反转</span>
          <span class="tag">亲子友好</span>
        </div>
        <div class="level-grid">
          <button
            v-for="levelId in getVisibleLevels('children')"
            :key="`children-${levelId}`"
            class="level-btn"
            :class="{
              'completed': isLevelCompleted('children', levelId),
              'current': levelId === getNextPlayableLevel('children'),
              'locked': !isLevelUnlocked('children', levelId)
            }"
            :disabled="!isLevelUnlocked('children', levelId)"
            @click="selectLevel('children', levelId)"
          >
            <span class="level-number">{{ levelId }}</span>
          </button>
        </div>
        <div class="level-grid-actions">
          <button class="expand-btn" @click="toggleExpand('children')">
            {{ expandedModules.children ? '收起 ▲' : '展开全部 ▼' }}
          </button>
        </div>
        <button class="module-btn" @click="selectLevel('children', getNextPlayableLevel('children'))">
          {{ getModuleButtonText('children') }}
        </button>
      </div>

      <!-- 全民脑洞版 -->
      <div class="module-card">
        <div class="module-header">
          <h2>全民脑洞版</h2>
          <p class="module-desc">一张图，两层意思，专治"我以为"。</p>
        </div>
        <div class="progress-bar">
          <span class="progress-text">已完成 {{ getCompletedCount('brain') }}/54 关</span>
        </div>
        <div class="module-tags">
          <span class="tag">脑筋急转弯</span>
          <span class="tag">谐音梗</span>
          <span class="tag">图像反转</span>
          <span class="tag">高能联想</span>
        </div>
        <div class="level-grid">
          <button
            v-for="levelId in getVisibleLevels('brain')"
            :key="`brain-${levelId}`"
            class="level-btn"
            :class="{
              'completed': isLevelCompleted('brain', levelId),
              'current': levelId === getNextPlayableLevel('brain'),
              'locked': !isLevelUnlocked('brain', levelId)
            }"
            :disabled="!isLevelUnlocked('brain', levelId)"
            @click="selectLevel('brain', levelId)"
          >
            <span class="level-number">{{ levelId }}</span>
          </button>
        </div>
        <div class="level-grid-actions">
          <button class="expand-btn" @click="toggleExpand('brain')">
            {{ expandedModules.brain ? '收起 ▲' : '展开全部 ▼' }}
          </button>
        </div>
        <button class="module-btn" @click="selectLevel('brain', getNextPlayableLevel('brain'))">
          {{ getModuleButtonText('brain') }}
        </button>
      </div>

      <!-- 热门主题版 -->
      <div class="module-card">
        <div class="module-header">
          <h2>热门主题版</h2>
          <p class="module-desc">网感在线的人，通常会笑着翻车。</p>
        </div>
        <div class="progress-bar">
          <span class="progress-text">已完成 {{ getCompletedCount('theme') }}/54 关</span>
        </div>
        <div class="module-tags">
          <span class="tag">热梗</span>
          <span class="tag">互联网</span>
          <span class="tag">社交感</span>
          <span class="tag">评论区体质</span>
        </div>
        <div class="level-grid">
          <button
            v-for="levelId in getVisibleLevels('theme')"
            :key="`theme-${levelId}`"
            class="level-btn"
            :class="{
              'completed': isLevelCompleted('theme', levelId),
              'current': levelId === getNextPlayableLevel('theme'),
              'locked': !isLevelUnlocked('theme', levelId)
            }"
            :disabled="!isLevelUnlocked('theme', levelId)"
            @click="selectLevel('theme', levelId)"
          >
            <span class="level-number">{{ levelId }}</span>
          </button>
        </div>
        <div class="level-grid-actions">
          <button class="expand-btn" @click="toggleExpand('theme')">
            {{ expandedModules.theme ? '收起 ▲' : '展开全部 ▼' }}
          </button>
        </div>
        <button class="module-btn" @click="selectLevel('theme', getNextPlayableLevel('theme'))">
          {{ getModuleButtonText('theme') }}
        </button>
      </div>
    </div>

    <div class="bottom-tip">
      <p>别急着选最难的，先看看自己到底是哪路选手。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LevelSelect',
  props: {
    moduleProgress: {
      type: Object,
      default: () => ({
        children: { currentLevel: 1, completedLevels: [] },
        brain: { currentLevel: 1, completedLevels: [] },
        theme: { currentLevel: 1, completedLevels: [] }
      })
    },
    debugMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expandedModules: {
        children: false,
        brain: false,
        theme: false
      }
    }
  },
  methods: {
    selectLevel(moduleId, levelId) {
      this.$emit('start-game', { moduleId, levelId })
    },
    isLevelCompleted(moduleId, levelId) {
      if (this.debugMode) return true
      return this.moduleProgress[moduleId]?.completedLevels?.includes(levelId) || false
    },
    isLevelUnlocked(moduleId, levelId) {
      if (this.debugMode) return true
      if (levelId === 1) return true
      return this.isLevelCompleted(moduleId, levelId - 1)
    },
    getCompletedCount(moduleId) {
      return this.moduleProgress[moduleId]?.completedLevels?.length || 0
    },
    getNextPlayableLevel(moduleId) {
      const progress = this.moduleProgress[moduleId]
      if (!progress) return 1
      if (progress.completedLevels.includes(progress.currentLevel)) {
        return Math.min(54, progress.currentLevel + 1)
      }
      return progress.currentLevel
    },
    getModuleButtonText(moduleId) {
      const completed = this.getCompletedCount(moduleId)
      if (completed === 0) return '开始挑战'
      if (completed >= 54) return '已完成'
      return '继续挑战'
    },
    // 获取要显示的关卡列表（可折叠）
    getVisibleLevels(moduleId) {
      const currentLevel = this.getNextPlayableLevel(moduleId)
      const isExpanded = this.expandedModules[moduleId]

      if (isExpanded) {
        // 展开状态：显示所有54关
        return Array.from({ length: 54 }, (_, i) => i + 1)
      }

      // 折叠状态：只显示当前关卡附近的一行（7个）
      // 计算当前关卡所在的行（每行7个）
      const currentRow = Math.ceil(currentLevel / 7)
      const startLevel = (currentRow - 1) * 7 + 1
      const endLevel = Math.min(currentRow * 7, 54)

      return Array.from({ length: endLevel - startLevel + 1 }, (_, i) => startLevel + i)
    },
    // 切换展开/折叠
    toggleExpand(moduleId) {
      this.expandedModules[moduleId] = !this.expandedModules[moduleId]
    },
    // 获取显示的起始关卡（用于样式定位）
    getStartLevelForGrid(moduleId) {
      const visibleLevels = this.getVisibleLevels(moduleId)
      return visibleLevels[0] || 1
    }
  }
}
</script>

<style scoped>
/* ===== 基础样式 ===== */
.level-select {
  width: 100%;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fff3fd;
  min-height: 100vh;
}

/* ===== 页面头部 ===== */
.page-header {
  text-align: center;
  margin-bottom: 8px;
  padding: 12px;
}

.page-header h1 {
  font-size: 1.6rem;
  color: #6b0dab;
  margin-bottom: 8px;
  font-weight: bold;
  border-radius: 0;
}

.page-header p {
  font-size: 0.85rem;
  color: #6b0dab;
  opacity: 0.8;
}

/* ===== 模块卡片 - 无圆角背景分层 ===== */
.module-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-card {
  background: #feebff;
  border: 2px solid #f5d1fd;
  border-radius: 0;
  padding: 12px;
  position: relative;
}

.module-header {
  margin-bottom: 8px;
}

.module-header h2 {
  font-size: 1.2rem;
  color: #6b0dab;
  margin-bottom: 6px;
  font-weight: bold;
  border-radius: 0;
}

.module-desc {
  font-size: 0.8rem;
  color: #6b0dab;
  opacity: 0.8;
  line-height: 1.4;
}

/* ===== 进度条 ===== */
.progress-bar {
  margin-bottom: 10px;
  padding: 4px 0;
}

.progress-text {
  font-size: 0.85rem;
  color: #6b0dab;
  font-weight: bold;
}

/* ===== 标签样式 - 次级按钮紫色主题 ===== */
.module-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  background: #e7c5ff;
  color: #6b0dab;
  border: 2px solid #6b0dab;
  padding: 4px 8px;
  border-radius: 0;
  font-size: 0.7rem;
  font-weight: bold;
}

/* ===== 关卡网格和按钮 - 像素风格 ===== */
.level-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 8px;
}

.level-btn {
  padding: 6px 4px;
  border: 2px solid #6b0dab;
  border-radius: 0;
  background: #f5d1fd;
  color: #6b0dab;
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 0 #6c5a00;
  min-height: 32px;
  min-width: 32px;
}

.level-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 0 #6c5a00;
}

.level-btn:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow: 0 1px 0 #6c5a00;
}

.level-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* 已完成关卡 - 绿色背景 */
.level-btn.completed {
  background: #06d6a0;
  color: #fff;
  border-color: #047a5c;
  box-shadow: 0 2px 0 #047a5c;
}

.level-btn.completed:hover {
  box-shadow: 0 3px 0 #047a5c;
}

.level-btn.completed:active {
  box-shadow: 0 1px 0 #047a5c;
}

/* 当前关卡 - 黄色高亮 */
.level-btn.current {
  background: #ffd709;
  color: #5c3d00;
  border-color: #8b6914;
  box-shadow: 0 2px 0 #6c5a00;
}

.level-btn.current:hover {
  box-shadow: 0 3px 0 #6c5a00;
}

.level-btn.current:active {
  box-shadow: 0 1px 0 #6c5a00;
}

/* 锁定关卡 - 灰色 */
.level-btn.locked {
  background: #e0e0e0;
  color: #999;
  border-color: #999;
  box-shadow: 0 2px 0 #666;
}

.level-number {
  font-size: 0.75rem;
  font-weight: bold;
}

.level-check {
  font-size: 0.9rem;
  font-weight: bold;
}

/* ===== 模块按钮 - 黄色主题 ===== */
.module-btn {
  width: 100%;
  padding: 12px;
  border: 2px solid #8b6914;
  border-radius: 0;
  background: linear-gradient(145deg, #ffd709, #ffd166);
  color: #5c3d00;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 0 #6c5a00;
  text-align: center;
  min-height: 44px;
}

.module-btn:hover {
  box-shadow: 0 6px 0 #6c5a00;
  transform: translateY(-2px);
}

.module-btn:active {
  box-shadow: 0 2px 0 #6c5a00;
  transform: translateY(2px);
}

/* ===== 底部提示 ===== */
.bottom-tip {
  text-align: center;
  margin-top: 8px;
  padding: 12px;
}

.bottom-tip p {
  font-size: 0.8rem;
  color: #6b0dab;
  opacity: 0.7;
}

/* ===== 顶部操作区 ===== */
.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

/* ===== 调试栏 ===== */
.debug-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #2a2a2a;
  border: 2px solid #ff6b6b;
  margin-bottom: 12px;
}

.debug-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.debug-switch input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #ff6b6b;
}

.debug-label {
  font-size: 0.85rem;
  font-weight: bold;
  color: #ff6b6b;
}

.debug-hint {
  font-size: 0.75rem;
  color: #06d6a0;
  font-weight: bold;
}

/* ===== 测试荣誉按钮 ===== */
.test-honor-btn {
  flex: 1;
  padding: 8px 16px;
  border: 2px solid #6b0dab;
  border-radius: 0;
  background: #e7c5ff;
  color: #6b0dab;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 2px 0 #6b0dab;
}

.test-honor-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 0 #6b0dab;
}

.test-honor-btn:active {
  transform: translateY(1px);
  box-shadow: 0 1px 0 #6b0dab;
}

/* ===== 荣誉墙入口 ===== */
.honor-wall-entry {
  flex: 1;
  padding: 8px 16px;
  border: 2px solid #8b6914;
  border-radius: 0;
  background: linear-gradient(145deg, #ffd709, #ffd166);
  color: #5c3d00;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 2px 0 #6c5a00;
}

.honor-wall-entry:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 0 #6c5a00;
}

.honor-wall-entry:active {
  transform: translateY(1px);
  box-shadow: 0 1px 0 #6c5a00;
}

/* ===== 关卡网格操作区 ===== */
.level-grid-actions {
  display: flex;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 12px;
}

.expand-btn {
  padding: 6px 16px;
  border: 2px solid #6b0dab;
  border-radius: 0;
  background: #e7c5ff;
  color: #6b0dab;
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 0 #6b0dab;
}

.expand-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 0 #6b0dab;
}

.expand-btn:active {
  transform: translateY(1px);
  box-shadow: 0 1px 0 #6b0dab;
}

/* ===== 响应式样式 ===== */
@media (min-width: 768px) {
  .level-select {
    max-width: 700px;
    margin: 0 auto;
    padding: 24px;
    gap: 16px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .page-header p {
    font-size: 1rem;
  }

  .module-card {
    padding: 20px;
  }

  .module-header h2 {
    font-size: 1.4rem;
  }

  .module-desc {
    font-size: 0.9rem;
  }

  .progress-text {
    font-size: 1rem;
  }

  .tag {
    font-size: 0.8rem;
    padding: 6px 12px;
  }

  .level-grid {
    gap: 8px;
  }

  .level-btn {
    min-height: 40px;
    font-size: 0.85rem;
    padding: 8px 6px;
  }

  .level-number {
    font-size: 0.85rem;
  }

  .level-check {
    font-size: 1.1rem;
  }

  .module-btn {
    padding: 16px;
    font-size: 1.1rem;
    min-height: 52px;
  }
}
</style>
