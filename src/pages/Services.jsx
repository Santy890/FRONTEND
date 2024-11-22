import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../config/api.json"

export default function Service() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchServices = async () => {
            const url = `${api.apiURL}/service`;
            try {
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const body = await res.json();

                if (res.ok) {
                    setServices(body);
                } else {
                    toast.error(body.message, confToast);
                }
            } catch (error) {
                toast.error(error.message, confToast);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) {
        return <p>Cargando servicios...</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Servicios de la Peluquería</h1>
            {services.length === 0 ? (
                <p className="text-center">No hay servicios disponibles.</p>
            ) : (
                <div className="row">
                    {services.map((service) => (
                        <div className="col-md-4 mb-4" key={service.id_service}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{service.name}</h5>
                                    <p className="card-text">{service.description}</p>
                                    <p className="card-text">
                                        <strong>Precio:</strong> ${service.price}
                                    </p>
                                    <p className="card-text">
                                        <strong>Duración:</strong> {service.duration} horas
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
