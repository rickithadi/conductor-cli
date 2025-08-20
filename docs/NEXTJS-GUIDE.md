# 🚀 Next.js Optimization Guide

> **Complete guide to using Conductor CLI with Next.js applications for pixel-perfect, SEO-optimized results**

## 🎯 Next.js Specialization

Conductor CLI includes specialized agents and optimization patterns specifically designed for Next.js 14+ applications, focusing on:

- **App Router Architecture** - Server Components, streaming, and suspense
- **SEO Excellence** - Metadata API, Open Graph, structured data
- **Performance Optimization** - Core Web Vitals, bundle optimization
- **TypeScript Integration** - Full type safety with modern patterns

## 🚀 Quick Start for Next.js

```bash
# Create new Next.js project with Conductor
npx create-next-app@latest my-app --typescript --tailwind --eslint --app
cd my-app

# Initialize Conductor orchestration
conductor init

# Get Next.js-specific recommendations
conductor recommend "Optimize SEO and Core Web Vitals for production"
```

## 🎭 Next.js Specialized Agents

When you run `conductor init` in a Next.js project, you get these specialized agents:

### 🎨 @nextjs-frontend
```markdown
**Expertise**: Next.js App Router, Server Components, Client Components, Streaming
**Focus Areas**:
- App Router patterns and best practices
- Server Component optimization
- Client-Server boundary optimization
- Streaming and Suspense patterns
- Route handlers and middleware
```

### 📊 @seo-specialist  
```markdown
**Expertise**: Next.js Metadata API, Schema.org, Core Web Vitals
**Focus Areas**:
- Metadata API implementation
- Open Graph optimization
- Structured data (JSON-LD)
- Core Web Vitals optimization
- Image optimization strategies
```

### ⚡ @performance-optimizer
```markdown
**Expertise**: Bundle optimization, loading strategies, caching
**Focus Areas**:
- Bundle analysis and optimization
- Dynamic imports and code splitting
- Image optimization (next/image)
- Font optimization (next/font)
- Caching strategies (ISR, SSG, SSR)
```

### 🔒 @nextjs-security
```markdown
**Expertise**: Next.js security patterns, CSP, authentication
**Focus Areas**:
- Content Security Policy setup
- Next-Auth.js integration
- API route security
- Environment variable security
- CSRF protection
```

## 🛠️ Common Next.js Workflows

### 1. SEO Optimization

```bash
conductor recommend "Implement comprehensive SEO strategy with metadata API"
```

**Example Output:**
```
🎭 CONDUCTOR ORCHESTRATION

📋 Proposal: Implement comprehensive SEO strategy
🎯 Type: optimization
⚡ Priority: HIGH

🎨 @nextjs-frontend:
💡 Use App Router Metadata API for dynamic meta tags
📈 Impacts: SEO rankings, social sharing, user engagement
🔗 Dependencies: Update to latest Next.js, implement metadata functions
⚠️ Risks: Migration complexity from pages to app directory

📊 @seo-specialist:
💡 Implement structured data with JSON-LD for rich snippets
📈 Impacts: Search visibility, click-through rates, local SEO
🔗 Dependencies: Schema.org markup, Google Search Console setup
⚠️ Risks: Invalid markup penalties, maintenance overhead

⚡ @performance-optimizer:
💡 Optimize Core Web Vitals with next/image and next/font
📈 Impacts: Page speed, user experience, SEO rankings
🔗 Dependencies: Image optimization, font preloading
⚠️ Risks: Layout shifts, loading delays
```

### 2. Performance Optimization

```bash
conductor recommend "Optimize Core Web Vitals and bundle size"
```

### 3. Security Hardening

```bash
conductor recommend "Implement security best practices for production"
```

## 📁 Next.js Project Structure

Conductor CLI creates an optimized structure for Next.js projects:

```
my-nextjs-app/
├── app/
│   ├── (dashboard)/
│   │   └── page.tsx
│   ├── api/
│   │   └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── sitemap.ts
├── components/
│   ├── ui/
│   └── forms/
├── lib/
│   ├── utils.ts
│   └── validations.ts
├── claude.md           # Conductor context
├── .conductor/         # Conductor configuration
└── conductor.config.js # Project-specific settings
```

## 🔧 Configuration

### conductor.config.js for Next.js

```javascript
/** @type {import('conductor-cli').ConductorConfig} */
module.exports = {
  framework: 'nextjs',
  version: '14',
  features: {
    appRouter: true,
    typescript: true,
    tailwind: true,
    seo: {
      enabled: true,
      sitemap: true,
      robotsTxt: true,
      structuredData: true
    },
    performance: {
      bundleAnalyzer: true,
      imageOptimization: true,
      fontOptimization: true
    }
  },
  agents: {
    '@nextjs-frontend': { priority: 'high' },
    '@seo-specialist': { priority: 'high' },
    '@performance-optimizer': { priority: 'high' },
    '@typescript': { priority: 'medium' },
    '@security': { priority: 'high' }
  }
}
```

## 📈 SEO Features

### Metadata API Integration

```typescript
// app/layout.tsx - Generated by @seo-specialist
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Your App Name',
    default: 'Your App Name - Description'
  },
  description: 'Your app description optimized for search',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Organization',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    title: 'Your App Name',
    description: 'Your app description',
    siteName: 'Your App Name',
    images: [{
      url: 'https://yoursite.com/og-image.png',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your App Name',
    description: 'Your app description',
    images: ['https://yoursite.com/twitter-image.png'],
  },
}
```

### Structured Data

```typescript
// app/page.tsx - JSON-LD structured data
export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Your App Name",
    "description": "Your app description",
    "url": "https://yoursite.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Your page content */}
    </>
  )
}
```

## ⚡ Performance Optimizations

### Image Optimization

```typescript
// Recommended by @performance-optimizer
import Image from 'next/image'

export function OptimizedImage() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Hero description"
      width={1200}
      height={600}
      priority
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

### Font Optimization

```typescript
// app/layout.tsx - Font optimization
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

## 🔒 Security Features

### Content Security Policy

```javascript
// next.config.js - CSP headers
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self';
            `.replace(/\s+/g, ' ').trim()
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## 📊 Analytics & Monitoring

### Recommended Analytics Setup

```typescript
// lib/analytics.ts - Generated by @seo-specialist
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

export function Analytics() {
  return (
    <>
      <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
      <GoogleTagManager gtmId="GTM_ID" />
    </>
  )
}
```

## 🚀 Deployment Optimization

### Production Checklist

Generated by `conductor recommend "Prepare for production deployment"`:

- [ ] ✅ Metadata API implemented
- [ ] ✅ Structured data added
- [ ] ✅ Images optimized with next/image
- [ ] ✅ Fonts optimized with next/font
- [ ] ✅ Bundle analyzer run
- [ ] ✅ Core Web Vitals tested
- [ ] ✅ Security headers configured
- [ ] ✅ Environment variables secured
- [ ] ✅ Sitemap generated
- [ ] ✅ robots.txt configured
- [ ] ✅ Analytics integrated

## 🎯 Advanced Patterns

### Server Actions

```typescript
// app/actions.ts - Server Actions pattern
'use server'

import { revalidateTag } from 'next/cache'

export async function updateProfile(formData: FormData) {
  // Server-side logic
  revalidateTag('profile')
}
```

### Route Handlers

```typescript
// app/api/users/route.ts - API Routes pattern
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ users: [] })
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  return NextResponse.json({ success: true })
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Hydration Errors**
   ```bash
   conductor recommend "Fix hydration mismatch in React components"
   ```

2. **Bundle Size Issues**
   ```bash
   conductor recommend "Optimize bundle size and reduce JavaScript payload"
   ```

3. **SEO Problems**
   ```bash
   conductor recommend "Audit and fix SEO issues for better rankings"
   ```

---

**Built with pixel-perfect precision by [Gallifrey Consulting](https://gallifrey.consulting)**  
**Core Developer**: [Hadi Rickit](https://rickithadi.dev)