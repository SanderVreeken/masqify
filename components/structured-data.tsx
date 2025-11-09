import Script from 'next/script'

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Masqify",
    "url": "https://masqify.io",
    "logo": "https://masqify.io/logo.png",
    "description": "Privacy-first storytelling companion that masks sensitive information while transforming your narrative",
    "founder": {
      "@type": "Person",
      "name": "Sander Vreeken"
    },
    "sameAs": [
      "https://github.com/SanderVreeken/masqify"
    ]
  }

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function SoftwareApplicationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Masqify",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Text Editor",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "0.01",
        "priceCurrency": "EUR",
        "unitText": "per AI rewrite"
      }
    },
    "description": "Privacy-first storytelling companion that masks sensitive information. Your confidential data stays in your browser while AI transforms your narrative. Perfect for anyone who needs to tell their story securely.",
    "featureList": [
      "Client-side data sanitization",
      "AI-powered text rewriting",
      "Automatic sensitive data protection",
      "No data storage on servers",
      "Open-source and verifiable",
      "Zero-knowledge architecture"
    ],
    "screenshot": "https://masqify.io/screenshot.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "ratingCount": "1"
    },
    "author": {
      "@type": "Person",
      "name": "Sander Vreeken"
    }
  }

  return (
    <Script
      id="software-application-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function WebSiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Masqify",
    "url": "https://masqify.io",
    "description": "Privacy-first storytelling companion. Your sensitive data never leaves your browser.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://masqify.io/editor?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function FAQStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is my data really private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Your sensitive data never leaves your browser. Our client-side architecture replaces sensitive information with placeholders before sending anything to AI services. The AI only sees generic placeholders, and your actual data is restored in your browser after processing. You can verify this by reviewing our open-source code."
        }
      },
      {
        "@type": "Question",
        "name": "What happens to my text after I use the service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nothing is stored. Your input and output text exist only in memory during processing and are immediately discarded. We don't log, store, or retain any text content on our servers. The source code demonstrates this processing flow."
        }
      },
      {
        "@type": "Question",
        "name": "How does the privacy-first architecture work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "1) You mark sensitive information in your browser. 2) Your browser replaces sensitive data with generic placeholders like [REDACTED-1]. 3) Only the sanitized text with placeholders is sent to AI services. 4) After rewriting, your browser automatically restores the original sensitive data. Your actual confidential information never leaves your device."
        }
      },
      {
        "@type": "Question",
        "name": "Do you use analytics or tracking?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. We don't use any analytics, tracking, or advertising services. Your browsing behavior is not monitored or shared with third parties. We only collect essential account information and transaction data for billing purposes."
        }
      },
      {
        "@type": "Question",
        "name": "Can I verify your privacy claims?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our entire codebase is open-source and available for review. You can independently verify that: sensitive data never leaves your browser, only placeholders are sent to servers, no text content is stored, and no analytics tools are present."
        }
      }
    ]
  }

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
