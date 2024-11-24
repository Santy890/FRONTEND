import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Menu() {
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [role, setRole] = useState(""); // Estado para almacenar el rol del usuario

    useEffect(() => {
        const t = sessionStorage.getItem("token");
        const r = sessionStorage.getItem("role"); // Obtener el rol del sessionStorage
        if (t !== token) {
            setToken(t); // Actualiza el token al último disponible
        }
        if (r !== role) {
            setRole(r); // Actualiza el rol al último disponible
        }
    }); // Agregamos dependencias para evitar renders innecesarios

    function logout() {
        sessionStorage.clear(); // Limpia todos los datos del sessionStorage
        setToken("");
        setRole("");
        navigate("/"); // Redirige al usuario al inicio
    }

    const isLoggedIn = token !== "" && token !== null;

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
            <div className="container-fluid">
                {/* Logo y botón para pantallas pequeñas */}
                <Link className="navbar-brand" to="/">
                    Peluquería
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Contenido del menú */}
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Inicio
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/services">
                                Servicios
                            </Link>
                        </li>

                        {isLoggedIn && role === "customer" && (
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
                                    <li>
                                        <Link className="dropdown-item" to="/create/reservation">
                                            Hacer reserva
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/reservations">
                                            Mis reservas
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        )}

                        {isLoggedIn && role === "professional" && (
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
                                    <li>
                                        <Link className="dropdown-item" to="/manage/reservations">
                                            Administrar reservas
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>

                    {/* Botones de sesión */}
                    <ul className="navbar-nav ms-auto">
                        {isLoggedIn ? (
                            <li className="nav-item">
                                <button
                                    onClick={logout}
                                    className="btn btn-outline-danger btn-sm"
                                >
                                    Cerrar Sesión
                                </button>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">
                                    <button className="btn btn-outline-primary btn-sm">
                                        Login
                                    </button>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
