import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Inventory from './components/Inventory';
import AppRouter from './router/AppRouter';

function App() {

  return (
    <AppRouter />
  )
}

export default App
