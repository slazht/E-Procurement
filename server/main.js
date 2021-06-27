import { Meteor } from 'meteor/meteor';

import './methods.js';
import '../libs/router.js';
import '../libs/kolom.js'
import '../libs/pilihan.js'
import '../libs/privilege.js'
import '../libs/akses.js'
import '../libs/values.js'

import { Privilege } from '../libs/privilege.js';

Meteor.startup(() => {
  Roles.createRole('superadmin', {unlessExists: true});
  Roles.createRole('admin', {unlessExists: true});
  Roles.createRole('user', {unlessExists: true});
  var prid = Privilege.find({'name':'Admin'})
  if(prid.count()==0){
      Privilege.insert({'_id':'Admin','name':'Admin'})
  }
  var usr = Meteor.users.find({username:'admin'},{});
  console.log(usr.count())
  if(usr.count()==0){
    const us = { username:'admin', email: 'admin@acyntia.id', password: '2wsx1qaz', priv:'admin' }
    var abc = Accounts.createUser(us);
    if(abc){
      console.log('create admin')
      Roles.addUsersToRoles(abc, us.priv, null);
    }
    Meteor.users.update({_id:abc},{'$set':{'emails.0.verified':true,'profile.privilege':'Admin'}})
  }

});
