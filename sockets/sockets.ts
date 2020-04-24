import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';


export const usuariosConectados = new UsuariosLista();

export const conectarCliente = (cliente: Socket, io: socketIO.Server) =>{
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
}

export const desconectar = (cliente: Socket, io: socketIO.Server) =>{
    cliente.on('disconnect', () => {
        var usuario = usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getLista());
    })
}

//Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload : {de: string, cuerpo:string}, callback) =>{
        console.log('Mensaje recibido: ', payload);

        io.emit('mensaje-nuevo', payload);
    })
}

//Escuchar Login

export const login = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('configurar-usuario', (payload, callback)=>{
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
        io.emit('usuarios-activos', usuariosConectados.getLista());
        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre} configurado`
        })
    })
}

//Obtener usuarios

export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) =>{
    cliente.on('obtener-usuarios', (payload, callback)=>{
        io.emit('usuarios-activos', usuariosConectados.getLista());
    })
}