import { Router } from 'express'
const router = Router()

import {
    signUp,
    signIn,
    perfil,
    users
} from '../controllers/authController'

import checkAuth from  '../middleware/checkAuth'

//Autenticación de usuarios
router.post('/signup', signUp)
router.post('/signin', signIn)
router.get('/perfil', checkAuth, perfil);
router.get('/users', users);


export default router;