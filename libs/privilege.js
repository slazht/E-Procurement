import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { ActivitiLogs } from './activitiLogs.js';

export const Privilege = new Mongo.Collection('privilege');

if (Meteor.isServer) {
  Meteor.methods({
    'Privilege.insert'(data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(data)
        const pri = Privilege.insert(data);
        ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Membuat privilege baru '+data.name,'dataId':pri,'createdAt':new Date()})
        return pri
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
        const dt = Privilege.findOne({_id:id})
        ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Menghapus privilege '+dt.name,'dataId':id,'createdAt':new Date()})
        Privilege.remove({_id:id});
      }
  });

  Meteor.publish('Privilege', function vmss(ops,par) {
    console.log('subscribed Privilege');
    return Privilege.find(ops,par);
  });
  
}