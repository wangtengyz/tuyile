# 前言

全链路AI游戏工程

## 项目概述

这是一个"看图猜猜猜"益智游戏——浏览器端猜图游戏。游戏展示基础物体，再显示其变化图（拟人化、动作或场景变化），用户需猜测变化图代表的含义（职业、动作、词语或谐音梗）。

## 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

# 发布github
bash ./deploy.sh

## 技术架构

### 技术栈
- **框架**: Vue 3 (单文件组件)
- **构建工具**: Vite 5
- **存储**: IndexedDB (优先) + LocalStorage (备选)
- **样式**: Vue 组件内 scoped CSS，无外部 CSS 框架

### 组件结构
```
src/
├── main.js              # Vue 应用入口
├── App.vue              # 根组件，含视图路由逻辑
├── components/
│   ├── GameBoard.vue    # 主游戏界面，含倒计时、答题输入
│   ├── LevelSelect.vue  # 关卡选择（3个模块分类）
│   ├── ResultModal.vue  # 答题结果展示弹窗
│   ├── ShareModal.vue   # 分享功能弹窗
│   ├── ResurrectionModal.vue  # 游戏失败/复活机制弹窗
│   └── UserConfig.vue   # 用户名配置界面
├── stores/
│   ├── storeManager.js  # 存储操作抽象层
│   ├── indexDB.js       # IndexedDB 实现
│   └── localStorage.js  # LocalStorage 备选实现
└── data/
    └── levels.js        # 关卡/题目数据配置
```

### 视图流程
App.vue 通过 `currentView` 状态实现简单的视图路由：
1. `userConfig` → 用户输入用户名
2. `levelSelect` → 用户选择关卡分类
3. `game` → 游戏界面，含倒计时

### 游戏机制
- **答题机会**: 每关 3 次答题机会
- **倒计时**: 每题 30 秒计时器
- **复活机制**: 用完答题机会后，需等待 3 分钟冷却方可复活
- **连对追踪**: 追踪连续答对次数

### 数据模型 (levels.js)
每个关卡数据结构：
```javascript
{
  id: number,                    // 关卡编号
  category: 'children' | 'brain' | 'theme',  // 分类
  difficulty: 1-10,              // 难度等级
  type: '职业' | '动作' | '动物' | '食物',    // 题目类型
  baseObjectName: string,        // 基础物体名称
  baseImage: string,             // 基础图（SVG 或图片路径）
  variantDescription: string,    // 变化描述
  variantImage: string,          // 变化图
  correctAnswer: string,         // 正确答案
  answerLength: number,          // 答案字数
  explanation: string            // 解析说明
}
```

### 雪碧图处理
关卡 1-9 使用雪碧图 (`./question/模块一1-9题.png`)，采用 3×3 网格布局。`GameBoard.vue` 中 `getSpriteStyle()` 方法实现雪碧图定位逻辑。

### 存储抽象
`StoreManager` 自动检测并选择 IndexedDB（可用时）或 LocalStorage（备选）。提供统一 API：`saveUser`、`getUser`、`saveGameProgress`、`getGameProgress`、`saveAchievement`、`getUserAchievements`。

## 关键设计决策

1. **无路由库**: App.vue 通过响应式状态处理视图切换
2. **内联 SVG 占位图**: levels.js 使用 data URI SVG 作为演示关卡图片
3. **中文输入处理**: GameBoard.vue 实现 composition events (`onCompositionStart/End`) 正确处理中文拼音输入
4. **逐字输入框**: 答案采用逐字输入框，带自动聚焦导航

## 重要文件

- `plan.md`: 游戏设计文档，含题目类型、机制和内容生产模板
- `design.md`: 产品文案/UI 文案规范（中文）
- `UI/design.md`: 视觉设计系统规范（"Digital Trickster" 风格——复古像素风）
- `.trae/documents/puzzle_guess_game_plan.md`: 实施计划，含项目结构和时间安排