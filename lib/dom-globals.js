
var Gate = zone.Gate;


var realSetTimeout = global.setTimeout;
var realClearTimeout = global.clearTimeout;

var realSetInterval = global.setInterval;
var realClearInterval = global.clearInterval;

var realSetImmediate = global.setImmediate;
var realClearImmediate = global.clearImmediate;


global.setTimeout = Gate(function(cb, timeout) {
  var gate = this;

  var handle = realSetTimeout(function() {
    gate.schedule(cb);
    gate.close();
    handle = null;
  }, timeout);

  gate._clear = function() {
    if (!handle)
      return;
    realClearTimeout(handle);
    gate.close();
    handle = null;
  };
});


global.clearTimeout = function(gate) {
  gate._clear();
};


global.setInterval = Gate(function(cb, interval) {
  var gate = this;

  var handle = realSetInterval(function() {
    gate.schedule(cb);
  }, interval);

  gate._clear = function() {
    if (!handle)
      return;

    // Calling realClearTimeout may seem wrong here but it is in fact
    // intentional.
    handle._repeat = false;
    realClearTimeout(handle);

    gate.close();
    handle = null;
  };
});


global.clearInterval = function(gate) {
  gate._clear();
};


global.setImmediate = Gate(function(cb, timeout) {
  var gate = this;

  var handle = realSetImmediate(function() {
    gate.schedule(cb);
    gate.close();
    handle = null;
  }, timeout);

  gate._clear = function() {
    if (!handle)
      return;
    realClearImmediate(handle);
    gate.close();
    handle = null;
  };
}, zone.root);


global.clearImmediate = function(gate) {
  gate._clear();
};