/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/mongoose-sequence/index.js":
/*!*************************************************!*\
  !*** ./node_modules/mongoose-sequence/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/sequence */ "./node_modules/mongoose-sequence/lib/sequence.js");


/***/ }),

/***/ "./node_modules/mongoose-sequence/lib/sequence.js":
/*!********************************************************!*\
  !*** ./node_modules/mongoose-sequence/lib/sequence.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(/*! lodash */ "lodash"),
  async = __webpack_require__(/*! async */ "async"),
  mongoose = __webpack_require__(/*! mongoose */ "mongoose"),
  SequenceArchive = __webpack_require__(/*! ./sequence_archive */ "./node_modules/mongoose-sequence/lib/sequence_archive.js"),
  sequenceArchive = SequenceArchive.getSingleton(),
  Sequence;

module.exports = function (connection) {
  if (arguments.length !== 1) {
    throw new Error('Please, pass mongoose while requiring mongoose-sequence: https://github.com/ramiel/mongoose-sequence#requiring');
  }

  /**
   * Sequence plugin constructor
   * @class Sequence
   * @param {string} schema  the schema object
   * @param {object} options A set of options for this plugin
   * @param {string} [options.inc_field='_id'] The field to increment
   * @param {string} [options.id='same as inc_field'] The id of this sequence. Mandatory only if the sequence use reference fields
   * @param {string|string[]} [options.reference_fields=['_id']] Any field to consider as reference for the counter
   * @param {boolean} [options.disable_hooks] If true any hook will be disabled
   * @param {string} [options.collection_name='counters'] A name for the counter collection
   * @throws {Error} If id is missing for counter which referes other fields
   * @throws {Error} If A counter collide with another because of same id
   */
  Sequence = function (schema, options) {
    var defaults = {
      id: null,
      inc_field: '_id',
      reference_fields: null,
      disable_hooks: false,
      collection_name: 'counters'
    };
    options = options || {};
    _.defaults(options, defaults);

    if (_.isNull(options.reference_fields)) {
      options.reference_fields = options.inc_field;
      this._useReference = false;
    } else {
      this._useReference = true;
    }

    options.reference_fields = _.isArray(options.reference_fields) ? options.reference_fields : [options.reference_fields];
    options.reference_fields = options.reference_fields.sort();

    if (this._useReference === true && _.isNull(options.id)) {
      throw new Error('Cannot use reference fields without specifying an id');
    } else {
      options.id = options.id || options.inc_field;
    }

    this._options = options;
    this._schema = schema;
    this._counterModel = null;
  };

  /**
   * Create an instance for a sequence
   *
   * @method     getInstance
   * @param      {Object}    schema   A mongoose Schema
   * @param      {object}    options  Options as accepted by A sequence
   *                                  constructor
   * @return     {Sequence}  A sequence
   *
   * @static
   */
  Sequence.getInstance = function (schema, options) {
    var sequence = new Sequence(schema, options),
      id = sequence.getId();

    if (sequenceArchive.existsSequence(id)) {
      throw new Error('Counter already defined for field "' + id + '"');
    }
    sequence.enable();
    sequenceArchive.addSequence(id, sequence);
    return sequence;
  };

  /**
   * Enable the sequence creating all the necessary models
   *
   * @method     enable
   */
  Sequence.prototype.enable = function () {
    this._counterModel = this._createCounterModel();

    this._createSchemaKeys();

    this._setMethods();

    if (this._options.disable_hooks === false) {
      this._setHooks();
    }
  };

  /**
   * Return the id of the sequence
   *
   * @method     getId
   * @return     {String}  The id of the sequence
   */
  Sequence.prototype.getId = function () {
    return this._options.id;
  };

  /**
   * Given a mongoose document, retrieve the values of the fields set as reference
   * for the sequence.
   *
   * @method     _getCounterReferenceField
   * @param      {object}  doc     A mongoose document
   * @return     {Array}   An array of strings which represent the value of the
   *                       reference
   */
  Sequence.prototype._getCounterReferenceField = function (doc) {
    var reference = {};

    if (this._useReference === false) {
      reference = null;
    } else {
      for (var i in this._options.reference_fields) {
        reference[this._options.reference_fields[i]] = doc[this._options.reference_fields[i]];
        // reference.push(JSON.stringify(doc[this._options.reference_fields[i]]));
      }
    }

    return reference;
  };

  /**
   * Enrich the schema with keys needed by this sequence
   *
   * @method     _createSchemaKeys
   */
  Sequence.prototype._createSchemaKeys = function () {
    var schemaKey = this._schema.path(this._options.inc_field);
    if (_.isUndefined(schemaKey)) {
      var fieldDesc = {};
      fieldDesc[this._options.inc_field] = 'Number';
      this._schema.add(fieldDesc);
    } else {
      if (schemaKey.instance !== 'Number') {
        throw new Error('Auto increment field already present and not of type "Number"');
      }
    }
  };

  /**
   * Create a model for the counter handled by this sequence
   *
   * @method     _createCounterModel
   * @return     {Mongoose~Model}  A mongoose model
   */
  Sequence.prototype._createCounterModel = function () {
    var CounterSchema;

    CounterSchema = mongoose.Schema(
      {
        id: { type: String, required: true },
        reference_value: { type: mongoose.Schema.Types.Mixed, required: true },
        seq: { type: Number, default: 0, required: true }
      },
      {
        collection: this._options.collection_name,
        validateBeforeSave: false,
        versionKey: false,
        _id: false
      }
    );

    CounterSchema.index({ id: 1, reference_value: 1 }, { unique: true });

    /* Unused. Enable when is useful */
    // CounterSchema.static('getNext', function(id, referenceValue, callback) {
    //     this.findOne({ id: id, reference_value: referenceValue }, callback);
    // });

    return connection.model('Counter_' + this._options.id, CounterSchema);
  };

  /**
   * Set and handler for some hooks on the schema referenced by this sequence
   *
   * @method     _setHooks
   */
  Sequence.prototype._setHooks = function () {
    this._schema.pre('save', true, (function (sequence) {
      return function (next, done) {
        var doc = this;
        next();
        if (!doc.isNew) {
          return done();
        }
        sequence._setNextCounter(doc, function (err, seq) {
          if (err) return done(err);
          doc[sequence._options.inc_field] = seq;
          done();
        }.bind(doc));
      };
    })(this));
  };

  /**
   * Set some useful methods on the schema
   *
   * @method     _setMethods
   */
  Sequence.prototype._setMethods = function () {
    // this._schema.static('getNext', function(id, referenceValue, callback) {
    //     this._counterModel.getNext(id, referenceValue, function(err, counter) {
    //         if (err) return callback(err);
    //         return callback(null, ++counter.seq);
    //     });
    // }.bind(this));

    this._schema.method('setNext', function (id, callback) {
      var sequence = sequenceArchive.getSequence(id);

      if (_.isNull(sequence)) {
        return callback(new Error('Trying to increment a wrong sequence using the id ' + id));
      }
      // sequence = sequence.sequence;

      sequence._setNextCounter(this, function (err, seq) {
        if (err) return callback(err);
        this[sequence._options.inc_field] = seq;
        this.save(callback);
      }.bind(this));
    });

    this._schema.static('counterReset', function (id, reference, callback) {
      var sequence = sequenceArchive.getSequence(id);
      sequence._resetCounter(id, reference, callback);
    }.bind(this));
  };

  Sequence.prototype._resetCounter = function (id, reference, callback) {
    var condition = { id: id };
    if (reference instanceof Function) {
      callback = reference;
    } else {
      condition.reference_value = this._getCounterReferenceField(reference);
    }
    this._counterModel.updateMany(condition, { $set: { seq: 0 } }, null, callback);
  };

  /**
   * Utility function to increment a counter in a transaction
   *
   * @method     _setNextCounter
   * @param      {object}    doc       A mongoose model which need to receive the
   *                                   increment
   * @param      {Function}  callback  Called with the sequence counter
   */
  Sequence.prototype._setNextCounter = function (doc, callback) {

    var retriable = function (callback) {
      var id = this.getId();
      var referenceValue = this._getCounterReferenceField(doc);
      this._counterModel.findOneAndUpdate(
        { id: id, reference_value: referenceValue },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
        function (err, counter) {
          if (err) return callback(err);
          return callback(null, counter.seq);
        }

      );
    };

    async.retry(0, retriable.bind(this), callback);

  };


  return Sequence.getInstance;
};


/***/ }),

/***/ "./node_modules/mongoose-sequence/lib/sequence_archive.js":
/*!****************************************************************!*\
  !*** ./node_modules/mongoose-sequence/lib/sequence_archive.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(/*! lodash */ "lodash"),
  singleton = null,
  SequenceArchive;
/**
 * Instantiate a new sequence archive
 * @classdesc  Store definied sequences
 *
 * @class
 */
SequenceArchive = function() {
  this.sequences = [];
};

/**
 * Add a new sequence to the archive
 *
 * @method     addSequence
 * @param      {array}          id        The id of the sequence
 * @param      {Autoincrement}  sequence  A sequence
 */
SequenceArchive.prototype.addSequence = function(id, sequence) {
  if (!this.existsSequence(id)) {
    this.sequences.push(
      {
        id: id,
        sequence: sequence
      }
        );
  }
};

/**
 * Get a sequence by id
 *
 * @method     getSequence
 * @param      {string}  id      An id for the sequence
 * @return     {object|null}  Return the found sequence or null
 */
SequenceArchive.prototype.getSequence = function(id) {
  var seq;
  for (var i = 0, len = this.sequences.length; i < len; i++) {
    seq = this.sequences[i];
    if (_.isEqual(seq.id, id))
      return seq.sequence;
  }

  return null;
};

/**
 * Check if a sequence already exists
 *
 * @method     existsSequence
 * @param      {string}   id      The id of the sequence to look for
 * @return     {boolean}  
 */
SequenceArchive.prototype.existsSequence = function(id) {
  var seq;
  for (var i = 0, len = this.sequences.length; i < len; i++) {
    seq = this.sequences[i];
    if (_.isEqual(seq.id, id))
      return true;
  }

  return false;
};

/**
 * Get a singleton SequenceArchive
 *
 * @method     getSingleton
 * @return     {SequenceArchive}  A unique instance of SequenceArchive
 */
SequenceArchive.getSingleton = function() {
  if (!singleton) {
    singleton = new SequenceArchive();
  }

  return singleton;
};

module.exports = SequenceArchive;


/***/ }),

/***/ "./src/config/dev.js":
/*!***************************!*\
  !*** ./src/config/dev.js ***!
  \***************************/
/*! exports provided: config */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
const config = {
  dbUrl: 'mongodb://localhost:27017/user-dashboard',
  secrets: {
    jwt: 'dashboardapp',
    jwtExp: 1000
  }
};

/***/ }),

/***/ "./src/config/index.js":
/*!*****************************!*\
  !*** ./src/config/index.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

const env = "development" || false;
const baseConfig = {
  port: '3000'
};
let envConfig = {};

switch (env) {
  case 'dev':
  case 'development':
    envConfig = __webpack_require__(/*! ./dev */ "./src/config/dev.js").config;
    break;

  default:
    envConfig = __webpack_require__(/*! ./dev */ "./src/config/dev.js").config;
}

/* harmony default export */ __webpack_exports__["default"] = (Object(lodash__WEBPACK_IMPORTED_MODULE_0__["merge"])(baseConfig, envConfig));

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./server */ "./src/server.js");

Object(_server__WEBPACK_IMPORTED_MODULE_0__["start"])();

/***/ }),

/***/ "./src/resources/dashboard/dashboard.controller.js":
/*!*********************************************************!*\
  !*** ./src/resources/dashboard/dashboard.controller.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dbOperation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/dbOperation */ "./src/utils/dbOperation.js");
/* harmony import */ var _dashboard_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dashboard.model */ "./src/resources/dashboard/dashboard.model.js");


/* harmony default export */ __webpack_exports__["default"] = (Object(_utils_dbOperation__WEBPACK_IMPORTED_MODULE_0__["crudService"])(_dashboard_model__WEBPACK_IMPORTED_MODULE_1__["Dashbard"]));

/***/ }),

/***/ "./src/resources/dashboard/dashboard.model.js":
/*!****************************************************!*\
  !*** ./src/resources/dashboard/dashboard.model.js ***!
  \****************************************************/
/*! exports provided: Dashbard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dashbard", function() { return Dashbard; });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mongoose_sequence__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mongoose-sequence */ "./node_modules/mongoose-sequence/index.js");
/* harmony import */ var mongoose_sequence__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mongoose_sequence__WEBPACK_IMPORTED_MODULE_1__);


const AutoIncrement = mongoose_sequence__WEBPACK_IMPORTED_MODULE_1__(mongoose__WEBPACK_IMPORTED_MODULE_0___default.a);
let dashboardSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  name: String,
  items: [],
  created_by: {
    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.SchemaTypes.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true
});
dashboardSchema.plugin(AutoIncrement, {
  inc_field: 'id'
});
const Dashbard = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('dashboard', dashboardSchema);

/***/ }),

/***/ "./src/resources/dashboard/dashboard.router.js":
/*!*****************************************************!*\
  !*** ./src/resources/dashboard/dashboard.router.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dashboard_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dashboard.controller */ "./src/resources/dashboard/dashboard.controller.js");


const router = Object(express__WEBPACK_IMPORTED_MODULE_0__["Router"])(); // /api/list

router.route('/').get(_dashboard_controller__WEBPACK_IMPORTED_MODULE_1__["default"].getAll).post(_dashboard_controller__WEBPACK_IMPORTED_MODULE_1__["default"].createOne);
/* harmony default export */ __webpack_exports__["default"] = (router);

/***/ }),

/***/ "./src/resources/user/user.controller.js":
/*!***********************************************!*\
  !*** ./src/resources/user/user.controller.js ***!
  \***********************************************/
/*! exports provided: me, updateMe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "me", function() { return me; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateMe", function() { return updateMe; });
/* harmony import */ var _user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user.model */ "./src/resources/user/user.model.js");

const me = (req, res) => {
  res.status(200).json({
    data: req.user
  });
};
const updateMe = async (req, res) => {
  try {
    const user = await _user_model__WEBPACK_IMPORTED_MODULE_0__["User"].findByIdAndUpdate(req.user._id, req.body, {
      new: true
    }).lean().exec();
    res.status(200).json({
      data: user
    });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

/***/ }),

/***/ "./src/resources/user/user.model.js":
/*!******************************************!*\
  !*** ./src/resources/user/user.model.js ***!
  \******************************************/
/*! exports provided: User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ "bcryptjs");
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);


let Schema = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema;
const userSchema = new Schema({
  name: String,
  password: String,
  email: String,
  settings: {
    theme: {
      type: String,
      required: true,
      default: 'light'
    }
  }
}, {
  timestamps: true
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  console.log("pass", this.password);
  bcryptjs__WEBPACK_IMPORTED_MODULE_1___default.a.genSalt(8, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcryptjs__WEBPACK_IMPORTED_MODULE_1___default.a.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      this.password = hash;
      next();
    });
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcryptjs__WEBPACK_IMPORTED_MODULE_1___default.a.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

const User = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('user', userSchema);

/***/ }),

/***/ "./src/resources/user/user.router.js":
/*!*******************************************!*\
  !*** ./src/resources/user/user.router.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _user_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./user.controller */ "./src/resources/user/user.controller.js");


const router = Object(express__WEBPACK_IMPORTED_MODULE_0__["Router"])();
router.get('/', _user_controller__WEBPACK_IMPORTED_MODULE_1__["me"]);
router.put('/', _user_controller__WEBPACK_IMPORTED_MODULE_1__["updateMe"]);
/* harmony default export */ __webpack_exports__["default"] = (router);

/***/ }),

/***/ "./src/server.js":
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
/*! exports provided: app, start */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "app", function() { return app; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "start", function() { return start; });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cors */ "cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_dbConnection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/dbConnection */ "./src/utils/dbConnection.js");
/* harmony import */ var _resources_user_user_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./resources/user/user.router */ "./src/resources/user/user.router.js");
/* harmony import */ var _utils_auth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/auth */ "./src/utils/auth.js");
/* harmony import */ var _resources_dashboard_dashboard_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./resources/dashboard/dashboard.router */ "./src/resources/dashboard/dashboard.router.js");







const app = express__WEBPACK_IMPORTED_MODULE_0___default()();
app.use(cors__WEBPACK_IMPORTED_MODULE_2___default()());
app.use(Object(body_parser__WEBPACK_IMPORTED_MODULE_1__["json"])());
app.use(Object(body_parser__WEBPACK_IMPORTED_MODULE_1__["urlencoded"])({
  extended: true
})); // app.use('/', (request, response)=>{
// response.send({'message':"hello"})
// })

app.post('/signup', _utils_auth__WEBPACK_IMPORTED_MODULE_5__["signup"]);
app.post('/signin', _utils_auth__WEBPACK_IMPORTED_MODULE_5__["signin"]);
app.use('/api', _utils_auth__WEBPACK_IMPORTED_MODULE_5__["protect"]);
app.use('/api/user', _resources_user_user_router__WEBPACK_IMPORTED_MODULE_4__["default"]);
app.use('/api/dashboard', _resources_dashboard_dashboard_router__WEBPACK_IMPORTED_MODULE_6__["default"]);
const start = async () => {
  debugger;

  try {
    await Object(_utils_dbConnection__WEBPACK_IMPORTED_MODULE_3__["connect"])();
    app.listen(3000, () => {
      console.log("server is running.....");
    });
  } catch (e) {
    console.log(e);
  }
};

/***/ }),

/***/ "./src/utils/auth.js":
/*!***************************!*\
  !*** ./src/utils/auth.js ***!
  \***************************/
/*! exports provided: newToken, verifyToken, signup, signin, protect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "newToken", function() { return newToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "verifyToken", function() { return verifyToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "signup", function() { return signup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "signin", function() { return signin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "protect", function() { return protect; });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/config/index.js");
/* harmony import */ var _resources_user_user_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../resources/user/user.model */ "./src/resources/user/user.model.js");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);



const newToken = user => {
  console.log(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default.a);
  return jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default.a.sign({
    id: user.id
  }, _config__WEBPACK_IMPORTED_MODULE_0__["default"].secrets.jwt, {
    expiresIn: _config__WEBPACK_IMPORTED_MODULE_0__["default"].secrets.jwtExp
  });
};
const verifyToken = token => new Promise((resolve, reject) => {
  jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default.a.verify(token, _config__WEBPACK_IMPORTED_MODULE_0__["default"].secrets.jwt, (err, payload) => {
    if (err) return reject(err);
    resolve(payload);
  });
});
const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: 'need email and password'
    });
  }

  try {
    debugger;
    console.log('.......', _resources_user_user_model__WEBPACK_IMPORTED_MODULE_1__["User"]);
    const user = await _resources_user_user_model__WEBPACK_IMPORTED_MODULE_1__["User"].create(req.body);
    const token = newToken(user);
    return res.status(201).send({
      token
    });
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
};
const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: 'need email and password'
    });
  }

  const invalid = {
    message: 'Invalid email and passoword combination'
  };

  try {
    const user = await _resources_user_user_model__WEBPACK_IMPORTED_MODULE_1__["User"].findOne({
      email: req.body.email
    }).select('email password').exec();
    console.log(user, "founddd");

    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    const token = newToken(user);
    return res.status(201).send({
      token
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};
const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end();
  }

  const token = bearer.split('Bearer ')[1].trim();
  let payload;

  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(401).end();
  }

  const user = await _resources_user_user_model__WEBPACK_IMPORTED_MODULE_1__["User"].findById(payload.id).select('-password').lean().exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};

/***/ }),

/***/ "./src/utils/dbConnection.js":
/*!***********************************!*\
  !*** ./src/utils/dbConnection.js ***!
  \***********************************/
/*! exports provided: connect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "connect", function() { return connect; });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ "./src/config/index.js");


const connect = async () => {
  mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.connect(_config__WEBPACK_IMPORTED_MODULE_1__["default"].dbUrl, {
    useNewUrlParser: true
  });
  return mongoose__WEBPACK_IMPORTED_MODULE_0___default.a;
};

/***/ }),

/***/ "./src/utils/dbOperation.js":
/*!**********************************!*\
  !*** ./src/utils/dbOperation.js ***!
  \**********************************/
/*! exports provided: getOne, getAll, createOne, crudService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOne", function() { return getOne; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAll", function() { return getAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createOne", function() { return createOne; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "crudService", function() { return crudService; });
const getOne = model => async (req, res) => {
  try {
    const doc = await model.findOne({
      createdBy: req.user._id,
      _id: req.params.id
    }).lean().exec();

    if (!doc) {
      return res.status(400).end;
    }

    res.status(200).json({
      data: doc
    });
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
};
const getAll = model => async (req, res) => {
  try {
    const doc = await model.findOne({
      created_by: req.user._id
    }).lean().exec();

    if (!doc) {
      return res.status(400).end;
    }

    res.status(200).json({
      data: doc
    });
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
};
const createOne = model => async (req, res) => {
  const created_by = req.user._id;

  try {
    const doc = await model.create({ ...req.body,
      created_by
    });
    res.status(201).json({
      data: doc
    });
  } catch (e) {
    console.log(e);
    res.status(400).end;
  }
};
const crudService = model => ({
  getOne: getOne(model),
  getAll: getAll(model),
  createOne: createOne(model)
});

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/index.js */"./src/index.js");


/***/ }),

/***/ "async":
/*!************************!*\
  !*** external "async" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("async");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcryptjs");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map