Turns = {};

Turns.takeMatch = function(game, playerId, card, match){
	match.forEach(function(matchCard){
		game.players[playerId].pile.push(matchCard);
		game.table = Turns.removeCard(matchCard, game.table);
	});

	game.players[playerId].pile.push(card);
	game.lastScorer = playerId;

	if(game.table.length === 0){
		game.players[playerId].score.scopa++;
	}
};

Turns.removeCard = function(card, table){
	return table.filter(function(tableCard){
		return !matchCard(card, tableCard);
	});
}

Turns.inHand = function(set, card){
	for(var i=0; i<set.length; i++){
		if(matchCard(set[i], card)){
			return true;
		}
	}
	return false;
};

function matchCard(card1, card2){
	return card1.suit === card2.suit &&
		card1.value === card2.value;
};

Turns.getMatch = function(card, set){
	var matches = Turns.findMatches(card, set);
	if(matches.length > 0){
		return Turns.bestMatch(matches);
	}
	return null;
};

Turns.findMatches = function(card, set){
	var matches = [];
	set.forEach(function(tableCard){
		if(tableCard.value === card.value) matches.push([tableCard]);
	});

	if(matches.length > 0 ) return matches;

	for(var i=2; i<= set.length; i++){
		combinations(set, i, function(potentialMatch){
			if(sumCards(potentialMatch) === card.value){
				matches.push(potentialMatch.slice());
			}
		});	
	}
	return matches;
};

Turns.bestMatch = function(matches){
	var mostCoins = [0, null], 
		mostCards = [0, null];

	for(var i = 0; i < matches.length; i++){
		var match = matches[i];
		if(isSetteBello(match)) return match;

		var coinCount = match.filter(function(card){
			return card.suit === 'Coins';
		}).length;

		if(coinCount > mostCoins[0]){
			mostCoins = [match.length, match];
		}
		if(match.length > mostCards[0]){
			mostCards = [match.length, match];
		}
	}
	return (mostCards[0] > mostCoins[0]) ? mostCards[1]: mostCoins[1]; 
};

function isSetteBello(match){
	for(var i=0; i<match.length;i++){
		if(match[i].suit === 'Coins' && match[i].value === 7) return true;
	}
	return false;
};


function sumCards(set){
	return set.reduce(function(a,b){
		return a+b.value;
	}, 0);
};

function combinations(numArr, choose, callback){
	var n = numArr.length;
	var c = [];
	var inner = function(start, _choose){
		if(_choose == 0){
			callback(c);
		} else {
			for(var i=start; i<=n-_choose; ++i){
				c.push(numArr[i]);
				inner(i+1, _choose -1);
				c.pop();
			}
		}
	};
	inner(0, choose);
}

