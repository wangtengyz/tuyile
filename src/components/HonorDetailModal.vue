<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="detail-header">
        <h2>{{ honor.title }}</h2>
        <p v-if="unlockTime" class="unlock-time">解锁于 {{ formattedUnlockTime }}</p>
      </div>

      <div class="image-container">
        <img :src="honor.image" :alt="honor.title" class="honor-image" />
      </div>

      <div class="detail-actions">
        <button class="action-btn download" @click="savePoster">
          <span class="btn-icon">💾</span>
          保存海报
        </button>
        <button class="action-btn close" @click="$emit('close')">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HonorDetailModal',
  props: {
    honor: {
      type: Object,
      required: true
    },
    moduleId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      unlockTime: null
    }
  },
  computed: {
    formattedUnlockTime() {
      if (!this.unlockTime) return '';
      const date = new Date(this.unlockTime);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  methods: {
    async savePoster() {
      try {
        // 使用 fetch 获取图片并转为 Blob，绕过 CORS 限制
        const response = await fetch(this.honor.image);
        if (!response.ok) {
          throw new Error('图片获取失败');
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${this.moduleId}_${this.honor.level}荣誉.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 释放 Blob URL
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('保存海报失败:', error);
        // 降级方案：直接打开图片
        window.open(this.honor.image, '_blank');
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.modal-content {
  background: #fff3fd;
  border: 3px solid #6b0dab;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-header {
  text-align: center;
}

.detail-header h2 {
  font-size: 1.5rem;
  color: #6b0dab;
  margin: 0 0 8px 0;
  font-weight: bold;
}

.unlock-time {
  color: #06d6a0;
  font-size: 0.85rem;
  margin: 0;
}

.image-container {
  background: #ffffff;
  border: 2px solid #6b0dab;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.honor-image {
  max-width: 100%;
  max-height: 350px;
  object-fit: contain;
}

.detail-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 2px solid;
  box-shadow: 0 4px 0;
}

.action-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0;
}

.action-btn.download {
  background: linear-gradient(145deg, #ffd709, #ffd166);
  border-color: #8b6914;
  color: #333;
}

.action-btn.download:hover {
  background: linear-gradient(145deg, #ffe033, #ffe080);
}

.action-btn.close {
  background: linear-gradient(145deg, #f4a261, #e76f51);
  border-color: #c1440e;
  color: white;
}

.action-btn.close:hover {
  background: linear-gradient(145deg, #f5b07a, #ea8166);
}

.btn-icon {
  font-size: 1.2rem;
}

/* 响应式：桌面端 */
@media (min-width: 768px) {
  .modal-content {
    max-width: 600px;
  }

  .detail-actions {
    flex-direction: row;
  }
}
</style>
