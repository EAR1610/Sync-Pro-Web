import React, { useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toast } from 'primereact/toast';

import AuthLayout from './layouts/AuthLayout'
import RutaProtegida from './layouts/RutaProtegida'

import { AuthProvider } from './context/AuthProvider'
import { DashboardProvider } from './context/DashboardProvider'

import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import CajaPage from './pages/CajaPage'
import Orders from './pages/Orders'
import Sellers from './pages/Sellers'
import Reports from './pages/Reports'
import Customers from './pages/Customers'

function App() {
  const toast = useRef(null);
  
  return (
    <BrowserRouter>
        <Toast ref={toast} />
        <AuthProvider> 
            <DashboardProvider>
              <Routes>
                  <Route path='/' element={ <AuthLayout /> }>                    
                    <Route path='login' element={ <LoginPage toast={toast} />  } />
                  </Route>
                  
                  <Route path='/dashboard' element={ <RutaProtegida /> }>
                    <Route index element={ <DashboardPage /> } />
                    <Route path='cajas' element={ <CajaPage /> } />
                    <Route path='pedidos' element={<Orders />} />
                    <Route path='vendedores' element={<Sellers />} />
                    <Route path='reportes' element={<Reports />} />
                    <Route path='clientes' element={<Customers />} />
                  </Route>
              </Routes>          
            </DashboardProvider>
        </AuthProvider>
    </BrowserRouter>
  )
}

export default App
