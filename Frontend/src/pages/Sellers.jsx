import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import clienteAxios from '../config/clienteAxios';
import SellerDetail from '../components/SellerDetail';

const Sellers = () => {

    const [seller, setSeller] = useState({
        Id: 0,
        Cedula: '',
        Nombre: '',
        Telefono: '',
        Celular: '',
        Direccion: '',
        Comision: 0,
        Inhabilitado: 0,
        Correo: '',
        Comision2: 0,
        DiasdeGracia: 0,
        TipoComision: 0,
        Meta: 0,
        PorcXMeta: 0,
        PorProdoPorc: 0
    });
    const [sellers, setSellers] = useState([]);
    const [sellerRecord, setSellerRecord] = useState(null);

    // Seleccionar
    const [selectedSeller, setSelectedSeller] = useState(null);

    // Filtrar
    const [sellerFilters, setSellerFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalSellerFilterValue, setGlobalSellerFilterValue] = useState('');

    // Acciones
    const toast = useRef(null);
    const [loading, setLoading] = useState(true);
    const [sellerDialog, setSellerDialog] = useState(false);

    // Cargar datos iniciales
    useEffect(() => {
        const verificarAcceso = () => {
            const auth = JSON.parse(localStorage.getItem('auth') || {});
            if (!auth.esAdmin) {
                navigate('/dashboard');
            }
        }

        // Obtener vendedores
        const getSellers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await clienteAxios.get('/vendedor/full_details', config);

                if (!response) {
                    throw new Error('Error al cargar los vendedores.');
                }

                const { data } = response;

                setSellers(data);
                setLoading(false);
            } catch (error) {
                console.error('Hubo un error:', error);
            }
        };
        verificarAcceso();
        getSellers();
    }, []);

    // Mostrar una alerta flotante
    const showFloatingAlert = (tipo, mensaje) => {
        if (toast.current) {
            toast.current.show({ severity: tipo, summary: 'Información', detail: mensaje });
        } else {
            console.error('La referencia a toast no está inicializada.');
        }
    };

    // Limpiar los estados una vez guardado el vendedor
    const resetState = () => {
        setSeller({});
    };

    // Manejar cambios en los campos del vendedor
    const handleSellerChange = (e) => {
        setSeller({ ...seller, [e.target.name]: e.target.value });
    };

    // Validar que el vendedor tenga todos los campos requeridos
    const checkSeller = () => {
        let errores = [];

        if (!seller.Cedula) {
            errores.push('El campo DPI es obligatorio.');
        }
        if (!seller.Nombre) {
            errores.push('El campo Nombre es obligatorio.');
        }
        if (!seller.Celular) {
            errores.push('El campo Celular es obligatorio.');
        }
        if (!seller.Direccion) {
            errores.push('El campo Dirección es obligatorio.');
        }

        if (errores.length > 0) {
            errores.forEach(error => {
                showFloatingAlert('error', error);
            });
            return;
        }
        saveSeller();
    };

    // Agregar nuevo vendedor
    const saveSeller = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const dataSeller = {
                "Cedula": seller.Cedula,
                "Nombre": seller.Nombre,
                "Telefono": seller.Telefono,
                "Celular": seller.Celular,
                "Direccion": seller.Direccion,
                "Comision": 0,
                "Inhabilitado": 0,
                "Correo": seller.Correo,
                "Comision2": 0,
                "DiasdeGracia": 0,
                "TipoComision": 0,
                "Meta": 0,
                "PorcXMeta": 0,
                "PorProdoPorc": 1
            }

            console.log(dataSeller);
            const response = await clienteAxios.post(`/vendedor/save`, dataSeller, config);

            if (!response) {
                showFloatingAlert('danger', 'El vendedor no se pudo agregar.');
                throw new Error('Error al guardar el vendedor.');
            } else {
                showFloatingAlert('success', 'Vendedor agregado correctamente.');
            }
            resetState();

            // Recargar la página
            window.location.reload();
        } catch (error) {
            console.error('Hubo un error:', error);
        }
    }

    // Plantilla de acciones en la tabla de vendedores
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" rounded text raised severity="info" className="mr-2" onClick={() => viewSellerDetail(rowData)} />
            </React.Fragment>
        );
    };

    // Filtrar vendedores
    const onGlobalSellerFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...sellerFilters };

        _filters['global'].value = value;

        setSellerFilters(_filters);
        setGlobalSellerFilterValue(value);
    }

    // Plantilla de cuerpo para la columna de verificación
    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-blue-500 pi-stop': rowData.Anulado, 'text-blue-500 pi-check-square': !rowData.Anulado })}></i>;
    };

    // Abrir diálogo de detalle de vendedor
    const viewSellerDetail = (seller) => {
        setSellerDialog(true);
        setSellerRecord(seller);
    }

    return (
        <div className="card">
            <TabView>
                <TabPanel header="Agregar">
                    <Toast ref={toast} />
                    <div className="flex justify-content-center mt-4">
                        <div className="card flex flex-col justify-content-center gap-3 w-full md:w-3/4">
                            <h1 className="col-span-2 text-center font-bold text-4xl">Registrar nuevo vendedor</h1>
                            <div className="flex flex-wrap gap-3 mb-4 mt-4">
                                <div className="flex-auto">
                                    <label htmlFor="Cedula" className="font-bold block mb-2">
                                        DPI
                                    </label>
                                    <InputText name="Cedula" value={seller.Cedula} onChange={handleSellerChange} className="w-full" keyfilter="num" placeholder="" minLength={13} maxLength={13} required />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor="Nombre" className="font-bold block mb-2">
                                        Nombre
                                    </label>
                                    <InputText name="Nombre" value={seller.Nombre} onChange={handleSellerChange} className="w-full" keyfilter="" placeholder="" maxLength={75} required />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor="Celular" className="font-bold block mb-2">
                                        Celular
                                    </label>
                                    <InputText name="Celular" value={seller.Celular} onChange={handleSellerChange} className="w-full" keyfilter="num" placeholder="" minLength={8} maxLength={8} required />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-4">
                                <div className="flex-auto">
                                    <label htmlFor="Telefono" className="font-bold block mb-2">
                                        Teléfono de casa
                                    </label>
                                    <InputText name="Telefono" value={seller.Telefono} onChange={handleSellerChange} className="w-full" keyfilter="num" placeholder="" minLength={8} maxLength={8} />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor="Correo" className="font-bold block mb-2">
                                        Correo Electrónico
                                    </label>
                                    <InputText name="Correo" value={seller.Correo} onChange={handleSellerChange} className="w-full" keyfilter="email" placeholder="" maxLength={50} />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor="Direccion" className="font-bold block mb-2">
                                        Dirección
                                    </label>
                                    <InputText name="Direccion" value={seller.Direccion} onChange={handleSellerChange} className="w-full" keyfilter="" placeholder="" maxLength={100} required />
                                </div>
                            </div>
                            <div className="card flex flex-col justify-center items-center gap-3 w-full md:w-3/4">
                                <div className="flex-shrink-0">
                                    <Button
                                        className='text-white text-sm bg-sky-600 p-3 rounded-md font-bold md:mt-0'
                                        label="Guardar"
                                        icon="pi pi-check"
                                        loading={loading}
                                        onClick={checkSeller}
                                        style={{ maxWidth: '10rem' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Listar">
                    <div className="flex flex-col justify-content-center">
                        <div className="mt-2">Filtrar vendedores</div>
                        <div className="flex gap-3 mt-2">
                            <InputText
                                keyfilter=""
                                placeholder="Buscar vendedor por dpi, nombre..."
                                value={globalSellerFilterValue}
                                onChange={onGlobalSellerFilterChange}
                                className="w-full md:w-25rem"
                            />
                        </div>
                    </div>
                    <div className="card mt-3">
                        <DataTable
                            dataKey="Id"
                            value={sellers}
                            size={'small'}
                            tableStyle={{ minWidth: '50rem' }}
                            loading={loading}
                            showGridlines
                            paginator
                            rows={25}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            selectionMode="single"
                            filters={sellerFilters}
                            onSelectionChange={(e) => setSelectedSeller(e.value)}
                            scrollable
                            scrollHeight="500px"
                            globalFilter={globalSellerFilterValue}
                            removableSort
                            className='border border-black-200 divide-y divide-black-200'
                        >
                            <Column body={actionBodyTemplate} exportable={false}></Column>
                            <Column field="Cedula" header="DPI"></Column>
                            <Column field="Nombre" header="Vendedor"></Column>
                            <Column field="Celular" header="Celular" style={{ width: '10%' }}></Column>
                            <Column field="Direccion" header="Direccion" ></Column>
                            <Column field="Correo" header="Correo"></Column>
                            <Column body={verifiedBodyTemplate} field="Inhabilitado" header="Activo"></Column>
                        </DataTable>
                    </div>
                    {sellerDialog && <SellerDetail
                        sellerDialog={sellerDialog}
                        setSellerDialog={setSellerDialog}
                        sellerRecord={sellerRecord}
                    />}
                </TabPanel>
            </TabView>
        </div>
    )
}

export default Sellers;