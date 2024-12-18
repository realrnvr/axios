import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../../pages/home/Home";
import Hero from "../../pages/home/Hero";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoute = ({element}) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }
  return element;
};

const router = createBrowserRouter([
  {
    path: "/onboarding",
    element: <Home />,
  },
  {
    path: "/",
    element: <ProtectedRoute element={<Hero />} />,
  },
]);

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};
