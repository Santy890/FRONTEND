import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../config/api.json"

export default function AdminReservations() {
    const [reservations, setReservations] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchReservations = async () => {
            const url = `${api.apiURL}/reserv`; // Endpoint para obtener reservas
            try {
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                });
                const body = await res.json();

                if (res.ok) {
                    setReservations(body);
                } else {
                    console.error(body.message);
                }
            } catch (error) {
                console.error("Error al obtener reservas:", error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchSchedules = async () => {
            const url = `${api.apiURL}/schedules`; // Endpoint para obtener horarios
            try {
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                });
                const body = await res.json();

                if (res.ok) {
                    setSchedules(body);
                } else {
                    console.error(body.message);
                }
            } catch (error) {
                console.error("Error al obtener horarios:", error.message);
            }
        };

        fetchReservations();
        fetchSchedules();
    }, [token]);

    const updateReservation = async (id_reservation, updatedFields) => {
        const url = `${api.apiURL}/reservation/${id_reservation}`;
        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(updatedFields),
            });

            const body = await res.json();

            if (res.ok) {
                alert("Reserva actualizada con éxito.");
                setReservations((prev) =>
                    prev.map((reserva) =>
                        reserva.id_reservation === id_reservation
                            ? { ...reserva, ...updatedFields }
                            : reserva
                    )
                );
            } else {
                alert(`Error: ${body.message}`);
            }
        } catch (error) {
            console.error("Error al actualizar la reserva:", error.message);
        }
    };

    if (loading) {
        return <p>Cargando reservas...</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Administrar Reservas</h1>
            {reservations.length === 0 ? (
                <p className="text-center">No hay reservas para administrar.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Servicio</th>
                            <th>Horario</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reserva) => (
                            <tr key={reserva.id_reservation}>
                                <td>{reserva.id_reservation}</td>
                                <td>{reserva.id_customer}</td>
                                <td>{reserva.id_service}</td>
                                <td>
                                    <select
                                        className="form-select"
                                        value={reserva.id_schedule}
                                        onChange={(e) =>
                                            updateReservation(reserva.id_reservation, {
                                                id_schedule: e.target.value,
                                            })
                                        }
                                    >
                                        {schedules.map((schedule) => (
                                            <option
                                                key={schedule.id_schedule}
                                                value={schedule.id_schedule}
                                            >
                                                {schedule.time}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        className="form-select"
                                        value={reserva.state}
                                        onChange={(e) =>
                                            updateReservation(reserva.id_reservation, {
                                                state: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="RESERVADO">RESERVADO</option>
                                        <option value="FINALIZADO">FINALIZADO</option>
                                        <option value="CANCELADO">CANCELADO</option>
                                    </select>
                                </td>
                                <td>{new Date(reserva.date).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                            updateReservation(reserva.id_reservation, {
                                                state: "CANCELADO",
                                            })
                                        }
                                    >
                                        Cancelar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
