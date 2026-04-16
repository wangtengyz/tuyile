<template>
  <div class="loading-spinner">
    <div class="spinner-blocks">
      <div class="block block-1"></div>
      <div class="block block-2"></div>
      <div class="block block-3"></div>
      <div class="block block-4"></div>
    </div>
    <p>加载中...</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner'
}
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.spinner-blocks {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  width: 32px;
  height: 32px;
}

.block {
  width: 14px;
  height: 14px;
  background: #6b0dab;
  border-radius: 0; /* 无圆角 */
}

.block-1 {
  animation: pulse 0.8s ease-in-out infinite;
}

.block-2 {
  animation: pulse 0.8s ease-in-out infinite 0.2s;
}

.block-3 {
  animation: pulse 0.8s ease-in-out infinite 0.4s;
}

.block-4 {
  animation: pulse 0.8s ease-in-out infinite 0.6s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.8);
  }
}

p {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #6b0dab;
  font-weight: bold;
}
</style>