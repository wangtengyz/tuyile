<template>
  <div class="honor-section">
    <div class="section-header">
      <h3>{{ config.name }}</h3>
      <span class="unlock-progress">已解锁 {{ unlockedCount }}/{{ totalCount }}</span>
    </div>

    <div class="honor-grid">
      <div
        v-for="honor in config.honors"
        :key="honor.level"
        class="honor-item"
        :class="{
          'unlocked': isUnlocked(honor.level),
          'locked': !isUnlocked(honor.level)
        }"
        @click="handleClick(honor)"
      >
        <template v-if="isUnlocked(honor.level)">
          <img :src="honor.image" :alt="honor.title" class="honor-thumb" />
          <span class="honor-title">{{ honor.title }}</span>
        </template>
        <template v-else>
          <div class="locked-placeholder">
            <span class="lock-icon">🔒</span>
            <span class="unlock-hint">{{ honor.description }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { HONOR_CONFIG } from '../data/honors.js'

export default {
  name: 'HonorSection',
  props: {
    moduleId: {
      type: String,
      required: true,
      validator: (value) => ['children', 'brain', 'theme'].includes(value)
    },
    unlockedLevels: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    config() {
      return HONOR_CONFIG[this.moduleId] || { name: '', honors: [] }
    },
    unlockedCount() {
      return this.unlockedLevels.length
    },
    totalCount() {
      return this.config.honors?.length || 0
    }
  },
  methods: {
    isUnlocked(level) {
      // 支持两种格式：数字数组 [10, 20, 30] 或对象数组 [{level: 10, unlockedAt: 123}]
      return this.unlockedLevels.some(item => {
        if (typeof item === 'number') {
          return item === level
        }
        return item.level === level
      })
    },
    handleClick(honor) {
      if (this.isUnlocked(honor.level)) {
        this.$emit('view-honor', {
          moduleId: this.moduleId,
          level: honor.level,
          honor: honor
        })
      }
    }
  }
}
</script>

<style scoped>
.honor-section {
  background: #fff3fd;
  border: 2px solid #f5d1fd;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f5d1fd;
}

.section-header h3 {
  font-size: 1.2rem;
  color: #6b0dab;
  margin: 0;
  font-weight: 600;
}

.unlock-progress {
  font-size: 0.85rem;
  color: #06d6a0;
  font-weight: 500;
}

.honor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.honor-item {
  aspect-ratio: 1;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.honor-item.locked {
  background: #e8e8e8;
  border: 2px dashed #bbb;
  cursor: not-allowed;
}

.honor-item.unlocked {
  background: #ffffff;
  border: 2px solid #06d6a0;
  box-shadow: 0 2px 8px rgba(6, 214, 160, 0.15);
}

.honor-item.unlocked:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(6, 214, 160, 0.25);
}

.honor-thumb {
  width: 60%;
  height: 60%;
  object-fit: contain;
  margin-bottom: 8px;
}

.honor-title {
  font-size: 0.8rem;
  color: #6b0dab;
  font-weight: 500;
  text-align: center;
  padding: 0 4px;
}

.locked-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 8px;
}

.lock-icon {
  font-size: 1.5rem;
  margin-bottom: 4px;
  opacity: 0.6;
}

.unlock-hint {
  font-size: 0.7rem;
  color: #888;
  text-align: center;
  line-height: 1.3;
}

/* Desktop styles */
@media (min-width: 768px) {
  .honor-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
  }

  .honor-section {
    padding: 20px;
  }

  .section-header h3 {
    font-size: 1.3rem;
  }

  .unlock-progress {
    font-size: 0.9rem;
  }

  .honor-thumb {
    width: 70%;
    height: 70%;
  }

  .honor-title {
    font-size: 0.9rem;
  }

  .lock-icon {
    font-size: 2rem;
  }

  .unlock-hint {
    font-size: 0.75rem;
  }
}
</style>
