import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "./../config/api.json"

export default function Reservations() {
    const confToast = {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
    }

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            const userId = sessionStorage.getItem("id");

            if (!userId) {
                toast.error("No se encontró el ID del usuario en sessionStorage", confToast);
                setLoading(false);
                return;
            }

            const url = `${api.apiURL}/reserv/customer/${userId}`;
            try {
                debugger
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'authorization': sessionStorage.getItem('token')
                    },
                });
                const body = await res.json();

                if (res.ok) {
                    setReservations(body);
                } else {
                    toast.error(body.message, confToast);
                }
            } catch (error) {
                toast.error(error.message, confToast);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (loading) {
        return <p>Cargando reservas...</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Mis Reservas</h1>
            {reservations.length === 0 ? (
                <p className="text-center">No tienes reservas.</p>
            ) : (
                <div className="row">
                    {console.log(reservations)}
                    {reservations.map((reservation) => (
                        <div className="col-md-6 mb-4" key={reservation.id_reservation}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">Reserva #{reservation.id_reservation}</h5>
                                    <p className="card-text">
                                        <strong>Estado:</strong> {reservation.state}
                                    </p>
                                    <p className="card-text">
                                        <strong>Fecha:</strong>{" "}
                                        {new Date(reservation.date).toLocaleDateString()}
                                    </p>
                                    <p className="card-text">
                                        <strong>Horario ID:</strong> {reservation.id_schedule}
                                    </p>
                                    <p className="card-text">
                                        <strong>Servicio ID:</strong> {reservation.id_service}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
