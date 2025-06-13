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
import LayoutAdmin from "./components/admin/layout.admin";
import ProtectedRoute from "./components/share/protected-route";
import DashboardPage from "./page/admin/dashboard";
import CompanyPage from "./page/admin/company";
import UserPage from "./page/admin/user";
import JobTabs from "./page/admin/job/job.tabs";
import ViewUpsertJob from "./components/admin/job/upsert.job";
import ResumePage from "./page/admin/resume";
import PermissionPage from "./page/admin/permission";
import RolePage from "./page/admin/role";



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
    ) // khi người dùng đang ở login và register thì không cần gọi để lấy acccount 
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
      path: "/admin",
      element: (<LayoutApp> <LayoutAdmin /></LayoutApp>),
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
        },
        {
          path: "company",
          element:
            <ProtectedRoute>
              <CompanyPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element:
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
        },
        {
          path: "job",
          children: [
            {
              index: true,
              element: (
                <ProtectedRoute>
                  <JobTabs />
                </ProtectedRoute>
              )
            },
            {
              path: "upsert",
              element: (
                <ProtectedRoute>
                  <ViewUpsertJob />
                </ProtectedRoute>
              )
            }
          ]
        },
        {
          path: "resume",
          element:
            <ProtectedRoute>
              <ResumePage />
            </ProtectedRoute>
        },
        {
          path: "permission",
          element:
            <ProtectedRoute>
              <PermissionPage />
            </ProtectedRoute>
        },
        {
          path: "role",
          element:
            <ProtectedRoute>
              <RolePage />
            </ProtectedRoute>
        }
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

