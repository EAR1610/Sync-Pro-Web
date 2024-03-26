import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import clienteAxios from '../config/clienteAxios';
import useAuth from "../hook/useAuth"

const FinishOrder = ({ order, idCustomer, idSeller, total,
    observation, estimatedDate, resetState, handleCloseDialog,
    mostrarAlertaFlotante }) => {

    const [seller, setSeller] = useState([]);
    const [customer, setCustomer] = useState([]);
    const fechaFormateada = new Date().toISOString().split('T')[0];

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
                    clienteAxios.get(`/cliente/buscarClientePorId/${idCustomer}`, config)
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
            await saveOrderDetail(idPedido);

            // Resetea el estado de la aplicación
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
                "Fecha": fechaFormateada,
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

            if (!responsePedido || responsePedido.data.pedidoGuardado.id === 0) {
                throw new Error('No se pudo obtener el ID del pedido.');
            }

            // Extraer el ID del pedido de la respuesta del servidor
            const idPedido = responsePedido.data.pedidoGuardado.id;
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
            <div className="flex flex-col items-center sm:items-start">
                <div className="mt-4"><span className="font-bold">Vendedor: </span>{seller && seller.Nombre}</div>
                <div className="mt-4"><span className="font-bold">Cliente: </span>{customer && customer.Nombre}</div>
                <div className="mt-4 flex items-center">
                    <span className="font-bold">Total: Q </span>
                    <span>. {total.toFixed(2)}</span>
                </div>
                <div className="mt-4"><span className="font-bold">Observaciones:</span></div>
                <div className="mt-2">{observation} </div>
            </div>
            <div className="card flex flex-wrap justify-content-center gap-3 mt-4">
                <Button className="text-white text-sm bg-green-500 p-3 rounded-md font-bold" label="Completar" onClick={() => handleCompleteClick()} />
            </div>
            <div className="mt-4">
                <DataTable value={order}>
                    <Column field="Descripcion" header="Descripción" />
                    <Column field="unidades" header="Unidades" />
                    <Column field="total" header="Total" />
                </DataTable>
            </div>
        </div>

    );
}

export default FinishOrder;

