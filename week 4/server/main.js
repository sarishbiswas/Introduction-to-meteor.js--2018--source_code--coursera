import { Meteor } from 'meteor/meteor';
import '/access/both.js';
Meteor.startup(function(){
  console.log("I am the server");
  if (Images.find().count() == 0) {
  	for (var i = 1;i<=15;i++){
  		Images.insert(
  		{
			img_src : i+".jpg",
			img_alt : "this is a nature image no: "+i
		}
  	);
  	console.log(Images.find().count());
  	}
  	
  }
});
