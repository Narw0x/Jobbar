import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './pages/Root';

import HomePage from './pages/Home';
import AboutPage from './pages/About';
import LoginPage from './pages/Login';
import RegisterCompanyPage from './pages/RegisterCompany';
import RegisterUserPage from './pages/RegisterUser';
import ProfilePage from './pages/Profile';
import EditUserProfilePage from './pages/EditUserProfile';
import EditExperiencePage from './pages/EditExperience';
import { checkAuthLoader } from './util/auth';

import { PrimeReactProvider } from "primereact/api";




const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <div>Not Found jdakjsandkjasndkjasnkd</div>,
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
        path: 'profile/:id',
        loader: checkAuthLoader,
        element: <ProfilePage />,
      },
      {
        path: 'profile/:id/edit',
        loader: checkAuthLoader,
        element: <EditUserProfilePage />
      },
      {
        path: 'profile/:id/experience/edit',
        loader: checkAuthLoader,
        element: <EditExperiencePage />
      }
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
      },
    }}
  >
    <RouterProvider router={router} />
  </PrimeReactProvider>
  );
}

export default App;
