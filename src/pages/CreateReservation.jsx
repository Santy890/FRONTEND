import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../config/api.json"

export default function CreateReservation() {
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

    const weekDays = [
        "domingo", 
        "lunes", 
        "martes", 
        "miercoles", 
        "jueves", 
        "viernes", 
        "sabado"
    ];


    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [date, setDate] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [loading, setLoading] = useState(false);

    const userId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");

    const obtainDay = (date) =>{
        const dateConverted = new Date(date);
        
        if (isNaN(dateConverted)) {
            throw new Error("Formato de fecha inválido");
        }
        
        const day = dateConverted.getDay(); 
        return weekDays[day+1]; 
    }

    useEffect(() => {
        if (!token) {
            toast.error("Debes iniciar sesión como cliente para hacer una reserva.", confToast);
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
                    toast.error(body.message, confToast);
                }
            } catch (error) {
                toast.error(`Error al obtener los servicios: ${error.message}`, confToast);
            }
        };

        fetchServices();
    }, [token]);

    const fetchSchedules = async () => {
        if (!date) return;
        try {
            const day = obtainDay(date);
            const url = `${api.apiURL}/schedule/day/${day}`;

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
                toast.error(body.message, confToast);
            }
        } catch (error) {
            toast.error(`Error al obtener los horarios disponibles: ${error.message}` , confToast);
        }
    };

    const handleReservation = async () => {
        if (!selectedService || !date || !selectedSchedule) {
            toast.error("Por favor, completa todos los campos", confToast);
            return;
        }
        const url = `${api.apiURL}/reserv/create`;
        const body = {data:{
            id_customer: userId,
            id_service: selectedService,
            id_schedule: selectedSchedule,
            date,
        }};

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
                toast.success("Reserva realizada con éxito", confToast);
            } else {
                toast.error(`Error: ${responseBody.message}`, confToast);
            }
        } catch (error) {
            toast.error("Error al realizar la reserva:", error.message, confToast);
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
                    {schedules.map((schedule) => (
                        <option key={schedule.id_schedule} value={schedule.id_schedule}>
                            {schedule.start_hour}
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
