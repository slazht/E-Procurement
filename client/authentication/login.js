import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Accounts } from 'meteor/accounts-base';

import './login.html';
import './register.html';

Template.login.onCreated(function () {
    Session.set('renderSignIn', false);
    Session.set('email', "");
    Session.set('login','login');
    var orUrl = document.URL.split('reset-password/');
	if (orUrl.length>1){
		Session.set('login','newpassowd');
	}
});

Template.login.helpers({
    loginOrResgister(pilih){
    	if (pilih==Session.get('login')){
    		return true;
    	}else {
    		return false;
    	}
    }
});

Template.loginUser.helpers({
	renderSignIn(){
      	return Session.get('renderSignIn');
    },
});

Template.loginUser.events({
  	'click .register-baru'(event) {
  		Session.set('login','register');
  	},
  	'click .resetAja'(event){
  		Session.set('login','reset');
  	},
  	'submit .loginFormNexts'(event){
  		event.preventDefault();
  		Session.set('email',event.target.email.value);
  		var emai = Meteor.call('akunCekemail', event.target.email.value, function(error, result){
		   if(result){
		   		Session.set('renderSignIn',true);
		      	return result;
		   }else{
		   		alert('Email Not Found');
		   }
  		});

  	},
  	'submit .loginFormNext'(event){
  		event.preventDefault();
  		Meteor.loginWithPassword(event.target.email.value, event.target.password.value, function(err,result){
  			if (err){
  				alert(err.reason);
  			}
        //Meteor.call('addTokenCross','sfafwecwefaw');
        FlowRouter.go('home');
  		});
  		console.log('login');
  	}
});

Template.register.events({
  'click .login-aja'(event) {
  		Session.set('login','login');
  },
  'submit form': function(event){
        event.preventDefault();
        var namevar = event.target.name.value;
        var emailvar = event.target.email.value;
        var passwordvar = event.target.password.value;
        var dep = event.target.departement.value;
        Accounts.createUser({
        	username:namevar,
            email: emailvar,
            password: passwordvar,
            profile: { departement:dep  }
        },function(error,success){
        	if (error){
        		alert(error.reason);
            FlowRouter.go('/login');
        	}else{
            FlowRouter.go('home');
          }
          Session.set('login','login');
        });
    },

});

Template.resetPassword.events({
  'submit form': function(event){
        event.preventDefault();
        var emailvar = event.target.email.value;
        //console.log(emailvar);
        Meteor.call('sendMailResetPassword',emailvar,function(err,result){
        	if(err){
        		alert(err);
        	}else{
        		alert('Email Send !');
        		Session.set('login','login');
        	}
        });
    },
    'click .login-aja'(event) {
  		Session.set('login','login');
  	},

});

Template.newPasswordReset.events({
  'submit form': function(event){
        event.preventDefault();
        var pass1 = event.target.password1.value;
        var pass2 = event.target.password2.value;
        if (pass1==pass2){
        	console.log(pass1);
        	token = document.URL.split('reset-password/');
        	Accounts.resetPassword(token[1], pass1, function(err,res){
        		if(err){
        			alert(err);
        		}else{
        			console.log(res);
        			FlowRouter.go( '/' );
        		}
        	})
        }else{
        	alert('Password Tidak Sama !');
        }
    },
    'click .login-aja'(event) {
  		Session.set('login','login');
  	},
});