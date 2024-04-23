import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import Header from "../components/Header";
import Sidebar, { SidebarItem } from "../components/Sidebar";
import DashboardIcon from '../assets/dashboard.png'
import { useState } from 'react';
import { Link } from 'react-router-dom';

const RutaProtegida = () => {
    const { auth, cargando, cerrarSesionAuth } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {
                auth.id ? (
                    <div className='bg-gray-100'>
                        <Header
                            cerrarSesionAuth={cerrarSesionAuth}
                            auth={auth}
                        />

                        <div className='flex md:min-h-screen'>
                            <Sidebar>
                                <Link to="/dashboard">
                                    <SidebarItem icon={<img src={DashboardIcon} alt="Inventario" width={20} />} text='Inventario' />
                                </Link>
                                <SidebarItem icon={<img src={DashboardIcon} alt="Sistema de compras" width={20} />} text='Sistema de compras'/>
                                <Link to="/dashboard/cajas">
                                    <SidebarItem icon={<img src={DashboardIcon} alt="Cajas" width={20} />} text='Cajas' />
                                </Link>
                                <SidebarItem icon={<img src={DashboardIcon} alt="Sistema de ventas" width={20} />} text='Sistema de ventas' />
                                <Link to="/dashboard/reportes">
                                    <SidebarItem icon={<img src={DashboardIcon} alt="Reportes" width={20} />} text='Reportes' />
                                </Link>
                                <SidebarItem icon={<img src={DashboardIcon} alt="Parámetros" width={20} />} text='Parámetros' />
                                <SidebarItem icon={<img src={DashboardIcon} alt="Utilidades" width={20} />} text='Utilidades' />
                            </Sidebar>

                            <main className='p-3 flex-1 '>
                                <Outlet />
                            </main>
                        </div>
                    </div>

                ) : <Navigate to="/login" />}
        </>
    )
}

export default RutaProtegida