<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
    <!-- Navigation -->
    <nav class="relative z-10 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
          <span class="text-xl font-bold text-white">AI Website Builder</span>
        </div>
        <div class="hidden md:flex items-center space-x-8">
          <a href="#features" class="text-white/80 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" class="text-white/80 hover:text-white transition-colors">How it Works</a>
          <a href="#pricing" class="text-white/80 hover:text-white transition-colors">Pricing</a>
          <button @click="startBuilding" class="btn-primary">
            Start Building
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative px-6 py-20">
      <div class="max-w-7xl mx-auto text-center">
        <!-- Floating Elements -->
        <div class="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-float"></div>
        <div class="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-float" style="animation-delay: 2s;"></div>
        <div class="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-400/20 rounded-full blur-xl animate-float" style="animation-delay: 4s;"></div>

        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Build Websites with
          <span class="gradient-text">AI Magic</span>
        </h1>
        
        <p class="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
          Describe your vision, customize with ease, and watch AI generate stunning websites. 
          Then edit everything visually with our powerful drag-and-drop editor.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button @click="startBuilding" class="btn-primary text-lg px-8 py-4">
            🚀 Start Building Free
          </button>
          <button class="btn-secondary text-lg px-8 py-4">
            ▶️ Watch Demo
          </button>
        </div>

        <!-- Demo Preview -->
        <div class="relative max-w-5xl mx-auto">
          <div class="glass-card p-1">
            <div class="bg-gray-900 rounded-xl overflow-hidden">
              <div class="flex items-center space-x-2 px-4 py-3 border-b border-gray-700">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-gray-400 text-sm ml-4">AI Website Builder</span>
              </div>
              <div class="p-8 text-left">
                <div class="typing-demo text-green-400 font-mono text-lg">
                  > Create a modern e-commerce website for selling tech gadgets...
                </div>
                <div class="mt-4 h-64 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                  <span class="text-white/60 text-lg">✨ AI Generated Website Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="px-6 py-20 bg-black/20">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold text-center text-white mb-16">
          Powerful <span class="gradient-text">Features</span>
        </h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">🤖</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">AI-Powered Generation</h3>
            <p class="text-white/70">Describe your website in plain English and watch AI create professional code instantly.</p>
          </div>

          <div class="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">🎨</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Visual Editor</h3>
            <p class="text-white/70">Drag, drop, and edit your website visually. No coding required for customizations.</p>
          </div>

          <div class="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">⚡</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Instant Export</h3>
            <p class="text-white/70">Download clean, production-ready HTML, CSS, and JavaScript code instantly.</p>
          </div>

          <div class="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div class="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">📱</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Responsive Design</h3>
            <p class="text-white/70">Every website is automatically optimized for mobile, tablet, and desktop.</p>
          </div>

          <div class="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div class="w-16 h-16 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">🛒</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">E-commerce Ready</h3>
            <p class="text-white/70">Built-in support for online stores, payment integration, and product catalogs.</p>
          </div>

          <div class="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div class="w-16 h-16 bg-gradient-to-r from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">🎯</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Multiple AI Models</h3>
            <p class="text-white/70">Powered by DeepSeek, Kimi, and Gemini for the best generation quality.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works -->
    <section id="how-it-works" class="px-6 py-20">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold text-center text-white mb-16">
          How It <span class="gradient-text">Works</span>
        </h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-white text-2xl font-bold">1</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Describe</h3>
            <p class="text-white/70 text-lg">Tell AI what kind of website you want. Be as detailed or simple as you like.</p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-white text-2xl font-bold">2</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Customize</h3>
            <p class="text-white/70 text-lg">Use our visual editor to perfect your design with drag-and-drop simplicity.</p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-white text-2xl font-bold">3</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Export</h3>
            <p class="text-white/70 text-lg">Download your complete website files and deploy anywhere you want.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="px-6 py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Build Something Amazing?
        </h2>
        <p class="text-xl text-white/80 mb-8">
          Join thousands of creators who are building the web with AI.
        </p>
        <button @click="startBuilding" class="btn-primary text-xl px-10 py-5">
          🚀 Start Building Now
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-6 py-12 border-t border-white/10">
      <div class="max-w-7xl mx-auto text-center">
        <div class="flex items-center justify-center space-x-2 mb-6">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
          <span class="text-xl font-bold text-white">AI Website Builder</span>
        </div>
        <p class="text-white/60">
          © 2024 AI Website Builder. Built with AI, designed for creators.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startBuilding = () => {
  router.push('/builder')
}
</script>

<style scoped>
.typing-demo {
  overflow: hidden;
  border-right: .15em solid orange;
  animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: orange; }
}
</style>