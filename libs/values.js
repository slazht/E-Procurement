import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { ActivitiLogs } from './activitiLogs.js';

export const Values = new Mongo.Collection('values');

if (Meteor.isServer) {
  Meteor.methods({
    'Values.insert'(data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(data)
        const nedata = Values.insert(data);
        if(data.type=='woad'){
          ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Membuat data baru','privilege':getPriv(),'dataId':nedata,'data':data['Z568J675xXrZDZwtR'],'dataType':data.type,'createdAt':new Date()})
        }else{
          ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Membuat data baru','privilege':getPriv(),'dataId':nedata,'data':data['ucScBqzoofEuc38RT'],'dataType':data.type,'createdAt':new Date()})
        }
        return nedata
    },
    'Values.update'(id,data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        if(data.type=='woad'){
          ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Mengisi data','privilege':getPriv(),'dataId':id,'data':data['Z568J675xXrZDZwtR'],'dataType':data.type,'createdAt':new Date()})
        }else{
          ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Mengisi data','privilege':getPriv(),'dataId':id,'data':data['ucScBqzoofEuc38RT'],'dataType':data.type,'createdAt':new Date()})
        }
        return Values.update({_id:id},{$set:data});
    },
    'Values.delete'(id){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        const da = Values.findOne({_id:id})
        if(da.type=='proc'){
          ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Menghapus data','privilege':getPriv(),'dataId':da,'data':dat['ucScBqzoofEuc38RT'],'dataType':da.type,'createdAt':new Date()})
        }else{
          ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Menghapus data','privilege':getPriv(),'dataId':da,'data':dat['Z568J675xXrZDZwtR'],'dataType':da.type,'createdAt':new Date()})
        }
        Values.remove({_id:id});
      },
    'totalData'(){
      const lrf = Promise.await(Values.aggregate([
                  { "$match" : { type : 'proc' } },
                  { "$group" : { _id: null, count: { '$sum':'$q4G8NZQp8d2tCQDKt' } } }
              ]).toArray());
      const status = Promise.await(Values.aggregate([
                  { "$match" : { type : 'proc' } },
                  { "$group" : { _id: '$mKbKXsbSoQNSWW2SX', count: { '$sum':1 } } }
              ]).toArray());
      const depart = Promise.await(Values.aggregate([
                  { "$match" : { type : 'proc' } },
                  { "$group" : { _id: '$YsEJ6Ck7cLQnyWRLL', count: { '$sum':1 } } }
              ]).toArray());
      const proc = Values.find({'type':'proc'}).count()
      const cproc = Values.find({'type':'proc','mKbKXsbSoQNSWW2SX':'LiaMXsEKdv2xf98yA'}).count()
      //console.log(status)
      //console.log(depart)
      return {'proc':proc, 'lrf':lrf[0].count,'completed':cproc,'status':status,'department':depart}
    }
  });

  Meteor.publish('Values', function vmss(ops,par) {
    console.log('subscribed Values');
    return Values.find(ops,par);
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