import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './pages/Root';
import { tokenLoader } from './util/auth';
import { AuthProvider } from './store/AuthContext';

import HomePage from './pages/Home';
import AboutPage from './pages/About';
import Login from './pages/Login';
import RegisterCompany from './pages/RegisterCompany';
import RegisterUser from './pages/RegisterUser';
import UserProfile from './pages/UserProfile';
import CompanyProfile from './pages/CompanyProfile';



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
          {path: 'user', element: <Login type='User'/>},
          {path: 'company', element: <Login type='Company'/>}
        ]
      },
      {
        path: 'register',
        children: [
          {path: 'user', element: <RegisterUser />},
          {path: 'company', element: <RegisterCompany/>}
        ]
      },
      {
        path: 'profile',
        children: [
          {path: 'user', element: <UserProfile />},
          {path: 'company', element: <CompanyProfile />}
      ]},
    ]
  },
]);




function App() {
  return <AuthProvider><RouterProvider router={router} /></AuthProvider>;
}

export default App;
