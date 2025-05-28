import { createBrowserRouter, RouterProvider } from "react-router-dom"
import LoginPage from "./page/auth/login"
import RegisterPage from "./page/auth/register"

export default function App() {

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />
    },

    {
      path: "/register",
      element: <RegisterPage />
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

