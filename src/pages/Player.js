import Blits from '@lightningjs/blits'
import PlayerManager from '../managers/PlayerManager.js'

export default Blits.Component('Player', {
  template: `
    <Element>
      <Element
        y="1080"
        mount="{y:1}"
        w="1920"
        h="150"
        :color="{top: 'transparent', bottom: '#444'}"
        :alpha.transition="$controlsVisibility"
      >
        <Element x="60" y="50">
          <Element w="60" h="60" color="#0087CEEB" :effects="[{type: 'radius', props: {radius:16}}]">
            <Element y="14" x="14" w="32" h="32" :src="$playing ? 'assets/player/pause.png' : 'assets/player/play.png'" />
          </Element>
          <Element
            y="22"
            x="100"
            w="$progressLength"
            h="16"
            color="#ffffff80"
            :effects="[{type: 'radius', props: {radius:8}}]"
          >
            <Element
              h="16"
              :w.transition="{value: $progress, d: 100, f: 'ease-in-out'}"
              :effects="[{type: 'radius', props: {radius:8}}]"
              color="#0087CEEB"
            />
            <Circle size="28" color="#fff" y="-6" :x.transition="{value: $progress - 8, d: 100, f: 'ease-in-out'}" />
          </Element>
          <Element x="1660" y="16">
            <Text :content="$currentTime" size="25" />
            <Text x="70" size="25" content="/" />
            <Text x="85" size="25" :content="$duration" />
          </Element>
        </Element>
      </Element>
    </Element>
  `,
  props: ['stream_url'],
  state() {
    return {
      controlsVisibility: 0,
      progressLength: 1520,
      progress: 0,
      currentTime: '00:00',
      duration: '00:00',
      playing: false,
      hideTimeout: null,
    }
  },
  hooks: {
    focus() {
      this.$emit('clearBackground')
    },
    unfocus() {
      this.$emit('changeBackground')
    },
    async init() {
      await PlayerManager.init()
    },
    async ready() {
      try {
        await PlayerManager.load({ streamUrl: this.stream_url })
      } catch (err) {
        console.error('🚨 Error loading video stream in PlayerManager:', err)
        return
      }

      this.play()
    },
    async destroy() {
      await PlayerManager.destroy()
    },
  },
  input: {
    space() {
      this.play()
    },
    up() {
      this.showControls(1)
    },
    down() {
      this.showControls(0)
    },
  },
  methods: {
    play() {
      this.showControls(1)
      this.hideTimeout = this.$setTimeout(() => this.showControls(0), 3000)
      if (PlayerManager.state.playingState == true) {
        PlayerManager.pause()
        this.playing = false
      } else {
        console.log('play!')
        PlayerManager.play()
        this.playing = true
      }
    },
    showControls(v) {
      this.$clearTimeout(this.hideTimeout)
      this.controlsVisibility = v
    },
  },
})
