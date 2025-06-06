
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import{
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from './store/store.jsx'


import Login from './Pages/Login.jsx';
import Signup from './Pages/Signup.jsx';
import Home from './Pages/Home.jsx';
import ProjectDetails from './Pages/ProjectDetails.jsx';
import UserAuth from './common/UserAuth.jsx';
import PageNotFound from './Pages/PageNotFound.jsx';

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"",
        element:<UserAuth><Home/></UserAuth>
      },
      {
        path:"login",
        element:<Login/>
      },
      {
        path:"signup",
        element:<Signup/>
      },
      {
        path:"project/:id",
        element:<ProjectDetails/>
      },
      {
        path:"*",
        element:<PageNotFound/>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
