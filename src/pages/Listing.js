import Blits from '@lightningjs/blits'
import Header from '../components/Header'

export default Blits.Component('Listing', {
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
      <Element y="550" w="1920" h="300" ref="quickwatch">
        <Text size="35" x="60" content="Quick Watch" color="#ffffff" />
        <Element y="50" x="60" w="1800" h="200" :scroll.x="scrollX">
          <Element x="0" w="300" h="200" color="#f87171" ref="item1" />
          <Element x="320" w="300" h="200" color="#34d399" ref="item2" />
          <Element x="640" w="300" h="200" color="#60a5fa" ref="item3" />
          <Element x="960" w="300" h="200" color="#fbbf24" ref="item4" />
          <Element x="1280" w="300" h="200" color="#a78bfa" ref="item5" />
          <Element x="1600" w="300" h="200" color="#f472b6" ref="item6" />
        </Element>
      </Element>
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
