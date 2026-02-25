// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: ['~/plugins/onesignal.client.js'],
  devtools: { enabled: true },
  colorMode: {
    preference: 'light' // Par défaut en light mode comme la maquette
  },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://192.168.40.3:8000/api',
      baseUrl: process.env.BASE_URL || 'http://192.168.40.3:8000'
    }
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
              500: '#10b981', // emerald-500
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
              500: '#2563eb', // blue-600
              600: '#1d4ed8',
              700: '#1e40af',
              800: '#1e3a8a',
              900: '#1e3a8a',
            }
          },
          fontFamily: {
            sans: ['Inter var', 'system-ui', 'sans-serif'],
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


  ui: {
    global: true,
    icons: ['heroicons', 'simple-icons']
  },
  app: {
    head: {
      title: 'SAGA Revolution',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'A modern admin dashboard template inspired by DeskApp' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})