// Controlador

// Importamos el modelo
var models = require("../models/models.js");

exports.load = function(req,res,next,quizId){
	models.Quiz.findById(quizId).then(
		function(quiz){
			if (quiz){
				req.quiz = quiz;
				next();
			} else {
				next(new Error("No existe el quizId=" + quizId));
			}
		}
	).catch(function(error){next(error);});

};


exports.index = function(req,res){
  console.log(req.query.search.replace(/\+/g,'%'));
  models.Quiz.findAll({where: {pregunta: {$like: "%"+ req.query.search.replace(/\s/g,'%') + "%"}}}).then(function(quizes){
  	res.render('quizes/index', { quizes: quizes});
  }).catch(function(error){next(error);});
};

exports.show = function(req,res){
  	res.render('quizes/show', {quiz: req.quiz});
};

exports.answer =function(req, res){
	if (req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()){
		res.render("quizes/answer",{quiz: req.quiz, Respuesta: "Correcto", color: "green"});
	}else{
	    res.render("quizes/answer",{quiz: req.quiz, Respuesta: "Incorrecto", color: "red"});
	};
};
