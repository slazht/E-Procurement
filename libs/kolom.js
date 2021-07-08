import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { ActivitiLogs } from './activitiLogs.js';

export const Koloms = new Mongo.Collection('koloms');

if (Meteor.isServer) {
  Meteor.methods({
    'Koloms.insert'(data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(data)
        const kol = Koloms.insert(data);
        ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Membuat kolom baru '+data.name,'dataId':kol,'dataType':data.data,'createdAt':new Date()})
        return kol
    },
    'Koloms.update'(id,data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Merubah kolom '+data.name,'dataId':id,'dataType':data.data,'createdAt':new Date()})
        Koloms.update({_id:id},{$set:data});
    },
    'Koloms.delete'(id){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        const data = Koloms.findOne({_id:id})
        ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Menghapus kolom '+data.name,'dataId':id,'dataType':data.data,'createdAt':new Date()})
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