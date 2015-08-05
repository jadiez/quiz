// Importamos el modelo
var models = require("../models/models.js");
var Sequelize = require('sequelize');

var resumen = {
	numQuizes 			: 0,
	numComents 			: 0,
	mediaCommentQuiz 	: 0,
	numQuizesSinComents : 0,
	numQuizesConComents : 0
}

exports.calculos = function(req,res){
	// Con la ayuda de Francisco Fornell...
	//Se ha usado el método all de Promises (implementado ya en sequelize), ya que
    //de esta forma se ejecutan las consultas asíncronamente en paralelo y se
    //continúa cuando han acabado todas.
    Sequelize.Promise.all([
      	models.Quiz.count(),
    	models.Comment.count(),
    	models.Comment.countDistinctQuizId(),
        models.Comment.countPublished()
    ]).then( function( values ){
       resumen.numQuizes=values[0];
       resumen.numComents=values[1];
       resumen.mediaCommentQuiz=values[2];
       resumen.numQuizesConComents=values[3];
       resumen.numQuizesSinComents=values[0]-values[3];
   }).catch( function (err) {
       next(err);
   }).finally( function() {
       next();
   });

};

exports.show = function(req,res){
	res.render('statics/estadisticas', {errors: [], resumen: resumen});
};
