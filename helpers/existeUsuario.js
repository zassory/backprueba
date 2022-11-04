

const existeUsuario = ( usuarios , id ) => {
    return(usuarios.find( usuario => usuario.id === parseInt(id)));
}

module.exports = {
    existeUsuario
}
