<template>
  <div class="user-config">
    <div class="config-header">
      <h1>准备开始</h1>
      <p>请输入你的用户名，开始猜图挑战吧！</p>
    </div>
    <div class="config-form">
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="请输入用户名"
          @keyup.enter="saveConfig"
        />
      </div>
      <button class="save-btn" @click="saveConfig" :disabled="!username.trim()">
        开始烧脑
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserConfig',
  data() {
    return {
      username: '猜图小能手'
    }
  },
  methods: {
    saveConfig() {
      if (this.username.trim()) {
        // 保存用户名到本地存储
        localStorage.setItem('guessGameUsername', this.username)
        this.$emit('config-saved', this.username)
      }
    }
  },
  mounted() {
    // 尝试从本地存储加载用户名
    const savedUsername = localStorage.getItem('guessGameUsername')
    if (savedUsername) {
      this.username = savedUsername
    }
  }
}
</script>

<style>
.user-config {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #fff3fd;
}

.config-header {
  text-align: center;
}

.config-header h1 {
  font-size: 1.8rem;
  color: #264653;
  margin-bottom: 8px;
  font-weight: bold;
  text-shadow: 1px 1px 0 #fff;
}

.config-header p {
  font-size: 1rem;
  color: #6b0dab;
  opacity: 0.9;
  margin: 0;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-size: 1.1rem;
  font-weight: bold;
  color: #6b0dab;
  font-family: 'Arial', sans-serif;
}

.form-group input {
  width: 100%;
  padding: 16px;
  border: 3px solid #8b6914;
  border-radius: 0;
  font-size: 1.1rem;
  background: #fff;
  color: #5c3d00;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 0 #8b6914;
  font-family: 'Arial', sans-serif;
  min-height: 56px;
}

.form-group input:focus {
  border-color: #f4a261;
  box-shadow: 0 0 0 3px rgba(244, 162, 97, 0.3), 0 4px 0 #8b6914;
  transform: translateY(-2px);
}

.save-btn {
  padding: 16px;
  border: 2px solid #8b6914;
  border-radius: 0;
  background: linear-gradient(145deg, #ffd709, #ffd166);
  color: #5c3d00;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 0 #8b6914;
  font-family: 'Arial', sans-serif;
  min-height: 56px;
  text-align: center;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #8b6914;
}

.save-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #8b6914;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .user-config {
    max-width: 400px;
    margin: 0 auto;
    padding: 30px;
  }
  
  .config-header h1 {
    font-size: 2.2rem;
  }
  
  .config-header p {
    font-size: 1.1rem;
  }
}
</style>