Template.userList.helpers({
	users: function() {
		var myId = Meteor.userId();
		var excluded = [myId];

		//haetaan avoimien pelin vastustajien id:t
		Games.find({inProgress: true}).forEach(function(game){
			excluded.push(otherId(game));
		});
		return Meteor.users.find({_id: {$not: { $in: excluded}}});
	}
});

Template.userItem.events({
	'click button': function(evt, template){
		Meteor.call('createGame', template.data._id);
	}
});

Template.gameList.helpers({
	games: function(){
		return Games.find({inProgress: true}).map(function(game){
			game.otherPlayer = Meteor.users.findOne(otherId(game)).username;
			game.started = moment(game.started).fromNow();
			console.log('Game: ' + game);
			return game;
		});
	}
});

function otherIf(game){
 return game.currentTurn[game.currentTurn[0] === Meteor.userId() ? 1 : 0];
}

