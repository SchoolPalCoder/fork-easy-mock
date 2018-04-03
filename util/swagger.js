'use strict'
/**
 * swagger 同步diff工具方法
 * 注释：by tianyu.chen
 * 时间：2018年04月02日15:39:26
 */
/* eslint no-useless-escape: 0 */

const _ = require('lodash')
const path = require('path')
const Mock = require('mockjs')
const swaggerParserMock = require('swagger-parser-mock')

const util = require('./')
const { MockProxy } = require('../proxy')

async function createMock (projectId, swaggerDocs) {
  /* istanbul ignore next */
  const { basePath = '/', paths } = swaggerDocs

  const apis = await MockProxy.find({ project: projectId })

  const newAPIs = []
  const oldAPIs = []
  const promises = []

  for (let url in paths) {
    const fullAPIPath = path.posix.join(basePath, url)
    for (let method in paths[url]) {
      method = method.toLowerCase()

      const operation = paths[url][method]
      const desc = operation.summary || /* istanbul ignore next */ operation.description
      const api = _.find(apis, { method, url: fullAPIPath }) // 同步时判断api是否存在的一句是method 和url 是否一致
      const mode = _.get(operation, 'responses["200"].example') || _.get(operation, 'responses["default"].example') || '{}'
      let responseModel, parameters

      for (let code in operation.responses) {
        const response = operation.responses[code]
        response.example = response.example ? Mock.mock(JSON.parse(response.example)) : ''
      }
      responseModel = JSON.stringify(operation.responses)
      parameters = JSON.stringify(
        _.map(operation.parameters, parameter => {
          parameter.example = parameter.example ? Mock.mock(JSON.parse(parameter.example)) : ''
          return parameter
        })
      )

      // 同步时新增接口做新增操作
      /* istanbul ignore else */
      if (!api) {
        newAPIs.push({
          mode,
          method,
          url: fullAPIPath,
          parameters,
          type: 1, // type接口类型（1:swagger同步的接口)
          response_model: responseModel,
          description: desc,
          project: projectId
        })
        continue
      }

      // 下面是接口的differ操作
      // util.flatten({ cat: 'meow', dog: [{name: 'spot'}] }) => { 'cat': 'meow', 'dog[0]____name': 'spot' }
      let newKeys = Object.keys(util.flatten(JSON.parse(mode)))
      let oldKeys = Object.keys(util.flatten(JSON.parse(api.mode)))

      api.method = method
      api.url = fullAPIPath
      api.type = 1 // type接口类型（1:swagger同步的接口)
      api.description = desc
      api.parameters = parameters
      api.response_model = responseModel
      newKeys = newKeys.filter(key => !/\[[1-9]\d*\]/.test(key))
      oldKeys = oldKeys.filter(key => !/\[[1-9]\d*\]/.test(key)) // [ 'data[0].item', 'data[1].item', 'data[2].item' ] => [ 'data[0]____item' ]
        .map(o => o.replace(/\|[^_\[]*(__)?/g, '$1')) // 'data|1-10.item' => 'data____item' 'data|1-10[0].item' => 'data[0]____item'

      // api.mode = _.xor(newKeys, oldKeys).length > 0 ? /* istanbul ignore next */ mode : api.mode // 同步后接口有变动，以新的接口结构为准，这里的变动主要为对象属性是否有删改，不关心值本身
      // 接口有变动不再替换老的数据，而是将新的结果存入api.confirm_mode
      api.confirm_mode = _.xor(newKeys, oldKeys).length > 0 ? mode : null

      oldAPIs.push(api)
    }
  }

  /* istanbul ignore else */
  if (newAPIs.length > 0) promises.push(MockProxy.newAndSave(newAPIs))

  /* istanbul ignore else */
  if (oldAPIs.length > 0) promises.push(MockProxy.updateMany(oldAPIs))

  return Promise.all(promises)
}

module.exports = class SwaggerUtil {
  static async create (project) {
    const docs = await swaggerParserMock(project.swagger_url)
    return createMock(project.id, docs)
  }
}
