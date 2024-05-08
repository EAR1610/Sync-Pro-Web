import { useState, useEffect } from "react"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import clienteAxios from "../../config/clienteAxios"

const CustomerDetail = ({ customerDialog, setCustomerDialog, customerRecord }) => {
    const [customerDetail, setCustomerDetail] = useState([]);
    const [typeDocument, setTypeDocument] = useState('');

    //identificationDocument

    useEffect(() => {
        const getCustomerDetail = async () => {
            if (customerRecord && customerRecord.CodCliente) {
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

                const response = await clienteAxios.get(`/cliente/id/${customerRecord.CodCliente}`, config);
                const { data } = response;
                if (data) {
                    setCustomerDetail(data);
                }

                if ((data.DPI && data.Cedula.length === 12) || (data.Cedula.length === 12)) {
                    setTypeDocument("DPI");
                } else if ((data.DPI === false && data.Cedula.length === 9) || (data.Cedula.length === 9)) {
                    setTypeDocument("NIT");
                } else if ((data.DPI === false && data.Cedula === "CF") || (data.Cedula === "CF")) {
                    setTypeDocument("Consumidor Final");
                }
            }
        }
        getCustomerDetail();
    }, [customerRecord], [typeDocument]);

    const hideDialog = () => {
        setCustomerDialog(false);
    };

    return (
        <Dialog
            visible={customerDialog}
            style={{ width: '600px' }}
            header={`Detalle del Cliente No. ${customerRecord.CodCliente}`}
            modal className="p-fluid"
            onHide={hideDialog}
        >
            <div className='mt-2'>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_tipo_documento" className="font-bold">Tipo de Documento:</label>
                    <InputText
                        id="txt_tipo_documento"
                        value={typeDocument}
                        className='w-4'
                        style={{ height: '30px' }}
                    />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_cedula" className="font-bold">Documento de Identificación:</label>
                    <InputText
                        id="txt_cedula"
                        value={customerDetail.Cedula}
                        className='w-4'
                        style={{ height: '30px' }}
                    />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_nombre" className="font-bold">Nombre:</label>
                    <InputText
                        id="txt_nombre"
                        value={customerDetail.Nombre}
                        className='w-4'
                        style={{ height: '30px' }}
                    />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_tel1" className="font-bold">Teléfono 1:</label>
                    <InputText
                        id="txt_tel1"
                        value={customerDetail.Telefono1}
                        className='w-4'
                        style={{ height: '30px' }}
                    />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_tel2" className="font-bold">Teléfono 2:</label>
                    <InputText
                        id="txt_tel2"
                        value={customerDetail.Telefono2}
                        className='w-4'
                        style={{ height: '30px' }}
                    />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_celular" className="font-bold">Celular:</label>
                    <InputText
                        id="txt_celular"
                        value={customerDetail.Celular}
                        className='w-4'
                        style={{ height: '30px' }}
                    />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_direccion" className="font-bold">Dirección:</label>
                    <InputText
                        id="txt_direccion"
                        value={customerDetail.Direccion}
                        className='w-4'
                        style={{ height: '30px' }}
                    />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_limite" className="font-bold">Limite:</label>
                    <InputText
                        id="txt_limite"
                        value={customerDetail.LimiteCredito}
                        className='w-4'
                        style={{ height: '30px' }}
                    />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_plazo_credito" className="font-bold">Plazo de Crédito:</label>
                    <InputText
                        id="txt_plazo_credito"
                        value={customerDetail.PlazoCredito}
                        className='w-4'
                        style={{ height: '30px' }}
                    />
                </div>
                <div className='flex justify-between items-center m-2'>
                    <label htmlFor="lbl_observacion" className="font-bold">Observaciones:</label>
                    <InputText
                        id="txt_observacion"
                        value={customerDetail.Observaciones}
                        className='w-4'
                        style={{ height: '30px' }}
                    />
                </div>
            </div>
        </Dialog>
    )
}

export default CustomerDetail