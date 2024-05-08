import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';

import clienteAxios from '../../config/clienteAxios';
import CustomerDetail from './CustomerDetail';
import Customers from '../../pages/Customers';

const InactiveCustomers = (props) => {

    // Datos
    const [customers, setCustomers] = useState([]);

    // Seleccionar
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerRecord, setCustomerRecord] = useState(null);

    // Filtrar
    const [customerFilters, setCustomerFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalCustomerFilterValue, setGlobalCustomerFilterValue] = useState('');

    // Acciones
    const toast = useRef(null);
    const [loading, setLoading] = useState(true);
    const [customerDialog, setCustomerDialog] = useState(false);
    const [showRecoverDialog, setShowRecoverDialog] = useState(false);

    // Cargar datos iniciales
    useEffect(() => {
        const verificarAcceso = () => {
            const auth = JSON.parse(localStorage.getItem('auth') || {});
            if (!auth.esAdmin) {
                navigate('/dashboard');
            }
        }

        // Obtener vendedores
        const getCustomers = async () => {
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

                const response = await clienteAxios.get('/cliente/inactive', config);

                if (!response) {
                    throw new Error('Error al cargar los vendedores.');
                }

                const { data } = response;

                setCustomers(data);
                setLoading(false);
            } catch (error) {
                console.error('Hubo un error:', error);
            }
        };
        verificarAcceso();
        getCustomers();
    }, [props.reloadCustomers]);

    // Plantilla de acciones en la tabla de clientes
    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                    icon="pi pi-eye"
                    onClick={() => viewCustomerDetail(rowData)}
                    style={{ padding: '0.0rem', fontSize: '0.75rem', backgroundColor: '#48BB78', color: '#FFFFFF' }}
                />
                <Button
                    label="Activar"
                    onClick={() => handleRecoverCustomerClick(rowData)}
                    style={{ padding: '0.0rem', fontSize: '0.75rem', backgroundColor: '#D59B14', color: '#FFFFFF', width: '75px' }}
                    className='ml-1'
                />
            </div>
        );
    };

    // Mostrar una alerta flotante
    const showFloatingAlert = (tipo, mensaje) => {
        if (toast.current) {
            toast.current.show({ severity: tipo, summary: 'Información', detail: mensaje });
        } else {
            console.error('La referencia a toast no está inicializada.');
        }
    };

    // Abrir diálogo de confirmación para recuperar cliente
    const handleRecoverCustomerClick = (customer) => {
        setSelectedCustomer(customer);
        setShowRecoverDialog(true);
    };

    // Confirmar recuperar cliente
    const handleConfirmRecover = () => {
        RecoverCustomer(selectedCustomer);
        setShowRecoverDialog(false);
        props.setReloadCustomers(prevState => !prevState);
    };

    // Ocultar cliente
    const RecoverCustomer = async (customer) => {
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

            const response = await clienteAxios.put(`/cliente/recover/${customer.CodCliente}`, {}, config);

            if (!response || response.status >= 400) {
                props.onShowToast('danger', 'El cliente no se pudo recuperar.');

                throw new Error('Error al recuperar el cliente.');
            } else {
                // props.onShowToast('success', 'Cliente recuperado correctamente.');
                showFloatingAlert('success', 'Cliente recuperado correctamente.');
            }

        } catch (error) {
            console.error('Hubo un error:', error);
        }
    }

    // Filtrar clientes
    const onGlobalCustomerFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...customerFilters };

        _filters['global'].value = value;

        setCustomerFilters(_filters);
        setGlobalCustomerFilterValue(value);
    }

    // Mostrar el diálogo de detalle de cliente
    const viewCustomerDetail = (rowData) => {
        setCustomerRecord(rowData);
        setCustomerDialog(true);
    };

    // Pie de página del diálogo de confirmación
    const renderFooter = () => {
        return (
            <div className="text-center">
                <Button label="No" icon="pi pi-times" onClick={() => setShowRecoverDialog(false)} className="p-button-danger p-button-text" />
                <Button label="Si" icon="pi pi-check" onClick={handleConfirmRecover} autoFocus className="p-button-success" />
            </div>
        );
    }

    // Cerrar diálogo de recuperación de cliente
    const closeRecoverDialog = () => {
        props.onCustomerSaved();
        props.setIsInactiveDialogVisible(false);
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="flex justify-between items-center">
                <label className="block text-gray-700 text-lg font-bold" htmlFor="search">
                    Filtrar clientes
                </label>
            </div>
            <div className="flex justify-between items-center mt-2">
                <InputText
                    keyfilter=""
                    placeholder="Buscar cliente por dpi, nombre..."
                    value={globalCustomerFilterValue}
                    onChange={onGlobalCustomerFilterChange}
                    className="w-full md:w-25rem"
                    style={{ height: '35px' }}
                />
            </div>
            <div className="card mt-3">
                <DataTable
                    dataKey="CodCliente"
                    value={customers}
                    size='small'
                    tableStyle={{ minWidth: '50rem' }}
                    loading={loading}
                    showGridlines
                    paginator
                    rows={25}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    selectionMode="single"
                    filters={customerFilters}
                    onSelectionChange={(e) => setSelectedCustomer(e.value)}
                    scrollable
                    scrollHeight="350px"
                    globalFilter={globalCustomerFilterValue}
                    removableSort
                    className='p-datatable-gridlines text-xs' // text-sm reduce el tamaño de la fuente, py-1 reduce la altura de las filas
                >
                    <Column body={actionBodyTemplate} header="Acciones" bodyStyle={{ width: '150px', textAlign: 'center' }} exportable={false}></Column>
                    <Column field="Cedula" header="Cédula"></Column>
                    <Column field="Nombre" header="Cliente"></Column>
                    <Column field="Celular" header="Celular" style={{ width: '10%' }}></Column>
                    <Column field="Direccion" header="Direccion" ></Column>
                    <Column field="Email" header="Correo"></Column>
                </DataTable>
                <div className="card flex flex-col justify-center items-center gap-3 w-full md:w-3/4 mt-4">
                    <div className="flex-shrink-0">
                        <Button
                            className='text-white text-sm bg-red-600 p-3 rounded-md font-bold md:mt-0 ml-2'
                            label="Cerrar"
                            onClick={closeRecoverDialog}
                            style={{ maxWidth: '10rem' }}
                        />
                    </div>
                </div>
                {customerDialog &&
                    <CustomerDetail
                        customerDialog={customerDialog}
                        setCustomerDialog={setCustomerDialog}
                        customerRecord={customerRecord}
                    />
                }
                <Dialog
                    header="Confirmación"
                    visible={showRecoverDialog}
                    footer={renderFooter('displayBasic')}
                    onHide={() => setShowRecoverDialog(false)}
                >
                    ¿Estás seguro de que quieres activar este cliente?
                </Dialog>
            </div>
        </div >
    );
};

export default InactiveCustomers;