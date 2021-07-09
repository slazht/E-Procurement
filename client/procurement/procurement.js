import './procurement.html'

import { Koloms } from '../../libs/kolom.js';
import { Values } from '../../libs/values.js';
import { Pilihan } from '../../libs/pilihan.js';
import XLSX from 'xlsx';

Template.procurement.onCreated(function helloOnCreated() {
	Meteor.subscribe('Koloms',{},{})
	Meteor.subscribe('Values',{type:'proc'},{sort:{'createdAt':-1},limit:200})
	Meteor.subscribe('Pilihan',{},{})
  Session.set('filter',{})
  Session.set('limit',200)
  if($('.btn-minimize').hasClass('toggled')){
  }else{
    $('.btn-minimize').click()
  }
});

Template.procurement.onRendered(function helloOnCreated() {
  Meteor.subscribe('Koloms',{},{})
  Meteor.subscribe('Values',{type:'proc'},{sort:{'createdAt':-1},limit:200})
  Meteor.subscribe('Pilihan',{},{})
  Session.set('filter',{})
  Session.set('limit',200)
  if($('.btn-minimize').hasClass('toggled')){
  }else{
    $('.btn-minimize').click()
  }
});

Template.procurement.helpers({
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
    filters['type'] = 'proc'
    //console.log(filters)
  	data = Values.find(filters,{sort:{'createdAt':-1},limit:parseInt(limit)})
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
              return Number((vale[kol][0]).toFixed(1)).toLocaleString()
            }else{
              return vale[kol][0]
            }
        }else{
          if(type=='number'){
              return Number((vale[kol]).toFixed(1)).toLocaleString()
          }else{
              return vale[kol]
          }
  			  //return vale[kol]
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
      kols.forEach(function(x,i){
        if(data.length < vale[x._id].length){
          vale[x._id].forEach(function(y,n){
            data.push({})
          })
        }
        //console.log(data)
        vale[x._id].forEach(function(y,n){
          data[n][x._id] = y 
        })
      })
      delete data[0]
      //console.log(data)
      return data
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
          return Number((val[kolId]).toFixed(1)).toLocaleString()
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
      //return 'sickies'
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
  	 $('.notExporte').remove()
     $('#hiders').css('display','block')
  	 doit('xlsx','exported.xlsx',true)
  },
  'click .fieldFilter'(){
     $('#filterModal').modal('show')
  },
  'click #saveStatus'(){
      data = Koloms.find({'data':'proc','type':'select'},{sort:{nomor:1}})
      if(data){
        var fil = {}
        data.forEach(function(x){
          const val = $('#filters_'+x._id).val()
          if(val!=''){
            fil[x._id] = val
          }
        })
        Session.set('filter',fil)
        //console.log(fil)
      }
      $('#filterModal').modal('hide')
      const limit = $('#amount').val()
      //console.log(limit)
      Session.set('limit',parseInt(limit))
      Meteor.subscribe('Values',{type:'proc'},{sort:{'createdAt':-1},limit:parseInt(limit)})
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




