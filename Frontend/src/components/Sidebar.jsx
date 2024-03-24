import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState, useEffect } from "react"
import clienteAxios from "../config/clienteAxios";
import { Skeleton } from "primereact/skeleton";

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [imagenURL, setImagenURL] = useState(null);

  useEffect(() => {
    const cargarImagenEmpresa = async () => {
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
  
      const response = await clienteAxios.get('/empresa/imagen', config);
      if (!response) {
          throw new Error('Error al cargar la empresa');
      }
      const { data } = response;
      mostrarImagen(data.Imagen);
    }
    cargarImagenEmpresa();
  }, []);

  const mostrarImagen = (imagenByte) => {
    if ( imagenByte && imagenByte.data) {

      const tipoImagen = imagenByte.type || 'image/jpeg';
      const bytesArray = new Uint8Array(imagenByte.data);
      const blob = new Blob([bytesArray], { type: tipoImagen });
      const url = URL.createObjectURL(blob);
      setImagenURL(url);
    }
  }
  
  
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={ imagenURL ? imagenURL : <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton> }
            className={`overflow-hidden transition-all ${ expanded ? "w-32" : "w-0"}`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-sky-200 to-sky-400 text-indigo-800"
            : "hover:bg-sky-400 text-gray-600 hover:text-white"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-sky-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute z-10 left-full rounded-md px-1 py-1 ml-3
          bg-sky-800 text-white text-sm
          invisible -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  )
}