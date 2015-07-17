// Controlador

// Importamos el modelo
var models = require("../models/models.js");

exports.question = function(req,res){
  models.Quiz.findAll().then(function(quiz){
  	res.render('quizes/question', { pregunta: quiz[0].pregunta});
  });
};

exports.answer =function(req, res){
	models.Quiz.findAll().then(function(quiz){
	  if (req.query.respuesta.toUpperCase() === quiz[0].respuesta.toUpperCase()){
	    res.render("quizes/answer",{Respuesta: "Correcto", color: "green"});
	  }else{
	    res.render("quizes/answer",{Respuesta: "Incorrecto", color: "red"});
	  };
	});
};
