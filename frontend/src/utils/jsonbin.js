// JSONbin.io 数据存储
// 免费的JSON云端存储服务

// JSONbin配置
// 你需要在 https://jsonbin.io 创建账号获取 API Key
// 然后创建一个Bin获取 Bin ID

const JSONBIN_API_KEY = '$2a$10$caiqCi9CC.KScYbcJXS2PO5lcu6N3Qy3M712zbk4Q3AeRJ/GgA9Xi'
const JSONBIN_BIN_ID = '6a185701ddf5aa59f770490a'

const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3'

// 获取数据
export async function getData() {
  try {
    const response = await fetch(`${JSONBIN_BASE_URL}/b/${JSONBIN_BIN_ID}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const result = await response.json()
    return result.record
  } catch (error) {
    console.error('JSONbin read error:', error)
    return null
  }
}

// 保存数据
export async function saveData(data) {
  try {
    const response = await fetch(`${JSONBIN_BASE_URL}/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to save data')
    }

    const result = await response.json()
    return result.record
  } catch (error) {
    console.error('JSONbin write error:', error)
    return null
  }
}

// 初始化数据结构
export function createInitialData() {
  return {
    completions: {},      // 完成状态
    exceptions: {},       // 值日例外安排
    lastUpdated: new Date().toISOString()
  }
}

// 检查配置是否有效
export function isConfigured() {
  return JSONBIN_API_KEY !== 'YOUR_API_KEY' && JSONBIN_BIN_ID !== 'YOUR_BIN_ID'
}
