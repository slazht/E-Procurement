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
  	data = Pilihan.find({parent:id},{sort:{'createdAt':-1}})
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
  'click #saveclm'(){
    const id = FlowRouter.getParam('id');
    idd = $('#iddd').val()
    name = $('#nameclm').val()
    satu = $('#sGHo24YR7TxCy78oB').val()
    duaa = $('#2e9AQ4ZSM4eyqjFHm').val()
    tiga = $('#fuaFpPfkGCjXfNrHf').val()
    empa = $('#rDp4p9oeLNmmWzqpL').val()
    //console.log(name)
    if(idd==''){
      Meteor.call('Pilihan.insert',{'name':name,'sGHo24YR7TxCy78oB':satu,'2e9AQ4ZSM4eyqjFHm':duaa,'fuaFpPfkGCjXfNrHf':tiga,'rDp4p9oeLNmmWzqpL':empa,'parent':id,'createdAt':new Date()},function(e,s){
        if(e){
          alert(e)
        }
        $('#nameclm').val('')
        $('#idd').val('')
      })
    }else{
      Meteor.call('Pilihan.update',idd,{'name':name,'sGHo24YR7TxCy78oB':satu,'2e9AQ4ZSM4eyqjFHm':duaa,'fuaFpPfkGCjXfNrHf':tiga,'rDp4p9oeLNmmWzqpL':empa},function(e,s){
        if(e){
          alert(e)
        }
        $('#nameclm').val('')
        $('#idd').val('')
      })
    }
    $('#sGHo24YR7TxCy78oB').val('')
    $('#2e9AQ4ZSM4eyqjFHm').val('')
    $('#fuaFpPfkGCjXfNrHf').val('')
    $('#rDp4p9oeLNmmWzqpL').val('')
     $('#modalCLMs').modal('hide')
  },
  'keyup .ecr'(){
    duaa = $('#2e9AQ4ZSM4eyqjFHm').val()
    tiga = $('#fuaFpPfkGCjXfNrHf').val()
    $('#rDp4p9oeLNmmWzqpL').val(parseInt(duaa)/parseInt(tiga))
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
    const id = FlowRouter.getParam('id');
    if(id=='5SBhqfaBX7ASzLeFA'){
      $('#modalCLMs').modal('show')
    }else{
      $('#modalAddLicense').modal('show')
      $('#modal-title-default').html('Tambah Data Baru')
      $('#name').val('')
      $('#idd').val('')
    }
  },
  'click .editCategori'(){
    const id = FlowRouter.getParam('id');
    if(id=='5SBhqfaBX7ASzLeFA'){
      $('#modalCLMs').modal('show')
      $('#iddd').val(this._id)
      $('#nameclm').val(this.name)
      $('#sGHo24YR7TxCy78oB').val(this.sGHo24YR7TxCy78oB)
      $('#2e9AQ4ZSM4eyqjFHm').val(this['2e9AQ4ZSM4eyqjFHm'])
      $('#fuaFpPfkGCjXfNrHf').val(this.fuaFpPfkGCjXfNrHf)
      $('#rDp4p9oeLNmmWzqpL').val(this.rDp4p9oeLNmmWzqpL)
    }else{
      $('#modalAddLicense').modal('show')
      $('#modal-title-default').html('Edit Data')
      $('#name').val(this.name)
      $('#idd').val(this._id)
    }
  }
});


