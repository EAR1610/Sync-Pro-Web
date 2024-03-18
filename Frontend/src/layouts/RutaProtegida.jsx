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

                        <div className='md:flex md:min-h-screen'>
                           <Sidebar>
                                <SidebarItem 
                                    icon={<img src={DashboardIcon} alt="Dashboard" width={20}/>} text='Dashboard' alert 
                                />
                                <SidebarItem icon={<img src={DashboardIcon} alt="Dashboard" width={20}/>} text='Ventas' active />
                                <SidebarItem icon={<img src={DashboardIcon} alt="Dashboard" width={20}/>} text='Cajas' />

                            </Sidebar>

                           <main className='p-10 flex-1 '>
                              <Outlet />
                           </main>
                        </div>
                    </div>
                    
                ) : <Navigate to="/login" />}
        </>
    )
}

export default RutaProtegida