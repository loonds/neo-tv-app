import Blits from '@lightningjs/blits'

export default Blits.Component('Poster', {
  template: `
    <Element
      w="200"
      h="200"
      x="$x"
      :src="$item.poster"
      :scale.transition="{value: $scale, duration: 200, easing: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'}"
      :_effects="[{type: 'radius', props: {radius: 8}}]"
    />
  `,
  props: ['src', 'index', 'item', 'width'],
  state() {
    return {
      scale: 1,
      color: '#333',
    }
  },
  computed: {
    x() {
      return this.index * this.width
    },
  },
  hooks: {
    focus() {
      this.color = '#fff'
      this.scale = 1.1
    },
    unfocus() {
      this.color = '#333'
      this.scale = 1
    },
  },
  input: {
    enter() {
      const streamUrl = this.item?.stream_url
      if (streamUrl) {
        console.log('🚀 Navigating to /player with stream_url:', streamUrl)
        this.$router.to('/player', {
          stream_url: streamUrl,
        })
      } else {
        console.error('❌ stream_url is missing or invalid in item:', this.item)
      }
    },
    back() {
      // intercept
      this.$router.back()
    },
  },
})
