import { useState, Link } from 'react'
import Logo from '../assets/Logo.png'
import {
    PaperAirplaneIcon,
    MoonIcon,
    SunIcon,
    Bars3Icon,
    XMarkIcon,
  } from "@heroicons/react/24/outline";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {

    const [toggleMenu, setToggleMenu] = useState(false);
    const navigate = useNavigate();
    const { state } = useLocation();    


    const onLogOut = () => {
        navigate('/login', {
            replace: true,           
        });
    }

    return (
        <>
            <div className="app">
                <nav>
                    <div className="max-w-7xl mx-auto">
                        <div className="flex mx-auto justify-between w-5/6 ">
                            {/* Primary menu and logo */}
                            <div className="flex items-center gap-16 my-12">
                            {/* logo */}
                            <div>
                                <a
                                    href="/"
                                    className="flex gap-1 font-bold text-gray-700 items-center "
                                >
                                <img className="h-6 text-primary" src={Logo}/>
                                <span>Super Sistemas</span>
                                </a>
                            </div>
                            {/* primary */}
                            {state?.logged ? (
                                    <div className="hidden lg:flex gap-8">
                                        <span>{state?.nombre}</span>
                                        <a href="/" className="">Inicio</a>
                                        <a href="/login">Login</a>
                                        <a href="#" onClick={onLogOut}>Cerrar sesión</a>
                                    </div>
                                ) : (
                                    <div className="hidden lg:flex gap-8">
                                        <span>{state?.nombre}</span>
                                        <a href="/" className="">Inicio</a>
                                        <a href="/login">Login</a>
                                    </div>
                                )}
                            </div>
                            {/* secondary */}
                                <div className="flex gap-6">
                                    <div className="hidden xs:flex items-center gap-10">
                                        <div className="hidden lg:flex items-center gap-2">
                                            <MoonIcon className="h-6 w-6" />
                                            <SunIcon className="h-6 w-6" />
                                        </div>
                                    <div>                  
                                </div>
                            </div>
                            {/* Mobile navigation toggle */}
                            <div className="lg:hidden flex items-center">
                                <button onClick={() => setToggleMenu(!toggleMenu)}>
                                <Bars3Icon className="h-6" />
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                    {/* mobile navigation */}
                    <div
                    className={`fixed z-40 w-full  bg-gray-100 overflow-hidden flex flex-col lg:hidden gap-12  origin-top duration-700 ${
                        !toggleMenu ? "h-0" : "h-full"
                    }`}
                    >
                        <div className="px-8">
                            <div className="flex flex-col gap-8 font-bold tracking-wider">
                            <span>{state?.nombre}</span>
                            <a href="/" className="border-l-4 border-gray-600">
                                Inicio
                            </a>
                            <a href="/login">Login</a>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            
            <Outlet />
        </>
    );
}

export default Navbar