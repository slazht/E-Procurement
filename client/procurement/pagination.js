import './pagination.html'

Template.pagination.onCreated(function helloOnCreated() {

});

Template.pagination.helpers({
  cekData(){
  	var numers  = []
  	const data  = Session.get(this.page)
  	if(data){
	  	const limit = Session.get('limit')
	  	const aktif = Session.get('aktif')
	  	const kankir= 4
	  	const maxpa = Math.ceil(data/limit)
	  	for(var i=aktif-kankir;i<aktif;i++){
	  		if(i>0){
	  			numers.push(i)
	  		}
	  	}
	  	for(var i=aktif;i<=kankir+aktif;i++){
	  		if(i<=maxpa){
	  			numers.push(i)
	  		}
	  	}
	  	console.log(numers)
	    return numers
	}
  },
  isAktif(num){
  	const aktif = Session.get('aktif')
  	if(num==aktif){
  		return 'active'
  	}
  	return ''
  }
});

Template.pagination.events({
  'click .pagination'(e){
  	var idi = e.target.id
  	idi = idi.split('_')[1]
  	Session.set('aktif',parseInt(idi))
  	//console.log(idi)
  },
})