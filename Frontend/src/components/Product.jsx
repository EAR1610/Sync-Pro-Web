import { useState, useEffect, React } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Skeleton } from 'primereact/skeleton';
import clienteAxios from '../config/clienteAxios';

const Product = ({ productDialog, setProductDialog, product }) => {
  const [imagenURL, setImagenURL] = useState(null);
  const [inventario, setInventario] = useState(product);

  useEffect(() => {
    const cargarImagen = async () => {        
        if (product && product.Barras) {
            const token = localStorage.getItem('token');
            if( !token ) {
                setCargando(false);
                return;
            }
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
    
            const response = await clienteAxios.get(`/dashboard/personalizado/${product.Barras}`, config);
            
            const { data } = response;
            if (Array.isArray(data) && data.length > 0) {
                mostrarImagen(data[0].ImagenByte);
                setInventario(data[0]);
              } else {
                setInventario(null);
                setImagenURL(null);
              }      
        }
    }
    cargarImagen();
  }, [product]);

  const mostrarImagen = (imagenByte) => {
    if (imagenByte && imagenByte.data) {

      const tipoImagen = imagenByte.type || 'image/jpeg';
      const bytesArray = new Uint8Array(imagenByte.data);
      const blob = new Blob([bytesArray], { type: tipoImagen });
      const url = URL.createObjectURL(blob);
      setImagenURL(url);
    }
  };

  const hideDialog = () => {
    // setSubmitted(false);
    setProductDialog(false);
  };

  return (
    <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles" modal className="p-fluid" onHide={hideDialog}>      
      {imagenURL ? <img src={imagenURL} style={{ width: '200px', height: '200px' }} alt={inventario.Descripcion} className="product-image block m-auto pb-3" /> : <Skeleton width="100%" height='10rem'></Skeleton>}
      <div className="field">
        <label htmlFor="barras" className="font-bold">
          Barras
        </label>
        <InputText id="barras" value={inventario.Barras} required autoFocus className={classNames({ 'p-invalid': !product.name })} />
        {!inventario.Barras && <small className="p-error">Name is required.</small>}
      </div>
      <div className="field">
        <label htmlFor="descripcion" className="font-bold">
          Nombre
        </label>
        <InputText id="descripcion" value={inventario.Descripcion} required autoFocus className={classNames({ 'p-invalid': !product.name })} />
        {!inventario.Descripcion && <small className="p-error">Name is required.</small>}
      </div>
      <div className="field">
        <label htmlFor="observaciones" className="font-bold">
          Observaciones
        </label>
        <InputTextarea id="observaciones" value={inventario.Observaciones} required rows={3} cols={20} />
      </div>


      <div className="formgrid grid">
        <div className="field col">
          <label htmlFor="price" className="font-bold">
            Precio
          </label>
          <InputNumber id="price" value={inventario.PrecioFinal} disabled/>
        </div>
        <div className="field col">
          <label htmlFor="quantity" className="font-bold">
            Existencia
          </label>
          <InputNumber id="quantity" value={inventario.Existencia} disabled/>
        </div>
      </div>
    </Dialog>
  )
}

export default Product
