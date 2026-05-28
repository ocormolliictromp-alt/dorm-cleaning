// 值日完成状态管理
// 使用localStorage持久化存储

const COMPLETION_KEY = 'duty_completion_status'

// 获取所有完成状态
export function getCompletionStatus() {
  try {
    const data = localStorage.getItem(COMPLETION_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

// 获取某一天的完成状态
export function isCompleted(date) {
  const dateKey = formatDateKey(date)
  const status = getCompletionStatus()
  return status[dateKey] || false
}

// 设置某一天的完成状态
export function setCompletionStatus(date, completed) {
  const status = getCompletionStatus()
  const dateKey = formatDateKey(date)
  status[dateKey] = completed
  localStorage.setItem(COMPLETION_KEY, JSON.stringify(status))
}

// 切换完成状态
export function toggleCompletion(date) {
  const current = isCompleted(date)
  setCompletionStatus(date, !current)
  return !current
}

// 格式化日期为key
function formatDateKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 获取本周完成情况
export function getWeekCompletionStatus(weekStart) {
  const status = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    status.push({
      date,
      completed: isCompleted(date)
    })
  }
  return status
}

// 获取本月完成统计
export function getMonthStats(year, month, members) {
  const stats = {}
  members.forEach(m => stats[m] = { total: 0, completed: 0 })

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // 这里需要配合值日计算逻辑
  // 简化版本：返回统计结构
  return stats
}
