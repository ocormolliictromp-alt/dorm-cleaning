# 2A211宿舍卫生值日提醒系统

中国政法大学法学院二号楼2A211宿舍卫生值日提醒网页系统。

## 功能特点

- **日历展示**：月视图展示每日值日生安排
- **值日提醒**：每周二、周五、周日早上9:00浏览器通知提醒
- **每日语录**：每天展示一句励志语录
- **完成打卡**：值日完成后可标记打卡
- **数据共享**：所有室友共享同一份数据，实时同步

## 值日规则

- **起始日期**：2026年5月25日
- **轮值顺序**：杨明浩 → 朱锑 → 崔同昊 → 王研 → 循环
- **提醒时间**：每周二、周五、周日早上9:00

## 本地开发

### 前置要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到Vercel

### 1. 创建Upstash Redis数据库

1. 访问 [Upstash Console](https://console.upstash.com)
2. 注册/登录账号
3. 创建一个Redis数据库：
   - Name: `dorm-cleaning`
   - Region: 选择离你最近的区域
4. 创建后，复制以下信息：
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 2. 部署到Vercel

**方式一：通过Vercel CLI**

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

**方式二：通过GitHub**

1. 将代码推送到GitHub仓库
2. 在 [Vercel](https://vercel.com) 导入仓库
3. 自动部署完成

### 3. 配置环境变量

在Vercel项目设置 → Environment Variables 中添加：

```env
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxx
```

### 4. 重新部署

添加环境变量后，重新部署项目使配置生效。

## 环境变量配置

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | ✅ |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis Token | ✅ |

## API接口

### GET /api/schedule

获取值日安排和完成状态

返回示例：
```json
{
  "success": true,
  "currentDuty": "杨明浩",
  "schedule": [...],
  "completions": {},
  "exceptions": {}
}
```

### PUT /api/schedule

修改值日安排

Body:
```json
{
  "date": "2026-05-28",
  "dutyPerson": "朱锑"
}
```

### POST /api/complete

设置完成状态

Body:
```json
{
  "date": "2026-05-28",
  "completed": true,
  "dutyPerson": "杨明浩"
}
```

## 项目结构

```
dorm-cleaning/
├── frontend/                # Vue 3 前端
│   ├── src/
│   │   ├── components/      # Vue组件
│   │   ├── utils/           # 工具函数
│   │   │   ├── scheduler.js # 值日计算
│   │   │   ├── api.js       # API调用
│   │   │   ├── notification.js # 浏览器通知
│   │   │   └── quotes.js    # 励志语录
│   │   └── App.vue          # 主组件
│   └── package.json
├── api/                     # Vercel Serverless函数
│   ├── lib/
│   │   └── redis.js         # Redis客户端
│   ├── schedule.js          # 值日API
│   ├── complete.js          # 完成状态API
│   ├── quote.js             # 语录API
│   └── cron.js              # 定时任务
├── vercel.json              # Vercel配置
└── README.md
```

## 使用说明

### 开启浏览器通知

1. 点击页面右上角的"开启通知"按钮
2. 在弹出的权限请求中点击"允许"
3. 在提醒日（周二、周五、周日）早上9点会收到通知

### 完成打卡

1. 点击日历中的某一天
2. 在下方详情区点击"完成打卡"
3. 所有室友都能看到完成状态

### 修改值日安排

1. 点击日历中的某一天
2. 点击"修改值日"按钮
3. 选择新的值日生并确认

## 注意事项

1. **数据同步**：数据存储在Upstash Redis中，所有室友共享
2. **自动同步**：页面每30秒自动同步一次数据
3. **网络要求**：需要网络连接才能同步数据

## 技术栈

- **前端**：Vue 3 + Vite + TailwindCSS
- **后端**：Vercel Serverless Functions
- **数据库**：Upstash Redis
- **定时任务**：Vercel Cron Jobs

## License

MIT
