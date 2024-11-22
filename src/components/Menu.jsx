import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Menu() {
    const navigate = useNavigate();
    const [token, setToken] = useState("");

    debugger
    useEffect(() => {
        const t = sessionStorage.getItem('token');
        if (t !== token) {
            setToken(t); // Actualiza el token al último disponible
        }
    });

    function logout() {
        sessionStorage.removeItem('token');
        setToken("");
        navigate('/');
    }

    console.log(token)

    if (token !== "" && token !== null) {
        // Menú para usuarios logeados
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/vehiculos">Servicios</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    to="#"
                                >
                                    Reservas
                                </Link>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/clinica">Hacer reserva</Link></li>
                                    <li><Link className="dropdown-item" to="/blog">Mis reservas</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button
                                onClick={logout}
                                className="btn btn-outline-danger btn-sm"
                            >
                                Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    } else {
        // Menú para usuarios no logeados
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/vehiculos">Servicios</Link>
                            </li>
                        </ul>
                    </div>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">
                                <button className="btn btn-outline-primary btn-sm">Login</button>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
