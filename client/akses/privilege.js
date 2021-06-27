import './privilege.html'

import { Koloms } from '../../libs/kolom.js';
import { Privilege } from '../../libs/privilege.js';
import { Akses } from '../../libs/akses.js';

Template.privilege.onCreated(function helloOnCreated() {
	Meteor.subscribe('Koloms',{},{})
	Meteor.subscribe('Privilege',{},{})
	Meteor.subscribe('Akses',{},{})
});

Template.privilege.helpers({
  coloms() {
  	data = Koloms.find({},{sort:{data:1,nomor:1}})
    if(data){
    	return data
    }
  },
  dataName(data) {
  	if(data=='proc'){
  		return 'Procurement'
  	}else{
  		return 'Working Advance'
  	}
  },
  privs(){
  	data = Privilege.find()
  	if(data){
  		return data
  	}
  },
  cekEksis(col,priv){
  	cek = Akses.findOne({colum:col,privilege:priv})
  	if(cek){
  		return 'checked'
  	}else{
  		return ''
  	}
  }
});

Template.privilege.events({
  'click #saveStatus'() {
  	name = $('#name').val()
  	Meteor.call('Privilege.insert',{'name':name},function(e,s){
  		if(e){
  			alert(e)
  		}
  		$('#modalAddLicense').modal('hide')
  	})
  },
  'click .delpriv'(){
  	cek =  confirm('Apakah Anda yakin akan menghapus data ini ?')
  	if(cek){
  		Meteor.call('Privilege.delete',this._id,function(e,s){
	  		if(e){
	  			alert(e)
	  		}
	  	})
  	}
  },
  'click .input-check'(e){
  	$('.input-check:checkbox:checked').each(function(){
  		//console.log( $(this).val() );
  		//var valu = $(this).val()
  		//Meteor.call('Akses.upsert',)
  	});
  	const stat = e.target.checked
  	const vale = e.target.value
  	const col = vale.split('_')[0]
  	const pri = vale.split('_')[1]
  	if(stat){
  		Meteor.call('Akses.upsert',{'colum':col,'privilege':pri},{'colum':col,'privilege':pri},function(e,s){
  			console.log(e)
  		})
  	}else{
  		Meteor.call('Akses.delete',{'colum':col,'privilege':pri},function(e,s){
  			console.log(e)
  		})
  	}
  }
});




