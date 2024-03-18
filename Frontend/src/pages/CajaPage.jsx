import { useEffect, useRef, useState } from 'react';

import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';        
import { Button } from 'primereact/button';       
import { Toast } from 'primereact/toast';

import clienteAxios from '../config/clienteAxios';
        
const CajaPage = () => {
    const [apertura, setApertura] = useState(null);
    const [aperturas, setaperturas] = useState([]);
    const [corte, setCorte] = useState({
        VentasTotales: 0,
        Ganancia: 0,
        TotalApertura: 0,
        TotalVentaE: 0,
        TotalAbonoE: 0,
        TotalApartado: 0,
        TotalEntrada: 0,
        TotalSalida: 0,
        PagoCompras: 0,
        PagoGastos: 0,
        Depositos: 0,
        TotalDevolucion : 0,
        Efectivo: 0,
        Tarjeta: 0,
        TotalCredito: 0,
        Cheques: 0,
        Transferencias: 0,
        FondoCaja: 0
    });

    const toast = useRef(null);

    const mostarAlertaFlotante = ( tipo, message) => {
        toast.current.show({ severity: tipo, summary: 'Información', detail: message });
    }

    useEffect(() => {
       const obtenerUsuarioCajas = async () => {
            try {
                const token = localStorage.getItem('token');
                if( !token ) return;
                
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }

                const response = await clienteAxios.get('/caja/estado', config);

                if(!response) throw new Error('Error al cargar los usuarios de caja');

                const { data } = response;            

                //Mapear los datos para usarlos en el Dropdown
                const dropdownData = data.map( item => ({
                    name: item.Cajero,
                    code: item.NApertura
                }));

                setaperturas(dropdownData);
                
            } catch (error) {
                console.log('Error al obtener los datos del usuario:', error);
                mostarAlertaFlotante('error', 'Ha ocurrido un error');
            }
       }
       obtenerUsuarioCajas(); 
    }, []);

    const handleCorte = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if( !token ) return;
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            const response = await clienteAxios.post('/caja/corte', { nApertura: apertura.code }, config);
            
            if(!response) mostarAlertaFlotante('error','Error al obtener el corte de caja');

            const { data } = response; 
            mostarAlertaFlotante('success','Corte de caja cargado.');
            const roundObjectValues = (obj) => {
                let newObj = {};
                for (let key in obj) {
                    if (typeof obj[key] === 'number') {
                        newObj[key] = Math.round(obj[key] * 100, 2) / 100;
                    } else {
                        newObj[key] = obj[key];
                    }
                }
                return newObj;
            }
            
            // Y luego en tu código:
            
            const { TotalContado, Ganancia, TotalApertura, TotalVentaE, TotalAbonoE, TotalApartado, TotalEntrada, TotalSalida, PagoCompras, PagoGastos, Depositos, TotalDevolucion, Efectivo, Tarjeta, TotalCredito, Cheques, Transferencias } = roundObjectValues(data[0]);

            setCorte({
                VentasTotales: (TotalCredito + TotalContado) - TotalDevolucion,
                Ganancia,
                TotalApertura,
                TotalVentaE,
                TotalAbonoE,
                TotalApartado,
                TotalEntrada,
                TotalSalida,
                PagoCompras,
                PagoGastos,
                Depositos,
                TotalDevolucion,
                Efectivo,
                Tarjeta,
                TotalCredito,
                Cheques,
                Transferencias,
                FondoCaja : (TotalApertura + TotalVentaE + TotalAbonoE + TotalEntrada + TotalApartado) - (TotalSalida + PagoCompras + PagoGastos + Depositos + TotalDevolucion)
            });
            
        } catch (error) {
            mostarAlertaFlotante('error', 'Seleccione un cajero para consultar el corte');
        }
    }

    return (
<div className="card">
            <Toast ref={toast} />
            <TabView>
                <TabPanel header="Corte">
                    <div className="card flex justify-content-center">
                        <Dropdown value={apertura} onChange={(e) => setApertura(e.value)} options={aperturas} optionLabel="name" 
                            placeholder="Cajero" className="w-full md:w-14rem border" />
                        <Button label="GENERAR" onClick={ handleCorte } className='flex ml-2 justify-content-center bg-sky-400 text-white px-3 rounded-lg text-xs' size='small'/>
                    </div>
                    <h2 className='text-center bg-sky-400  font-bold p-1 mt-2 rounded-lg text-white'>VENTAS TOTALES</h2>
                    <div className='flex flex-wrap justify-around'>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4 mt-1">                              
                            <input type="text" id='ventas-totales' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.VentasTotales} readOnly/>
                        </div>
                    </div>
                    <h2 className='text-center bg-sky-400  font-bold p-1 mt-2 rounded-lg text-white'>GANANCIAS</h2>
                    <div className='flex flex-wrap justify-around'>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4 mt-1">                                
                            <input type="text" id='ventas-totales' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.Ganancia} readOnly/>
                        </div>
                    </div>
                    <h2 className='text-center bg-sky-400 font-bold p-1 mt-2 rounded-lg text-white'>DINERO EN CAJA</h2>
                    <div className='flex flex-wrap justify-around'>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4 mt-1">
                            <label htmlFor="fondo-caja" className="block text-gray-700 text-sm font-bold mb-2">Fondo caja:</label>
                            <input type="text" id='fondo-caja' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.TotalApertura} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="venta-efectivo" className="block text-gray-700 text-sm font-bold mb-2">Ventas en Efectivo:</label>
                            <input type="text" id='venta-efectivo' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.TotalVentaE} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="abono-efectivo" className="block text-gray-700 text-sm font-bold mb-2">Abonos en Efectivo:</label>
                            <input type="text" id='abono-efectivo' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.TotalAbonoE} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="apartado-efectivo" className="block text-gray-700 text-sm font-bold mb-2">Apartados en Efectivo:</label>
                            <input type="text" id='apartado-efectivo' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.TotalApartado} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="entrada" className="block text-gray-700 text-sm font-bold mb-2">Entradas:</label>
                            <input type="text" id='entrada' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.TotalEntrada} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="mov-salidas" className="block text-gray-700 text-sm font-bold mb-2">Mov. Salidas:</label>
                            <input type="text" id='mov-salidas' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.TotalSalida} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="pago-compras" className="block text-gray-700 text-sm font-bold mb-2">Pago Compras:</label>
                            <input type="text" id='pago-compras' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.PagoCompras} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="pago-gastos" className="block text-gray-700 text-sm font-bold mb-2">Pago Gastos:</label>
                            <input type="text" id='pago-gastos' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.PagoGastos} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="depositos" className="block text-gray-700 text-sm font-bold mb-2">Depósitos:</label>
                            <input type="text" id='depositos' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.Depositos} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="devoluciones" className="block text-gray-700 text-sm font-bold mb-2">Devoluciones:</label>
                            <input type="text" id='devoluciones' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.TotalDevolucion} readOnly/>
                        </div>
                    </div>
                    <h2 className='text-center bg-sky-400  font-bold p-1 mt-2 rounded-lg text-white'>EFECTIVO CAJA:</h2>
                    <div className='flex flex-wrap justify-around'>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4 mt-1">
                            <input type="text" id='efectivo-caja' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.FondoCaja}readOnly/>
                        </div>
                    </div>
                    <h2 className='text-center bg-sky-400 font-bold p-1 mt-2 rounded-lg text-white'>VENTAS:</h2>
                    <div className='flex flex-wrap justify-around'>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4 mt-1">
                            <label htmlFor="efectivo" className="block text-gray-700 text-sm font-bold mb-2">Efectivo:</label>
                            <input type="text" id='efectivo' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.Efectivo} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="tarjeta-credito" className="block text-gray-700 text-sm font-bold mb-2">Tarjeta Crédito:</label>
                            <input type="text" id='tarjeta-credito' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.Tarjeta} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="credito" className="block text-gray-700 text-sm font-bold mb-2">Crédito:</label>
                            <input type="text" id='credito' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.TotalCredito} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="cheques" className="block text-gray-700 text-sm font-bold mb-2">Cheques:</label>
                            <input type="text" id='cheques' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.Cheques} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="transferencias" className="block text-gray-700 text-sm font-bold mb-2">Transferencias:</label>
                            <input type="text" id='transferencias' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.Transferencias} readOnly/>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4">
                            <label htmlFor="devolucion-ventas" className="block text-gray-700 text-sm font-bold mb-2">Devoluciones Venta:</label>
                            <input type="text" id='devolucion-ventas' className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={corte.TotalDevolucion} readOnly/>
                        </div>
                    </div>                        
                </TabPanel>
                <TabPanel header="Cierre">
                    <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
                        eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui 
                        ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                    </p>
                </TabPanel>                
            </TabView>
        </div>       
    )
}

export default CajaPage