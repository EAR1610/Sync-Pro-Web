import React from 'react'
import Navbar from '../components/Navbar'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import { Route, Routes } from 'react-router-dom'
import { PrivateRouter } from './PrivateRouter'

const AppRouter = () => {

  return (
    <>      
      <Routes>
        <Route path="/" element={ <Navbar /> } >
          <Route index element={ <HomePage /> } />
          <Route path="login" element={ <LoginPage /> } />
          <Route path="dashboard" element={ 
            <PrivateRouter>
              <DashboardPage />
            </PrivateRouter>
          } />
        </Route>
      </Routes>    
    </>
  )
}

export default AppRouter    