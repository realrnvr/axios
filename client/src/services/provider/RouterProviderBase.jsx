import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Hero from "../../pages/hero/Hero";
import Home from "@/pages/home/Home";
import ProtectedRoute from "../gaurd/ProtectedRoute";
import Meet from "@/pages/meet/Meet";
import VideoProvider from "../stream/StreamVideoProvider";
import Call from "@/pages/call/Call";

const router = createBrowserRouter([
  {
    path: "/onboarding",
    element: <Home />,
  },
  {
    path: "/",
    element: <ProtectedRoute element={<Hero />} />,
  },
  {
    path: "/meet",
    element: (
      <ProtectedRoute
        element={
          <VideoProvider>
            <Meet />
          </VideoProvider>
        }
      />
    ),
  },
  {
    path: "/meeting/:callId",
    element: <Call />,
  },
]);

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};
