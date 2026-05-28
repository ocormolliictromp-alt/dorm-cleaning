<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- 顶部标题 -->
    <header class="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🏠</span>
            <div>
              <h1 class="text-xl font-bold text-gray-800">2A211宿舍卫生值日提醒</h1>
              <p class="text-xs text-gray-500">中国政法大学法学院二号楼</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- 同步状态 -->
            <div v-if="isConfigured" class="flex items-center gap-2 text-sm">
              <span
                class="w-2 h-2 rounded-full"
                :class="syncStatus === 'synced' ? 'bg-green-500' : syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'"
              ></span>
              <span class="text-gray-500 hidden sm:inline">{{ syncStatusText }}</span>
            </div>
            <!-- 同步按钮 -->
            <button
              v-if="isConfigured"
              @click="syncData"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="同步数据"
            >
              <svg class="w-5 h-5 text-gray-600" :class="{ 'animate-spin': syncStatus === 'syncing' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <!-- 通知开关 -->
            <button
              @click="toggleNotification"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
              :class="notificationEnabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="notificationEnabled" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a8 8 0 0116 0v4a1 1 0 01-1 1h-1.586l-1.414 1.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293L5.586 15z M17 14l-5-5m0 0l-5 5m5-5v12" />
              </svg>
              <span class="text-sm hidden sm:inline">{{ notificationEnabled ? '通知已开启' : '开启通知' }}</span>
            </button>
            <div class="text-right hidden sm:block">
              <p class="text-sm text-gray-600">{{ formattedDate }}</p>
              <p class="text-xs text-gray-400">{{ weekDayText }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 配置提示（未配置时显示） -->
    <div v-if="!isConfigured" class="max-w-6xl mx-auto px-4 py-4">
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h4 class="font-medium text-yellow-800 mb-2">⚠️ 数据共享未配置</h4>
        <p class="text-sm text-yellow-700 mb-3">当前数据仅保存在本地浏览器中，室友间无法共享。按以下步骤配置数据共享：</p>
        <ol class="text-sm text-yellow-700 list-decimal list-inside space-y-1">
          <li>访问 <a href="https://jsonbin.io" target="_blank" class="underline">jsonbin.io</a> 注册账号</li>
          <li>获取 API Key（Account页面）</li>
          <li>创建一个Bin，获取 Bin ID</li>
          <li>修改 <code class="bg-yellow-100 px-1 rounded">frontend/src/utils/jsonbin.js</code> 中的配置</li>
        </ol>
      </div>
    </div>

    <!-- 主内容 -->
    <main class="max-w-6xl mx-auto px-4 py-8">
      <!-- 每日语录 -->
      <section class="mb-8">
        <DailyQuote :date="currentDate" />
      </section>

      <!-- 本周值日提醒 -->
      <section class="mb-8">
        <div
          class="rounded-xl p-6 text-white shadow-lg transition-all"
          :class="todayCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-80 mb-1">
                {{ todayCompleted ? '今日值日已完成' : '本周值日生' }}
              </p>
              <p class="text-2xl font-bold">{{ currentDutyPerson }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm opacity-80">下次提醒</p>
              <p class="font-medium">{{ nextReminderText }}</p>
            </div>
          </div>
          <!-- 今日完成提示 -->
          <div v-if="todayCompleted" class="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">太棒了！宿舍打扫完成，继续保持！</span>
          </div>
        </div>
      </section>

      <!-- 两栏布局 -->
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- 日历 -->
        <div class="lg:col-span-2">
          <Calendar
            v-model="currentDate"
            :server-data="serverData"
            @dateSelect="handleDateSelect"
            @modify="handleModify"
            @complete="handleComplete"
          />
        </div>

        <!-- 成员列表 -->
        <div>
          <MemberList :current-date="currentDate" />

          <!-- 提醒说明 -->
          <div class="mt-6 bg-amber-50 rounded-xl p-4 border border-amber-200">
            <h4 class="font-medium text-amber-800 mb-2 flex items-center gap-2">
              <span>🔔</span> 网页提醒
            </h4>
            <p class="text-sm text-amber-700 mb-2">
              每周二、周五、周日早上 9:00 浏览器自动提醒
            </p>
            <p class="text-xs text-amber-600">
              提示：需保持网页开启并允许通知权限
            </p>
          </div>

          <!-- 完成打卡说明 -->
          <div class="mt-4 bg-green-50 rounded-xl p-4 border border-green-200">
            <h4 class="font-medium text-green-800 mb-2 flex items-center gap-2">
              <span>✅</span> 完成打卡
            </h4>
            <p class="text-sm text-green-700">
              点击日历中的日期，然后点击"完成打卡"按钮即可标记当天值日完成
            </p>
          </div>

          <!-- 数据同步说明 -->
          <div v-if="isConfigured" class="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 class="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <span>☁️</span> 数据同步
            </h4>
            <p class="text-sm text-blue-700">
              数据已配置云端同步，所有室友共享同一份数据
            </p>
            <p class="text-xs text-blue-600 mt-1">
              上次同步：{{ lastSyncTime || '未同步' }}
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-800 text-gray-400 py-8 mt-12">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <p class="text-sm">2A211宿舍卫生值日提醒系统</p>
        <p class="text-xs mt-2">保持卫生，从我做起 💪</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Calendar from './components/Calendar.vue'
import MemberList from './components/MemberList.vue'
import DailyQuote from './components/DailyQuote.vue'
import { getDutyPersonByDate, getNextReminderDate, formatDate, isReminderDay } from './utils/scheduler'
import { isCompleted, setCompletionStatus, getCompletionStatus } from './utils/completion'
import { getData, saveData, isConfigured, createInitialData } from './utils/jsonbin'
import {
  requestNotificationPermission,
  sendCleaningReminder,
  startReminderCheck,
  stopReminderCheck
} from './utils/notification'

const currentDate = ref(new Date())
const notificationEnabled = ref(false)
const todayCompleted = ref(false)
const syncStatus = ref('idle')
const serverData = ref({ completions: {}, exceptions: {} })
const lastSyncTime = ref('')

const formattedDate = computed(() => {
  return formatDate(currentDate.value)
})

const weekDayText = computed(() => {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return days[currentDate.value.getDay()]
})

const currentDutyPerson = computed(() => {
  return getDutyPersonByDate(currentDate.value)
})

const nextReminderText = computed(() => {
  const nextDate = getNextReminderDate(currentDate.value)
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${days[nextDate.getDay()]} ${formatDate(nextDate)}`
})

const syncStatusText = computed(() => {
  switch (syncStatus.value) {
    case 'syncing': return '同步中...'
    case 'synced': return '已同步'
    case 'error': return '同步失败'
    default: return '点击同步'
  }
})

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 从云端同步数据
async function syncData() {
  if (!isConfigured()) return

  syncStatus.value = 'syncing'
  try {
    const data = await getData()
    if (data) {
      // 合并本地和云端数据
      const localCompletions = getCompletionStatus()
      serverData.value = {
        completions: { ...localCompletions, ...data.completions },
        exceptions: { ...data.exceptions }
      }

      // 保存合并后的数据到本地
      localStorage.setItem('duty_completion_status', JSON.stringify(serverData.value.completions))
      localStorage.setItem('duty_exceptions', JSON.stringify(serverData.value.exceptions))

      syncStatus.value = 'synced'
      lastSyncTime.value = new Date().toLocaleTimeString('zh-CN')

      // 更新今日完成状态
      checkTodayCompletion()
    } else {
      syncStatus.value = 'error'
    }
  } catch (error) {
    console.error('Sync error:', error)
    syncStatus.value = 'error'
  }
}

// 保存数据到云端
async function saveToCloud() {
  if (!isConfigured()) return

  try {
    const data = {
      completions: JSON.parse(localStorage.getItem('duty_completion_status') || '{}'),
      exceptions: JSON.parse(localStorage.getItem('duty_exceptions') || '{}'),
      lastUpdated: new Date().toISOString()
    }
    await saveData(data)
    lastSyncTime.value = new Date().toLocaleTimeString('zh-CN')
  } catch (error) {
    console.error('Save error:', error)
  }
}

// 切换通知权限
async function toggleNotification() {
  const granted = await requestNotificationPermission()
  notificationEnabled.value = granted
  if (granted) {
    sendCleaningReminder(currentDutyPerson.value, new Date().toLocaleDateString('zh-CN'))
  }
}

// 检查今日是否已完成
function checkTodayCompletion() {
  const today = formatDateKey(new Date())
  const completions = JSON.parse(localStorage.getItem('duty_completion_status') || '{}')
  todayCompleted.value = completions[today]?.completed || false
}

function handleDateSelect(cell) {
  console.log('Selected date:', cell)
}

function handleModify(data) {
  console.log('Modified:', data)
  // 保存到云端
  saveToCloud()
}

function handleComplete(data) {
  console.log('Completed:', data)
  // 更新今日完成状态
  const today = formatDateKey(new Date())
  if (formatDateKey(new Date(data.date)) === today) {
    todayCompleted.value = data.completed
  }
  // 保存到云端
  saveToCloud()
}

let syncInterval = null

onMounted(async () => {
  // 检查通知权限
  notificationEnabled.value = Notification.permission === 'granted'

  // 检查今日完成状态
  checkTodayCompletion()

  // 启动定时提醒
  startReminderCheck(() => getDutyPersonByDate(new Date()))

  // 如果已配置云端，则同步数据
  if (isConfigured()) {
    await syncData()
    // 每60秒自动同步
    syncInterval = setInterval(syncData, 60000)
  }
})

onUnmounted(() => {
  stopReminderCheck()
  if (syncInterval) {
    clearInterval(syncInterval)
  }
})
</script>
