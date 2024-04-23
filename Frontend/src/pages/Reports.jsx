import React, { useState, useRef } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import SalesReport from '../components/TabPanel_Reports/SalesReport'; 
import EarningsReport from '../components/TabPanel_Reports/EarningsReport';

const Reports = () => {

    const toast = useRef(null);

    return (
        <div className="card">
            <TabView>
                <TabPanel header="Ventas">
                    <Toast ref={toast} />
                    <SalesReport />
                </TabPanel>
                <TabPanel header="Ganancias">
                    <Toast ref={toast} />
                    <EarningsReport />
                </TabPanel>
            </TabView>
        </div>
    )
}

export default Reports;