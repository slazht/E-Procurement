import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Status = new Mongo.Collection('status');

if (Meteor.isServer) {
  Meteor.methods({
    'Status.insert'(data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(data)
        return Status.insert(data);
    },
    'Status.update'(id,data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        Status.update({_id:id},{$set:data});
    },
    'Status.delete'(id){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        Status.remove({_id:id});
      }
  });

  Meteor.publish('Status', function vmss(ops,par) {
    console.log('subscribed Status');
    return Status.find(ops,par);
  });
  
}