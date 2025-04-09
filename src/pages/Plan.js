import Blits from '@lightningjs/blits'
import Header from '../components/Header'

export default Blits.Component('Plan', {
  components: {
    Header,
  },
  state() {
    return {
      items: Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`),
      focusIndex: 0,
      scrollY: 0,
    }
  },

  template: `
    <Element w="1920" h="1080" color="#1e293b">
      <!-- Header -->
      <Header ref="header" />
    </Element>
  `,

  input: {
    up() {
      if (this.focusIndex > 2) {
        this.focusIndex -= 3
      } else {
        this.scrollY = Math.min(this.scrollY + 280, 0)
      }
    },
    down() {
      if (this.focusIndex < this.items.length - 3) {
        this.focusIndex += 3
      } else {
        this.scrollY = Math.max(this.scrollY - 280, -((this.items.length / 3) * 280 - 800))
      }
    },
    left() {
      if (this.focusIndex % 3 !== 0) {
        this.focusIndex--
      }
    },
    right() {
      if (this.focusIndex % 3 !== 2 && this.focusIndex < this.items.length - 1) {
        this.focusIndex++
      }
    },
    enter() {
      console.log(`Selected: ${this.items[this.focusIndex]}`)
    },
  },

  watch: {
    focusIndex(index) {
      this.$select(`item${index}`).$focus()
    },
  },
})
