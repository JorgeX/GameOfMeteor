Games = new Meteor.Collection('games');

if(Meteor.isServer){
	Meteor.publish('games', function(){
		//palauta pelit joissa userId on currentTurn arrayssa mukana
		var pelit = Games.find({currentTurn: this.userId});
		return pelit;
	});

	Meteor.publish('users', function(){
		return Meteor.users.find();
	});
}

if(Meteor.isClient){
	Meteor.subscribe('users');
	Meteor.subscribe('games');
}

Meteor.methods({
	createGame: function(opponentId){
		var game = GameFactory.createGame([Meteor.userId(), opponentId]);
		Games.insert(game);
	},

	takeTurn: function(gameId, playerId, card){
		var game = Games.findOne(gameId),
			hand = game.players[playerId].hand;

		if(game.currentTurn[0] !== playerId && !Turns.inHand(hand, card)){
			return;
		}

		var match = Turns.getMatch(card, game.table);

		if(match) { 
			Turns.takeMatch(game, playerId, card, match);
		} else{
			game.table.push(card);
		}

		game.players[playerId].hand = Turns.removeCard(card, hand);
		game.currentTurn.unshift(game.currentTurn.pop());

		if(allHandsEmpty(game.players)){
			if(game.deck.length > 0){
				GameFactory.dealPlayers(game.players, game.deck);
			} else {
				// finished!
			}
		}
		Games.update(gameId, game);
	}

});

function allHandsEmpty(players){
	return _.every(players, function(player){
		return player.hand.length === 0;
	});
}