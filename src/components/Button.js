import Blits from '@lightningjs/blits'

export default Blits.Component('Button', {
  template: `
    <Element
      w="300"
      h="80"
      color="$color || 'red'"
      :effects="[{type: 'radius', props: {radius: 20}}]"
      :scale.transition="$scale"
      :rotation="$rotate"
    >
    </Element>
  `,
  props: ['color'],
  state() {
    return {
      alpha: 0.4,
      scale: 1,
      rotate: 0,
    }
  },
  hooks: {
    focus() {
      this.$log.info(`Button with color ${this.color} received focus`)
      this.alpha = 1
      this.scale = this.scale === 1 ? 1.2 : 1
    },
    unfocus() {
      this.$log.info(`Button with color ${this.color} lost focus`)
      this.alpha = 0.4
      this.scale = 1
      this.rotate = 0
    },
  },
  input: {
    enter() {
      // this.rotate = this.rotate === 0 ? -4 : 0
      this.scale = this.scale === 1.2 ? 1.3 : 1.2
    },
  },
})
