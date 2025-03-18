import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

const GoogleAuth = () => {
  const handleSuccess = (response: { credential: string }) => {
    const token = response.credential
    const decoded = jwtDecode(token)
    console.log("User Info:", decoded)
  }

  const handleFailure = (error: Error) => {
    console.error("Google Login Failed", error)
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div>
        <GoogleLogin onSuccess={handleSuccess} onError={() => handleFailure} />
        <button onClick={() => googleLogout()}>Logout</button>
      </div>
    </GoogleOAuthProvider>
  )
}

export default GoogleAuth
