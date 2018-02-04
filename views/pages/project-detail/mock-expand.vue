<template>
  <div class="em-mock-expand">
    <h2>Method</h2>
    <p>{{mock.method}}</p>
    <h2>URL</h2>
    <p>{{mock.url}}</p>
    <h2>{{$t('p.detail.expand.description')}}</h2>
    <p>{{mock.description}}</p>
    <Tabs value="request" v-if="mock.parameters || mock.response_model">
      <Tab-pane :label="$t('p.detail.expand.tab[0]')" name="request" v-if="mock.parameters">
        <Table :columns="columnsRequest" :data="request"></Table>
      </Tab-pane>
      <Tab-pane :label="$t('p.detail.expand.tab[1]')" name="response" v-if="mock.response_model">
        <Table :columns="columnsResponse" :data="response"></Table>
      </Tab-pane>
      <Tab-pane label="Class Model" name="class" v-if="mock.response_model && entities.js.length">
        <Collapse>
          <Panel>
            SIS-Service
            <div slot="content">
              <p>
                <pre>{{entities.js}}</pre>
              </p>
            </div>
          </Panel>
        </Collapse>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
import {
  getObjectiveCEntities
} from 'swagger-parser-mock/lib/entity'
import DataTypeExpand from './data-type-expand'

export default {
  props: {
    mock: {}
  },
  data () {
    return {
      columnsRequest: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => h(DataTypeExpand, { props: { data: params.row.parameter } })
        },
        { title: this.$t('p.detail.expand.columnsRequest[0]'), key: 'name' },
        { title: this.$t('p.detail.expand.columnsRequest[1]'), key: 'description' },
        { title: this.$t('p.detail.expand.columnsRequest[2]'), key: 'paramType' },
        { title: this.$t('p.detail.expand.columnsRequest[3]'), key: 'dataType' }
      ],
      columnsResponse: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => h(DataTypeExpand, { props: { data: params.row.response } })
        },
        { title: this.$t('p.detail.expand.columnsResponse[0]'), key: 'code' },
        { title: this.$t('p.detail.expand.columnsResponse[1]'), key: 'message' }
      ]
    }
  },
  computed: {
    request () {
      const parameters = this.mock.parameters ? JSON.parse(this.mock.parameters) : []
      return parameters.map(parameter => ({
        name: parameter.name,
        description: parameter.description || this.$t('p.detail.expand.defaultDescription'),
        paramType: parameter.in,
        dataType: this.getParamDataType(parameter),
        parameter: parameter
      }))
    },
    response () {
      const responseModel = this.mock.response_model ? JSON.parse(this.mock.response_model) : {}
      return Object.keys(responseModel).map(code => {
        const response = responseModel[code]
        return {
          code: code,
          message: response.message || response.description || this.$t('p.detail.expand.defaultDescription'),
          response: response
        }
      })
    },
    entities () {
      const res = this.response.filter(o => {
        const code = o.code.toString()
        return code === '200' || code === 'default'
      })[0]
      const response = res ? res.response : {}
      let _mock = this.mock
      let queryParam = JSON.parse(_mock.parameters).filter(i => { return i.in === 'query' }).map(i => { return i.name })
      if (queryParam.length > 0) {
        queryParam = `query:{${queryParam}}`
      }
      let bodyParam = JSON.parse(_mock.parameters).filter(i => { return i.in === 'body' }).map(i => { return i.name })
      if (bodyParam.length > 0) {
        bodyParam = `data:{${bodyParam}}`
      }
      let str = `import net from './net';
class ${_mock.url.split('/')[2]}Service{
      /**
      * ${_mock.description}
      *
${JSON.parse(_mock.parameters).map(i => { return `      * @param {${i.required ? '' : '?'}${i.type || 'any'}} ${i.name} ${i.description} [${i.in}]` }).join('\n')}
      */
      ${_mock.url.split('/')[3]}(${JSON.parse(_mock.parameters).map(i => { return i.name })}){
            return net.fetch('${_mock.url}',{
                  method:'${_mock.method}',
                  ${_mock.method === 'post' ? `data:${JSON.parse(_mock.parameters).map(i => { return i.name })}` : queryParam + '\n' + bodyParam}
            }
      }
}
        `
      return {
        js: str,
        oc: getObjectiveCEntities(response)
      }
    }
  },
  methods: {
    getParamDataType (parameter) {
      const { type, schema } = parameter
      if (type) return type
      if (schema && schema.type) {
        return schema.type === 'array' ? schema.items.type : schema.type
      }
    }
  }
}
</script>
