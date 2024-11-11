import React, { useState } from 'react';
import api from '../api/axiosConfig';

const AgendarTurno = () => {
  const [servicio, setServicio] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/turnos', {
        servicio,
        fecha,
        hora,
      });
      setMensaje('Turno agendado con éxito');
      setServicio('');
      setFecha('');
      setHora('');
    } catch (error) {
      console.error('Error al agendar turno:', error);
      setMensaje('Hubo un error al agendar el turno');
    }
  };

  return (
    <div>
      <h2>Agendar un Turno</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Servicio:
          <input
            type="text"
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
            required
          />
        </label>
        <label>
          Fecha:
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </label>
        <label>
          Hora:
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />
        </label>
        <button type="submit">Agendar Turno</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default AgendarTurno;
