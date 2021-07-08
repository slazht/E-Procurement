import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { publishComposite } from 'meteor/reywood:publish-composite';

import { Values } from './values.js';

export const ActivitiLogs = new Mongo.Collection('activitiLogs');

if (Meteor.isServer) {
  Meteor.methods({
    'ActivitiLogs.insert'(data){
        if (!Meteor.userId()) {
          throw new Meteor.Error('access-denied', "Access denied")
        }
        console.log(data)
        const priv = Meteor.users.findOne({_id:Meteor.userId()})
        if(priv){
          data['privilege'] = priv.profile.privilege
        }
        return ActivitiLogs.insert(data);
    },
  });

  Meteor.publish('ActivitiLogs', function vmss(ops,par) {
    console.log('subscribed ActivitiLogs');
    return ActivitiLogs.find(ops,par);
  });

  publishComposite('ActivitiLogsNusers', function(ops,par) {
    return {
        find() {
            return ActivitiLogs.find(ops,par);
        },
        children: [
            {
                find(user) {
                    return Meteor.users.find({_id:user.userId});
                }
            },
            {
                find(user) {
                    return Values.find({_id:user.dataId});
                }
            }
        ]
      }
  });
  
}