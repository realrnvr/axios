import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../../pages/home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};
