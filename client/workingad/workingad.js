import './workingad.html'

import { Koloms } from '../../libs/kolom.js';
import { Values } from '../../libs/values.js';
import { Pilihan } from '../../libs/pilihan.js';
import XLSX from 'xlsx';

Template.workingadvance.onCreated(function helloOnCreated() {
  Meteor.subscribe('Koloms',{},{})
  Meteor.subscribe('Values',{},{})
  Meteor.subscribe('Pilihan',{},{})
});

Template.workingadvance.helpers({
  kolomss() {
    data = Koloms.find({'data':'woad'},{sort:{nomor:1}})
    if(data){
      return data
    }
  },
  value(){
    data = Values.find({'type':'woad'})
    if(data){
      return data
    }
  },
  getValue(kol,type,val){
    const vale = Values.findOne({_id:val})
    if(vale){
      if(type=='select'){
        v = Pilihan.findOne({_id:vale[kol]})
        if(v){
          return v.name
        }
      }else{
        return vale[kol]
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
    if(e.currentTarget.classList){
      if((e.currentTarget.classList.value).indexOf('deleteCategori')==-1){
        FlowRouter.go(e.currentTarget.dataset.href)
      }
    }else{
      FlowRouter.go(e.currentTarget.dataset.href)
    }
  },
  'click .exportXLS'(e){
     $('.notExporte').remove()
     doit('xlsx','coba.xlsx',true)
    //const html = document.getElementById('simpletable').innerHTML;
    //Meteor.call('createWb',html,function(e,s){
    //  XLSX.writeFile(s, 'sheetjs.xlsx');
    //})
    /*
    $("#simpletable").table2excel({
      exclude: ".notExporte",
      name: "Procurement",
      filename: "SomeFile.xls", 
      preserveColors: true
  });
  */
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
}

