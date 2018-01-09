export default {
  name: 'commonRow',
  componentName: 'commonRow',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    gutter: {
      type: Number,
      default: 15
    },
    justify: {
      type: String,
      default: 'start'
    },
    align: {
      type: String,
      default: 'top'
    },
    type: {
      type: String,
      default: 'respone'
    }
  },
  computed: {
    style () {
      var ret = {}
      if (this.gutter) {
        ret.paddingLeft = `-${this.gutter / 2}px`
        ret.paddingRight = ret.paddingLeft
      }
      return ret
    }
  },
  render (h) {
    return h(this.tag, {
      class: [
        'common-row',
        this.justify !== 'start' ? `is-justify-${this.justify}` : '',
        this.align !== 'top' ? `is-align-${this.align}` : ''
      ],
      style: this.style
    }, this.$slots.default)
  }
}
