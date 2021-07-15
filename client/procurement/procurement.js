import './procurement.html'

import { Koloms } from '../../libs/kolom.js';
import { Values } from '../../libs/values.js';
import { Pilihan } from '../../libs/pilihan.js';
import XLSX from 'xlsx';

Template.procurement.onCreated(function helloOnCreated() {
  limit = 40
  Session.set('limit',limit)
  Session.set('aktif',1)
	Meteor.subscribe('Koloms',{},{})
	Meteor.subscribe('Values',{type:'proc'},{sort:{'createdAt':-1}})
	Meteor.subscribe('Pilihan',{},{})
  Session.set('filter',{})
  if($('.btn-minimize').hasClass('toggled')){
  }else{
    $('.btn-minimize').click()
  }
});

Template.procurement.onRendered(function helloOnCreated() {
  limit = 40
  Meteor.subscribe('Koloms',{},{})
  Meteor.subscribe('Values',{type:'proc'},{sort:{'createdAt':-1}})
  Meteor.subscribe('Pilihan',{},{})
  if($('.btn-minimize').hasClass('toggled')){
  }else{
    $('.btn-minimize').click()
  }
});

Template.procurement.helpers({
  numbering2(inde){
    const lim = Session.get('limit')
    const aktif = Session.get('aktif')
    skip = parseInt(limit)*(parseInt(aktif)-1)
    return skip+inde+1
  },
  reloadSubscribe(){
    var par = {type:'proc'}
    var lim = Session.get('limit')
    const limit = Session.get('limit')
    var filters = Session.get('filter')
    const aktif = Session.get('aktif')
    skip = parseInt(limit)*(parseInt(aktif)-1)
    if(filters){
      par = filters
      par['type'] = 'proc'
    }
    if(lim){
      lim = lim + skip
      //Meteor.subscribe('Values',par,{sort:{'createdAt':-1},limit:lim})
    }
  },
  coundData(){
    var par = {type:'proc'}
    const filter = Session.get('filter')
    if(filter){
      par = filter
      par['type'] = 'proc'
    }
    console.log(par)
    Meteor.call('valuesCount',par,{},function(e,s){
      console.log(s)
      Session.set('valproc',s)
    })
  },
  lebarnya(id){
    if(id=='HB6nds6xKNY9nB8KG' || id=='ucScBqzoofEuc38RT' || id=='rPyaezWdwXWB4Xsxg' || id=='BNsXAnnE5rMQbDt4p' || id=='z88oWTrXMPkTdQgyR' || id=='Eyi4s5Tnmbn9QXp6Z' || id=='JLQXgJSWXCaqXRWfE' || id=='AhuMcJpyY844PWXP2' || id=="zQnkKLn5QmRuZJu75"){
      return '100px'
    }
    if(id=='Qpmu4p4N5ATnXsi4Y' || id=='s24YNpj2WfiDJZzb4' || id=='xh9w8xiAJSvfDh4cN' || id=='YqAJrKpsi2svoHkgG'){
      return '130px'
    }
    if(id=='rPyaezWdwXWB4Xsxg' || id=='d7eYC6PpEs7KNnZ8R' || id=='soiApe2xq3LqiBuhS' ){
      return '80px'
    }
    if(id=="3rEt3S5Sp5DN5ct46" || id=='4o2Kxt6Hbi2DgxTkg'){
      return '165px'
    }else{
      return '65px'
    }
  },
  kanankiri(kol){
    const data = Koloms.findOne({'_id':kol})
    if(data){
      if(data.type=='number'){
        return 'right'
      }
      if(data.type=='date'){
        return 'center'
      }
    }
    return 'left'
  },
  selectKoloms(){
    data = Koloms.find({'data':'proc','type':'select'},{sort:{nomor:1}})
    if(data){
      return data
    }
  },
  kolomss() {
  	data = Koloms.find({'data':'proc'},{sort:{nomor:1}})
    if(data){
    	return data
    }
  },
  pilihans(id){
    data = Pilihan.find({'parent':id})
    if(data){
      return data
    }
  },
  value(){
    const limit = Session.get('limit')
    var filters = Session.get('filter')
    const aktif = Session.get('aktif')
    skip = parseInt(limit)*(parseInt(aktif)-1)
    filters['type'] = 'proc'
    //console.log(filters)
  	data = Values.find(filters,{sort:{'createdAt':-1},limit:parseInt(limit),skip:skip})
  	if(data){
  		return data
  	}
  },
  countSpan(row,kol){
    var res = 1
    cekKol = Koloms.findOne({_id:kol})
    if((cekKol && cekKol.format!='array') || kol=='no'){
      const kols = Koloms.findOne({'data':'proc','format':'array'})
      if(kols){
        const vale = Values.findOne({_id:row})
        if(vale){
          //console.log(vale[kols._id])
          const cospan = vale[kols._id].length
          //console.log(cospan)
          return cospan
        }
      }
    }
    return res
  },
  getValue(kol,type,val){
    cekKol = Koloms.findOne({_id:kol})
  	const vale = Values.findOne({_id:val})
  	if(vale){
  		if(type=='select'){
        if(Array.isArray(vale[kol])){
          var result = ''
          /*
          vale[kol].forEach(function(x){
              v = Pilihan.findOne({_id:x})
              if(v){
                 result = result + v.name + '</br>'
              }
              
          })
          */
          v = Pilihan.findOne({_id:vale[kol][0]})
          if(v){
             result =  v.name 
          }
          //console.log(result)
          return result
        }else{
  			  v = Pilihan.findOne({_id:vale[kol]})
    		  if(v){
    			   return v.name
    		  }
        }
  		}else{
        //console.log(vale[kol])
        if(Array.isArray(vale[kol])){
          //console.log('array')
          /*
            var result = ''
            vale[kol].forEach(function(x){
              result = result + x + '</br>'
            })
            */
            if(type=='number'){
              nuu = Number((vale[kol][0]).toFixed(1)).toLocaleString()
            }else{
              nuu = vale[kol][0]
            }
            if(cekKol.kategori=='currency'){
              if(vale['currency']){
                cur = vale['currency'][kol][0]
                if(cur=='USD'){
                  return '$'+nuu
                }
                if(cur=='IDR'){
                  return 'Rp'+nuu
                }
              }
              return nuu
            }
            return nuu
        }else{
          if(type=='number'){
              nuu = Number((vale[kol]).toFixed(1)).toLocaleString()
          }else{
              nuu = vale[kol]
          }
  			  //return vale[kol]
          if(cekKol.kategori=='currency'){
            if(vale['currency']){
              cur = vale['currency'][kol]
              if(cur=='USD'){
                return '$'+nuu
              }
              if(cur=='IDR'){
                return 'Rp'+nuu
              }
            }
            return nuu
          }
          return nuu
        }
  		}
  	}
  },
  valuekolom(){
  	var dataval = this
  	var result = []
  	data = Koloms.find({'data':'proc'},{sort:{nomor:1}})
    if(data){
    	data.forEach(function(x){
    		if(x.type=='select'){
    			v = Pilihan.findOne({_id:dataval[x._id]})
    			if(v){
    				result.push({'col':x.name,'val':v.name})
    			}
    		}else{
    			result.push({'col':x.name,'val':dataval[x._id]})
    		}
    	})
    }
    //console.log(result)
    return result
  },
  arrayVals(row){
    var data = []
    //console.log(row)
    const kols = Koloms.find({'data':'proc','format':'array'})
    if(kols){
      const vale = Values.findOne({_id:row})
      //console.log(kols.count())
      if(vale){
        kols.forEach(function(x,i){
          if(data.length < vale[x._id].length){
            vale[x._id].forEach(function(y,n){
              data.push({})
            })
          }
          //console.log(data)
          vale[x._id].forEach(function(y,n){
            data[n][x._id] = y 
            if(x.kategori=='currency'){
              if(vale['currency']){
                if(data[n]['currency']){
                  data[n]['currency'][x._id] = vale['currency'][x._id][n]
                }else{
                  data[n]['currency'] = {}
                  data[n]['currency'][x._id] = vale['currency'][x._id][n]
                }
              }
            }
          })
        })
        delete data[0]
        //console.log(data)
        return data
      }
    }
  },
  kolomsArr(){
     const kols = Koloms.find({'data':'proc','format':'array'},{sort:{nomor:1}})
     if(kols){
      return kols
     }
  },
  arValues(kolId,val){
    //console.log(kolId)
    //console.log(val)
    const kols = Koloms.findOne({_id:kolId})
    if(kols && kols.type=='select'){
      const pilh = Pilihan.findOne({_id:val[kolId]})
      if(pilh){
        return pilh.name
      }
    }
    if(val){
      if(kols.type=='number'){
          nuu = Number((val[kolId]).toFixed(1)).toLocaleString()
          if(kols.kategori=='currency'){
            //console.log(val[kolId])
              if(val['currency']){
                //console.log(val[kolId])
                cur = val['currency'][kolId]
                if(cur=='USD'){
                  return '$'+nuu
                }
                if(cur=='IDR'){
                  return 'Rp'+nuu
                }
              }
              return nuu
          }
          return nuu
      }
      return val[kolId]
    }
  },
  tables(){
    setTimeout(function(){
      createSticky();
    }, 2000);
  },
  stikkki(kol){
    if(kol=='3rEt3S5Sp5DN5ct46'){
      return 'sickieseDescript'
    }
    if(kol=='S5aoDyopvsafjou9s'){
      return 'sickies'
    }
    if(kol=='ucScBqzoofEuc38RT'){
      return 'sickiese'
    }
    if(kol=='ZZXBoMgpJWcCYwdXt'){
      //return 'sickiesactivity'
    }
    return ''
  }
});

Template.procurement.events({
  'click .deleteCategori'(e){
  	//console.log(e.currentTarget.classList)
  	cek =  confirm('Apakah Anda yakin akan menghapus data ini ?')
  	if(cek){
  		Meteor.call('Values.delete',e.target.id,function(e,s){
	  		if(e){
	  			alert(e)
	  		}
	  	})
  	}
  	FlowRouter.go('/procurement')
  },
  'click .clickable-row'(e){
    if(e.target.classList){
  		if((e.target.classList.value).indexOf('deleteCategori')==-1){
  			FlowRouter.go(e.currentTarget.dataset.href)
  		}
  	}else{
  		//FlowRouter.go(e.currentTarget.dataset.href)
  	}
  },
  'click .exportXLS'(e){
    Session.set('limit',1000000000000)
  	$('.notExporte').remove()
    $('.exportXLS').prop('disabled',true)
    setTimeout(function(){
      $('#hiders').css('display','block')
  	  doit('xlsx','exported.xlsx',true)
      $('.exportXLS').prop('disabled',false)
    }, 4000);
  },
  'click .fieldFilter'(){
     $('#filterModal').modal('show')
  },
  'click #saveStatusr'(){
      data = Koloms.find({'data':'proc','type':'select'},{sort:{nomor:1}})
      if(data){
        var fil = {}
        data.forEach(function(x){
          const val = $('#filters_'+x._id).val()
          if(val!=''){
            fil[x._id] = val
          }
        })
        const text = $('#text').val()
        if(text!='' && text!=undefined){
          fil['$or'] = [{'ucScBqzoofEuc38RT':{ '$regex': text, '$options': 'i' }},{'3rEt3S5Sp5DN5ct46':{ '$regex': text, '$options': 'i' }}]
        }
        Session.set('filter',fil)
        Session.set('aktif',1)
        //console.log(fil)
      }

      $('#filterModal').modal('hide')
      //const limit = $('#amount').val()
      //console.log(limit)
      //Session.set('limit',parseInt(limit))
      //Meteor.subscribe('Values',{type:'proc'},{sort:{'createdAt':-1}})
  }
});

var tableToExcel = (function() {
  var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };
  return function(table, name) {
      if (!table.nodeType) table = document.getElementById(table);
      var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };
    window.location.href = uri + base64(format(template, ctx));
  };
})();

function doit(type, fn, dl) {
	var elt = document.getElementById('simpletable');
	var wb = XLSX.utils.table_to_book(elt, {sheet:"Procurement"});
	
	XLSX.writeFile(wb, fn || ('SheetJSTableExport.' + (type || 'xlsx')));
  $('#hiders').css('display','none')
}




