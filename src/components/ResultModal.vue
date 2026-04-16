<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div v-if="result.correct" class="correct-header">
        <h2>猜对了！</h2>
        <p class="correct-subtitle">漂亮，这题没骗到你！</p>
      </div>
      <div v-else class="incorrect-header">
        <h2>你被第一眼骗到了</h2>
        <p class="incorrect-subtitle">这类题专门治"我以为"。</p>
      </div>
      <div class="result-info">
        <div class="answer-reveal">
          <div class="answer-title">原来答案是</div>
          <div class="answer-text">{{ result.answer }}</div>
        </div>
        <div class="explanation">
          <div class="explanation-title">脑洞解析</div>
          <div class="explanation-text">{{ result.explanation }}</div>
        </div>
      </div>
      <button class="close-btn" @click="$emit('close')">
        确定
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultModal',
  props: {
    result: {
      type: Object,
      required: true
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

.correct-header,
.incorrect-header {
  text-align: center;
}

.correct-header h2 {
  font-size: 1.6rem;
  font-weight: bold;
  color: #06d6a0;
  margin-bottom: 8px;
  text-shadow: 1px 1px 0 #fff;
}

.correct-subtitle {
  font-size: 1rem;
  color: #06d6a0;
  font-weight: bold;
  margin: 0;
}

.incorrect-header h2 {
  font-size: 1.6rem;
  font-weight: bold;
  color: #e63946;
  margin-bottom: 8px;
  text-shadow: 1px 1px 0 #fff;
}

.incorrect-subtitle {
  font-size: 1rem;
  color: #e63946;
  font-weight: bold;
  margin: 0;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.answer-reveal {
  background: #f5d1fd;
  padding: 16px;
  border-radius: 0;
  border: 2px solid #6b0dab;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.answer-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: #6b0dab;
}

.answer-text {
  font-size: 1.3rem;
  font-weight: bold;
  color: #264653;
  text-align: center;
}

.explanation {
  background: #feebff;
  padding: 16px;
  border-radius: 0;
  border: 2px solid #6b0dab;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.explanation-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: #6b0dab;
}

.explanation-text {
  font-size: 0.9rem;
  color: #264653;
  line-height: 1.6;
  text-align: left;
}

.close-btn {
  padding: 14px;
  border: 2px solid #8b6914;
  border-radius: 0;
  background: linear-gradient(145deg, #ffd709, #ffd166);
  color: #5c3d00;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 0 #8b6914;
  text-align: center;
  min-height: 56px;
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
    max-width: 500px;
    padding: 30px;
  }
  
  .correct-header h2,
  .incorrect-header h2 {
    font-size: 1.8rem;
  }
  
  .answer-text {
    font-size: 1.5rem;
  }
}
</style>