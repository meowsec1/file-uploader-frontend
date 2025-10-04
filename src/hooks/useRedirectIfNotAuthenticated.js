import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useRedirectIfNotAuthenticated(checkUrl, redirectTo = '/login') {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const fullUrl = `${import.meta.env.VITE_DEV_API_URL}${checkUrl}`;

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(fullUrl, { credentials: 'include' });

        if (!response.ok) {
          navigate(redirectTo, { replace: true });
          return;
        }

        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        console.error("Error checking auth:", err);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [fullUrl, redirectTo, navigate]);

  return { data, isLoading };
}


export default useRedirectIfNotAuthenticated;