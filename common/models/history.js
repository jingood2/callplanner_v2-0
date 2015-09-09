
module.exports = function(History) {

  History.observe('after save', function(ctx, next) {

    if(ctx.isNewInstance) {

    } else {

      var app = History.app;
      var Plan = app.models.Plan;
      var endTime = new Date();

      Plan.findById(ctx.currentInstance.__data.planInfo.id,function(err,instance){

        if(err) console.stack(err);

        instance.updateAttributes({callState: 'disconnected'},function(err,instance){

          console.log('log:' + instance);

        });

      });

    }

    next();
  });

};
