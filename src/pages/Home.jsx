// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container-fluid" style={{ backgroundColor: '#FFBF00', minHeight: '100vh' }}>
      <div className="row justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="col-12 text-center">
          <h1 className="display-4 text-white">¡Bienvenido a la Peluquería!</h1>
          <p className="lead text-white mb-4">
            Ofrecemos los mejores servicios para tu cuidado y bienestar.
          </p>
          <Link to="/services" className="btn btn-primary btn-lg">
            Servicios
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
