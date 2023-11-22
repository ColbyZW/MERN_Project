import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainPage from './pages/MainPage.js';
import Registration from './pages/Registration';
import CreateJob from './pages/CreateJob';
import LancelotNav from './components/LancelotNav';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import JobList from './pages/JobList';
import Job from './pages/Job';
import ProfilePage from './pages/ProfilePage';

// In this router we specify the paths that are available on the website
// like /login, /createPost, etc
// We can then tell React to render a specific component/page when that path
// is reached on the browser
const router = createBrowserRouter([
  {
    path: "*",
    element: <MainPage/>
  },
  {
    path: "/register",
    element: <Registration/>
  },
  {
    path: "home",
    element: <LancelotNav/>,
    children: [
      {
        index: true,
        element: <JobList/>
      },
      {
        path: "job/:id",
        element: <Job/>
      },
      {
        path: "newJob",
        element: <CreateJob/>
      },
      {
        path: "profile",
        element: <ProfilePage/>


      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
