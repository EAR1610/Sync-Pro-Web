import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';

import clienteAxios from '../../config/clienteAxios';

const AddCustomer = () => {

    const [customer, setCustomer] = useState({
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
    const [currency, setCurrency] = useState(null);
    const [currencies, setCurrencies] = useState(null);

    // Seleccionar
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    // Filtrar
    const [filteredCustomer, setFilteredCustomer] = useState({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    const [globalCustomerFilterValue, setGlobalCustomerFilterValue] = useState('');
    const [filteredCurrencies, setFilteredCurrencies] = useState(null);

    // Operar


    // Acción
    const toast = useRef(null);
    const [loading, setLoading] = useState(true);
    const [customerDialog, setCustomerDialog] = useState(false);
    const today = new Date();
    const formattedSaveDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [creditActive, setCreditActive] = useState(false);
    const [discountRestrictionsActive, setDiscountRestrictionsActive] = useState(false);

    // Manejar cambios en los campos del cliente
    // const handleCustomerChange = (e) => {
    //     if (e.target.type === 'radio') { // Si es un evento de botón de radio
    //         setCustomer(prevState => ({ ...prevState, DPI: Number(e.target.value) }));
    //     } else if (e.target.type === 'checkbox') { // Si es un evento de checkbox
    //         setCustomer(prevState => ({ ...prevState, [e.target.name]: e.target.checked ? 1 : 0 }));
    //     } else { // Si es un evento de campo de entrada
    //         setCustomer(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    //     }
    // };
    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prevState => ({
            ...prevState,
            [name]: value
        }));
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

    // Cambiar la moneda seleccionada (Codigo)
    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.value);
        setCustomer({ ...customer, CodMoneda: e.value.Codigo });
    };

    // Agrega una función para manejar el cambio en el checkbox de crédito
    /**
     * 
     * TODO: Comprobar funcionamiento de los checkbox de Sin limite de crédito, Cliente moroso y Cliente exonerado.
     */
    // const handleCreditChange = (e) => {
    //     setCreditActive(e.target.checked);
    //     if (!e.target.checked) {
    //         setCustomer({ ...customer, LimiteCredito: 0 });
    //         setCustomer({ ...customer, Moroso: 0 });
    //         setCustomer({ ...customer, Exonerar: 0 });
    //     }
    //     getCurrency();
    // };

    // Función para manejar el cambio en el checkbox de Activar Crédito
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
        getCurrency();
    };

    // Obtener la moneda
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
            console.log(data);
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

    // Agrega una función para manejar el cambio en el checkbox de restricción de descuento
    const handleDiscountRestrictionsChange = (e) => {
        setDiscountRestrictionsActive(e.target.checked);
    };

    // Limpiar los estados una vez guardado el cliente
    const resetState = () => {
        setCustomer({});
    };

    // Validar que el cliente tenga todos los campos requeridos
    const checkCustomer = () => {
        let errores = [];

        if (!customer.Cedula) {
            errores.push('El campo Documento de Identificación es obligatorio.');
        }
        if (!customer.Nombre) {
            errores.push('El campo Nombre es obligatorio.');
        }
        if (!customer.Celular) {
            errores.push('El campo Celular es obligatorio.');
        }
        if (!customer.Direccion) {
            errores.push('El campo Dirección es obligatorio.');
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

            /**
             * TODO: Si Activar Crédito está activado, se debe guardar el cliente con los datos de crédito.
             * ? Preguntar si los checkbox de Sin limite de crédito, Cliente moroso y Cliente exonerado se pueden alternar.
             * ! Los checkbox de Sin limite de crédito, Cliente moroso y Cliente exonerado no funcionan.
             * TODO: La sección de Otros datos no está implementada.
             * TODO: Si el checkbox de Activar Crédito está desactivado, quitar los checkbox de Sin limite de crédito, Cliente moroso y Cliente exonerado.
             * ? Preguntar funcionamiento de "Otros datos" y "Activar Restricción de Descuento".
             */
            const dataCustomer = {
                Cedula: customer.Cedula,
                Nombre: customer.Nombre,
                Observaciones: customer.Observaciones,
                Telefono1: customer.Telefono1,
                Telefono2: customer.Telefono2,
                Celular: customer.Celular,
                Email: customer.Email,
                Direccion: customer.Direccion,
                Credito: false,
                LimiteCredito: 0,
                PlazoCredito: 0,
                TipoPrecio: 1,
                Restriccion: false,
                CodMoneda: customer.CodMoneda,
                Moroso: false,
                InHabilitado: false,
                FechaIngreso: formattedSaveDate,
                IdLocalidad: 0,
                IdAgente: 0,
                PermiteDescuento: false,
                Descuento: 0,
                MaxDescuento: 0,
                Exonerar: false,
                Codigo: 0,
                Contacto: customer.Contacto,
                TelContacto: customer.TelContacto,
                DPI: customer.DPI,
                Categoria: 1,
            }

            console.log(dataCustomer);
            // const response = await clienteAxios.post(`/cliente/save`, dataSeller, config);

            // if (!response) {
            //     showFloatingAlert('danger', 'El cliente no se pudo agregar.');
            //     throw new Error('Error al guardar el vendedor.');
            // } else {
            //     showFloatingAlert('success', 'Cliente agregado correctamente.');
            // }

            //resetState();

            // Recargar la página
            //window.location.reload();
        } catch (error) {
            console.error('Hubo un error:', error);
        }
    }

    return (
        <div className="flex justify-content-center mt-4">
            <Toast ref={toast} />
            <div className="card flex flex-col justify-content-center gap-3 w-full md:w-3/4">
                <h1 className="col-span-2 text-center font-bold text-4xl">Registrar nuevo cliente</h1>
                <form action='#'>
                    <h1 className="col-span-2 font-bold text-2xl mt-4">Datos del cliente</h1>
                    <div className="p-4 border-2 border-gray-200 rounded-md mt-2">
                        <div className="flex flex-wrap gap-3">
                            <div className="flex align-items-center">
                                <RadioButton inputId="nit" name="DPI" value={0} onChange={handleCustomerChange} checked={customer.DPI === 0} />
                                <label htmlFor="nit" className="ml-2">NIT</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton inputId="dpi" name="DPI" value={1} onChange={handleCustomerChange} checked={customer.DPI === 1} />
                                <label htmlFor="dpi" className="ml-2">DPI/CUI</label>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mb-4 mt-2">
                            <div className="flex-auto">
                                <label htmlFor="Cedula" className="font-bold block mb-2">
                                    Documento de Identificación
                                </label>
                                <InputText name="Cedula" value={customer.Cedula} onChange={handleCustomerChange} className="w-full" keyfilter="num" placeholder="" maxLength={customer.DPI === 0 ? 9 : 12} required />
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
                                <InputText name="Celular" value={customer.Celular} onChange={handleCustomerChange} className="w-full" keyfilter="num" placeholder="" minLength={8} maxLength={8} required />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mb-4">
                            <div className="flex-auto">
                                <label htmlFor="Telefono1" className="font-bold block mb-2">
                                    Teléfono de casa
                                </label>
                                <InputText name="Telefono1" value={customer.Telefono1} onChange={handleCustomerChange} className="w-full" keyfilter="num" placeholder="" minLength={8} maxLength={8} />
                            </div>
                            <div className="flex-auto">
                                <label htmlFor="Telefono2" className="font-bold block mb-2">
                                    Teléfono de Oficina
                                </label>
                                <InputText name="Telefono2" value={customer.Telefono2} onChange={handleCustomerChange} className="w-full" keyfilter="num" placeholder="" minLength={8} maxLength={8} />
                            </div>
                            <div className="flex-auto">
                                <label htmlFor="Email" className="font-bold block mb-2">
                                    Correo Electrónico
                                </label>
                                <InputText name="Email" value={customer.Email} onChange={handleCustomerChange} className="w-full" keyfilter="email" placeholder="" maxLength={50} />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mb-4">
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
                                <InputText name="Contacto" value={customer.Contacto} onChange={handleCustomerChange} className="w-full" keyfilter="" placeholder="" maxLength={100} required />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mb-4">
                            <div className="flex-auto">
                                <label htmlFor="TelContacto" className="font-bold block mb-2">
                                    Teléfono de contacto
                                </label>
                                <InputText name="TelContacto" value={customer.TelContacto} onChange={handleCustomerChange} className="w-auto" keyfilter="" placeholder="" maxLength={8} required />
                            </div>
                        </div>
                    </div>
                    <h1 className="col-span-2 font-bold text-2xl mt-4">Créditos</h1>
                    <div className="p-4 border-2 border-gray-200 rounded-md mt-2">
                        <div className="flex flex-wrap gap-3 mb-4">
                            <div className="flex items-center">
                                <input
                                    className="mt-3"
                                    type="checkbox"
                                    style={{ width: "1.5rem", height: "1.5rem" }}
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
                                    <InputText name="Limite" value={customer.LimiteCredito} onChange={handleCustomerChange} className="w-25 max-w-full ml-3 md:ml-2 mt-2 md:mt-0" keyfilter="" placeholder="" maxLength={8} required disabled={!creditActive} />
                                </div>
                                <div className="w-full md:w-1/2 max-w-md flex flex-col md:flex-row justify-between items-center mt-3 mx-2">
                                    <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900 mt-3 md:mt-0">Plazo</label>
                                    <InputText name="Plazo" value={customer.PlazoCredito} onChange={handleCustomerChange} className="w-25 max-w-full ml-3 md:ml-2 mt-2 md:mt-0" keyfilter="" placeholder="" maxLength={8} required disabled={!creditActive} />
                                </div>
                            </div>
                            <div className="flex flex-col items-start mt-3 mx-2 md:mr-4">
                                <div className="flex items-center mt-3">
                                    <Checkbox name="LimiteCredito" checked={customer.LimiteCredito === 1} onChange={handleCheckboxChange} disabled={!creditActive} />
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
                    <h1 className="col-span-2 font-bold text-2xl mt-4">Otros datos</h1>
                    <div className="p-4 border-2 border-gray-200 rounded-md mt-2">
                        <div className="card flex flex-col items-center">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900 mt-3">Vendedor asignado</label>
                                    <Dropdown optionLabel="Vendedores"
                                        placeholder="Seleccionar vendedor"
                                        className="w-full md:w-14rem ml-3 mt-2"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900 mt-3">Tipo precio</label>
                                    <Dropdown optionLabel="Tipos_precio"
                                        placeholder="Seleccionar tipo"
                                        className="w-full md:w-14rem ml-3 mt-2"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 mt-4">
                                <div className="flex flex-col">
                                    <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900 mt-3">Ruta</label>
                                    <Dropdown optionLabel="Rutas"
                                        placeholder="Seleccionar ruta"
                                        className="w-full md:w-14rem ml-3 mt-2"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="default-checkbox" className="ms-3 font-medium text-gray-900 mt-3">Categoria</label>
                                    <Dropdown optionLabel="Categorias"
                                        placeholder="Seleccionar categoria"
                                        className="w-full md:w-14rem ml-3 mt-2"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mb-4">
                            <div className="flex items-center">
                                <input
                                    className="mt-4"
                                    type="checkbox"
                                    style={{ width: "1.5rem", height: "1.5rem" }}
                                    onChange={handleDiscountRestrictionsChange}
                                />
                                <label htmlFor="checkbox_restriccion_descuento" className="ms-3 font-medium text-gray-900 mt-4">Activar Restriccion de Descuento</label>
                            </div>
                        </div>
                        <div className="card flex flex-col items-center">
                            <div className="flex flex-col md:flex-row justify-center items-center mt-3 mx-auto">
                                <div className="w-full md:w-1/2 max-w-xl flex flex-col md:flex-row justify-center items-center mx-2">
                                    <label htmlFor="Restricciónx" className="ms-3 font-medium text-gray-900 mt-3 md:mt-0 mr-2 whitespace-nowrap">% Restricción</label>
                                    <InputText name="Restriccion" onChange={handleCustomerChange} className="w-25 max-w-full ml-3 md:ml-2 mt-2 md:mt-0" keyfilter="" placeholder="" maxLength={8} disabled={!discountRestrictionsActive} />
                                </div>
                                <div className="w-full md:w-1/2 max-w-xl flex flex-col md:flex-row justify-center items-center mx-2">
                                    <label htmlFor="Descuento" className="ms-3 font-medium text-gray-900 mt-3 md:mt-0 mr-2 whitespace-nowrap">% Descuento</label>
                                    <InputText name="Descuento" onChange={handleCustomerChange} className="w-25 max-w-full ml-3 md:ml-2 mt-2 md:mt-0" keyfilter="" placeholder="" maxLength={8} disabled={!discountRestrictionsActive} />
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
                                // loading={loading}
                                onClick={checkCustomer}
                                style={{ maxWidth: '10rem' }}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomer;