var chai = require("chai")
  , sinon = require("sinon")
  , sinonChai = require("sinon-chai")
  , Store = require("./store.js")
  , assert = chai.assert
  , spy = sinon.spy
  , stub = sinon.stub
  , store, callback1, callback2;

chai.should();
chai.use(sinonChai);

describe('Key value store', function(){
  beforeEach(function() {
    store = new Store();
    callback1 = spy();
    callback2 = spy();
  });

  describe('#set()', function(){
    it('should set the value on the data object', function(){
      store.set("name", "Olivander");
      store._data.name.should.equal("Olivander");
    })

    it('should overwrite the value on the data object', function(){
      store.set("name", "Olivander");
      store.set("name", "The Swift");
      store._data.name.should.equal("The Swift");
    })

    it('should support multiple keys and values', function(){
      store.set("first name", "Olivander");
      store.set("last name", "The Swift");
      store._data["first name"].should.equal("Olivander");
      store._data["last name"].should.equal("The Swift");
    })
  });

  describe("#unset()", function() {
    it('should remove the value from the data object', function() {
      store.set("name", "Olivander");
      store.has("name").should.be.true;

      store.unset("name");
      store.has("name").should.be.false;
    });
  });

  describe('#get()', function(){
    it('should get the value on the data object', function(){
      store.set("name", "Olivander");
      store.get("name").should.equal("Olivander");
    });

    it('should return undefined if the value is not set', function(){
      assert.equal(store.get("name"), undefined);
    });
  });

  describe('#has()', function(){
    it('should return true if a value has been set', function(){
      store.set("name", "Olivander");
      store.has("name").should.be.true;
    })

    it('should return false if a value has not been set', function(){
      store.has("name").should.be.false;
    })

    it('should return true even if the value has been set to undefined', function(){
      store.set("name", undefined);
      store.has("name").should.be.true;
    })
  });

  describe('#watch()', function() {
    it('should add the callback to the listeners object', function() {
      store.watch("name", callback1);
      store._listeners.name.should.contain(callback1);
    });

    it('should add multiple callbacks to the listeners object', function() {
      store.watch("name", callback1);
      store.watch("name", callback2);

      store._listeners.name.should.contain(callback1);
      store._listeners.name.should.contain(callback2);
    });

    it('should trigger its callback when the value changes', function() {
      store.watch("name", callback1);
      store.set("name", "Olivander");
      callback1.calledWith("Olivander").should.be.true;
    });

    it('should trigger multiple callbacks if set', function() {
      store.watch("name", callback1);
      store.watch("name", callback2);
      store.set("name", "Olivander");

      callback1.should.have.been.calledWith("Olivander");
      callback2.should.have.been.calledWith("Olivander");
    });

    it('should trigger the callback if the value has already been set', function() {
      store.set("name", "Olivander");
      store.watch("name", callback1);
      callback1.calledWith("Olivander").should.be.true;
    })

    it('should not trigger the callback if the value has not been set', function() {
      store.watch("name", callback1);
      callback1.called.should.be.false;
    })
  });

  describe("#unwatch()", function() {
    it('should remove the callback from the listeners', function() {
      store.watch("name", callback1);
      store.unwatch("name", callback1);

      store.watch("name", callback2);

      store.set("name", "Olivander");

      callback1.should.not.have.been.called;
      callback2.should.have.been.called;
    });

    it('should remove all callbacks from the listeners if no callback is set', function() {
      store.watch("name", callback1);
      store.watch("name", callback2);
      store.unwatch("name");

      store.set("name", "Olivander");

      callback1.should.not.have.been.called;
      callback2.should.not.have.been.called;
    });

  });

})
