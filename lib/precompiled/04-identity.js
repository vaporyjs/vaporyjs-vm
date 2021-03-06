const utils = require('vaporyjs-util')
const BN = utils.BN
const fees = require('vapory-common')
const error = require('../exceptions.js').ERROR
const assert = require('assert')

module.exports = function (opts) {
  assert(opts.data)

  var results = {}
  var data = opts.data

  results.gasUsed = new BN(fees.identityGas.v)
  results.gasUsed.iadd(new BN(fees.identityWordGas.v).imuln(Math.ceil(data.length / 32)))

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    return results
  }

  results.return = data
  results.exception = 1

  return results
}
