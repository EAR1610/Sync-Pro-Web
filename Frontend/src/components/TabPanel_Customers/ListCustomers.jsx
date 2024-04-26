import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';

import clienteAxios from '../../config/clienteAxios';
import CustomerDetail from './CustomerDetail';

const ListCustomers = () => {

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
    }, []);

    // Plantilla de acciones en la tabla de clientes
    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                    icon="pi pi-eye"
                    onClick={() => viewCustomerDetail(rowData)}
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

    /**
     * TODO: Crear un componente para el diálogo de detalle de cliente
     */
    return (
        <div>
            <div className="flex flex-col justify-content-center">
                <div className="mt-2">Filtrar clientes</div>
                <div className="flex gap-3 mt-2">
                    <InputText
                        keyfilter=""
                        placeholder="Buscar cliente por dpi, nombre..."
                        value={globalCustomerFilterValue}
                        onChange={onGlobalCustomerFilterChange}
                        className="w-full md:w-25rem"
                    />
                </div>
            </div>
            <div className="flex justify-content-center mb-4">
            </div>
            <div className="card mt-3">
                <DataTable
                    dataKey="CodCliente"
                    value={customers}
                    size='small'
                    tableStyle={{ minWidth: '50rem'}}
                    loading={loading}
                    showGridlines
                    paginator
                    rows={25}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    selectionMode="single"
                    filters={customerFilters}
                    onSelectionChange={(e) => setSelectedCustomer(e.value)}
                    scrollable
                    scrollHeight="500px"
                    globalFilter={globalCustomerFilterValue}
                    removableSort
                    className='p-datatable-sm p-datatable-gridlines'
                >
                    <Column body={actionBodyTemplate} header="Acciones" exportable={false}></Column>
                    <Column field="Cedula" header="DPI"></Column>
                    <Column field="Nombre" header="Cliente"></Column>
                    <Column field="Celular" header="Celular" style={{ width: '10%' }}></Column>
                    <Column field="Direccion" header="Direccion" ></Column>
                    <Column field="Email" header="Correo"></Column>
                    <Column body={verifiedBodyTemplate} field="Inhabilitado" header="Activo"></Column>
                </DataTable>
            </div>
            {customerDialog &&
                <CustomerDetail
                    customerDialog={customerDialog}
                    setCustomerDialog={setCustomerDialog}
                    customerRecord={customerRecord}
                />
            }
        </div>
    )
};

export default ListCustomers;