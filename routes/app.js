// Requires
var express = require('express');

//Inicializar variables
var app = express();

// Rest
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    })
});


// Exportaciones
module.exports = app;