import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Login from "./pages/Login";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import Service from './pages/Services';
import UserReservations from './pages/UserReservations';


function App() {
  return (
    <>
        <BrowserRouter>
            <div className="container" style={{ backgroundColor: '#FFBF00' }}>
                <Menu />
                <ToastContainer/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/services" element={<Service />} />
                    <Route path="/reservations" element={<UserReservations />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    </>
  );
}

export default App;
