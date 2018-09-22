import {Mongo } from 'meteor/mongo';

Images = new Mongo.Collection("images");
console.log(Images.find().count());