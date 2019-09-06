// * Valuables requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

// * Initiation valuables
var app = express();

// * Uploads files
app.use(fileUpload());

// * Models
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


// * Rest Services

// Rest
app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // * Valid Coleccions
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { mesagge: 'Tipo de coleccion no es valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono archivo',
            errors: { mesagge: 'Debe seleccionar una imagen' }
        });
    }

    // * Get name

    var archivo = req.files.imagen;
    var cadenaNames = archivo.name.split('.');
    var extensionArchivo = cadenaNames[cadenaNames.length - 1];

    // * Valid Extentions
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { mesagge: 'Las extensiones validas son ' + extensionesValidas.join(',') }
        });
    }

    // * Custom file name
    var nomreArchivo = `${ id }-${new Date().getMilliseconds()}.${extensionArchivo}`;


    // * Moving file
    var path = `./uploads/${tipo}/${nomreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Erroal mover el arcivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nomreArchivo, res);

    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (err, usuario) => {
                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Usuario no existe ',
                        errors: { message: 'Usuario no existe' }
                    });
                }
                var pathViejo = './uploads/usuarios/' + usuario.img;
                // ! Delete old inage
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al eliminar la imagen ',
                        errors: err
                    });
                }

                usuario.img = nombreArchivo;
                usuario.save((err, usuarioActualizado) => {
                    usuarioActualizado.password = ':)';
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Erro actualizar la imagen del usuario ',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada',
                        usuario: usuarioActualizado
                    })
                });
            });
            break;
        case 'medicos':
            Medico.findById(id, (err, medico) => {
                if (!medico) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Medico no existe ',
                        errors: { message: 'Medico no existe' }
                    });
                }

                var pathViejo = './uploads/medicos/' + medico.img;
                // ! Delete old inage
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al eliminar la imagen ',
                        errors: err
                    });
                }

                medico.img = nombreArchivo;
                medico.save((err, medicoActualizado) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error actualizar la imagen del medico ',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de medico actualizada',
                        medico: medicoActualizado
                    })
                });
            });
            break;
        case 'hospitales':
            Hospital.findById(id, (err, hospital) => {
                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'hospital no existe ',
                        errors: { message: 'hospital no existe' }
                    });
                }
                var pathViejo = './uploads/hospitales/' + hospital.img;
                // ! Delete old inage
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al eliminar la imagen ',
                        errors: err
                    });
                }

                hospital.img = nombreArchivo;
                hospital.save((err, hospitalActualizado) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error actualizar la imagen del medico ',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de hospital actualizada',
                        hospital: hospitalActualizado
                    })
                });
            });
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: Usuarios , Medicos y Hospitales',
                error: { mesagge: 'Tipo de coleccion no valida' }
            });
            break;
    }
}



module.exports = app;