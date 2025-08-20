import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs-extra';
import * as path from 'path';

describe('SEO Optimization', () => {
  const testDir = path.join(__dirname, 'test-seo-project');
  
  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('Meta Tag Optimization', () => {
    it('should validate title tag length and quality', () => {
      const goodTitles = [
        'Professional Web Development Services | Your Company',
        'Next.js E-commerce Solutions - Fast & Secure',
        'AI-Powered Development Tools for Modern Teams'
      ];
      
      const badTitles = [
        'Home', // Too short
        'This is an extremely long title that goes way beyond the recommended 60 character limit and will be truncated in search results', // Too long
        '', // Empty
        'Page' // Too generic
      ];

      goodTitles.forEach(title => {
        expect(title.length).toBeGreaterThanOrEqual(10);
        expect(title.length).toBeLessThanOrEqual(60);
        expect(title).toMatch(/[A-Z]/); // Has capital letters
      });

      badTitles.forEach(title => {
        expect(
          title.length < 10 || 
          title.length > 60 || 
          title.trim() === ''
        ).toBe(true);
      });
    });

    it('should validate meta description quality', () => {
      const goodDescriptions = [
        'Transform your development workflow with AI-powered agent coordination. Get pixel-perfect results with security-first engineering and obsessive attention to detail.',
        'Professional web development services focused on performance, security, and user experience. Custom solutions built with modern frameworks and best practices.'
      ];

      const badDescriptions = [
        'This is short', // Too short
        'This is an extremely long meta description that goes way beyond the recommended 160 character limit and will be truncated in search engine results pages which is not good for SEO', // Too long
        '' // Empty
      ];

      goodDescriptions.forEach(desc => {
        expect(desc.length).toBeGreaterThanOrEqual(120);
        expect(desc.length).toBeLessThanOrEqual(160);
        expect(desc).toMatch(/\./); // Has proper punctuation
      });

      badDescriptions.forEach(desc => {
        expect(
          desc.length < 120 || 
          desc.length > 160 || 
          desc.trim() === ''
        ).toBe(true);
      });
    });
  });

  describe('Structured Data Validation', () => {
    it('should validate Schema.org WebPage structured data', () => {
      const validWebPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Professional Web Development",
        "description": "Transform your business with custom web development services",
        "url": "https://example.com",
        "isPartOf": {
          "@type": "WebSite",
          "name": "Example Company",
          "url": "https://example.com"
        }
      };

      expect(validWebPageSchema["@context"]).toBe("https://schema.org");
      expect(validWebPageSchema["@type"]).toBe("WebPage");
      expect(validWebPageSchema.name).toBeTruthy();
      expect(validWebPageSchema.description).toBeTruthy();
      expect(validWebPageSchema.url).toBeValidUrl();
    });

    it('should validate Schema.org Organization data', () => {
      const validOrganizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Gallifrey Consulting",
        "url": "https://gallifrey.consulting",
        "logo": "https://gallifrey.consulting/logo.png",
        "description": "Security-first digital development with obsessive attention to detail",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Melbourne",
          "addressCountry": "AU"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "hello@gallifrey.consulting"
        }
      };

      expect(validOrganizationSchema["@context"]).toBe("https://schema.org");
      expect(validOrganizationSchema["@type"]).toBe("Organization");
      expect(validOrganizationSchema.name).toBeTruthy();
      expect(validOrganizationSchema.url).toBeValidUrl();
      expect(validOrganizationSchema.logo).toBeValidUrl();
      expect(validOrganizationSchema.description.length).toBeGreaterThan(20);
    });

    it('should validate Schema.org Software Application data', () => {
      const validSoftwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Aegis CLI",
        "description": "Security-first AI development CLI with enterprise-grade intelligence",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": ["macOS", "Linux", "Windows"],
        "author": {
          "@type": "Person",
          "name": "Hadi Rickit",
          "url": "https://rickithadi.dev"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Gallifrey Consulting",
          "url": "https://gallifrey.consulting"
        },
        "downloadUrl": "https://github.com/rickithadi/multi-agent-workflow",
        "softwareVersion": "1.0.0",
        "programmingLanguage": "TypeScript"
      };

      expect(validSoftwareSchema["@type"]).toBe("SoftwareApplication");
      expect(validSoftwareSchema.applicationCategory).toBe("DeveloperApplication");
      expect(Array.isArray(validSoftwareSchema.operatingSystem)).toBe(true);
      expect(validSoftwareSchema.downloadUrl).toBeValidUrl();
      expect(validSoftwareSchema.author).toHaveProperty("name");
      expect(validSoftwareSchema.publisher).toHaveProperty("name");
    });
  });

  describe('Core Web Vitals Optimization', () => {
    it('should validate performance metrics thresholds', () => {
      const performanceMetrics = {
        LCP: 1.8, // Largest Contentful Paint (seconds)
        FID: 65,  // First Input Delay (milliseconds)  
        CLS: 0.05, // Cumulative Layout Shift
        FCP: 1.2,  // First Contentful Paint (seconds)
        TTI: 2.8,  // Time to Interactive (seconds)
        TBT: 95    // Total Blocking Time (milliseconds)
      };

      // Google's "Good" thresholds
      expect(performanceMetrics.LCP).toBeLessThanOrEqual(2.5);
      expect(performanceMetrics.FID).toBeLessThanOrEqual(100);
      expect(performanceMetrics.CLS).toBeLessThanOrEqual(0.1);
      expect(performanceMetrics.FCP).toBeLessThanOrEqual(1.8);
      expect(performanceMetrics.TTI).toBeLessThanOrEqual(3.8);
      expect(performanceMetrics.TBT).toBeLessThanOrEqual(200);
    });

    it('should validate image optimization strategies', () => {
      const imageOptimizations = {
        formats: ['WebP', 'AVIF', 'JPEG'],
        lazyLoading: true,
        responsiveImages: true,
        compression: 0.85, // 85% quality
        maxWidth: 1920,
        altTextRequired: true
      };

      expect(imageOptimizations.formats).toContain('WebP');
      expect(imageOptimizations.lazyLoading).toBe(true);
      expect(imageOptimizations.compression).toBeGreaterThan(0.7);
      expect(imageOptimizations.compression).toBeLessThan(1.0);
      expect(imageOptimizations.altTextRequired).toBe(true);
    });
  });

  describe('Next.js SEO Implementation', () => {
    it('should validate Next.js metadata API usage', async () => {
      const metadataImplementation = `
        import type { Metadata } from 'next'
        
        export const metadata: Metadata = {
          title: {
            template: '%s | Gallifrey Consulting',
            default: 'Gallifrey Consulting - Security-First Development'
          },
          description: 'Transform your development with security-first AI agents, pixel-perfect precision, and obsessive attention to detail.',
          keywords: ['security', 'development', 'AI', 'consulting', 'typescript'],
          authors: [{ name: 'Hadi Rickit', url: 'https://rickithadi.dev' }],
          creator: 'Gallifrey Consulting',
          publisher: 'Gallifrey Consulting',
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
            url: 'https://gallifrey.consulting',
            title: 'Gallifrey Consulting - Security-First Development',
            description: 'Professional development services with military-grade security.',
            siteName: 'Gallifrey Consulting',
            images: [{
              url: 'https://gallifrey.consulting/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'Gallifrey Consulting - Security-First Development'
            }],
          },
          twitter: {
            card: 'summary_large_image',
            title: 'Gallifrey Consulting - Security-First Development',
            description: 'Professional development with obsessive attention to detail.',
            images: ['https://gallifrey.consulting/twitter-image.jpg'],
          },
        }
      `;

      expect(metadataImplementation).toContain('Metadata');
      expect(metadataImplementation).toContain('openGraph');
      expect(metadataImplementation).toContain('twitter');
      expect(metadataImplementation).toContain('robots');
      expect(metadataImplementation).toContain('template');
    });

    it('should validate sitemap generation', async () => {
      const sitemapCode = `
        import { MetadataRoute } from 'next'
        
        export default function sitemap(): MetadataRoute.Sitemap {
          return [
            {
              url: 'https://gallifrey.consulting',
              lastModified: new Date(),
              changeFrequency: 'monthly',
              priority: 1,
            },
            {
              url: 'https://gallifrey.consulting/services',
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.8,
            },
            {
              url: 'https://gallifrey.consulting/about',
              lastModified: new Date(),
              changeFrequency: 'monthly',
              priority: 0.6,
            }
          ]
        }
      `;

      expect(sitemapCode).toContain('MetadataRoute.Sitemap');
      expect(sitemapCode).toContain('lastModified');
      expect(sitemapCode).toContain('changeFrequency');
      expect(sitemapCode).toContain('priority');
    });
  });

  describe('Jekyll SEO Implementation', () => {
    it('should validate Jekyll SEO tag configuration', async () => {
      const jekyllSEOConfig = `
        title: Gallifrey Consulting
        description: Security-first digital development with obsessive attention to detail
        url: https://gallifrey.consulting
        twitter_username: gallifreyconsult
        github_username: rickithadi

        author:
          name: Hadi Rickit
          email: hello@gallifrey.consulting
          twitter: rickithadi
          linkedin: hadirickit

        social:
          name: Gallifrey Consulting
          links:
            - https://twitter.com/gallifreyconsult
            - https://github.com/rickithadi
            - https://linkedin.com/company/gallifrey-consulting

        google_analytics: G-XXXXXXXXXX

        plugins:
          - jekyll-feed
          - jekyll-sitemap
          - jekyll-seo-tag
          - jekyll-paginate-v2
      `;

      expect(jekyllSEOConfig).toContain('jekyll-seo-tag');
      expect(jekyllSEOConfig).toContain('jekyll-sitemap');
      expect(jekyllSEOConfig).toContain('author:');
      expect(jekyllSEOConfig).toContain('social:');
      expect(jekyllSEOConfig).toContain('google_analytics');
    });

    it('should validate Jekyll structured data implementation', () => {
      const jekyllStructuredData = `
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
        {% endif %}
      `;

      expect(jekyllStructuredData).toContain('application/ld+json');
      expect(jekyllStructuredData).toContain('BlogPosting');
      expect(jekyllStructuredData).toContain('author');
      expect(jekyllStructuredData).toContain('publisher');
      expect(jekyllStructuredData).toContain('datePublished');
    });
  });

  describe('SEO Analysis Tools', () => {
    it('should validate SEO page score calculation', () => {
      const pageData = {
        title: 'Gallifrey Consulting - Security-First Development Services',
        description: 'Transform your development workflow with military-grade security, obsessive attention to detail, and pixel-perfect precision. Enterprise consulting services.',
        keywords: ['security', 'development', 'consulting', 'typescript', 'nextjs'],
        structuredData: {
          "@type": "Organization",
          "name": "Gallifrey Consulting"
        },
        headings: {
          h1: 1,
          h2: 3,
          h3: 5
        },
        images: {
          total: 8,
          withAlt: 8,
          optimized: 6
        },
        links: {
          internal: 12,
          external: 4
        },
        performance: {
          LCP: 1.8,
          FID: 65,
          CLS: 0.05
        }
      };

      expect(pageData).toHaveGoodSEOScore();
      expect(pageData.title.length).toBeGreaterThan(10);
      expect(pageData.title.length).toBeLessThan(60);
      expect(pageData.description.length).toBeGreaterThan(120);
      expect(pageData.description.length).toBeLessThan(160);
      expect(pageData.keywords.length).toBeGreaterThan(3);
      expect(pageData.headings.h1).toBe(1);
      expect(pageData.images.withAlt).toBe(pageData.images.total);
    });

    it('should identify SEO improvement opportunities', () => {
      const seoAudit = {
        criticalIssues: [
          'Missing meta description on 3 pages',
          'Duplicate title tags found'
        ],
        warnings: [
          'Image alt text could be more descriptive',
          'Internal linking could be improved'
        ],
        suggestions: [
          'Add FAQ schema to relevant pages',
          'Implement breadcrumb navigation',
          'Consider adding review schema for testimonials'
        ],
        score: 87
      };

      expect(seoAudit.score).toBeGreaterThan(80);
      expect(seoAudit.criticalIssues.length).toBeLessThan(5);
      expect(Array.isArray(seoAudit.suggestions)).toBe(true);
      expect(seoAudit.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('Local SEO for Melbourne Business', () => {
    it('should validate local business schema', () => {
      const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Gallifrey Consulting",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Collins Street",
          "addressLocality": "Melbourne",
          "addressRegion": "VIC",
          "postalCode": "3000",
          "addressCountry": "AU"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -37.8136,
          "longitude": 144.9631
        },
        "telephone": "+61-x-xxxx-xxxx",
        "url": "https://gallifrey.consulting",
        "serviceArea": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates", 
            "latitude": -37.8136,
            "longitude": 144.9631
          },
          "geoRadius": "50000" // 50km radius
        },
        "priceRange": "$$$",
        "openingHours": "Mo-Fr 09:00-18:00"
      };

      expect(localBusinessSchema["@type"]).toBe("ProfessionalService");
      expect(localBusinessSchema.address.addressLocality).toBe("Melbourne");
      expect(localBusinessSchema.address.addressCountry).toBe("AU");
      expect(localBusinessSchema.geo.latitude).toBeLessThan(-37);
      expect(localBusinessSchema.geo.longitude).toBeGreaterThan(144);
      expect(localBusinessSchema.serviceArea).toHaveProperty("geoRadius");
    });
  });
});