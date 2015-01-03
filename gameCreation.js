GameFactory = {};

GameFactory.createGame = function(playerIds){
	var deck = createDeck();
	var players = createPlayers(playerIds);

	dealPlayers(players, deck);

	var table = dealTable(deck);

	return {
		deck: deck, 
		players: players, 
		table: table,
		currentTurn: playerIds,
		inProgress: true,
		started: new Date()
	};
};

function dealPlayers(players, deck){
	for(i=0; i<3; i++){
		Object.keys(players).forEach(function(id){
			players[id].hand.push(deck.shift());
		});
	}
};

function dealTable(deck){
	var c = deck.shift.bind(deck);
	return [c(), c(), c(), c()];
}

function createPlayers(playerIds){
	var players = {};
	playerIds.forEach(function(id){
		players[id] = {
			hand: [],
			pile: [], 
			score: {
				mostCoins: 0,
				mostCards: 0, 
				setteBello: 0, 
				primera: 0, 
				scopa: 0 
			}		
		};
	});

	return players;
};

function createDeck(){
	var suits = ['Cups', 'Coins', 'Swords', 'Clubs'],
		cards = [];

	suits.forEach(function(suit){
		for(var i=1; i<=10;i++){
			var name = i;
			if(i === 1) name = 'A';
			if(i === 8) name = 'J';
			if(i === 9) name = 'Q';
			if(i === 10) name = 'K';
			cards.push({
				suit: suit,
				value: i, 
				name: name
			}); 
		}
	});

	return _.shuffle(cards);
};