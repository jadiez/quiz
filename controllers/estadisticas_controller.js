// Importamos el modelo
var models = require("../models/models.js");
var Sequelize = require('sequelize');

var resumen = {
	numQuizes 			: 0,
	numComents 			: 0,
	mediaCommentQuiz 	: 0,
	numQuizesSinComents : 0,
	numQuizesConComents : 0,
  numComentstUnPublished : 0
}

exports.calculos = function(req,res,next){
	// Con la ayuda de Francisco Fornell...
	//Se ha usado el método all de Promises (implementado ya en sequelize), ya que
  //de esta forma se ejecutan las consultas asíncronamente en paralelo y se
  //continúa cuando han acabado todas.
    Sequelize.Promise.all([
      models.Quiz.count(),
    	models.Comment.count(),
    	models.Comment.countDistinctQuizId(),
      models.Comment.countUnPublished()
    ]).then( function( values ){
       resumen.numQuizes=values[0];
       resumen.numComents=values[1];
       resumen.mediaCommentQuiz=(values[1]/values[2]).toFixed(2);
       resumen.numQuizesConComents=values[2];
       resumen.numQuizesSinComents=values[0]-values[2];
       resumen.numComentstUnPublished = values[3];
   }).catch( function (err) {
       next(err);
   }).finally( function() {
       next();
   });

};

exports.show = function(req,res){
	res.render('quizes/estadisticas', {errors: [], resumen: resumen});
};
