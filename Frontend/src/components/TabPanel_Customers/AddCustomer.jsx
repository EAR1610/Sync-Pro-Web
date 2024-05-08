import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';

import clienteAxios from '../../config/clienteAxios';

const AddCustomer = (props) => {

    const [customer, setCustomer] = useState({
        CodCliente: 0,
        Cedula: 'CF',
        Nombre: '',
        Observaciones: '',
        Telefono1: '',
        Telefono2: '',
        Celular: '',
        Email: '',
        Direccion: '',
        Credito: false,
        LimiteCredito: 0,
        PlazoCredito: 0,
        TipoPrecio: 0,
        Restriccion: false,
        CodMoneda: 0,
        Moroso: 0,
        InHabilitado: 0,
        FechaIngreso: '',
        IdLocalidad: 0,
        IdAgente: 0,
        PermiteDescuento: false,
        Descuento: 0,
        MaxDescuento: 0,
        Exonerar: false,
        Codigo: '',
        Contacto: '',
        TelContacto: '',
        DPI: 0,
        Categoria: 0,
    });
    const [currencies, setCurrencies] = useState(null);
    const [sellers, setSellers] = useState(null);
    const [locations, setLocations] = useState(null);
    const [customerCategories, setCustomerCategories] = useState(null);

    const typePrice = [
        { name: 'PRECIO A', code: '1' },
        { name: 'PRECIO B', code: '2' },
        { name: 'PRECIO C', code: '3' },
        { name: 'PRECIO D', code: '4' }
    ];

    // Seleccionar
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [selectedTypePrice, setSelectedTypePrice] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedCustomerCategory, setSelectedCustomerCategory] = useState(null);
    const [isCFSelected, setIsCFSelected] = useState(true);

    // Filtrar
    const [filteredCurrencies, setFilteredCurrencies] = useState(null);
    const [filteredSellers, setFilteredSellers] = useState(null);
    const [filteredTypePrices, setFilteredTypePrices] = useState(typePrice);
    const [filteredLocations, setFilteredLocations] = useState(null);
    const [filteredCustomerCategories, setFilteredCustomerCategories] = useState(null);

    // Acción
    const toast = useRef(null);
    const today = new Date();
    const formattedSaveDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [creditActive, setCreditActive] = useState(false);
    const [discountRestrictionsActive, setDiscountRestrictionsActive] = useState(false);
    const { editingCustomer } = props;

    // Manejar cambios en los campos del cliente
    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Manejar cambios de los campos InputNumber
    const handleInputNumberCustomerChange = (name) => (e) => {
        setCustomer(prevState => ({
            ...prevState,
            [name]: e.value || 0
        }));
    };

    // Limitar el ingreso de caracteres
    const handleKeyPress = (event) => {
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
        }
    };

    // Cambio en RadioButton "CF"
    const handleCFChange = () => {
        setIsCFSelected(true);

        // Modificar los campos de Cedula y DPI
        handleCustomerChange({ target: { name: 'DPI', value: 0 } });
        handleCustomerChange({ target: { name: 'Cedula', value: 'CF' } });
    };

    // Cambio en RadioButton "NIT"
    const handleNITChange = () => {
        setIsCFSelected(false);

        // Modificar los campos de Cedula y DPI
        handleCustomerChange({ target: { name: 'DPI', value: 0 } });
        const numericCedula = customer.Cedula.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
        handleCustomerChange({ target: { name: 'Cedula', value: numericCedula } });
    };

    // Cambio en RadioButton "DPI"
    const handleDPIChange = () => {
        setIsCFSelected(false);

        // Modificar los campos de Cedula y DPI
        handleCustomerChange({ target: { name: 'DPI', value: 1 } });
        const numericCedula = customer.Cedula.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
        handleCustomerChange({ target: { name: 'Cedula', value: numericCedula } });
    };

    // Validar la longitud de la entrada del Documento de Identificación
    const validateInputLength = (e) => {
        const maxLength = customer.DPI === 0 ? 9 : 12;
        if (e.target.value.length !== maxLength) {
            return `Debe ingresar exactamente ${maxLength} caracteres numéricos en el campo Documento de Identificación.`;
        }
        return ''; // Devuelve una cadena vacía si la validación fue exitosa
    };

    // Mostrar una alerta flotante
    const showFloatingAlert = (tipo, mensaje) => {
        if (toast.current) {
            toast.current.show({ severity: tipo, summary: 'Información', detail: mensaje });
        } else {
            console.error('La referencia a toast no está inicializada.');
        }
    };

    // Filtrar monedas
    const filterCurrencies = (event) => {
        if (creditActive) { // Solo realiza la búsqueda si creditActive es verdadero
            const filteredCurrencies = currencies.filter(currency => {
                if (!currency) return false; // Si la moneda es indefinida, no lo muestra.
                const nombre = String(currency.nombre);
                return nombre.toLowerCase().includes((event.query || "").toLowerCase());
            });
            setFilteredCurrencies(filteredCurrencies);
        }
    };

    // Filtrar vendedores
    const filterSellers = (event) => {
        const filteredSellers = sellers.filter(seller => {
            if (!seller) return false; // Si el vendedor es indefinido, no lo muestra.
            const nombre = String(seller.Nombre);
            return nombre.toLowerCase().includes((event.query || "").toLowerCase());
        });
        setFilteredSellers(filteredSellers);
    };

    // Filtrar tipos de precio
    const filterTypePrices = (event) => {
        const filteredTypePrices = typePrice.filter(typePrice => {
            if (!typePrice) return false; // Si el tipo de precio es indefinido, no lo muestra.
            const nombre = String(typePrice.name);
            return nombre.toLowerCase().includes((event.query || "").toLowerCase());
        });
        setFilteredTypePrices(filteredTypePrices);
    };

    // Filtrar localidades
    const filterLocations = (event) => {
        const filteredLocations = locations.filter(location => {
            if (!location) return false; // Si la localidad es indefinida, no lo muestra.
            const nombre = String(location.Nombre);
            return nombre.toLowerCase().includes((event.query || "").toLowerCase());
        });
        setFilteredLocations(filteredLocations);
    };

    // Filtrar categorías de cliente
    const filterCustomerCategories = (event) => {
        const filteredCustomerCategories = customerCategories.filter(customerCategory => {
            if (!customerCategory) return false; // Si la categoría del cliente es indefinida, no la muestra.
            const nombre = String(customerCategory.NombreCategoria);
            return nombre.toLowerCase().includes((event.query || "").toLowerCase());
        });
        setFilteredCustomerCategories(filteredCustomerCategories);
    };

    // Cambiar la moneda seleccionada (Codigo)
    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.value);
        setCustomer({ ...customer, CodMoneda: e.value.Codigo });
    };

    // Cambiar el vendedor seleccionado
    const handleSellerChange = (e) => {
        setSelectedSeller(e.value);
        setCustomer({ ...customer, IdAgente: e.value.Codigo });
    };

    // Cambiar el tipo de precio seleccionado
    const handleTypePriceChange = (e) => {
        setSelectedTypePrice(e.value);
        setCustomer({ ...customer, TipoPrecio: e.value.code });
    };

    // Cambiar la localidad seleccionada
    const handleLocationChange = (e) => {
        setSelectedLocation(e.value);
        setCustomer({ ...customer, IdLocalidad: e.value.Codigo });
    };

    // Cambiar la categoría de cliente seleccionada
    const handleCustomerCategoryChange = (e) => {
        if (e.value) {
            setSelectedCustomerCategory(e.value);
            setCustomer({ ...customer, Categoria: e.value.id });
        } else {
            setSelectedCustomerCategory(null);
            setCustomer({ ...customer, Categoria: 0 });
        }
    };

    // Función para manejar el cambio en el checkbox de Activar/Desactivar Crédito
    const handleCreditChange = (e) => {
        const isChecked = e.target.checked;
        setCreditActive(isChecked);

        // Si "Activar crédito" está desactivado, resetea los valores
        if (!isChecked) {
            setCustomer(prevState => ({
                ...prevState,
                Credito: false,
                CodMoneda: 0,
                LimiteCredito: 0,
                PlazoCredito: 0,
                Restriccion: 0,
                Moroso: 0,
                Exonerar: 0
            }));
        } else {
            // Si "Activar crédito" está activado, establece Credito a true
            setCustomer(prevState => ({
                ...prevState,
                Credito: true
            }));

            // Si hay monedas disponibles, selecciona la primera
            if (currencies && currencies.length > 0) {
                setSelectedCurrency(currencies[0]);
                setCustomer(prevState => ({
                    ...prevState,
                    CodMoneda: currencies[0].Codigo
                }));
            }
        }
    };

    // Manejar cambios en los checkbox de SinLimiteCredito, Moroso y Exonerar
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCustomer(prevState => ({
            ...prevState,
            [name]: checked ? 1 : 0
        }));
    };

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

                const [responseCurrency, responseSeller, responseLocation, responseCustomerCategory] = await Promise.all([
                    clienteAxios.get('/moneda', config),
                    clienteAxios.get('/vendedor/full_details', config),
                    clienteAxios.get('/localidad', config),
                    clienteAxios.get('/categoria_cliente', config)
                ]);

                if (!responseCurrency) {
                    throw new Error('Error al cargar las monedas.');
                }
                if (!responseSeller) {
                    throw new Error('Error al cargar los productos o los vendedores.');
                }
                if (!responseLocation) {
                    throw new Error('Error al cargar las localidades.');
                }
                if (!responseCustomerCategory) {
                    throw new Error('Error al cargar las categorías de cliente.');
                }

                /**
                 * ! No se está tomando en cuenta que una categoría de cliente puede ser nula. Corregir en la API.
                 */
                const { data: currencyData } = responseCurrency;
                const { data: sellerData } = responseSeller;
                const { data: locationData } = responseLocation;
                const { data: customerCategoryData } = responseCustomerCategory;

                setCurrencies(currencyData);
                setSellers(sellerData);
                setLocations(locationData);
                setCustomerCategories(customerCategoryData);

                // Inicialmente, muestra todos los datos
                setFilteredCurrencies(currencyData);
                setFilteredSellers(sellerData);
                setFilteredLocations(locationData);
                setFilteredCustomerCategories(customerCategoryData);

                // Establecer el selección por defecto
                if (!editingCustomer) {
                    if (currencyData.length > 0) {
                        setSelectedCurrency(currencyData[0]);
                    }
                    if (sellerData.length > 0) {
                        setSelectedSeller(sellerData[0]);
                    }
                    if (typePrice.length > 0) {
                        setSelectedTypePrice(typePrice[0]);
                    }
                    if (locationData.length > 0) {
                        setSelectedLocation(locationData[0]);
                    }
                    if (customerCategoryData.length > 0) {
                        setSelectedCustomerCategory(customerCategoryData[0]);
                    }
                }

                // Establecer el estado de los dropdowns si se está editando un cliente
                if (editingCustomer) {
                    setCustomer(editingCustomer);
                    setIsCFSelected(editingCustomer.DPI === 0 && editingCustomer.Cedula === 'CF');
                    setCreditActive(editingCustomer.Credito);
                    setDiscountRestrictionsActive(editingCustomer.PermiteDescuento);

                    // Establecer los valores de los checkbox
                    setCustomer({
                        ...editingCustomer,
                        Restriccion: editingCustomer.Restriccion ? 1 : 0,
                        Moroso: editingCustomer.Moroso ? 1 : 0,
                        Exonerar: editingCustomer.Exonerar ? 1 : 0,
                    });
                } else {
                    setCustomer({
                        ...customer,
                        DPI: 0,
                        Cedula: 'CF',
                    });
                    setIsCFSelected(true);
                }
            } catch (error) {
                console.error('Hubo un error:', error);
            }
        };

        fetchData();
        verificarAcceso();
    }, [editingCustomer]);

    // Actualizar los dropdowns si se está editando un cliente
    useEffect(() => {
        if (editingCustomer) {
            if (currencies) {
                setSelectedCurrency(currencies.find(currency => currency.Codigo === editingCustomer.CodMoneda));
            }
            if (sellers) {
                setSelectedSeller(sellers.find(seller => seller.Id === editingCustomer.IdAgente));
            }
            if (locations) {
                setSelectedLocation(locations.find(location => location.id == editingCustomer.IdLocalidad));
            }
            if (customerCategories) {
                setSelectedCustomerCategory(customerCategories.find(category => category.id === editingCustomer.Categoria));
            }
            if (typePrice.length > 0) {
                setSelectedTypePrice(typePrice.find(type => type.code == editingCustomer.TipoPrecio));
            }
        }
    }, [currencies, sellers, locations, customerCategories]);

    // Agrega una función para manejar el cambio en el checkbox de restricción de descuento
    const handleDiscountRestrictionsChange = (e) => {
        const isChecked = e.target.checked;
        setDiscountRestrictionsActive(isChecked);

        // Si "Activar restricción de descuento" está desactivado, resetear los valores 
        if (!isChecked) {
            setCustomer(prevState => ({
                ...prevState,
                MaxDescuento: 0,
                Descuento: 0,
                PermiteDescuento: false
            }));
        }
        else {
            // Si "Activar restricción de descuento" está activado, establece PermiteDescuento a true
            setCustomer(prevState => ({
                ...prevState,
                PermiteDescuento: true
            }));
        }
    };

    // Limpiar los estados una vez guardado el cliente
    const resetCustomer = () => {
        setCustomer({
            ...customer,
            CodCliente: 0,
            Cedula: '',
            Nombre: '',
            Observaciones: '',
            Telefono1: '',
            Telefono2: '',
            Celular: '',
            Email: '',
            Direccion: '',
            Credito: false,
            LimiteCredito: 0,
            PlazoCredito: 0,
            TipoPrecio: 0,
            Restriccion: false,
            CodMoneda: 0,
            Moroso: 0,
            InHabilitado: 0,
            FechaIngreso: '',
            IdLocalidad: 0,
            IdAgente: 0,
            PermiteDescuento: false,
            Descuento: 0,
            MaxDescuento: 0,
            Exonerar: false,
            Codigo: '',
            Contacto: '',
            TelContacto: '',
            DPI: 0,
            Categoria: 0,
        });
    };

    // Validar que el cliente tenga todos los campos requeridos
    const checkCustomer = (e) => {
        e.preventDefault();
        let errores = [];

        if (!isCFSelected && !customer.Cedula) {
            errores.push('El campo Documento de Identificación es obligatorio.');
        }
        if (!customer.Nombre) {
            errores.push('El campo Nombre es obligatorio.');
        }
        if (!customer.Direccion) {
            errores.push('El campo Dirección es obligatorio.');
        }

        // Validar la longitud del input del Documento de Identificación
        if (!isCFSelected) {
            const validationMessage = validateInputLength({ target: { value: customer.Cedula } });
            if (validationMessage) {
                showFloatingAlert('warn', validationMessage);
                return; // No continúa con la validación si la longitud del campo no es la correcta
            }
        }

        if (errores.length > 0) {
            errores.forEach(error => {
                showFloatingAlert('error', error);
            });
            return;
        }
        saveCustomer();
    };

    // Agregar nuevo Cliente
    const saveCustomer = async () => {
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

            const dataCustomer = {
                Cedula: customer.Cedula,
                Nombre: customer.Nombre,
                Observaciones: customer.Observaciones ? customer.Observaciones : '',
                Telefono1: customer.Telefono1 ? customer.Telefono1 : '',
                Telefono2: customer.Telefono2 ? customer.Telefono2 : '',
                Celular: customer.Celular,
                Email: customer.Email ? customer.Email : '',
                Direccion: customer.Direccion,
                Credito: customer.Credito ? customer.Credito : false,
                LimiteCredito: customer.LimiteCredito ? customer.LimiteCredito : 0,
                PlazoCredito: customer.PlazoCredito ? customer.PlazoCredito : 0,
                // TipoPrecio: selectedTypePrice.code,
                TipoPrecio: customer.TipoPrecio ? customer.TipoPrecio : 0,
                Restriccion: customer.Restriccion ? customer.Restriccion : false,
                CodMoneda: customer.CodMoneda ? customer.CodMoneda : 1,
                Moroso: customer.Moroso ? customer.Moroso : 0,
                InHabilitado: false,
                FechaIngreso: formattedSaveDate,
                IdLocalidad: selectedLocation ? selectedLocation.id : 0,
                IdAgente: selectedSeller.Id,
                PermiteDescuento: customer.PermiteDescuento ? customer.PermiteDescuento : false,
                Descuento: customer.Descuento ? customer.Descuento : 0,
                MaxDescuento: customer.MaxDescuento ? customer.MaxDescuento : 0,
                Exonerar: customer.Exonerar ? customer.Exonerar : false,
                Codigo: 0,
                Contacto: customer.Contacto ? customer.Contacto : '',
                TelContacto: customer.TelContacto ? customer.TelContacto : '',
                DPI: customer.DPI,
                Categoria: selectedCustomerCategory ? selectedCustomerCategory.id : 0
            }

            let response;
            try {
                if (customer.CodCliente) {
                    // Actualizar cliente existente
                    response = await clienteAxios.put(`/cliente/update/${customer.CodCliente}`, dataCustomer, config);
                } else {
                    // Crear nuevo cliente
                    response = await clienteAxios.post(`/cliente/save`, dataCustomer, config);
                }
            } catch (error) {
                console.error('Hubo un error al hacer la solicitud:', error);
                showFloatingAlert('danger', 'Hubo un error al hacer la solicitud a la API.');
                return;
            }


            if (!response || response.status >= 400) {
                props.onShowToast('danger', 'El cliente no se pudo agregar o actualizar.');
                throw new Error('Error al guardar o actualizar el cliente.');
            } else if (customer.CodCliente) {
                props.onShowToast('success', 'Cliente actualizado correctamente.');
                console.log('Cliente actualizado:', response.data);
            } else {
                props.onShowToast('success', 'Vendedor agregado correctamente.');
                console.log('Cliente agregado:', response.data);
            }

            // Limpiar los campos después de guardar/modificar
            resetCustomer();

            // Selecciona automáticamente el RadioButton "CF" después de guardar
            handleCFChange();

            // Llamar a onCustomerSaved para cerrar dialog y recargar la tabla de clientes
            props.onCustomerSaved();
        } catch (error) {
            console.error('Hubo un error:', error);
        }
    }

    // Cancelar la edición del cliente
    const cancelEdit = () => {
        // Limpiar los campos después de cancelar
        resetCustomer();

        // Selecciona automáticamente el RadioButton "CF" después de cancelar
        handleCFChange();

        // Llamar a onCustomerSaved para cerrar dialog y recargar la tabla de clientes
        props.onCustomerSaved();
    };
    
    return (
        <div className="flex flex-col justify-content-center" style={{ fontSize: '0.8rem' }}>
            <Toast ref={toast} />
            <div className="contenedor-principal flex flex-col md:flex-row justify-center items-center gap-3 w-full md:w-3/4">
                <form action='#'>
                    <h1 className="font-bold self-center mb-2 text-lg">Datos del cliente</h1>

                    {/* Fila de RadioButton */}
                    <div className="p-4 border-2 border-gray-200 rounded-md mt-2">
                        <div className="flex flex-wrap gap-3 mb-2">
                            <div className="flex align-items-center">
                                <RadioButton inputId="cf" name="DPI" value={0} onChange={handleCFChange} checked={isCFSelected} />
                                <label htmlFor="cf" className="ml-2">CF</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton inputId="nit" name="DPI" value={0} onChange={handleNITChange} checked={!isCFSelected && customer.DPI === 0} />
                                <label htmlFor="nit" className="ml-2">NIT</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton inputId="dpi" name="DPI" value={1} onChange={handleDPIChange} checked={customer.DPI === 1} />
                                <label htmlFor="dpi" className="ml-2">DPI/CUI</label>
                            </div>
                        </div>

                        {/* Fila 1 */}
                        <div className="flex flex-no-wrap gap-1 justify-start mt-3">
                            <div className="w-1/8 mr-3">
                                <label htmlFor="Cedula" className="font-bold block mb-2">
                                    Doc. Identificación
                                </label>
                                <InputText
                                    name="Cedula"
                                    value={customer.Cedula}
                                    onChange={handleCustomerChange}
                                    onKeyPress={handleKeyPress}
                                    onBlur={validateInputLength}
                                    placeholder=""
                                    maxLength={customer.DPI === 0 ? 9 : 12}
                                    required
                                    disabled={isCFSelected}
                                    size={8}
                                    style={{ height: '25px' }}
                                />
                            </div>
                            <div className="w-1/8 mr-4">
                                <label htmlFor="Nombre" className="font-bold block mb-2">
                                    Nombre
                                </label>
                                <InputText
                                    name="Nombre"
                                    value={customer.Nombre}
                                    onChange={handleCustomerChange}
                                    keyfilter=""
                                    placeholder=""
                                    maxLength={75}
                                    required
                                    size={30}
                                    style={{ height: '25px' }}
                                />
                            </div>
                            <div className="flex flex-no-wrap gap-1 justify-start mb-2">
                                <div className="w-1/8 mr-3">
                                    <label htmlFor="Celular" className="font-bold block mb-2">
                                        Celular
                                    </label>
                                    <InputText
                                        name="Celular"
                                        value={customer.Celular}
                                        onChange={handleCustomerChange}
                                        onKeyPress={handleKeyPress}
                                        keyfilter="num"
                                        placeholder=""
                                        minLength={8}
                                        maxLength={8}
                                        size={6}
                                        style={{ height: '25px' }}
                                    />
                                </div>
                                <div className="w-1/8 mr-3">
                                    <label htmlFor="Telefono1" className="font-bold block mb-2">
                                        Tel. Casa
                                    </label>
                                    <InputText name="Telefono1"
                                        value={customer.Telefono1}
                                        onChange={handleCustomerChange}
                                        onKeyPress={handleKeyPress}
                                        keyfilter="num"
                                        placeholder=""
                                        minLength={8}
                                        maxLength={8}
                                        size={6}
                                        style={{ height: '25px' }}
                                    />
                                </div>
                                <div className="w-1/4">
                                    <label htmlFor="Telefono2" className="font-bold block mb-2">
                                        Tel. Oficina
                                    </label>
                                    <InputText name="Telefono2"
                                        value={customer.Telefono2}
                                        onChange={handleCustomerChange}
                                        onKeyPress={handleKeyPress}
                                        keyfilter="num"
                                        placeholder=""
                                        minLength={8}
                                        maxLength={8}
                                        size={6}
                                        style={{ height: '25px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fila 2 */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            <div className="w-1/8 mr-4">
                                <label htmlFor="Direccion" className="font-bold block mb-2">
                                    Dirección
                                </label>
                                <InputText
                                    name="Direccion"
                                    value={customer.Direccion}
                                    onChange={handleCustomerChange}
                                    keyfilter=""
                                    placeholder=""
                                    maxLength={100}
                                    required
                                    size={44}
                                    style={{ height: '25px' }}
                                />
                            </div>
                            <div className="w-1/4">
                                <label htmlFor="Email" className="font-bold block mb-2">
                                    Correo Electrónico
                                </label>
                                <InputText
                                    name="Email"
                                    value={customer.Email}
                                    onChange={handleCustomerChange}
                                    keyfilter="email"
                                    placeholder=""
                                    maxLength={50}
                                    size={39}
                                    style={{ height: '25px' }}
                                />
                            </div>
                            {/* Fecha de ingreso ocultada */}
                            <div style={{ display: 'none' }}>
                                <InputText
                                    name="FechaIngreso"
                                    value={formattedSaveDate}
                                    onChange={handleCustomerChange}
                                    className="w-full"
                                    keyfilter=""
                                    placeholder=""
                                    required
                                    tabIndex="-1"
                                />
                            </div>
                        </div>

                        {/* Fila 3 */}
                        <div className="flex flex-wrap gap-3">
                            <div className="w-1/8 mr-3">
                                <label htmlFor="Observaciones" className="font-bold block mb-2">
                                    Observaciones
                                </label>
                                <InputText
                                    name="Observaciones"
                                    value={customer.Observaciones}
                                    onChange={handleCustomerChange}
                                    keyfilter=""
                                    placeholder=""
                                    maxLength={100}
                                    size={44}
                                    style={{ height: '25px' }}
                                />
                            </div>
                            <div className="w-1/8 mr-1">
                                <label htmlFor="Contacto" className="font-bold block mb-2">
                                    Nombre de Contacto
                                </label>
                                <InputText
                                    name="Contacto"
                                    value={customer.Contacto}
                                    onChange={handleCustomerChange}
                                    keyfilter=""
                                    placeholder=""
                                    maxLength={100}
                                    size={25}
                                    style={{ height: '25px' }}
                                />
                            </div>
                            <div className="w-1/8">
                                <label htmlFor="TelContacto" className="font-bold block mb-2">
                                    Tel. Contacto
                                </label>
                                <InputText
                                    name="TelContacto"
                                    value={customer.TelContacto}
                                    onChange={handleCustomerChange}
                                    onKeyPress={handleKeyPress}
                                    keyfilter=""
                                    placeholder=""
                                    maxLength={8}
                                    size={6}
                                    style={{ height: '25px' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="contenedor-secciones flex flex-col md:flex-row space-x-0 md:space-x-4">
                        <div className="seccion-creditos flex-1">
                            <h1 className="font-bold self-center text-lg mt-2">Créditos</h1>
                            <div className="p-4 border-2 border-gray-200 rounded-md mt-2">
                                <div className="flex flex-wrap gap-3 mb-3">
                                    <div className="flex items-center">
                                        <input
                                            className=""
                                            type="checkbox"
                                            style={{ width: "1.5rem", height: "1.5rem" }}
                                            checked={creditActive}
                                            onChange={handleCreditChange}
                                        />
                                        <label htmlFor="checkbox_activar_credito" className="ms-3 font-medium text-gray-900">Activar Crédito</label>
                                    </div>
                                </div>
                                <div className="card flex flex-col items-center">
                                    <div>
                                        <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900">Seleccionar moneda</label>
                                        <Dropdown
                                            value={selectedCurrency}
                                            onChange={handleCurrencyChange}
                                            options={filteredCurrencies}
                                            optionLabel="Nombre"
                                            placeholder="Moneda"
                                            filter
                                            filterBy="Nombre"
                                            onFilter={(e) => filterCurrencies(e)}
                                            disabled={!creditActive}
                                            emptyFilterMessage="Sin resultados"
                                            className="ml-3 h-10 text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-no-wrap justify-center mt-3">
                                    <div className="w-1/8 mr-4">
                                        <label htmlFor="Limite_credito" className="font-bold block mb-2">
                                            Limite
                                        </label>
                                        <InputNumber
                                            name="LimiteCredito"
                                            value={customer.LimiteCredito}
                                            onChange={handleInputNumberCustomerChange("LimiteCredito")}
                                            placeholder=""
                                            max={99999.99}
                                            required
                                            disabled={!creditActive}
                                            minFractionDigits={2}
                                            maxFractionDigits={2}
                                            size={6}
                                            style={{ height: '25px' }}
                                        />
                                    </div>
                                    <div className="w-1/8">
                                        <label htmlFor="Plazo_credito" className="font-bold block mb-2">
                                            Plazo (días)
                                        </label>
                                        <InputNumber
                                            inputId="minmax-buttons"
                                            value={customer.PlazoCredito}
                                            onChange={handleInputNumberCustomerChange("PlazoCredito")}
                                            mode="decimal"
                                            showButtons
                                            required
                                            disabled={!creditActive}
                                            min={0}
                                            max={100}
                                            size={3}
                                            style={{ height: '25px' }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col items-start mt-2 mx-2 md:mr-4">
                                    <div className="flex items-start mt-2">
                                        <Checkbox name="Restriccion" checked={customer.Restriccion === 1} onChange={handleCheckboxChange} disabled={!creditActive} />
                                        <label htmlFor="checkbox_sin_limite_credito" className="ms-3 font-medium text-gray-900">Sin limite de crédito</label>
                                    </div>
                                    <div className="flex items-start mt-2">
                                        <Checkbox name="Moroso" checked={customer.Moroso === 1} onChange={handleCheckboxChange} disabled={!creditActive} />
                                        <label htmlFor="checkbox_cliente_moroso" className="ms-3 font-medium text-gray-900">Cliente moroso</label>
                                    </div>
                                    <div className="flex items-start mt-2">
                                        <Checkbox name="Exonerar" checked={customer.Exonerar === 1} onChange={handleCheckboxChange} disabled={!creditActive} />
                                        <label htmlFor="checkbox_cliente_exonerado" className="ms-3 font-medium text-gray-900">Cliente exonerado</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="seccion-otros flex-1">
                            <h1 className="font-bold self-center text-lg mt-2">Otros Datos</h1>
                            <div className="p-4 border-2 border-gray-200 rounded-md mt-2">
                                <div className="card flex flex-col items-center">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex flex-col">
                                            <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900">Vendedor asignado</label>
                                            <Dropdown
                                                value={selectedSeller}
                                                onChange={handleSellerChange}
                                                options={filteredSellers}
                                                optionLabel="Nombre"
                                                placeholder="Vendedor"
                                                filter
                                                filterBy="Nombre"
                                                onFilter={(e) => filterSellers(e)}
                                                className="w-full md:w-14rem ml-3 mt-2 h-10 text-xs"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900">Tipo precio</label>
                                            <Dropdown
                                                value={selectedTypePrice}
                                                onChange={handleTypePriceChange}
                                                options={filteredTypePrices}
                                                optionLabel="name"
                                                placeholder="Tipo precio"
                                                filter
                                                filterBy="name"
                                                onFilter={(e) => filterTypePrices(e)}
                                                className="w-full md:w-14rem ml-3 mt-2 h-10 text-xs"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 mt-2">
                                        <div className="flex flex-col">
                                            <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900">Ruta</label>
                                            <Dropdown
                                                value={selectedLocation}
                                                onChange={handleLocationChange}
                                                options={filteredLocations}
                                                optionLabel="Nombre"
                                                placeholder="Localidad"
                                                filter
                                                filterBy="Nombre"
                                                onFilter={(e) => filterLocations(e)}
                                                className="w-full md:w-14rem ml-3 mt-2 h-10 text-xs"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900">Categoria</label>
                                            <Dropdown
                                                value={selectedCustomerCategory}
                                                onChange={handleCustomerCategoryChange}
                                                options={filteredCustomerCategories}
                                                optionLabel="NombreCategoria"
                                                placeholder="Seleccionar categoria"
                                                filter
                                                filterBy="NombreCategoria"
                                                onFilter={(e) => filterCustomerCategories(e)}
                                                className="w-full md:w-14rem ml-3 mt-2 h-10 text-xs"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3 mb-4 mt-2">
                                    <div className="flex items-center">
                                        {/* PermiteDescuento */}
                                        <input
                                            className="mt-4"
                                            type="checkbox"
                                            style={{ width: "1.5rem", height: "1.5rem" }}
                                            checked={discountRestrictionsActive}
                                            onChange={handleDiscountRestrictionsChange}
                                        />
                                        <label htmlFor="checkbox_restriccion_descuento" className="ms-3 font-medium text-gray-900 mt-4">Activar Restriccion de Descuento</label>
                                    </div>
                                </div>

                                <div className="card flex flex-row items-center justify-center">
                                    <div className="w-1/2">
                                        <div className="w-full max-w-xl flex flex-col md:flex-row justify-center items-center mx-2">
                                            <label htmlFor="Restricciónx" className="ms-3 font-medium text-gray-900 mt-3 md:mt-0 mr-2 whitespace-nowrap">% Restricción</label>
                                            {/* MaxDescuento */}
                                            <InputNumber
                                                inputId="discount"
                                                value={customer.MaxDescuento}
                                                onChange={handleInputNumberCustomerChange("MaxDescuento")}
                                                mode="decimal"
                                                showButtons
                                                required
                                                disabled={!discountRestrictionsActive}
                                                min={0}
                                                max={100}
                                                size={5}
                                                style={{ height: '25px' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-1/2 max-w-xl flex flex-col md:flex-row justify-center items-center mx-2">
                                        <label htmlFor="Descuento" className="ms-3 font-medium text-gray-900 mt-3 md:mt-0 mr-2 whitespace-nowrap">% Descuento</label>
                                        {/* Descuento */}
                                        <InputNumber
                                            inputId="discount"
                                            value={customer.Descuento}
                                            onChange={handleInputNumberCustomerChange("Descuento")}
                                            mode="decimal"
                                            showButtons
                                            required
                                            disabled={!discountRestrictionsActive}
                                            min={0}
                                            max={100}
                                            size={5}
                                            style={{ height: '25px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card flex flex-col justify-center items-center gap-3 w-full md:w-3/4 mt-4">
                        <div className="flex-shrink-0">
                            <Button
                                className='text-white text-sm bg-sky-600 p-3 rounded-md font-bold md:mt-0'
                                label={editingCustomer ? 'Guardar cambios' : 'Guardar'}
                                // icon="pi pi-check"
                                onClick={(e) => checkCustomer(e)}
                                style={{ maxWidth: '10rem' }}
                            />
                            {editingCustomer && (
                                <Button
                                    className='text-white text-sm bg-red-600 p-3 rounded-md font-bold md:mt-0 ml-2'
                                    label="Cancelar"
                                    icon="pi pi-times"
                                    onClick={cancelEdit}
                                    style={{ maxWidth: '10rem' }}
                                />
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomer;