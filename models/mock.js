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
  confirm_mode: {
    type: String,
    default: null // 待确认的mock数据
  },
  type: {
    type: Number,
    default: 0// 接口类型（0：用户自定义新增的接口，1：swagger同步的接口）
  },
  url: String,
  method: String, // 'get' 'post' 'put' 'delete' 'patch'
  parameters: String,
  useMockData: {
    type: Boolean, // 是否使用mock.js数据开关
    default: false
  },
  response_model: String,
  create_at: {
    type: Date,
    default: Date.now
  }
})

schema.index({ project: 1, create_at: -1 })

module.exports = mongoose.model('Mock', schema)
