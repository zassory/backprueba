const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const usuarios = require('./routes/usuarios');
const express = require('express');
const config = require('config');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios );

//Configuracion de entornos
console.log('Aplicacion: '+ config.get('nombre'));
console.log('BD server: '+ config.get('configDB.host'));

//Uso de un middleware de tercer - Morgan
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan esta habilitado');
}

//Trabajos con la base de datos
debug('Conectando con la bd...');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${ port }...`);
});


