import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base'

import { Koloms } from '../libs/kolom.js';
import { Privilege } from '../libs/privilege.js';

import '../public/bootstrap/css/bootstrap.min.css';
import '../public/css/azzara.min.css';

import "../public/bootstrap/js/bootstrap.bundle.min.js";
import "../public/js/jquery-ui.min.js"
import "../public/js/jquery.scrollbar.min.js"
import "../public/js/Chart.min.js"
import "../public/js/ready.min.js"
import "../public/js/floadthred.js"

import '../libs/router.js'
import './main.html';
import './layout.html';
import './dashboard/index.js';
import './procurement/index.js';
import './workingad/index.js';
import './settings/index.js';
import './authentication/login.js';
import './akses/index.js'

Template.layout.onCreated(function helloOnCreated() {
  Meteor.subscribe('Koloms',{'type':'select'},{})
  Meteor.subscribe('Privilege',{},{})
});

Template.layout.helpers({
  userLogin(){
    return Meteor.user({fields: {'username': 1,'emails':1,'profile':1}});
  },
  listColums(){
    return Koloms.find({'type':'select'})
  },
  priv(){
    data = Meteor.user({fields: {'username': 1,'emails':1,'profile':1}});
    if(data){
      var pri = Privilege.findOne({_id:data.profile.privilege})
      if(pri){
        return pri.name
      }
    }
  }
});

Template.layout.events({
  'click #logout'(){
    Meteor.logout();
    FlowRouter.go('/login');
  },
  'click #changePass'(){
    $('#changePassword').modal('show')
  },
  'click #eyeLama'(){
    var x = document.getElementById("passLama");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  },
  'click #eyeBaru'(){
    var x = document.getElementById("passBaru");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  },
  'click #cangepas'(){
    const pl = $('#passLama')
    const pb = $('#passBaru')
    Accounts.changePassword(pl, pb, (error, result) => {})
    $('#changePassword').modal('hide')
  }
})


Template.registerHelper('numbering', function(param) {
    return param+1;
});
