import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Lock, Eye, Server, Database, Code2, CheckCircle2, AlertTriangle } from "lucide-react"

export const metadata = {
  title: "Security & Privacy Architecture",
  description: "Detailed technical documentation of Masqify's security measures and privacy-first architecture.",
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4 sm:mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold mb-2" style={{ fontSize: 'clamp(1.125rem, 2.25vw + 0.375rem, 1.5rem)' }}>
            <Image src="/masqify-logo.svg" alt="Masqify" width={28} height={28} />
            Masqify
          </Link>
          <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Security & Privacy Architecture</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle style={{ fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.25rem)' }}>Security Architecture</CardTitle>
            <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
              Comprehensive technical documentation of our privacy-first security measures
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Disclaimer */}
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
              <p className="text-sm font-semibold mb-2">⚠️ Important Security Disclaimer</p>
              <p className="text-sm text-muted-foreground mb-3">
                While we implement industry-leading security practices and make every effort to protect your data,
                <strong> no system is 100% secure</strong>. This page describes our security architecture, but we make
                <strong> no warranties or guarantees</strong> about the absolute security or privacy of your data.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>You use this service at your own risk.</strong> We are not liable for any security vulnerabilities,
                bugs, data leaks, or privacy violations that may occur. Review our{" "}
                <a href="/terms" className="text-primary underline">Terms of Service</a> and{" "}
                <a href="/privacy" className="text-primary underline">Privacy Policy</a> for complete liability limitations.
                All source code is available for independent security verification on{" "}
                <a href="https://github.com/SanderVreeken/masqify" target="_blank" rel="noopener noreferrer" className="text-primary underline">GitHub</a>.
              </p>
            </div>

            {/* Executive Summary */}
            <section className="p-6 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-4">
                <Shield className="size-10 text-primary shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Executive Summary</h2>
                  <p className="text-muted-foreground mb-4">
                    Masqify implements a <strong>zero-knowledge architecture</strong> where your sensitive data never leaves your browser.
                    Unlike traditional AI tools, we use client-side sanitization to ensure that third-party AI services only receive
                    generic placeholders - never your actual confidential information.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">No Data Storage</p>
                        <p className="text-xs text-muted-foreground">Text content never stored on servers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Client-Side Protection</p>
                        <p className="text-xs text-muted-foreground">Sensitive data stays in your browser</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">No Analytics</p>
                        <p className="text-xs text-muted-foreground">Zero tracking or behavioral monitoring</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Open Source</p>
                        <p className="text-xs text-muted-foreground">Independently verifiable security claims</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="size-6 text-primary" />
                <h2 className="text-xl font-semibold">How Our Privacy Architecture Works</h2>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6 py-3">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold shrink-0">1</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">You Mark Sensitive Data</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Highlight any sensitive information in your text (names, emails, addresses, account numbers, etc.).
                        Our client-side interface tracks these selections entirely in your browser's memory.
                      </p>
                      <div className="p-3 bg-muted/50 rounded border">
                        <p className="text-xs font-mono">Original: "Contact John Smith at john@example.com"</p>
                        <p className="text-xs text-muted-foreground mt-1">↓ You select "John Smith" and "john@example.com"</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-600 pl-6 py-3 bg-green-50 dark:bg-green-950/20 rounded-r">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex items-center justify-center size-8 rounded-full bg-green-600 text-white font-bold shrink-0">2</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-green-700 dark:text-green-400">Client-Side Sanitization (In Browser)</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong>Before any network request is made</strong>, JavaScript in your browser replaces your sensitive data with
                        generic placeholders. This happens entirely on your device - the server never sees your original text.
                      </p>
                      <div className="p-3 bg-background rounded border border-green-600/30">
                        <p className="text-xs font-mono text-green-700 dark:text-green-400">
                          Sanitized: "Contact [REDACTED-1] at [REDACTED-2]"
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">✅ This sanitized version is what gets transmitted</p>
                      </div>
                      <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-xs">
                        <strong>Source Code:</strong>{" "}
                        <a
                          href="https://github.com/SanderVreeken/masqify/blob/main/components/text-rewriter.tsx#L86-L95"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          components/text-rewriter.tsx:86-95
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-orange-500 pl-6 py-3">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex items-center justify-center size-8 rounded-full bg-orange-500/10 text-orange-600 font-bold shrink-0">3</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Server Processes Placeholders Only</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Our server receives only the sanitized text with placeholders. It forwards this to OpenAI's API for rewriting.
                        <strong> Neither our server nor OpenAI ever sees your actual sensitive information.</strong>
                      </p>
                      <div className="p-3 bg-muted/50 rounded border">
                        <p className="text-xs font-mono">Server receives: "Contact [REDACTED-1] at [REDACTED-2]"</p>
                        <p className="text-xs font-mono mt-1">OpenAI receives: "Contact [REDACTED-1] at [REDACTED-2]"</p>
                        <p className="text-xs text-muted-foreground mt-2">❌ Original data never transmitted over network</p>
                      </div>
                      <div className="mt-3 p-2 bg-muted rounded text-xs">
                        <strong>Source Code:</strong>{" "}
                        <a
                          href="https://github.com/SanderVreeken/masqify/blob/main/app/api/rewrite/route.ts#L94-L108"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          app/api/rewrite/route.ts:94-108
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-600 pl-6 py-3 bg-green-50 dark:bg-green-950/20 rounded-r">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex items-center justify-center size-8 rounded-full bg-green-600 text-white font-bold shrink-0">4</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-green-700 dark:text-green-400">Client-Side Restoration (In Browser)</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        When the rewritten text returns (still containing placeholders), your browser automatically restores
                        your original sensitive data by replacing the placeholders. <strong>This happens entirely on your device.</strong>
                      </p>
                      <div className="p-3 bg-background rounded border border-green-600/30">
                        <p className="text-xs font-mono">Received: "Please contact [REDACTED-1] via [REDACTED-2]"</p>
                        <p className="text-xs text-muted-foreground mt-1">↓ Browser restores your data</p>
                        <p className="text-xs font-mono mt-1 text-green-700 dark:text-green-400">
                          Final: "Please contact John Smith via john@example.com"
                        </p>
                      </div>
                      <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-xs">
                        <strong>Source Code:</strong>{" "}
                        <a
                          href="https://github.com/SanderVreeken/masqify/blob/main/components/text-rewriter.tsx#L146-L150"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          components/text-rewriter.tsx:146-150
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* What We Don't Store */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Database className="size-6 text-primary" />
                <h2 className="text-xl font-semibold">What We Do NOT Store</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Your Original Text</h3>
                      <p className="text-sm text-muted-foreground">
                        Never stored on servers. Exists only in your browser's memory during use.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Rewritten Output</h3>
                      <p className="text-sm text-muted-foreground">
                        Not retained after display. Processed in memory and immediately discarded.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Marked Sensitive Items</h3>
                      <p className="text-sm text-muted-foreground">
                        Never transmitted or stored. Stay exclusively in browser memory.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Analytics or Behavior</h3>
                      <p className="text-sm text-muted-foreground">
                        Zero tracking. No analytics services. No session recordings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                <p className="text-sm font-semibold mb-2">What We DO Store (Minimal Metadata Only):</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Character counts (input/output length) for billing</li>
                  <li>• Token usage and costs for accounting</li>
                  <li>• Timestamps for transaction history</li>
                  <li>• Account information (email, name, hashed password)</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  <strong>Verification:</strong> Review database schema at{" "}
                  <a
                    href="https://github.com/SanderVreeken/masqify/blob/main/lib/db/schema.ts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    lib/db/schema.ts
                  </a>
                  {" "}- no text storage fields exist
                </p>
              </div>
            </section>

            {/* Security Measures */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Server className="size-6 text-primary" />
                <h2 className="text-xl font-semibold">Additional Security Measures</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Shield className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Rate Limiting</h3>
                    <p className="text-xs text-muted-foreground">
                      20 requests per hour per user to prevent abuse and automated scraping
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Lock className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">HTTPS-Only Encryption</h3>
                    <p className="text-xs text-muted-foreground">
                      All data in transit is encrypted. HTTP-only cookies with CSRF protection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Eye className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Error Monitoring Sanitization</h3>
                    <p className="text-xs text-muted-foreground">
                      Sentry error tracking configured to filter all user input. Only error types logged, never user data.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Database className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">SQL Injection Protection</h3>
                    <p className="text-xs text-muted-foreground">
                      Drizzle ORM with parameterized queries. No raw SQL concatenation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Shield className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Two-Factor Authentication</h3>
                    <p className="text-xs text-muted-foreground">
                      Optional TOTP-based 2FA for enhanced account security
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Open Source Verification */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="size-6 text-primary" />
                <h2 className="text-xl font-semibold">Open Source & Verifiable</h2>
              </div>

              <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground mb-4">
                  Every security claim on this page can be independently verified by reviewing our open-source code.
                  We encourage security researchers and technically-minded users to audit our implementation.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="size-4 text-primary" />
                    <a
                      href="https://github.com/SanderVreeken/masqify"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary underline font-semibold"
                    >
                      View Full Source Code on GitHub →
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-primary" />
                    <a
                      href="https://github.com/SanderVreeken/masqify/blob/main/SECURITY.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary underline font-semibold"
                    >
                      Read Security Policy →
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section>
              <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                <AlertTriangle className="size-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-2">Security Disclaimer</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    While we implement industry best practices and have designed our system to maximize privacy,
                    <strong> no system is 100% secure</strong>. For highly sensitive or classified information:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                    <li>• Review our open-source code to understand the data flow</li>
                    <li>• Consider whether AI assistance is appropriate for your use case</li>
                    <li>• Understand that sanitized text still goes to third-party AI services</li>
                    <li>• Use your professional judgment about what to process</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    You can verify our implementation but ultimately use the service at your own risk.
                    See our full <a href="/terms" className="text-primary underline">Terms of Service</a> for details.
                  </p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="size-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/privacy">
            <Button variant="outline">
              Privacy Policy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
