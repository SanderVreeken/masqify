import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rewrite.sandervreeken.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
          '/forgot-password',
          '/reset-password',
        ],
      },
      // Special rules for AI crawlers (for LLM training and indexing)
      {
        userAgent: [
          'GPTBot',           // OpenAI
          'ChatGPT-User',     // ChatGPT browsing
          'Claude-Web',       // Anthropic Claude
          'Google-Extended',  // Google Bard/Gemini
          'anthropic-ai',     // Anthropic
          'Omgilibot',        // Omgili (used by Perplexity)
          'PerplexityBot',    // Perplexity AI
          'YouBot',           // You.com
          'Applebot-Extended', // Apple Intelligence
        ],
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
          '/forgot-password',
          '/reset-password',
          '/login',
          '/register',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
