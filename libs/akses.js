import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Akses = new Mongo.Collection('akses');

if (Meteor.isServer) {
  Meteor.methods({
    'Akses.insert'(data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(data)
        return Akses.insert(data);
    },
    'Akses.update'(id,data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        Akses.update({_id:id},{$set:data});
    },
    'Akses.delete'(id){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        //check(id,String);
        Akses.remove(id);
      },
      'Akses.upsert'(id,data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        //check(id,String);
        Akses.upsert(id,{$set:data});
    },
  });

  Meteor.publish('Akses', function vmss(ops,par) {
    console.log('subscribed Akses');
    return Akses.find(ops,par);
  });
  
}