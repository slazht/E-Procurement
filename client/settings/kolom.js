import './kolom.html'

import { Koloms } from '../../libs/kolom.js';

Template.kolom.onCreated(function helloOnCreated() {
	Meteor.subscribe('Koloms',{},{})
  Session.set('select','proc')
  Session.set('last',0)
  Session.set('formula','')
});

Template.kolom.helpers({
  statuss() {
  	data = Koloms.find({},{sort:{nomor:1}})
    if(data){
    	return data
    }
  },
  lastNumber() {
    last = 1
    const sel = Session.get('select')
    const kol = Koloms.findOne({data:sel},{sort:{nomor:-1}})
    if(kol){
      last = kol.nomor+1
    }
    Session.set('last',last)
    return last
  }
});

Template.kolom.events({
  'click #saveStatus'() {
  	const idd  = $('#idd').val()
    name = $('#name').val()
    nomo = $('#nomor').val()
    type = $('#type').val()
    data = $('#data').val()
    form = $('#xformula').val()
  	//console.log(name)
    if(idd==''){
    	Meteor.call('Koloms.insert',{'name':name,'nomor':parseInt(nomo),'formula':form,'type':type,'data':data},function(e,s){
    		if(e){
    			alert(e)
    		}
    		$('#modalAddLicense').modal('hide')
    	})
    }else{
      console.log(idd)
      Meteor.call('Koloms.update',idd,{'name':name,'nomor':parseInt(nomo),'formula':form,'type':type,'data':data},function(e,s){
        if(e){
          alert(e)
        }else{
          console.log(s)
        }
        $('#modalAddLicense').modal('hide')
      })
    }
  },
  'click .deleteCategori'(){
  	cek =  confirm('Apakah Anda yakin akan menghapus data ini ?')
  	if(cek){
  		Meteor.call('Koloms.delete',this._id,function(e,s){
	  		if(e){
	  			alert(e)
	  		}
	  	})
  	}
  },
  'click .tmbUser'(){
    $('#modal-title-default').html('Add Column')
    $('#name').val('')
    $('#nomor').val(Session.get('last'))
    $('#type').val('')
    $('#data').val('proc')
    $('#idd').val('')
  },
  'click .editCategori'(){
    $('#modalAddLicense').modal('show')
    $('#modal-title-default').html('Edit Column')
    $('#idd').val(this._id)
    $('#name').val(this.name)
    $('#nomor').val(this.nomor)
    $('#type').val(this.type)
    $('#data').val(this.data)
  },
  'click #data'(e){
    Session.set('select',e.target.value)
  },
  'click .buformula'(e){
    var foi = $('#xformula').val()
    const colfor = (e.target.id).split('_')[1]
    $('#xformula').val(foi+"{"+colfor+"}")
  }
});



