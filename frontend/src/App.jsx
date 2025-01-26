import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './pages/Root';

import HomePage from './pages/Home';
import AboutPage from './pages/About';
import LoginPage from './pages/Login';
import RegisterCompanyPage from './pages/RegisterCompany';
import RegisterUserPage from './pages/RegisterUser';
import ProfilePage from './pages/Profile';
import EditUserProfilePage from './pages/EditUserProfile';
import ExperiencePage from './pages/Experience';
import EditExperiencePage from './pages/EditExperience';
import { checkAuthLoader, checkCompanyLoader } from './util/auth';
import { checkVerifyTokenLoader } from './util/verify';

import { PrimeReactProvider } from "primereact/api";
import ErrorPage from './pages/Error';
import EducationPage from './pages/Education';
import EditEducationPage from './pages/EditEducation';
import JobOfferPage from './pages/JobOffer';
import EditJobOfferPage from './pages/EditJobOffer';
import ViewJobOfferPage from './pages/ViewJobOffer';
import SearchPage from './pages/Search';
import ManageJobsPage from './pages/ManageJobs';
import ManageJobPage from './pages/ManageJob';
import FavoritePage from './pages/Favorites';

import AdminRootLayout from './pages/AdminRoot';
import AdminLoginPage from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsers';

import { checkAdminLoader } from './util/auth';
import AdminUserEditPage from './pages/AdminUserEdit';
import AdminJobsPage from './pages/AdminJobs';
import AdminJobsEditPage from './pages/AdminJobsEdit';
import AdminReportsPage from './pages/AdminReports';
import AdminReportPage from './pages/AdminReport';
import AdminProfilePage from './pages/AdminProfile';


const userRoutes = {
  path: '/',
  element: <RootLayout />,
  errorElement: <ErrorPage />,
  id: 'root',
  children: [
    {index: true, element: <HomePage />},
    {path: 'about', element: <AboutPage />},
    {path: 'verify/:token', element: <HomePage />, loader: checkVerifyTokenLoader},
    {
      path: 'login',
      element: <LoginPage />
    },
    {
      path: 'register',
      children: [
        {path: 'user', element: <RegisterUserPage />},
        {path: 'company', element: <RegisterCompanyPage />}
      ]
    },
    {
      path: 'profile',
      loader: checkAuthLoader,
      children: [
          {path: 'education/add', element: <EducationPage />},
          {path: 'education/edit/:educationId', element: <EditEducationPage />},
          {path: 'experience/add', element: <ExperiencePage />},
          {path: 'experience/edit/:experienceId', element: <EditExperiencePage />},
          {path: 'job/add', element: <JobOfferPage />},
          {path: 'job/edit/:jobId', element: <EditJobOfferPage />},

          {path: 'edit', element: <EditUserProfilePage />},
          {path: 'favorite', element: <FavoritePage />},
          {path: ':id', element: <ProfilePage />},
      ]
    },
    {
      path: 'job',
      loader: checkAuthLoader,
      children: [
        {path: 'add', element: <JobOfferPage />},
        {path: 'edit/:jobId', element: <EditJobOfferPage />},
        {path: ':jobId', element: <ViewJobOfferPage />},
        {path: 'search', element: <SearchPage />, loader: checkCompanyLoader},
        {path: 'manage', element: <ManageJobsPage />},
        {path: 'manage/:jobId', element: <ManageJobPage />}
      ]
    },
  ]
};

const adminLogin = {
  path: '/admin/login',
  element: <AdminLoginPage />
};

const adminRoutes = {
  path: '/admin',
  element: <AdminRootLayout />,
  errorElement: <ErrorPage />,
  loader: checkAdminLoader,
  id: 'admin',
  children: [
    {
      path: 'dashboard',
      element: <AdminDashboard />,
    },
    {
      path: 'users',
      children: [
        {index: true, element: <AdminUsersPage />},
        {path:':userId', element: <AdminProfilePage />},
        {path: 'edit/:userId', element: <AdminUserEditPage />},
      ]
    },
    {
      path: 'jobs',
      children: [
        {index: true, element: <AdminJobsPage />},
        {path: ':jobId'},
        {path: 'edit/:jobId', element: <AdminJobsEditPage/>},
      ]
    },
    {
      path: 'reports',
      children: [
        {index: true, element: <AdminReportsPage />},
        {path: ':reportId', element: <AdminReportPage />}
      ]
    }
  ]
};




const router = createBrowserRouter([userRoutes, adminLogin, adminRoutes]);




function App() {
  return (
  <PrimeReactProvider
    value={{
      pt: {
        fileupload: {
          chooseIcon: { className: 'mr-2 my-auto justify-center' },
          input: { className: 'hidden' },
          basicButton: { className: 'flex' },
        },
        calendar: {
          input: ({ props }) => ({
            root: {
                className: "shadow-none border border-black bg-white focus:bg-white rounded p-2 my-2 text-lg",
            }
          }),
          month: ({ context }) => ({
            className: "shadow-none rounded-none",
          }),
        },
      },
    }}
  >
    <RouterProvider router={router} />
  </PrimeReactProvider>
  );
}

export default App;
