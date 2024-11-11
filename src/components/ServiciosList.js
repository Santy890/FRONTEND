import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const ServiciosList = () => {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    // Llama al endpoint para obtener la lista de servicios
    const fetchServicios = async () => {
      try {
        const response = await api.get('/servicios'); // Endpoint de servicios
        setServicios(response.data);
      } catch (error) {
        console.error('Error al cargar los servicios:', error);
      }
    };

    fetchServicios();
  }, []);

  return (
    <div>
      <h2>Servicios Disponibles</h2>
      <ul>
        {servicios.map((servicio) => (
          <li key={servicio.id}>{servicio.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default ServiciosList;
