import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Koloms = new Mongo.Collection('koloms');

if (Meteor.isServer) {
  Meteor.methods({
    'Koloms.insert'(data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(data)
        return Koloms.insert(data);
    },
    'Koloms.update'(id,data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(id)
        console.log(data)
        check(id,String);
        Koloms.update({_id:id},{$set:data});
    },
    'Koloms.delete'(id){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        Koloms.remove({_id:id});
      },
      'updateSemua'(){
        var kols = Koloms.find();
        kols.forEach(function(x) {
          Koloms.update({_id:x._id},{'$set':{'nomor':parseInt(x.nomor)}});
        })
      }
  });

  Meteor.publish('Koloms', function vmss(ops,par) {
    console.log('subscribed Koloms');
    return Koloms.find(ops,par);
  });
  
}