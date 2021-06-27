import './newproc.html'

import { Koloms } from '../../libs/kolom.js';
import { Pilihan } from '../../libs/pilihan.js';
import { Values } from '../../libs/values.js';
import { Akses } from '../../libs/akses.js';

Template.newprocurement.onCreated(function helloOnCreated() {
	Meteor.subscribe('Koloms',{},{})
	Meteor.subscribe('Pilihan',{},{})
	Meteor.subscribe('Akses',{},{})
	const id = FlowRouter.getParam('id');
  	if(id){
  		Meteor.subscribe('Values',{_id:id},{})
  	}
});

Template.newprocurement.helpers({
  theTitle(){
  	const id = FlowRouter.getParam('id');
  	if(id){
  		return 'Edit Procurement'
  	}else{
  		return 'New Procurement'
  	}
  },
  kolomss() {
  	data = Koloms.find({'data':'proc'},{sort:{nomor:1}})
    if(data){
    	return data
    }
  },
  isText(type,tipe) {
  	if(type==tipe){
  		return true
  	}
  	return false
  },
  pilihan(col){
  	pils = Pilihan.find({parent:col})
  	if(pils){
  		return pils
  	}
  },
  theValue(cid){
  	var result = ''
  	const id = FlowRouter.getParam('id');
  	vals = Values.findOne({_id:id})
  	if(vals){
  		result = vals[cid]
  	}
  	const col = Koloms.findOne({'_id':cid})
  	if(col && col.formula!='' && col.formula!==undefined){
  		var formu = col.formula
  		cols = Koloms.find()
  		cols.forEach(function(x){
  			if(formu.includes(x._id)){
  				if(x.type=='date'){
  					const date = new Date(vals[x._id]);
					const diffTime = Math.abs(date)  / (1000 * 60 * 60 * 24)
					formu = formu.replace('{'+x._id+'}',diffTime)
  				}else{
  					formu = formu.replace('{'+x._id+'}',vals[x._id])
  				}
  			}
  		})
  		result = eval(formu)
  	}
  	if(col && col.type=='number' && result==''){
  		result = 0
  	}
  	return result
  },
  isSelected(kol,val){
  	const id = FlowRouter.getParam('id');
  	vals = Values.findOne({_id:id})
  	if(vals){
  		if(vals[kol]==val){
  			return 'selected'
  		}
  	}
  	return ''
  },
  cekAKses(kol){
  	const priv = Meteor.users.findOne({_id:Meteor.userId()})
  	//console.log(priv.profile.privilege)
  	//console.log(kol)
  	if(priv){
  		const akses = Akses.findOne({'privilege':priv.profile.privilege,'colum':kol})
  		//console.log(akses)
  		if(akses){
  			return ''
  		}else{
  			return 'disabled'
  		}
  	}else{
  		return 'disabled'
  	}
  }
});


Template.newprocurement.events({
  'click #saveStatus'() {
  	const idd  = FlowRouter.getParam('id');
  	data = {}
    kols = Koloms.find({'data':'proc'},{sort:{nomor:1}})
    kols.forEach(function(x){
    	isi = $('#'+x._id).val()
    	if(x.type=='number'){
    		isi = parseInt(isi)
    		if(isNaN(isi)){
    			isi = 0
    		}
    	}
    	data[x._id] = isi
    })
    //console.log(data)
    if(idd===undefined){
    	data['createdBy'] = Meteor.userId()
    	data['createdAt'] = new Date()
    	data['type'] = 'proc'
    	Meteor.call('Values.insert',data,function(e,s){
    		if(e){
    			alert(e)
    		}else{
    			FlowRouter.go('/procurement')
    		}
    	})
    }else{
    	data['type'] = 'proc'
    	Meteor.call('Values.update',idd,data,function(e,s){
    		if(e){
    			alert(e)
    		}else{
    			FlowRouter.go('/procurement')
    		}
    	})
    }
  },
  'keyup input'(){
  	$('#saveStatus').html('Not Saved')
  	const idd  = FlowRouter.getParam('id');
  	data = {}
    kols = Koloms.find({'data':'proc'},{sort:{nomor:1}})
    kols.forEach(function(x){
    	isi = $('#'+x._id).val()
    	if(x.type=='number'){
    		isi = parseInt(isi)
    		if(isNaN(isi)){
    			isi = 0
    		}
    	}
    	data[x._id] = isi
    })
    //console.log(data)
    if(idd===undefined){
    	data['createdBy'] = Meteor.userId()
    	data['createdAt'] = new Date()
    	data['type'] = 'proc'
    	Meteor.call('Values.insert',data,function(e,s){
    		if(e){
    			alert(e)
    		}else{
    			$('#saveStatus').html('Saved')
    			FlowRouter.go('/procurement/edit/'+s)
    		}
    	})
    }else{
    	data['type'] = 'proc'
    	Meteor.call('Values.update',idd,data,function(e,s){
    		if(e){
    			alert(e)
    		}else{
    			$('#saveStatus').html('Saved')
    			//FlowRouter.go('/procurement')
    		}
    	})
    }
  }
});


