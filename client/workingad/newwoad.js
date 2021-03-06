import './newwoad.html'

import { Koloms } from '../../libs/kolom.js';
import { Pilihan } from '../../libs/pilihan.js';
import { Values } from '../../libs/values.js';
import { Akses } from '../../libs/akses.js';

import currency from 'currency.js';

Template.newwoad.onCreated(function helloOnCreated() {
	Meteor.subscribe('Koloms',{},{})
	Meteor.subscribe('Pilihan',{},{})
	Meteor.subscribe('Akses',{},{})
	const id = FlowRouter.getParam('id');
  if(id){
  	Meteor.subscribe('Values',{_id:id},{})
  }
  setTimeout(function() {
    numberInkoma()
    valuechf()
  }, 1000);
    
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
      if(cid=='cSCKJANGQD7prAzWg'){
        console.log('disini ',vals[cid])
      }
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
  		//result = eval(formu)
  	}
  	if(col && col.type=='number' && result==''){
  		result = 0
  	}
  	return result
  },
  isSelected(kol,val){
    numberInkoma()
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
  },
  isCurensy(kol){
    const col = Koloms.findOne({'_id':kol})
    if(col){
      if(col.kategori=='currency'){
        return true
      }
    }
    return false
  },
  isSelectedc(kol,val){
    numberInkoma()
    valuechf()
    const id = FlowRouter.getParam('id');
    vals = Values.findOne({_id:id})
    if(vals){
      if(vals['currency'] && vals['currency'][kol]==val){
        return 'selected'
      }
    }
    return ''
  },
  aisSelectedc(kol,val,item){
    numberInkoma()
    valuechf()
    const id = FlowRouter.getParam('id');
    vals = Values.findOne({_id:id})
    if(vals){
      if(vals['currency'][kol][parseInt(item)-1]==val){
        return 'selected'
      }
    }
    return ''
  },
});


Template.newwoad.events({
  'click #saveStatus'() {
    cekAmountReceive()
    hitungExchange()
  	const idd  = FlowRouter.getParam('id');
  	data = {}
    curr = {}
    kols = Koloms.find({'data':'woad'},{sort:{nomor:1}})
    kols.forEach(function(x){
    	isi = $('#'+x._id).val()
    	if(x.type=='number' && x.kategori!='currency'){
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
    })
    data['currency'] = curr
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
  'change .form-control'(){
    hitungExchange()
    const camont = cekAmountReceive()
    const cekNot = cekNotrans()
    //numberInkoma()
    if(camont==1 & cekNot==1){
      $('#saveStatus').prop('disabled',false)
    }else{
      $('#saveStatus').prop('disabled',true)
    }
  },
  'blur input'(e){
    numberInkoma()
  },
  'keyup input'(){
    const camont = cekAmountReceive()
    const cekNot = cekNotrans()
    hitungExchange()
    //numberInkoma()
    if(camont==1 & cekNot==1){
      $('#saveStatus').prop('disabled',false)
    }else{
      $('#saveStatus').prop('disabled',true)
    }
    /*
  	$('#saveStatus').html('Not Saved')
    const amre = $('#cSCKJANGQD7prAzWg').val()
    const chek = $('#YApYN5ySixEGkyhTB').val()
    const wasd = $('#NwoLPSW83zi6TavQL').val()
    const pere = $('#FWq72fLyCXSRBwLpW').val()
    const acin = $('#bTsQ3xLe6N2sYtiaR').val()
    const wfca = $('#QMGnKd2TXdpx4iirg').val()
    if(parseInt(amre)!=(parseInt(chek)+parseInt(wasd)+parseInt(pere)+parseInt(acin)+parseInt(wfca))){
      //$('#error__GvZni2SWBtnPLYfYM').html('Form harus di isi !')
      $('#error__cSCKJANGQD7prAzWg').html('Data tidak sesuai prosedur !')
      //return
    }else{
      //$('#error__GvZni2SWBtnPLYfYM').html('')
      $('#error__cSCKJANGQD7prAzWg').html('')
    }
    if(wasd!='' & wasd!='0' & wasd!=undefined && pere!='' & pere!='0' & pere!=undefined & acin!='' & acin!='0' & acin!=undefined & wfca!='' & wfca!='0' & wfca!=undefined ){
      const note = $('#GvZni2SWBtnPLYfYM').val()
      if(note=='' || note==undefined){
        $('#error__GvZni2SWBtnPLYfYM').html('Form harus di isi !')
        $('#saveStatus').prop('disabled',true)
        return
      }else{
        $('#error__GvZni2SWBtnPLYfYM').html('')
        $('#saveStatus').prop('disabled',false)
      }
    }else{
      $('#error__GvZni2SWBtnPLYfYM').html('')
      $('#saveStatus').prop('disabled',false)
    }
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
    */
  },
  'change #5SBhqfaBX7ASzLeFA'(e){
    console.log(e.target.value)
    const pils = Pilihan.findOne({_id:e.target.value})
    console.log(pils.rDp4p9oeLNmmWzqpL)
    if(pils){
      $('#sGHo24YR7TxCy78oB').val(pils.sGHo24YR7TxCy78oB)
      $('#2e9AQ4ZSM4eyqjFHm').val(pils['2e9AQ4ZSM4eyqjFHm'])
      $('#fuaFpPfkGCjXfNrHf').val(pils.fuaFpPfkGCjXfNrHf)
      $('#rDp4p9oeLNmmWzqpL').val(pils.rDp4p9oeLNmmWzqpL)
    }
    numberInkoma()
  }
});

function cekAmountReceive(){
  let savStat = 1
  const amre = $('#cSCKJANGQD7prAzWg').val()
  const chek = $('#YApYN5ySixEGkyhTB').val()
  const wasd = $('#NwoLPSW83zi6TavQL').val()
  const pere = $('#FWq72fLyCXSRBwLpW').val()
  const acin = $('#bTsQ3xLe6N2sYtiaR').val()
  const wfca = $('#QMGnKd2TXdpx4iirg').val()
  console.log((parseInt(chek)+parseInt(wasd)+parseInt(pere)+parseInt(acin)+parseInt(wfca)))
  if(parseInt(amre)!=(parseInt(chek)+parseInt(wasd)+parseInt(pere)+parseInt(acin)+parseInt(wfca))){
    console.log('tidak sama')
    //$('#error__GvZni2SWBtnPLYfYM').html('Form harus di isi !')
    $('#error_1_cSCKJANGQD7prAzWg').html('Data tidak sesuai prosedur !')
    //return
  }else{
    //$('#error__GvZni2SWBtnPLYfYM').html('')
    $('#error_1_cSCKJANGQD7prAzWg').html('')
  }
  if(wasd!='' & wasd!='0' & wasd!=undefined && pere!='' & pere!='0' & pere!=undefined & acin!='' & acin!='0' & acin!=undefined & wfca!='' & wfca!='0' & wfca!=undefined ){
    const note = $('#GvZni2SWBtnPLYfYM').val()
    if(note=='' || note==undefined){
      $('#error__GvZni2SWBtnPLYfYM').html('"Note" harus di isi')
      savStat = 1
    }else{
      $('#error__GvZni2SWBtnPLYfYM').html('')
    }
  }else{
    $('#error__GvZni2SWBtnPLYfYM').html('')
    //savStat = 1
  }
  return savStat
}

// masukin no transaksi harus masukin amount receved dan date received
function cekNotrans(){
  let savStat = 1
  const notran = $('#T23oJu5bHb8XqfMc7').val()
  const dater  = $('#gsXBC5aKbe4Z6Fd7T').val()
  const amore  = $('#cSCKJANGQD7prAzWg').val()
  $('#error__T23oJu5bHb8XqfMc7').html('')
  $('#error__gsXBC5aKbe4Z6Fd7T').html('')
  $('#error_2_cSCKJANGQD7prAzWg').html('')
  if(notran=='' & (dater!='' || amore!='')){
    $('#error__T23oJu5bHb8XqfMc7').html('No Transaksi Harus di isi')
    savStat = 0
  }
  if(dater=='' & (notran!='' || amore!='')){
    $('#error__gsXBC5aKbe4Z6Fd7T').html('Date Received Harus di isi')
    savStat = 0
  }
  if(amore=='' & (dater!='' || notran!='')){
    $('#error_2_cSCKJANGQD7prAzWg').html('Amount received Harus di isi')
    savStat = 0
  }
  return savStat
}

function valNumberkoma(va,x){
  if(x=='rDp4p9oeLNmmWzqpL'){
    console.log(va)
    va = va.replace('.00','')
  }
  //va = va.replace(/^(-)|[^0-9]+/g, '$1');
  va = va.replace(/,/g, "");
  //console.log(va)
  if(x=='rDp4p9oeLNmmWzqpL'){
    va = Number(parseFloat(va).toFixed(2)).toLocaleString()
    return va
  }
  va = Number(parseInt(va).toFixed(1)).toLocaleString()
  return va
}

function valNumberCurrency(va,x){
  va = va.replace(/,/g, "");
  const IDR = value => currency(value, { symbol: '', decimal: '.', separator: ',' });
  return IDR(va).format();
}

function numberInkoma(){
  console.log('cek')
  const numbers = Koloms.find({'type':'number','data':'woad'})
  numbers.forEach(function(x){
    if(x.format!='array'){
      var va = $('#'+x._id).val()
      if(va!='' && va!=undefined){
        if(x.kategori=='currency'){
          data = valNumberCurrency(va,x._id)
        }else{
          data = valNumberkoma(va,x._id)
        }
        //const data = valNumberkoma(va,x._id)
        $('#'+x._id).val(data)
      }
    }else{
      $('.items_area').each(function(){
        var a = this.id
        ind = a.split('_')[1]
        var va = $('#'+ind+'_'+x._id).val()
        if(va!='' && va!=undefined){
          if(x.kategori=='currency'){
            data = valNumberCurrency(va,x._id)
          }else{
            data = valNumberkoma(va,x._id)
          }
          //const data = valNumberkoma(va,x._id)
          $('#'+ind+'_'+x._id).val(data)
        }
      })
    }
  })
  exrate = $('#rDp4p9oeLNmmWzqpL').val()
  if(exrate!='' && exrate!=undefined){
    //$('#rDp4p9oeLNmmWzqpL').val(exrate+'.00')
  }
}

// hitung excange rate echange rate = total receive / chf value
// rDp4p9oeLNmmWzqpL = 2e9AQ4ZSM4eyqjFHm / fuaFpPfkGCjXfNrHf
function hitungExchange(){
  var receiv = $('#2e9AQ4ZSM4eyqjFHm').val()
  var chfval = $('#fuaFpPfkGCjXfNrHf').val()

  if(receiv!='' && receiv !=undefined && chfval!='' && chfval!=undefined){
    //receiv = receiv.replace('.00','')
    //chfval = chfval.replace('.00','')
    receiv = receiv.replace(/,/g, "");
    chfval = chfval.replace(/,/g, "");
    $('#rDp4p9oeLNmmWzqpL').val((parseFloat(receiv)/parseFloat(chfval)).toFixed(2))
  }
}

// cur_fuaFpPfkGCjXfNrHf chf value
function valuechf(){
  $('#cur_fuaFpPfkGCjXfNrHf').val('CHF')
  $('#cur_fuaFpPfkGCjXfNrHf').prop('disabled',true)
  $('#cur_2e9AQ4ZSM4eyqjFHm').val('IDR')
  $('#cur_2e9AQ4ZSM4eyqjFHm').prop('disabled',true)
  $('#cur_rDp4p9oeLNmmWzqpL').val('IDR')
  $('#cur_rDp4p9oeLNmmWzqpL').prop('disabled',true)
}


