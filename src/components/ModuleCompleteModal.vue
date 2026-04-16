<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="complete-header">
        <div class="trophy">🏆</div>
        <h2>恭喜通关！</h2>
        <p class="complete-subtitle">你已完成本模块所有题目</p>
      </div>
      <div class="complete-info">
        <div class="module-name">【{{ moduleName }}】</div>
        <div class="complete-message">
          太厉害了！你已经答完本模块全部 54 道题目！<br>
          快去荣誉墙查看你的成就吧！
        </div>
      </div>
      <div class="button-group">
        <button class="honor-btn" @click="$emit('go-honor')">
          查看荣誉墙
        </button>
        <button class="close-btn" @click="$emit('close')">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModuleCompleteModal',
  props: {
    moduleName: {
      type: String,
      required: true
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
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: linear-gradient(145deg, #fff9e6, #ffe4b5);
  border-radius: 16px;
  padding: 32px 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  border: 3px solid #ffd700;
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
}

.complete-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.trophy {
  font-size: 4rem;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.complete-header h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #e6a817;
  margin: 0;
  text-shadow: 2px 2px 0 #fff;
}

.complete-subtitle {
  font-size: 1rem;
  color: #8b7355;
  margin: 0;
  font-weight: bold;
}

.complete-info {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #ffd700;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: #6b0dab;
}

.complete-message {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.honor-btn {
  padding: 16px;
  border: 2px solid #6b0dab;
  border-radius: 8px;
  background: linear-gradient(145deg, #ffd709, #ffd166);
  color: #5c3d00;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 0 #8b6914;
}

.honor-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #8b6914;
}

.honor-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #8b6914;
}

.close-btn {
  padding: 14px;
  border: 2px solid #999;
  border-radius: 8px;
  background: #f0f0f0;
  color: #666;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #e0e0e0;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .modal-content {
    max-width: 450px;
    padding: 40px 32px;
  }

  .complete-header h2 {
    font-size: 2rem;
  }

  .trophy {
    font-size: 5rem;
  }
}
</style>
