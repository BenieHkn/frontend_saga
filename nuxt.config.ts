export default defineNuxtConfig({
  devtools: { enabled: true },

  colorMode: {
    preference: 'light'
  },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css', '~/assets/css/smq.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8000/api',
      baseUrl: process.env.BASE_URL || 'http://localhost:8000'
    }
  },

  icon: {
    collections: ['heroicons', 'simple-icons']
  },

  ui: {
    global: true,
  },

  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#f0fdf4',
              100: '#dcfce7',
              200: '#bbf7d0',
              300: '#86efac',
              400: '#4ade80',
              500: '#10b981',
              600: '#059669',
              700: '#047857',
              800: '#065f46',
              900: '#064e3b',
            },
            secondary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#2563eb',
              600: '#1d4ed8',
              700: '#1e40af',
              800: '#1e3a8a',
              900: '#1e3a8a',
            }
          },
          fontFamily: {
            sans: ['Montserrat', 'system-ui', 'sans-serif'], // ← modifié
          },
          animation: {
            'slide-in-up': 'slideInUp 0.4s ease-out',
            'fade-in': 'fadeIn 0.3s ease-out',
            'scale-in': 'scaleIn 0.3s ease-out',
            'shimmer': 'shimmer 2s infinite linear',
          },
          keyframes: {
            slideInUp: {
              '0%': { opacity: '0', transform: 'translateY(20px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' },
            },
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
            },
            scaleIn: {
              '0%': { opacity: '0', transform: 'scale(0.95)' },
              '100%': { opacity: '1', transform: 'scale(1)' },
            },
            shimmer: {
              '0%': { backgroundPosition: '-1000px 0' },
              '100%': { backgroundPosition: '1000px 0' },
            },
          },
        },
      },
    },
  },

  vite: {
    server: {
      hmr: {
        timeout: 120000,
      },
    },
    optimizeDeps: {
      include: ['vue', 'vue-router'],
    },
  },

  app: {
    head: {
      title: 'SAGA',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          key: 'description',
          name: 'description',
          content: 'A modern admin dashboard template inspired by DeskApp'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // ↓ Import Google Fonts Montserrat
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap'
        }
      ]
    }
  }
})