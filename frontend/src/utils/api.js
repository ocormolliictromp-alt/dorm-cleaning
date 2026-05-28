// API调用工具

// 获取API基础URL
function getApiBase() {
  // 开发环境
  if (import.meta.env.DEV) {
    return 'http://localhost:3000/api'
  }
  // 生产环境 - 使用相对路径
  return '/api'
}

const API_BASE = getApiBase()

// 获取值日表数据
export async function getSchedule(params = {}) {
  const query = new URLSearchParams(params).toString()
  const url = `${API_BASE}/schedule${query ? '?' + query : ''}`

  const response = await fetch(url)
  return response.json()
}

// 修改值日安排
export async function updateDutyPerson(date, dutyPerson) {
  const response = await fetch(`${API_BASE}/schedule`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, dutyPerson })
  })
  return response.json()
}

// 获取完成状态
export async function getCompletions() {
  const response = await fetch(`${API_BASE}/complete`)
  return response.json()
}

// 设置完成状态
export async function setCompletionStatus(date, completed, dutyPerson) {
  const response = await fetch(`${API_BASE}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, completed, dutyPerson })
  })
  return response.json()
}

// 获取每日语录
export async function getQuote(date) {
  const query = date ? `?date=${date}` : ''
  const response = await fetch(`${API_BASE}/quote${query}`)
  return response.json()
}
