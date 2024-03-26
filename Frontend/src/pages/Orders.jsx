    import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';

import FinishOrder from '../components/FinishOrder';
import clienteAxios from '../config/clienteAxios';

const Orders = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalPay, setTotalPay] = useState(0);
    const [commentsText, setCommentsText] = useState('');

    const [estimatedDate, setEstimatedDate] = useState(null);
    const minDate = new Date();
    const [loading, setLoading] = useState(false);

    const [sellers, setSellers] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [filteredSellers, setFilteredSellers] = useState([]);

    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    const [showDialog, setShowDialog] = useState(false);

    const [order, setOrder] = useState([]);

    const toast = useRef(null);

    // Limpiar los estados una vez completado el pedido
    const resetState = () => {
        setSelectedSeller(null);
        setSelectedCustomer(null);
        setSelectedProducts([]);
        setTotalPay(0);
        setCommentsText('');
        setEstimatedDate(null);
    };

    // Mostrar una alerta flotante
    const mostrarAlertaFlotante = (tipo, mensaje) => {
        if (toast.current) {
            toast.current.show({ severity: tipo, summary: 'Información', detail: mensaje });
        } else {
            console.error('La referencia a toast no está inicializada.');
        }
    };

    // Lógica para cargar datos iniciales
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
                const [responseInventory, responseSeller, responseCustomer] = await Promise.all([
                    clienteAxios.get('/dashboard/personalizado', config),
                    clienteAxios.get('/vendedor', config),
                    clienteAxios.get('/cliente/listarClientes', config)
                ]);

                if (!responseInventory || !responseSeller || !responseCustomer) {
                    throw new Error('Error al cargar los productos o los vendedores.');
                }

                const { data: inventoryData } = responseInventory;
                const { data: sellerData } = responseSeller;
                const { data: customerData } = responseCustomer;

                setProducts(inventoryData);
                setSellers(sellerData);
                setCustomers(customerData);

                // Inicialmente, muestra todos los productos y vendedores.
                setFilteredProducts(inventoryData);
                setFilteredSellers(sellerData);
                setFilteredCustomers(customerData);
            } catch (error) {
                console.error('Hubo un error:', error);
            }
        };
        verificarAcceso();
        fetchData();
    }, []);

    // Filtrar productos
    const filterProducts = (event) => {
        const filteredProducts = products.filter(product => {
            if (!product) return false; // Si el producto es indefinido, no lo muestra.
            const barras = String(product.Barras);
            const descripcion = String(product.Descripcion);
            return (
                barras.toLowerCase().includes((event.query || "").toLowerCase()) ||
                descripcion.toLowerCase().includes((event.query || "").toLowerCase())
            );
        });
        setFilteredProducts(filteredProducts);
    };

    // Filtrar vendedores
    const filterSellers = (event) => {
        const filteredSellers = sellers.filter(seller => {
            if (!seller) return false; // Si el vendedor es indefinido, no lo muestra.
            const nombre = String(seller.nombre);
            return nombre.toLowerCase().includes((event.query || "").toLowerCase());
        });
        setFilteredSellers(filteredSellers);
    };

    // Filtrar clientes
    const filterCustomers = (event) => {
        const filteredCustomers = customers.filter(customer => {
            if (!customer) return false; // Si el cliente es indefinido, no lo muestra.
            const nombre = String(customer.nombre);
            return nombre.toLowerCase().includes((event.query || "").toLowerCase());
        });
        setFilteredCustomers(filteredCustomers);
    };

    // Agregar producto al pedido
    const addProduct = () => {
        if (selectedProduct) {
            const existingProduct = selectedProducts.find(product => product.Barras === selectedProduct.Barras);
            if (existingProduct) {
                const updatedProducts = [...selectedProducts];
                updatedProducts[updatedProducts.indexOf(existingProduct)].quantity += 1;
                setSelectedProducts(updatedProducts);
                setSelectedProduct(null);
                return;
            }

            const newProduct = { ...selectedProduct, quantity: 1, id: Math.random().toString(36).substr(2, 9) }; // Generar un ID único
            setSelectedProducts([...selectedProducts, newProduct]);
            setSelectedProduct(null);
        } else {
            mostrarAlertaFlotante('error', 'Seleccione un producto');
            return;
        }
    };

    // Incrementar cantidad de un producto en el pedido
    const incrementQuantity = (productId) => {
        const updatedProducts = selectedProducts.map(product => {
            if (product.id === productId) {
                return { ...product, quantity: product.quantity + 1 };
            }
            return product;
        });
        setSelectedProducts(updatedProducts);
    };

    // Decrementar cantidad de un producto en el pedido
    const decrementQuantity = (productId) => {
        const updatedProducts = selectedProducts.map(product => {
            if (product.id === productId && product.quantity > 1) {
                return { ...product, quantity: product.quantity - 1 };
            }
            return product;
        });
        setSelectedProducts(updatedProducts);
    };

    // Eliminar un producto del pedido
    const removeProduct = (productId) => {
        const updatedProducts = selectedProducts.filter(product => product.id !== productId);
        setSelectedProducts(updatedProducts);
    };

    // Calcular el subtotal de un producto en el pedido
    const calculateSubtotal = (product) => {
        return product.PrecioFinal * product.quantity;
    };

    // Calcular el total del pedido
    const calculateTotal = () => {
        return selectedProducts.reduce((accumulator, product) => accumulator + calculateSubtotal(product), 0);
    };

    // Obtener un arreglo con los productos seleccionados y sus cantidades
    const getVerifiedOrder = () => {
        let totalOrder = 0;
        const verifiedOrder = selectedProducts.map(product => {
            const subtotal = product.quantity * product.PrecioFinal;
            totalOrder += subtotal; // Agregar al total del pedido
            return {
                Codigo: product.codigo,
                Descripcion: product.Descripcion,
                unidades: product.quantity,
                precio: product.PrecioFinal,
                total: subtotal
            };
        });
        return { items: verifiedOrder, total: totalOrder };
    };

    // Mostrar el diálogo con el resumen del pedido
    const showOrderDialog = () => {
        const orderData = getVerifiedOrder();
        setOrder(orderData.items);
        setShowDialog(true);
    };

    // Cerrar el diálogo
    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    // Validar que el pedido tenga todos los campos requeridos
    const checkOrder = () => {
        let errores = [];

        if (!selectedSeller) {
            errores.push('Seleccione un vendedor');
        }
        if (!selectedCustomer) {
            errores.push('Seleccione un cliente');
        }
        if (selectedProducts.length === 0) {
            errores.push('Agregue productos a la orden');
        }
        if (estimatedDate === null) {
            errores.push('Seleccione una fecha de entrega');
        }

        if (errores.length > 0) {
            errores.forEach(error => {
                mostrarAlertaFlotante('error', error);
            });
            return;
        }

        // Muestra el diálogo con el resumen del pedido
        showOrderDialog();
        setTotalPay(calculateTotal());
    };

    // Plantilla de lista de productos en el pedido
    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="grid grid-nogutter">
                {items.map((product) => (
                    <div className="col-12" key={product.id}>
                        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                            <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                                    <div className="text-2xl font-bold text-900">{product.Descripcion}</div>
                                    <div>Cantidad: {product.quantity}</div>
                                    <div>Precio Unitario: Q. {product.PrecioFinal}</div>
                                </div>
                                <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                    <span className="text-1xl md:text-2xl font-bold text-900">Q. {calculateSubtotal(product)} </span>
                                    <div>
                                        <Button icon="pi pi-minus" className="p-button-rounded p-button-danger mx-2" onClick={() => decrementQuantity(product.id)}></Button>
                                        <Button icon="pi pi-plus" className="p-button-rounded p-button-success mx-2" onClick={() => incrementQuantity(product.id)}></Button>
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mx-2" onClick={() => removeProduct(product.id)}></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Plantilla de opción de producto en el Dropdown
    const productOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.Barras} - {option.Descripcion}</div>
            </div>
        );
    };

    // Plantilla de producto seleccionado en el Dropdown
    const selectedProductTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.Barras} - {option.Descripcion}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="flex justify-content-center mt-2">
                Selecciona un vendedor
            </div>
            <div className="card flex justify-content-center gap-3 mt-2">
                <Dropdown
                    value={selectedSeller}
                    onChange={(e) => setSelectedSeller(e.value)}
                    options={filteredSellers}
                    optionLabel="nombre"
                    placeholder="Vendedor"
                    filter
                    filterBy="nombre"
                    onFilter={(e) => filterSellers(e)}
                    className="w-full md:w-25rem"
                />
            </div>
            <div className="flex justify-content-center mt-2">
                Selecciona un cliente
            </div>
            <div className="card flex justify-content-center gap-3 mt-2">
                <Dropdown
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.value)}
                    options={filteredCustomers}
                    optionLabel="Nombre"
                    placeholder="Cliente"
                    filter
                    filterBy="Nombre"
                    onFilter={(e) => filterCustomers(e)}
                    className="w-full md:w-25rem"
                />
            </div>
            <div className="flex justify-content-center mt-2">
                Selecciona un producto
            </div>
            <div className="card flex justify-content-center gap-3 mt-2">
                <Dropdown
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.value)}
                    options={filteredProducts}
                    optionLabel="Barras"
                    placeholder="Producto"
                    filter
                    filterBy="Barras,Descripcion"
                    itemTemplate={productOptionTemplate}
                    valueTemplate={selectedProductTemplate}
                    onFilter={(e) => filterProducts(e)}
                    className="w-full md:w-25rem"
                />
            </div>
            <div className="card flex flex-wrap justify-content-center gap-3 mt-4">
                <Button className='text-white text-sm bg-sky-600 p-3 rounded-md  font-bold' label="Agregar" icon="pi pi-check" loading={loading} onClick={addProduct} />
            </div>
            <div className="card flex flex-wrap justify-content-center gap-3 mt-5">
                <span className="p-float-label">
                    <InputTextarea value={commentsText} onChange={(e) => setCommentsText(e.target.value)} rows={3} cols={30} />
                    <label htmlFor="observaciones">Observaciones del pedido</label>
                </span>
            </div>
            <div className="flex justify-content-center mt-3">
                Fecha de entrega
            </div>
            <div className="card flex flex-wrap gap-3 p-fluid justify-content-center mt-3">
                <Calendar id="buttondisplay" value={estimatedDate} onChange={(e) => setEstimatedDate(e.value)} dateFormat="dd/mm/yy" placeholder="Fecha de entrega" showIcon readOnlyInput minDate={minDate} />
            </div>
            <div className="flex justify-content-center mt-3">
            <span className="text-1xl font-semibold">Total: Q.</span>
            </div>
            <div className="card flex justify-content-center gap-3 mt-3">
                <InputNumber className="font-semibold" value={calculateTotal()} minFractionDigits={2} maxFractionDigits={5} disabled />
            </div>
            <div className="card flex justify-content-center gap-3 mt-4">
                <Button className="text-white text-sm bg-green-500 p-3 rounded-md  font-bold" label="Verificar orden" onClick={checkOrder} />
            </div>
            <Dialog header="Resumen" className="summary-dialog" visible={showDialog} onHide={() => setShowDialog(false)} style={{ width: '85%', maxWidth: '600px', maxHeight: '80%', overflow: 'auto' }}>
                <div className="">
                    <FinishOrder
                        order={order}
                        idCustomer={selectedCustomer ? selectedCustomer.CodCliente : null}
                        idSeller={selectedSeller ? selectedSeller : null}
                        total={totalPay}
                        observation={commentsText}
                        estimatedDate={estimatedDate}
                        resetState={resetState}
                        handleCloseDialog={handleCloseDialog}
                        mostrarAlertaFlotante={mostrarAlertaFlotante}
                    />
                </div>
            </Dialog>
            <div className="card mt-4">
                {selectedProducts.map((product, index) => (
                    <div key={index}>
                        <DataView value={[product]} listTemplate={listTemplate} />
                        {index !== selectedProducts.length - 1 && <hr className="my-2 border-gray-300" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;