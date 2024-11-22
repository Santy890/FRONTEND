import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../config/api.json"

export default function Login(){
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

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const isValidPassword = (password) => {
        return password.length >= 7 && /\d/.test(password) && /[a-z]/.test(password);
    };



    const submitHandler = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            toast.error('Por favor, ingresa un correo electrónico válido.', confToast);
            return;
        }

        if (!isValidPassword(password)) {
            toast.error('La contraseña debe tener al menos 7 caracteres, al menos 1 dígito y al menos una mayúscula', confToast);
            return;
        }

        const usuario = {data:{
            email: email,
            pass: password
        }};

        const parametros = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': sessionStorage.getItem('token')
            },
            body: JSON.stringify(usuario)
        }

        const url = `${api.apiURL}/user/login`;
        try {
            debugger
            const res = await fetch(url, parametros);
            const body = await res.json();

            if (res.ok) {
                sessionStorage.setItem('token', body.credentials);
                sessionStorage.setItem('username', body.data.name);
                sessionStorage.setItem('email', body.data.email);
                sessionStorage.setItem('id', body.data.id);
                sessionStorage.setItem('role', body.data.role);

                console.log(sessionStorage.getItem('token'))
                toast.success(`Bienvenido ${body.data.name} (${body.data.role})`, confToast);
                navigate("/");
            } else {
                toast.error(body.message, confToast);
            }
        } catch (error) {
            toast.error(error.message, confToast);

        }

    }

    return (
        <>
            <div className="container-fluid d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                paddingTop: '70px',
            }}
            >
            <div className="row w-100 justify-content-center">
                <div
                className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5"
                style={{
                    maxWidth: '100%', // Aseguramos que ocupe todo el espacio disponible
                    minWidth: '300px', // No se hace más pequeño de este tamaño
                }}
                >
                <div className="card shadow-lg border-0 rounded-3">
                    <div className="card-body p-4">
                    <h2 className="text-center text-black mb-4">Iniciar Sesión</h2>
                    <form onSubmit={submitHandler}>
                        <div className="mb-3">
                        <label htmlFor="email" className="form-label text-white">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Ingrese su correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        </div>
                        <div className="mb-3">
                        <label htmlFor="password" className="form-label text-white">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg w-100">
                        Iniciar Sesión
                        </button>
                    </form>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </>
    );
    };
