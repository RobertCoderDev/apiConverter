import express from 'express'
import cors from 'cors';
import job from "./tools/deleteUploads.js"
import path from 'path';
import { fileURLToPath } from 'url';

//crear servidor con node

const app = express();
const puerto = 3900;

//Inicializar app
console.log("App de node arrancada");

// configurar cors 

app.use(cors());

// convertir body a objeto js

app.use(express.json());  // recibir datos con content-type app/json
app.use(express.urlencoded({ extended: true})); // form-urlencoded app/json


// Servir archivos estáticos desde la carpeta 'output'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('./src/output', express.static(path.join(__dirname, 'output')));


//routes

import router from './src/routes/routes.js';


// cargo las routes

app.use("/converted", router);


//crear servidor y escuchar peticiones http

app.listen(puerto, () => {
    console.log("servidor corriendo en el puerto " + puerto);
});

//ruta hard codeada  

app.get("/", (req, res) => {
    return res.status(200).send("<h1>Api Converted</h1>")
})


// llamada a la función para borrar elementos de uploads 
job.start();