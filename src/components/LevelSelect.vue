<template>
  <div class="module-page">
    <section class="page-header">
      <h1>模块挑战</h1>
      <p>选择你要进入的模式，继续你的像素征程。</p>
    </section>

    <div class="module-cards">
      <article class="module-card">
        <div class="card-top">
          <span class="module-icon">🙂</span>
          <span class="module-badge">Lv 1-3</span>
        </div>
        <h2>儿童启蒙版</h2>
        <p class="module-desc">专为小朋友设计的简单像素图，包含水果、小动物和生活用品。</p>
        <p class="progress-text">已完成 {{ getCompletedCount('children') }}/54 关</p>
        <div class="module-tags">
          <span class="tag">#简单</span>
          <span class="tag">#可爱</span>
          <span class="tag">#学习</span>
        </div>
        <div class="level-grid">
          <button
            v-for="levelId in getVisibleLevels('children')"
            :key="`children-${levelId}`"
            class="level-btn"
            :class="{
              completed: isLevelCompleted('children', levelId),
              current: levelId === getNextPlayableLevel('children'),
              locked: !isLevelUnlocked('children', levelId)
            }"
            :disabled="!isLevelUnlocked('children', levelId)"
            @click="selectLevel('children', levelId)"
          >
            {{ levelId }}
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
      </article>

      <article class="module-card">
        <div class="card-top">
          <span class="module-icon">🧠</span>
          <span class="module-badge danger">Hard</span>
        </div>
        <h2>全民脑洞版</h2>
        <p class="module-desc">抽象像素艺术的极致考验。只有你想不到，没有我们拼不出的脑洞大作。</p>
        <p class="progress-text">已完成 {{ getCompletedCount('brain') }}/54 关</p>
        <div class="module-tags">
          <span class="tag">#烧脑</span>
          <span class="tag">#抽象</span>
          <span class="tag">#热门</span>
        </div>
        <div class="level-grid">
          <button
            v-for="levelId in getVisibleLevels('brain')"
            :key="`brain-${levelId}`"
            class="level-btn"
            :class="{
              completed: isLevelCompleted('brain', levelId),
              current: levelId === getNextPlayableLevel('brain'),
              locked: !isLevelUnlocked('brain', levelId)
            }"
            :disabled="!isLevelUnlocked('brain', levelId)"
            @click="selectLevel('brain', levelId)"
          >
            {{ levelId }}
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
      </article>

      <article class="module-card">
        <div class="card-top">
          <span class="module-icon">⭐</span>
          <span class="module-badge">主题</span>
        </div>
        <h2>热门主题版</h2>
        <p class="module-desc">定期更新的主题活动。电影、名画、地标建筑，在特定领域证明你的实力。</p>
        <p class="progress-text">已完成 {{ getCompletedCount('theme') }}/54 关</p>
        <div class="module-tags">
          <span class="tag">#限时</span>
          <span class="tag">#文化</span>
          <span class="tag">#收集</span>
        </div>
        <div class="level-grid">
          <button
            v-for="levelId in getVisibleLevels('theme')"
            :key="`theme-${levelId}`"
            class="level-btn"
            :class="{
              completed: isLevelCompleted('theme', levelId),
              current: levelId === getNextPlayableLevel('theme'),
              locked: !isLevelUnlocked('theme', levelId)
            }"
            :disabled="!isLevelUnlocked('theme', levelId)"
            @click="selectLevel('theme', levelId)"
          >
            {{ levelId }}
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
      </article>
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
    getVisibleLevels(moduleId) {
      const currentLevel = this.getNextPlayableLevel(moduleId)
      const isExpanded = this.expandedModules[moduleId]

      if (isExpanded) {
        return Array.from({ length: 54 }, (_, i) => i + 1)
      }

      const currentRow = Math.ceil(currentLevel / 7)
      const startLevel = (currentRow - 1) * 7 + 1
      const endLevel = Math.min(currentRow * 7, 54)
      return Array.from({ length: endLevel - startLevel + 1 }, (_, i) => startLevel + i)
    },
    toggleExpand(moduleId) {
      this.expandedModules[moduleId] = !this.expandedModules[moduleId]
    }
  }
}
</script>

<style scoped>
.module-page {
  width: 100%;
  min-height: 100%;
  padding: 18px 14px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #fff3fd;
}

.page-header {
  padding: 4px 2px 6px;
}

.page-header h1 {
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  font-size: 1.75rem;
  line-height: 1.1;
  color: #3b2841;
  margin-bottom: 6px;
}

.page-header p {
  font-size: 0.9rem;
  color: #6a546f;
  line-height: 1.5;
}

.module-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.module-card {
  border: 2px solid #bfa5c4;
  background: #feebff;
  padding: 14px;
  box-shadow: 4px 4px 0 #3b2841;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.module-icon {
  font-size: 1.6rem;
  line-height: 1;
}

.module-badge {
  font-size: 0.68rem;
  font-weight: 700;
  color: #004d57;
  background: #00e3fd;
  border: 1px solid #005762;
  padding: 2px 8px;
}

.module-badge.danger {
  color: #520c00;
  background: #f95630;
  border-color: #b02500;
}

.module-card h2 {
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  font-size: 1.24rem;
  color: #3b2841;
  margin-bottom: 6px;
}

.module-desc {
  color: #6a546f;
  font-size: 0.84rem;
  line-height: 1.55;
  margin-bottom: 10px;
}

.progress-text {
  color: #6b0dab;
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.module-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.tag {
  border: 1px solid #866f8c;
  background: #f5d1fd;
  color: #6a546f;
  padding: 2px 8px;
  font-size: 0.68rem;
  font-weight: 700;
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.level-btn {
  min-height: 32px;
  border: 1px solid #6b0dab;
  background: #fff;
  color: #6b0dab;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0 #3b2841;
}

.level-btn.completed {
  background: #06d6a0;
  border-color: #047a5c;
  color: #003e2f;
}

.level-btn.current {
  background: #ffd709;
  border-color: #6c5a00;
  color: #5b4b00;
}

.level-btn.locked {
  background: #efe4f2;
  border-color: #bfa5c4;
  color: #866f8c;
  box-shadow: none;
}

.level-grid-actions {
  margin-top: 10px;
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.expand-btn {
  border: 1px solid #6b0dab;
  background: #e7c5ff;
  color: #6b0dab;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 12px;
  cursor: pointer;
  box-shadow: 2px 2px 0 #3b2841;
}

.module-btn {
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  width: 100%;
  min-height: 46px;
  border: 2px solid #6c5a00;
  background: #ffd709;
  color: #5b4b00;
  font-size: 0.98rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 3px 3px 0 #3b2841;
}

.module-btn:active,
.expand-btn:active,
.level-btn:active:not(:disabled) {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #3b2841;
}

@media (min-width: 768px) {
  .module-page {
    max-width: 860px;
    margin: 0 auto;
    padding: 24px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .module-cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .module-cards .module-card:last-child {
    grid-column: span 2;
  }
}
</style>
