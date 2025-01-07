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
import { checkAuthLoader } from './util/auth';

import { PrimeReactProvider } from "primereact/api";
import ErrorPage from './pages/Error';
import EducationPage from './pages/Education';
import EditEducationPage from './pages/EditEducation';
import JobOfferPage from './pages/JobOffer';
import EditJobOfferPage from './pages/EditJobOffer';




const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'root',
    children: [
      {index: true, element: <HomePage />},
      {path: 'about', element: <AboutPage />},
      {
        path: 'login',
        children: [
          {path: 'user', element: <LoginPage type='User'/>},
          {path: 'company', element: <LoginPage type='Company'/>}
        ]
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
            {path: 'job/:jobId', element: <JobOfferPage />},
            {path: 'job/add', element: <JobOfferPage />},
            {path: 'job/edit/:jobId', element: <EditJobOfferPage />},

            {path: 'edit', element: <EditUserProfilePage />},
            {path: ':id', element: <ProfilePage />},
        ]
      },
    ]
  },
]);




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
