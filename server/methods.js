import { Meteor } from 'meteor/meteor'
import XLSX from 'xlsx';

import { ActivitiLogs } from '../libs/activitiLogs.js';

if (Meteor.isServer) {
	Meteor.methods({
	    'akunCekemail'(email) {
	    	this.unblock();
		      console.log(email)
		      var data = Accounts.findUserByEmail(email);
		      if(!data){
		        data = Accounts.findUserByUsername(email);
		      }
		      if (typeof data != "undefined"){
		        return data._id;
		      }else{
		        return false;
		      }
	    },
	    'sendMailResetPassword'(email) {
		      console.log(email);
		      var data = Accounts.findUserByEmail(email);
		      if (typeof data != "undefined"){
		        Accounts.sendResetPasswordEmail(data._id,email,function(err,result){
		          if (err){
		            console.log(err)
		            return err;
		          }else{
		            console.log(result)
		          }
		        });
		      }else{
		        return 'Email not Found';
		      }
	    },
	    'listUser'(){
	    	this.unblock();
          	if(!Meteor.userId()){ throw new Meteor.Error('not-authorized'); }
    	  	var us = Meteor.users.find({_id:{$ne:Meteor.userId()}},
              	{fields: {"services":0}, sort: {username: 1}}
          	).fetch();

          	var usr = []
          	us.forEach(function(x){
          		if (Roles.userIsInRole(x._id, ['admin','superadmin'])) {
    				x.rule = 'admin'
  				}else{
  					x.rule = 'user'
  				}
  				usr.push(x)
          	})
          	return usr
      	},
      	'getUser'(){
          	if(!Meteor.userId()){ throw new Meteor.Error('not-authorized') }
          	return Meteor.user();
      	},
      	'createNewUser'(data) {
      		this.unblock();
	        console.log(data)
	      	abc = Accounts.createUser(data);
	      	ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Membuat user baru','data':abc,'createdAt':new Date()})
	      	//Meteor.users.update({_id:abc},{'$set':{'emails.0.verified':true,'profile.privilege':data.priv}})
	      	//Roles.addUsersToRoles(abc, data.priv, Roles.GLOBAL_GROUP);
	      	Roles.addUsersToRoles(abc, 'user', null);
	      	//console.log(abc);
	      	return abc
	    },
	    'updateProfile'(id,data){
	    	this.unblock();
	    	Meteor.users.update({_id:id},{'$set':data})
	    },
	    'updateUsers'(data) {
	    	this.unblock();
	      	console.log(data)
	      	if(data.password!=''){
	        	Accounts.setPassword(data.id, data.password)
	      	}
	      	if(data.privilege){
	      		ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Mengubah privilege user','data':data.id,'createdAt':new Date()})
	      		Meteor.users.update({_id:data.id},{'$set':{'profile.privilege':data.privilege}})
	      	}
	      	//if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['superadmin','admin'])) {
	      	//}else{
	      	//Roles.setUserRoles(data.id, [], Roles.GLOBAL_GROUP)
	      	//Roles.addUsersToRoles(data.id, data.priv, Roles.GLOBAL_GROUP);
	      	//}
	    },
	    'removeUser'(data) {
	    	this.unblock();
	    	const dt = Meteor.users.findOne({_id:data})
	    	ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Menghapus user '+dt.username,'data':data,'createdAt':new Date()})
	      	//console.log(data)
	      	Meteor.users.remove(data);
	    },
	    'createWb'(html){
	    	const wb = XLSX.read(html, { type: 'binary' });
	    	return wb
	    },
	    'changeUsername'(username){
	    	ActivitiLogs.insert({'userId':Meteor.userId(),'type':'Merubah username','createdAt':new Date()})
	    	return Accounts.setUsername(Meteor.userId(), username)
	    }
	});

	Meteor.publish('userStatus', function() {
		return Meteor.users.find({ "status.online": true }, { fields: { _id:1,status:1 } });
	});

	Meteor.publish(null, function () {
	  if (Meteor.userId()) {
	    return Meteor.roleAssignment.find({ 'user._id': Meteor.userId() });
	  } else {
	    this.ready()
	  }
	})

	Meteor.publish('allUserRole', function () {
	  if (Meteor.userId()) {
	  	return Meteor.roleAssignment.find({});
	  } else {
	    this.ready()
	  }
	})

	publishComposite('allUserRoles', function(userId) {
    return {
        find() {
            return Meteor.users.find(userId);
        },
        children: [
            {
                find(user) {
                    return Meteor.roleAssignment.find({'user._id':user._id});
                }
            }
        ]
    	}
	});

}
