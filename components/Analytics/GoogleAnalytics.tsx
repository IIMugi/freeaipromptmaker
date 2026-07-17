import Script from 'next/script';

const measurementIdPattern = /^G-[A-Z0-9]{4,20}$/;

function measurementId() {
  const candidate = process.env.NEXT_PUBLIC_GA4_ID?.trim();
  return candidate && measurementIdPattern.test(candidate) ? candidate : null;
}

export function GoogleConsentDefaults() {
  if (!measurementId()) return null;

  return (
    <script
      id="google-consent-defaults"
      data-testid="google-consent-defaults"
      dangerouslySetInnerHTML={{ __html: `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
window.gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
});
      ` }}
    />
  );
}

export function GoogleAnalytics() {
  const gaMeasurementId = measurementId();
  if (!gaMeasurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
var analyticsAccepted = false;
try {
  analyticsAccepted = window.localStorage.getItem('site-consent-v2') === 'analytics-accepted';
} catch (error) {}
if (analyticsAccepted) {
  window.gtag('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted'
  });
  window.gtag('js', new Date());
  window.gtag('config', '${gaMeasurementId}', {
    page_title: document.title,
    page_location: window.location.href
  });
}
        `}
      </Script>
    </>
  );
}
