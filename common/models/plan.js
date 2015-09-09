// require 'server.js' as you would mormally do in any node.js app
//var app = require('../../server/server');
var _ = require('underscore');
var scheduler = require('../../server/lib/scheduler.js');


module.exports = function(Plan) {

  /*
   * custom REST API
   */

  // get planList
  Plan.listPlans = function(request, cb) {

    var app = Plan.app;
    var attendee = app.models.Attendee;

    ownerId =  request.accessToken.userId;

    attendee.find({
      include: 'plan', where: {userId: ownerId}
    },function(err,listPlans){
      if(err) {
        console.log(err);
      }
      cb(err,listPlans);
    });

  }

  Plan.remoteMethod(
    'listPlans',
    {
      accepts: { arg: 'request', type: 'object', http:{source: 'req'}},
      http: {path: '/listPlans', verb: 'get'},
      returns : { arg: 'listPlans', type: 'array'}
    }

  );

  Plan.beforeRemote('create', function(ctx, affectedModelInstance, next) {

    var req = ctx.req;

    if(ctx.req.accessToken) {
      // set FK for subscriber
      req.body.ownerId = req.accessToken.userId;
      next();
    } else {
      next(new Error("must be logged in to create plan"));
    }

  })

  Plan.afterRemote('create', function(ctx, plan, next) {

    scheduler.addPlanJob(plan.id,plan);
    next();

  });

  Plan.observe('before save', function updateAttendeeEmail(ctx, next){

    var app = Plan.app;

    if(ctx.isNewInstance == true) {

      console.log("[before save] Update AttendeeEmail:%s", ctx.instance.__data.attendees);
      var attendees = ctx.instance.__data.attendees;

      var listAttendee = _.pluck(attendees,'tel');

      console.log(listAttendee);

      app.models.Subscriber.find({where: {tel: {inq: _.pluck(attendees,'tel') }}}, function(err, subsObj) {
        if(err) {
            // ToDo: rollback created Plan
            return console.trace(err);
        }

        _.each(subsObj, function(sub){

          for(var i=0; i < attendees.length;i++){
              if (sub.__data.tel == attendees[i].tel) {
                ctx.instance.__data.attendees[i].userId = sub.__data.id;
                ctx.instance.__data.attendees[i].exchangeEmail = sub.__data.exchangeEmail;
                //ctx.instance.__data.attendees[i].exchangePassword = sub.exchangePassword;

              }

          }

          console.log(ctx.instance.__data.attendees);


        });

          //console.log(ctx.instance.__data.attendees);
     });
    } else if(ctx.isNewInstance == false) {
      console.log("[before save] Update plan info:%s", ctx.data);
    } else {
      console.log("[before save] undefined update:%s", ctx.data);
    }

    next();

  })

  // The after save hook is called after a model change was successfully persisted to the datasource.
  Plan.observe('after save', function(ctx,next){

    var app = Plan.app;

    if(ctx.isNewInstance == true) {

      console.log('Saved %s%s', ctx.Model.modelName, ctx.instance.id);

      // before create job
      var attendees = ctx.instance.__data.attendees;

      console.log('[after save]' + attendees);

      attendees.forEach(function(attendee){
        attendee.planId = ctx.instance.id;
      });

      // add members included in the lan to attendee
      app.models.Attendee.create(attendees, function(err,attendObj){
        if(err) {
          // ToDo: rollback created Plan
          return console.log(err);
        }

        console.log(attendObj);
      });

    }else if(ctx.isNewInstance == false) {
      console.log('Updated %s matching', ctx.Model.pluralModelName);

      var attendees = ctx.instance.__data.attendees;

      if(attendees){

          app.models.Attendee.destroyAll({planId: ctx.instance.id},function(err,info){

            if(err) console.stack(err);

            var attendees = ctx.instance.__data.attendees;

            attendees.forEach(function(attendee){
              attendee.planId = ctx.instance.id;
            });

            // add members included in the lan to attendee
            app.models.Attendee.create(attendees, function(err,attendObj){
              if(err) {
                // ToDo: rollback created Plan
                return console.log(err);
              }

              console.log(attendObj);

            });


          });

      }

    } else {
      console.log('undefined update');
    }
    next();

  });


  Plan.observe('after delete', function(ctx,next){

    var app = Plan.app;

    if(ctx.where.id) {

      app.models.Attendee.destroyAll({planId:  ctx.where.id},function(err,info){

        if(err) console.stack(err);

        console.log('deleted Attendees :' + info.count);

      });

      scheduler.removePlanJob(ctx.where.id);


    }

    next();

  })

};
