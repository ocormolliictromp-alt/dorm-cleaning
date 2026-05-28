<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <span>👥</span> 宿舍成员
    </h3>
    <div class="space-y-3">
      <div
        v-for="(member, index) in members"
        :key="member.name"
        class="flex items-center justify-between p-3 rounded-lg transition-all"
        :class="[
          isCurrentDuty(member.name)
            ? 'bg-green-50 border-2 border-green-400'
            : 'bg-gray-50 hover:bg-gray-100'
        ]"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            :class="getColorClass(index)"
          >
            {{ member.name.charAt(0) }}
          </div>
          <div>
            <p class="font-medium text-gray-800">{{ member.name }}</p>
            <p class="text-xs text-gray-500">{{ member.phone }}</p>
          </div>
        </div>
        <span
          v-if="isCurrentDuty(member.name)"
          class="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium"
        >
          本周值日
        </span>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-200">
      <h4 class="text-sm font-medium text-gray-600 mb-2">值日顺序</h4>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span v-for="(name, idx) in order" :key="name" class="flex items-center">
          <span class="px-2 py-1 bg-gray-100 rounded">{{ name }}</span>
          <span v-if="idx < order.length - 1" class="text-gray-300 mx-1">→</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MEMBERS, getDutyPersonByDate } from '../utils/scheduler'

const props = defineProps({
  currentDate: {
    type: Date,
    default: () => new Date()
  }
})

const members = [
  { name: '朱锑', phone: '150****1195' },
  { name: '杨明浩', phone: '159****0292' },
  { name: '崔同昊', phone: '133****1463' },
  { name: '王研', phone: '177****3395' }
]

const order = MEMBERS

const currentDutyPerson = computed(() => getDutyPersonByDate(props.currentDate))

const isCurrentDuty = (name) => {
  return currentDutyPerson.value === name
}

const colorClasses = [
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-purple-500'
]

const getColorClass = (index) => colorClasses[index % colorClasses.length]
</script>
