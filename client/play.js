Template.hand.events({
	'click .card': function(event, template){
		Meteor.call('takeTurn', template.data._id, Meteor.userId(), this);
	}
});