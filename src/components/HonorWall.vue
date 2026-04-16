<template>
  <div class="honor-wall">
    <div class="wall-header">
      <h1>荣誉墙</h1>
      <p class="subtitle">挑战自我，解锁荣誉</p>
    </div>

    <div class="wall-content">
      <div v-if="debugMode" class="debug-banner">
        🔧 调试模式：所有荣誉已解锁
      </div>
      <HonorSection
        v-for="moduleId in moduleIds"
        :key="moduleId"
        :moduleId="moduleId"
        :unlockedLevels="debugMode ? [10, 20, 30, 40, 50] : (unlockedHonors[moduleId] || [])"
        @view-honor="openHonorDetail"
      />
    </div>

    <div class="wall-footer">
      <button class="back-btn" @click="$emit('back')">
        返回
      </button>
    </div>

    <!-- 荣誉详情模态框 -->
    <HonorDetailModal
      v-if="selectedHonor"
      :honor="selectedHonor"
      :moduleId="selectedModuleId"
      @close="selectedHonor = null"
    />
  </div>
</template>

<script>
import HonorSection from './HonorSection.vue'
import HonorDetailModal from './HonorDetailModal.vue'
import { VALID_MODULES } from '../data/honors.js'

export default {
  name: 'HonorWall',
  components: {
    HonorSection,
    HonorDetailModal
  },
  props: {
    unlockedHonors: {
      type: Object,
      default: () => ({
        children: [],
        brain: [],
        theme: []
      })
    },
    debugMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedHonor: null,
      selectedModuleId: ''
    }
  },
  computed: {
    moduleIds() {
      return VALID_MODULES; // ['children', 'brain', 'theme']
    }
  },
  methods: {
    openHonorDetail({ moduleId, honor }) {
      this.selectedModuleId = moduleId;
      this.selectedHonor = honor;
    }
  }
}
</script>

<style scoped>
.honor-wall {
  min-height: 100vh;
  background: #fff3fd;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.wall-header {
  text-align: center;
  padding: 24px 0;
  margin-bottom: 16px;
}

.wall-header h1 {
  font-size: 1.8rem;
  color: #6b0dab;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.subtitle {
  font-size: 0.9rem;
  color: #6b0dab;
  opacity: 0.8;
  margin: 0;
}

.wall-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.debug-banner {
  background: #ff6b6b;
  color: white;
  padding: 8px 16px;
  text-align: center;
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 12px;
  border: 2px solid #e63946;
}

.wall-footer {
  padding: 24px 0;
  display: flex;
  justify-content: center;
}

.back-btn {
  padding: 12px 32px;
  font-size: 1rem;
  font-weight: 600;
  color: #6b0dab;
  background: linear-gradient(135deg, #ffd93d 0%, #ffb800 100%);
  border: 3px solid #6b0dab;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow:
    4px 4px 0 #6b0dab,
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    6px 6px 0 #6b0dab,
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.back-btn:active {
  transform: translateY(0);
  box-shadow:
    2px 2px 0 #6b0dab,
    inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Desktop styles */
@media (min-width: 768px) {
  .honor-wall {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px 32px;
  }

  .wall-header {
    padding: 32px 0;
  }

  .wall-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .back-btn {
    padding: 14px 40px;
    font-size: 1.1rem;
  }
}
</style>
