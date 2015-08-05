// Importa paquetes con middlewares
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require("express-session");

// Importar enrutadores
var routes = require('./routes/index');

// Crea Aplicacion
var app = express();

// Definimos parámetros a la aplicación
app.set('views', path.join(__dirname, 'views'));  //Define el directorio de vistas
app.set('view engine', 'ejs');

// Instalacion de middlewares de los paquetes instalados
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('semilla'));
app.use(session({
  secret: 'semilla',
  resave: false,
  saveUninitialized: true
}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());


//Helpers dinamicos
app.use(function(req,res,next){
  //Guarda path en session.redir para despues del logout
  if(!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;
  };
  
  // Crea campo session.refreshTime
  req.session.refreshTime = new Date().getTime();

  // Hacer visible req.session en las vistas guardándola en una varible local
  res.locals.session = req.session;
  next();

});

// MW para comprobar inactividad de inicio de sesion
app.use(function(req,res,next){
  var tiempoMaxInactividad = 10*1000; // 2 minutos en milisegundos

  //Comprobamos si hay un usuario con sesión iniciada 
  if(req.session.user){

    //Comprobamos el tiempo de inactividad
    if(req.session.refreshTime-req.session.user.loginTime >= tiempoMaxInactividad){
      // Destrimos la sesion damos un error 
      //req.session.destroy();

      delete req.session.user;
      var err = new Error("Tiempo de inactividad superado");
      next(err);
      //res.redirect(req.session.redir.toString());

      //res.redirect("/logout");
      

    }
  } 
  next();

});

//Instalamos middlewares de los enrutadores propios
app.use('/', routes);

// Respuesta a cualquier otra ruta
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
// GESTION DE ERRORES DURANTE EL DESARROLLO
if (app.get('env') === 'development') {
  // uSAMOS ESTE MIDDLEWARE
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors:[]
    });
  });
}

// GESTION DE ERRORES EN PRODUCCION
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error' ,{
    message: err.message,
    error: {}, 
    errors:[]
  });
});


module.exports = app;
