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
  })
});

Template.dashbord.helpers({
  counter() {
    return Template.instance().counter.get();
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
  		var status = data.status 
  		status.forEach(function(x){
  			stat = Pilihan.findOne({_id:x._id})
  			if(stat){
  				labels.push(stat.name)
  				isinya.push(x.count)
  			}
  		})
  		//console.log(labels)
  		//console.log(isinya)
  		setTimeout(function() {
				createPieChat(labels,isinya)
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
	$('.chart-container').html('<canvas id="pieChart" style="width: 50%; height: 50%"></canvas>')
	var myPieChart = new Chart(pieChart, {
		type: 'pie',
		data: {
			datasets: [{
				data: isinya,
				backgroundColor :["#1d7af3","#f3545d","#fdaf4b","#fdafaa"],
				borderWidth: 0
			}],
			labels: labels
		},
		options : {
			responsive: true, 
			maintainAspectRatio: false,
			legend: {
				position : 'bottom',
				labels : {
					fontColor: 'rgb(154, 154, 154)',
					fontSize: 11,
					usePointStyle : true,
					padding: 20
				}
			},
			pieceLabel: {
				render: 'percentage',
				fontColor: 'white',
				fontSize: 14,
			},
			tooltips: false,
			layout: {
				padding: {
					left: 20,
					right: 20,
					top: 20,
					bottom: 20
				}
			},
			plugins: {
        datalabels: {
            formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                    sum += data;
                });
                let percentage = (value*100 / sum).toFixed(2)+"%";
                return percentage;
            },
            color: '#fff',
        }
    	}
		}
	})
}
