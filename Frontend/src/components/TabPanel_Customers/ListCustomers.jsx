import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';

import clienteAxios from '../../config/clienteAxios';

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
            <React.Fragment>
                <Button icon="pi pi-eye" rounded text raised severity="info" className="mr-2" onClick={() => viewSellerDetail(rowData)} />
            </React.Fragment>
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

    // Abrir diálogo de detalle de vendedor
    const viewCustomerDetail = (customer) => {
        setCustomerDialog(true);
        setCustomerRecord(customer);
    }

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
            <div className="card mt-3">
                <DataTable
                    dataKey="CodCliente"
                    value={customers}
                    size={'small'}
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
                    scrollHeight="500px"
                    globalFilter={globalCustomerFilterValue}
                    removableSort
                    className='border border-black-200 divide-y divide-black-200'
                >
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                    <Column field="Cedula" header="DPI"></Column>
                    <Column field="Nombre" header="Cliente"></Column>
                    <Column field="Celular" header="Celular" style={{ width: '10%' }}></Column>
                    <Column field="Direccion" header="Direccion" ></Column>
                    <Column field="Correo" header="Correo"></Column>
                    <Column body={verifiedBodyTemplate} field="Inhabilitado" header="Activo"></Column>
                </DataTable>
            </div>
        </div>
    )
};

export default ListCustomers;