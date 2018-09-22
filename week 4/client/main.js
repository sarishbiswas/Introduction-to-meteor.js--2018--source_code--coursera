import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './main.html';
import '/access/both.js';
console.log("I am the Client");

//routing
Router.configure({
	layoutTemplate: "ApplicationLayout"
});

Router.route('/', function () {
  this.render('welcome', {
  	to:"main"
  });
});

Router.route('/images', function () {
  this.render('navbar', {
  	to:"navbar"
  });
  this.render('images', {
  	to:"main"
  });
});

Router.route('/image/:_id', function () {
  this.render('navbar', {
  	to:"navbar"
  });
  this.render('image', {
  	to:"main",
  	data:function(){
  		return Images.findOne({_id:this.params._id});
  	}
  });
});
//infinite scroll
Session.set("imageLimit",8);
lastScrollTop = 0;
$(window).scroll(function(event){

	if ($(window).scrollTop()+$(window).height() >= $(document).height()){
		//where are we in the page
		var scrollTop = $(this).scrollTop();
		//if we are going down
		if (scrollTop > lastScrollTop){
			// console.log("saysar");
			//we are heading down
			Session.set("imageLimit",Session.get("imageLimit")+4);
		}
		lastScrollTop = scrollTop;
	}
	// console.log("sayani");
});

//changing the configuaration of accounts passwords
Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});

Template.images.helpers({

	//getting the images by user filter
	images:function(){
		if (Session.get("userFilter")){
			return Images.find({createdBy:Session.get("userFilter")});
		}
		else{
			return Images.find({},{sort:{created_on:-1,rating:-1}, limit:Session.get("imageLimit")});
		}
	},

	//getting the username to each images
	getUser:function(user_id){
		var user = Meteor.users.findOne({_id:user_id});
		if (user){
			return user.username;
		}
		else{
			return "Sarish Biswas";
		}
	},

	//use the image filter
	filtering_images:function(){
		if (Session.get("userFilter")){
			return true;
		}
		else{
			return false;
		}
	},

	//to get the filtered user
	getFilterUser:function(){
		if (Session.get("userFilter")){
			var user = Meteor.users.findOne({_id:Session.get("userFilter")});
			return user.username;
		}
		else{
			return false;
		}
	},
});

//to welcome logged in user in our webpage body
Template.body.helpers({
	username:function(){
		if (Meteor.user()){
			return Meteor.user().username;
			// return Meteor.user().emails[0].address;
		}
		else{
			return "Annonymous User........please sign in to add an image";
		}
		
	}
});

Template.images.events({

	//add a width functionality
	'click .js-image':function(event){
		$(event.target).css("width","50px");
	},

	//add a delete image functionality
	'click .js-del-image':function(event){
		var image_id = this._id;
		$("#"+image_id).hide('slow',function(){
			Images.remove({"_id":image_id});
		});
	},

	//add the rating to the images
	'click .js-rate-image': function(event){
		var rating = $(event.currentTarget).data("userrating");
		console.log(rating);
		var image_id = this.id;
		console.log(image_id);

		Images.update({_id:image_id},{$set:{rating:rating}});
	},

	//Show the image modal form
	'click .js-show-image-form':function(event){
		$('#image_add_form').modal('show');
	},

	//Setting up the user filter
	'click .js-set-image-filter':function(event){
		Session.set("userFilter",this.createdBy);
	},

	//unset the user filter
	'click .js-unset-image-filter':function(event){
		Session.set("userFilter",undefined);
	}
});

//function to add the image data to data to mongodb
Template.image_add_form.events({
	'submit .js-add-image':function(event){
		var img_src = event.target.img_src.value;
		var img_alt = event.target.img_alt.value;
		console.log("src: "+img_src+" alt: "+img_alt);
		//checks the user is logged in or not
		if (Meteor.user()){
			//add the below dada to database
			Images.insert({
				img_src: img_src,
				img_alt: img_alt,
				created_on: new Date(),
				createdBy: Meteor.user()._id
			});
		}
		
		return false;
	}
})