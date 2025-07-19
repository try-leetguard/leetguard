# LeetGuard Client

A modern web application for LeetGuard - your coding companion that rewards deep work and eliminates distractions. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Authentication**: Clean login and signup pages with smooth animations
- **Responsive Design**: Optimized for all device sizes
- **Dark/Light Mode**: Dynamic theme switching with system preference detection
- **Focus-Oriented UI**: Minimalist design that promotes concentration
- **Social Integration**: LinkedIn company page integration
- **Accessibility**: Built with accessibility best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Form Handling**: React hooks with controlled components

## 📁 Project Structure

```
leetguard-client/
├── extension/                 # Browser extension code
├── app/                      # Next.js app directory
│   ├── careers/              # Careers page
│   ├── login/                # Authentication pages
│   ├── signup/
│   ├── pricing/              # Marketing pages
│   ├── privacy/
│   ├── terms/
│   └── why-it-matters/
├── components/               # Reusable components
│   ├── ui/                  # Base UI components
│   ├── Features.tsx         # Features section
│   ├── Footer.tsx           # Footer with social links
│   ├── Hero.tsx             # Landing page hero
│   └── Navbar*.tsx          # Navigation components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── public/                  # Static assets
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd leetguard-client
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages & Components

### Authentication Pages

- **Login** (`/login`): Clean sign-in form with email/password
- **Signup** (`/signup`): Account creation with terms agreement

### Marketing Pages

- **Landing Page** (`/`): Hero section with focus messaging
- **Why It Matters** (`/why-it-matters`): Value proposition
- **Pricing** (`/pricing`): Pricing plans
- **Careers** (`/careers`): Job opportunities
- **Privacy** (`/privacy`): Privacy policy
- **Terms** (`/terms`): Terms of service

### Key Components

#### Hero Section

- Large, impactful headline with focus messaging
- Call-to-action buttons for getting started
- Responsive design with proper spacing

#### Footer

- Company branding with LeetGuard logo
- Product and support links
- LinkedIn integration with company page
- Clean, minimal design

#### Navigation

- Dark and light mode variants
- Responsive mobile navigation
- Smooth transitions and animations

## 🎨 Design System

### Colors

- **Primary**: Black (#000000)
- **Accent**: Orange (#FFA116) - LeetCode-inspired
- **Background**: White/Light gray
- **Text**: Black, gray-600, neutral-300

### Typography

- **Headings**: Large, bold fonts for impact
- **Body**: Clean, readable text
- **Buttons**: Medium weight with proper spacing

### Spacing

- Consistent spacing using Tailwind's spacing scale
- Proper padding and margins for readability
- Responsive spacing adjustments

## 🔧 Development

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component-based architecture

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow accessibility best practices
- Use Tailwind CSS for styling

### State Management

- React hooks for local state
- Controlled form components
- Proper form validation

## 🌐 Deployment

The application is built for deployment on Vercel or similar platforms:

```bash
npm run build
npm start
```

## 📄 License

This project is proprietary software for LeetGuard.

## 🤝 Contributing

1. Follow the existing code style
2. Add proper TypeScript types
3. Test on multiple devices
4. Ensure accessibility compliance

## 📞 Support

For support, visit our [LinkedIn page](https://www.linkedin.com/company/leetguard/) or contact the development team.

---

**LeetGuard** - Your coding companion that rewards deep work and eliminates distractions.
