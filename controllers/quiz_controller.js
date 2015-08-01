// Controlador

// Importamos el modelo
var models = require("../models/models.js");

var temas = ["Otros","Geografia","Ciencia","Deportes","Espectaculos","Historia","Arte"];

exports.load = function(req,res,next,quizId){
	models.Quiz.find({
		where:{ id: Number(quizId) },
		include: [{model:models.Comment}]
	}).then(function(quiz){
			if (quiz){
				req.quiz = quiz;
				next();
			} else {
				next(new Error("No existe el quizId=" + quizId));
			}
		}
	).catch(function(error){next(error)});

};


exports.index = function(req,res){

  var cadenaFiltro = (req.query.search)?"%"+req.query.search.replace(" ",'%')+'%':"%";

  models.Quiz.findAll(
  	{where: {$or: [{pregunta: {$like: cadenaFiltro}}, {tema: {$like: cadenaFiltro}}]
  			}
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
	res.render('quizes/new',{quiz:quiz, errors: [], temas:temas});
};

exports.create= function(req,res){
	var quiz= models.Quiz.build(req.body.quiz);
	//Guardame en DB
	quiz
		.validate()
		.then(function(err){
			if(err){
				res.render('quizes/new',{quiz: quiz, temas:temas, errors: err.errors});
			} else {
				quiz
					.save({fields: ["pregunta", "respuesta", "tema"]})
					.then(function(){res.redirect('/quizes')})
			}
		}).catch(function(error){next(error)});
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
	res.render('quizes/editar',{quiz: quiz, temas:temas,errors: []});
};

exports.update= function(req,res){
	req.quiz.pregunta=req.body.quiz.pregunta;
	req.quiz.respuesta=req.body.quiz.respuesta;
	req.quiz.tema=req.body.quiz.tema;	

	//GActualiza en DB
	req.quiz
		.validate()
		.then(function(err){
			if(err){
				res.render('quizes/editar',{quiz: req.quiz, temas:temas, errors: err.errors});
			} else {
				req.quiz
					.save({fields: ["pregunta", "respuesta", "tema"]})
					.then(function(){res.redirect('/quizes')})
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
