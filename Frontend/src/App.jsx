import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AuthLayout from './layouts/AuthLayout'
import RutaProtegida from './layouts/RutaProtegida'

import { AuthProvider } from './context/AuthProvider'
import { DashboardProvider } from './context/DashboardProvider'

import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import VentasPage from './pages/VentasPage'
import CajaPage from './pages/CajaPage'
import Orders from './pages/Orders'

function App() {

  return (
    <BrowserRouter>
        <AuthProvider> 
            <DashboardProvider>
              <Routes>
                  <Route path='/' element={ <AuthLayout /> }>                    
                    <Route path='login' element={ <LoginPage /> } />
                  </Route>
                  
                  <Route path='/dashboard' element={ <RutaProtegida /> }>
                    <Route index element={ <DashboardPage /> } />
                    <Route path='ventas' element={ <VentasPage /> } />
                    <Route path='cajas' element={ <CajaPage /> } />
                    <Route path='pedidos' element={<Orders />} />
                  </Route>
              </Routes>          
            </DashboardProvider>
        </AuthProvider>
    </BrowserRouter>
  )
}

export default App
