import './users.html'

import { Privilege } from '../../libs/privilege.js';

Template.listUsers.onCreated(function helloOnCreated() {
	Meteor.subscribe('Privilege',{},{})
  Meteor.subscribe('allUserRoles',{},{})
});

Template.listUsers.helpers({
  userss() {
  	data = Meteor.users.find({},{sort:{createdAt:-1}})
    if(data){
    	return data
    }
  },
  prives() {
    data = Privilege.find({},{sort:{createdAt:-1}})
    if(data){
      return data
    }
  },
  privName() {
    //console.log(this.profile.privilege)
    if(this.profile){
      var pri = Privilege.findOne({_id:this.profile.privilege})
      if(pri){
        return pri.name
      }
    }
  },
  ifNoAdmin(){
    if(this.username!='admin'){
      return true
    }
    return false
  }
});

Template.listUsers.events({
  'click #saveStatus'() {
  	idd = $('#idd').val()
    name = $('#name').val()
    email = $('#email').val()
    password = $('#password').val()
    priv = $('#priv').val()
  	//console.log(name)
    if(idd==''){
    	Meteor.call('createNewUser',{'username':name,'email':email,'password':password,'profile':{'privilege':priv}},function(e,s){
    		if(e){
    			alert(e)
    		}
    		$('#modalAddLicense').modal('hide')
    	})
    }else{
      Meteor.call('updateUsers',{'id':idd,'password':password,'privilege':priv},function(e,s){
        if(e){
          alert(e)
        }
        $('#modalAddLicense').modal('hide')
      })
    }
    $('#idd').val('')
    $('#name').val('')
    $('#email').val('')
    $('#password').val('')
    $('#priv').val('')
  },
  'click .deleteCategori'(){
  	cek =  confirm('Apakah Anda yakin akan menghapus data ini ?')
  	if(cek){
  		Meteor.call('removeUser',this._id,function(e,s){
	  		if(e){
	  			alert(e)
	  		}
	  	})
  	}
  },
  'click .tmbUser'(){
    $('#name').val('')
    $('#name').prop('disabled',false)
    $('#email').val('')
    $('#email').prop('disabled',false)
  },
  'click .editCategori'(){
    $('#modalAddLicense').modal('show')
    $('#idd').val(this._id)
    $('#name').val(this.username)
    $('#name').prop('disabled',true)
    $('#email').val(this.emails[0].address)
    $('#email').prop('disabled',true)
    $('#priv').val(this.profile.privilege)
  }
});



