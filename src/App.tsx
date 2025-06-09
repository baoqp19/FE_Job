import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router-dom"
import LoginPage from "./page/auth/login"
import RegisterPage from "./page/auth/register"
import { useEffect, useRef, useState } from "react";
import Footer from "./components/client/footer.client";
import Header from "./components/client/header.client";
import styles from './styles/app.module.scss';
import NotFound from "./components/share/not.found";
import LayoutApp from "./components/share/layout.app";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { fetchAccount } from "./redux/slice/accountSlice";
import HomePage from "./page/home";
import ClientJobPage from "./page/job";
import ClientJobDetailPage from "./page/job/detail";
import ClientCompanyPage from "./page/company";
import ClientCompanyDetailPage from "./page/company/detail";



const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }

  }, [location]);

  return (
    <div className='layout-app' ref={rootRef}>
      <Header />
      <div className={styles['content-app']}>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      <Footer />
    </div>
  )
}



export default function App() {

  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);

  useEffect(() => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;

    dispatch(fetchAccount())

  }, [])

  const router = createBrowserRouter([

    {
      path: "/",
      element: (<LayoutApp><LayoutClient /></LayoutApp>),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "job", element: <ClientJobPage /> },
        { path: "job/:id", element: <ClientJobDetailPage /> },
        { path: "company", element: <ClientCompanyPage /> },
        { path: "company/:id", element: <ClientCompanyDetailPage /> },

      ]
    },

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

