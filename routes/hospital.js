// * Valuables requires
var express = require('express');
var mdAtenticacion = require('../middlewares/autenticacion');

// * Initiation valuables
var app = express();

// * Schema Imported
var Hospital = require('../models/hospital');


// * Rest Services


// * get all 'hospitales'

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    })
                }

                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                });


            });
});

// * Create 'hospital'
app.post('/', mdAtenticacion.verificaToke, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el hospital',
                errors: err
            })
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        })

    });
})


// * Update 'Hospital'

app.put('/:id', mdAtenticacion.verificaToke, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el hospital',
                errors: err
            })
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: `El hospital con el ${id} no existe`,
                errors: { message: 'No existe un hospital con ese ID' }
            })
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                })
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            })

        })
    });
});

// * Delete 'hospital'

app.delete('/:id', mdAtenticacion.verificaToke, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            })
        }

        if (!hospitalBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            })
        }


        return res.status(200).json({
            ok: false,
            hospital: hospitalBorrado
        })
    });
});

// * Exportations
module.exports = app;