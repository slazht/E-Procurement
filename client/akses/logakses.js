import './logakses.html'

import { ActivitiLogs } from '../../libs/activitiLogs.js';
import { Values } from '../../libs/values.js';
import { Privilege } from '../../libs/privilege.js';

Template.logakses.onCreated(function helloOnCreated() {
	Meteor.subscribe('ActivitiLogsNusers',{},{sort:{createdAt:-1},limit:100})
	Meteor.subscribe('allUserRoles',{})
	Session.set('filter',{})
});

Template.logakses.helpers({
  privname(){
  	const user = Meteor.users.findOne({_id:this.userId})
  	if(user){
  		const priv = Privilege.findOne({_id:user.profile.privilege})
  		if(priv){
  			return priv.name
  		}
  	}
  },
  datePiker(){
  	setTimeout(function() {
		$('#datepike').daterangepicker();
  	}, 1000);
  },
  userlist(){
  	return Meteor.users.find()
  },
  aktifiti() {
  	const filter = Session.get('filter')
  	data = ActivitiLogs.find(filter,{sort:{createdAt:-1},limit:100})
    if(data){
    	console.log(data)
    	return data
    }
  },
  cekname(){
  	const nm = Meteor.users.findOne({_id:this.userId})
  	if(nm){
  		return nm.username
  	}
  },
  target(){
  	const tar = Values.findOne({_id:this.dataId})
  	let ret = ''
  	if(tar){
  		if(tar.type=='woad'){
 			ret = tar['Z568J675xXrZDZwtR']
  		}else{
  			ret = tar['ucScBqzoofEuc38RT']
  		}
  		if(ret==''){
  			ret = tar._id
  		}
  	}
  	return ret
  },
  thetanggal(){
  	return moment(this.createdAt).format('llll');   
  }
});

Template.logakses.events({
  'click #filter'() {
  	filter = {}
  	text = $('#text').val()
  	user = $('#user').val()
  	date = $('#datepike').val()
  	if(text!=''){
  		filter['type'] = { '$regex': text, '$options': 'i' }
  	}
  	if(user!=''){
  		filter['userId'] = user
  	}
  	datef= date.split(' - ')[0]
  	datel= date.split(' - ')[1]
  	if(date!=''){
  		filter['createdAt'] = { '$lte': new Date(datel), '$gte': new Date(datef) }
  	}
  	//filter = {userId:user,createdAt:{ '$lte': new Date(datel), '$gte': new Date(datef) },text:text}
  	console.log(filter)
  	Session.set('filter',filter)
  },
})


