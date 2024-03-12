import { Router } from 'express'
const router = Router()

import {
    signUp,
    signIn,
    perfil
} from '../controllers/authController'

import checkAuth from  '../middleware/checkAuth'

//Autenticación de usuarios
router.post('/signup', signUp)
router.post('/signin', signIn)
router.get('/perfil', checkAuth, perfil);


export default router;