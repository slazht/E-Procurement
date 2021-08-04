import './dashboard.html'

import { Koloms } from '../../libs/kolom.js';
import { Pilihan } from '../../libs/pilihan.js';

Template.dashbord.onCreated(function helloOnCreated() {
	Meteor.subscribe('Koloms',{},{})
	Meteor.subscribe('Pilihan',{},{})
	//setTimeout(function() {
	//	createPieChat()
  //}, 1000);

  Meteor.call('totalData',function(e,s){
  	Session.set('totalData',s)
  	//console.log(s)
  })
  Meteor.call('totalDataWoad',function(e,s){
  	Session.set('totalDataWoad',s)
  	//console.log(s)
  })
  Meteor.call('getTask', function(e,s){
  	//console.log(s)
  	Session.set('task',s)
  })
  Meteor.call('getTaskw', function(e,s){
  	console.log(s)
  	Session.set('taskw',s)
  })
});

Template.dashbord.helpers({
  theTask() {
  	const tak = Session.get('task')
  	if(tak){
  		return tak
  	}
  },
  theTaskw() {
  	const tak = Session.get('taskw')
  	if(tak){
  		return tak
  	}
  },
  counter() {
    return Template.instance().counter.get();
  },
  totalDataWoad() {
  	const data = Session.get('totalDataWoad')
  	if(data){
  		//console.log(data)
  		return data
  	}
  },
  totalData() {
  	const data = Session.get('totalData')
  	if(data){
  		//console.log(data)
  		return data
  	}
  },
  bikinCHart(){
  	const data = Session.get('totalData')
  	if(data){
  		var labels   = []
  		var isinya   = []
  		var total    = 0
  		var status = data.status 
  		status.forEach(function(x){
  			stat = Pilihan.findOne({_id:x._id})
  			if(stat){
  				labels.push(stat.name)
  				//isinya.push(x.count)
  				total = total + parseInt(x.count)
  				isinya.push((100/parseInt(data.proc)*parseInt(x.count)).toFixed(1))
  			}
  		})
  		if(parseInt(data.proc)-total>0){
  			labels.push('Unset')
  			const cu = parseInt(data.proc)-total
  			isinya.push((100/parseInt(data.proc)*parseInt(cu)).toFixed(1))
  		}
  		//console.log(labels)
  		//console.log(isinya)
  		setTimeout(function() {
				createPieChat(labels,isinya)
  		}, 1000);
  	}
  },
  bikinCHart2(){
  	const data2 = Session.get('totalDataWoad')
  	if(data2){
  		var labels   = []
  		var isinya   = []
  		var total    = 0
  		var status = data2.status 
  		status.forEach(function(x){
  			stat = Pilihan.findOne({_id:x._id})
  			if(stat){
  				labels.push(stat.name)
  				//isinya.push(x.count)
  				total = total + parseInt(x.count)
  				isinya.push((100/parseInt(data2.woad)*parseInt(x.count)).toFixed(1))
  			}
  		})
  		if(parseInt(data2.woad)-total>0){
  			labels.push('Unset')
  			const cu = parseInt(data2.woad)-total
  			isinya.push((100/parseInt(data2.woad)*parseInt(cu)).toFixed(1))
  		}
  		//console.log(labels)
  		//console.log(isinya)
  		setTimeout(function() {
				createPieChatw(labels,isinya)
  		}, 1000);
  	}
  },
  formatHarga(harga){
  	if(harga){
  		return (harga).toLocaleString("id-IN", {style: "currency", currency: "IDR", minimumFractionDigits: 0}) 
  	}
  },
  cekName(id){
  	const name = Pilihan.findOne({_id:id})
  	if(name){
  		return name.name
  	}
  	return '-'
  }
});

function createPieChat(labels,isinya){
	$('.kontener-a').html('<canvas id="pieCharta" style="width: 50%; height: 50%"></canvas>')
	pieCharta = document.getElementById('pieCharta').getContext('2d')
	var myPieChart = new Chart(pieCharta, {
		type: 'pie',
			data: {
				datasets: [{
					data: isinya,
					backgroundColor :["#1d7af3","#f3545d","#fdaf4b"],
					borderWidth: 0
				}],
				labels: labels 
			},
			options : {
	            tooltips: {
	                mode: 'label',
	                callbacks: {
	                    label: function(tooltipItem, data) {
	                        return data['datasets'][0]['data'][tooltipItem['index']] + '%';
	                    }
	                }
	            },
		          scale: {
		            ticks: {
		                beginAtZero: true
		            }
		        }
		    }
	})
}

function createPieChatw(labels,isinya){
	$('.kontener-b').html('<canvas id="pieChartw" style="width: 50%; height: 50%"></canvas>')
	pieCharta = document.getElementById('pieChartw').getContext('2d')
	var myPieChart = new Chart(pieCharta, {
		type: 'pie',
			data: {
				datasets: [{
					data: isinya,
					backgroundColor :["#1d7af3","#f3545d","#fdaf4b"],
					borderWidth: 0
				}],
				labels: labels 
			},
			options : {
	            tooltips: {
	                mode: 'label',
	                callbacks: {
	                    label: function(tooltipItem, data) {
	                        return data['datasets'][0]['data'][tooltipItem['index']] + '%';
	                    }
	                }
	            },
		          scale: {
		            ticks: {
		                beginAtZero: true
		            }
		        }
		    }
	})
}
