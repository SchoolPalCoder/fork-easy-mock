'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

// 定义一个插入到mongoDB的接口数据结构
const schema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  description: String,
  mode: String, // 接口mock数据
  url: String,
  method: String, // 'get' 'post' 'put' 'delete' 'patch'
  parameters: String,
  useMockData: Boolean, // 是否使用mock.js数据开关
  response_model: String,
  create_at: {
    type: Date,
    default: Date.now
  }
})

schema.index({ project: 1, create_at: -1 })

module.exports = mongoose.model('Mock', schema)
