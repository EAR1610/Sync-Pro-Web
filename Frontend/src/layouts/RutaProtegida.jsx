import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import Header from "../components/Header";
import Sidebar, { SidebarItem } from "../components/Sidebar";
import DashboardIcon from '../assets/dashboard.png'

const RutaProtegida = () => {
    const { auth, cargando, cerrarSesionAuth } = useAuth();    
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
                                <SidebarItem 
                                    icon={<img src={DashboardIcon} alt="Inventario" width={20}/>} text='Inventario' alert 
                                />
                                <SidebarItem icon={<img src={DashboardIcon} alt="Sistema de compras" width={20}/>} text='Sistema de compras' active />
                                <SidebarItem icon={<img src={DashboardIcon} alt="Cajas" width={20}/>} text='Cajas' />
                                <SidebarItem icon={<img src={DashboardIcon} alt="Sistema de ventas" width={20}/>} text='Sistema de ventas' />
                                <SidebarItem icon={<img src={DashboardIcon} alt="Reportes" width={20}/>} text='Reportes' />
                                <SidebarItem icon={<img src={DashboardIcon} alt="Parámetros" width={20}/>} text='Parámetros' />
                                <SidebarItem icon={<img src={DashboardIcon} alt="Utilidades" width={20}/>} text='Utilidades' />

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