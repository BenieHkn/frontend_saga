# SAGA
update 21/04/2026 08h24
A modern admin dashboard template inspired by DeskApp, built with Nuxt.js, NuxtUI, and Tailwind CSS.

## Features

- 🚀 **Modern Tech Stack**: Built with Nuxt.js 3, NuxtUI, and Tailwind CSS
- 📱 **Responsive Design**: Fully responsive layout that works on all devices
- 🎨 **Beautiful UI**: Clean and modern interface with smooth animations
- 📊 **Dashboard Components**: Pre-built components for stats, charts, and data visualization
- 🔔 **Real-time Notifications**: Built-in notification system
- 👥 **User Management**: Complete user management interface
- 📈 **Analytics**: Integrated charts and analytics components
- 🎯 **Quick Actions**: Quick action buttons for common tasks
- 🌙 **Dark Mode Ready**: Prepared for dark mode implementation
- 🔐 **Security**: Built with security best practices

## Tech Stack

- **Framework**: [Nuxt.js 3](https://nuxt.com/)
- **UI Library**: [NuxtUI](https://ui.nuxt.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Nuxt Icon](https://github.com/nuxt/icon)
- **Charts**: [Chart.js](https://www.chartjs.org/) with Vue Chart.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd saga_revolution_by_julio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
sagar_revolution_by_julio/
├── assets/
│   └── css/
│       └── main.css          # Custom CSS styles
├── components/
│   ├── ChartCard.vue         # Chart component
│   ├── Header.vue            # Header component
│   ├── QuickActions.vue      # Quick actions component
│   ├── RecentActivity.vue    # Recent activity feed
│   ├── Sidebar.vue           # Sidebar navigation
│   └── StatsCard.vue         # Statistics card component
├── layouts/
│   └── default.vue           # Default layout
├── pages/
│   └── index.vue             # Dashboard page
├── app.vue                   # Root component
├── nuxt.config.ts            # Nuxt configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Components

### StatsCard
Display key metrics with trend indicators.

```vue
<StatsCard
  title="Total Revenue"
  value="$45,231"
  change="+12.5%"
  changeType="increase"
  icon="currency-dollar"
  color="blue"
/>
```

### ChartCard
Responsive chart component with multiple chart types.

```vue
<ChartCard
  title="Revenue Overview"
  type="line"
/>
```

### QuickActions
Quick action buttons for common tasks.

### RecentActivity
Activity feed showing recent system events.

## Customization

### Colors
The template uses Tailwind CSS color palette. You can customize colors by modifying the `tailwind.config.js` file.

### Icons
Icons are provided by Nuxt Icon with Heroicons and Simple Icons packs. You can add more icon packs in the `nuxt.config.ts` file.

### Layout
The layout consists of:
- Fixed header with search, notifications, and user menu
- Collapsible sidebar with navigation
- Main content area

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Inspiration

This template is inspired by the [DeskApp Bootstrap Admin Dashboard](https://github.com/dropways/deskapp) template, recreated with modern web technologies.

## Support

If you have any questions or need support, please open an issue on GitHub.
