Template.userList.helpers({
	users: function() {
		var myId = Meteor.userId;
		var excluded = [myId];

		//haetaan avoimien pelin vastustajien id:t
		Games.find({inProgress: true}).forEach(function(game){
			excluded.push(game.currentTurn[game.currentTurn[0] === myId ? 1 : 0]);
		});
		return Meteor.users.find({_id: {$not: { $in: excluded}}});
	}
});

Template.userItem.events({
	'click button': function(evt, template){
		Meteor.call('createGame', template.data._id);
	}
});