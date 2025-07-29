<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <header class="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
          <span class="text-xl font-bold text-white">AI Website Builder</span>
        </router-link>
        <div class="flex items-center space-x-4">
          <button v-if="generatedCode" @click="openEditor" class="btn-secondary">
            🎨 Open Editor
          </button>
          <button v-if="generatedCode" @click="exportCode" class="btn-primary">
            💾 Export Code
          </button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 h-[calc(100vh-80px)]">
      <!-- Left Panel -->
      <div class="w-1/3 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div class="p-6 border-b border-gray-700">
          <h2 class="text-xl font-bold text-white mb-4">🤖 Describe Your Website</h2>
          <textarea
            v-model="prompt"
            placeholder="Example: Create a modern e-commerce website for selling tech gadgets with dark theme, product grid, and contact form..."
            class="w-full h-32 bg-gray-700 text-white p-4 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="p-6 border-b border-gray-700 flex-1 overflow-y-auto">
          <h3 class="text-lg font-semibold text-white mb-4">⚡ Quick Options</h3>
          
          <!-- Website Type -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">Website Type</label>
            <div class="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              <button
                v-for="type in websiteTypes"
                :key="type.value"
                @click="selectedType = type.value"
                :class="getTypeButtonClass(type.value)"
              >
                {{ type.icon }} {{ type.label }}
              </button>
            </div>
          </div>

          <!-- Theme -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">Theme</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="theme in themes"
                :key="theme.value"
                @click="selectedTheme = theme.value"
                :class="getThemeButtonClass(theme.value)"
              >
                {{ theme.icon }} {{ theme.label }}
              </button>
            </div>
          </div>

          <!-- Features -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">Features</label>
            <div class="space-y-2">
              <label
                v-for="feature in features"
                :key="feature.value"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  v-model="selectedFeatures"
                  :value="feature.value"
                  class="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                >
                <span class="text-gray-300 text-sm">{{ feature.icon }} {{ feature.label }}</span>
              </label>
            </div>
          </div>

          <!-- AI Model -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">AI Model</label>
            <select
              v-model="selectedModel"
              class="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="deepseek">🧠 DeepSeek (Recommended)</option>
              <option value="kimi">⚡ Kimi (Fast)</option>
              <option value="gemini">💎 Gemini Pro (Creative)</option>
            </select>
          </div>
        </div>

        <!-- Generate Button -->
        <div class="p-6">
          <button
            @click="generateWebsite"
            :disabled="!prompt.trim() || isGenerating"
            :class="getGenerateButtonClass()"
          >
            <span v-if="isGenerating" class="flex items-center justify-center space-x-2">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating...</span>
            </span>
            <span v-else>🚀 Generate Website</span>
          </button>
        </div>
      </div>

      <!-- Right Panel - Preview -->
      <div class="flex-1 bg-gray-50 flex flex-col">
        <div v-if="!generatedCode" class="flex-1 flex items-center justify-center">
          <div class="text-center max-w-md">
            <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-4xl">🎨</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Ready to Create?</h3>
            <p class="text-gray-600 mb-6">
              Describe your website idea and customize the options on the left. 
              Click "Generate Website" to see your creation come to life!
            </p>
            <div class="text-sm text-gray-500">
              💡 Tip: Be specific about your requirements for better results
            </div>
          </div>
        </div>

        <!-- Generated Preview -->
        <div v-else class="flex-1 flex flex-col">
          <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">Preview</h3>
            <button @click="showCode = !showCode" class="btn-secondary text-sm">
              {{ showCode ? '👁️ Preview' : '💻 Code' }}
            </button>
          </div>

          <div class="flex-1 p-6 overflow-auto">
            <div v-if="!showCode">
              <iframe
                :srcdoc="generatedCode"
                class="w-full h-full border border-gray-300 rounded-lg bg-white"
                style="min-height: 600px;"
              ></iframe>
            </div>
            
            <div v-else class="h-full">
              <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto h-full text-sm"><code>{{ generatedCode }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import aiService from '@/services/aiService'
import { createFallbackHTML } from '@/utils/htmlTemplates'

const router = useRouter()

// Reactive data
const prompt = ref('')
const selectedType = ref('landing')
const selectedModel = ref('deepseek')
const isGenerating = ref(false)
const generatedCode = ref('')
const showCode = ref(false)
const selectedTheme = ref('modern')
const selectedFeatures = ref<string[]>(['responsive'])

// Options data
const websiteTypes = [
  { value: 'landing', label: 'Landing Page', icon: '🏠' },
  { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
  { value: 'portfolio', label: 'Portfolio', icon: '💼' },
  { value: 'blog', label: 'Blog', icon: '📝' },
  { value: 'medical', label: 'Medical/Healthcare', icon: '🏥' },
  { value: 'restaurant', label: 'Restaurant/Food', icon: '🍕' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'corporate', label: 'Corporate', icon: '💼' },
  { value: 'realestate', label: 'Real Estate', icon: '🏠' },
  { value: 'event', label: 'Event', icon: '🎪' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
  { value: 'legal', label: 'Legal', icon: '⚖️' },
  { value: 'fitness', label: 'Fitness', icon: '🏋️' },
  { value: 'services', label: 'Services', icon: '🔧' },
  { value: 'saas', label: 'SaaS/Tech', icon: '📱' },
  { value: 'music', label: 'Music/Entertainment', icon: '🎵' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'local', label: 'Local Business', icon: '🏪' }
]

const themes = [
  { value: 'modern', label: 'Modern', icon: '✨' },
  { value: 'minimal', label: 'Minimal', icon: '⚪' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'colorful', label: 'Colorful', icon: '🌈' }
]

const features = [
  { value: 'responsive', label: 'Responsive Design', icon: '📱' },
  { value: 'contact', label: 'Contact Form', icon: '📧' },
  { value: 'gallery', label: 'Image Gallery', icon: '🖼️' },
  { value: 'testimonials', label: 'Testimonials', icon: '💬' },
  { value: 'pricing', label: 'Pricing Tables', icon: '💰' },
  { value: 'blog', label: 'Blog Section', icon: '📰' },
  { value: 'social', label: 'Social Links', icon: '🔗' },
  { value: 'animations', label: 'Animations', icon: '🎬' }
]

// Methods
const getTypeButtonClass = (value: string) => {
  const base = 'p-3 rounded-lg border text-sm font-medium transition-all'
  return selectedType.value === value
    ? `${base} bg-blue-600 border-blue-500 text-white`
    : `${base} bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600`
}

const getThemeButtonClass = (value: string) => {
  const base = 'p-3 rounded-lg border text-sm font-medium transition-all'
  return selectedTheme.value === value
    ? `${base} bg-purple-600 border-purple-500 text-white`
    : `${base} bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600`
}

const getGenerateButtonClass = () => {
  const base = 'w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all'
  return !prompt.value.trim() || isGenerating.value
    ? `${base} bg-gray-600 text-gray-400 cursor-not-allowed`
    : `${base} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 shadow-lg`
}

const generateWebsite = async () => {
  if (!prompt.value.trim()) return
  
  isGenerating.value = true
  
  try {
    const websiteRequest = {
      prompt: prompt.value.trim(),
      type: selectedType.value,
      theme: selectedTheme.value,
      features: selectedFeatures.value,
      model: selectedModel.value
    }
    
    console.log('Generating website with DeepSeek API...', websiteRequest)
    generatedCode.value = await aiService.generateWebsite(websiteRequest)
    console.log('Website generated successfully!')
    
  } catch (error) {
    console.error('Generation failed:', error)
    // Show fallback HTML on error
    generatedCode.value = createFallbackHTML(prompt.value)
  } finally {
    isGenerating.value = false
  }
}


const openEditor = () => {
  localStorage.setItem('generated-code', generatedCode.value)
  router.push('/editor')
}

const exportCode = () => {
  const blob = new Blob([generatedCode.value], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'generated-website.html'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>