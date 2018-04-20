<style>
.jsondiffpatch-delta {
    font-family: 'Bitstream Vera Sans Mono', 'DejaVu Sans Mono', Monaco, Courier, monospace;
    font-size: 12px;
    margin: 0;
    padding: 0 0 0 12px;
    display: inline-block;
  }
  .jsondiffpatch-delta pre {
    font-family: 'Bitstream Vera Sans Mono', 'DejaVu Sans Mono', Monaco, Courier, monospace;
    font-size: 12px;
    margin: 0;
    padding: 0;
    display: inline-block;
  }
  ul.jsondiffpatch-delta {
    list-style-type: none;
    padding: 0 0 0 20px;
    margin: 0;
  }
  .jsondiffpatch-delta ul {
    list-style-type: none;
    padding: 0 0 0 20px;
    margin: 0;
  }
  .jsondiffpatch-added .jsondiffpatch-property-name,
  .jsondiffpatch-added .jsondiffpatch-value pre,
  .jsondiffpatch-modified .jsondiffpatch-right-value pre,
  .jsondiffpatch-textdiff-added {
    background: #bbffbb;
  }
  .jsondiffpatch-deleted .jsondiffpatch-property-name,
  .jsondiffpatch-deleted pre,
  .jsondiffpatch-modified .jsondiffpatch-left-value pre,
  .jsondiffpatch-textdiff-deleted {
    background: #ffbbbb;
    text-decoration: line-through;
  }
  .jsondiffpatch-unchanged,
  .jsondiffpatch-movedestination {
    color: gray;
  }
  .jsondiffpatch-unchanged,
  .jsondiffpatch-movedestination > .jsondiffpatch-value {
    transition: all 0.5s;
    -webkit-transition: all 0.5s;
    overflow-y: hidden;
  }
  .jsondiffpatch-unchanged-showing .jsondiffpatch-unchanged,
  .jsondiffpatch-unchanged-showing .jsondiffpatch-movedestination > .jsondiffpatch-value {
    max-height: 100px;
  }
  .jsondiffpatch-unchanged-hidden .jsondiffpatch-unchanged,
  .jsondiffpatch-unchanged-hidden .jsondiffpatch-movedestination > .jsondiffpatch-value {
    max-height: 0;
  }
  .jsondiffpatch-unchanged-hiding .jsondiffpatch-movedestination > .jsondiffpatch-value,
  .jsondiffpatch-unchanged-hidden .jsondiffpatch-movedestination > .jsondiffpatch-value {
    display: block;
  }
  .jsondiffpatch-unchanged-visible .jsondiffpatch-unchanged,
  .jsondiffpatch-unchanged-visible .jsondiffpatch-movedestination > .jsondiffpatch-value {
    max-height: 100px;
  }
  .jsondiffpatch-unchanged-hiding .jsondiffpatch-unchanged,
  .jsondiffpatch-unchanged-hiding .jsondiffpatch-movedestination > .jsondiffpatch-value {
    max-height: 0;
  }
  .jsondiffpatch-unchanged-showing .jsondiffpatch-arrow,
  .jsondiffpatch-unchanged-hiding .jsondiffpatch-arrow {
    display: none;
  }
  .jsondiffpatch-value {
    display: inline-block;
  }
  .jsondiffpatch-property-name {
    display: inline-block;
    padding-right: 5px;
    vertical-align: top;
  }
  .jsondiffpatch-property-name:after {
    content: ': ';
  }
  .jsondiffpatch-child-node-type-array > .jsondiffpatch-property-name:after {
    content: ': [';
  }
  .jsondiffpatch-child-node-type-array:after {
    content: '],';
  }
  div.jsondiffpatch-child-node-type-array:before {
    content: '[';
  }
  div.jsondiffpatch-child-node-type-array:after {
    content: ']';
  }
  .jsondiffpatch-child-node-type-object > .jsondiffpatch-property-name:after {
    content: ': {';
  }
  .jsondiffpatch-child-node-type-object:after {
    content: '},';
  }
  div.jsondiffpatch-child-node-type-object:before {
    content: '{';
  }
  div.jsondiffpatch-child-node-type-object:after {
    content: '}';
  }
  .jsondiffpatch-value pre:after {
    content: ',';
  }
  li:last-child > .jsondiffpatch-value pre:after,
  .jsondiffpatch-modified > .jsondiffpatch-left-value pre:after {
    content: '';
  }
  .jsondiffpatch-modified .jsondiffpatch-value {
    display: inline-block;
  }
  .jsondiffpatch-modified .jsondiffpatch-right-value {
    margin-left: 5px;
  }
  .jsondiffpatch-moved .jsondiffpatch-value {
    display: none;
  }
  .jsondiffpatch-moved .jsondiffpatch-moved-destination {
    display: inline-block;
    background: #ffffbb;
    color: #888;
  }
  .jsondiffpatch-moved .jsondiffpatch-moved-destination:before {
    content: ' => ';
  }
  ul.jsondiffpatch-textdiff {
    padding: 0;
  }
  .jsondiffpatch-textdiff-location {
    color: #bbb;
    display: inline-block;
    min-width: 60px;
  }
  .jsondiffpatch-textdiff-line {
    display: inline-block;
  }
  .jsondiffpatch-textdiff-line-number:after {
    content: ',';
  }
  .jsondiffpatch-error {
    background: red;
    color: white;
    font-weight: bold;
  }
  
</style>


<template>
  <transition name="fade">
    <div class="em-editor" v-show="value.show">
      <div class="em-editor__editor">
        <div ref="codeEditor"></div>
      </div>
      <div class="panel-info">
        <em-spots :size="10"></em-spots>
        <div class="wrapper">
          <h2>{{isEdit ? $t('p.detail.editor.title[0]') : $t('p.detail.editor.title[1]')}}</h2>
          <div class="em-editor__form">
            <Form label-position="top">
              <Form-item label="Method">
                <i-select v-model="temp.method">
                  <Option v-for="item in methods" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </i-select>
              </Form-item>
              <Form-item label="URL">
                <i-input v-model="temp.url">
                  <span slot="prepend">/</span>
                </i-input>
              </Form-item>
              <Form-item :label="$t('p.detail.columns[0]')">
                <i-input v-model="temp.description"></i-input>
              </Form-item>
              <Form-item :label="$t('p.detail.editor.autoClose')" v-if="isEdit">
                <i-switch v-model="autoClose"></i-switch>
              </Form-item>

              <Form-item>
                <Button type="warning" v-if="showConfirmStatus" long @click="resolveHandle">变动确认</Button>
                <Button type="primary" long @click="submit">{{isEdit ? $t('p.detail.editor.action[0]') : $t('p.detail.editor.action[1]')}}</Button>
              </Form-item>
            </Form>
          </div>
          <div class="em-editor__control">
            <div class="em-proj-detail__switcher">
              <ul>
                <li @click="format">{{$t('p.detail.editor.control[0]')}}</li>
                <li @click="preview" v-if="isEdit">{{$t('p.detail.editor.control[1]')}}</li>
                <li @click="close">{{$t('p.detail.editor.control[2]')}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 解决冲突弹窗 -->
      <Modal
        v-model="state.isModalShow"
        title="选择以变动为准后记得要更新，才能生效哦~"
        ok-text="以变动为准"
        cancel-text="不做变更"
        @on-ok="confirmConflict"
        :closable="false">
        <div v-html="diffedHtml"></div>
      </Modal>
    </div>
  </transition>
</template>

<script>
import * as api from '../../api'
import jsBeautify from 'js-beautify/js/lib/beautify'
const jsondiffpatch = require('jsondiffpatch')
let ace

if (typeof window !== 'undefined') {
  ace = require('brace')
  require('brace/mode/javascript')
  require('brace/theme/monokai')
  require('brace/ext/language_tools')
  require('brace/ext/searchbox')
  require('./snippets')
}

export default {
  props: {
    value: {}
  },
  data () {
    return {
      codeEditor: null,
      autoClose: true,
      showConfirmStatus: false,
      userResolvedConflict: false,
      methods: [
        { label: 'get', value: 'get' },
        { label: 'post', value: 'post' },
        { label: 'put', value: 'put' },
        { label: 'delete', value: 'delete' },
        { label: 'patch', value: 'patch' }
      ],
      temp: {
        url: '',
        mode: '',
        method: '',
        description: ''
      },
      state: {
        isModalShow: false
      }
    }
  },
  computed: {
    isEdit () {
      return !!this.value._id
    },
    diffedHtml () {
      if (!this.value.confirm_mode) {
        return
      }
      // var left = JSON.parse(this.value.mode)
      var left = new Function(`return ${this.value.mode}`)() // eslint-disable-line
      // var right = new Function(`return ${this.value.confirm_mode}`) // eslint-disable-line
      var right = JSON.parse(this.value.confirm_mode)
      var delta = jsondiffpatch.diff(left, right)
      return jsondiffpatch.formatters.html.format(delta, left)
    }
  },
  mounted () {
    this.codeEditor = ace.edit(this.$refs.codeEditor)
    this.codeEditor.getSession().setMode('ace/mode/javascript')
    this.codeEditor.setTheme('ace/theme/monokai')
    this.codeEditor.setOption('tabSize', 2)
    this.codeEditor.setOption('fontSize', 15)
    this.codeEditor.setOption('enableLiveAutocompletion', true)
    this.codeEditor.setOption('enableSnippets', true)
    this.codeEditor.clearSelection()
    this.codeEditor.getSession().setUseWorker(false)
    this.codeEditor.on('change', this.onChange)
    this.codeEditor.commands.addCommand({
      name: 'save',
      bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
      exec: () => {
        this.submit()
      }
    })
  },
  watch: {
    'value.show': function (show) {
      document.body.style.overflow = show ? 'hidden' : 'auto'
      if (show) {
        // 编辑接口时
        if (this.isEdit) {
          this.autoClose = true
          this.showConfirmStatus = !!this.value.confirm_mode
          this.userResolvedConflict = false

          // 更新时保留原来的值
          this.temp.url = this.value.url.slice(1) // remove /
          this.temp.mode = this.value.mode
          this.temp.type = this.value.type
          this.temp.method = this.value.method
          this.temp.description = this.value.description
          this.temp.confirm_mode = this.value.confirm_mode
          this.temp.useMockData = this.value.useMockData
          this.codeEditor.setValue(this.temp.mode)
        } else {
          // 新增接口时
          this.temp.url = ''
          this.temp.mode = '{"data": {}}'
          this.temp.method = 'get'
          this.temp.type = 0 // type:0 代表用户手动新增的接口
          this.temp.description = ''
          this.temp.useMockData = false
          this.codeEditor.setValue(this.temp.mode)
        }
        this.format()
      }
    }
  },
  methods: {
    convertUrl (url) {
      const newUrl = '/' + url
      return newUrl === '/'
        ? '/'
        : newUrl.replace(/\/\//g, '/').replace(/\/$/, '')
    },
    format () {
      const context = this.codeEditor.getValue()
      let code = /^http(s)?/.test(context)
        ? context
        : jsBeautify.js_beautify(context, { indent_size: 2 })
      this.codeEditor.setValue(code)
    },
    onChange () {
      this.temp.mode = this.codeEditor.getValue()
    },
    close () {
      this.value.show = false
      this.$emit('input', this.value)
    },
    submit () {
      const mockUrl = this.convertUrl(this.temp.url)

      try {
        const value = (new Function(`return ${this.temp.mode}`))() // eslint-disable-line
        if (!value) {
          this.$Message.error(this.$t('p.detail.editor.submit.error[0]'))
          return
        } else if (typeof value !== 'object') {
          throw new Error()
        }
      } catch (error) {
        if (!/^http(s)?:\/\//.test(this.temp.mode)) {
          this.$Message.error(error.message || this.$t('p.detail.editor.submit.error[1]'))
          return
        }
      }

      if (this.isEdit) {
        // 如果确认冲突完毕后点击更新，应该清空confirm_mode的值
        this.userResolvedConflict && (this.temp.confirm_mode = null)

        // 提交编辑后，如果url和methods中至少有一个改变了，就应该认为改接口已经和后端不同步，是一种自定义的类型
        if ((this.temp.url !== this.value.url.slice(1)) || this.temp.method !== this.value.method) {
          this.temp.type = 0
          this.temp.confirm_mode = null
        }

        api.mock.update({
          data: {
            ...this.temp,
            id: this.value._id,
            url: mockUrl
          }
        }).then((res) => {
          if (res.data.success) {
            this.$Message.success(this.$t('p.detail.editor.submit.updateSuccess'))
            this.value.url = mockUrl
            this.value.mode = this.temp.mode
            this.value.confirm_mode = this.temp.confirm_mode
            this.value.method = this.temp.method
            this.value.description = this.temp.description
            this.value.type = this.temp.type
            if (this.autoClose) this.close()
          }
        })
      } else {
        this.$store.dispatch('mock/CREATE', {
          route: this.$route,
          ...this.temp,
          url: mockUrl
        }).then((res) => {
          if (res.data.success) {
            this.$Message.success(this.$t('p.detail.create.success'))
            this.close()
          }
        })
      }
    },
    preview () {
      window.open(this.$parent.baseUrl + this.value.url + '#!method=' + this.value.method)
    },
    resolveHandle () {
      this.state.isModalShow = true
    },
    confirmConflict () {
      this.showConfirmStatus = false
      this.userResolvedConflict = true
      this.temp.mode = this.value.confirm_mode
      this.codeEditor.setValue(this.temp.mode)
    }
  }
}
</script>
