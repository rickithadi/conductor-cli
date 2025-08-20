# 🌟 Jekyll & SEO Optimization Guide

> **Complete guide to using Conductor CLI with Jekyll sites for maximum SEO performance and GitHub Pages optimization**

## 🎯 Jekyll Specialization

Conductor CLI includes specialized agents and optimization patterns specifically designed for Jekyll sites, focusing on:

- **SEO Excellence** - Schema.org markup, meta optimization, structured data
- **Performance** - Asset optimization, critical CSS, lazy loading
- **Content Strategy** - Markdown optimization, frontmatter validation
- **GitHub Pages** - Deployment optimization, custom domains

## 🚀 Quick Start for Jekyll

```bash
# Create new Jekyll site with Conductor
gem install jekyll bundler
jekyll new my-jekyll-site
cd my-jekyll-site

# Initialize Conductor orchestration
conductor init

# Get Jekyll-specific SEO recommendations
conductor recommend "Optimize Jekyll site for SEO and performance"
```

## 🎭 Jekyll Specialized Agents

When you run `conductor init` in a Jekyll project, you get these specialized agents:

### 🌐 @jekyll-seo
```markdown
**Expertise**: Jekyll SEO plugins, Schema.org markup, meta optimization
**Focus Areas**:
- Jekyll SEO tag implementation
- Schema.org structured data
- Open Graph and Twitter Cards
- Sitemap optimization
- Meta tag strategies
```

### 📝 @content-strategist
```markdown
**Expertise**: Markdown optimization, content structure, frontmatter
**Focus Areas**:
- Content hierarchy and structure
- Frontmatter best practices
- Internal linking strategies
- Category and tag optimization
- Content performance analysis
```

### ⚡ @jekyll-performance
```markdown
**Expertise**: Asset optimization, loading strategies, GitHub Pages limits
**Focus Areas**:
- Image optimization and compression
- CSS and JavaScript minification
- Critical path CSS
- Liquid template optimization
- GitHub Pages performance limits
```

### 🎨 @liquid-template-specialist
```markdown
**Expertise**: Liquid templating, component patterns, reusability
**Focus Areas**:
- Liquid template optimization
- Component-based architecture
- Include and layout patterns
- Data file utilization
- Template performance
```

## 🛠️ Common Jekyll Workflows

### 1. Complete SEO Optimization

```bash
conductor recommend "Implement comprehensive SEO strategy for Jekyll"
```

**Example Output:**
```
🎭 CONDUCTOR ORCHESTRATION

📋 Proposal: Implement comprehensive SEO for Jekyll
🎯 Type: seo-optimization
⚡ Priority: HIGH

🌐 @jekyll-seo:
💡 Install and configure jekyll-seo-tag with custom templates
📈 Impacts: Search rankings, social sharing, rich snippets
🔗 Dependencies: jekyll-seo-tag gem, custom meta templates
⚠️ Risks: Plugin conflicts, GitHub Pages compatibility

📝 @content-strategist:
💡 Optimize frontmatter schema and content structure
📈 Impacts: Content discoverability, user engagement, SEO
🔗 Dependencies: Standardized frontmatter, content audit
⚠️ Risks: Content migration effort, consistency challenges

⚡ @jekyll-performance:
💡 Implement critical CSS and asset optimization
📈 Impacts: Page speed, Core Web Vitals, user experience
🔗 Dependencies: Asset pipeline, CSS extraction tools
⚠️ Risks: Build complexity, maintenance overhead
```

### 2. GitHub Pages Optimization

```bash
conductor recommend "Optimize for GitHub Pages deployment and performance"
```

### 3. Content Structure Enhancement

```bash
conductor recommend "Improve content architecture and internal linking"
```

## 📁 Jekyll Project Structure

Conductor CLI creates an optimized structure for Jekyll projects:

```
my-jekyll-site/
├── _data/
│   ├── seo.yml
│   ├── navigation.yml
│   └── schema.yml
├── _includes/
│   ├── head.html
│   ├── seo.html
│   ├── schema.html
│   └── analytics.html
├── _layouts/
│   ├── default.html
│   ├── post.html
│   ├── page.html
│   └── product.html
├── _posts/
│   └── 2025-01-01-example-post.md
├── _sass/
│   ├── critical.scss
│   └── main.scss
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── _config.yml
├── claude.md              # Conductor context
├── .conductor/            # Conductor configuration
└── conductor.config.js    # Jekyll-specific settings
```

## 🔧 Configuration

### _config.yml - SEO Optimized

```yaml
# Site settings - Optimized by @jekyll-seo
title: Your Jekyll Site
description: >- 
  Your site description optimized for search engines.
  Keep it under 160 characters for best results.
baseurl: ""
url: "https://yourusername.github.io"
twitter_username: yourusername
github_username: yourusername

# Author information
author:
  name: Your Name
  email: your.email@example.com
  twitter: yourusername
  linkedin: yourprofile

# SEO settings
lang: en_US
timezone: America/New_York

# Social media
social:
  name: Your Name
  links:
    - https://twitter.com/yourusername
    - https://github.com/yourusername
    - https://linkedin.com/in/yourprofile

# Google Analytics
google_analytics: G-XXXXXXXXXX

# Build settings
markdown: kramdown
highlighter: rouge
permalink: /:categories/:title/

# Plugins
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag
  - jekyll-paginate-v2
  - jekyll-compress-images

# Exclude files
exclude:
  - Gemfile
  - Gemfile.lock
  - node_modules
  - vendor/
  - .sass-cache/
  - .jekyll-cache/
  - gemfiles/
  - conductor.config.js
  - .conductor/

# Compression
compress_html:
  clippings: all
  comments: all
  blanklines: false
  ignore:
    envs: development
```

### conductor.config.js for Jekyll

```javascript
/** @type {import('conductor-cli').ConductorConfig} */
module.exports = {
  framework: 'jekyll',
  platform: 'github-pages',
  features: {
    seo: {
      enabled: true,
      structured_data: true,
      social_meta: true,
      sitemap: true,
      robots: true
    },
    performance: {
      image_optimization: true,
      css_minification: true,
      js_minification: true,
      critical_css: true
    },
    content: {
      frontmatter_validation: true,
      internal_linking: true,
      content_analysis: true
    }
  },
  agents: {
    '@jekyll-seo': { priority: 'high' },
    '@content-strategist': { priority: 'high' },
    '@jekyll-performance': { priority: 'medium' },
    '@liquid-template-specialist': { priority: 'medium' }
  }
}
```

## 📈 SEO Implementation

### Enhanced Head Template

```html
<!-- _includes/head.html - Generated by @jekyll-seo -->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- SEO Meta Tags -->
  {% seo %}
  
  <!-- Custom Meta Tags -->
  {% if page.image %}
    <meta property="og:image" content="{{ page.image | absolute_url }}">
    <meta name="twitter:image" content="{{ page.image | absolute_url }}">
  {% else %}
    <meta property="og:image" content="{{ '/assets/images/og-default.png' | absolute_url }}">
    <meta name="twitter:image" content="{{ '/assets/images/twitter-default.png' | absolute_url }}">
  {% endif %}
  
  <!-- Structured Data -->
  {% include schema.html %}
  
  <!-- Critical CSS -->
  <style>
    {% include critical.css %}
  </style>
  
  <!-- Preload fonts -->
  <link rel="preload" href="{{ '/assets/fonts/inter.woff2' | relative_url }}" as="font" type="font/woff2" crossorigin>
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="{{ '/favicon.ico' | relative_url }}">
  <link rel="apple-touch-icon" sizes="180x180" href="{{ '/apple-touch-icon.png' | relative_url }}">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="{{ page.url | replace:'index.html','' | absolute_url }}">
  
  <!-- CSS -->
  <link rel="stylesheet" href="{{ '/assets/css/style.css' | relative_url }}">
  
  <!-- Analytics -->
  {% if jekyll.environment == 'production' %}
    {% include analytics.html %}
  {% endif %}
</head>
```

### Structured Data Template

```html
<!-- _includes/schema.html - Schema.org markup -->
{% if page.layout == 'post' %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{ page.title | escape }}",
  "description": "{{ page.excerpt | strip_html | truncate: 160 | escape }}",
  "image": "{{ page.image | default: '/assets/images/og-default.png' | absolute_url }}",
  "author": {
    "@type": "Person",
    "name": "{{ site.author.name | escape }}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{{ site.title | escape }}",
    "logo": {
      "@type": "ImageObject",
      "url": "{{ '/assets/images/logo.png' | absolute_url }}"
    }
  },
  "datePublished": "{{ page.date | date_to_xmlschema }}",
  "dateModified": "{{ page.last_modified_at | default: page.date | date_to_xmlschema }}",
  "mainEntityOfPage": "{{ page.url | absolute_url }}"
}
</script>
{% elsif page.layout == 'page' %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{{ page.title | escape }}",
  "description": "{{ page.description | default: site.description | escape }}",
  "url": "{{ page.url | absolute_url }}",
  "isPartOf": {
    "@type": "WebSite",
    "name": "{{ site.title | escape }}",
    "url": "{{ site.url }}"
  }
}
</script>
{% else %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "{{ site.title | escape }}",
  "description": "{{ site.description | escape }}",
  "url": "{{ site.url }}",
  "author": {
    "@type": "Person",
    "name": "{{ site.author.name | escape }}"
  }
}
</script>
{% endif %}
```

### Optimized Post Frontmatter

```yaml
---
layout: post
title: "Your SEO-Optimized Blog Post Title"
description: "A compelling meta description under 160 characters that includes your target keyword."
date: 2025-01-01 12:00:00 +0000
categories: [web-development, seo]
tags: [jekyll, seo, performance, github-pages]
image: /assets/images/posts/your-post-image.jpg
image_alt: "Descriptive alt text for your featured image"
author: Your Name
canonical_url: https://yoursite.com/your-post-url
redirect_from:
  - /old-url/
  - /another-old-url/
sitemap:
  priority: 0.8
  changefreq: monthly
seo:
  type: BlogPosting
  name: "Your SEO-Optimized Blog Post Title"
  headline: "Your SEO-Optimized Blog Post Title"
  author: "Your Name"
  image: /assets/images/posts/your-post-image.jpg
---
```

## ⚡ Performance Optimization

### Image Optimization

```liquid
<!-- Optimized image includes -->
{% comment %} _includes/optimized-image.html {% endcomment %}
{% assign image_path = include.src %}
{% assign image_alt = include.alt | default: "Image" %}
{% assign image_class = include.class | default: "img-fluid" %}

<picture class="{{ image_class }}">
  <source 
    srcset="{{ image_path | replace: '.jpg', '.webp' | relative_url }}"
    type="image/webp"
  >
  <img 
    src="{{ image_path | relative_url }}"
    alt="{{ image_alt }}"
    loading="lazy"
    decoding="async"
  >
</picture>
```

### Critical CSS

```scss
/* assets/css/critical.scss - Above-the-fold CSS */
/* Generated by @jekyll-performance */

/* Reset and typography */
* { box-sizing: border-box; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Header and navigation */
.site-header { 
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.site-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

/* Hero section - above the fold */
.hero {
  padding: 4rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}
```

## 🔍 Content Optimization

### Internal Linking Strategy

```liquid
<!-- _includes/related-posts.html -->
{% assign related_posts = site.related_posts | limit: 3 %}
{% if related_posts.size > 0 %}
<section class="related-posts">
  <h3>Related Articles</h3>
  {% for post in related_posts %}
  <article class="related-post">
    <h4><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h4>
    <p>{{ post.excerpt | strip_html | truncate: 100 }}</p>
  </article>
  {% endfor %}
</section>
{% endif %}
```

### Content Analysis

```liquid
<!-- _includes/content-analysis.html -->
{% assign word_count = content | number_of_words %}
{% assign reading_time = word_count | divided_by: 200 | plus: 1 %}
{% assign headings = content | split: '<h' | size | minus: 1 %}

<div class="content-meta">
  <span>{{ word_count }} words</span>
  <span>{{ reading_time }} min read</span>
  <span>{{ headings }} headings</span>
</div>
```

## 📊 Analytics & SEO Monitoring

### Enhanced Analytics

```html
<!-- _includes/analytics.html -->
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id={{ site.google_analytics }}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '{{ site.google_analytics }}', {
    page_title: '{{ page.title | default: site.title }}',
    page_location: '{{ page.url | absolute_url }}',
    content_group1: '{{ page.categories | first | default: "uncategorized" }}',
    custom_map: {
      'dimension1': 'author',
      'dimension2': 'category'
    }
  });
</script>

<!-- Schema.org for Google -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "{{ site.url }}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "{{ site.url }}/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

## 🚀 GitHub Pages Deployment

### Optimized Workflow

```yaml
# .github/workflows/jekyll-deploy.yml
name: Deploy Jekyll site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
          bundler-cache: true

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v3

      - name: Build with Jekyll
        run: bundle exec jekyll build --baseurl "${{ steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

## 🔧 Advanced SEO Features

### XML Sitemap Customization

```xml
<!-- sitemap.xml -->
---
layout: null
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {% for page in site.pages %}
    {% unless page.sitemap.exclude == "yes" %}
    <url>
      <loc>{{ page.url | absolute_url }}</loc>
      {% if page.sitemap.lastmod %}
        <lastmod>{{ page.sitemap.lastmod | date: "%Y-%m-%d" }}</lastmod>
      {% elsif page.date %}
        <lastmod>{{ page.date | date: "%Y-%m-%d" }}</lastmod>
      {% endif %}
      {% if page.sitemap.changefreq %}
        <changefreq>{{ page.sitemap.changefreq }}</changefreq>
      {% endif %}
      {% if page.sitemap.priority %}
        <priority>{{ page.sitemap.priority }}</priority>
      {% endif %}
    </url>
    {% endunless %}
  {% endfor %}
  
  {% for post in site.posts %}
    <url>
      <loc>{{ post.url | absolute_url }}</loc>
      <lastmod>{{ post.date | date: "%Y-%m-%d" }}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  {% endfor %}
</urlset>
```

### Robots.txt Optimization

```
# robots.txt
User-agent: *
Allow: /

# Sitemaps
Sitemap: {{ site.url }}/sitemap.xml
Sitemap: {{ site.url }}/feed.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /_*

# Allow important files
Allow: /assets/
Allow: /.well-known/
```

## 🎯 SEO Checklist

Generated by `conductor recommend "Create comprehensive SEO audit checklist"`:

### Technical SEO
- [ ] ✅ Jekyll SEO tag installed and configured
- [ ] ✅ Schema.org structured data implemented
- [ ] ✅ XML sitemap generated and submitted
- [ ] ✅ Robots.txt optimized
- [ ] ✅ Canonical URLs implemented
- [ ] ✅ Page speed optimized (90+ score)
- [ ] ✅ Mobile-friendly responsive design
- [ ] ✅ HTTPS enabled

### Content SEO
- [ ] ✅ Title tags optimized (50-60 characters)
- [ ] ✅ Meta descriptions written (150-160 characters)
- [ ] ✅ Headers structured (H1, H2, H3)
- [ ] ✅ Internal linking strategy implemented
- [ ] ✅ Image alt texts optimized
- [ ] ✅ Content length appropriate (300+ words)
- [ ] ✅ Keyword density optimized (1-2%)

### Performance
- [ ] ✅ Images compressed and optimized
- [ ] ✅ CSS and JavaScript minified
- [ ] ✅ Critical CSS inlined
- [ ] ✅ Font loading optimized
- [ ] ✅ Lazy loading implemented
- [ ] ✅ Core Web Vitals passing

---

**Built with pixel-perfect precision by [Gallifrey Consulting](https://gallifrey.consulting)**  
**Core Developer**: [Hadi Rickit](https://rickithadi.dev)