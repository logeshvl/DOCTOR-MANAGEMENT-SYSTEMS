import { Navigate, useRoutes } from 'react-router-dom';
import DashboardAppPage from './pages/DashboardAppPage';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import PrivateRoute from './privateRoute';
import LeftSidebar from './layouts/dashboard/leftNavigation/leftSidebar';
import DoctorLoginPage from './pages/DoctorLogin';
import DoctorRegister from './pages/DoctorRegister';
import DoctorAppointment from './pages/doctorAppointment/doctor-appointment';
import AllAppointment from './pages/allAppointment/allAppointment';
import CancelAppointment from './pages/cancel-appointment/cancel-appointment';
import ApprovedAppointment from './pages/approved-appointment/approved-appointment';
import NewAppointment from './pages/new-appointment/new-appointment';
import ViewAllAppointment from './pages/new-appointment/view-appointments';
import AppViewAllAppointment from './pages/approved-appointment/viewapprovedapointment';
import AdminPage from './pages/Adminpage/adminpanel';
import CompledtedAppointment from './pages/completed-appointment/completed-appointment';
 
export default function Router(props) {
  const routes = useRoutes([
    {
      path: '/',
      element: <LeftSidebar />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        {
          path: 'dashboard',
          element: (
           <PrivateRoute>
              <DashboardAppPage />
           </PrivateRoute>
          ),
        },
        {
          path: 'all-appointment',
          element: (
           <PrivateRoute>
              <AllAppointment />
           </PrivateRoute>
          ),
        },
        {
          path: 'cancel-appointment',
          element: (
           <PrivateRoute>
              <CancelAppointment />
           </PrivateRoute>
          ),
        },
        {
          path: 'new-appointment',
          element: (
           <PrivateRoute>
              <NewAppointment />
           </PrivateRoute>
          ),
        },
        {
          path: 'new-appointment/view',
          element: (
           <PrivateRoute>
              <ViewAllAppointment />
           </PrivateRoute>
          ),
        },
        {
          path: 'approved-appointment',
          element: (
           <PrivateRoute>
              <ApprovedAppointment />
           </PrivateRoute>
          ),
        },
        {
          path: 'approved-appointment/view',
          element: (
           <PrivateRoute>
              <AppViewAllAppointment />
           </PrivateRoute>
          ),
        },
        {
          path: 'completed-appointment',
          element: (
           <PrivateRoute>
              <CompledtedAppointment/>
           </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'doctor-login',
      element: <DoctorLoginPage />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: 'doctor-appointment',
      element: <DoctorAppointment />,
    },
    {
      path: 'doctor-register',
      element: <DoctorRegister />,
    },
    {
      path: 'admin-page',
      element: <AdminPage />,
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ]);

  return routes;
}
