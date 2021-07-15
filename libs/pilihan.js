import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { ActivitiLogs } from './activitiLogs.js';

export const Pilihan = new Mongo.Collection('pilihan');

if (Meteor.isServer) {
  Meteor.methods({
    'Pilihan.insert'(data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(data)
        const cekDok = Pilihan.find({name:data.name}).count()
        if(cekDok>0){
          return 'exist'
        }
        const pil = Pilihan.insert(data);
        ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Membuat pilihan baru '+data.name,'privilege':getPriv(),'dataId':pil,'dataType':data.parent,'createdAt':new Date()})
        return pil
    },
    'Pilihan.update'(id,data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Merubah pilihan '+data.name,'privilege':getPriv(),'dataId':id,'dataType':data.parent,'createdAt':new Date()})
        Pilihan.update({_id:id},{$set:data});
    },
    'Pilihan.delete'(id){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        const dt = Pilihan.findOne({_id:id})
        ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Menghapus pilihan '+dt.name,'privilege':getPriv(),'dataId':id,'dataType':dt.parent,'createdAt':new Date()})
        Pilihan.remove({_id:id});
      }
  });

  Meteor.publish('Pilihan', function vmss(ops,par) {
    console.log('subscribed Pilihan');
    return Pilihan.find(ops,par);
  });

  function getPriv(){
    //,'privilege':getPriv()
    const priv = Meteor.users.findOne({_id:Meteor.userId()})
    if(priv){
      return priv.profile.privilege
    }
    return ''
  }
  
}