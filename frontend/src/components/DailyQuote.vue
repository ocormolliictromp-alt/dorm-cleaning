<template>
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
    <div class="flex items-start gap-4">
      <span class="text-3xl">💭</span>
      <div>
        <p class="text-lg font-medium leading-relaxed mb-2">{{ quote.text }}</p>
        <p class="text-sm opacity-80">—— {{ quote.author }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getDailyQuote } from '../utils/quotes'

const props = defineProps({
  date: {
    type: Date,
    default: () => new Date()
  }
})

const quote = computed(() => getDailyQuote(props.date))
</script>
