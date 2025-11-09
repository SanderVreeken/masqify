import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, ArrowLeft, Shield, Eye, Code } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold mb-2" style={{ fontSize: 'clamp(1.125rem, 2.25vw + 0.375rem, 1.5rem)' }}>
            <Image src="/masqify-logo.svg" alt="Masqify" width={28} height={28} />
            Masqify
          </Link>
          <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Privacy Policy</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.25rem)' }}>Privacy Policy</CardTitle>
            <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <Shield className="size-8 text-primary mb-2" />
                <h3 className="font-semibold text-sm mb-1">No Data Storage</h3>
                <p className="text-xs text-muted-foreground">
                  Your input text and rewritten outputs are never permanently stored on our servers
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <Eye className="size-8 text-primary mb-2" />
                <h3 className="font-semibold text-sm mb-1">Full Transparency</h3>
                <p className="text-xs text-muted-foreground">
                  Review our open-source code to verify our privacy practices
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <Code className="size-8 text-primary mb-2" />
                <h3 className="font-semibold text-sm mb-1">Verifiable Claims</h3>
                <p className="text-xs text-muted-foreground">
                  Every privacy claim can be independently verified in our codebase
                </p>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground">
                This Privacy Policy describes how Masqify ("we", "us", or "our") handles information when you use
                our text rewriting service ("Service"). We are committed to transparency and have made our entire
                source code available for public review to allow you to independently verify our privacy practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Open Source Verification</h2>
              <div className="p-4 bg-muted/50 rounded-lg border mb-4">
                <p className="text-sm font-semibold mb-2">Verify Our Claims:</p>
                <p className="text-sm text-muted-foreground mb-2">
                  You can review the complete source code of this application to verify all privacy claims made in this
                  policy:
                </p>
                <p className="text-sm">
                  <strong>Source Code Repository:</strong>{" "}
                  <a
                    href="[GITHUB_REPOSITORY_URL]"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    [GITHUB_REPOSITORY_URL]
                  </a>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  We encourage technically-minded users to inspect the code to confirm that we do not store, log, or
                  retain your sensitive text inputs or outputs.
                </p>
              </div>
              <p className="text-muted-foreground">
                <strong>Note:</strong> While the source code is available for review and transparency purposes, you are
                not permitted to copy, reproduce, or distribute the software. See our Terms of Service for details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. How Our Privacy-First Architecture Works</h2>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-4">
                <h3 className="font-semibold text-base mb-2">Your Sensitive Data NEVER Leaves Your Browser</h3>
                <p className="text-sm text-muted-foreground">
                  Our application is designed with a unique privacy-first architecture where your sensitive data
                  stays entirely on your device. Here's exactly how it works:
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-sm mb-2">Step 1: Client-Side Data Marking</h4>
                  <p className="text-xs text-muted-foreground">
                    When you enter text and mark sensitive information (names, emails, addresses, etc.), this data
                    is stored only in your browser's memory. It never touches our servers at this stage.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-sm mb-2">Step 2: Client-Side Sanitization</h4>
                  <p className="text-xs text-muted-foreground">
                    Your browser automatically replaces all marked sensitive data with generic placeholders
                    (e.g., <code className="text-xs bg-muted px-1 rounded">[REDACTED-1]</code>,
                    <code className="text-xs bg-muted px-1 rounded ml-1">[REDACTED-2]</code>).
                    This happens entirely on your device before any network request is made.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-sm mb-2">Step 3: Sanitized Text Sent to API</h4>
                  <p className="text-xs text-muted-foreground">
                    <strong>Only the sanitized text with placeholders</strong> is sent to our servers and then
                    forwarded to the AI provider (OpenAI). Your actual sensitive data remains in your browser's
                    memory and is never transmitted over the network.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-sm mb-2">Step 4: Client-Side Restoration</h4>
                  <p className="text-xs text-muted-foreground">
                    When the rewritten text returns (still with placeholders), your browser automatically
                    replaces the placeholders with your original sensitive data. This restoration happens
                    entirely on your device.
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-4 bg-green-50 dark:bg-green-950/20 p-3 rounded">
                  <h4 className="font-semibold text-sm mb-2 text-green-700 dark:text-green-400">Result: Complete Privacy</h4>
                  <p className="text-xs text-muted-foreground">
                    Your sensitive information <strong>never leaves your browser</strong>. Our servers and the
                    AI provider only see generic placeholders. You can verify this architecture by reviewing
                    our open-source code, particularly:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-4">
                    <li>• <code className="text-xs">components/text-input.tsx</code> - Client-side marking</li>
                    <li>• <code className="text-xs">components/text-rewriter.tsx</code> - Sanitization & restoration</li>
                    <li>• <code className="text-xs">app/api/rewrite/route.ts</code> - Server receives only placeholders</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Information We Do NOT Collect or Store</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                    <span className="text-green-600">✓</span> Your Text Input (Original with Sensitive Data)
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    We do <strong>NOT</strong> store or log the text you submit for rewriting. As explained above,
                    your original text with sensitive data <strong>never leaves your browser</strong>. Only sanitized
                    versions with placeholders are sent to our servers, and even those are processed in memory and
                    immediately discarded after generating the rewritten version.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                    <span className="text-green-600">✓</span> Your Rewritten Output
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    We do <strong>NOT</strong> store or log the rewritten text that is generated. Once displayed to
                    you, the output is not retained on our servers. The source code demonstrates this processing flow.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                    <span className="text-green-600">✓</span> Analytics or Tracking
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    We do <strong>NOT</strong> use any analytics, tracking, or advertising services. We do not
                    analyze, categorize, or create profiles based on the content of your text inputs, outputs,
                    or browsing behavior. No third-party analytics tools (Google Analytics, Vercel Analytics, etc.)
                    are present in our application.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                    <span className="text-green-600">✓</span> Session Recordings or Keystroke Logging
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    We do <strong>NOT</strong> record your sessions, capture screenshots, or log keystrokes.
                    Session replay tools (like Sentry Session Replay, LogRocket, etc.) are completely disabled.
                    Our error tracking is configured to explicitly filter out all user input events.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Information We Do Collect</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-base mb-2">5.1 Account Information</h3>
                  <p className="text-muted-foreground">
                    To provide the Service, we collect and store only essential account information:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                    <li>Email address (for authentication and account recovery)</li>
                    <li>Name (for account identification)</li>
                    <li>Encrypted password (hashed and salted)</li>
                    <li>Account creation date</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">5.2 Usage Metadata</h3>
                  <p className="text-muted-foreground">
                    We collect minimal usage information for service operation purposes:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                    <li>Token usage count (for billing and quota management)</li>
                    <li>Transaction history (for payment and credit management)</li>
                    <li>API request timestamps (for rate limiting and service monitoring)</li>
                    <li>Error logs (without sensitive content) for technical debugging</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">
                    <strong>Important:</strong> These logs do NOT contain your actual text input or output. Only
                    technical metadata such as request timing and success/failure status is recorded.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    <strong>No Analytics:</strong> We do NOT use any analytics, tracking, or advertising cookies. Your browsing behavior is not monitored or shared with third parties.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">5.3 Technical Information</h3>
                  <p className="text-muted-foreground">Standard technical data collected automatically:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                    <li>IP address (for security and fraud prevention)</li>
                    <li>Browser type and version</li>
                    <li>Device type and operating system</li>
                    <li>Session cookies (for authentication state)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. How We Use Information</h2>
              <p className="text-muted-foreground mb-2">We use the collected information solely for:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Providing and maintaining the Service</li>
                <li>Managing your account and authentication</li>
                <li>Processing payments and managing credits/tokens</li>
                <li>Preventing fraud and ensuring security</li>
                <li>Technical troubleshooting and service improvement</li>
                <li>Communicating important service updates</li>
                <li>Complying with legal obligations</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                <strong>We do NOT:</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Sell your information to third parties</li>
                <li>Use your text content for training AI models</li>
                <li>Share your content with any third party (except as required by law)</li>
                <li>Use your data for marketing or advertising purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Third-Party Services</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-base mb-2">7.1 AI Processing (OpenAI)</h3>
                  <p className="text-muted-foreground">
                    We use OpenAI's API to process your text rewriting requests. When you submit text for rewriting:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                    <li><strong>Only sanitized text with placeholders</strong> (e.g., [REDACTED-1]) is sent to OpenAI's API</li>
                    <li>Your actual sensitive data remains in your browser and is never sent to OpenAI</li>
                    <li>OpenAI processes the sanitized text according to their privacy policy</li>
                    <li>We do not control OpenAI's data handling practices for the sanitized text they receive</li>
                    <li>We recommend reviewing OpenAI's privacy policy for their data handling practices</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">
                    <strong>Important Privacy Note:</strong> Because of our client-side sanitization architecture,
                    OpenAI never sees your sensitive information. They only receive generic placeholders.
                    However, they do see the non-sensitive parts of your text. Review OpenAI's privacy policy
                    at <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://openai.com/privacy</a> to understand how they handle the sanitized text.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">7.2 Payment Processing</h3>
                  <p className="text-muted-foreground">
                    Payment information is processed by third-party payment processors (such as Stripe). We do not
                    store your complete payment card details on our servers. Payment processors have their own privacy
                    policies governing the use of your information.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Data Retention</h2>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  <strong>Text Content:</strong> Your input and output text is <strong>NOT RETAINED</strong>. It exists
                  only in memory during processing and is immediately discarded.
                </p>
                <p className="text-muted-foreground">
                  <strong>Account Data:</strong> We retain your account information for as long as your account is
                  active. You may request account deletion at any time.
                </p>
                <p className="text-muted-foreground">
                  <strong>Transaction Records:</strong> Financial transaction records are retained as required by law
                  for accounting and tax purposes.
                </p>
                <p className="text-muted-foreground">
                  <strong>Technical Logs:</strong> Technical logs (without sensitive content) are retained for a
                  limited period for debugging and security purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Data Security</h2>
              <p className="text-muted-foreground mb-2">We implement security measures including:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Encrypted HTTPS connections for all data transmission</li>
                <li>Secure password hashing using industry-standard algorithms</li>
                <li>Secure session management</li>
                <li>Regular security updates and monitoring</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we
                strive to use commercially acceptable means to protect your information, we cannot guarantee absolute
                security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Your Rights</h2>
              <p className="text-muted-foreground mb-2">You have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Access your personal account information</li>
                <li>Update or correct your account information</li>
                <li>Request deletion of your account and associated data</li>
                <li>Export your account data</li>
                <li>Opt-out of non-essential communications</li>
                <li>Review our source code to verify our privacy practices</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                To exercise these rights, please contact us through the contact information available on our platform
                or by reviewing the source code repository.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Disclaimer of Liability</h2>
              <p className="text-muted-foreground">
                While we make every effort to protect your privacy and have designed our system to not store sensitive
                text content, WE MAKE NO WARRANTIES OR GUARANTEES REGARDING DATA SECURITY OR PRIVACY. You can verify
                our implementation by reviewing the open-source code, but YOU USE THE SERVICE AT YOUR OWN RISK. We are
                not liable for any data breaches, unauthorized access, or privacy violations that may occur despite our
                security measures.
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>For highly sensitive or confidential information, we recommend:</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                <li>Reviewing the source code to understand exactly how data flows through the system</li>
                <li>Understanding that data temporarily passes through third-party AI services</li>
                <li>Exercising caution and using your own judgment about what information to process</li>
                <li>Considering whether this Service is appropriate for your specific use case</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal
                information from children under 18. If you become aware that a child has provided us with personal
                information, please contact us, and we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and processed in countries other than your country of residence.
                These countries may have data protection laws that are different from the laws of your country. By using
                the Service, you consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">14. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last updated" date. We will also update the source
                code repository accordingly. You are advised to review this Privacy Policy periodically for any
                changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">15. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or wish to exercise your privacy rights, please:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                <li>Review the source code repository for technical verification</li>
                <li>Contact us through the contact information available on our platform</li>
              </ul>
            </section>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm font-semibold mb-2">Transparency Commitment:</p>
              <p className="text-sm text-muted-foreground mb-3">
                We believe in complete transparency regarding data privacy. That's why we've made our entire codebase
                open for review. You don't have to trust our words alone—you can verify our privacy practices by
                examining the code yourself.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Key Privacy Features You Can Verify:</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4 mt-2">
                <li>No database storage of input/output text content</li>
                <li>Text processing happens in-memory only</li>
                <li>No content logging or analytics on user text</li>
                <li>Secure authentication and session management</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 sm:mt-6 flex justify-center">
          <Link href="/register">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              Back to Registration
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
