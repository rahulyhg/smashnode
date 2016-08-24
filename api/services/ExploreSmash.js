var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectid = require("mongodb").ObjectId;

var schema = new Schema({

  video: {
    type: String,
    default: ""
  },
  city: [
    {  type: Schema.Types.ObjectId,
     ref: 'City',
     index: true}
   ],
  order: {
    type: String,
    default: ""
  },
  text: {
    type: String,
    default: ""
  },
  banner: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
     type: {
       type: Schema.Types.ObjectId,
       ref: 'Type',
       index: true
   },
  description: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  },
  sublink: {
    type: String,
    default: ""
  },
  isHome: {
    type: Boolean,
    default: "false"
  },
  technology: {
    type: String,
    default: ""
  },
  deal: {
    type: String,
    default: ""
  },
  promotion: {
    type: String,
    default: ""
  },
  currentEvent: {
    type: String,
    default: ""
  },
  pdf: {
    type: String,
    default: ""
  },

  timing: [{
    type: {
      type: String,
      default: ""
    },
    weekendPrice: {
      type: String,
      default: ""
    },
    weekdayPrice: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  }],
  gallery: [{
    image: {
      type: String,
      default: ""
    },
    order: {
      type: String,
      default: ""
    }
  }],
  fb: {
    type: String,
    default: ""
  },
  google: {
    type: String,
    default: ""
  },
  twitter: {
    type: String,
    default: ""
  },
  externallink: {
    type: String,
    default: ""
  },
  gamefor: [{
    type: String,
    default: ""
  }],
  hometext: {
    type: String,
    default: ""
  },
});

module.exports = mongoose.model('ExploreSmash', schema);
var models = {
  saveData: function(data, callback) {
    var exploresmash = this(data);
    exploresmash.timestamp = new Date();
    if (data._id) {
      this.findOneAndUpdate({
        _id: data._id
      }, data).exec(function(err, updated) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else if (updated) {
          callback(null, updated);
        } else {
          callback(null, {});
        }
      });
    } else {
      exploresmash.save(function(err, created) {
        if (err) {
          callback(err, null);
        } else if (created) {
          callback(null, created);
        } else {
          callback(null, {});
        }
      });
    }
  },
  deleteData: function(data, callback) {
    this.findOneAndRemove({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else if (deleted) {
        callback(null, deleted);
      } else {
        callback(null, {});
      }
    });
  },
  getAll: function(data, callback) {
    this.find({}).exec(function(err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (found && found.length > 0) {
        callback(null, found);
      } else {
        callback(null, []);
      }
    });
  },
  getAllExploreSmashByCity: function(data, callback) {
    this.find({
      city:data._id
    }).exec(function(err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (found && found.length > 0) {
        callback(null, found);
      } else {
        callback(null, []);
      }
    });
  },
  getHomeContent: function(data, callback) {
    if(data.id && data.id!='')
    {
      console.log("In if");
      data.id=data.id;
    }
    else{
        console.log("else");
      data.id="577f4d106b78e0bc03724800";
    }
    console.log(data.id);
    this.find({
      isHome: true,
      city:data.id
    }).populate('type').exec(function(err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (found && found.length > 0) {
        callback(null, found);
      } else {
        callback(null, []);
      }
    });
  },

  //side menu

  getAllTiming: function(data, callback) {
    var newreturns = {};
    newreturns.data = [];
    var check = new RegExp(data.search, "i");
    data.pagenumber = parseInt(data.pagenumber);
    data.pagesize = parseInt(data.pagesize);
    var skip = parseInt(data.pagesize * (data.pagenumber - 1));
    async.parallel([
        function(callback) {
          ExploreSmash.aggregate([{
            $match: {
              _id: objectid(data._id)
            }
          }, {
            $unwind: "$timing"
          }, {
            $group: {
              _id: null,
              count: {
                $sum: 1
              }
            }
          }, {
            $project: {
              count: 1
            }
          }]).exec(function(err, result) {
            console.log(result);
            if (result && result[0]) {
              newreturns.total = result[0].count;
              newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
              callback(null, newreturns);
            } else if (err) {
              console.log(err);
              callback(err, null);
            } else {
              callback({
                message: "Count of null"
              }, null);
            }
          });
        },
        function(callback) {
          ExploreSmash.aggregate([{
            $match: {
              _id: objectid(data._id)
            }
          }, {
            $unwind: "$timing"
          }, {
            $group: {
              _id: "_id",
              timing: {
                $push: "$timing"
              }
            }
          }, {
            $project: {
              _id: 0,
              timing: {
                $slice: ["$timing", skip, data.pagesize]
              }
            }
          }]).exec(function(err, found) {
            console.log(found);
            if (found && found.length > 0) {
              newreturns.data = found[0].timing;
              callback(null, newreturns);
            } else if (err) {
              console.log(err);
              callback(err, null);
            } else {
              callback({
                message: "Count of null"
              }, null);
            }
          });
        }
      ],
      function(err, data4) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else if (data4) {
          callback(null, newreturns);
        } else {
          callback(null, newreturns);
        }
      });
  },


  deleteTiming: function(data, callback) {
    ExploreSmash.update({
      "timing._id": data._id
    }, {
      $pull: {
        "timing": {
          "_id": objectid(data._id)
        }
      }
    }, function(err, updated) {
      console.log(updated);
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, updated);
      }
    });

  },

  saveTiming: function(data, callback) {
    var exploresmash = data.exploresmash;
    if (!data._id) {
      ExploreSmash.update({
        _id: exploresmash
      }, {
        $push: {
          timing: data
        }
      }, function(err, updated) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          callback(null, updated);
        }
      });
    } else {
      data._id = objectid(data._id);
      tobechanged = {};
      var attribute = "timing.$.";
      _.forIn(data, function(value, key) {
        tobechanged[attribute + key] = value;
      });
      ExploreSmash.update({
        "timing._id": data._id
      }, {
        $set: tobechanged
      }, function(err, updated) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          callback(null, updated);
        }
      });
    }
  },
  getOneTiming: function(data, callback) {
    // aggregate query
    ExploreSmash.aggregate([{
      $unwind: "$timing"
    }, {
      $match: {
        "timing._id": objectid(data._id)
      }
    }, {
      $project: {
        timing: 1
      }
    }]).exec(function(err, respo) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (respo && respo.length > 0 && respo[0].timing) {
        callback(null, respo[0].timing);
      } else {
        callback({
          message: "No data found"
        }, null);
      }
    });
  },

  getOne: function(data, callback) {
    this.findOne({
      "_id": data._id
    }).exec(function(err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (found && Object.keys(found).length > 0) {
        callback(null, found);
      } else {
        callback(null, {});
      }
    });
  },
  findLimited: function(data, callback) {
    var newreturns = {};
    newreturns.data = [];
    data.pagenumber = parseInt(data.pagenumber);
    data.pagesize = parseInt(data.pagesize);
    async.parallel([
        function(callback) {
          ExploreSmash.count().exec(function(err, number) {
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (number && number !== "") {
              newreturns.total = number;
              newreturns.totalpages = Math.ceil(number / data.pagesize);
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
        },
        function(callback) {
          ExploreSmash.find().populate("type").skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).populate("city", "_id  name", null, {}).lean().exec(function(err, data2) {
            console.log(data2);
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (data2 && data2.length > 0) {
              newreturns.data = data2;
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
        }
      ],
      function(err, data4) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else if (data4) {
          callback(null, newreturns);
        } else {
          callback(null, newreturns);
        }
      });
  },


  //gallery

  //SIDEMENU CAST

  saveGallery: function(data, callback) {
    console.log(data);
    var explore = data.explore;
    if (!data._id) {
      ExploreSmash.update({
        _id: explore
      }, {
        $push: {
          gallery: data
        }
      }, function(err, updated) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          callback(null, updated);
        }
      });
    } else {
      data._id = objectid(data._id);
      tobechanged = {};
      var attribute = "gallery.$.";
      _.forIn(data, function(value, key) {
        tobechanged[attribute + key] = value;
      });
      ExploreSmash.update({
        "gallery._id": data._id
      }, {
        $set: tobechanged
      }, function(err, updated) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          callback(null, updated);
        }
      });
    }
  },

  getAllGallery: function(data, callback) {
    var newreturns = {};
    newreturns.data = [];
    var check = new RegExp(data.search, "i");
    data.pagenumber = parseInt(data.pagenumber);
    data.pagesize = parseInt(data.pagesize);
    var skip = parseInt(data.pagesize * (data.pagenumber - 1));
    async.parallel([
        function(callback) {
          ExploreSmash.aggregate([{
            $match: {
              _id: objectid(data._id)
            }
          }, {
            $unwind: "$gallery"
          }, {
            $group: {
              _id: null,
              count: {
                $sum: 1
              }
            }
          }, {
            $project: {
              count: 1
            }
          }]).exec(function(err, result) {
            console.log(result);
            if (result && result[0]) {
              newreturns.total = result[0].count;
              newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
              callback(null, newreturns);
            } else if (err) {
              console.log(err);
              callback(err, null);
            } else {
              callback({
                message: "Count of null"
              }, null);
            }
          });
        },
        function(callback) {
          ExploreSmash.aggregate([{
            $match: {
              _id: objectid(data._id)
            }
          }, {
            $unwind: "$gallery"
          }, {
            $group: {
              _id: "_id",
              gallery: {
                $push: "$gallery"
              }
            }
          }, {
            $project: {
              _id: 0,
              gallery: {
                $slice: ["$gallery", skip, data.pagesize]
              }
            }
          }]).exec(function(err, found) {
            console.log(found);
            if (found && found.length > 0) {
              newreturns.data = found[0].gallery;
              callback(null, newreturns);
            } else if (err) {
              console.log(err);
              callback(err, null);
            } else {
              callback({
                message: "Count of null"
              }, null);
            }
          });
        }
      ],
      function(err, data4) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else if (data4) {
          callback(null, newreturns);
        } else {
          callback(null, newreturns);
        }
      });
  },


  deleteGallery: function(data, callback) {
    ExploreSmash.update({
      "gallery._id": data._id
    }, {
      $pull: {
        "gallery": {
          "_id": objectid(data._id)
        }
      }
    }, function(err, updated) {
      console.log(updated);
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, updated);
      }
    });

  },
  getOneGallery: function(data, callback) {
    // aggregate query
    ExploreSmash.aggregate([{
      $unwind: "$gallery"
    }, {
      $match: {
        "gallery._id": objectid(data._id)
      }
    }, {
      $project: {
        gallery: 1
      }
    }]).exec(function(err, respo) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (respo && respo.length > 0 && respo[0].gallery) {
        callback(null, respo[0].gallery);
      } else {
        callback({
          message: "No data found"
        }, null);
      }
    });
  },
};

module.exports = _.assign(module.exports, models);
