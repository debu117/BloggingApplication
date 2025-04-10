import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/**
 * This component protects routes based on auth status.
 * @param {ReactNode} children - The nested component to render.
 * @param {boolean} authentication - Whether route requires auth or not.
 */
export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const isLoggedIn = useSelector((state) => state.auth.status); // true / false

  useEffect(() => {
    // Redirection logic
    if (authentication && !isLoggedIn) {
      // Route requires auth but user not logged in
      navigate("/login");
    } else if (!authentication && isLoggedIn) {
      // Route should be accessed only when logged out
      navigate("/");
    }

    setLoading(false);
  }, [authentication, isLoggedIn, navigate]);

  return loading ? (
    <div className="text-center py-10 text-lg font-semibold">Loading...</div>
  ) : (
    <>{children}</>
  );
}
