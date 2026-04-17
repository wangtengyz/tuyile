<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-image-wrap">
        <div class="hero-image-bg"></div>
        <img
          class="hero-image"
          src="https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/2023/ts/back.png"
          alt="图一乐 TYL 首页角色图"
        />
      </div>
      <h1>图一乐 <span>TYL</span></h1>
      <p>一眼会认，二眼烧脑。猜图这件事，认真你就输了。</p>
    </section>

    <section class="action-section">
      <button class="primary-action" @click="$emit('start-challenge')">
        开始挑战
      </button>
      <div class="secondary-actions">
        <button class="secondary-action" @click="$emit('open-module-challenge')">
          模块挑战
        </button>
        <button class="secondary-action" @click="$emit('open-honor-wall')">
          查看称号
        </button>
      </div>
    </section>

    <section class="home-stats" v-if="username">
      <p>玩家：{{ username }}</p>
      <p>累计答对：{{ totalCorrectAnswers }} 题</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  props: {
    username: {
      type: String,
      default: ''
    },
    totalCorrectAnswers: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.home-page {
  width: 100%;
  min-height: 100%;
  padding: 20px 16px 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  background:
    radial-gradient(circle at 14px 14px, #bfa5c4 1.2px, transparent 1.2px),
    #fff3fd;
  background-size: 20px 20px;
}

.hero-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-image-wrap {
  width: 188px;
  height: 188px;
  margin-bottom: 16px;
  position: relative;
}

.hero-image-bg {
  position: absolute;
  inset: 0;
  background: #ffd709;
  border: 3px solid #6c5a00;
  transform: rotate(3deg);
  box-shadow: 4px 4px 0 #3b2841;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 3px solid #6c5a00;
  box-shadow: 4px 4px 0 #3b2841;
}

.hero-section h1 {
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  font-size: 1.8rem;
  color: #3b2841;
  margin-bottom: 8px;
  letter-spacing: 0.4px;
  line-height: 1;
}

.hero-section h1 span {
  margin-left: 4px;
  color: #6c5a00;
  font-size: 1.2rem;
}

.hero-section p {
  max-width: 300px;
  font-size: 0.9rem;
  color: #6a546f;
  line-height: 1.55;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.primary-action {
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  width: 100%;
  min-height: 56px;
  border: 3px solid #6c5a00;
  background: #ffd709;
  color: #5b4b00;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 4px 4px 0 #3b2841;
  cursor: pointer;
}

.primary-action:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #3b2841;
}

.secondary-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.secondary-action {
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  min-height: 52px;
  border: 2px solid #6b0dab;
  background: #feebff;
  color: #6b0dab;
  font-size: 0.95rem;
  font-weight: 700;
  box-shadow: 3px 3px 0 #3b2841;
  cursor: pointer;
}

.secondary-action:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #3b2841;
}

.home-stats {
  margin-top: auto;
  border: 2px solid #866f8c;
  background: #f5d1fd;
  color: #3b2841;
  padding: 10px 12px;
  box-shadow: 3px 3px 0 #3b2841;
}

.home-stats p {
  font-size: 0.82rem;
  line-height: 1.6;
  font-weight: 600;
}

@media (min-width: 768px) {
  .home-page {
    max-width: 740px;
    margin: 0 auto;
    padding: 28px 24px 32px;
  }

  .hero-section h1 {
    font-size: 2.1rem;
  }

  .hero-section p {
    font-size: 1rem;
  }

  .action-section {
    max-width: 520px;
    margin: 0 auto;
    width: 100%;
  }
}
</style>
