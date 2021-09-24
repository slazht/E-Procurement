import './workingad.html'

import { Koloms } from '../../libs/kolom.js';
import { Values } from '../../libs/values.js';
import { Pilihan } from '../../libs/pilihan.js';
import XLSX from 'xlsx';

import currency from 'currency.js';
const IDR = value => currency(value, { symbol: '', decimal: '.', separator: ',' });

Template.workingadvance.onCreated(function helloOnCreated() {
  limit = 40
  Session.set('limit',limit)
  Session.set('aktif',1)
  Meteor.subscribe('Koloms',{},{})
  Meteor.subscribe('Values',{type:'woad'},{sort:{'createdAt':-1}})
  Meteor.subscribe('Pilihan',{},{})
  Session.set('filter',{})
  if($('.btn-minimize').hasClass('toggled')){
  }else{
    $('.btn-minimize').click()
  }
});

Template.workingadvance.onRendered(function helloOnCreated() {
  limit = 40
  Session.set('limit',limit)
  Session.set('aktif',1)
  Meteor.subscribe('Koloms',{},{})
  Meteor.subscribe('Values',{type:'woad'},{sort:{'createdAt':-1}})
  Meteor.subscribe('Pilihan',{},{})
  Session.set('filter',{})
  if($('.btn-minimize').hasClass('toggled')){
  }else{
    $('.btn-minimize').click()
  }
});

Template.workingadvance.helpers({
  lebarnya(id){
    if(id=="GvZni2SWBtnPLYfYM"){
      return '200px'
    }else{
      return '95px'
    }
  },
  stikkki(kol){
    if(kol=='T23oJu5bHb8XqfMc7'){
      return 'sickiese'
    }
    return ''
  },
  tables(){
    console.log('skc')
    setTimeout(function(){
      createSticky();
    }, 1000);
  },
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
      par['type'] = 'woad'
    }
    if(lim){
      lim = lim + skip
      Meteor.subscribe('Values',par,{sort:{'createdAt':-1}})
    }
  },
  coundData(){
    var par = {type:'woad'}
    const filter = Session.get('filter')
    if(filter){
      par = filter
      par['type'] = 'woad'
    }
    console.log(par)
    Meteor.call('valuesCount',par,{},function(e,s){
      console.log(s)
      Session.set('valwoad',s)
    })
  },
  kanankiri(kol){
    const data = Koloms.findOne({'_id':kol})
    if(data){
      if(data.type=='number'){
        return 'right'
      }
    }
    return 'left'
  },
  selectKoloms(){
    data = Koloms.find({'data':'woad','type':'select'},{sort:{nomor:1}})
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
  kolomss() {
    data = Koloms.find({'data':'woad'},{sort:{nomor:1}})
    if(data){
      return data
    }
  },
  value(){
    const limit = Session.get('limit')
    var filters = Session.get('filter')
    const aktif = Session.get('aktif')
    skip = parseInt(limit)*(parseInt(aktif)-1)
    var filters = Session.get('filter')
    filters['type'] = 'woad'
    //console.log(filters)
    data = Values.find(filters,{sort:{'createdAt':-1},limit:parseInt(limit),skip:skip})
    if(data){
      return data
    }
  },
  getValue(kol,type,val){
    cekKol = Koloms.findOne({_id:kol})
    const vale = Values.findOne({_id:val})
    if(vale){
      if(type=='select'){
        v = Pilihan.findOne({_id:vale[kol]})
        if(v){
          if(type=='number'){
              return Number((v.name).toFixed(1)).toLocaleString()
          }else{
              return '"'+v.name
          }
          //return v.name
        }
      }else{
        if(type=='number' && cekKol.kategori!='currency'){
          nuu = Number((vale[kol]).toFixed(1)).toLocaleString()
        }else if(type=='number' && cekKol.kategori=='currency'){
          va = (vale[kol]+'').replace(/,/g, "");
          nuu = IDR(va).format();
          //nuu = vale[kol][0]
        }else{
          nuu = '"'+vale[kol]
        }
        /*
        if(type=='number'){
          nuu = Number((vale[kol]).toFixed(1)).toLocaleString()
        }else{
          nuu = vale[kol]
        }
        */
        if(cekKol.kategori=='currency'){
            if(vale['currency']){
              cur = vale['currency'][kol]
              if(cur=='USD'){
                //return '$'+nuu
              }
              if(cur=='IDR'){
                //return 'Rp'+nuu
              }
              if(cur=='CHF'){
                //return 'CHF'+nuu
              }
            }
            return nuu
        }
        return nuu
        //return vale[kol]
      }
    }
  },
  valuekolom(){
    var dataval = this
    var result = []
    data = Koloms.find({'data':'woad'},{sort:{nomor:1}})
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
    console.log(result)
    return result
  }
});

Template.workingadvance.events({
  'click .deleteCategori'(e){
    console.log(e.currentTarget.classList)
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
     $('.exportXLS').prop('disabled',true)
     setTimeout(function(){
      $('#hiders').css('display','block')
      $('.notExporte').remove()
      doit('xlsx','Working Advance export.xlsx',true)
     }, 4000);
    
  },
  'click .fieldFilter'(){
     $('#filterModal').modal('show')
  },
  'click #saveStatus'(){
      data = Koloms.find({'data':'woad','type':'select'},{sort:{nomor:1}})
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
          fil['$or'] = [{'T23oJu5bHb8XqfMc7':{ '$regex': text, '$options': 'i' }},{'Z568J675xXrZDZwtR':{ '$regex': text, '$options': 'i' }}]
        }
        Session.set('filter',fil)
        Session.set('aktif',1)
        //console.log(fil)
      }
      $('#filterModal').modal('hide')
      //const limit = $('#amount').val()
      //console.log(limit)
      //Session.set('limit',parseInt(limit))
      //Meteor.subscribe('Values',{type:'woad'},{sort:{'createdAt':-1},limit:parseInt(limit)})
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

