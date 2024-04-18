import { useState, useEffect, createContext } from "react"
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    
    const [auth, setAuth] = useState(() => {
      const storedAuth = localStorage.getItem('auth');
      return storedAuth ? JSON.parse(storedAuth) : {};
    });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
      const autenticarUsuario = async () => {        
        const token = localStorage.getItem('token');
        if( !token ) {
            setCargando(false);
            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
          const response = await clienteAxios('auth/perfil', config);
          setAuth(response.data);
        } catch (error) {
          if (error.response && error.response.status === 401) {            
            localStorage.removeItem('token');
            setAuth({});
          } else {
            localStorage.removeItem('token');
            setAuth({});
          }
        }

        setCargando(false);
      }
      autenticarUsuario();
    }, []);

    const cerrarSesionAuth = () => {  
        setAuth({});
    }
        
  return (
    <AuthContext.Provider 
        value={{ 
            auth, 
            setAuth, 
            cargando, 
            cerrarSesionAuth 
        }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export {
    AuthProvider
}

export default AuthContext