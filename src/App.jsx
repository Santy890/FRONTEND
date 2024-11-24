import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import React from 'react';
import Login from "./pages/Login";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import NotFound from './pages/NotFound';
import Service from './pages/Services';
import UserReservations from './pages/UserReservations';
import CreateReservation from "./pages/CreateReservation";
import ProfessionalReservation from './pages/ProfessionalReservation';


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
                    <Route path="/create/reservation" element={<CreateReservation/>} />
                    <Route path="/manage/reservations" element={<ProfessionalReservation/>} />




                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    </>
  );
}

export default App;
