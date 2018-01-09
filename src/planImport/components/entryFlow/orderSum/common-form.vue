<template>
  <div class="common-form">
    <el-form :label-position="position" :model="form">
      <el-row :gutter="15">
        <el-col :span="4" v-for="(label,outIndex) in labels" :key="outIndex">
          <el-form-item :label="label.name" v-if="label.type==='input'">
            <el-input v-model="form[label.value]" size="mini"></el-input>
          </el-form-item>
          <el-form-item :label="label.name" v-if="label.type==='radio'">
            <el-radio-group v-model="form[label.value]">
              <el-radio :label="item.radioKey" size="mini" v-for="(item,index) in label.radio" :key="index">
                {{item.radioValue}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="label.name" v-if="label.type==='select'">
            <el-select v-model="form[label.value]" size="mini" :popper-class="selectClass">
              <el-option :label="item.label" :value="item.value" v-for="(item,index) in label.options"
                         :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="label.name" v-if="label.type==='date'">
            <el-date-picker
              v-model="form[label.value]"
              size="mini"
              type="datetime">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      form: Object,
      labels: Array,
      position: String,
      selectClass: String
    }
  }
</script>
<style lang="less">
  .common-form {
    margin-top: 15px;
  }
</style>
