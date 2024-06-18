import {Router} from 'express'
const router = Router();
import multer from "multer";
import controllerConvertedVideo from "../controller/convertedVideo.js"
import controllerConvertedImg from '../controller/convertedImg.js';
import base64 from '../controller/base64.js';
import { fileURLToPath } from 'url';
import path from 'path';

// configurar la carpeta de multer 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: path.resolve(__dirname, '../uploads/') });

// Rutas

// Ruta para la conversión de archivos
router.post("/convertedFile", upload.single('file'), (req, res) => {
    let fileType = ""
    try {
        // Obtener el tipo de archivo (video o imagen)
        fileType = req.file.mimetype.split('/')[0];  
    }catch{}

    // Llamar al controlador correspondiente según el tipo de archivo
    if (fileType === 'video') {
        return controllerConvertedVideo.convertedVideo(req, res);
    } else if (fileType === 'image') {
        return controllerConvertedImg.convertedImg(req, res);
    } else {
        return base64.base64ToFile(req, res);
    }
});


export default router;