const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

export const initializeGoogleSignIn = (callback) => {
  if (window.google && window.google.accounts) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: true
    });
  }
};

export const renderGoogleSignInButton = (elementId) => {
  if (window.google && window.google.accounts) {
    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      { 
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: '100%'
      }
    );
  }
}; 