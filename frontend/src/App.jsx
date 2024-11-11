import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './pages/Root';
import { tokenLoader } from './util/auth';




const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <div>Not Found</div>,
    id: 'root',
    loader: tokenLoader,
    children: [
      {index: true, element: <div>Home</div>},
    ]
  },
]);




function App() {
  return <RouterProvider router={router} />;
}

export default App;
