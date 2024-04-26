import React, { useState, useEffect, useRef } from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import clienteAxios from "../config/clienteAxios";
import { Button } from "primereact/button";
import Cierre from "../components/Cierre";
import { classNames } from 'primereact/utils';

import { Dropdown } from 'primereact/dropdown';        
import { Toast } from 'primereact/toast';
        
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

    const [cierres, setCierres] = useState([]);
    const [selectCierres, setSelectCierres] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registro, setRegistro] = useState([]);
    const [cierreDialog, setCierreDialog] = useState(false);

    const columns = [
        { field: 'Cierre', header: 'Cierre' },
        { field: 'Nombre', header: 'Nombre' },
        { field: 'Fecha', header: 'Fecha' },
    ];

    const toast = useRef(null);

    const mostarAlertaFlotante = ( tipo, message) => {
        toast.current.show({ severity: tipo, summary: 'Información', detail: message });
    }

    useEffect(() => {
        const verificarAcceso = () => {
            const auth = JSON.parse(localStorage.getItem('auth') || {});
            if (!auth.esAdmin) {
                navigate('/dashboard');
            }        
        }

        const fetchSellers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token de autenticación no encontrado.');
                }
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const response = await clienteAxios.get('/caja/cierre/personalizado', config);
                
                if (!response) {
                    throw new Error('Error al cargar los cierres de caja.');
                }
                const { data } = await response;
                setCierres(data);
                setLoading(false);
            } catch (error) {
                console.error('Hubo un error:', error);
                setLoading(false);
            }
        };

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
       verificarAcceso();
       fetchSellers();
    }, []);

    const editCierre = (cierre) => {
        setRegistro(cierre);
        setCierreDialog(true);
    };
    
    const verifiedBodyTemplate = (rowData) => {
        return <i className= {classNames('pi',{ 'text-blue-500 pi-stop': !rowData.Anulado, 'text-blue-500 pi-check-square': rowData.Anulado })}></i>;
    };

    const actionBodyTemplate = (rowData) => {
        // return (
        //     <React.Fragment>
        //         <Button icon="pi pi-eye" rounded text raised severity="info" className="mr-2" onClick={() => editCierre(rowData)} />
        //     </React.Fragment>
        // );
        return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                    icon="pi pi-eye"
                    onClick={() => editCierre(rowData)}
                    style={{ padding: '0.3rem', fontSize: '0.75rem', backgroundColor: '#48BB78', color: '#FFFFFF' }}
                />
                <Button
                    icon="pi pi-pencil"
                    onClick={() => alert('Opción en desarrollo')}
                    style={{ padding: '0.3rem', fontSize: '0.75rem', backgroundColor: '#4299E1', color: '#FFFFFF' }}
                    className='ml-1'
                />
                <Button
                    icon="pi pi-trash"
                    onClick={() => alert('Opción en desarrollo')}
                    style={{ padding: '0.3rem', fontSize: '0.75rem', backgroundColor: '#F56565', color: '#FFFFFF' }}
                    className='ml-1'
                />
            </div>
        );
    };

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
                    <div>
                        <div className="card">
                            <DataTable
                                dataKey="Cierre"
                                size='small'
                                loading={loading}
                                showGridlines
                                removableSort
                                value={cierres}
                                tableStyle={{ minWidth: '50rem' }}
                                paginator
                                rows={25}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                selectionMode="single"
                                selection={selectCierres}
                                onSelectionChange={(e) => setSelectCierres(e.value)}
                                scrollable
                                scrollHeight="500px"
                            >
                                <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ width: '4rem' }}></Column>

                                {columns.map((col, i) => (
                                    <Column key={`${col.field}-${i}`} field={col.field} header={col.header} />
                                ))}

                                <Column body={verifiedBodyTemplate} header="Anulado" exportable={false}  style={{ width: '4rem' }}></Column>
                            </DataTable>
                        </div>
                        {cierreDialog && <Cierre cierreDialog={cierreDialog} setCierreDialog={setCierreDialog} cierre={registro} />}
                    </div>
                </TabPanel>                
            </TabView>
        </div>       
    )
}

export default CajaPage