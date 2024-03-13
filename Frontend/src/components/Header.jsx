import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import { Skeleton } from "primereact/skeleton";

const Header = ({ cerrarSesionAuth }) => {

    const [empresa, setEmpresa] = useState({});

    useEffect(() => {
      const cargarEmpresa = async () => {
        try {
            const token = localStorage.getItem('token');
            if( !token ) {
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

            const { data } = await response;            
            setEmpresa(data[0]);
        } catch (error) {
            throw new Error('Error al cargar la empresa');
        }
      }
      cargarEmpresa();
    }, [])
    

    const handleCerrarSesion = () => {
        cerrarSesionAuth();
        localStorage.removeItem('token');
    }
    
    return (
        <header className="px-4 py-5 bg-white border-b">
            <div className="md:flex md:justify-between">
                <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">
                    { empresa.Id ? empresa.NombreComercial : <Skeleton width="18rem" height="5rem"></Skeleton> }
                </h2>
    
                <div className='flex flex-col md:flex-row items-center gap-4'>
                    <Link                        
                        to='/dashboard/ventas'
                        className='font-bold uppercase'
                    >Ventas</Link>
                    <Link
                        to="/dashboard"
                        className='font-bold uppercase'
                    >Inventario</Link>
    
                    <button
                        type="button"
                        className='text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold'
                        onClick={handleCerrarSesion}
                    >Cerrar Sesión</button>                
                </div>
            </div>
        </header>
    )
}


export default Header