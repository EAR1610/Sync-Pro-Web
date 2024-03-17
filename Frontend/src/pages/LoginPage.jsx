import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo  from '../assets/Logo.ico'
import useAuth from '../hook/useAuth';
import clienteAxios from '../config/clienteAxios';
import Alerta from '../components/Alerta';
import { Dropdown } from 'primereact/dropdown';

const LoginPage = () => {
  const [username, setUsername] = useState(null);
  const [usernames, setUsernames] = useState([])
  const [password, setPassword] = useState('');  
  const [alerta, setAlerta] = useState({});

  const { setAuth } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const { data } = await clienteAxios.get('/auth/users');

        //Mapear los datos para usarlos en el Dropdown
        const dropdownData = data.map( item => ({
          name: item.Nombre,
          code: item.id
        }));
        setUsernames(dropdownData);
      } catch (error) {
        console.log(error);
      }
    }
    obtenerUsuarios();
  }, []);
  

  const handleSubmit = async (event) => {
    event.preventDefault();    
    if( [username, password].includes('') ) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      });
      return;
    }  

    try {
      const { data } = await clienteAxios.post('/auth/signin', { 'Nombre': username.name, 'password':password });
      setAlerta({});
      localStorage.setItem('token', data.token);
      setAuth(data.user);
      localStorage.setItem('auth', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (error) {
      setAlerta({
        msg: 'Hubo un error al iniciar sesión',
        error: true
      })
    }
      
  };

  const { msg } = alerta;

  return (
    <>     
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto w-auto"
              src={Logo}
              alt="Your Company"
              style={{height: '8rem'}}
            />            
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            { msg && <Alerta alerta = { alerta }/> }
            <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
              <div>              
                <div className="mt-2">                 
                  <Dropdown value={username} onChange={(e) => setUsername(e.value)} options={usernames} optionLabel="name" 
                    placeholder="Usuario" className="w-full border" />
                </div>
              </div>

              <div>                
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder='Contraseña'
                    required
                    className="block p-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800"
                >
                  Iniciar sesión
                </button>
              </div>
              <div>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm items-center text-center flex flex-col">
                <label htmlFor="" className='text-center items-center leading-9 tracking-tight text-gray-900 text-xs'>Super Sistemas &copy; { new Date().getFullYear() }</label>
                </div>
              </div>              
            </form>          
          </div>
        </div>
    </>    
  )
}

export default LoginPage