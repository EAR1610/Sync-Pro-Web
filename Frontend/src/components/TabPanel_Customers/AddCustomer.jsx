import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';

import clienteAxios from '../../config/clienteAxios';

const AddCustomer = () => {

    const [recargar, setRecargar] = useState(false)
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
        if (e.value) {
            setCustomer({ ...customer, IdLocalidad: e.value.Codigo });
        }
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
        }
        //getCurrency();
    };

    /**
     *  Obtener la moneda.
     * ? Desactivado temporalmente, ya que no se está utilizando.
     */
    const getCurrency = async () => {
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

            const response = await clienteAxios.get(`/moneda`, config);

            if (!response) {
                showFloatingAlert('danger', 'No se pudo obtener la lista de monedas.');
                throw new Error('Error al obtener la lista de monedas.');
            }

            const { data } = response;

            setCurrencies(data);
            setFilteredCurrencies(data);
        } catch (error) {
            console.error('Hubo un error:', error);
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

                // Desactivar checkbox
                setCreditActive(false);
                setDiscountRestrictionsActive(false);
            } catch (error) {
                console.error('Hubo un error:', error);
            }
        };
        verificarAcceso();
        fetchData();
    }, [recargar]);

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
                TipoPrecio: selectedTypePrice.code,
                Restriccion: customer.Restriccion ? customer.Restriccion : false,
                CodMoneda: customer.CodMoneda ? customer.CodMoneda : 0,
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

            console.log(dataCustomer);
            const response = await clienteAxios.post(`/cliente/save`, dataCustomer, config);

            if (!response) {
                showFloatingAlert('danger', 'El cliente no se pudo agregar.');
                throw new Error('Error al guardar el vendedor.');
            } else {
                showFloatingAlert('success', 'Cliente agregado correctamente.');
            }

            // Limpiar los campos después de guardar
            resetCustomer();

            // Recargar la página
            setRecargar(!recargar);

            // Selecciona automáticamente el RadioButton "CF" después de guardar
            handleCFChange();
        } catch (error) {
            console.error('Hubo un error:', error);
        }
    }

    return (
        <div className="flex justify-content-center mt-4">
            <Toast ref={toast} />
            <div className="card flex flex-col justify-content-center gap-3 w-full md:w-3/4">
                <h1 className="col-span-2 text-center font-bold text-4xl">Registrar nuevo cliente</h1>
                <div className="contenedor-principal flex flex-col md:flex-row justify-center items-center gap-3 w-full md:w-3/4">
                    <form action='#'>
                        <h1 className="col-span-2 font-bold text-2xl mt-3">Datos del cliente</h1>
                        <div className="p-4 border-2 border-gray-200 rounded-md mt-2">
                            <div className="flex flex-wrap gap-3">
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
                            <div className="flex flex-wrap gap-3 mb-4 mt-2">
                                <div className="flex-auto">
                                    <label htmlFor="Cedula" className="font-bold block mb-2">
                                        Documento de Identificación
                                    </label>
                                    <InputText
                                        name="Cedula"
                                        value={customer.Cedula}
                                        onChange={handleCustomerChange}
                                        onKeyPress={handleKeyPress}
                                        onBlur={validateInputLength}
                                        // className="w-full"
                                        className="w-full"
                                        placeholder=""
                                        maxLength={customer.DPI === 0 ? 9 : 12}
                                        required
                                        disabled={isCFSelected}
                                    />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor="Nombre" className="font-bold block mb-2">
                                        Nombre
                                    </label>
                                    <InputText name="Nombre" value={customer.Nombre} onChange={handleCustomerChange} className="w-full" keyfilter="" placeholder="" maxLength={75} required />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor="Celular" className="font-bold block mb-2">
                                        Celular
                                    </label>
                                    <InputText name="Celular" value={customer.Celular} onChange={handleCustomerChange} onKeyPress={handleKeyPress} className="w-full" keyfilter="num" placeholder="" minLength={8} maxLength={8} />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor="Telefono1" className="font-bold block mb-2">
                                        Teléfono de casa
                                    </label>
                                    <InputText name="Telefono1" value={customer.Telefono1} onChange={handleCustomerChange} onKeyPress={handleKeyPress} className="w-full" keyfilter="num" placeholder="" minLength={8} maxLength={8} />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor="Telefono2" className="font-bold block mb-2">
                                        Teléfono de Oficina
                                    </label>
                                    <InputText name="Telefono2" value={customer.Telefono2} onChange={handleCustomerChange} onKeyPress={handleKeyPress} className="w-full" keyfilter="num" placeholder="" minLength={8} maxLength={8} />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-4">
                                <div className="flex-auto">
                                    <label htmlFor="Email" className="font-bold block mb-2">
                                        Correo Electrónico
                                    </label>
                                    <InputText name="Email" value={customer.Email} onChange={handleCustomerChange} className="w-full" keyfilter="email" placeholder="" maxLength={50} />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor="Direccion" className="font-bold block mb-2">
                                        Dirección
                                    </label>
                                    <InputText name="Direccion" value={customer.Direccion} onChange={handleCustomerChange} className="w-full" keyfilter="" placeholder="" maxLength={100} required />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor="Observaciones" className="font-bold block mb-2">
                                        Observaciones
                                    </label>
                                    <InputText name="Observaciones" value={customer.Observaciones} onChange={handleCustomerChange} className="w-full" keyfilter="" placeholder="" maxLength={100} />
                                </div>
                                {/* Fecha de ingreso ocultada */}
                                <div style={{ display: 'none' }}>
                                    <InputText name="FechaIngreso" value={formattedSaveDate} onChange={handleCustomerChange} className="w-full" keyfilter="" placeholder="" required />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor="Contacto" className="font-bold block mb-2">
                                        Nombre de Contacto
                                    </label>
                                    <InputText name="Contacto" value={customer.Contacto} onChange={handleCustomerChange} className="w-full" keyfilter="" placeholder="" maxLength={100} />
                                </div>
                                <div className="flex-auto">
                                    <label htmlFor="TelContacto" className="font-bold block mb-2">
                                        Teléfono de contacto
                                    </label>
                                    <InputText name="TelContacto" value={customer.TelContacto} onChange={handleCustomerChange} onKeyPress={handleKeyPress} className="w-full" keyfilter="" placeholder="" maxLength={8} />
                                </div>
                            </div>
                        </div>
                        <div className="contenedor-secciones flex flex-col md:flex-row space-x-0 md:space-x-4">

                            <div className="seccion-creditos flex-1">
                                <h1 className="col-span-2 font-bold text-2xl mt-4">Créditos</h1>
                                <div className="p-4 border-2 border-gray-200 rounded-md mt-2">
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <div className="flex items-center">
                                            <input
                                                className="mt-3"
                                                type="checkbox"
                                                style={{ width: "1.5rem", height: "1.5rem" }}
                                                checked={creditActive}
                                                onChange={handleCreditChange}
                                            />
                                            <label htmlFor="checkbox_activar_credito" className="ms-3 font-medium text-gray-900 mt-3">Activar Crédito</label>
                                        </div>
                                    </div>
                                    <div className="card flex flex-col items-center">
                                        <div>
                                            <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900 mt-3">Seleccionar moneda</label>
                                            <Dropdown
                                                value={selectedCurrency}
                                                onChange={handleCurrencyChange}
                                                options={filteredCurrencies}
                                                optionLabel="Nombre"
                                                placeholder="Moneda"
                                                filter
                                                filterBy="Nombre"
                                                onFilter={(e) => filterCurrencies(e)}
                                                className="w-full md:w-14rem ml-3 mt-2"
                                                disabled={!creditActive}
                                            />
                                        </div>
                                        <div className="flex flex-col md:flex-row justify-center items-center mt-3 mx-auto">
                                            <div className="w-full md:w-1/2 max-w-md flex flex-col md:flex-row justify-between items-center mt-3 mx-2">
                                                <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900 mt-3 md:mt-0">Limite</label>
                                                <InputNumber
                                                    name="LimiteCredito"
                                                    value={customer.LimiteCredito}
                                                    onChange={handleInputNumberCustomerChange("LimiteCredito")}
                                                    className="w-25 max-w-full ml-3 md:ml-2 mt-2 md:mt-0"
                                                    placeholder=""
                                                    max={99999.99}
                                                    required
                                                    disabled={!creditActive}
                                                    minFractionDigits={2}
                                                    maxFractionDigits={2}
                                                />
                                            </div>
                                            <div className="w-full md:w-1/2 max-w-md flex flex-col md:flex-row justify-between items-center mt-3 mx-2">
                                                <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900 mt-3 md:mt-0">Plazo</label>
                                                <InputNumber
                                                    inputId="minmax-buttons"
                                                    value={customer.PlazoCredito}
                                                    onChange={handleInputNumberCustomerChange("PlazoCredito")}
                                                    mode="decimal"
                                                    showButtons
                                                    required
                                                    disabled={!creditActive}
                                                    min={0}
                                                    max={50}
                                                    className="w-25 max-w-full ml-3 md:ml-2 mt-2 md:mt-0"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start mt-3 mx-2 md:mr-4">
                                            <div className="flex items-center mt-3">
                                                <Checkbox name="Restriccion" checked={customer.Restriccion === 1} onChange={handleCheckboxChange} disabled={!creditActive} />
                                                <label htmlFor="checkbox_sin_limite_credito" className="ms-3 font-medium text-gray-900">Sin limite de crédito</label>
                                            </div>
                                            <div className="flex items-center mt-3">
                                                <Checkbox name="Moroso" checked={customer.Moroso === 1} onChange={handleCheckboxChange} disabled={!creditActive} />
                                                <label htmlFor="checkbox_cliente_moroso" className="ms-3 font-medium text-gray-900">Cliente moroso</label>
                                            </div>
                                            <div className="flex items-center mt-3">
                                                <Checkbox name="Exonerar" checked={customer.Exonerar === 1} onChange={handleCheckboxChange} disabled={!creditActive} />
                                                <label htmlFor="checkbox_cliente_exonerado" className="ms-3 font-medium text-gray-900">Cliente exonerado</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="seccion-otros flex-1">
                                <h1 className="col-span-2 font-bold text-2xl mt-4">Otros datos</h1>
                                <div className="p-4 border-2 border-gray-200 rounded-md mt-2">
                                    <div className="card flex flex-col items-center">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex flex-col">
                                                <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900 mt-3">Vendedor asignado</label>
                                                <Dropdown
                                                    value={selectedSeller}
                                                    onChange={handleSellerChange}
                                                    options={filteredSellers}
                                                    optionLabel="Nombre"
                                                    placeholder="Vendedor"
                                                    filter
                                                    filterBy="Nombre"
                                                    onFilter={(e) => filterSellers(e)}
                                                    className="w-full md:w-14rem ml-3 mt-2"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900 mt-3">Tipo precio</label>
                                                <Dropdown
                                                    value={selectedTypePrice}
                                                    onChange={handleTypePriceChange}
                                                    options={filteredTypePrices}
                                                    optionLabel="name"
                                                    placeholder="Tipo precio"
                                                    filter
                                                    filterBy="name"
                                                    onFilter={(e) => filterTypePrices(e)}
                                                    className="w-full md:w-14rem ml-3 mt-2"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4 mt-4">
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
                                                    className="w-full md:w-14rem ml-3 mt-2"
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
                                                    className="w-full md:w-14rem ml-3 mt-2"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3 mb-4">
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
                                    <div className="card flex flex-col items-center">
                                        <div className="flex flex-col md:flex-row justify-center items-center mt-3 mx-auto">
                                            <div className="w-full md:w-1/2 max-w-xl flex flex-col md:flex-row justify-center items-center mx-2">
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
                                                    className="w-25 max-w-full ml-3 md:ml-2 mt-2 md:mt-0"
                                                />
                                            </div>
                                            <div className="w-full md:w-1/2 max-w-xl flex flex-col md:flex-row justify-center items-center mx-2">
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
                                                    className="w-25 max-w-full ml-3 md:ml-2 mt-2 md:mt-0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card flex flex-col justify-center items-center gap-3 w-full md:w-3/4 mt-4">
                            <div className="flex-shrink-0">
                                <Button
                                    className='text-white text-sm bg-sky-600 p-3 rounded-md font-bold md:mt-0'
                                    label="Guardar"
                                    icon="pi pi-check"
                                    onClick={(e) => checkCustomer(e)}
                                    style={{ maxWidth: '10rem' }}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCustomer;