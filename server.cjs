const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Serve the working app
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    // Serve React app
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        // Inject the React app into the HTML
        const reactApp = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TrueWaveites - Working Version</title>
            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              const { useState, useEffect } = React;
              
              const WorkingApp = () => {
                const [isDarkMode, setIsDarkMode] = useState(false);

                useEffect(() => {
                  try {
                    const savedTheme = localStorage.getItem('theme');
                    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                      setIsDarkMode(true);
                    }
                  } catch (error) {
                    console.error('Theme error:', error);
                  }
                }, []);

                useEffect(() => {
                  try {
                    if (isDarkMode) {
                      document.documentElement.classList.add('dark');
                      document.body.style.backgroundColor = '#1f2937';
                    } else {
                      document.documentElement.classList.remove('dark');
                      document.body.style.backgroundColor = '#f3f4f6';
                    }
                  } catch (error) {
                    console.error('Theme application error:', error);
                  }
                }, [isDarkMode]);

                return React.createElement('div', {
                  style: { 
                    minHeight: '100vh',
                    backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
                    color: 'white',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    transition: 'background-color 0.3s ease',
                    padding: '40px 20px'
                  }
                }, [
                  React.createElement('header', {
                    style: {
                      padding: '20px',
                      backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }
                  }, [
                    React.createElement('div', {
                      style: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
                    }, [
                      React.createElement('h1', {
                        style: { 
                          fontSize: '2rem', 
                          fontWeight: 'bold',
                          color: isDarkMode ? '#ffffff' : '#1f2937',
                          margin: 0 
                        }
                      }, 'True', React.createElement('span', { style: { color: '#3b82f6' } }, 'Wave'), 'ites')
                    ]),
                    React.createElement('button', {
                      onClick: () => setIsDarkMode(!isDarkMode),
                      style: {
                        padding: '8px 16px',
                        backgroundColor: isDarkMode ? '#ffffff' : '#1f2937',
                        color: isDarkMode ? '#1f2937' : '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }
                    }, isDarkMode ? '☀️ Light' : '🌙 Dark')
                  ])
                ]),
                  React.createElement('main', {}, [
                    React.createElement('div', {
                      style: { maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '40px 20px' }
                    }, [
                      React.createElement('h2', { 
                        style: { 
                          fontSize: '3rem', 
                          fontWeight: 'bold', 
                          marginBottom: '20px',
                          color: isDarkMode ? '#ffffff' : '#1f2937'
                        }
                      }, 'We Slice Through The Clutter'),
                      React.createElement('p', { 
                        style: { 
                          fontSize: '1.25rem', 
                          marginBottom: '40px',
                          lineHeight: '1.6',
                          color: isDarkMode ? '#e5e7eb' : '#4b5563'
                        }
                      }, 'Your trusted B2B demand generation partner since 2012. We prioritize what truly counts - Outcomes!'),
                      React.createElement('div', {
                        style: { 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '20px',
                          marginBottom: '40px'
                        }
                      }, [
                        // Stats boxes...
                        React.createElement('div', {
                          style: { padding: '30px', backgroundColor: isDarkMode ? '#374151' : '#ffffff', borderRadius: '12px', textAlign: 'center' }
                        }, [
                          React.createElement('div', { style: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' } }, '2012'),
                          React.createElement('div', { style: { fontSize: '1.1rem', color: isDarkMode ? '#d1d5db' : '#6b7280' } }, 'Founded')
                        ]),
                        React.createElement('div', {
                          style: { padding: '30px', backgroundColor: isDarkMode ? '#374151' : '#ffffff', borderRadius: '12px', textAlign: 'center' }
                        }, [
                          React.createElement('div', { style: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' } }, '500+'),
                          React.createElement('div', { style: { fontSize: '1.1rem', color: isDarkMode ? '#d1d5db' : '#6b7280' } }, 'Leads Generated')
                        ]),
                        React.createElement('div', {
                          style: { padding: '30px', backgroundColor: isDarkMode ? '#374151' : '#ffffff', borderRadius: '12px', textAlign: 'center' }
                        }, [
                          React.createElement('div', { style: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' } }, '500+'),
                          React.createElement('div', { style: { fontSize: '1.1rem', color: isDarkMode ? '#d1d5db' : '#6b7280' } }, 'Happy Clients')
                        ]),
                        React.createElement('div', {
                          style: { padding: '30px', backgroundColor: isDarkMode ? '#374151' : '#ffffff', borderRadius: '12px', textAlign: 'center' }
                        }, [
                          React.createElement('div', { style: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' } }, '99%'),
                          React.createElement('div', { style: { fontSize: '1.1rem', color: isDarkMode ? '#d1d5db' : '#6b7280' } }, 'Satisfaction')
                        ])
                      ])
                    ])
                  ])
                ]);
              };

              ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(WorkingApp));
            </script>
          </body>
          </html>
        `;
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(reactApp);
      }
    });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`TrueWaveites working server running at http://localhost:${PORT}`);
  console.log('Open http://localhost:3000 to see the working website!');
});
