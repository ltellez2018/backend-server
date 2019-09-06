// * Valuables requires
var express = require('express');
var mdAtenticacion = require('../middlewares/autenticacion');

// * Initiation valuables
var app = express();

// * Schema Imported
var Medico = require('../models/medico');


// * Rest Services


// * get all 'medicos'

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    })
                }

                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });

            });

});

// * Create 'medico'
app.post('/', mdAtenticacion.verificaToke, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el medico',
                errors: err
            })
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        })

    });
})


// * Update 'medico'

app.put('/:id', mdAtenticacion.verificaToke, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el medico',
                errors: err
            })
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: `El medico con el ${id} no existe`,
                errors: { message: 'No existe un medico con ese ID' }
            })
        }
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                })
            }
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            })

        })
    });
});

// * Delete 'medico'

app.delete('/:id', mdAtenticacion.verificaToke, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            })
        }

        if (!medicoBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            })
        }


        return res.status(200).json({
            ok: false,
            medico: medicoBorrado
        })
    });
});

// * Exportations
module.exports = app;