FlowRouter.route( '/', {
  name: 'home',
  action() {
    BlazeLayout.render('layout', {main: 'dashbord'});
  }
});

FlowRouter.route( '/procurement', {
  name: 'procurement',
  action() {
    BlazeLayout.render('layout', {main: 'procurement'});
  }
});

FlowRouter.route( '/profile', {
  name: 'profile',
  action() {
    BlazeLayout.render('layout', {main: 'profile'});
  }
});

FlowRouter.route( '/procurement/newdata', {
  name: 'newprocurement',
  action() {
    BlazeLayout.render('layout', {main: 'newprocurement'});
  }
});

FlowRouter.route( '/procurement/edit/:id', {
  name: 'editprocurement',
  action() {
    BlazeLayout.render('layout', {main: 'newprocurement'});
  }
});

FlowRouter.route( '/workingadvance', {
  name: 'workingadvance',
  action() {
    BlazeLayout.render('layout', {main: 'workingadvance'});
  }
});

FlowRouter.route( '/workingadvance/newdata', {
  name: 'newwoad',
  action() {
    BlazeLayout.render('layout', {main: 'newwoad'});
  }
});

FlowRouter.route( '/workingadvance/edit/:id', {
  name: 'editwoad',
  action() {
    BlazeLayout.render('layout', {main: 'newwoad'});
  }
});

FlowRouter.route( '/data/status', {
  name: 'datastatus',
  action() {
    BlazeLayout.render('layout', {main: 'status'});
  }
});

FlowRouter.route( '/data/commodity', {
  name: 'commodity',
  action() {
    BlazeLayout.render('layout', {main: 'commodity'});
  }
});

FlowRouter.route( '/data/department', {
  name: 'department',
  action() {
    BlazeLayout.render('layout', {main: 'department'});
  }
});

FlowRouter.route( '/data/unit', {
  name: 'unit',
  action() {
    BlazeLayout.render('layout', {main: 'unit'});
  }
});

FlowRouter.route( '/data/entity', {
  name: 'entity',
  action() {
    BlazeLayout.render('layout', {main: 'entity'});
  }
});

FlowRouter.route( '/data/kolom', {
  name: 'kolom',
  action() {
    BlazeLayout.render('layout', {main: 'kolom'});
  }
});

FlowRouter.route( '/data/koloms/:id', {
  name: 'pilihan',
  action() {
    BlazeLayout.render('layout', {main: 'pilihan'});
  }
});

FlowRouter.route( '/akses/privilege', {
  name: 'privilege',
  action() {
    BlazeLayout.render('layout', {main: 'privilege'});
  }
});

FlowRouter.route( '/akses/users', {
  name: 'users',
  action() {
    BlazeLayout.render('layout', {main: 'listUsers'});
  }
});

FlowRouter.route( '/akses/logs', {
  name: 'logakses',
  action() {
    BlazeLayout.render('layout', {main: 'logakses'});
  }
});


FlowRouter.route( '/reset-password/:_id', {
  action: function() {
    console.log( "new Password" );
    Session.set('login','newpassowd');
  },
  name: 'newPassword' 
});

FlowRouter.route( '/ceklogin/', {
  action: function() {
    console.log( "new Password" );
    Session.set('login','newpassowd');
  },
  name: 'cekLogin' 
});

FlowRouter.route( '/login', {
  action: function() {
    console.log( "login page" );
    BlazeLayout.render('login');
  },
  name: 'loginpage' 
});



FlowRouter.triggers.enter([authenticated],{except:["loginpage","newPassword"]});

function authenticated() {
    if (!Meteor.userId()) {
        FlowRouter.go("/login");
    }
}

FlowRouter.triggers.enter([onlyAdmin], {only: ["users","privilege"]});

function authenticated2() {
  setTimeout(function() {
    if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['superadmin','admin','student'], Roles.GLOBAL_GROUP)) {
    } else {
        FlowRouter.go("/login");
    }
  }, 1000);
}

function onlyAdmin() {
  setTimeout(function() {
    if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['superadmin','admin'], Roles.GLOBAL_GROUP)) {
    } else {
        FlowRouter.go("/");
    }
  }, 500);
}