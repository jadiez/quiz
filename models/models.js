// Define el modelo

var path = require("path");

//Postgre
//SQLite



var url=(process.env.DATABASE_URL||"sqlite://:@:/").match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/); 

var DB_name = (url[6] || null);
var user    = (url[2] || null);
var pwd     = (url[3] || null);
var protocol= (url[1] || null);
var dialect = (url[1] || null);
var port    = (url[5] || null);
var host    = (url[4] || null);
var storage = (process.env.DATABASE_STORAGE||"quiz.sqlite");


//Cargar modelo ORM
var Sequelize = require("sequelize");

// Usar BBDD SQLITE o Postgre
var sequelize = new Sequelize(DB_name, user, pwd,
					{dialect  : dialect,
					 protocol : protocol,
					 port     : port,
					 host	  : host, 
					 storage  : storage, //solo SQLite
					 omitNull : true     //solo Postgre
					}
);


// Importar la definición de la tabla Quiz en quiz.sqlite
var quiz_path = path.join(__dirname,"quiz");
var Quiz = sequelize.import(quiz_path);



exports.Quiz = Quiz;

Quiz.sync().then(function(){
	//Comprobamos si existen registros
	Quiz.count().then(function(count){
		if(count===0){
			Quiz.create({
				pregunta:"Capital de Portugal",
				respuesta:"Lisboa"
			});
			Quiz.create({
				pregunta:"Capital de Madrid",
				respuesta:"Madrid"
			});
			Quiz.create({
				pregunta:"Capital de Italia",
				respuesta:"Roma"
			}).then(function(){
				console.log("Base de Datos Inicializada");
			});
		}else{
			console.log("Base de Datos EXistente");
		}
	})

})
