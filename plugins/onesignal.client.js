export default defineNuxtPlugin(() => {
  window.OneSignalDeferred = window.OneSignalDeferred || [];

  const script = document.createElement('script');
  script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
  script.defer = true;
  document.head.appendChild(script);

  window.OneSignalDeferred.push(async (OneSignal) => {
    await OneSignal.init({
      appId: '91b4ed0d-86b1-4baf-8112-2926580a58b6',
      notifyButton: { enable: false }, // pas de bouton flottant
      allowLocalhostAsSecureOrigin: true, // pour le dev local
    });
  });
});