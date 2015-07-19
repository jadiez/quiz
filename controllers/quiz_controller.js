// Controlador

// Importamos el modelo
var models = require("../models/models.js");

exports.index = function(req,res){
  models.Quiz.findAll().then(function(quizes){
  	console.log(quizes);
  	res.render('quizes/index', { quizes: quizes});
  });
};

exports.show = function(req,res){
  models.Quiz.findById(req.params.quizId).then(function(quiz){
  	res.render('quizes/show', {quiz: quiz});
  });
};

exports.answer =function(req, res){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
	  if (req.query.respuesta.toUpperCase() === quiz.respuesta.toUpperCase()){
	    res.render("quizes/answer",{quiz: quiz, Respuesta: "Correcto", color: "green"});
	  }else{
	    res.render("quizes/answer",{quiz: quiz, Respuesta: "Incorrecto", color: "red"});
	  };
	});
};
