// Importa paquetes con middlewares
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');

// Importar enrutadores
var routes = require('./routes/index');

// Crea Aplicacion
var app = express();

// Definimos parámetros a la aplicación
app.set('views', path.join(__dirname, 'views'));  //Define el directorio de vistas
app.set('view engine', 'ejs');

// Instalacion de middlewares de los paquetes instalados
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

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
