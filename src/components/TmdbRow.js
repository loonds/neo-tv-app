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
      <Text content="$title" font="raleway" size="30" x="140" />
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
      const screenWidth = 1920
      const sidePadding = 150
      const rowWidth = screenWidth - sidePadding * 2
      const visibleCount = Math.floor(rowWidth / this.width)
      const totalItems = this.items.length

      // Ensure we scroll only if needed
      const maxOffset = Math.max(totalItems - visibleCount, 0)
      const clampedFocus = Math.min(this.focused, maxOffset)

      // Special case: if all items fit, no scroll needed
      if (totalItems <= visibleCount) {
        return sidePadding
      }

      return sidePadding - clampedFocus * this.width
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
      const selected = this.items[this.focused]
      if (selected?.stream_url) {
        this.$router.to('/player', {
          stream_url: selected.stream_url,
        })
      } else {
        console.error('❌ No stream_url in selected item:', selected)
      }
    },
    back() {
      this.$router.back()
    },
  },
})
