import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import clienteAxios from '../config/clienteAxios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const OrderDetail = ({ orderDialog, setOrderDialog, orderRecord }) => {
    const [orderDetail, setOrderDetail] = useState([]);

    useEffect(() => {
        const getOrderDetails = async () => {
            if (orderRecord && orderRecord.Id_pedido) {
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

                const response = await clienteAxios.get(`/detalle_pedidos/list/${orderRecord.Id_pedido}`, config);
                const { data } = response;
                if (data) {
                    setOrderDetail(data);
                }
            }
        }
        getOrderDetails();
    }, [orderRecord]);

    const hideDialog = () => {
        setOrderDialog(false);
    };

    return (
        <Dialog
            visible={orderDialog}
            style={{ width: '800px' }}
            header={`Detalle del Pedido No. ${orderRecord.Id_pedido}`}
            modal className="p-fluid"
            onHide={hideDialog}
        >
            <div className='mt-2'>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_vendedor" className="font-bold">Vendedor:</label>
                    <InputText id="txt_vendedor" value={orderRecord.Vendedor} required className='w-4' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_cliente" className="font-bold">Cliente:</label>
                    <InputText id="txt_cliente" value={orderRecord.Cliente} required className='w-4' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_fecha_pedido" className="font-bold">Fecha Pedido:</label>
                    <InputText id="txt_fecha_pedido" value={orderRecord.fecha_pedido} required className='w-4' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_fecha_entrega" className="font-bold">Fecha Entrega:</label>
                    <InputText id="txt_fecha_pedido" value={orderRecord.fecha_entrega} required className='w-4' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_total_pedido" className="font-bold">Total Pedido: Q.</label>
                    <InputText id="txt_total_pedido" value={orderRecord.Total} required className='w-4' />
                </div>
                <div className="datatable-wrapper">
                    <DataTable
                        value={orderDetail}
                        size={'small'}
                        showGridlines
                        paginator
                        rows={5}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        selectionMode="single"
                        scrollHeight="400px"
                        removableSort
                        className='border border-black-200 divide-y divide-black-200 mt-4'
                    >
                        <Column field="Producto" header="Producto" sortable className='w-6'></Column>
                        <Column field="Unidades" header="Unidades" sortable className='w-2'></Column>
                        <Column field="Precio_individual" header="Precio Unitario" sortable ></Column>
                    </DataTable>
                </div>
            </div>
        </Dialog>
    );
}

export default OrderDetail;
