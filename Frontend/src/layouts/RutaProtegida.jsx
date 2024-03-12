import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import Header from "../components/Header";

const RutaProtegida = () => {
    const { auth, cargando, cerrarSesionAuth } = useAuth();
      
    return (
        <>
            {                
                auth.id ? (
                    <div className='bg-gray-100'>
                        <Header 
                            cerrarSesionAuth={cerrarSesionAuth}
                        />

                        <main className='p-10 flex-1 '>
                            <Outlet />
                        </main>
                    </div>
                    
                ) : <Navigate to="/login" />}
        </>
    )
}

export default RutaProtegida