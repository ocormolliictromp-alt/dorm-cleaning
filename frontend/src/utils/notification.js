// 浏览器通知工具

// 请求通知权限
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('此浏览器不支持通知功能')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

// 发送通知
export function sendNotification(title, options = {}) {
  if (Notification.permission !== 'granted') {
    console.warn('通知权限未授予')
    return null
  }

  const defaultOptions = {
    icon: '/broom.svg',
    badge: '/broom.svg',
    requireInteraction: false,
    ...options
  }

  const notification = new Notification(title, defaultOptions)

  notification.onclick = () => {
    window.focus()
    notification.close()
  }

  return notification
}

// 发送值日提醒通知
export function sendCleaningReminder(dutyPerson, date) {
  return sendNotification('宿舍卫生值日提醒', {
    body: `${date} - 今天轮到 ${dutyPerson} 同学打扫卫生，请及时完成！`,
    tag: 'cleaning-reminder',
    renotify: true
  })
}

// 检查是否应该提醒（周二、周五、周日）
export function shouldRemindToday() {
  const day = new Date().getDay()
  return day === 0 || day === 2 || day === 5 // 周日、周二、周五
}

// 检查是否已经提醒过今天
const REMINDER_KEY = 'last_reminder_date'

export function hasRemindedToday() {
  const today = new Date().toDateString()
  return localStorage.getItem(REMINDER_KEY) === today
}

export function markRemindedToday() {
  localStorage.setItem(REMINDER_KEY, new Date().toDateString())
}

// 启动定时检查（每分钟检查一次）
let checkInterval = null

export function startReminderCheck(getDutyPerson) {
  // 先检查权限
  requestNotificationPermission()

  // 立即检查一次
  checkAndNotify(getDutyPerson)

  // 每分钟检查一次
  checkInterval = setInterval(() => {
    checkAndNotify(getDutyPerson)
  }, 60000)
}

export function stopReminderCheck() {
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = null
  }
}

function checkAndNotify(getDutyPerson) {
  const now = new Date()
  const hour = now.getHours()

  // 检查是否是提醒时间（9:00-9:59）
  if (hour === 9 && shouldRemindToday() && !hasRemindedToday()) {
    const dutyPerson = getDutyPerson()
    const dateStr = now.toLocaleDateString('zh-CN')
    sendCleaningReminder(dutyPerson, dateStr)
    markRemindedToday()
  }
}
