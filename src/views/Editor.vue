<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <header class="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/builder" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
            <span class="text-xl font-bold text-white">Visual Editor</span>
          </router-link>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="undoAction" class="btn-secondary" :disabled="!canUndo">
            ↶ Undo
          </button>
          <button @click="redoAction" class="btn-secondary" :disabled="!canRedo">
            ↷ Redo
          </button>
          <button @click="saveProject" class="btn-secondary">
            💾 Save
          </button>
          <button @click="exportCode" class="btn-primary">
            📦 Export
          </button>
        </div>
      </div>
    </header>

    <div class="flex h-[calc(100vh-80px)]">
      <!-- Left Sidebar - Tools -->
      <div class="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-lg font-semibold text-white mb-4">🛠️ Tools</h3>
          
          <!-- Tool Tabs -->
          <div class="flex space-x-2 mb-4">
            <button
              @click="activeTab = 'elements'"
              :class="getTabClass('elements')"
            >
              Elements
            </button>
            <button
              @click="activeTab = 'styles'"
              :class="getTabClass('styles')"
            >
              Styles
            </button>
          </div>
        </div>

        <!-- Elements Panel -->
        <div v-if="activeTab === 'elements'" class="flex-1 overflow-y-auto p-4">
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-300 mb-2">Content Elements</h4>
              <div class="grid grid-cols-1 gap-2">
                <div
                  v-for="element in contentElements"
                  :key="element.type"
                  @click="addElement(element)"
                  class="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 text-center text-sm text-gray-300 transition-colors border border-gray-600 hover:border-blue-500"
                >
                  <div class="text-2xl mb-2">{{ element.icon }}</div>
                  <div class="font-medium">{{ element.name }}</div>
                  <div class="text-xs text-gray-400 mt-1">{{ element.description }}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-300 mb-2">Layout Elements</h4>
              <div class="grid grid-cols-1 gap-2">
                <div
                  v-for="element in layoutElements"
                  :key="element.type"
                  @click="addElement(element)"
                  class="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 text-center text-sm text-gray-300 transition-colors border border-gray-600 hover:border-purple-500"
                >
                  <div class="text-2xl mb-2">{{ element.icon }}</div>
                  <div class="font-medium">{{ element.name }}</div>
                  <div class="text-xs text-gray-400 mt-1">{{ element.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Styles Panel -->
        <div v-if="activeTab === 'styles'" class="flex-1 overflow-y-auto p-4">
          <div v-if="!selectedElement" class="text-center text-gray-400 py-8">
            <div class="text-4xl mb-2">🎨</div>
            <p>Select an element to edit its properties</p>
            <p class="text-xs mt-2">Click on any element in the canvas</p>
          </div>
          <div v-else class="space-y-4">
            <h4 class="text-lg font-medium text-white mb-4 flex items-center justify-between">
              <span>{{ selectedElement.type }} Settings</span>
              <button @click="selectedElement = null" class="text-gray-400 hover:text-white">✕</button>
            </h4>
            
            <!-- Content Editor -->
            <div>
              <label class="block text-sm text-gray-300 mb-2">Content</label>
              <textarea
                v-model="selectedElement.content"
                @input="updateElementContent"
                class="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-vertical"
                rows="4"
                placeholder="Enter your content here..."
              ></textarea>
            </div>

            <!-- Style Controls -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-300 mb-2">Background Color</label>
                <div class="flex space-x-2">
                  <input 
                    type="color" 
                    v-model="selectedElement.styles.backgroundColor" 
                    @input="updateElementStyles"
                    class="w-12 h-10 rounded border border-gray-600"
                  >
                  <input 
                    type="text" 
                    v-model="selectedElement.styles.backgroundColor" 
                    @input="updateElementStyles"
                    class="flex-1 bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                    placeholder="#ffffff"
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm text-gray-300 mb-2">Text Color</label>
                <div class="flex space-x-2">
                  <input 
                    type="color" 
                    v-model="selectedElement.styles.color" 
                    @input="updateElementStyles"
                    class="w-12 h-10 rounded border border-gray-600"
                  >
                  <input 
                    type="text" 
                    v-model="selectedElement.styles.color" 
                    @input="updateElementStyles"
                    class="flex-1 bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                    placeholder="#000000"
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm text-gray-300 mb-2">Font Size: {{ selectedElement.styles.fontSize }}px</label>
                <input 
                  type="range" 
                  v-model.number="selectedElement.styles.fontSize" 
                  @input="updateElementStyles"
                  min="12" 
                  max="72" 
                  class="w-full"
                >
              </div>
              
              <div>
                <label class="block text-sm text-gray-300 mb-2">Padding: {{ selectedElement.styles.padding }}px</label>
                <input 
                  type="range" 
                  v-model.number="selectedElement.styles.padding" 
                  @input="updateElementStyles"
                  min="0" 
                  max="50" 
                  class="w-full"
                >
              </div>

              <div>
                <label class="block text-sm text-gray-300 mb-2">Border Radius: {{ selectedElement.styles.borderRadius }}px</label>
                <input 
                  type="range" 
                  v-model.number="selectedElement.styles.borderRadius" 
                  @input="updateElementStyles"
                  min="0" 
                  max="25" 
                  class="w-full"
                >
              </div>

              <div>
                <label class="block text-sm text-gray-300 mb-2">Width</label>
                <select 
                  v-model="selectedElement.styles.width"
                  @change="updateElementStyles"
                  class="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="auto">Auto</option>
                  <option value="100%">Full Width</option>
                  <option value="50%">Half Width</option>
                  <option value="300px">Fixed 300px</option>
                  <option value="500px">Fixed 500px</option>
                </select>
              </div>

              <div>
                <label class="block text-sm text-gray-300 mb-2">Text Alignment</label>
                <select 
                  v-model="selectedElement.styles.textAlign"
                  @change="updateElementStyles"
                  class="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Canvas -->
      <div class="flex-1 bg-gray-100 flex flex-col">
        <!-- Canvas Toolbar -->
        <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-gray-600 font-medium">Canvas</span>
            <div class="flex items-center space-x-2">
              <button
                @click="canvasMode = 'desktop'"
                :class="getCanvasModeClass('desktop')"
              >
                🖥️ Desktop
              </button>
              <button
                @click="canvasMode = 'mobile'"
                :class="getCanvasModeClass('mobile')"
              >
                📱 Mobile
              </button>
            </div>
          </div>
          <div class="text-sm text-gray-500">
            {{ elements.length }} elements
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="flex-1 p-8 overflow-auto">
          <div 
            ref="canvasContainer"
            :class="canvasClasses" 
            class="bg-white min-h-full border border-gray-300 rounded-lg shadow-lg relative"
            @click="deselectElement"
          >
            <!-- Drop Zone Message -->
            <div
              v-if="elements.length === 0"
              class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none"
            >
              <div class="text-center">
                <div class="text-6xl mb-4">🎨</div>
                <div class="text-2xl mb-2 font-semibold">Start Building</div>
                <div class="text-lg">Click elements from the sidebar to add them</div>
                <div class="text-sm mt-2">Then click elements here to edit them</div>
              </div>
            </div>

            <!-- Editable Elements -->
            <draggable
              v-model="elements"
              group="canvas"
              item-key="id"
              class="min-h-full"
              @end="onDragEnd"
              ghost-class="ghost-element"
              chosen-class="chosen-element"
              drag-class="drag-element"
            >
              <template #item="{ element, index }">
                <div
                  :key="element.id"
                  @click.stop="selectElement(element)"
                  :class="[
                    'relative group cursor-pointer transition-all duration-200 m-2',
                    selectedElement?.id === element.id && 'ring-2 ring-blue-500 ring-opacity-75 bg-blue-50'
                  ]"
                  :style="getElementStyles(element)"
                >
                  <!-- Element Content -->
                  <div 
                    class="element-content"
                    :class="getElementContentClass(element.type)"
                    v-html="getRenderedContent(element)"
                  ></div>
                  
                  <!-- Element Controls -->
                  <div
                    v-if="selectedElement?.id === element.id"
                    class="absolute -top-10 left-0 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-2 z-10 shadow-lg"
                  >
                    <span>{{ element.type }}</span>
                    <button 
                      @click.stop="duplicateElement(index)" 
                      class="hover:text-yellow-300 transition-colors"
                      title="Duplicate"
                    >
                      📄
                    </button>
                    <button 
                      @click.stop="deleteElement(index)" 
                      class="hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import draggable from 'vuedraggable'

// Types
interface Element {
  id: string
  type: string
  content: string
  styles: Record<string, any>
}

// Reactive data
const activeTab = ref('elements')
const canvasMode = ref('desktop')
const selectedElement = ref<Element | null>(null)
const elements = ref<Element[]>([])
const canvasContainer = ref<HTMLElement>()

// History for undo/redo
const history = ref<Element[][]>([])
const historyIndex = ref(-1)

// Element definitions
const layoutElements = [
  { type: 'section', name: 'Section', icon: '📦', description: 'Container section' },
  { type: 'container', name: 'Container', icon: '🗂️', description: 'Content wrapper' },
  { type: 'spacer', name: 'Spacer', icon: '📏', description: 'Empty space' }
]

const contentElements = [
  { type: 'heading', name: 'Heading', icon: '📝', description: 'Title text' },
  { type: 'text', name: 'Paragraph', icon: '📄', description: 'Body text' },
  { type: 'button', name: 'Button', icon: '🔘', description: 'Call-to-action' },
  { type: 'image', name: 'Image', icon: '🖼️', description: 'Picture/photo' },
  { type: 'card', name: 'Card', icon: '🃏', description: 'Content card' },
  { type: 'list', name: 'List', icon: '📋', description: 'Bullet points' }
]

// Computed
const canvasClasses = computed(() => {
  const base = 'mx-auto transition-all duration-300'
  return canvasMode.value === 'mobile' ? `${base} max-w-sm` : `${base} w-full`
})

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

// Methods
const getTabClass = (tab: string) => {
  const base = 'px-3 py-2 rounded text-sm font-medium transition-colors'
  return activeTab.value === tab
    ? `${base} bg-blue-600 text-white`
    : `${base} bg-gray-700 text-gray-300 hover:bg-gray-600`
}

const getCanvasModeClass = (mode: string) => {
  const base = 'px-3 py-1 rounded text-sm transition-colors'
  return canvasMode.value === mode
    ? `${base} bg-blue-500 text-white`
    : `${base} bg-gray-200 text-gray-700 hover:bg-gray-300`
}

const addElement = (elementType: any) => {
  const newElement: Element = {
    id: Date.now().toString(),
    type: elementType.type,
    content: getDefaultContent(elementType.type),
    styles: getDefaultStyles(elementType.type)
  }
  
  saveToHistory()
  elements.value.push(newElement)
  selectedElement.value = newElement
  activeTab.value = 'styles'
}

const getDefaultContent = (type: string): string => {
  const defaults: Record<string, string> = {
    heading: 'Your Amazing Heading',
    text: 'This is your paragraph text. Click to edit this content and make it your own. Add your message here.',
    button: 'Click Me',
    image: '<img src="https://via.placeholder.com/400x250/4f46e5/ffffff?text=Your+Image" alt="Placeholder" style="width:100%;height:auto;">',
    card: '<div style="padding:20px;"><h3>Card Title</h3><p>Card description goes here. This is a sample card content.</p></div>',
    section: '<div style="padding:40px;text-align:center;"><h2>Section Title</h2><p>Section content goes here.</p></div>',
    container: '<div style="padding:20px;">Container content</div>',
    list: '<ul><li>First item</li><li>Second item</li><li>Third item</li></ul>',
    spacer: ''
  }
  return defaults[type] || 'New Element'
}

const getDefaultStyles = (type: string): Record<string, any> => {
  const baseStyles = {
    padding: 16,
    margin: 8,
    backgroundColor: '#ffffff',
    color: '#000000',
    fontSize: 16,
    borderRadius: 0,
    width: 'auto',
    textAlign: 'left'
  }

  const typeStyles: Record<string, Record<string, any>> = {
    heading: { 
      fontSize: 32, 
      fontWeight: 'bold', 
      margin: 16,
      color: '#1f2937'
    },
    button: { 
      backgroundColor: '#3b82f6', 
      color: '#ffffff', 
      borderRadius: 8, 
      cursor: 'pointer',
      padding: 12,
      textAlign: 'center',
      display: 'inline-block',
      fontWeight: 'bold'
    },
    card: { 
      border: '1px solid #e5e7eb', 
      borderRadius: 12, 
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: 20,
      backgroundColor: '#ffffff'
    },
    section: {
      padding: 40,
      margin: 0,
      minHeight: 200,
      backgroundColor: '#f9fafb',
      width: '100%'
    },
    image: {
      padding: 0,
      margin: 8
    },
    spacer: {
      padding: 0,
      margin: 0,
      height: 40,
      backgroundColor: 'transparent'
    }
  }

  return { ...baseStyles, ...typeStyles[type] }
}

const selectElement = (element: Element) => {
  selectedElement.value = element
  activeTab.value = 'styles'
}

const deselectElement = () => {
  selectedElement.value = null
}

const updateElementContent = () => {
  if (selectedElement.value) {
    const index = elements.value.findIndex(el => el.id === selectedElement.value?.id)
    if (index !== -1) {
      elements.value[index].content = selectedElement.value.content
    }
  }
}

const updateElementStyles = () => {
  if (selectedElement.value) {
    const index = elements.value.findIndex(el => el.id === selectedElement.value?.id)
    if (index !== -1) {
      elements.value[index].styles = { ...selectedElement.value.styles }
    }
  }
}

const deleteElement = (index: number) => {
  saveToHistory()
  elements.value.splice(index, 1)
  selectedElement.value = null
}

const duplicateElement = (index: number) => {
  const original = elements.value[index]
  const duplicate: Element = {
    ...original,
    id: Date.now().toString(),
    content: original.content
  }
  
  saveToHistory()
  elements.value.splice(index + 1, 0, duplicate)
}

const getElementStyles = (element: Element) => {
  const styles = { ...element.styles }
  
  // Convert numeric values to pixels where appropriate
  Object.keys(styles).forEach(key => {
    if (typeof styles[key] === 'number' && ['padding', 'margin', 'fontSize', 'borderRadius', 'height'].includes(key)) {
      styles[key] = `${styles[key]}px`
    }
  })
  
  return styles
}

const getElementContentClass = (type: string) => {
  const classes: Record<string, string> = {
    heading: 'font-bold',
    button: 'inline-block cursor-pointer hover:opacity-80 transition-opacity',
    card: 'rounded-lg',
    section: 'w-full',
    image: '',
    text: 'leading-relaxed',
    list: '',
    spacer: 'w-full'
  }
  return classes[type] || ''
}

const getRenderedContent = (element: Element) => {
  if (element.type === 'spacer') {
    return '&nbsp;' // Non-breaking space for spacer
  }
  if (element.type === 'image' && element.content.includes('<img')) {
    return element.content // HTML content
  }
  return element.content // Text content
}

const onDragEnd = () => {
  saveToHistory()
}

// History management
const saveToHistory = () => {
  const currentState = JSON.parse(JSON.stringify(elements.value))
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(currentState)
  historyIndex.value = history.value.length - 1
}

const undoAction = () => {
  if (canUndo.value) {
    historyIndex.value--
    elements.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    selectedElement.value = null
  }
}

const redoAction = () => {
  if (canRedo.value) {
    historyIndex.value++
    elements.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    selectedElement.value = null
  }
}

const saveProject = () => {
  localStorage.setItem('editor-project', JSON.stringify(elements.value))
  alert('Project saved!')
}

const exportCode = () => {
  const html = generateHTML()
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'edited-website.html'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const generateHTML = (): string => {
  const elementsHTML = elements.value.map(el => {
    const styles = getElementStyles(el)
    const styleString = Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ')
    
    if (el.type === 'image' && el.content.includes('<img')) {
      return `<div style="${styleString}">${el.content}</div>`
    }
    
    return `<div style="${styleString}">${el.content}</div>`
  }).join('\n    ')

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edited Website</title>
    <style>
        body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        * { box-sizing: border-box; }
    </style>
</head>
<body>
    ${elementsHTML}
</body>
</html>`
}

// Load saved project on mount
onMounted(() => {
  const saved = localStorage.getItem('editor-project')
  if (saved) {
    try {
      elements.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load saved project:', e)
    }
  }
  
  // Initialize history
  saveToHistory()
})
</script>

<style scoped>
.ghost-element {
  opacity: 0.5;
  background: #3b82f6;
  transform: rotate(2deg);
}

.chosen-element {
  opacity: 0.8;
}

.drag-element {
  transform: rotate(5deg);
  z-index: 100;
}

.element-content img {
  max-width: 100%;
  height: auto;
}
</style>