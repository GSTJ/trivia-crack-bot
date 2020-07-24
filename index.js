//Funções feitas especificamente para lidar com o jogo.
const    request = require('request')
var      cookie  = ''
function Post(link,data) {return new Promise(complete => request.post({url:link,headers:{'Cookie':cookie}}, (error, response, body) => complete(body)).json(data))}
function Get(link)		 {return new Promise(complete => request.get ({url:link,headers:{'Cookie':cookie}}, (error, response, body) => complete(JSON.parse(body))))}
function Sleep(ms)		 {return new Promise(resolve  => setTimeout  (resolve, ms))}
//

var acess_token = 'EAADZBkYnKQK4BAFeFEzZAkZB4joQWZCPkEannVuwAZBOoamtulK0qYmZAK85nboEEkRK6nocIMZCtd6s0LrVrXSX1jZBOOObiTkHerCD2vHd746sqpkBQX8TS8QF8YtlgQlrdbTS5QHOJj9PWxKWyGRoejXp91GsfjZC2VCwFgwmZBqoykdIbBnw52MoUssdAiSE0TKlCVdNroyAZDZD'
function Error(error){ switch (error){
	case 2013: 
		console.log('Suas vidas acabaram.')
	break
	case 190:
		console.log('Seu token expirou!')
	break
	case 2500:
		console.log('Token invalido.')
	break
	case 607:
		console.log('Token generico.')
	break
	default:
		console.log('Algo deu errado. Erro: ' + error)		
	break		
} process.exit() }

async function Login(){
	graph  = await Get ('https://graph.facebook.com/v2.11/me?access_token=' + acess_token + '&fields=id,email')
	game   = await Post('https://api.preguntados.com/api/social-login',{"network":"facebook","id":graph.id,"access_token":acess_token,"email":graph.email,"site":"fbk"})
	if (graph.error) (Error(graph.error.code))
	if (game.code)   (Error(game.code))
	cookie = 'ap_session=' + game.session.session
}

async function Duel(){
	options = {}
	result  = {}
	answers = []
	duel 	= []
	
	options.game_mode = 2
	options.game_type = 1
	options.language  = "PT"

	room = await Post('https://api.preguntados.com/api/users/' + game.id + '/rooms',options)

	console.log('O bot se juntou a um duelo aleatorio')
	
	while (!duel.game){		
		duel = await Get  ('https://api.preguntados.com/api/users/' + game.id + '/rooms/' + room.id)
			   await Sleep(duel.countdown * 100)
		if (duel.code) await Sleep(25000) //Error(duel.code)
		console.log('Aguardando duelo começar...')
	}	
	
	for (question in duel.game.questions){
		question = duel.game.questions[question]
		answers.push({id:question.id,category:question.category,answer:question.correct_answer})
	}
	
	result.answers	   = answers
	result.finish_time = Math.floor(Math.random() * 20000) + 40001
	
	response = await Post('https://api.preguntados.com/api/users/' + game.id + '/games/' + room.id + '/answers',result)

	for (player in response.players){
		player = response.players[player]
		if (player.id == game.id){
			if (player.correct_answers == 12){
				console.log('Gabaritou o duelo em ' + player.finish_time/1000 + ' segundos.')
			}else{
				console.log('Alguma coisa deu errado! Você acertou ' + player.correct_answers + ' questões.')
			}
		}	
	}
}

async function Main(){
 //cookie='3fd29391229f3599a58cf171b4948eb17da441da'
    await Login(acess_token)
	console.log('Bem vindo ' + game.facebook_name)

	while (true){
		await Duel()
	}

}

Main()