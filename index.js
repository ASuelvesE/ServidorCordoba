

const app = require("express")();
const httpServer = require("http").createServer(app);
const cors = require('cors');
app.set('port', (process.env.PORT || 3000));

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
    origin: '*'
}));


var usuarios = [];
// server-side
io.on("connection", (socket) => {

  console.log("Un nuevo socket se ha conectado");

  socket.on('nuevo usuario', function (nombre) {

    console.log('Usuario añadido al array');
    usuarios.push(new Usuario(nombre, socket.id));

    console.log("Se ha recibido un nuevo usuario llamado : " + nombre);

    console.log("Usuarios conectados: ");
    for(var i = 0; i<usuarios.length;i++){
      console.log(usuarios[i].nombre)
    }
    io.emit('actualiza usuarios', usuarios);
  });


  
  socket.on('posicionX', function (msg, enemigo) {
    //  console.log("Se recibido la posicionX del enemigo : " + enemigo + " , es: " + msg);
    // io.emit('posicionX',msg,enemigo)
    socket.broadcast.emit('posicionX', msg, enemigo)
  });
  socket.on('posicionY', function (msg, enemigo) {
    // console.log("Se recibido la posicionY del enemigo : " + enemigo + " , es: " + msg);
    // io.emit('posicionY',msg,enemigo)
    socket.broadcast.emit('posicionY', msg, enemigo)
  });

  socket.on('envia mensaje', function (msg, nom) {
    console.log(nom + ": " + msg)
    io.emit('envia mensaje', msg, nom)
  });

  socket.on('estoy listo', function (msg) {
    console.log("El jugador " + msg + " está READY");
    io.emit('estoy listo', msg)
  });

  socket.on('ganador', function (msg) {
    console.log("El jugador " + msg + " ha ganado")
    io.emit('ganador', msg)
  });

  socket.on('perdedor', function (msg) {
    console.log("El jugador " + msg + " ha perdido")
    io.emit('perdedor', msg)
  });


  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado: ' + socket.id);
    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].socket == socket.id) {
        console.log("Se ha eliminado del array a: " + usuarios[i].nombre);
        usuarios.splice(i, 1);
      }
    }
    io.emit('actualiza usuarios', usuarios);
  });

});
httpServer.listen(app.get('port'), function () {
  console.log('Servidor funcionando en el puerto:', app.get('port'));
});



////////////////////-------CLASES ------------------------------------////////////////////////////


class Usuario {
  constructor(nombre, socket) {
    this.nombre = nombre;
    this.socket = socket;

  }
}