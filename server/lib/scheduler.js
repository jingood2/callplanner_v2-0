/**
 *
 * Created by kimjin-young on 2015. 6. 24..
 */

var Agenda = require('agenda');
var request = require('request');
var app = require('../server');
var _ = require('underscore');
//var datasource = require('../datasources.development.js');
//var conf = require('../../global-config');

var connectionOpts = app.get('agendaDB').host + ':' + app.get('agendaDB').port + '/' + app.get('agendaDB').datbase;
var agenda = new Agenda({db: {address: connectionOpts }});

var redis = require('redis');
var client = redis.createClient(app.get('redis').port,app.get('redis').host);

var familyCallServerUrl = "http://" +  app.get('familyCallServer').host  + ":" + app.get('familyCallServer').port + "/FamilyCallCore/FamilyCallHttpServlet";

//var connectionOpts = datasource.mongodb.host + ':' + datasource.mongodb.port + '/' + datasource.mongodb.database;

exports.planStartAt = (function(repeat,scheduledAt) {

    var startDate = scheduledAt;
    var whichday;

    console.log('scheduledAt : %s min:%s hour:%s day:%s', startDate, startDate.getMinutes(),startDate.getHours(),startDate.getDate());

    switch(repeat) {

        case 'none' :
            return scheduledAt;
        case 'daily' :
            format = startDate.getMinutes() + ' ' + startDate.getHours() + ' ' + '* * *';
            console.log(format);
            return format;

        case 'weekly' :
            format = startDate.getMinutes() + ' ' + startDate.getHours() + ' ' + '* * ' + startDate.getDay();
            console.log(format);
            return format;

        case 'monthly' :
            format = startDate.getMinutes() + ' ' + startDate.getHours() + ' ' + startDate.getDate() + ' ' +  '* *';
            console.log(format);
            return format;

        default :
            return scheduledAt;
    }


});


exports.addPlanJob = function(jobName, data) {

    if(data.enabled == false) {
        console.log('disabled planCall id : ' + data.id);
        return;
    }

    agenda.define(jobName, function(job,done){

        var reqBody;
        var ment = '';
        var recordFilename;
        var uuid = require("uuid");
        var historyId = uuid.v4();

        if(job.attrs.data.ment.file)
          ment = 'ments/' + job.attrs.data.ment.container + '/' + job.attrs.data.ment.file;

        recordFilename = new Date().toISOString() + '.wav';
        console.log('recordFile :' + recordFilename);

        _.each(job.attrs.data.__data.attendees, function(attendee){
          attendee.planId = jobName;
        });

        client.lpop('conferenceId',function(err,confId){

          if(err) console.stack(err);

          reqBody = {
            "method" : "INIT",
            "id": "12345678",                      // jobName -> Free conference call number
            "accessNo": confId,
            "historyId": historyId,
            "record": job.attrs.data.record,
            "recordFilename" : recordFilename,
            "callType" : job.attrs.data.callType,
            "greetingAnn" : ment,
            "attendants" : job.attrs.data.__data.attendees };

          console.log(JSON.stringify(reqBody));

          request({
            url: familyCallServerUrl,
            method: "POST",
            json: true,
            body: reqBody
          }, function( error, response, body ) {

            if(error) {
              console.log(error);
            }

            if(!error && response.statusCode == 200) {

              var calledAt = new Date();

              app.models.Plan.updateAll({id:jobName},{callState:'connected', "conferenceNum" : confId},function(err,info){
                if(err) console.log(err);
              });

              app.models.History.create({
                id : historyId,
                planId: job.attrs.data.id,
                pincode : confId,
                plannerId: job.attrs.data.plannerId,
                planInfo : {
                  'title': job.attrs.data.title,
                  'enabled': job.attrs.data.enabled,
                  'callType': job.attrs.data.callType,
                  'record': job.attrs.data.record,
                  'recordFilename' : recordFilename,
                  'ment': job.attrs.data.ment,
                  'scheduledAt': job.attrs.data.scheduledAt,
                  'repeat': job.attrs.data.repeat,
                  'attendees': job.attrs.data.__data.attendees},
                startTime : calledAt,
                result : response.statusCode},function(err,obj) {

                if(err) {
                  console.log(err);
                }

                console.log('Created history');

              }); // create

            }

          });     //request

          done();

        });


    }); // agenda define

    var job = agenda.create(jobName,data);
    job.attrs.type = 'single';

    // run job for planId
    if(data.repeat == 'now') {
        console.log('Fire plan Now!');
        //job.schedule('now');
        job.schedule('now');
    } else {
        if(data.repeat == 'once') {
            job.schedule(this.planStartAt(data.__data.repeat,data.__data.scheduledAt));
        } else {
            job.repeatEvery(this.planStartAt(data.__data.repeat,data.__data.scheduledAt));

        }
   }

   job.save(function(err) {
       if(err) {
       console.log('SaveJob Error :' + err);
       }
   });

    agenda.start();

}

exports.removePlanJob = function(jobName) {

    agenda.cancel({name: jobName}, function(err, numRemoved) {
        if(!err) console.log('[removePlanJob] planJob is removed' + numRemoved);
    });
}

exports.removePlanJobArray = function(jobArray) {

    _.each(jobArray,function(job){
        agenda.cancel({name: job}, function(err, numRemoved) {
            if(!err) console.log('[removePlanJobArray] planJobs are removed' + numRemoved);
        });

    });
}
