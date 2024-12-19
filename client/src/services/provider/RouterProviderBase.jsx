import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Hero from "../../pages/home/Hero";
import Home from "@/pages/home/Home";
import ProtectedRoute from "../gaurd/ProtectedRoute";

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
