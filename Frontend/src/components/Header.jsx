import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import { Skeleton } from "primereact/skeleton";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import Menu from '../assets/align-center-svgrepo-com.svg';
import Cerrar from '../assets/close-ellipse-svgrepo-com.svg'

const Header = ({ cerrarSesionAuth, auth }) => {

    const [empresa, setEmpresa] = useState({});
    const [navbar, setNavbar] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        const cargarEmpresa = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const response = await clienteAxios.get('/empresa', config);
                if (!response) {
                    throw new Error('Error al cargar la empresa');
                }

                const { data } = response;
                setEmpresa(data[0]);
            } catch (error) {
                throw new Error('Error al cargar la empresa');
            }
        }
        const dimensionDispositivo = async () => {
            if (window.innerWidth < 640) {
                setNavbar(!navbar);
            }
        }
        cargarEmpresa();
        dimensionDispositivo();
    }, []);


    // Mostrar Dialog
    const handleCerrarSesionClick = () => {
        setShowDialog(true);
    };

    // Cerrar Sesión (Borrar token y auth del localStorage)
    const handleCerrarSesion = () => {
        cerrarSesionAuth();
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
        setShowDialog(false);
    };

    // Footer del Dialog
    const renderFooter = (name) => {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
                <Button label="Sí" icon="pi pi-check" onClick={handleCerrarSesion} autoFocus />
            </div>
        );
    }

    return (
        <div>
            <nav className="w-full bg-white">
                <div className="justify-between px-4 mx-auto  md:items-center md:flex md:px-8 ">
                    <div>
                        <div className="flex items-center justify-between py-3 md:py-5 md:block">
                            {/* LOGO */}
                            <Link href="/">
                                <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0 items-center">
                                    {empresa.Id ? empresa.NombreComercial : <Skeleton width="18rem" height="5rem"></Skeleton>}
                                </h2>
                            </Link>
                            {/* HAMBURGER BUTTON FOR MOBILE */}
                            <div className="md:hidden">
                                <button
                                    className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                                    onClick={() => setNavbar(!navbar)}
                                >
                                    {navbar ? (
                                        <img src={Cerrar} width={35} height={35} alt="logo" />
                                    ) : (
                                        <img
                                            src={Menu}
                                            width={35}
                                            height={35}
                                            alt="logo"
                                            className="focus:border-none active:border-none"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div
                            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? 'p-12 md:p-0 block' : 'hidden'
                                }`}
                        >
                            {
                                auth.esAdmin ? (
                                    <ul className="h-screen md:h-auto items-center justify-center md:flex ">
                                        <li className="pb-6 text-xl text-blue py-2 px-6 text-center  border-b-2 md:border-b-0 hover:bg-sky-400 hover:text-white transition-colors duration-300 rounded-lg">
                                            <Link
                                                to="/dashboard/pedidos"
                                                className='font-bold uppercase'
                                                onClick={() => setNavbar(!navbar)}
                                            >Pedidos</Link>
                                        </li>
                                        <li className="pb-6 text-xl text-blue py-2 px-6 text-center  border-b-2 md:border-b-0 hover:bg-sky-400 hover:text-white transition-colors duration-300 rounded-lg">
                                            <Link
                                                to="/dashboard/vendedores"
                                                className='font-bold uppercase'
                                                onClick={() => setNavbar(!navbar)}
                                            >Vendedores</Link>
                                        </li>
                                        <li className="pb-6 text-xl text-blue py-2 px-6 text-center  border-b-2 md:border-b-0 hover:bg-sky-400 hover:text-white transition-colors duration-300 rounded-lg">
                                            <Link
                                                to="/dashboard/clientes"
                                                className='font-bold uppercase'
                                                onClick={() => setNavbar(!navbar)}
                                            >Clientes</Link>
                                        </li>
                                        <li className="pb-6 text-xl text-blue py-2 px-6 text-center  border-b-2 md:border-b-0">
                                            <button
                                                type="button"
                                                className='text-blue text-sm text-white bg-sky-600 p-3 rounded-lg uppercase font-bold'
                                                onClick={handleCerrarSesionClick}
                                            >Cerrar Sesión</button>
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="h-screen md:h-auto items-center justify-center md:flex ">
                                        <li className="pb-6 text-xl text-blue py-2 px-6 text-center  border-b-2 md:border-b-0">
                                            <Link
                                                to="/dashboard"
                                                className='font-bold uppercase'
                                                onClick={() => setNavbar(!navbar)}
                                            >Inventario</Link>
                                        </li>
                                        <li className="pb-6 text-xl text-blue py-2 px-6 text-center  border-b-2 md:border-b-0">
                                            <button
                                                type="button"
                                                className='text-blue text-sm text-white bg-sky-600 p-3 rounded-lg uppercase font-bold'
                                                onClick={handleCerrarSesionClick}
                                            >Cerrar Sesión</button>
                                        </li>
                                    </ul>
                                )
                            }
                            <Dialog header="Confirmación" visible={showDialog} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} onHide={() => setShowDialog(false)}>
                                ¿Estás seguro de que quieres cerrar sesión? Todos los cambios no guardados se perderán.
                            </Dialog>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}


export default Header