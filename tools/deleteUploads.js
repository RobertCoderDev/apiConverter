import cron from 'cron';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const CronJob = cron.CronJob;

// Ruta absoluta a la carpeta uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../src/uploads');

// Función para eliminar archivos en la carpeta uploads
const cleanUploadsFolder = () => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error al leer la carpeta uploads:', err);
            return;
        }

        // Iterar sobre los archivos y eliminar cada uno
        files.forEach(file => {
            const filePath = path.join(uploadsDir, file);

            fs.unlink(filePath, err => {
                if (err) {
                    console.error(`Error al eliminar el archivo ${file}:`, err);
                } else {
                    console.log(`Archivo ${file} eliminado correctamente.`);
                }
            });
        });
    });
};

// Configurar el job de cron para ejecutarse cada 5 minutos
const job = new CronJob('0 */1 * * * *', () => {
    console.log('Ejecutando limpieza de la carpeta uploads...');
    cleanUploadsFolder();
});

export default job;