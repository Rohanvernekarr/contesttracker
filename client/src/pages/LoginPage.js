import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadGoogleScript, initializeGoogleSignIn, renderGoogleSignInButton } from '../utils/googleAuth';

const LoginPage = () => {
  const [error, setError] = useState('');
  const { googleLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeGoogle = async () => {
      try {
        await loadGoogleScript();
        initializeGoogleSignIn(handleGoogleCallback);
        renderGoogleSignInButton('google-sign-in-button');
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        setError('Failed to initialize Google Sign-In. Please try again.');
      }
    };

    initializeGoogle();
  }, []);

  const handleGoogleCallback = async (response) => {
    try {
      const result = await googleLogin(response.credential);
      if (result.success) {
        // Always navigate to home page after successful login
        navigate('/', { replace: true });
      } else {
        setError(result.error || 'Failed to sign in with Google');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      setError('An error occurred during Google sign-in');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Login Required</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please sign in with your Google account to access this page
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError('')}
              className="absolute top-0 right-0 p-4"
            >
              <svg className="h-4 w-4 fill-current" role="button" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        <div className="flex flex-col items-center text-center space-y-4">
          <div id="google-sign-in-button" className="w-full"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 