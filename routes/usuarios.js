/*
    Rutas de Usuarios / usuarios
    Base -> host + /api/usuarios
*/

const express = require('express');
const ruta = express.Router();

const { existeUsuario } = require('../helpers/existeUsuario');
const { validarUsuario } = require('../helpers/validarUsuario');

const usuarios = [
    { id:1, nombre:'Grover' },
    { id:2, nombre:'Pablo' },
    { id:3, nombre:'Ana' },
];


ruta.get('/', (req,res) => {
    res.send(usuarios);
});

ruta.get('/:id', (req,res) => {    
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send( usuario );
});

ruta.post('/' , (req,res) =>  {

    const { nombre } = req.body;    
       
    const { error , value } = validarUsuario( nombre );
    
    if(!error){
        const usuario = {
            id:usuarios.length+1,
            nombre:value
        };
        usuarios.push( usuario );
        res.send( usuarios );
    }else{
        const { details } = error;
        res.status(400).send(details[0].message);
    }
        
});

ruta.put('/:id' , (req,res) => {
    
    // let usuario = usuarios.find( usuario => 
    //     usuario.id === parseInt(req.params.id)
    // );
    let usuario = existeUsuario(usuarios,req.params.id)
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }
    const { nombre } = req.body;              
    const { error , value } = validarUsuario( nombre );
            
    if(error){
        const { details } = error;        
        res.status(400).send(details[0].message);
        return;
    }
    

    usuario.nombre = value.nombre;

    res.status(200).send(usuarios);

});

ruta.delete('/:id', (req,res) => {

    let usuario = existeUsuario(usuarios,req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(  index, 1 );

    res.send(  usuarios );
})

module.exports = ruta;