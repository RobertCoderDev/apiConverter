import fs from 'fs';
import { fileURLToPath } from 'url';  // Importa la función fileURLToPath para trabajar con URL
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const base64ToFile = async (req, res) => {
    try {
        const base64Text = req.body.text

        const outputDir = path.resolve(__dirname, '..', 'output');

        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const outputFileName = `image_${timestamp}.png`;
        const outputPath = path.join(outputDir, outputFileName);

        fs.writeFile(outputPath, base64Text, {encoding: 'base64'}, function(err) {
            console.log('File created');
        });

        scheduleFileDeletion(outputPath);

        const fileUrl = `${req.protocol}://${req.get('host')}/output/${outputFileName}`;
        res.status(200).json({ message: 'Conversión de imagen completada.', fileUrl: fileUrl });


    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
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
    base64ToFile,
};