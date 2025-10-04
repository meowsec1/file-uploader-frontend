import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRedirectIfAuthenticated(checkUrl, redirectTo) {
  const navigate = useNavigate();
  const fullUrl = `${import.meta.env.VITE_DEV_API_URL}${checkUrl}`

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(fullUrl, { credentials: 'include' });
        const data = await response.json();
        console.log("Data", data)

        if (data.authenticated) {
          // redirect user
          navigate(redirectTo, { replace: true });
        }

      } catch (err) {
        console.error("Error checking auth:", err);
      }
    }

    checkAuth();
  }, [checkUrl, redirectTo, navigate, fullUrl]);
}
