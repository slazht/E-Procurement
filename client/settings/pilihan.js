import './pilihan.html'

import { Koloms } from '../../libs/kolom.js';
import { Pilihan } from '../../libs/pilihan.js';

Template.pilihan.onCreated(function helloOnCreated() {
  const id = FlowRouter.getParam('id');
	Meteor.subscribe('Koloms',{},{})
  Meteor.subscribe('Pilihan',{},{})
});

Template.pilihan.onRendered(function helloOnCreated() {
  const id = FlowRouter.getParam('id');
  Meteor.subscribe('Koloms',{},{})
  Meteor.subscribe('Pilihan',{},{})
});

Template.pilihan.helpers({
  pilihans() {
    const id = FlowRouter.getParam('id');
  	data = Pilihan.find({parent:id},{})
    if(data){
    	return data
    }
  },
  namakolom(){
    const id = FlowRouter.getParam('id');
    pil = Koloms.findOne({_id:id})
    if(pil){
      return pil.name
    }
  }
});

Template.pilihan.events({
  'click #saveStatus'() {
    const id = FlowRouter.getParam('id');
  	idd = $('#idd').val()
    name = $('#name').val()
  	//console.log(name)
    if(idd==''){
    	Meteor.call('Pilihan.insert',{'name':name,'parent':id},function(e,s){
    		if(e){
    			alert(e)
    		}
    		$('#modalAddLicense').modal('hide')
        $('#name').val('')
        $('#idd').val('')
    	})
    }else{
      Meteor.call('Pilihan.update',idd,{'name':name},function(e,s){
        if(e){
          alert(e)
        }
        $('#modalAddLicense').modal('hide')
        $('#name').val('')
        $('#idd').val('')
      })
    }
  },
  'click .deleteCategori'(){
  	cek =  confirm('Apakah Anda yakin akan menghapus data ini ?')
  	if(cek){
  		Meteor.call('Pilihan.delete',this._id,function(e,s){
	  		if(e){
	  			alert(e)
	  		}
	  	})
  	}
  },
  'click .tmbUser'(){
    $('#modal-title-default').html('Tambah Data Baru')
    $('#name').val('')
    $('#idd').val('')
  },
  'click .editCategori'(){
    $('#modalAddLicense').modal('show')
    $('#modal-title-default').html('Edit Data')
    $('#name').val(this.name)
    $('#idd').val(this._id)
  }
});


