<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="share-header">
        <h2>晒一下你的段位</h2>
        <!-- 新解锁提示 -->
        <div v-if="newlyUnlocked.length > 0" class="new-unlock-notice">
          <p>🎉 恭喜解锁新荣誉！</p>
        </div>
      </div>
      <div class="share-content">
        <div class="honor-image-container">
          <img :src="honorImagePath" alt="荣誉图" class="honor-image" ref="honorImage" />
        </div>
        <div class="share-buttons">
          <button class="share-btn primary" @click="downloadHonor">
            保存海报
          </button>
          <button class="share-btn secondary" @click="$emit('close')">
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkAndUnlockHonors } from '../services/storageService.js'

export default {
  name: 'ShareModal',
  props: {
    moduleName: {
      type: String,
      default: 'children',
      validator: (value) => ['children', 'brain', 'theme'].includes(value)
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    username: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      newlyUnlocked: [], // 新解锁的荣誉等级数组
      isChecking: false
    }
  },
  async mounted() {
    // 检查并解锁荣誉
    await this.checkAndUnlockHonor();
  },
  computed: {
    honorImagePath() {
      const moduleIndex = {
        children: '模块一',
        brain: '模块二',
        theme: '模块三'
      }
      const modulePrefix = moduleIndex[this.moduleName]
      const honorLevel = this.getHonorLevel(this.correctAnswers)
      return `/honor/${modulePrefix}${honorLevel}荣誉.png`
    }
  },
  methods: {
    // 检查并解锁荣誉
    async checkAndUnlockHonor() {
      // 条件检查：需要username且correctAnswers >= 10
      if (!this.username || this.correctAnswers < 10) return;

      this.isChecking = true;
      try {
        const newlyUnlocked = await checkAndUnlockHonors(
          this.username,
          this.moduleName,
          this.correctAnswers
        );
        this.newlyUnlocked = newlyUnlocked;

        if (newlyUnlocked.length > 0) {
          console.log('[ShareModal] Newly unlocked honors:', newlyUnlocked);
          // 触发事件通知父组件
          this.$emit('honors-unlocked', {
            moduleName: this.moduleName,
            levels: newlyUnlocked
          });
        }
      } catch (error) {
        console.error('[ShareModal] Failed to check honor unlock:', error);
      } finally {
        this.isChecking = false;
      }
    },
    getHonorLevel(correctAnswers) {
      if (correctAnswers >= 50) return 50
      if (correctAnswers >= 40) return 40
      if (correctAnswers >= 30) return 30
      if (correctAnswers >= 20) return 20
      return 10
    },
    downloadHonor() {
      const link = document.createElement('a')
      link.href = this.honorImagePath
      link.download = `${this.moduleName}_${this.getHonorLevel(this.correctAnswers)}荣誉.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: #feebff;
  border-radius: 0;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border: 2px solid #6b0dab;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.share-header {
  text-align: center;
}

.share-header h2 {
  font-size: 1.6rem;
  font-weight: bold;
  color: #264653;
  margin: 0;
  text-shadow: 1px 1px 0 #fff;
}

.new-unlock-notice {
  margin-top: 12px;
  padding: 12px;
  background: linear-gradient(145deg, #ffd709, #ffd166);
  border: 2px solid #8b6914;
  color: #5c3d00;
  font-weight: bold;
}

.share-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.honor-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5d1fd;
  border: 2px solid #6b0dab;
  padding: 16px;
}

.honor-image {
  max-width: 280px;
  max-height: 280px;
  object-fit: contain;
}

.share-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.share-btn {
  padding: 14px;
  border: 2px solid #8b6914;
  border-radius: 0;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 0 #8b6914;
  text-align: center;
  min-height: 56px;
}

.share-btn.primary {
  background: linear-gradient(145deg, #ffd709, #ffd166);
  color: #5c3d00;
}

.share-btn.secondary {
  background: linear-gradient(145deg, #f4a261, #e76f51);
  color: white;
  border-color: #c1440e;
  box-shadow: 0 4px 0 #c1440e;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #8b6914;
}

.share-btn.secondary:hover {
  box-shadow: 0 6px 0 #c1440e;
}

.share-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #8b6914;
}

.share-btn.secondary:active {
  box-shadow: 0 2px 0 #c1440e;
}

@media (min-width: 768px) {
  .modal-content {
    max-width: 500px;
    padding: 30px;
  }

  .share-header h2 {
    font-size: 1.8rem;
  }

  .honor-image {
    max-width: 320px;
    max-height: 320px;
  }
}
</style>