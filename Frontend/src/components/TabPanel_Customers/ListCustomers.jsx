import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import clienteAxios from '../../config/clienteAxios';
import CustomerDetail from './CustomerDetail';
import InactiveCustomers from './InactiveCustomers';

const ListCustomers = (props) => {

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
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

                const response = await clienteAxios.get('/cliente', config);

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
    }, [props.reloadCustomers]); // Se ejecuta cada vez que se actualiza reloadCustomers

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
                    icon="pi pi-pencil"
                    onClick={() => handleEditCustomer(rowData)}
                    style={{ padding: '0.0rem', fontSize: '0.75rem', backgroundColor: '#4299E1', color: '#FFFFFF' }}
                    className='ml-1'
                />
                <Button
                    icon="pi pi-trash"
                    onClick={() => handleDeleteCustomerClick(rowData)}
                    style={{ padding: '0.0rem', fontSize: '0.75rem', backgroundColor: '#F56565', color: '#FFFFFF' }}
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

    // Manejador del evento del botón de editar
    const handleEditCustomer = (customer) => {
        props.setEditingCustomer(customer);
        props.setIsDialogVisible(true);
    };

    // Abrir diálogo de confirmación para ocultar cliente
    const handleDeleteCustomerClick = (customer) => {
        setSelectedCustomer(customer);
        setShowDeleteDialog(true);
    };

    // Confirmar ocultar cliente
    const handleConfirmDelete = () => {
        hideCustomer(selectedCustomer);
        setShowDeleteDialog(false);
        props.setReloadCustomers(prevState => !prevState);
    };

    // Ocultar cliente
    const hideCustomer = async (customer) => {
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

            const response = await clienteAxios.put(`/cliente/hide/${customer.CodCliente}`, {}, config);

            if (!response || response.status >= 400) {
                showFloatingAlert('danger', 'El cliente no se pudo eliminar.');
                throw new Error('Error al eliminar el cliente.');
            } else {
                showFloatingAlert('success', 'Cliente eliminado correctamente.');
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

    // Plantilla de cuerpo para la columna de verificación
    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-blue-500 pi-stop': rowData.Habilitado, 'text-blue-500 pi-check-square': !rowData.Habilitado })}></i>;
    };

    // Mostrar el diálogo de detalle de cliente
    const viewCustomerDetail = (rowData) => {
        setCustomerRecord(rowData);
        setCustomerDialog(true);
    };

    // Pie de página del diálogo de confirmación
    const renderFooter = () => {
        return (
            <div className="text-center">
                <Button label="No" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} className="p-button-danger p-button-text" />
                <Button label="Si" icon="pi pi-check" onClick={handleConfirmDelete} autoFocus className="p-button-success" />
            </div>
        );
    }

    /**
     * !IMPORTANTE: Esta función aun no funciona correctamente
     */
    // Actualizar tabla de clientes
    const updateTableCustomer = () => {
        props.onCustomerSaved();
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="flex justify-between items-center">
                <label className="block text-gray-700 text-lg font-bold" htmlFor="search">
                    Filtrar clientes
                </label>
            </div>
            <div className="flex justify-between items-center mt-1">
                <InputText
                    keyfilter=""
                    placeholder="Buscar cliente por dpi, nombre..."
                    value={globalCustomerFilterValue}
                    onChange={onGlobalCustomerFilterChange}
                    className="w-full md:w-25rem"
                    style={{ height: '35px' }}
                />
                <div className="ml-auto flex">
                    <Button
                        label="Clientes Inactivos"
                        // icon="pi pi-plus"
                        size='small'
                        className="p-button-secondary mr-2 text-xs"
                        onClick={props.openInactiveDialog}
                    />
                    <Button
                        label="Agregar Cliente"
                        icon="pi pi-plus"
                        size='small'
                        className="p-button-success text-xs" // reduce font size
                        onClick={props.openDialog}
                    />
                </div>
            </div>
            <div className="ml-auto flex mt-4">
                <Button
                    label="Actualizar Tabla"
                    // icon="pi pi-plus"
                    size='small'
                    className="p-button-info mr-2 text-xs"
                    onClick={updateTableCustomer}
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
                    scrollHeight="400px"
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
                    {/* <Column body={verifiedBodyTemplate} field="Inhabilitado" header="Activo"></Column> */}
                </DataTable>
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
                visible={showDeleteDialog}
                footer={renderFooter('displayBasic')}
                onHide={() => setShowDeleteDialog(false)}
            >
                ¿Estás seguro de que quieres eliminar este cliente?
            </Dialog>
        </div>
    )
};

export default ListCustomers;