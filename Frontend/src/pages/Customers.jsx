import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import AddCustomer from '../components/TabPanel_Customers/AddCustomer.jsx';
import ListCustomers from '../components/TabPanel_Customers/ListCustomers.jsx';

const Customers = () => {

    return (
        <div className="card">
            <TabView>
                <TabPanel header="Agregar">
                    <AddCustomer/>
                </TabPanel>
                <TabPanel header="Listar">
                    <ListCustomers/>
                </TabPanel>
            </TabView>
        </div>
    )
}

export default Customers;