
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
      var coincidencia = 0;
      for (var valor of usuarios) {
          if(valor == nombre){
            console.log("Se ha encontrado una coincidencia para: " + valor)
            coincidencia ++;
            break;
        }
      }
      if(coincidencia == 0){
          console.log("No hay ninguna coincidencia");
          usuarios.push(nombre);
          console.log("Se ha recibido un nuevo usuario llamado : " + nombre);
      }
      console.log("Usuarios conectados: ");
      for (var valor of usuarios) {
          console.log("Usuario: " + valor);
      }
      io.emit('nuevo usuario',usuarios);
    });

    socket.on('desconecta menu', function(msg){
      let posicion = usuarios.indexOf(msg);
      usuarios.splice(posicion, 1);
      console.log("Se ha eliminado del array a: " + msg);
      for (var valor of usuarios) {
        console.log("Usuarios conectados: " + valor);
      }
  });


    socket.on('posicionX', function(msg,enemigo){
      console.log("Se recibido la posicionX del enemigo : " + enemigo + " , es: " + msg);
      io.emit('posicionX',msg,enemigo)
   });
    socket.on('posicionY', function(msg,enemigo){
      console.log("Se recibido la posicionY del enemigo : " + enemigo + " , es: " + msg);
      io.emit('posicionY',msg,enemigo)
    });

    socket.on('envia mensaje', function(msg,nom){
        console.log(nom + ": " + msg)
      io.emit('envia mensaje',msg,nom)
    });


  socket.on('disconnect', () => {
    console.log('Un socket se ha desconectado');
    numeroSockets --;
    console.log("El numero de sockets actualmente es: " + numeroSockets);
    if(numeroSockets == 0){
      usuarios.length = 0;
      console.log("Ahora mismo no tenemos ningun usuario conectado")
    }
  });

});
httpServer.listen(app.get('port'), function() {
  console.log('Servidor funcionando en el puerto:', app.get('port'));
});