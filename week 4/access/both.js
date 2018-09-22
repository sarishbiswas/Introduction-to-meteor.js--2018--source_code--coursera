import {Mongo } from 'meteor/mongo';

Images = new Mongo.Collection("images");

Images.allow({
	insert:function(userId, doc){
		 console.log("testing security");
		if (Meteor.user()){
			console.log(doc);
			doc.createdBy = userId;
			if (userId != doc.createdBy){
				return false;
			}
			else{
				return true;
			}
		}
		else{
			return false;
		}
	},
	remove:function(userId, doc){
		return true;
	}
})