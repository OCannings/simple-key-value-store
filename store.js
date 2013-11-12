var Store = function() {
  this._data = {};
  this._listeners = {};
}

Store.prototype = {
  set: function(key, value) {
    this._data[key] = value;
    this._change(key);
  },

  get: function(key) {
    return this._data[key];
  },

  unset: function(key) {
    this._data[key] = null;
    delete this._data[key];
  },

  has: function(key) {
    return this._data.hasOwnProperty(key);
  },

  watch: function(key, callback) {
    if (!this._listeners[key]) {
      this._listeners[key] = [];
    }

    this._listeners[key].push(callback);
    this.has(key) && callback(this.get(key));
  },

  unwatch: function(key, callback) {
    if (callback) {
      var index = this._listeners[key].indexOf(callback);
      if (index !== -1) {
        this._listeners[key].splice(index, 1);
      }
    } else {
      this._listeners[key] = [];
    }
  },

  _change: function(key) {
    if (this._listeners[key] === void 0) {
      return;
    }

    for (var i=0; i<this._listeners[key].length; i++) {
      this._listeners[key][i](this.get(key));
    }
  }
}

module.exports = Store;
