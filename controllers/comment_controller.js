// Controlador para Comentarios

// Importamos el modelo
var models = require("../models/models.js");

exports.new = function(req,res){
	res.render('comments/new',{quizid: req.params.quizId, errors: []});
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