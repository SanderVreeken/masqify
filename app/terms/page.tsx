import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, ArrowLeft } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold mb-2" style={{ fontSize: 'clamp(1.125rem, 2.25vw + 0.375rem, 1.5rem)' }}>
            <Image src="/masqify-logo.svg" alt="Masqify" width={28} height={28} />
            Masqify
          </Link>
          <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Terms of Service</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.25rem)' }}>Terms of Service</CardTitle>
            <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Masqify ("the Service"), you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to these Terms of Service, please do not use the
                Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Open Source and Source Code Review</h2>
              <p className="text-muted-foreground mb-2">
                The source code for this application is made available for review and transparency purposes. You can
                review the complete source code at:
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>Source Code Repository:</strong>{" "}
                <a
                  href="https://github.com/SanderVreeken/masqify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  github.com/SanderVreeken/masqify
                </a>
              </p>
              <p className="text-muted-foreground mb-2">
                The source code is provided to demonstrate our commitment to transparency and to allow users to verify
                that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Sensitive data marked by users never leaves their browser</li>
                <li>Only sanitized text with placeholders is sent to our servers</li>
                <li>No text content (input or output) is permanently stored on our servers</li>
                <li>No analytics or tracking services are used</li>
                <li>The application operates as described in our documentation</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                <strong>Important:</strong> While the source code is available for review and verification purposes,
                you are <strong>NOT</strong> permitted to copy, reproduce, distribute, modify, create derivative works
                from, publicly display, or publicly perform the software or any portion thereof. The source code is
                provided for transparency and security verification only. All rights to the software remain with the
                copyright holder.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Description of Service</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Masqify provides AI-powered text rewriting capabilities with a unique privacy-first architecture.
                  The Service processes text input provided by users and returns rewritten versions based on user
                  specifications.
                </p>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-sm mb-2">Privacy-First Architecture:</h3>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                    <li>• You mark sensitive information in your browser before submission</li>
                    <li>• Your browser automatically replaces sensitive data with generic placeholders</li>
                    <li>• Only sanitized text with placeholders is sent to our servers and AI providers</li>
                    <li>• Your actual sensitive data never leaves your browser</li>
                    <li>• After rewriting, sensitive data is restored client-side in your browser</li>
                    <li>• No text content (input or output) is permanently stored on our servers</li>
                  </ul>
                </div>

                <p className="text-muted-foreground">
                  <strong>No Analytics or Tracking:</strong> We do not use any analytics, tracking, or advertising
                  services. Your browsing behavior and usage patterns are not monitored or shared with third parties.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. No Warranty and Limitation of Liability</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-base mb-2">4.1 "AS IS" Basis</h3>
                  <p className="text-muted-foreground">
                    THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND,
                    WHETHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, WE DISCLAIM ALL
                    WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">4.2 No Guarantee of Accuracy</h3>
                  <p className="text-muted-foreground">
                    We do not warrant that the Service will be error-free, uninterrupted, or that the rewritten text
                    will be accurate, appropriate, or suitable for your purposes. The quality and appropriateness of
                    the output is not guaranteed.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">4.3 No Liability for Errors or Mistakes</h3>
                  <p className="text-muted-foreground">
                    WE SHALL NOT BE LIABLE FOR ANY ERRORS, MISTAKES, INACCURACIES, OR INAPPROPRIATE CONTENT IN THE
                    REWRITTEN TEXT. YOU ACKNOWLEDGE THAT AI-GENERATED CONTENT MAY CONTAIN ERRORS OR PRODUCE UNEXPECTED
                    RESULTS, AND YOU USE THE SERVICE AT YOUR OWN RISK.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">4.4 Limitation of Liability</h3>
                  <p className="text-muted-foreground">
                    IN NO EVENT SHALL THE SERVICE PROVIDER, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR
                    AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                    INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES,
                    RESULTING FROM:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                    <li>Your access to or use of or inability to access or use the Service</li>
                    <li>Any conduct or content of any third party on the Service</li>
                    <li>Any content obtained from the Service</li>
                    <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                    <li>Errors, mistakes, or inaccuracies in the rewritten text</li>
                    <li>Any consequences arising from your use or reliance on the rewritten text</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">4.5 Maximum Liability</h3>
                  <p className="text-muted-foreground">
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR
                    ALL DAMAGES, LOSSES, AND CAUSES OF ACTION EXCEED THE AMOUNT YOU HAVE PAID US IN THE LAST TWELVE
                    (12) MONTHS, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS LESS.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. User Responsibilities</h2>
              <div className="space-y-2">
                <p className="text-muted-foreground">You agree to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Review and verify all rewritten text before using it for any purpose</li>
                  <li>Take full responsibility for any use of the rewritten text</li>
                  <li>Not rely solely on the Service for critical, legal, medical, or professional documents</li>
                  <li>
                    Verify the source code if you have concerns about data privacy by reviewing the public repository
                  </li>
                  <li>Use the Service in compliance with all applicable laws and regulations</li>
                  <li>Not use the Service for any illegal or unauthorized purpose</li>
                  <li>Not attempt to copy, redistribute, or create derivative works from the software</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to defend, indemnify, and hold harmless the Service provider, its affiliates, licensors, and
                service providers, and its and their respective officers, directors, employees, contractors, agents,
                licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages,
                judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out
                of or relating to your violation of these Terms of Service or your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Third-Party Services</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  The Service uses third-party AI models and services (specifically OpenAI) to provide text rewriting
                  functionality.
                </p>

                <div className="p-4 bg-muted/50 rounded-lg border">
                  <h3 className="font-semibold text-sm mb-2">Important Privacy Notice:</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Due to our client-side sanitization architecture, <strong>OpenAI never receives your sensitive
                    information</strong>. They only see generic placeholders (e.g., [REDACTED-1], [REDACTED-2]).
                    However, they do receive the non-sensitive parts of your text.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    OpenAI processes the sanitized text according to their own terms and privacy policies. You should
                    review OpenAI's terms at{" "}
                    <a
                      href="https://openai.com/policies"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      https://openai.com/policies
                    </a>
                    .
                  </p>
                </div>

                <p className="text-muted-foreground">
                  We are not responsible for the performance, accuracy, or availability of these third-party services.
                  Any issues arising from third-party services are subject to their respective terms and conditions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Modifications to Service</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part
                thereof) with or without notice. You agree that we shall not be liable to you or to any third party for
                any modification, suspension, or discontinuance of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Account Termination and Deletion</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-base mb-2">9.1 Termination by Us</h3>
                  <p className="text-muted-foreground">
                    We may terminate or suspend your account and access to the Service immediately, without prior notice or
                    liability, for any reason whatsoever, including without limitation if you breach the Terms of Service.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">9.2 Account Deletion by User</h3>
                  <p className="text-muted-foreground">
                    You may request deletion of your account at any time through your account settings. Account deletion
                    requires email confirmation and is permanent and irreversible.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">9.3 Forfeiture of Unused Funds</h3>
                  <p className="text-muted-foreground">
                    <strong>IMPORTANT:</strong> Upon account deletion, any remaining account balance or unused credits will
                    be permanently forfeited and cannot be refunded or recovered. By deleting your account, you explicitly
                    waive any and all rights to claim, recover, or receive compensation for unused funds or credits
                    associated with your account.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">9.4 Data Deletion</h3>
                  <p className="text-muted-foreground">
                    When you delete your account, all associated data including your profile information, transaction
                    history, and account settings will be permanently deleted from our systems. Some information may be
                    retained for legal, tax, or regulatory compliance purposes as required by law.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">9.5 No Liability for Account Deletion</h3>
                  <p className="text-muted-foreground">
                    We are not liable for any losses, damages, or consequences resulting from account termination or
                    deletion, whether initiated by you or by us. This includes but is not limited to loss of access to the
                    Service, loss of unused credits, or loss of data.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed and construed in accordance with the laws of the applicable jurisdiction,
                without regard to its conflict of law provisions. Any legal action or proceeding arising under these
                Terms will be brought exclusively in the courts located in the applicable jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision
                is material, we will provide at least 30 days' notice prior to any new terms taking effect. What
                constitutes a material change will be determined at our sole discretion. By continuing to access or use
                our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Severability</h2>
              <p className="text-muted-foreground">
                If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed
                and interpreted to accomplish the objectives of such provision to the greatest extent possible under
                applicable law and the remaining provisions will continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please review the source code at the repository
                link provided above or contact us through the contact information available on our platform.
              </p>
            </section>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm font-semibold mb-2">Important Notice:</p>
              <p className="text-sm text-muted-foreground">
                By using this Service, you acknowledge that you have read, understood, and agree to be bound by these
                Terms of Service. You further acknowledge that the Service is provided without warranty and that you
                assume all risks associated with using AI-generated content. You can verify our data handling practices
                by reviewing the open-source code.
              </p>
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
