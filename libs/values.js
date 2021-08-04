import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { ActivitiLogs } from './activitiLogs.js';
import { Akses } from './akses.js';

export const Values = new Mongo.Collection('values');

if (Meteor.isServer) {
  Meteor.methods({
    'Values.insert'(data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(data)
        if(data.type=='proc' & data['ucScBqzoofEuc38RT']!=''){
          const cek = Values.find({'ucScBqzoofEuc38RT':data['ucScBqzoofEuc38RT']})
          if(cek.count()>0){
            return 'Duplicate File Reference Number'
          }
        }
        const nedata = Values.insert(data);
        if(data.type=='woad'){
          ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Membuat data baru','privilege':getPriv(),'dataId':nedata,'data':data['T23oJu5bHb8XqfMc7'],'dataType':data.type,'raw':data,'createdAt':new Date()})
        }else{
          ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Membuat data baru','privilege':getPriv(),'dataId':nedata,'data':data['ucScBqzoofEuc38RT'],'dataType':data.type,'raw':data,'createdAt':new Date()})
        }
        return nedata
    },
    'Values.update'(id,data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        if(data.type=='woad'){
          ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Mengisi data','privilege':getPriv(),'dataId':id,'data':data['T23oJu5bHb8XqfMc7'],'dataType':data.type,'raw':data,'createdAt':new Date()})
        }else{
          ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Mengisi data','privilege':getPriv(),'dataId':id,'data':data['ucScBqzoofEuc38RT'],'dataType':data.type,'raw':data,'createdAt':new Date()})
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
          ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Menghapus data','privilege':getPriv(),'dataId':da,'data':da['ucScBqzoofEuc38RT'],'dataType':da.type,'raw':da,'createdAt':new Date()})
        }else{
          ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Menghapus data','privilege':getPriv(),'dataId':da,'data':da['T23oJu5bHb8XqfMc7'],'dataType':da.type,'raw':da,'createdAt':new Date()})
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
      //const depart = Promise.await(Values.aggregate([
      //            { "$match" : { type : 'proc' } },
      //            { "$group" : { _id: '$YsEJ6Ck7cLQnyWRLL', count: { '$sum':1 } } }
      //        ]).toArray());
      const proc = Values.find({'type':'proc'}).count()
      const cproc = Values.find({'type':'proc','mKbKXsbSoQNSWW2SX':'LiaMXsEKdv2xf98yA'}).count()
      //console.log(status)
      //console.log(depart)
      return {'proc':proc, 'lrf':lrf[0].count,'completed':cproc,'status':status}
    },
    'totalDataWoad'(){
      const ar  = Promise.await(Values.aggregate([
                  { "$match" : { type : 'woad' } },
                  { "$group" : { _id: null, count: { '$sum':'$cSCKJANGQD7prAzWg' } } }
              ]).toArray());
      const status = Promise.await(Values.aggregate([
                  { "$match" : { type : 'woad' } },
                  { "$group" : { _id: '$qqh2dKnq2ZhFQBtAh', count: { '$sum':1 } } }
              ]).toArray());
      //const depart = Promise.await(Values.aggregate([
      //            { "$match" : { type : 'proc' } },
      //            { "$group" : { _id: '$YsEJ6Ck7cLQnyWRLL', count: { '$sum':1 } } }
      //        ]).toArray());
      const woad = Values.find({'type':'woad'}).count()
      const cproc = Values.find({'type':'woad','qqh2dKnq2ZhFQBtAh':'3Y9ZG2AbXnSm6jNSe'}).count()
      //console.log(status)
      //console.log(depart)
      return {'woad':woad, 'ar':ar[0].count,'completed':cproc,'status':status}
    },
    'getTask'(){
      this.unblock()
      const user = Meteor.users.findOne({_id:Meteor.userId()})
      const akes = Akses.find({privilege:user.profile.privilege})
      var col = []
      akes.forEach(function(x){
        var cl = {}
        cl[x.colum] = ''
        col.push(cl);
      })
      //console.log(col)
      const vals = Values.find({'type':'proc','mKbKXsbSoQNSWW2SX':{'$ne':'LiaMXsEKdv2xf98yA'},'$or':col},{fields:{_id:1,ucScBqzoofEuc38RT:1},limit:6,sort:{createdAt:-1}})
      var data = []
      vals.forEach(function(s){
        data.push({id:s._id,ref:s.ucScBqzoofEuc38RT})
      })
      return data
    },
    'getTaskw'(){
      this.unblock()
      const user = Meteor.users.findOne({_id:Meteor.userId()})
      const akes = Akses.find({privilege:user.profile.privilege})
      var col = []
      akes.forEach(function(x){
        var cl = {}
        cl[x.colum] = ''
        col.push(cl);
      })
      //console.log(col)
      const vals = Values.find({'type':'woad','qqh2dKnq2ZhFQBtAh':{'$ne':'3Y9ZG2AbXnSm6jNSe'},'$or':col},{fields:{_id:1,T23oJu5bHb8XqfMc7:1},limit:6,sort:{createdAt:-1}})
      var data = []
      vals.forEach(function(s){
        data.push({id:s._id,ref:s.T23oJu5bHb8XqfMc7})
      })
      return data
    },
    'valuesCount'(par,ops){
      return Values.find(par,ops).count();
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