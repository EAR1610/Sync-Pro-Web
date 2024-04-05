import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

import clienteAxios from '../config/clienteAxios';
import useAuth from "../hook/useAuth"

const FinishOrder = ({ order, idCustomer, idSeller, total,
    observation, estimatedDate, resetState, handleCloseDialog,
    mostrarAlertaFlotante }) => {

    const [seller, setSeller] = useState({});
    const [customer, setCustomer] = useState({});
    const currentDateFormatted = new Date().toISOString().split('T')[0];

    const { auth } = useAuth();

    useEffect(() => {
        const verificarAcceso = () => {
            const auth = JSON.parse(localStorage.getItem('auth') || {});
            if (!auth.esAdmin) {
                navigate('/dashboard');
            }
        }

        const fetchData = async () => {
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

                const [responseSeller, responseCustomer] = await Promise.all([
                    clienteAxios.get(`/vendedor/id/${idSeller}`, config),
                    clienteAxios.get(`/cliente/id/${idCustomer}`, config)
                ]);

                if (!responseSeller || !responseCustomer) {
                    throw new Error('Error al cargar el vendedor o cliente.');
                }

                const { data: sellerData } = responseSeller;
                const { data: customerData } = responseCustomer;

                setSeller(sellerData);
                setCustomer(customerData);
            } catch (error) {
                console.error('Hubo un error:', error);
            }
        };

        verificarAcceso();
        fetchData();
    }, []);

    // Función para manejar el click en el botón "Completar"
    const handleCompleteClick = async () => {
        try {
            const idPedido = await saveOrder();
            if (!idPedido) {
                throw new Error('No se pudo obtener el ID del pedido.');
            }

            await saveOrderDetail(idPedido);

            resetState();
            handleCloseDialog();
            mostrarAlertaFlotante('success', 'Pedido registrado satisfactoriamente.');
        } catch (error) {
            console.error('Hubo un error:', error);
        }
    };

    // Guardar el pedido en la base de datos
    const saveOrder = async () => {
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

            const dataPedido = {
                "CodCliente": idCustomer,
                "Fecha": currentDateFormatted,
                "Observaciones": observation,
                "IdUsuario": auth.id,
                "FechaEntrega": estimatedDate,
                "CodMoneda": 1,
                "TipoCambio": 1,
                "Anulado": false,
                "idVendedor": idSeller,
            }

            // Guardar el pedido en la tabla de pedidos
            const responsePedido = await clienteAxios.post('/pedidos/save', dataPedido, config);

            if (!responsePedido || responsePedido.data.savedOrder.id === 0) {
                throw new Error('No se pudo obtener el ID del pedido.');
            }

            // Extraer el ID del pedido de la respuesta del servidor
            const idPedido = responsePedido.data.savedOrder.id;
            return idPedido;
        } catch (error) {
            console.error('Hubo un error:', error);
        }
    }

    // Guardar detalle del pedido en la base de datos
    const saveOrderDetail = async (idPedido) => {
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

            // Recorrer el array de productos y guardar cada uno en la tabla de detallePedisos
            const orderDetailData = order.map(item => ({
                "IdPedido": idPedido,
                "CodArticulo": item.Codigo,
                "Descripcion": item.Descripcion,
                "Cantidad": item.unidades,
                "PrecioVenta": item.precio
            }));
            for (let item of orderDetailData) {
                const responseOrderDetail = await clienteAxios.post('/detalle_pedidos/save', item, config);

                if (!responseOrderDetail) {
                    throw new Error('Error al guardar el detalle del pedido.');
                }
            }
        } catch (error) {
            console.error(error.response);
            console.error('Hubo un error:', error);
        }
    }

    // Mostrar la tabla con los productos de la orden
    return (
        <div className="card ">
            <div className='mt-2'>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_seller" className="font-bold">Vendedor:</label>
                    <InputText id="txt_seller" value={seller.Nombre || ''} required className='w-6' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_customer" className="font-bold">Cliente:</label>
                    <InputText id="txt_customer" value={customer.Nombre || ''} required className='w-6' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_total" className="font-bold">Total: Q</label>
                    <InputText id="txt_total" value={total ? total.toFixed(2) : ''} required className='w-6' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_estimatedDate" className="font-bold">Fecha de Entrega:</label>
                    <InputText
                        id="txt_estimatedDate"
                        value={estimatedDate ? estimatedDate.toLocaleDateString() : ''}
                        required className='w-6'
                    />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_observation" className="font-bold">Observaciones:</label>
                    <InputTextarea id="observaciones" value={observation} rows={2} cols={35} readOnly />
                </div>
            </div>
            <div className="card flex flex-wrap justify-content-center gap-3 mt-4">
                <Button
                    className="text-white text-sm bg-green-500 p-3 rounded-md font-bold"
                    label="Completar"
                    onClick={() => handleCompleteClick()}
                />
            </div>
            <div className="mt-4">
                <DataTable
                    value={order}
                    size={'small'}
                    showGridlines
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    selectionMode="single"
                    scrollHeight="250px"
                    removableSort
                    className='border border-black-200 divide-y divide-black-200 mt-4'
                >
                    <Column field="Descripcion" header="Descripción" />
                    <Column field="unidades" header="Unidades" />
                    <Column field="total" header="Total" />
                </DataTable>
            </div>
        </div>

    );
}

export default FinishOrder;