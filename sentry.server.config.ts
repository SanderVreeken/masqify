// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://8b351bc8e265f3b5622e47402b86a3a9@o4510322424741888.ingest.de.sentry.io/4510322426183760",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // PRIVACY: Disable logs - they may contain sensitive user input
  enableLogs: false,

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
          delete breadcrumb.data.body;
        }
        return breadcrumb;
      });
    }

    // Remove request data that might contain user input
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      delete event.request.headers;
      // Keep URL but remove query parameters that might contain sensitive data
      if (event.request.url) {
        try {
          const url = new URL(event.request.url);
          url.search = ''; // Remove query parameters
          event.request.url = url.toString();
        } catch (e) {
          // If URL parsing fails, just keep the pathname
          event.request.url = event.request.url?.split('?')[0];
        }
      }
    }

    // Remove context data that might contain sensitive information
    if (event.contexts) {
      delete event.contexts.device;
      delete event.contexts.browser;
    }

    // Remove any extra data that might contain user input
    delete event.extra;

    // Remove user information
    delete event.user;

    // Sanitize exception values
    if (event.exception?.values) {
      event.exception.values = event.exception.values.map(exception => {
        // Keep the error type but sanitize the message
        if (exception.value && exception.value.length > 200) {
          exception.value = exception.value.substring(0, 200) + '... [truncated for privacy]';
        }
        // PRIVACY: Remove local variables from stack frames
        if (exception.stacktrace?.frames) {
          exception.stacktrace.frames = exception.stacktrace.frames.map(frame => {
            if (frame.vars) delete frame.vars;
            return frame;
          });
        }
        return exception;
      });
    }

    return event;
  },

  // PRIVACY: Sanitize performance transaction names to prevent data leakage
  beforeSendTransaction(transaction) {
    // Remove query parameters from transaction names
    if (transaction.transaction && transaction.transaction.includes('?')) {
      transaction.transaction = transaction.transaction.split('?')[0];
    }

    // Remove any tags that might contain sensitive data
    if (transaction.tags) {
      delete transaction.tags.url;
      delete transaction.tags.user;
    }

    // Remove request data from transactions
    if (transaction.request) {
      delete transaction.request.data;
      delete transaction.request.cookies;
      delete transaction.request.headers;
      // Keep URL but remove query parameters
      if (transaction.request.url) {
        transaction.request.url = transaction.request.url.split('?')[0];
      }
    }

    return transaction;
  },

  // PRIVACY: Scrub sensitive data from breadcrumbs
  beforeBreadcrumb(breadcrumb, hint) {
    // Remove data from HTTP requests that might contain user input
    if (breadcrumb.category === 'http' && breadcrumb.data) {
      delete breadcrumb.data.body;
      delete breadcrumb.data.request;
      delete breadcrumb.data.response;
    }

    // Remove console logs that might contain sensitive data
    if (breadcrumb.category === 'console' && breadcrumb.message) {
      if (breadcrumb.message.length > 100) {
        breadcrumb.message = breadcrumb.message.substring(0, 100) + '... [truncated for privacy]';
      }
    }

    return breadcrumb;
  }
});
