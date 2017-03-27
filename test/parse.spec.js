const { assert } = require('chai');
const { parse } = require('../lib/index.js');

describe('parse', function() {
  function test(scenario) {
    let requirement = scenario.skip ? it.skip : it;
    requirement(`${JSON.stringify(scenario.s)} -> ${JSON.stringify(scenario.expectations)}`, function() {
      let actual = parse(scenario.s);
      assert.equal(actual.size, scenario.size, 'size should match');
      Object.keys(scenario.expectations).forEach(propertyName => {
        assert.equal(actual.get(propertyName), scenario.expectations[propertyName]);
      });
    });
  }

  describe('Falsey', function() {
    [{
      s: '',
      size: 0,
      expectations: {}
    }, {
      s: 'invalid',
      size: 1,
      expectations: {}
    }].forEach(test);
  });

  describe('Basic', function() {
    [{
      s: 'CN=Simple',
      size: 1,
      expectations: {
        CN: 'Simple'
      }
    }, {
      s: 'CN=Name with spaces',
      size: 1,
      expectations: {
        CN: 'Name with spaces'
      }
    }, {
      s: 'CN=Steve Kille,O=Isode Limited,C=GB',
      size: 3,
      expectations: {
        CN: 'Steve Kille',
        O: 'Isode Limited',
        C: 'GB'
      }
    }, {
      s: 'CN=marshall.t.rose@example.com, O=Dover Beach Consulting, L=Santa Clara,ST=California, C=US',
      size: 5,
      expectations: {
        CN: 'marshall.t.rose@example.com',
        O: 'Dover Beach Consulting',
        L: 'Santa Clara',
        ST: 'California',
        C: 'US'
      }
    }].forEach(test);
  });

  describe('Quoted', function() {
    [{
      s: 'CN="Quoted name"',
      size: 1,
      expectations: {
        CN: 'Quoted name'
      }
    }, {
      s: 'CN=" Leading and trailing spaces "',
      size: 1,
      expectations: {
        CN: ' Leading and trailing spaces '
      }
    }, {
      s: 'CN="Comma, inside"',
      size: 1,
      expectations: {
        CN: 'Comma, inside'
      }
    }, {
      s: 'CN="Crazy !@#$%&*()<>[]{},.?/\\| mess"',
      size: 1,
      expectations: {
        CN: 'Crazy !@#$%&*()<>[]{},.?/\\| mess'
      }
    }].forEach(test);
  });

  describe('Escaped', function() {
    [{
      skip: true,
      s: 'CN=Trailing space\ ',
      size: 1,
      expectations: {
          CN: 'Trailing space ',
      }
    }, {
      skip: true,
      s: 'CN="Quotation \\" mark"',
      size: 1,
      expectations: {
        CN: 'Quotation " mark'
      }
    }].forEach(test);
  });

  describe('Multi-valued', function() {
    [{
      skip: true,
      s: 'OU=Sales+CN=J. Smith,O=Widget Inc.,C=US',
      size: 3,
      expectations: {
        OU: 'Sales',
        '+CN': 'J. Smith',  // FIXME: Is this the expected behavior??
        O: 'Widget Inc.',
        C: 'US'
      }
    }].forEach(test);
  });
});
