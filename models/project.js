'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  title: {
    type: String,
    index: true,
    required: true
  },
  revisions: [{
    revisionNumber: Number,
    location: String,
    filesCount: { type: Number, default: 0 },
    checkstyleInfo: { type: Number, default: 0 },
    checkstyleWarning: { type: Number, default: 0 },
    checkstyleError: { type: Number, default: 0 },
    unitTestsCount: { type: Number, default: 0 },
    failedUnitTestsCount: { type: Number, default: 0 },
    erroredUnitTestsCount: { type: Number, default: 0 },
    skippedUnitTestsCount: { type: Number, default: 0 },
    unitTestsTime: { type: Number, default: 0 },
    created: { type: Date, default: Date.now },
  }],
  

  created: Date,
  updated: [Date],
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Pre hook.
 */

ProjectSchema.pre('save', function(next, done){
  if (this.isNew)
    this.created = Date.now();

  this.updated.push(Date.now());

  next();
});

/**
 * Statics
 */
ProjectSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('creator', 'username').exec(cb);
  }
};

/**
 * Methods
 */

ProjectSchema.statics.findByTitle = function (title, callback) {
  return this.find({ title: title }, callback);
}

ProjectSchema.methods.expressiveQuery = function (creator, date, callback) {
  return this.find('creator', creator).where('date').gte(date).run(callback);
}


/**
 * Define model.
 */

mongoose.model('Project', ProjectSchema);