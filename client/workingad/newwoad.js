import './newwoad.html'

import { Koloms } from '../../libs/kolom.js';
import { Pilihan } from '../../libs/pilihan.js';
import { Values } from '../../libs/values.js';
import { Akses } from '../../libs/akses.js';

Template.newwoad.onCreated(function helloOnCreated() {
	Meteor.subscribe('Koloms',{},{})
	Meteor.subscribe('Pilihan',{},{})
	Meteor.subscribe('Akses',{},{})
	const id = FlowRouter.getParam('id');
  	if(id){
  		Meteor.subscribe('Values',{_id:id},{})
  	}
});

Template.newwoad.helpers({
  theTitle(){
  	const id = FlowRouter.getParam('id');
  	if(id){
  		return 'Edit Working Advance'
  	}else{
  		return 'New Working Advance'
  	}
  },
  kolomss() {
  	data = Koloms.find({'data':'woad'},{sort:{nomor:1}})
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
  				formu = formu.replace('{'+x._id+'}',vals[x._id])
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


Template.newwoad.events({
  'click #saveStatus'() {
  	const idd  = FlowRouter.getParam('id');
  	data = {}
    kols = Koloms.find({'data':'woad'},{sort:{nomor:1}})
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
    	data['type'] = 'woad'
    	Meteor.call('Values.insert',data,function(e,s){
    		if(e){
    			alert(e)
    		}else{
    			FlowRouter.go('/workingadvance')
    		}
    	})
    }else{
    	data['type'] = 'woad'
    	Meteor.call('Values.update',idd,data,function(e,s){
    		if(e){
    			alert(e)
    		}else{
    			FlowRouter.go('/workingadvance')
    		}
    	})
    }
  },
  'keyup input'(){
  	$('#saveStatus').html('Not Saved')
  	const idd  = FlowRouter.getParam('id');
  	data = {}
    kols = Koloms.find({'data':'woad'},{sort:{nomor:1}})
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
    	data['type'] = 'woad'
    	Meteor.call('Values.insert',data,function(e,s){
    		if(e){
    			alert(e)
    		}else{
    			$('#saveStatus').html('Saved')
    			FlowRouter.go('/workingadvance/edit/'+s)
    		}
    	})
    }else{
    	data['type'] = 'woad'
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


