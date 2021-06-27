import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Values = new Mongo.Collection('values');

if (Meteor.isServer) {
  Meteor.methods({
    'Values.insert'(data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(data)
        return Values.insert(data);
    },
    'Values.update'(id,data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
        return Values.update({_id:id},{$set:data});
    },
    'Values.delete'(id){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        check(id,String);
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
  
}