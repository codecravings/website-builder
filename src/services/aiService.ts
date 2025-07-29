interface AIResponse {
  content: string
  isComplete: boolean
  continuationNeeded: boolean
}

interface WebsiteRequest {
  prompt: string
  type: string
  theme: string
  features: string[]
  model: string
}

class AIService {
  private apiKey = 'sk-b02de8203aee4c90bfa62ccb7c25b56e'
  private baseUrl = 'https://api.deepseek.com/v1/chat/completions'
  private maxTokens = 8000
  private maxRetries = 3

  async generateWebsite(request: WebsiteRequest): Promise<string> {
    let fullContent = ''
    let attempts = 0
    let lastContext = ''

    while (attempts < this.maxRetries) {
      attempts++
      
      try {
        const prompt = this.buildPrompt(request, lastContext, attempts > 1)
        const response = await this.callDeepSeekAPI(prompt)
        
        if (response.content) {
          fullContent += response.content
          lastContext = response.content.slice(-500) // Keep last 500 chars for context
          
          // Check if we have a complete HTML document
          if (this.isCompleteHTML(fullContent)) {
            return this.cleanHTML(fullContent)
          }
          
          // If response seems incomplete, continue
          if (response.continuationNeeded || !response.isComplete) {
            console.log(`Attempt ${attempts}: Continuing generation...`)
            continue
          }
          
          // If we have substantial content but not complete HTML, try to complete
          if (fullContent.length > 1000 && attempts < this.maxRetries) {
            console.log(`Attempt ${attempts}: Completing HTML structure...`)
            continue
          }
        }
        
        break
      } catch (error) {
        console.error(`Attempt ${attempts} failed:`, error)
        if (attempts === this.maxRetries) {
          throw error
        }
        await this.delay(1000 * attempts) // Progressive delay
      }
    }

    return fullContent || this.getFallbackHTML(request)
  }

  private async callDeepSeekAPI(prompt: string): Promise<AIResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an elite web designer and developer with 15+ years of experience creating award-winning websites. You specialize in modern, visually stunning designs that convert visitors into customers. Your websites are known for their exceptional visual appeal, perfect user experience, and cutting-edge design trends. You only create websites that look like they cost $10,000+ to design. Generate complete, self-contained HTML files with embedded CSS and JavaScript that are immediately production-ready.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.7,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    const finishReason = data.choices?.[0]?.finish_reason

    return {
      content,
      isComplete: finishReason === 'stop',
      continuationNeeded: finishReason === 'length' || content.length >= this.maxTokens * 3
    }
  }

  private buildPrompt(request: WebsiteRequest, lastContext: string, isContinuation: boolean): string {
    if (isContinuation && lastContext) {
      return `Continue generating the HTML website from where you left off. 
      
Previous context: "${lastContext}"

Complete the website ensuring:
- Proper HTML structure closure
- All sections are finished
- Clean, modern design
- Responsive layout
- Working navigation

Continue from where the previous response ended.`
    }

    const featuresText = request.features.length > 0 
      ? `Include these features: ${request.features.join(', ')}` 
      : 'Include standard web features'

    const typeSpecificFeatures = this.getTypeSpecificFeatures(request.type)
    
    return `You are an elite web designer creating award-winning websites. Generate a breathtaking, professional website that will WOW users instantly!

**🎯 PROJECT:** ${request.prompt}

**📋 SPECIFICATIONS:**
- Website Type: ${request.type}
- Design Theme: ${request.theme}  
- Required Features: ${featuresText}
- Industry Specific: ${typeSpecificFeatures}

**🏆 DESIGN EXCELLENCE REQUIREMENTS:**

**Visual Impact (MANDATORY):**
- Use striking gradient backgrounds (linear-gradient, radial-gradient)
- Implement glassmorphism effects (backdrop-filter: blur())
- Add subtle animations (CSS keyframes, transforms)
- Create depth with box-shadows and layering
- Use modern color palettes (complementary colors)
- Include micro-interactions on hover states

**Layout & Typography:**
- Implement modern CSS Grid layouts
- Use perfect typography hierarchy (h1: 3-4rem, h2: 2.5rem, p: 1.1rem)
- Add generous whitespace and breathing room
- Create asymmetrical, magazine-style layouts
- Use web-safe font stacks with fallbacks

**Interactive Elements:**
- Smooth scroll behavior
- Hover animations (transform: scale, translateY)
- Gradient button effects with transitions
- Parallax-style background effects
- Animated counters or progress bars
- Form validation with visual feedback

**Professional Sections (INCLUDE ALL):**
1. **Hero Section**: Full-height with gradient background, compelling headline, subtext, CTA button
2. **Features/Services**: Grid layout with icons, hover effects, cards
3. **About/Story**: Two-column layout with imagery and compelling copy
4. **Testimonials**: Carousel-style or grid with ratings/quotes
5. **Call-to-Action**: Prominent section with conversion focus
6. **Footer**: Clean, organized with links and contact info

**⚡ TECHNICAL REQUIREMENTS:**
- Single HTML file with embedded CSS and JavaScript
- You MAY use Vue.js CDN for interactivity (simple components, reactive data)
- You MAY use basic CSS frameworks (Bootstrap CDN is OK)
- NO advanced frameworks like Tailwind, React, Angular
- Use semantic HTML5 elements
- Mobile-first responsive design with CSS Grid/Flexbox
- Include engaging interactions and animations
- Fast loading with clean, readable code

**🎨 VISUAL EXAMPLES TO INSPIRE:**
- Hero backgrounds: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- Glass cards: backdrop-filter: blur(10px), rgba(255,255,255,0.1)
- Interactive buttons: transform: translateY(-3px) scale(1.05) on hover
- Smooth animations: @keyframes fadeInUp, slide effects
- Modern shadows: box-shadow: 0 25px 50px rgba(0,0,0,0.15)
- Colorful sections with different themes per section

**📱 RESPONSIVE DESIGN:**
- Mobile: Single column, stacked layout
- Tablet: Two-column grid where appropriate  
- Desktop: Full multi-column layouts
- Use CSS media queries for breakpoints

**🚀 CONVERSION OPTIMIZATION:**
- Clear value propositions in headlines
- Strategic placement of CTA buttons
- Social proof elements throughout
- Easy-to-scan content structure
- Trust signals and credibility markers

**CRITICAL:** Generate ONLY the complete HTML with embedded CSS/JS. Make it visually stunning with modern design trends. Use actual realistic content, not just placeholders. Create something that looks like it cost $5000 to design!`
  }

  private getTypeSpecificFeatures(type: string): string {
    const typeFeatures: Record<string, string> = {
      landing: 'Hero with value prop, feature highlights, social proof, pricing/plans, testimonials, FAQ, strong CTAs',
      ecommerce: 'Product showcase, shopping cart, checkout flow, customer reviews, product filters, wishlist, secure payment',
      portfolio: 'Project galleries, case studies, client testimonials, skills showcase, contact form, downloadable resume',
      blog: 'Article previews, categories, search, author profiles, related posts, newsletter signup, social sharing',
      medical: 'Appointment booking, doctor profiles, services, patient testimonials, insurance info, online consultations',
      restaurant: 'Menu with photos/prices, online ordering, reservations, location/hours, chef profiles, food gallery',
      education: 'Course catalog, enrollment, faculty profiles, student portal, events calendar, virtual tours',
      corporate: 'Services overview, team profiles, case studies, client logos, testimonials, career opportunities',
      realestate: 'Property listings, search filters, agent profiles, virtual tours, mortgage calculator, neighborhood info',
      event: 'Event details, ticket booking, speaker profiles, schedule, venue info, past event galleries',
      finance: 'Service offerings, financial calculators, client testimonials, security certifications, consultation booking',
      creative: 'Portfolio showcase, project case studies, client testimonials, creative process, social media links',
      legal: 'Practice areas, attorney bios, case results, consultation booking, legal resources, testimonials',
      fitness: 'Class schedules, trainer profiles, membership tiers, facility virtual tour, success stories',
      services: 'Service packages, pricing tiers, before/after showcases, testimonials, booking system, guarantees',
      saas: 'Feature demos, pricing tiers, free trial, customer stories, integration showcases, API docs',
      music: 'Event calendar, music samples, photo galleries, booking info, band member profiles, merchandise',
      travel: 'Destination highlights, booking engine, travel packages, customer reviews, travel blog, photo galleries',
      local: 'Business info, services, customer reviews, location map, hours, special offers, community involvement'
    }
    
    return typeFeatures[type] || 'Include comprehensive industry-specific features and compelling content'
  }

  private isCompleteHTML(content: string): boolean {
    const hasDoctype = content.includes('<!DOCTYPE')
    const hasHtmlOpen = content.includes('<html')
    const hasHtmlClose = content.includes('</html>')
    const hasBodyClose = content.includes('</body>')
    const hasHeadClose = content.includes('</head>')
    
    return hasDoctype && hasHtmlOpen && hasHtmlClose && hasBodyClose && hasHeadClose
  }

  private cleanHTML(html: string): string {
    // Remove any markdown code blocks
    let cleaned = html.replace(/```html\n?/g, '').replace(/```\n?/g, '')
    
    // Ensure proper HTML structure
    if (!cleaned.trim().startsWith('<!DOCTYPE')) {
      // Extract HTML content if it's wrapped in explanatory text
      const htmlMatch = cleaned.match(/<!DOCTYPE[\s\S]*<\/html>/i)
      if (htmlMatch) {
        cleaned = htmlMatch[0]
      }
    }
    
    return cleaned.trim()
  }

  private getFallbackHTML(request: WebsiteRequest): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${request.type.charAt(0).toUpperCase() + request.type.slice(1)} Website</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .card-hover:hover { transform: translateY(-5px); transition: transform 0.3s ease; }
    </style>
</head>
<body class="bg-gray-50">
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="text-xl font-bold text-gray-800">Your Website</div>
                <div class="hidden md:flex space-x-8">
                    <a href="#home" class="text-gray-600 hover:text-blue-600 transition">Home</a>
                    <a href="#about" class="text-gray-600 hover:text-blue-600 transition">About</a>
                    <a href="#services" class="text-gray-600 hover:text-blue-600 transition">Services</a>
                    <a href="#contact" class="text-gray-600 hover:text-blue-600 transition">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <section id="home" class="gradient-bg text-white py-20">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <h1 class="text-5xl font-bold mb-6">Welcome to Your ${request.type} Website</h1>
            <p class="text-xl mb-8 max-w-2xl mx-auto">${request.prompt}</p>
            <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Get Started
            </button>
        </div>
    </section>

    <section id="about" class="py-20">
        <div class="max-w-7xl mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">About Us</h2>
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 class="text-2xl font-semibold mb-4">Our Story</h3>
                    <p class="text-gray-600 mb-6">
                        We are dedicated to providing exceptional service and innovative solutions 
                        that meet your needs and exceed your expectations.
                    </p>
                    <ul class="text-gray-600 space-y-2">
                        <li>✓ Professional Excellence</li>
                        <li>✓ Customer Satisfaction</li>
                        <li>✓ Innovation & Quality</li>
                    </ul>
                </div>
                <div class="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <span class="text-gray-500">Image Placeholder</span>
                </div>
            </div>
        </div>
    </section>

    <section id="services" class="bg-gray-100 py-20">
        <div class="max-w-7xl mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-lg shadow-lg card-hover">
                    <div class="text-blue-600 text-3xl mb-4">🚀</div>
                    <h3 class="text-xl font-semibold mb-2">Fast & Reliable</h3>
                    <p class="text-gray-600">Quick turnaround times with reliable, high-quality results.</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg card-hover">
                    <div class="text-blue-600 text-3xl mb-4">🎨</div>
                    <h3 class="text-xl font-semibold mb-2">Creative Solutions</h3>
                    <p class="text-gray-600">Innovative approaches tailored to your specific needs.</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg card-hover">
                    <div class="text-blue-600 text-3xl mb-4">⭐</div>
                    <h3 class="text-xl font-semibold mb-2">Premium Quality</h3>
                    <p class="text-gray-600">Top-tier service with attention to every detail.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="contact" class="py-20">
        <div class="max-w-7xl mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Get In Touch</h2>
            <div class="max-w-md mx-auto">
                <form class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="mb-4">
                        <input type="text" placeholder="Your Name" 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                    </div>
                    <div class="mb-4">
                        <input type="email" placeholder="Your Email" 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                    </div>
                    <div class="mb-6">
                        <textarea placeholder="Your Message" rows="4" 
                                  class="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"></textarea>
                    </div>
                    <button type="submit" 
                            class="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </section>

    <footer class="bg-gray-800 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2024 Your Website. Built with AI Website Builder.</p>
        </div>
    </footer>

    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Form submission
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    </script>
</body>
</html>`
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new AIService()