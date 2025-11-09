// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://8b351bc8e265f3b5622e47402b86a3a9@o4510322424741888.ingest.de.sentry.io/4510322426183760",

  // PRIVACY: No integrations that could capture user input
  // Session replay is DISABLED to prevent recording user text input
  integrations: [],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // PRIVACY: Disable logs - they may contain sensitive user input
  enableLogs: false,

  // PRIVACY: Session replay is completely disabled
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // PRIVACY: Never send user PII (Personally Identifiable Information)
  sendDefaultPii: false,

  // PRIVACY: Scrub all sensitive data before sending to Sentry
  beforeSend(event, hint) {
    // Remove any breadcrumbs that might contain user input
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
        // Remove any data that might contain user input
        if (breadcrumb.data) {
          delete breadcrumb.data.value;
          delete breadcrumb.data.text;
          delete breadcrumb.data.data;
        }
        return breadcrumb;
      });
    }

    // Remove request data that might contain user input
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      delete event.request.headers;
    }

    // Remove context data that might contain sensitive information
    if (event.contexts) {
      delete event.contexts.device;
      delete event.contexts.browser;
    }

    // Remove any extra data
    delete event.extra;

    // Remove user information
    delete event.user;

    return event;
  },

  // PRIVACY: Scrub sensitive data from breadcrumbs
  beforeBreadcrumb(breadcrumb, hint) {
    // Completely ignore input events - they may contain user text
    if (breadcrumb.category === 'ui.input' || breadcrumb.category === 'ui.change') {
      return null;
    }

    // Remove data from clicks that might contain sensitive info
    if (breadcrumb.category === 'ui.click' && breadcrumb.data) {
      delete breadcrumb.data;
    }

    // Remove any message that might contain user data
    if (breadcrumb.message && breadcrumb.message.length > 100) {
      breadcrumb.message = breadcrumb.message.substring(0, 100) + '... [truncated for privacy]';
    }

    return breadcrumb;
  }
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;