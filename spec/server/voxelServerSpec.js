var test = require('tape');
var sinon = require('sinon');

test('this test passes', function(t) {
    var obj = {};
    var spy = sinon.spy();

    spy(obj);

    t.ok(spy.calledOnce, 'callback is called once');
    t.ok(spy.calledWith(obj), 'callback is called with the object');
    t.end();
});
