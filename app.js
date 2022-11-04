const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');
//const { log } = require('./logger');
const morgan = require('morgan');
const Joi = require('joi');
const { get } = require('config');
const { response , request } = express;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//Configuracion de entornos
console.log('Aplicacion: '+ config.get('nombre'));
console.log('BD server: '+ config.get('configDB.host'));

//Uso de un middleware de tercer - Morgan
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    //console.log('Morgan habilitado');
    debug('Morgan esta habilitado');
}

//Trabajos con la base de datos
debug('Conectando con la bd...');


//app.use(log);

// app.use(function(req,res,next){
//     console.log('Autenticando');
//     next();
// })

const usuarios = [
    { id:1, nombre:'Grover' },
    { id:2, nombre:'Pablo' },
    { id:3, nombre:'Ana' },
];

app.get('/',    (req,res) => {
    res.send('Hola Mundo desde Express.');
});

app.get('/api/usuarios', (req,res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req,res) => {    
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send( usuario );
});

app.post('/api/usuarios' , (req,res) =>  {

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

app.put('/api/usuarios/:id' , (req,res) => {
    
    // let usuario = usuarios.find( usuario => 
    //     usuario.id === parseInt(req.params.id)
    // );
    let usuario = existeUsuario(req.params.id)
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

app.delete('/api/usuarios/:id', (req,res) => {

    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(  index, 1 );

    res.send(  usuarios );
})

//------------------------------------------------->

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${ port }...`);
});

function existeUsuario(id){
    return(usuarios.find( usuario => usuario.id === parseInt(id)));
}

function validarUsuario(nombre){
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({ nombre }));
}

