import Blits from '@lightningjs/blits'

import Loader from '../components/Loader.js'
import Header from '../components/Header.js'

export default Blits.Component('Home', {
  components: {
    Loader,
    Header,
  },

  template: `
    <Element w="1920" h="1080" color="#1e293b">
      <!-- Header -->
      <Header ref="header" />
    
      <!-- Banner Slider -->
      <Element y="100" w="1920" h="400" color="#334155" ref="banner">
        <Text align="center" size="50" y="175" content="Banner Slider" color="#ffffff80" />
      </Element>
    
      <!-- Quick Watch Section -->
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
    
      <!-- Category Section -->
      <Element y="900" w="1920" h="400" ref="category">
        <Text size="35" x="60" content="Categories" color="#ffffff" />
        <Element y="50" x="60" w="1800" h="300">
          <Element x="0" w="300" h="300" color="#7c3aed" ref="category1" />
          <Element x="320" w="300" h="300" color="#facc15" ref="category2" />
          <Element x="640" w="300" h="300" color="#fb7185" ref="category3" />
          <Element x="960" w="300" h="300" color="#06b6d4" ref="category4" />
          <Element x="1280" w="300" h="300" color="#4ade80" ref="category5" />
          <Element x="1600" w="300" h="300" color="#f43f5e" ref="category6" />
        </Element>
      </Element>
    </Element>
  `,

  state() {
    return {
      focused: 'header', // Default focus on Header
      scrollX: 0,
    }
  },

  hooks: {
    focus() {
      this.$trigger('focused')
    },
  },

  watch: {
    focused(value) {
      const focusedElement = this.$select(value)
      if (focusedElement && focusedElement.$focus) {
        focusedElement.$focus()
      }
    },
  },

  input: {
    up() {
      if (this.focused === 'quickwatch') {
        this.focused = 'banner'
      } else if (this.focused === 'banner') {
        this.focused = 'header'
      } else if (this.focused.startsWith('category')) {
        this.focused = 'quickwatch'
      }
    },
    down() {
      if (this.focused === 'header') {
        this.focused = 'banner'
      } else if (this.focused === 'banner') {
        this.focused = 'quickwatch'
      } else if (this.focused === 'quickwatch') {
        this.focused = 'category1'
      }
    },
    left() {
      if (this.focused.startsWith('item')) {
        const itemIndex = parseInt(this.focused.replace('item', ''), 10)
        if (itemIndex > 1) {
          this.focused = `item${itemIndex - 1}`
        } else {
          this.scrollX = Math.min(this.scrollX + 320, 0)
        }
      } else if (this.focused.startsWith('category')) {
        const categoryIndex = parseInt(this.focused.replace('category', ''), 10)
        if (categoryIndex > 1) {
          this.focused = `category${categoryIndex - 1}`
        }
      }
    },
    right() {
      if (this.focused.startsWith('item')) {
        const itemIndex = parseInt(this.focused.replace('item', ''), 10)
        if (itemIndex < 6) {
          this.focused = `item${itemIndex + 1}`
        } else {
          this.scrollX = Math.max(this.scrollX - 320, -1600)
        }
      } else if (this.focused.startsWith('category')) {
        const categoryIndex = parseInt(this.focused.replace('category', ''), 10)
        if (categoryIndex < 6) {
          this.focused = `category${categoryIndex + 1}`
        }
      }
    },
    enter() {
      console.log(`Selected: ${this.focused}`)
    },
  },
})
