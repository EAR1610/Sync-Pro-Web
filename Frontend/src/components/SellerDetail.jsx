import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DataView } from 'primereact/dataview';

import clienteAxios from '../config/clienteAxios';

const SellerDetail = ({ sellerDialog, setSellerDialog, sellerRecord }) => {
    const [sellerDetail, setSellerDetail] = useState([]);

    useEffect(() => {
        const getSellerDetails = async () => {
            if (sellerRecord && sellerRecord.Id) {
                const token = localStorage.getItem('token');
                if (!token){
                    return;
                }

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const response = await clienteAxios.get(`/vendedor/id/${sellerRecord.Id}`, config);
                const { data } = response;
                if (data) {
                    setSellerDetail(data);
                }
            }
        }
        getSellerDetails();
    }, [sellerRecord]);

    // Ocultar diálogo
    const hideDialog = () => {
        setSellerDialog(false);
    };


    return (
        <Dialog
            visible={sellerDialog}
            style={{ width: '800px' }}
            header={`Detalle del Vendedor con Id: ${sellerRecord.Id}`}
            modal className="p-fluid"
            onHide={hideDialog}
        >
            <div className='mt-2'>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_dpi" className="font-bold">DPI:</label>
                    <InputText id="txt_dpi" value={sellerRecord.Cedula} required className='w-4' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_vendedor" className="font-bold">Nombre:</label>
                    <InputText id="txt_vendedor" value={sellerRecord.Nombre} required className='w-4' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_telefono" className="font-bold">Teléfono:</label>
                    <InputText id="txt_telefono" value={sellerRecord.Telefono} required className='w-4' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_celular" className="font-bold">Celular:</label>
                    <InputText id="txt_celular" value={sellerRecord.Celular} required className='w-4' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_direccion" className="font-bold">Dirección:</label>
                    <InputText id="txt_direccion" value={sellerRecord.Direccion} required className='w-4' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_correo" className="font-bold">Correo:</label>
                    <InputText id="txt_correo" value={sellerRecord.Correo} required className='w-4' />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_comision" className="font-bold">Comision:</label>
                    <InputText id="txt_comision" value={sellerRecord.Comision} required className='w-4' />
                </div>
            </div>
        </Dialog>
    );
}

export default SellerDetail;