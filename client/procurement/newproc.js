import './newproc.html'

import { Koloms } from '../../libs/kolom.js';
import { Pilihan } from '../../libs/pilihan.js';
import { Values } from '../../libs/values.js';
import { Akses } from '../../libs/akses.js';

Template.newprocurement.onCreated(function helloOnCreated() {
	Meteor.subscribe('Koloms',{},{})
	Meteor.subscribe('Pilihan',{},{})
	Meteor.subscribe('Akses',{},{})
	Session.set('kolomarray',[])
	Session.set('countItems',1)
	Session.set('activeitems',1)
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
  kolomsarray() {
  	var koloms = []
  	var items = 1
  	data = Koloms.find({'data':'proc'},{sort:{nomor:1}})
    if(data){
    	data.forEach(function(x){
    		if(x.format=='array'){
    			koloms.push(x)
    		}
    	})
    }
    Session.set('kolomarray',koloms)
    return koloms
  },
  countItems(){
  	console.log('setItems')
  	//var result = Session.get('countItems')
  	const id = FlowRouter.getParam('id');
  	if(id){
	  	const ar = Koloms.findOne({'data':'proc','format':'array'});
	  	vals = Values.findOne({_id:id})
	  	if(vals){
	  		arr = vals[ar._id].length;
	  		Session.set('countItems',arr)
	  		Session.set('activeitems',arr)
	  	}
  	}
  },
  items(){
  	console.log('retrive items')
  	var result = Session.get('countItems')
  	/*
  	const id = FlowRouter.getParam('id');
  	const ar = Koloms.findOne({'data':'proc','format':'array'});
  	vals = Values.findOne({_id:id})
  	if(vals){
  		arr = vals[ar._id].length;
  		if(result<arr){
  			Session.set('countItems',arr)
  			result = arr
  		}
  	}*/
  	res = []
  	for (var i = 1; i <= result; i++) {
  		res.push(i)
  	}
  	console.log(res)
  	return res
  },
  kolomss() {
  	var koloms = []
  	data = Koloms.find({'data':'proc'},{sort:{nomor:1}})
    if(data){
    	data.forEach(function(x){
    		if(x.format!='array'){
    			koloms.push(x)
    		}
    	})
    }
    return koloms
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
  atheValue(cid,index){
  	var result = ''
  	const id = FlowRouter.getParam('id');
  	if(id){
	  	vals = Values.findOne({_id:id})
	  	if(vals){
	  		result = vals[cid][parseInt(index)-1]
	  	}
	  	const col = Koloms.findOne({'_id':cid})
	  	if(col && col.formula!='' && col.formula!==undefined){
	  		var formu = col.formula
	  		cols = Koloms.find()
	  		cols.forEach(function(x){
	  			if(formu.includes(x._id)){
	  				if(x.format=='array'){
	  					//console.log(vals[x._id][parseInt(index)-1])
		  				if(x.type=='date'){
		  					const date = new Date(vals[x._id][parseInt(index)-1]);
							const diffTime = Math.abs(date)  / (1000 * 60 * 60 * 24)
							formu = formu.replace('{'+x._id+'}',diffTime)
		  				}else{
		  					formu = formu.replace('{'+x._id+'}',vals[x._id][parseInt(index)-1])
		  				}
	  				}else{
	  					//console.log(vals[x._id])
	  					if(x.type=='date'){
		  					const date = new Date(vals[x._id]);
							const diffTime = Math.abs(date)  / (1000 * 60 * 60 * 24)
							formu = formu.replace('{'+x._id+'}',diffTime)
		  				}else{
		  					formu = formu.replace('{'+x._id+'}',vals[x._id])
		  				}
	  				}
	  			}
	  		})
	  		result = eval(formu)
	  	}
	  	if(col && col.type=='number' && result==''){
	  		result = 0
	  	}
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
  aisSelected(kol,val,item){
  	const id = FlowRouter.getParam('id');
  	vals = Values.findOne({_id:id})
  	if(vals){
  		if(vals[kol][parseInt(item)-1]==val){
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
  'click #addItem'(){
  	var items = Session.get('countItems')
  	Session.set('countItems',items+1)
  	var res = Session.get('activeitems')
  	//res.push(items+1)
  	Session.set('activeitems',res+1)
  },
  'click #saveStatus'() {
  	const idd  = FlowRouter.getParam('id');
  	data = {}
    kols = Koloms.find({'data':'proc'},{sort:{nomor:1}})
    kols.forEach(function(x){
    	if(x.format!='array'){
	    	isi = $('#'+x._id).val()
	    	if(x.type=='number'){
	    		isi = parseInt(isi)
	    		if(isNaN(isi)){
	    			isi = 0
	    		}
	    	}
	    	data[x._id] = isi
    	}else{
    		const items = Session.get('activeitems')
    		//for (var i = 1; i <= items; i++) {
		  	//items.forEach(function(it,ind){
		  	$('.items_area').each(function(){
		  		var a = this.id
    			ind = a.split('_')[1]
		  		isi = $('#'+ind+'_'+x._id).val()
		    	if(x.type=='number'){
		    		isi = parseInt(isi)
		    		if(isNaN(isi)){
		    			isi = 0
		    		}
		    	}
		    	if(Array.isArray(data[x._id])){
		    		data[x._id].push(isi)
		    	}else{
		    		data[x._id] = [isi]
		    	}
		  	})
    	}
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
  'keyup input'(e){
  	$('#saveStatus').html('Not Saved')
  	const idd  = FlowRouter.getParam('id');
  	data = {}
  	const colid = (e.target.id).split('_')[1]
    kols = Koloms.find({'data':'proc'},{sort:{nomor:1}})
    kols.forEach(function(x){
    	if(x.rules && x.rules!='' && x.rules!=undefined && x._id==colid){
    		var rule = x.rules
    		const id = (e.target.id).split('_')[0]
	  		cols = Koloms.find()
	  		cols.forEach(function(c){
	  			//console.log(c._id)
	  			if(rule.includes(c._id)){
	  				console.log('ada')
	  				tval = ""
	  				if(c.format=='array'){
	  					cval = $('#'+id+'_'+c._id).val()
	  				}else{
  						cval = $('#'+c._id).val()
  					}
  					console.log(cval)
  					if(cval && cval!=undefined){
  						tval = cval
  					}
	  				if(c.type=='date' && tval!=''){
	  					const date = new Date(tval);
	  					const diffTime = Math.abs(date)  / (1000 * 60 * 60 * 24)
						rule = rule.replace('{'+c._id+'}',diffTime)
	  				}else{
	  					rule = rule.replace('{'+c._id+'}',tval)
	  				}
	  				if(eval(rule)){
			  			console.log('tersisi')
			  			if(c.format=='array'){
		  					$('#error_'+id+'_'+x._id).html('')
		  				}else{
	  						$('#error_'+x._id).html('')
	  					}
			  		}else{
			  			if(c.format=='array'){
			  				console.log('#error_'+id+'_'+c._id)
			  				console.log(c.error)
		  					$('#error_'+id+'_'+x._id).html(x.error)
		  					$('#'+id+'_'+x._id).val('')
		  				}else{
	  						$('#error_'+x._id).html(x.error)
	  						$('#'+x._id).html(x.error)
	  					}

			  			console.log('kosong')
			  		}
	  			}
	  		})
	  		console.log(rule)
	  		
    	}
    	if(x.format!='array'){
	    	isi = $('#'+x._id).val()
	    	if(x.type=='number'){
	    		isi = parseInt(isi)
	    		if(isNaN(isi)){
	    			isi = 0
	    		}
	    	}
	    	data[x._id] = isi
    	}else{
    		const items = Session.get('activeitems')
    		//for (var i = 1; i <= items; i++) {
    		//items.forEach(function(it,ind){
    		$('.items_area').each(function(){
    			var a = this.id
    			ind = a.split('_')[1]
		  		isi = $('#'+ind+'_'+x._id).val()
		    	if(x.type=='number'){
		    		isi = parseInt(isi)
		    		if(isNaN(isi)){
		    			isi = 0
		    		}
		    	}
		    	if(Array.isArray(data[x._id])){
		    		data[x._id].push(isi)
		    	}else{
		    		data[x._id] = [isi]
		    	}

		  	})
    	}
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
  },
  'click .removeItem'(e){
  	console.log(e.target.id)
  	cek =  confirm('Apakah Anda yakin akan menghapus data ini ?')
  	if(cek){
	  	const id = (e.target.id).split('_')[1]
	  	console.log(id)
	  	$('#fr_'+id).remove()
	  	var items = Session.get('activeitems')
	  	//const index = items.indexOf(parseInt(id));
	  	//items.splice(index, 1);
	  	Session.set('activeitems',items-1)
  	}
  }
});


