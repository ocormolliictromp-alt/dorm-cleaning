// 宿舍成员配置
export const MEMBERS = ['杨明浩', '朱锑', '崔同昊', '王研']

// 起始日期：2026年5月25日
const START_DATE = new Date(2026, 4, 25) // 月份从0开始

// 计算从起始日期到目标日期经过的周数
function getWeeksDiff(targetDate) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const diff = targetDate.getTime() - START_DATE.getTime()
  return Math.floor(diff / msPerWeek)
}

// 获取某一周的值日生
export function getWeekDutyPerson(weekOffset) {
  const index = ((weekOffset % MEMBERS.length) + MEMBERS.length) % MEMBERS.length
  return MEMBERS[index]
}

// 获取某一天的值日生
export function getDutyPersonByDate(date) {
  const weekOffset = getWeeksDiff(date)
  return getWeekDutyPerson(weekOffset)
}

// 获取某月的值日安排
export function getMonthSchedule(year, month) {
  const schedule = []
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
    schedule.push({
      date: new Date(day),
      dutyPerson: getDutyPersonByDate(day),
      isToday: isSameDay(day, new Date())
    })
  }

  return schedule
}

// 获取本周的值日安排
export function getWeekSchedule(date = new Date()) {
  const schedule = []
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay()) // 从周日开始

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek)
    currentDay.setDate(startOfWeek.getDate() + i)
    schedule.push({
      date: currentDay,
      dutyPerson: getDutyPersonByDate(currentDay),
      isToday: isSameDay(currentDay, new Date()),
      dayOfWeek: ['日', '一', '二', '三', '四', '五', '六'][i]
    })
  }

  return schedule
}

// 判断是否是提醒日（周二、周五、周日）
export function isReminderDay(date) {
  const day = date.getDay()
  return day === 2 || day === 5 || day === 0 // 周二=2, 周五=5, 周日=0
}

// 获取最近的下一个提醒日
export function getNextReminderDate(fromDate = new Date()) {
  const date = new Date(fromDate)
  date.setDate(date.getDate() + 1)

  while (!isReminderDay(date)) {
    date.setDate(date.getDate() + 1)
  }

  return date
}

// 辅助函数：判断是否同一天
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

// 格式化日期
export function formatDate(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 格式化简短日期
export function formatShortDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`
}
