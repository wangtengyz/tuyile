<template>
  <div class="resurrection-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>挑战失败</h2>
        <p>您已用完3次答题机会</p>
      </div>
      <div class="countdown">
        <div class="countdown-title">复活倒计时</div>
        <div class="countdown-time">{{ formatTime(remainingTime) }}</div>
      </div>
      <div class="modal-buttons">
        <button class="close-btn" @click="close">
          返回菜单等待
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResurrectionModal',
  props: {
    remainingTime: {
      type: Number,
      default: 180
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
  }
}
</script>

<style>
.resurrection-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
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
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border: 2px solid #6b0dab;
  text-align: center;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-header h2 {
  font-size: 1.6rem;
  color: #e63946;
  text-shadow: 1px 1px 0 #fff;
  margin: 0;
  font-weight: bold;
}

.modal-header p {
  font-size: 1rem;
  color: #264653;
  margin: 0;
  font-weight: bold;
}

.countdown {
  background: #f5d1fd;
  border: 2px solid #e63946;
  border-radius: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.countdown-title {
  font-size: 1rem;
  font-weight: bold;
  color: #6b0dab;
}

.countdown-time {
  font-size: 1.8rem;
  font-weight: bold;
  color: #e63946;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.close-btn {
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
  background: linear-gradient(145deg, #ffd709, #ffd166);
  color: #5c3d00;
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #8b6914;
}

.close-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #8b6914;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .modal-content {
    padding: 30px;
  }
  
  .modal-header h2 {
    font-size: 1.8rem;
  }
  
  .countdown-time {
    font-size: 2rem;
  }
}
</style>