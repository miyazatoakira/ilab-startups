/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import StartupDetail from "./pages/StartupDetail";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import { AuthProvider } from "./contexts/AuthContext";
import { StartupsProvider } from "./contexts/StartupsContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "startup/:id",
        element: <StartupDetail />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "admin",
        element: <AdminPanel />,
      }
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <StartupsProvider>
        <RouterProvider router={router} />
      </StartupsProvider>
    </AuthProvider>
  );
}
