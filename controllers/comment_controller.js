// Controlador para Comentarios

// Importamos el modelo
var models = require("../models/models.js");

exports.load = function(req,res,next,commentId){
	models.Comment.findById(commentId)
		.then(function(comment){
			if (comment){
				req.comment = comment;
				next();
			} else {
				next(new Error("No existe commentId= "+ commentId));
			};
		}).catch(function(error){next(error)});
};

exports.new = function(req,res){
	res.render('comments/new',{quizid: req.params.quizId, quiz: req.body.pregunta, errors: []});
};

exports.create= function(req,res){
	var comment= models.Comment.build(
		{ texto: req.body.comment.texto,
		  QuizId: req.params.quizId
		});

	console.log(comment);
	//Guardame en DB
	comment
		.validate()
		.then(function(err){
			if(err){
				res.render('commets/new',{comment: comments, quizid: req.params.quizId, errors: err.errors});
			} else {
				comment
					.save({fields: ["texto", "QuizId"]})
					.then(function(){res.redirect('/quizes/'+ req.params.quizId)})
			}
		}).catch(function(error){next(error)});
};	

exports.publish = function(req,res){
	req.comment.publicado = true;

	req.comment.save({fields: ["publicado"]})
		.then(function(){ res.redirect('/quizes/' + req.params.quizId);})
		.catch(function(error){next(error)});
};