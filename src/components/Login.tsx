import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import GoogleLoginButton from "@/context/GoogleAuthProvider";

type User = {
  name: string;
  email: string;
  picture: string;
};

export const Login = () => {
  const [user, setUser] = useState<User | null>(null);

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    //   {!user ? (
    //     <GoogleLogin
    //       onSuccess={(credentialResponse) => {
    //         const decoded = jwtDecode(credentialResponse.credential!) as User;
    //         setUser(decoded);
    //         console.log("User Info:", decoded);
    //       }}
    //       onError={() => console.log("Login Failed")}
    //     />
    //   ) : (
    //     <div className="bg-white p-6 rounded-lg shadow-md text-center">
    //       <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full mx-auto" />
    //       <h3 className="text-lg font-semibold mt-2">{user.name}</h3>
    //       <p className="text-gray-600">{user.email}</p>
    //       <button
    //         onClick={() => {
    //           googleLogout();
    //           setUser(null);
    //         }}
    //         className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   )}
    // </div>
    <div>
    <h2>Google Login</h2>
    <GoogleLoginButton />
  </div>
  );
};
