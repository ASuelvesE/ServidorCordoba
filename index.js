
const app = require("express")();
const httpServer = require("http").createServer(app);
app.set('port', (process.env.PORT || 3000));

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


var numeroSockets = 0;
var usuarios  = [];
// server-side
io.on("connection", (socket) => {

    console.log("Un nuevo socket se ha conectado"); 
    numeroSockets ++;
    console.log("El numero de sockets actualmente es: " + numeroSockets);


  socket.on('nuevo usuario', function(nombre){
    console.log("Se ha recibido un nuevo usuario llamado : " + nombre);
    usuarios.push(nombre);
    io.emit('nuevo usuario',usuarios);
    for (var valor of usuarios) {
      console.log("Usuarios conectados: " + valor);
    }
  });

  socket.on('desconecta menu', function(msg){
    let posicion = usuarios.indexOf(msg);
    usuarios.splice(posicion, 1);
    console.log("Se ha eliminado del array a: " + msg);
    for (var valor of usuarios) {
      console.log("Usuarios conectados: " + valor);
    }
  });


  socket.on('disconnect', () => {
    console.log('Un socket se ha desconectado');
    numeroSockets --;
    console.log("El numero de sockets actualmente es: " + numeroSockets);

  });

});
httpServer.listen(app.get('port'), function() {
  console.log('Servidor funcionando en el puerto:', app.get('port'));
});