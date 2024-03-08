import {Router} from 'express'
import usuarioController from '../controllers/productoController'
const router = Router()


router.get('/', usuarioController.getAllUsuarios)
router.post('/cargar', usuarioController.getAllProducts)

router.get('/:id', usuarioController.getUsuarioById);


export default router;