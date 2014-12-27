Games = new Meteor.Collection('games');

if(Meteor.isServer){
	Meteor.publish('games', function(){
		//palauta pelit joissa userId on currentTurn arrayssa mukana
		return Games.find({currentTurn: this.userId});
	});

	Meteor.publish('users', function(){
		return Meteor.users.find();
	});
}

if(Meteor.isClient){
	Meteor.subscribe('users');
	Meteor.subscribe('games');
}