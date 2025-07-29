export const createFallbackHTML = (prompt: string): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        nav { background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .nav-content { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; }
        .logo { font-size: 1.5rem; font-weight: bold; background: linear-gradient(45deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero { padding: 100px 0; text-align: center; color: white; }
        .hero h1 { font-size: 3.5rem; font-weight: bold; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .hero p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9; max-width: 600px; margin-left: auto; margin-right: auto; }
        .btn { background: linear-gradient(45deg, #ff6b6b, #ee5a24); color: white; padding: 15px 30px; border: none; border-radius: 50px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; text-decoration: none; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.3); }
        .features { background: white; padding: 80px 0; }
        .features h2 { text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #333; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .feature-card { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 2rem; border-radius: 20px; text-align: center; color: white; transform: translateY(0); transition: all 0.3s ease; }
        .feature-card:hover { transform: translateY(-10px); }
        .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
        @media (max-width: 768px) { .hero h1 { font-size: 2.5rem; } .hero p { font-size: 1rem; } }
    </style>
</head>
<body>
    <nav>
        <div class="container">
            <div class="nav-content">
                <div class="logo">Your Amazing Website</div>
            </div>
        </div>
    </nav>
    
    <section class="hero">
        <div class="container">
            <h1>Welcome to Your Website</h1>
            <p>${prompt}</p>
            <a href="#" class="btn">Get Started Today</a>
        </div>
    </section>
    
    <section class="features">
        <div class="container">
            <h2>Amazing Features</h2>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3>Lightning Fast</h3>
                    <p>Optimized for speed and performance</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3>Beautiful Design</h3>
                    <p>Stunning visuals that captivate users</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>Mobile Ready</h3>
                    <p>Perfect on all devices and screen sizes</p>
                </div>
            </div>
        </div>
    </section>
    
    <script>
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    </script>
</body>
</html>`
}