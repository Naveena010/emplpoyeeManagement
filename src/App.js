import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard    from './pages/Dashboard';
import Employees    from './pages/Employees';
import AddEmployee  from './pages/AddEmployee';
import Layout       from './components/Layout';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<PublicRoute><LoginPage/></PublicRoute>}/>
          <Route path="/register" element={<PublicRoute><RegisterPage/></PublicRoute>}/>
          <Route path="/" element={<PrivateRoute><Layout/></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace/>}/>
            <Route path="dashboard"    element={<Dashboard/>}/>
            <Route path="employees"    element={<Employees/>}/>
            <Route path="add-employee" element={<AddEmployee/>}/>
            <Route path="edit-employee/:id" element={<AddEmployee/>}/>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}