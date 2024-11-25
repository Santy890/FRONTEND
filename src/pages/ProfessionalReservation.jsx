import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../config/api.json";

export default function AdminReservations() {
    const confToast = {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    };

    const weekDays = [
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
    ];

    const obtainDay = (date) => {
        const dateConverted = new Date(date);

        if (isNaN(dateConverted)) {
            throw new Error("Formato de fecha inválido");
        }

        const day = dateConverted.getDay();
        return weekDays[day]; // Retorna el día en español.
    };

    const [reservations, setReservations] = useState([]);
    const [scheduleByDay, setScheduleByDay] = useState({});
    const [loading, setLoading] = useState(true);

    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("id");

    useEffect(() => {
        const fetchReservations = async () => {
            const url = `${api.apiURL}/reserv/pro/${id}`;
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
                    toast.error(body.message, confToast);
                }
            } catch (error) {
                toast.error(`Error al obtener reservas: ${error.message}`, confToast);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [id, token]);

    const fetchSchedulesByDay = async (day) => {
        if (scheduleByDay[day]) return; // Evita solicitudes repetidas.

        const url = `${api.apiURL}/schedule/day/${day}`;
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
                setScheduleByDay((prev) => ({ ...prev, [day]: body }));
            } else {
                toast.error(`Error al obtener horarios para ${day}: ${body.message}`, confToast);
            }
        } catch (error) {
            toast.error(`Error al obtener horarios: ${error.message}`, confToast);
        }
    };

    const updateReservation = async (id_reservation, updatedFields) => {
        const url = `${api.apiURL}/reserv/update/${id_reservation}`;
        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({ data: updatedFields }),
            });

            const body = await res.json();

            if (res.ok) {
                toast.success("Reserva actualizada con éxito", confToast);
                setReservations((prev) =>
                    prev.map((reserva) =>
                        reserva.id_reservation === id_reservation
                            ? { ...reserva, ...updatedFields }
                            : reserva
                    )
                );
            } else {
                toast.error(`Error: ${body.message}`, confToast);
            }
        } catch (error) {
            toast.error(`Error al actualizar la reserva: ${error.message}`, confToast);
        }
    };

    useEffect(() => {
        reservations.forEach((reserva) => {
            const day = obtainDay(reserva.date); // Obtiene el día en español.
            fetchSchedulesByDay(day); // Llama a la función para cargar los horarios si no están ya cargados.
        });
    }, [reservations]); // Se ejecuta cada vez que cambian las reservas.

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
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => {
                            const day = obtainDay(reservation.date); // Obtiene el día en español.
                            const availableSchedules = scheduleByDay[day] || []; // Obtiene los horarios disponibles.

                            return (
                                <tr key={reservation.id_reservation}>
                                    <td>{reservation.id_reservation}</td>
                                    <td>{reservation.customer}</td>
                                    <td>{reservation.service}</td>
                                    <td>
                                        <select
                                            className="form-select"
                                            value={reservation.schedule}
                                            onChange={async (e) =>
                                                updateReservation(reservation.id_reservation, {
                                                    id_schedule: e.target.value
                                                })
                                            }
                                        >
                                            {availableSchedules.length > 0 ? (
                                                availableSchedules.map((schedule) => (
                                                    <option
                                                        key={schedule.id_schedule}
                                                        value={schedule.id_schedule}
                                                    >
                                                        {schedule.start_hour}
                                                    </option>
                                                ))
                                            ) : (
                                                <option>Cargando horarios...</option>
                                            )}
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            className="form-select"
                                            value={reservation.state}
                                            onChange={(e) =>
                                                updateReservation(reservation.id_reservation, {
                                                    state: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="RESERVADO">RESERVADO</option>
                                            <option value="FINALIZADO">FINALIZADO</option>
                                            <option value="CANCELADO">CANCELADO</option>
                                        </select>
                                    </td>
                                    <td>{new Date(reservation.date).toLocaleDateString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
