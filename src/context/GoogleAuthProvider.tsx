import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';

const GoogleLoginButton: React.FC = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded: { name: string; email: string; picture: string } = jwtDecode(credentialResponse.credential);
      console.log('Login Success:', decoded);
      // You can store the user data in state or context for further use
    } else {
      console.error('No credential found in the response');
    }
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;