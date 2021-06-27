import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Privilege = new Mongo.Collection('privilege');

if (Meteor.isServer) {
  Meteor.methods({
    'Privilege.insert'(data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(data)
        return Privilege.insert(data);
    },
    'Privilege.update'(id,data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        Privilege.update({_id:id},{$set:data});
    },
    'Privilege.delete'(id){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        Privilege.remove({_id:id});
      }
  });

  Meteor.publish('Privilege', function vmss(ops,par) {
    console.log('subscribed Privilege');
    return Privilege.find(ops,par);
  });
  
}