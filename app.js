const express = require('express');
const Joi = require('joi');
const { response , request } = express;
const app = express();
app.use(express.json());

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

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
       
    const { error , value } = validarUsuario( nombre );
    const { details } = error;
    if(!error){
        const usuario = {
            id:usuarios.length+1,
            nombre:value
        };
        usuarios.push( usuario );
        res.send( usuarios );
    }else{
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

