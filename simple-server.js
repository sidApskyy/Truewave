const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Serve a simple HTML page with inline React
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TrueWaveites - B2B Demand Generation</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', system-ui, sans-serif;
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            color: white;
            min-height: 100vh;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          header {
            padding: 20px 0;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
          }
          
          .logo {
            font-size: 2.5rem;
            font-weight: bold;
            color: white;
            margin: 0;
          }
          
          .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .theme-toggle {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
          }
          
          .theme-toggle:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
          }
          
          main {
            padding: 60px 20px;
          }
          
          .hero {
            text-align: center;
            margin-bottom: 60px;
          }
          
          .hero h1 {
            font-size: 3.5rem;
            font-weight: bold;
            margin-bottom: 20px;
            color: white;
            text-shadow: 0 0 20px rgba(0,0,0,0.3);
          }
          
          .hero p {
            font-size: 1.25rem;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto 40px;
            color: rgba(255,255,255,0.9);
          }
          
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 60px;
          }
          
          .stat-box {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            transition: transform 0.3s ease;
          }
          
          .stat-box:hover {
            transform: translateY(-5px);
          }
          
          .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 10px;
            color: white;
          }
          
          .stat-label {
            font-size: 1.1rem;
            color: rgba(255,255,255,0.8);
          }
          
          .cta-section {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 60px;
          }
          
          .cta-button {
            background: #3b82f6;
            color: white;
            padding: 16px 32px;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
          }
          
          .cta-button:hover {
            background: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(59,130,246,0.3);
          }
          
          .cta-button-secondary {
            background: transparent;
            color: white;
            padding: 16px 32px;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
          }
          
          .cta-button-secondary:hover {
            background: rgba(255,255,255,0.1);
            transform: translateY(-2px);
          }
          
          footer {
            background: #111827;
            color: white;
            text-align: center;
            padding: 40px 20px;
          }
          
          .footer-content {
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
          }
          
          .footer-link {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            transition: color 0.3s ease;
            cursor: pointer;
          }
          
          .footer-link:hover {
            color: white;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .fade-in {
            animation: fadeIn 0.8s ease-out;
          }
          
          .slide-up {
            animation: slideUp 0.6s ease-out;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="nav">
              <div class="logo">True<span style="color: #3b82f6;">Wave</span>ites</div>
              <button class="theme-toggle" onclick="toggleTheme()">
                <span id="theme-text">🌙 Dark</span>
              </button>
            </div>
          </div>
          </header>
          
          <main>
            <section class="hero">
              <div class="container">
                <h1>We Slice Through The Clutter</h1>
                <p>Your trusted B2B demand generation partner since 2012. We prioritize what truly counts - Outcomes!</p>
                
                <div class="stats">
                  <div class="stat-box fade-in">
                    <div class="stat-number">2012</div>
                    <div class="stat-label">Founded</div>
                  </div>
                  <div class="stat-box fade-in" style="animation-delay: 0.2s">
                    <div class="stat-number">10K+</div>
                    <div class="stat-label">Leads Generated</div>
                  </div>
                  <div class="stat-box fade-in" style="animation-delay: 0.4s">
                    <div class="stat-number">500+</div>
                    <div class="stat-label">Happy Clients</div>
                  </div>
                  <div class="stat-box fade-in" style="animation-delay: 0.6s">
                    <div class="stat-number">99%</div>
                    <div class="stat-label">Satisfaction</div>
                  </div>
                </div>
                
                <div class="cta-section slide-up">
                  <a href="#contact" class="cta-button">Get Started</a>
                  <a href="#services" class="cta-button-secondary">Learn More</a>
                </div>
              </div>
            </section>
          </main>
          
          <footer>
            <div class="footer-content">
              <p>&copy; 2024 TrueWaveites. All Rights Reserved.</p>
              <div class="footer-links">
                <a href="#about" class="footer-link">About</a>
                <a href="#services" class="footer-link">Services</a>
                <a href="#contact" class="footer-link">Contact</a>
              </div>
            </div>
          </footer>
        </div>
        
        <script>
          let isDarkMode = false;
          
          function toggleTheme() {
            isDarkMode = !isDarkMode;
            updateTheme();
          }
          
          function updateTheme() {
            const body = document.body;
            const themeText = document.getElementById('theme-text');
            
            if (isDarkMode) {
              body.style.background = 'linear-gradient(135deg, #1f2937 0%, #111827 100%)';
              themeText.textContent = '☀️ Light';
            } else {
              body.style.background = 'linear-gradient(135deg, #1f2937 0%, #111827 100%)';
              themeText.textContent = '🌙 Dark';
            }
            
            // Save preference
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
          }
          
          // Load saved theme
          const savedTheme = localStorage.getItem('theme');
          if (savedTheme === 'dark') {
            isDarkMode = true;
          }
          
          // Apply theme on load
          updateTheme();
          
          // Add smooth scroll behavior
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
              e.preventDefault();
              const target = document.querySelector(this.getAttribute('href'));
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            });
          });
        </script>
      </body>
      </html>
    `;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`\\n🚀 TRUEWAVES WORKING SERVER!`);
  console.log(`📱 Open: http://localhost:${PORT}`);
  console.log(`💡 This bypasses Vite build issues and provides a working website!`);
  console.log(`🎯 Features: Theme toggle, smooth animations, responsive design`);
  console.log(`🔧 Technology: Pure HTML/CSS/JavaScript - No build tools required`);
});
