<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <!-- 月份导航 -->
    <div class="flex items-center justify-between mb-6">
      <button
        @click="prevMonth"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h3 class="text-xl font-semibold text-gray-800">
        {{ currentYear }}年{{ currentMonth + 1 }}月
      </h3>
      <button
        @click="nextMonth"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- 星期标题 -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-sm font-medium py-2"
        :class="['日', '六'].includes(day) ? 'text-red-500' : 'text-gray-500'"
      >
        {{ day }}
      </div>
    </div>

    <!-- 日期格子 -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(cell, index) in calendarCells"
        :key="index"
        class="aspect-square p-1"
      >
        <div
          v-if="cell"
          class="h-full flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all hover:scale-105 relative"
          :class="getCellClass(cell)"
          @click="selectDate(cell)"
        >
          <!-- 完成标记 -->
          <span
            v-if="cell.completed"
            class="absolute top-0.5 right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
          >
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span
            class="text-sm font-medium"
            :class="cell.isToday ? 'text-white' : ''"
          >
            {{ cell.date.getDate() }}
          </span>
          <span
            v-if="cell.dutyPerson"
            class="text-xs mt-0.5 px-1.5 py-0.5 rounded truncate max-w-full"
            :class="getDutyLabelClass(cell)"
          >
            {{ cell.dutyPerson }}
          </span>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-xs text-gray-500">
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
        <span>今天</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 bg-yellow-400 rounded-full"></span>
        <span>提醒日</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
          <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span>已完成</span>
      </div>
    </div>

    <!-- 选中日期详情 -->
    <div
      v-if="selectedDate"
      class="mt-4 p-4 rounded-lg"
      :class="selectedDate.completed ? 'bg-green-50 border border-green-200' : 'bg-blue-50'"
    >
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div class="flex items-center gap-2">
            <p class="font-medium text-gray-800">
              {{ formatSelectedDate }}
            </p>
            <span
              v-if="selectedDate.completed"
              class="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full"
            >
              已完成
            </span>
          </div>
          <p class="text-sm text-gray-600 mt-1">
            值日生：<span class="font-semibold text-blue-600">{{ selectedDate.dutyPerson }}</span>
          </p>
        </div>
        <div class="flex gap-2">
          <!-- 完成打卡按钮 -->
          <button
            @click="toggleComplete"
            class="px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1"
            :class="selectedDate.completed
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ selectedDate.completed ? '取消完成' : '完成打卡' }}
          </button>
          <!-- 修改值日按钮 -->
          <button
            v-if="!isPastDate(selectedDate.date)"
            @click="showModifyModal = true"
            class="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            修改值日
          </button>
        </div>
      </div>

      <!-- 完成时间提示 -->
      <p v-if="selectedDate.completedTime" class="text-xs text-gray-500 mt-2">
        完成时间：{{ selectedDate.completedTime }}
      </p>
    </div>
  </div>

  <!-- 修改值日弹窗 -->
  <Teleport to="body">
    <div
      v-if="showModifyModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showModifyModal = false"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h4 class="text-lg font-semibold mb-4">修改值日安排</h4>
        <p class="text-gray-600 mb-4">
          {{ formatSelectedDate }} 的值日生
        </p>
        <div class="space-y-2 mb-6">
          <button
            v-for="member in members"
            :key="member"
            class="w-full p-3 text-left rounded-lg border-2 transition-all"
            :class="selectedMember === member ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
            @click="selectedMember = member"
          >
            {{ member }}
          </button>
        </div>
        <div class="flex gap-3">
          <button
            @click="showModifyModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="confirmModify"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            确认修改
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getDutyPersonByDate, isReminderDay, MEMBERS } from '../utils/scheduler'

const props = defineProps({
  modelValue: {
    type: Date,
    default: () => new Date()
  },
  serverData: {
    type: Object,
    default: () => ({ completions: {}, exceptions: {} })
  }
})

const emit = defineEmits(['update:modelValue', 'dateSelect', 'modify', 'complete'])

const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const members = MEMBERS

const currentYear = ref(props.modelValue.getFullYear())
const currentMonth = ref(props.modelValue.getMonth())
const selectedDate = ref(null)
const showModifyModal = ref(false)
const selectedMember = ref('')

// 本地数据
const localExceptions = ref({})
const localCompletions = ref({})

// 加载本地数据
onMounted(() => {
  try {
    localExceptions.value = JSON.parse(localStorage.getItem('duty_exceptions') || '{}')
    localCompletions.value = JSON.parse(localStorage.getItem('duty_completion_status') || '{}')
  } catch (e) {
    console.error('Failed to load local data:', e)
  }
})

// 合并本地和服务器数据
const mergedData = computed(() => {
  return {
    exceptions: { ...localExceptions.value, ...props.serverData.exceptions },
    completions: { ...localCompletions.value, ...props.serverData.completions }
  }
})

// 日历格子数据
const calendarCells = computed(() => {
  const cells = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startPadding = firstDay.getDay()

  for (let i = 0; i < startPadding; i++) {
    cells.push(null)
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(currentYear.value, currentMonth.value, day)
    const dateKey = formatDateKey(date)

    // 使用合并后的数据
    const dutyPerson = mergedData.value.exceptions[dateKey] || getDutyPersonByDate(date)
    const completionInfo = mergedData.value.completions[dateKey]

    cells.push({
      date,
      dutyPerson,
      isToday: isSameDay(date, new Date()),
      isReminder: isReminderDay(date),
      completed: completionInfo?.completed || false,
      completedTime: completionInfo?.completedTime || null
    })
  }

  return cells
})

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  const d = selectedDate.value.date
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

function isPastDate(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

function getCellClass(cell) {
  const classes = []
  if (cell.isToday) {
    classes.push('bg-blue-500 text-white')
  } else if (cell.completed) {
    classes.push('bg-green-50 ring-2 ring-green-400')
  } else if (cell.isReminder) {
    classes.push('bg-yellow-50 ring-2 ring-yellow-300')
  } else {
    classes.push('hover:bg-gray-100')
  }
  return classes.join(' ')
}

function getDutyLabelClass(cell) {
  if (cell.completed) {
    return 'bg-green-100 text-green-700'
  }
  if (cell.isToday) {
    return 'bg-white/20 text-white'
  }
  return 'bg-gray-100 text-gray-600'
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function selectDate(cell) {
  selectedDate.value = { ...cell }
  selectedMember.value = cell.dutyPerson
  emit('dateSelect', cell)
}

function toggleComplete() {
  if (!selectedDate.value) return

  const dateKey = formatDateKey(selectedDate.value.date)
  const newStatus = !selectedDate.value.completed

  // 更新本地数据
  if (newStatus) {
    localCompletions.value[dateKey] = {
      completed: true,
      completedTime: new Date().toLocaleString('zh-CN')
    }
    selectedDate.value.completedTime = localCompletions.value[dateKey].completedTime
  } else {
    delete localCompletions.value[dateKey]
    selectedDate.value.completedTime = null
  }

  selectedDate.value.completed = newStatus

  // 保存到localStorage
  localStorage.setItem('duty_completion_status', JSON.stringify(localCompletions.value))

  emit('complete', {
    date: selectedDate.value.date,
    completed: newStatus,
    dutyPerson: selectedDate.value.dutyPerson
  })
}

function confirmModify() {
  if (selectedDate.value && selectedMember.value) {
    const dateKey = formatDateKey(selectedDate.value.date)
    localExceptions.value[dateKey] = selectedMember.value
    selectedDate.value.dutyPerson = selectedMember.value
    showModifyModal.value = false

    // 保存到localStorage
    localStorage.setItem('duty_exceptions', JSON.stringify(localExceptions.value))

    emit('modify', {
      date: selectedDate.value.date,
      newDutyPerson: selectedMember.value
    })
  }
}

watch(() => props.modelValue, (newVal) => {
  currentYear.value = newVal.getFullYear()
  currentMonth.value = newVal.getMonth()
})

// 监听服务器数据变化
watch(() => props.serverData, () => {
  if (selectedDate.value) {
    const dateKey = formatDateKey(selectedDate.value.date)
    const completionInfo = props.serverData.completions?.[dateKey]
    if (completionInfo) {
      selectedDate.value.completed = completionInfo.completed
      selectedDate.value.completedTime = completionInfo.completedTime
    }
    if (props.serverData.exceptions?.[dateKey]) {
      selectedDate.value.dutyPerson = props.serverData.exceptions[dateKey]
    }
  }
}, { deep: true })
</script>
