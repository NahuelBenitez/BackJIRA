require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes/routes');
const { createEpic } = require('./controllers/epicController');
const { createIssue } = require('./controllers/issueController');

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Rutas API
app.use('/api', routes);

// Inicializar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Función para crear una nueva epic y una nueva issue
const createEpicAndIssue = async () => {
  try {
    // Crear una nueva epic
    const epic = await createEpic('Creando Epica Sola', 'Descripción de la epic');
    console.log('Epic creada:', epic);

    // Crear una nueva issue
    const issue = await createIssue('ISSUE SOLA', 'Descripción de la issue');
    console.log('Issue creada:', issue);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Llamar a la función para crear una nueva epic y una nueva issue
// createEpicAndIssue();
