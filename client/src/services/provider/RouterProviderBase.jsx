import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "@/pages/home/Home";
import ProtectedRoute from "../gaurd/ProtectedRoute";

const Call = lazy(() => import("@/pages/call/Call"));
const Chat_Layout = lazy(() => import("@/pages/chat/Chat"));
const CreateMeet = lazy(() => import("@/pages/createMeet/CreateMeet"));
const Upcoming = lazy(() => import("@/pages/upcoming/Upcoming"));
const Ended = lazy(() => import("@/pages/ended/Ended"));

const LoadingFallback = () => <div>Loading...</div>;

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <ProtectedRoute element={<CreateMeet />} />
    ),
  },
  {
    path: "/onboarding",
    element: <Home />, 
  },
  {
    path: "/chat",
    element: (
      <SuspenseWrapper>
        <Chat_Layout />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/meeting/:callId",
    element: (
      <SuspenseWrapper>
        <Call />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/upcoming",
    element: (
      <SuspenseWrapper>
        <Upcoming />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/ended",
    element: (
      <SuspenseWrapper>
        <Ended />
      </SuspenseWrapper>
    ),
  },
]);

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};