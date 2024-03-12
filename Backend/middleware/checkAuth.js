import jwt from 'jsonwebtoken'
import config from '../utils/config'; 
import Usuario from '../models/user'

const checkAuth = async (req, res, next) => {
    let token;
    if( 
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {            
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, config.SECRET);
                    
            req.user = await Usuario.findByPk(decoded.id);

            return next();
        } catch (error) {
            return res.status(404).json({ msg: 'Hubo u error'});
        }
    }

    if( !token ) {
        const error = new Error('Token no válido');
        return res.status(401).json({ msg: error.message });
    }

    next();
}

export default checkAuth;