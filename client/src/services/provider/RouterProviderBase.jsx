import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "@/pages/home/Home";
import ProtectedRoute from "../gaurd/ProtectedRoute";
import Call from "@/pages/call/Call";
import Chat_Layout from "@/pages/chat/Chat";
<<<<<<< HEAD
import CreateMeet from "@/pages/createMeet/CreateMeet";
import Upcoming from "@/pages/upcoming/Upcoming";
=======
import ChatProvider from "../chat/chatProvider";
>>>>>>> 840b6b79dd64515e7c3f7ffd104f21a4deac47ba

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<CreateMeet />} />,
  },
  {
    path: "/onboarding",
    element: <Home />,
  },
  {
<<<<<<< HEAD
    path: "/chat",
    element: <Chat_Layout />,
=======
    path: "/",
    element: <ProtectedRoute element={<Hero />} />,
  },{
    path:"/chat",
    element:(<ProtectedRoute element={<ChatProvider><Chat_Layout/></ChatProvider>}/>)
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
>>>>>>> 840b6b79dd64515e7c3f7ffd104f21a4deac47ba
  },
  {
    path: "/meeting/:callId",
    element: <Call />,
  },
  {
    path: "/upcoming",
    element: <Upcoming />,
  },
]);

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};
