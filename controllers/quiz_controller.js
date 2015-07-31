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
  models.Quiz.findAll({where: {pregunta: {$like: "%"+ req.query.search.replace(/\s/g,'%') + "%"}}
								, order: ['pregunta']})
	.then(function(quizes){
  	res.render('quizes/index', { quizes: quizes, errors: []});
  }).catch(function(error){next(error);});
};

exports.show = function(req,res){
  	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

exports.new = function(req,res){
	var quiz= models.Quiz.build( //Crea Objeto quiz
		{pregunta: "Pregunta", respuesta:"Respuesta"}
	);
	res.render('quizes/new',{quiz:quiz, errors: []});
};

exports.create= function(req,res){
	var quiz= models.Quiz.build(req.body.quiz);
	//Guardame en DB
	quiz
		.validate()
		.then(function(err){
			if(err){
				res.render('quizes/new',{quiz: quiz, errors: err.errors});
			} else {
				quiz
					.save({fields: ["pregunta", "respuesta"]})
					.then(function(){res.redirect('/quizes?search=')})
			}
		});
};

exports.answer =function(req, res){
	if (req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()){
		res.render("quizes/answer",{quiz: req.quiz, errors: [], Respuesta: "Correcto", color: "green"});
	}else{
	    res.render("quizes/answer",{quiz: req.quiz, errors: [], Respuesta: "Incorrecto", color: "red"});
	};
};

exports.editar =function(req, res){
	var quiz = req.quiz;
	res.render('quizes/editar',{quiz: quiz, errors: []});
};

exports.update= function(req,res){
	req.quiz.pregunta=req.body.quiz.pregunta;
	req.quiz.respuesta=req.body.quiz.respuesta;

	//GActualiza en DB
	req.quiz
		.validate()
		.then(function(err){
			if(err){
				res.render('quizes/editar',{quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz
					.save({fields: ["pregunta", "respuesta"]})
					.then(function(){res.redirect('/quizes?search=')})
			}
		});
};

exports.borrar= function(req,res){

	//Borra registro
	console.log("Borrando" + req.quiz);
	req.quiz
		.destroy()
		.then(function(){
				res.redirect('/quizes?search=');
			}).catch(function(error){next(error)});

};
