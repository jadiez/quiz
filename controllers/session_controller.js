// Controlador para Cgestion de sesions de users

// Importamos el modelo
var models = require("../models/models.js");

// GET/Login -- Formulario de login
exports.new = function(req,res){
	var errors = req.session.errors || {};
	req.session.errors ={};

	res.render('sessions/new',{ errors: errors});
};

// POST/Login -- Crear la session
exports.create= function(req,res){
	var login = req.body.login;
	var password = req.body.password;

	var userController = require("./user_controller");
	userController.autenticar(login, password, function(error, user){
		if(error){   //Si hay error devolvemos mensajes de error
			req.session.errors=[{"message": error}];
			res.redirect("/login");
			return;

		}
	// Si no hay error creamos req.session.user y guardamos campos id y username
	// La sesión se define por la existencia de: req.session.user

	req.session.user= {id: user.id, username: user.username};
	res.redirect(req.session.redir.toString()); // Redirecciona al path anterior al login
	})
};	

// DELETE / Logout -- Destruye sesión
exports.destroy = function(req, res){
	delete req.session.user;
	res.redirect(req.session.redir.toString()); // Redirecciona al path anterior al login

}

// Controla si hay un usuario esta logeado
exports.loginRequired = function(req,res, next){
	if(req.session.user){
		next();
	} else {
		res.redirect("/login");
	}
}