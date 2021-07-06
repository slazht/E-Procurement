import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

import './profile.html'

import Files from '../../libs/files.js';
import { Privilege } from '../../libs/privilege.js';

Template.profile.onCreated(function bodyOnCreated() {
	this.currentUpload = new ReactiveVar(false);
	Meteor.subscribe('Privilege',{},{})
	Session.get('files',[])
	Session.set('fileUpload',{});
});

Template.profile.helpers({
	userDetails(){
		user = Meteor.users.findOne()
		if(user){
			Session.set('fileUpload',user.profile.photo);
			return user
		}
	},
	theemail(mail){
		if(mail){
			return mail[0].address
		}
	},
	photo(){
		const file = Session.get('fileUpload')
		if(file){
			const fil = Files.findOne({_id:file._id})
			return fil
		}
	},
	userRole(){
		const user = Meteor.user({fields: {'username': 1,'emails':1,'profile':1}});
		if(user){
			rol = user.profile.privilege
			const priv = Privilege.findOne({_id:rol})
			if(priv){
				return priv.name
			}
		}
	},
});

Template.profile.events({
	'click #addNewDivisi'(){
		$('#modal-edit-user').modal('hide')
		$('#modal-new-divisi').modal('show')
	},
	'click #simpan'(){
		const name = $('#namalengkap').val()
		const username = $('#username').val()
		const file = Session.get('fileUpload')
		Meteor.call('updateProfile',Meteor.userId(),{'profile.name':name,'profile.photo':file},function(e,s){
			alert('Data saved')
		})
		Meteor.call('changeUsername',username,function(e,s){
			if(e){
				alert(e)
			}
		})
	},
	'change #fileInput'(e, template) {
    e.preventDefault()

    Session.set('fileUpload','');

    if (e.currentTarget.files && e.currentTarget.files[0] ) {
    	console.log(e.currentTarget.files[0])
      
      const upload = Files.insert({
        file: e.currentTarget.files[0],
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          console.log(fileObj)
          console.log(fileObj._id)

          Session.set('fileUpload',fileObj);

        }
        template.currentUpload.set(false);
      });

      upload.start();

    }
  },
});