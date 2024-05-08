import React, { useState, useRef } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import AddCustomer from '../components/TabPanel_Customers/AddCustomer.jsx';
import ListCustomers from '../components/TabPanel_Customers/ListCustomers.jsx';
import InactiveCustomers from '../components/TabPanel_Customers/InactiveCustomers.jsx';

const Customers = () => {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [reloadCustomers, setReloadCustomers] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [isInactiveDialogVisible, setIsInactiveDialogVisible] = useState(false);
    const toast = useRef(null);

    // Ocultar Dialog y recargar tabla de clientes
    const handleCustomerSaved = () => {
        setIsDialogVisible(false);
        setReloadCustomers(prevState => !prevState); // Alterna el valor de reloadCustomers
    };

    // Mostrar una alerta flotante
    const showFloatingAlert = (tipo, mensaje) => {
        if (toast.current) {
            toast.current.show({ severity: tipo, summary: 'Información', detail: mensaje });
        } else {
            console.error('La referencia a toast no está inicializada.');
        }
    };

    const toggleInactiveCustomersDialog = () => {
        setIsInactiveDialogVisible(!isInactiveDialogVisible);
    };


    // Dialog Header para agregar o editar cliente
    const dialogHeader = (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {editingCustomer ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
        </div>
    );

    // Dialog Header para clientes inactivos
    const dialogHeaderInactiveCustomers = (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            Clientes Inactivos
        </div>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <TabView>
                <TabPanel header="Clientes">
                    <ListCustomers
                        openDialog={() => setIsDialogVisible(true)}
                        openInactiveDialog={toggleInactiveCustomersDialog}
                        setIsDialogVisible={setIsDialogVisible}
                        setEditingCustomer={setEditingCustomer}
                        reloadCustomers={reloadCustomers}
                        setReloadCustomers={setReloadCustomers}
                        onShowToast={showFloatingAlert}
                    />
                </TabPanel>
            </TabView>
            <Dialog
                visible={isDialogVisible}
                onHide={() => {
                    setIsDialogVisible(false);
                    setEditingCustomer(null); // Restablecer editingCustomer cuando se cierra el diálogo
                }}
                header={dialogHeader}
            >
                <AddCustomer
                    editingCustomer={editingCustomer}
                    setIsDialogVisible={setIsDialogVisible}
                    onCustomerSaved={handleCustomerSaved}
                    onShowToast={showFloatingAlert}
                />
            </Dialog>
            <Dialog
                visible={isInactiveDialogVisible}
                onHide={toggleInactiveCustomersDialog}
                header={dialogHeaderInactiveCustomers}
                onCustomerSaved={handleCustomerSaved}
            >
                <InactiveCustomers
                    reloadCustomers={reloadCustomers}
                    setReloadCustomers={setReloadCustomers}
                    onCustomerSaved={handleCustomerSaved}
                    setIsInactiveDialogVisible={setIsInactiveDialogVisible}
                />
            </Dialog>
        </div>
    )
}

export default Customers;