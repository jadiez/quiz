// Definicion del modelo Comentarios

module.exports = function(sequelize, DataTypes){

	return sequelize.define("Comments",
		{
			texto:{
				type: DataTypes.STRING,
				validate: {notEmpty: {msg:"=> Falta Comentario !"}}
			},
			publicado: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},

		{
			classMethods: {
				countDistinctQuizId: function(){
					return this.aggregate('QuizId', 'count', {'distinct': true })
					.then('success',function(count) {
						return count;
					});
				},
				countUnPublished: function(){
					return this.aggregate('QuizId', 'count', {'where': { 'publicado': false }})
					.then('success',function(count) {
						return count;
					});
				}	

			}
		}
	);
};