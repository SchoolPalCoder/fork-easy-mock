'use strict'
/* 从mongoDB对mock数据的增删改查操作 */
const { Mock } = require('../models')

module.exports = class MockProxy {
  static newAndSave (docs) {
    return Mock.insertMany(docs)
  }

  static getById (mockId) {
    return Mock.findById(mockId).populate('project')
  }

  static find (query, opt) {
    return Mock.find(query, {}, opt).populate('project')
  }

  static findOne (query, opt) {
    return Mock.findOne(query, {}, opt).populate('project')
  }

  static updateById (mock) {
    return Mock.update({
      _id: mock.id
    }, {
      $set: {
        url: mock.url,
        mode: mock.mode,
        parameters: mock.parameters,
        response_model: mock.response_model,
        description: mock.description,
        method: mock.method,

        type: mock.type,
        confirm_mode: mock.confirm_mode,
        useMockData: mock.useMockData
      }
    })
  }

  static updateMany (docs) {
    return Promise.all(docs.map(item => this.updateById(item)))
  }

  static delByIds (mockIds) {
    return Mock.remove({
      _id: {
        $in: mockIds
      }
    })
  }

  static del (query) {
    return Mock.remove(query)
  }
}
