// 儿童启蒙版关卡数据 - 题库配置文件
// 说明：
// - difficulty: 难度 (1-10, 10为最难)
// - category: 分类 (children:儿童启蒙)
// - answerLength: 答案字数

const childrenLevels = [
  // 雪碧图关卡 - 儿童启蒙版职业类
  {
    id: 1,
    category: 'children',
    difficulty: 1,
    type: '职业',
    baseObjectName: '苹果',
    baseImage: '/question/第一模块1-9.png',
    variantDescription: '苹果变成画家',
    variantImage: '/question/第一模块1-9.png',
    answerPlaceholder: '__',
    answerLength: 2,
    correctAnswer: '画家',
    explanation: '苹果拿着画笔和调色板，像一个画家，所以答案是画家。'
  },
  {
    id: 2,
    category: 'children',
    difficulty: 1,
    type: '职业',
    baseObjectName: '飞机',
    baseImage: '/question/第一模块1-9.png',
    variantDescription: '飞机变成飞行员',
    variantImage: '/question/第一模块1-9.png',
    answerPlaceholder: '__',
    answerLength: 3,
    correctAnswer: '飞行员',
    explanation: '飞机变成了飞行员，穿着制服，所以答案是飞行员。'
  },
  {
    id: 3,
    category: 'children',
    difficulty: 1,
    type: '职业',
    baseObjectName: '锤子',
    baseImage: '/question/第一模块1-9.png',
    variantDescription: '锤子变成工人',
    variantImage: '/question/第一模块1-9.png',
    answerPlaceholder: '__',
    answerLength: 2,
    correctAnswer: '工人',
    explanation: '锤子变成了工人，戴着安全帽，所以答案是工人。'
  },
  {
    id: 4,
    category: 'children',
    difficulty: 2,
    type: '职业',
    baseObjectName: '面包',
    baseImage: '/question/第一模块1-9.png',
    variantDescription: '面包变成厨师',
    variantImage: '/question/第一模块1-9.png',
    answerPlaceholder: '__',
    answerLength: 2,
    correctAnswer: '厨师',
    explanation: '面包变成了厨师，戴着厨师帽，所以答案是厨师。'
  },
  {
    id: 5,
    category: 'children',
    difficulty: 2,
    type: '职业',
    baseObjectName: '消防车',
    baseImage: '/question/第一模块1-9.png',
    variantDescription: '消防车变成消防员',
    variantImage: '/question/第一模块1-9.png',
    answerPlaceholder: '__',
    answerLength: 3,
    correctAnswer: '消防员',
    explanation: '消防车变成了消防员，正在喷水，所以答案是消防员。'
  },
  {
    id: 6,
    category: 'children',
    difficulty: 2,
    type: '职业',
    baseObjectName: '扳手',
    baseImage: '/question/第一模块1-9.png',
    variantDescription: '扳手变成修理工',
    variantImage: '/question/第一模块1-9.png',
    answerPlaceholder: '__',
    answerLength: 3,
    correctAnswer: '修理工',
    explanation: '扳手变成了修理工，正在修车，所以答案是修理工。'
  },
  {
    id: 7,
    category: 'children',
    difficulty: 3,
    type: '职业',
    baseObjectName: '哨子',
    baseImage: '/question/第一模块1-9.png',
    variantDescription: '哨子变成裁判',
    variantImage: '/question/第一模块1-9.png',
    answerPlaceholder: '__',
    answerLength: 2,
    correctAnswer: '裁判',
    explanation: '哨子变成了裁判，戴着裁判帽，所以答案是裁判。'
  },
  {
    id: 8,
    category: 'children',
    difficulty: 3,
    type: '职业',
    baseObjectName: '书',
    baseImage: '/question/第一模块1-9.png',
    variantDescription: '书变成老师',
    variantImage: '/question/第一模块1-9.png',
    answerPlaceholder: '__',
    answerLength: 2,
    correctAnswer: '老师',
    explanation: '书变成了老师，站在黑板前，所以答案是老师。'
  },
  {
    id: 9,
    category: 'children',
    difficulty: 3,
    type: '职业',
    baseObjectName: '红绿灯',
    baseImage: '/question/第一模块1-9.png',
    variantDescription: '红绿灯变成交警',
    variantImage: '/question/第一模块1-9.png',
    answerPlaceholder: '__',
    answerLength: 2,
    correctAnswer: '交警',
    explanation: '红绿灯变成了交警，正在指挥交通，所以答案是交警。'
  },
  {
    id: 10,
    category: 'children',
    difficulty: 3,
    type: '动作',
    baseObjectName: '鸭子',
    baseImage: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#fffbe6"/>
      <ellipse cx="50" cy="60" rx="20" ry="15" fill="#ffcc66"/>
      <path d="M70 60 Q80 55 85 45" stroke="#ffcc66" stroke-width="3" fill="none"/>
      <circle cx="65" cy="55" r="2" fill="#333"/>
      <path d="M30 65 Q25 75 35 80" stroke="#ffcc66" stroke-width="3" fill="none"/>
      <path d="M70 65 Q75 75 65 80" stroke="#ffcc66" stroke-width="3" fill="none"/>
    </svg>`),
    variantDescription: '鸭子在游泳',
    variantImage: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#fffbe6"/>
      <rect x="0" y="65" width="100" height="35" fill="#87CEEB" opacity="0.5"/>
      <ellipse cx="50" cy="60" rx="20" ry="15" fill="#ffcc66"/>
      <path d="M70 60 Q80 55 85 45" stroke="#ffcc66" stroke-width="3" fill="none"/>
      <circle cx="65" cy="55" r="2" fill="#333"/>
      <path d="M30 65 Q25 75 35 80" stroke="#ffcc66" stroke-width="3" fill="none"/>
      <path d="M70 65 Q75 75 65 80" stroke="#ffcc66" stroke-width="3" fill="none"/>
      <path d="M40 70 Q45 75 50 70" stroke="#333" stroke-width="1" fill="none"/>
      <path d="M50 70 Q55 75 60 70" stroke="#333" stroke-width="1" fill="none"/>
    </svg>`),
    answerPlaceholder: '__',
    answerLength: 2,
    correctAnswer: '游泳',
    explanation: '鸭子在水里游泳，所以答案是游泳。'
  },
  {
    id: 11,
    category: 'children',
    difficulty: 4,
    type: '动物',
    baseObjectName: '大象',
    baseImage: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#fffbe6"/>
      <ellipse cx="50" cy="60" rx="25" ry="20" fill="#d4a373"/>
      <circle cx="30" cy="55" r="10" fill="#d4a373"/>
      <circle cx="70" cy="55" r="10" fill="#d4a373"/>
      <path d="M30 40 Q40 30 50 35" stroke="#d4a373" stroke-width="3" fill="none"/>
      <circle cx="35" cy="50" r="2" fill="#333"/>
      <circle cx="65" cy="50" r="2" fill="#333"/>
    </svg>`),
    variantDescription: '大象在喷水',
    variantImage: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#fffbe6"/>
      <ellipse cx="50" cy="60" rx="25" ry="20" fill="#d4a373"/>
      <circle cx="30" cy="55" r="10" fill="#d4a373"/>
      <circle cx="70" cy="55" r="10" fill="#d4a373"/>
      <path d="M30 40 Q40 30 50 35 Q60 25 70 35" stroke="#d4a373" stroke-width="3" fill="none"/>
      <path d="M70 35 Q80 25 90 30" stroke="#87CEEB" stroke-width="3" fill="none"/>
      <circle cx="35" cy="50" r="2" fill="#333"/>
      <circle cx="65" cy="50" r="2" fill="#333"/>
    </svg>`),
    answerPlaceholder: '__',
    answerLength: 2,
    correctAnswer: '喷水',
    explanation: '大象用鼻子喷水，所以答案是喷水。'
  },
  {
    id: 12,
    category: 'children',
    difficulty: 4,
    type: '食物',
    baseObjectName: '香蕉',
    baseImage: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#fffbe6"/>
      <path d="M30 20 Q40 30 50 40 Q60 50 70 60" stroke="#ffcc00" stroke-width="8" fill="none"/>
      <path d="M25 20 L30 25" stroke="#2ed573" stroke-width="2" fill="none"/>
    </svg>`),
    variantDescription: '香蕉被剥皮',
    variantImage: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#fffbe6"/>
      <path d="M30 20 Q40 30 50 40 Q60 50 70 60" stroke="#ffcc00" stroke-width="6" fill="none"/>
      <path d="M30 20 Q40 25 50 30" stroke="#ffffff" stroke-width="2" fill="none"/>
      <path d="M50 40 Q60 45 70 50" stroke="#ffffff" stroke-width="2" fill="none"/>
      <path d="M25 20 L30 25" stroke="#2ed573" stroke-width="2" fill="none"/>
    </svg>`),
    answerPlaceholder: '__',
    answerLength: 2,
    correctAnswer: '剥皮',
    explanation: '香蕉被剥了皮，所以答案是剥皮。'
  },
  {
    id: 13,
    category: 'children',
    difficulty: 4,
    type: '职业',
    baseObjectName: '企鹅',
    baseImage: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#fffbe6"/>
      <ellipse cx="50" cy="60" rx="20" ry="25" fill="#ffffff"/>
      <ellipse cx="50" cy="40" rx="15" ry="15" fill="#000000"/>
      <circle cx="45" cy="35" r="2" fill="#ffffff"/>
      <circle cx="55" cy="35" r="2" fill="#ffffff"/>
      <path d="M45 45 Q50 50 55 45" stroke="#ffffff" stroke-width="2" fill="none"/>
    </svg>`),
    variantDescription: '企鹅变成厨师',
    variantImage: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#fffbe6"/>
      <ellipse cx="50" cy="60" rx="20" ry="25" fill="#ffffff"/>
      <ellipse cx="50" cy="40" rx="15" ry="15" fill="#000000"/>
      <circle cx="45" cy="35" r="2" fill="#ffffff"/>
      <circle cx="55" cy="35" r="2" fill="#ffffff"/>
      <path d="M45 45 Q50 50 55 45" stroke="#ffffff" stroke-width="2" fill="none"/>
      <circle cx="50" cy="30" r="8" fill="#ffffff"/>
      <rect x="40" y="50" width="20" height="10" fill="#ff6b6b"/>
      <path d="M45 60 L55 60" stroke="#333" stroke-width="2" fill="none"/>
    </svg>`),
    answerPlaceholder: '__',
    answerLength: 2,
    correctAnswer: '厨师',
    explanation: '企鹅戴着厨师帽，像一个厨师，所以答案是厨师。'
  },
  {
    id: 14,
    category: 'children',
    difficulty: 5,
    type: '动作',
    baseObjectName: '青蛙',
    baseImage: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#fffbe6"/>
      <ellipse cx="50" cy="60" rx="20" ry="15" fill="#2ed573"/>
      <ellipse cx="40" cy="50" rx="5" ry="5" fill="#000000"/>
      <ellipse cx="60" cy="50" rx="5" ry="5" fill="#000000"/>
      <path d="M45 55 Q50 60 55 55" stroke="#000000" stroke-width="2" fill="none"/>
      <path d="M30 65 Q25 75 35 80" stroke="#2ed573" stroke-width="3" fill="none"/>
      <path d="M70 65 Q75 75 65 80" stroke="#2ed573" stroke-width="3" fill="none"/>
    </svg>`),
    variantDescription: '青蛙在跳跃',
    variantImage: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#fffbe6"/>
      <ellipse cx="50" cy="40" rx="20" ry="15" fill="#2ed573"/>
      <ellipse cx="40" cy="30" rx="5" ry="5" fill="#000000"/>
      <ellipse cx="60" cy="30" rx="5" ry="5" fill="#000000"/>
      <path d="M45 35 Q50 40 55 35" stroke="#000000" stroke-width="2" fill="none"/>
      <path d="M30 45 Q25 65 35 70" stroke="#2ed573" stroke-width="3" fill="none"/>
      <path d="M70 45 Q75 65 65 70" stroke="#2ed573" stroke-width="3" fill="none"/>
      <path d="M40 45 Q35 35 30 30" stroke="#2ed573" stroke-width="3" fill="none"/>
      <path d="M60 45 Q65 35 70 30" stroke="#2ed573" stroke-width="3" fill="none"/>
    </svg>`),
    answerPlaceholder: '__',
    answerLength: 2,
    correctAnswer: '跳跃',
    explanation: '青蛙在跳跃，所以答案是跳跃。'
  },
  {
    id: 15,
    category: 'children',
    difficulty: 5,
    type: '食物',
    baseObjectName: '西瓜',
    baseImage: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#fffbe6"/>
      <circle cx="50" cy="50" r="25" fill="#2ed573"/>
      <path d="M50 25 L50 75" stroke="#ff6b6b" stroke-width="2" fill="none"/>
      <path d="M25 50 L75 50" stroke="#ff6b6b" stroke-width="2" fill="none"/>
      <path d="M35 35 L65 65" stroke="#ff6b6b" stroke-width="2" fill="none"/>
      <path d="M35 65 L65 35" stroke="#ff6b6b" stroke-width="2" fill="none"/>
    </svg>`),
    variantDescription: '西瓜被切开',
    variantImage: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" fill="#fffbe6"/>
      <path d="M30 30 Q50 20 70 30 Q90 40 80 60 Q70 80 50 70 Q30 60 20 40 Q30 30 30 30" fill="#2ed573"/>
      <path d="M30 30 L70 70" stroke="#ff6b6b" stroke-width="2" fill="none"/>
      <circle cx="40" cy="40" r="3" fill="#ffcc00"/>
      <circle cx="60" cy="40" r="3" fill="#ffcc00"/>
      <circle cx="50" cy="50" r="3" fill="#ffcc00"/>
      <circle cx="40" cy="60" r="3" fill="#ffcc00"/>
      <circle cx="60" cy="60" r="3" fill="#ffcc00"/>
    </svg>`),
    answerPlaceholder: '__',
    answerLength: 2,
    correctAnswer: '切开',
    explanation: '西瓜被切成了两半，所以答案是切开。'
  }
];

export default childrenLevels;