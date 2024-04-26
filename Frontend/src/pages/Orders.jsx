import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';

import FinishOrder from '../components/FinishOrder';
import clienteAxios from '../config/clienteAxios';
import OrderDetail from '../components/OrderDetail';

const Orders = () => {

    const [products, setProducts] = useState([]);
    const [commentsText, setCommentsText] = useState('');
    const [sellers, setSellers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [order, setOrder] = useState([]);
    const [orders, setOrders] = useState([]);
    const [orderRecord, setOrderRecord] = useState([]);

    // Seleccionar
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Filtrar
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filteredSellers, setFilteredSellers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [filteredOrder, setFilteredOrder] = useState({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });

    // Operar
    const [estimatedDate, setEstimatedDate] = useState(null);
    const minDate = new Date();
    const [totalPay, setTotalPay] = useState(0);

    // Acción
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const toast = useRef(null);
    const [orderDialog, setOrderDialog] = useState(false);

    // Cargar datos iniciales
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
                    clienteAxios.get('/cliente', config)
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

    // Abrir diálogo con el detalle del pedido
    const viewOrderDetail = (rowData) => {
        setOrderDialog(true);
        setOrderRecord(rowData)
    };

    // Plantilla de acciones en la tabla de pedidos
    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                icon="pi pi-eye"
                onClick={() => viewOrderDetail(rowData)}
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

    // Verificar búsqueda de pedidos
    const verificarBusqueda = () => {
        if (selectedSeller === null) {
            mostrarAlertaFlotante('error', 'Seleccione un vendedor');
            return;
        }
        mostrarAlertaFlotante('info', 'Consultando pedidos...');
        getOrderbySeller();
    };

    // Obtener los pedidos por vendedor
    const getOrderbySeller = async () => {
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

            let url = '';
            if (selectedSeller.nombre !== 'Sin especificar' && selectedSeller !== null) {
                url = `/pedidos/list/seller/${selectedSeller}`;
            } else if (selectedSeller.nombre === 'Sin especificar') {
                url = '/pedidos/list/custom';
            } else if (selectedSeller === null) {
                mostrarAlertaFlotante('error', 'Seleccione una opción válida');
            }

            const response = await clienteAxios.get(url, config);
            if (!response) {
                throw new Error('Error al cargar los pedidos.');
            }

            const { data: ordersData } = response || {};

            // Si no hay pedidos, mostrar una alerta y salir de la función
            if (ordersData.length === 0) {
                mostrarAlertaFlotante('error', 'El vendedor aún no tiene pedidos.');
                return;
            }

            // Ordenar los datos por fecha de pedido (más antigua a más reciente)
            ordersData.sort((a, b) => {
                const [dayA, monthA, yearA] = a.fecha_pedido.split('-');
                return new Date(yearA, monthA - 1, dayA);
            });

            setOrders(ordersData);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                mostrarAlertaFlotante('warn', 'El vendedor aún no tiene pedidos.');
            } else {
                console.error('Hubo un error:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * TODO: Cuando se filtra y el vendedor no tiene pedidos, se muestra un error en consola.
     */
    return (
        <div>
            <TabView>
                <TabPanel header="Agregar">
                    <Toast ref={toast} />
                    <div className="flex justify-content-center mt-4">
                        <div className="card flex flex-col justify-content-center gap-3 w-full md:w-3/4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col justify-content-center">
                                    <div className="mt-2">Selecciona un vendedor</div>
                                    <div className="flex justify-content-center gap-3 mt-2">
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
                                </div>
                                <div className="flex flex-col justify-content-center">
                                    <div className="mt-2">Selecciona un cliente</div>
                                    <div className="flex justify-content-center gap-3 mt-2">
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
                                </div>
                                <div className="flex flex-col justify-content-center">
                                    <div className="mt-2">Fecha de entrega</div>
                                    <div className="flex justify-content-center gap-3 mt-2">
                                        <Calendar
                                            id="buttondisplay"
                                            value={estimatedDate}
                                            onChange={(e) => setEstimatedDate(e.value)}
                                            dateFormat="dd/mm/yy"
                                            placeholder="Fecha de entrega"
                                            showIcon
                                            readOnlyInput
                                            minDate={minDate}
                                            style={{ width: '220px' }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-content-center">
                                    <div className="flex justify-content-center gap-3 mt-4">
                                        <span className="p-float-label">
                                            <InputTextarea
                                                value={commentsText}
                                                onChange={(e) => setCommentsText(e.target.value)}
                                                rows={2}
                                                cols={30}
                                            />
                                            <label htmlFor="observaciones">Observaciones del pedido</label>
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-content-center">
                                    <div className="mt-2">Selecciona un producto</div>
                                    <div className="flex flex-col md:flex-row justify-content-center md:justify-content-start gap-3 mt-2">
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
                                        <div className="flex-shrink-0">
                                            <Button
                                                className='text-white text-sm bg-sky-600 p-3 rounded-md font-bold md:mt-0'
                                                label="Agregar"
                                                icon="pi pi-check"
                                                loading={loading}
                                                onClick={addProduct}
                                                style={{ maxWidth: '10rem' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-content-center gap-5 mt-3">
                                <div className="text-1xl font-semibold mt-3">Total:</div>
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
                                    <InputNumber
                                        className="font-semibold"
                                        value={calculateTotal()}
                                        minFractionDigits={2}
                                        maxFractionDigits={5}
                                        disabled
                                    />
                                    <Button className="text-white text-sm bg-green-500 p-3 rounded-md font-bold"
                                        label="Verificar orden"
                                        onClick={checkOrder}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Dialog
                        header="Resumen"
                        className="summary-dialog"
                        visible={showDialog}
                        onHide={() => setShowDialog(false)}
                        style={{ width: '85%', maxWidth: '600px', maxHeight: '80%', overflow: 'auto' }}
                    >
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
                </TabPanel>
                <TabPanel header="Listar">
                    <Toast ref={toast} />
                    <div className="flex flex-col justify-content-center">
                        <div className="mt-2">Filtrar pedidos por vendedor</div>
                        <div className="flex gap-3 mt-2">
                            <Dropdown
                                value={selectedSeller}
                                onChange={(e) => setSelectedSeller(e.value)}
                                options={[{ nombre: 'Sin especificar' }, ...filteredSellers]}
                                optionLabel="nombre"
                                placeholder="Selecciona un vendedor"
                                filter
                                filterBy="nombre"
                                onFilter={(e) => filterSellers(e)}
                                className="md:w-25rem gap-3"
                            />
                            <Button
                                label="Buscar"
                                severity="secondary"
                                raised
                                onClick={verificarBusqueda}
                                className='text-white text-sm bg-sky-600 p-3 rounded-md font-bold md:mt-0'
                            />
                        </div>
                    </div>
                    <div className="card mt-3">
                        <DataTable
                            dataKey="Id_pedido"
                            value={orders}
                            size={'small'}
                            tableStyle={{ minWidth: '50rem' }}
                            loading={loading}
                            showGridlines
                            paginator
                            rows={25}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            selectionMode="single"
                            filters={filteredOrder}
                            scrollable
                            scrollHeight="500px"
                            removableSort
                            className='border border-black-200 divide-y divide-black-200'
                        >
                            <Column body={actionBodyTemplate} header="Acciones" exportable={false}></Column>
                            <Column field="Id_pedido" header="Código"></Column>
                            <Column field="Vendedor" header="Vendedor"></Column>
                            <Column field="fecha_pedido" header="Fecha de Pedido" style={{ width: '10%' }}></Column>
                            <Column field="fecha_entrega" header="Fecha de Entrega" ></Column>
                            <Column field="Observaciones" header="Observación"></Column>
                            <Column field="Cliente" header="Cliente"></Column>
                            <Column field="Total" header="Total"></Column>
                        </DataTable>
                    </div>
                    {orderDialog &&
                        <OrderDetail
                            orderDialog={orderDialog}
                            setOrderDialog={setOrderDialog}
                            orderRecord={orderRecord}
                        />
                    }
                </TabPanel>
            </TabView>
        </div >
    );
};

export default Orders;