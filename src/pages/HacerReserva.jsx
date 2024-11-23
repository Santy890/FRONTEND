import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "./../config/api.json"

export default function HacerReserva() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [date, setDate] = useState("");
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [loading, setLoading] = useState(false);

    const api = {
        apiURL: "http://localhost:8080", // Cambiar según la configuración del back
    };

    const userId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            alert("Debes iniciar sesión como cliente para hacer una reserva.");
            return;
        }

        const fetchServices = async () => {
            const url = `${api.apiURL}/service`;
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
                    setServices(body);
                } else {
                    console.error(body.message);
                }
            } catch (error) {
                console.error("Error al obtener los servicios:", error.message);
            }
        };

        fetchServices();
    }, [token]);

    const fetchSchedules = async () => {
        if (!date) return;

        const url = `${api.apiURL}/schedule/available?date=${date}`;
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
                setAvailableSchedules(body);
            } else {
                console.error(body.message);
            }
        } catch (error) {
            console.error("Error al obtener los horarios disponibles:", error.message);
        }
    };

    const handleReservation = async () => {
        if (!selectedService || !date || !selectedSchedule) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const url = `${api.apiURL}/reserv`;
        const body = {
            id_customer: userId,
            id_service: selectedService,
            id_schedule: selectedSchedule,
            date,
        };

        setLoading(true);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(body),
            });

            const responseBody = await res.json();

            if (res.ok) {
                alert("Reserva realizada con éxito.");
            } else {
                alert(`Error: ${responseBody.message}`);
            }
        } catch (error) {
            console.error("Error al realizar la reserva:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Hacer Reserva</h1>

            <div className="mb-3">
                <label htmlFor="service" className="form-label">Seleccionar Servicio</label>
                <select
                    id="service"
                    className="form-select"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                >
                    <option value="">Seleccionar...</option>
                    {services.map((service) => (
                        <option key={service.id_service} value={service.id_service}>
                            {service.name} - ${service.price}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="date" className="form-label">Seleccionar Fecha</label>
                <input
                    type="date"
                    id="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onBlur={fetchSchedules}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="schedule" className="form-label">Seleccionar Horario</label>
                <select
                    id="schedule"
                    className="form-select"
                    value={selectedSchedule}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                >
                    <option value="">Seleccionar...</option>
                    {availableSchedules.map((schedule) => (
                        <option key={schedule.id_schedule} value={schedule.id_schedule}>
                            {schedule.time}
                        </option>
                    ))}
                </select>
            </div>

            <button
                className="btn btn-primary w-100"
                onClick={handleReservation}
                disabled={loading}
            >
                {loading ? "Realizando reserva..." : "Hacer Reserva"}
            </button>
        </div>
    );
}
