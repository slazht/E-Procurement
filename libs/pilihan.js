import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Pilihan = new Mongo.Collection('pilihan');

if (Meteor.isServer) {
  Meteor.methods({
    'Pilihan.insert'(data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(data)
        return Pilihan.insert(data);
    },
    'Pilihan.update'(id,data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        Pilihan.update({_id:id},{$set:data});
    },
    'Pilihan.delete'(id){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        Pilihan.remove({_id:id});
      }
  });

  Meteor.publish('Pilihan', function vmss(ops,par) {
    console.log('subscribed Pilihan');
    return Pilihan.find(ops,par);
  });
  
}