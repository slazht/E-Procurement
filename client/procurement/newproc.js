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
	Session.set('bolehSave',{})
	const id = FlowRouter.getParam('id');
  	if(id){
  		Meteor.subscribe('Values',{_id:id},{})
  	}
  setTimeout(function() {
		numberInkoma()
		lrvaluechf()
  }, 1500);
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
  	pils = Pilihan.find({parent:col},{sort:{name:1}})
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
	  	/*
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
	  	*/
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
  isSelectedc(kol,val){
  	const id = FlowRouter.getParam('id');
  	vals = Values.findOne({_id:id})
  	if(vals){
  		if(vals['currency'][kol]==val){
  			return 'selected'
  		}
  	}
  	return ''
  },
  aisSelected(kol,val,item){
  	numberInkoma()
  	lrvaluechf()
  	const id = FlowRouter.getParam('id');
  	vals = Values.findOne({_id:id})
  	if(vals){
  		if(vals[kol][parseInt(item)-1]==val){
  			return 'selected'
  		}
  	}
  	return ''
  },
  aisSelectedc(kol,val,item){
  	numberInkoma()
  	lrvaluechf()
  	const id = FlowRouter.getParam('id');
  	vals = Values.findOne({_id:id})
  	if(vals){
  		if(vals['currency'][kol][parseInt(item)-1]==val){
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
  },
  isCurensy(kol){
  	const col = Koloms.findOne({'_id':kol})
  	if(col){
  		if(col.kategori=='currency'){
  			return true
  		}
  	}
  	return false
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
  	curr = {}
    kols = Koloms.find({'data':'proc'},{sort:{nomor:1}})
    kols.forEach(function(x){
    	if(x.format!='array'){
	    	isi = $('#'+x._id).val()
	    	if(x.type=='number'){
	    		isi = isi.replace(/^(-)|[^0-9]+/g, '$1');
	    		isi = parseInt(isi)
	    		if(isNaN(isi)){
	    			isi = 0
	    		}
	    	}
	    	if(x.kategori=='currency'){
	    		cue = $('#cur_'+x._id).val()
	    		curr[x._id] = cue
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
		    		isi = isi.replace(/^(-)|[^0-9]+/g, '$1');
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
		    	if(x.kategori=='currency'){
		    		cue = $('#cur_'+ind+'_'+x._id).val()
		    		if(Array.isArray(curr[x._id])){
			    		curr[x._id].push(cue)
			    	}else{
			    		curr[x._id] = [cue]
			    	}
		    	}
		    	
		  	})
    	}
    })
    data['currency'] = curr
    //console.log(data)
    if(idd===undefined){
    	data['createdBy'] = Meteor.userId()
    	data['createdAt'] = new Date()
    	data['type'] = 'proc'
    	Meteor.call('Values.insert',data,function(e,s){
    		if(e){
    			alert(e)
    		}else{
    			if(s!='Duplicate File Reference Number'){
    				FlowRouter.go('/procurement')
    			}else{
    				alert(s)
    			}
    		}
    	})
    }else{
    	data['type'] = 'proc'
    	Meteor.call('Values.update',idd,data,function(e,s){
    		if(e){
    			alert(e)
    		}else{
    			if(s!='Duplicate File Reference Number'){
    				FlowRouter.go('/procurement')
    			}else{
    				alert(s)
    			}
    		}
    	})
    }
  },
  'change .form-control'(e){
  	cekDeuDel() 
  	nodblriarbl()
  	daybetLrandRFq()
  	daybetRFQandPO()
  	daybetlRCandDelive()
  	kapitalisasi()
  	numberInkoma()
  	cekStatus()
  	var saveStat = Session.get('bolehSave')
  	let save = true
  	Object.keys(saveStat).forEach(function(x){
  		//console.log(saveStat[x])
  		if(saveStat[x]==0){
  			save=false
  		}
  	})
  	//console.log(save)
  	if(save){
  		$('#saveStatus').prop('disabled',false)
  	}else{
  		$('#saveStatus').prop('disabled',true)
  	}
  },
  'keyup input'(e){
  	cekDeuDel() 
  	nodblriarbl()
  	daybetLrandRFq()
  	daybetRFQandPO()
  	daybetlRCandDelive()
  	kapitalisasi()
  	numberInkoma()
  	cekStatus()
  	var saveStat = Session.get('bolehSave')
  	let save = true
  	Object.keys(saveStat).forEach(function(x){
  		if(saveStat[x]==0){
  			save=false
  		}
  	})
  	if(save){
  		$('#saveStatus').prop('disabled',false)
  	}else{
  		$('#saveStatus').prop('disabled',true)
  	}
  	/*
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
	  					const diffTime = Math.abs(date) / (1000 * 60 * 60 * 24)
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
		    	let input = true
		    	const ddel = $('#'+ind+'_BNsXAnnE5rMQbDt4p').val()
		    	const cons = $('#'+ind+'_soiApe2xq3LqiBuhS').val()
		    	if( (ddel!='' & cons=='') ||  (ddel=='' & cons!='')) {
		    		input = false
		    	}
		    	if(input){
			    	if(Array.isArray(data[x._id])){
			    		data[x._id].push(isi)
			    	}else{
			    		data[x._id] = [isi]
			    	}
		    	}
		  	})
    	}
    })
    /*
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
    */
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

// jik 'Due Dilligent Check/BNsXAnnE5rMQbDt4p' terisi maka 'PO/Contract number/soiApe2xq3LqiBuhS' harus diisi jika tidak, tdk bisa disave
function cekDeuDel() {
	//console.log('Po Kontrak Cek')
	var savestat = Session.get('bolehSave')
	list = 1
	$('.items_area').each(function(){
		var a = this.id
		ind = a.split('_')[1]
		const ddel = $('#'+ind+'_BNsXAnnE5rMQbDt4p').val()
		const cons = $('#'+ind+'_soiApe2xq3LqiBuhS').val()
		if( (ddel!='' & cons=='')) {
			$('#error_'+ind+'_BNsXAnnE5rMQbDt4p').html('"PO/Contract" harus di isi')
			$('#error_'+ind+'_soiApe2xq3LqiBuhS').html('"PO/Contract" harus di isi dulu')
			$('#'+ind+'_soiApe2xq3LqiBuhS').val('')
			list = 0
		}
		if (ddel=='' & cons!='') {
			$('#error_'+ind+'_BNsXAnnE5rMQbDt4p').html('"Due Dilligent Check" harus di isi')
			$('#error_'+ind+'_soiApe2xq3LqiBuhS').html('"Due Dilligent Check" harus di isi')
			list = 0
		}
		if((ddel=='' & cons=='') || (ddel!='' & cons!='')) {
			$('#error_'+ind+'_BNsXAnnE5rMQbDt4p').html('')
			$('#error_'+ind+'_soiApe2xq3LqiBuhS').html('')
		}
	})
	savestat['poKontrak'] = list
	Session.set('bolehSave',savestat)
}

// Number of days between LR issued and received by Logs = LR received Date - LR Date
function nodblriarbl(){
	const recdate = $('#rPyaezWdwXWB4Xsxg').val()
	const lrdate  = $('#ApeXHj9EjBNu5YCJm').val()
	if(recdate!='' & lrdate!=''){
		const nmrcdate = new Date(recdate);
		const nmlrdate = new Date(lrdate);
		const numrec = Math.abs(nmrcdate) / (1000 * 60 * 60 * 24)
		const numlrd = Math.abs(nmlrdate) / (1000 * 60 * 60 * 24)
		$('.items_area').each(function(){
			var a = this.id
			ind = a.split('_')[1]
			$('#'+ind+'_Qpmu4p4N5ATnXsi4Y').val(parseInt(numrec)-parseInt(numlrd))
		});
	}
}

// Day between LR received by Logs until RFQ issued = RFQ Date - LR received Date
function daybetLrandRFq(){
	const recdate = $('#5F3CgrQfcADp2j58d').val()
	const lrdate  = $('#rPyaezWdwXWB4Xsxg').val()
	if(recdate!='' & lrdate!=''){
		const nmrcdate = new Date(recdate);
		const nmlrdate = new Date(lrdate);
		const numrec = Math.abs(nmrcdate) / (1000 * 60 * 60 * 24)
		const numlrd = Math.abs(nmlrdate) / (1000 * 60 * 60 * 24)
		$('.items_area').each(function(){
			var a = this.id
			ind = a.split('_')[1]
			$('#'+ind+'_s24YNpj2WfiDJZzb4').val(parseInt(numrec)-parseInt(numlrd))
		});
	}
}

//Days between RFQ until PO issued = PO Date/ Contract Period - RFQ Date
function daybetRFQandPO(){
	$('.items_area').each(function(){
		var a = this.id
		ind = a.split('_')[1]
		const recdate = $('#'+ind+'_z88oWTrXMPkTdQgyR').val()
		const lrdate  = $('#5F3CgrQfcADp2j58d').val()
		if(recdate!='' & lrdate!=''){
			const nmrcdate = new Date(recdate);
			const nmlrdate = new Date(lrdate);
			const numrec = Math.abs(nmrcdate) / (1000 * 60 * 60 * 24)
			const numlrd = Math.abs(nmlrdate) / (1000 * 60 * 60 * 24)
			$('#'+ind+'_xh9w8xiAJSvfDh4cN').val(parseInt(numrec)-parseInt(numlrd))
		}
	});
}

//Total number of days between LR received and Items delivered = Actual Delivery Date 1 - LR received Date
function daybetlRCandDelive(){
	$('.items_area').each(function(){
		var a = this.id
		ind = a.split('_')[1]
		const recdate = $('#'+ind+'_JLQXgJSWXCaqXRWfE').val()
		const lrdate  = $('#rPyaezWdwXWB4Xsxg').val()
		if(recdate!='' & lrdate!=''){
			const nmrcdate = new Date(recdate);
			const nmlrdate = new Date(lrdate);
			const numrec = Math.abs(nmrcdate) / (1000 * 60 * 60 * 24)
			const numlrd = Math.abs(nmlrdate) / (1000 * 60 * 60 * 24)
			$('#'+ind+'_YqAJrKpsi2svoHkgG').val(parseInt(numrec)-parseInt(numlrd))
		}
	});
}

function kapitalisasi() {
	const fields = ['ZZXBoMgpJWcCYwdXt','u7TMwHGwWHaHbYCqu','ZZXBoMgpJWcCYwdXt']
	fields.forEach(function(x){
		const va = $('#'+x).val()
		if(va!='' && va!=undefined){
			$('#'+x).val(va.toUpperCase())
		}
		$('.items_area').each(function(){
				var a = this.id
				ind = a.split('_')[1]
				var va = $('#'+ind+'_'+x).val()
				if(va!='' && va!=undefined){
					$('#'+ind+'_'+x).val(va.toUpperCase())
				}
		})
	});
}

function numberInkoma(){
	const numbers = Koloms.find({'type':'number','data':'proc'})
	numbers.forEach(function(x){
		if(x.format!='array'){
			var va = $('#'+x._id).val()
			if(va!='' && va!=undefined){
				const data = valNumberkoma(va,x._id)
				$('#'+x._id).val(data)
			}
		}else{
			$('.items_area').each(function(){
				var a = this.id
				ind = a.split('_')[1]
				var va = $('#'+ind+'_'+x._id).val()
				if(va!='' && va!=undefined){
					const data = valNumberkoma(va,x._id)
					$('#'+ind+'_'+x._id).val(data)
				}
			})
		}
	})
}

function valNumberkoma(va,x){
	va = va.replace(/^(-)|[^0-9]+/g, '$1');
	va = Number(parseInt(va).toFixed(1)).toLocaleString()
	return va
}

function cekStatus(){
	//console.log('cekStatus')
	const status = $('#mKbKXsbSoQNSWW2SX').val()
	if(status=='LiaMXsEKdv2xf98yA'){
		const koloms = Koloms.find({'data':'proc'})
		var datas = ''
		koloms.forEach(function(x){
			if(x.format!='array'){
				var va = $('#'+x._id).val()
				if(va=='' || va==undefined){
					console.log('masuk')
					$('#mKbKXsbSoQNSWW2SX').val('F5g3J63Rhr3jvvigJ')
					$('#error__mKbKXsbSoQNSWW2SX').html('Semua data harus terisi agar status bisa Complete')
					//alert(x.name+ ' belum diisi')
					datas = datas+' '+ x.name
					return
				}
			}else{
				$('.items_area').each(function(){
					var a = this.id
					ind = a.split('_')[1]
					var va = $('#'+ind+'_'+x._id).val()
					if(va=='' || va==undefined){
						console.log('masuk')
						$('#mKbKXsbSoQNSWW2SX').val('F5g3J63Rhr3jvvigJ')
						$('#error__mKbKXsbSoQNSWW2SX').html('Semua data harus terisi agar status bisa Complete')
						//alert(x.name+ ' belum diisi')
						datas = datas+' '+ x.name
						return
					}
				})
			}
		})
		alert('Kolom '+datas+' belum diisi')
	}
}

//lr value chf FZ4BbjENKGTm9yHM9
function lrvaluechf(){
	$('#cur_FZ4BbjENKGTm9yHM9').val('USD')
	$('#cur_FZ4BbjENKGTm9yHM9').prop('disabled',true)
	$('.items_area').each(function(){
			var a = this.id
			ind = a.split('_')[1]
			$('#cur_'+ind+'_LkGwhDSyhMtDJkz2L').val('USD')
			$('#cur_'+ind+'_LkGwhDSyhMtDJkz2L').prop('disabled',true)
	})
}


