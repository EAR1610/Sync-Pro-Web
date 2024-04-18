import { useState, useEffect, createContext } from "react"
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom" 
import useAuth from "../hook/useAuth"

const DashboardContext = createContext();

const DashboardProvider = ({ children }) => {
    const [inventario, setInventario] = useState([]);
    const [alerta, setAlerta] = useState({});
    const [cargando, setCargando] = useState(false);
    const [producto, setProducto] = useState({});

    const navigate = useNavigate();
    const { auth } = useAuth();

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const token = localStorage.getItem('token');                
                if( !token ) return  navigate('/login');

                const config = {
                    Headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const response = await clienteAxios.get('/dashboard', config);              
                setInventario(response.data);
            } catch( error ){
                console.log(error)
            }
        }
        obtenerProductos();
    }, []);

    const mostrarAlerta = alerta => {
        setAlerta(alerta);

        setTimeout(() => {
            setAlerta({});
        }, 5000);
    }

    const obtenerProducto = async barras => {
        setCargando(true);
    
        try {
            const token = localStorage.getItem('token');
            if( !token ) return navigate('/login');
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
    
            const { data } = await clienteAxios.get(`/dashboard/barras/${barras}`, config);
            setProducto(data);
        } catch (error) {
            setAlerta({
                msg: 'Hubo un error',
                error: true
            });
            setTimeout(() => {
                setAlerta({});
            }, 3000);
        } finally {
            setCargando(false);
        }
    }
    
    const cerrarSesionDashboard = () => {
        setInventario([]);
        setProducto({});
        setAlerta({});
    }
    
  return (
    <>
        <DashboardContext.Provider
            value={{
                inventario,
                alerta,
                producto,
                cargando,
                setCargando,
                mostrarAlerta,
                obtenerProducto,
                cerrarSesionDashboard
            }}
        >
            {children}
        </DashboardContext.Provider>
    </>
  )
}

export {
    DashboardProvider
}

export default DashboardContext