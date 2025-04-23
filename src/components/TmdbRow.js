import Blits from '@lightningjs/blits'

import Hero from './Hero.js'
import Poster from './Poster.js'
import PosterTitle from './PosterTitle.js'

export default Blits.Component('TmdbRow', {
  components: {
    Hero,
    Poster,
    PosterTitle,
  },
  template: `
    <Element>
      <Element :x.transition="{value: $x, duration: 300, easing: 'ease-in-out'}" y="80">
        <Component
          is="$type"
          :for="(item, index) in $items"
          index="$index"
          item="$item"
          ref="poster"
          width="$width"
          key="$item.identifier"
        />
      </Element>
    </Element>
  `,
  props: ['title', 'type', 'items', 'width'],
  state() {
    return {
      focused: 0,
      offset: 0,
    }
  },
  hooks: {
    focus() {
      this.$trigger('focused')
    },
  },
  computed: {
    x() {
      return 150 - Math.min(this.focused, this.items.length - 1720 / this.width) * this.width
    },
  },
  watch: {
    focused(value) {
      const focusItem = this.$select('poster' + value)
      if (focusItem && focusItem.$focus) {
        focusItem.$focus()
        this.$emit('posterSelect', this.items[value])
      }
    },
  },
  input: {
    left() {
      this.focused = Math.max(this.focused - 1, 0)
    },
    right() {
      this.focused = Math.min(this.focused + 1, this.items.length - 1)
    },
    enter() {
      if (this.stream_url) {
        console.log('Passing stream_url:', this.stream_url)
        this.$router.to('/player', {
          stream_url: this.stream_url,
        })
      } else {
        console.error('❌ stream_url is undefined or null!')
      }
    },
    back() {
      // intercept
      this.$router.back()
    },
  },
})
