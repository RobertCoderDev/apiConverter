import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import { fileURLToPath } from 'url';  // Importa la función fileURLToPath para trabajar con URL
import path from 'path';
import fs from 'fs';

// Obtiene la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertedImg = async (req, res) => {
    try {
        // Asegurar de que se haya subido un archivo
        if (!req.file) {
            return res.status(400).send("No se ha subido ningún archivo.");
        }

        // Ruta del archivo de entrada (subido)
        const inputPath = req.file.path;

        // Ruta del directorio de salida específico
        const outputDir = path.resolve(__dirname, '..', 'output');
        
        // Verificar y crear la carpeta 'output' si no existe
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Generar nombre único para el archivo de salida (incluye fecha y hora actual)
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const outputFileName = `image_${timestamp}.jpg`;
        const outputPath = path.join(outputDir, outputFileName);

        ffmpeg.setFfmpegPath(ffmpegStatic);
        ffmpeg(inputPath)
            .outputOptions('-qscale', '0') // Control de calidad: 0 es la mejor calidad
            .output(outputPath)
            .on('end', () => {
                console.log('FFmpeg has finished image conversion.');
                scheduleFileDeletion(outputPath);
                res.status(200).send('Conversión de imagen completada.');
            })
            .on('error', (error) => {
                console.error('Error en la conversión de imagen:', error);
                res.status(500).send('Error en la conversión de imagen.');
            })
            .run();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor.");
    }
};

function scheduleFileDeletion(filePath) {
    // Calcula la fecha y hora actual más 5 minutos
    const deleteTime = new Date(Date.now() + 1 * 60 * 1000);

    // Programa la eliminación del archivo después de 5 minutos
    setTimeout(() => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error al eliminar el archivo ${filePath}:`, err);
            } else {
                console.log(`Archivo ${filePath} eliminado automáticamente después de 5 minutos.`);
            }
        });
    }, deleteTime.getTime() - Date.now());
}

export default {
    convertedImg,
};