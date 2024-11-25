import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './pages/Root';

import HomePage from './pages/Home';
import AboutPage from './pages/About';
import LoginPage from './pages/Login';
import RegisterCompanyPage from './pages/RegisterCompany';
import RegisterUserPage from './pages/RegisterUser';
import ProfilePage from './pages/Profile';
import EditUserProfilePage from './pages/EditUserProfile';
import { checkAuthLoader } from './util/auth';





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
        element: <EditUserProfilePage />
      },
    ]
  },
]);




function App() {
  return <RouterProvider router={router} />;
}

export default App;
