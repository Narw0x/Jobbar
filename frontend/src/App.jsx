import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './pages/Root';
import { tokenLoader } from './util/auth';

import HomePage from './pages/Home';
import AboutPage from './pages/About';




const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <div>Not Found</div>,
    id: 'root',
    loader: tokenLoader,
    children: [
      {index: true, element: <HomePage />},
      {path: 'about', element: <AboutPage />},
      {path: 'login/user', element: <div>Login</div>},
      {path: 'login/company', element: <div>Login</div>},
      {path: 'register/user', element: <div>Register</div>},
      {path: 'register/company', element: <div>Register</div>},
    ]
  },
]);




function App() {
  return <RouterProvider router={router} />;
}

export default App;
