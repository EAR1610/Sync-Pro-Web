import { Link } from "react-router-dom";

const Header = ({ cerrarSesionAuth }) => {
    const handleCerrarSesion = () => {
        cerrarSesionAuth();
        localStorage.removeItem('token');
    }
    
    return (
        <header className="px-4 py-5 bg-white border-b">
            <div className="md:flex md:justify-between">
                <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">
                    Super Sistemas
                </h2>
    
                <div className='flex flex-col md:flex-row items-center gap-4'>
                    <button
                        type="button"
                        className='font-bold uppercase'
                        onClick={''}
                    >Inicio</button>
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