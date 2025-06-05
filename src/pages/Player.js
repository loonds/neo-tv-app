import Blits from '@lightningjs/blits'
import PlayerManager from '../managers/PlayerManager.js'
import Loader from '../components/Loader.js'
import { fetchAllChannelBylanguage } from '../api/providers/index.js'

export default Blits.Component('Player', {
  components: { Loader },
  template: `
    <Element>
      <!-- Loader -->
      <Element :visible="$visible">
        <!-- Channel List -->
        <Element x="40" y="200" w="400" :visible="true" :h="$channels.length * 80">
          <Element
            :for="channel in $channels"
            :key="channel.id || channel.title"
            :y="$index * 80"
            w="100%"
            h="80"
            :color="$index === $selectedChannelIndex ? '#0087CEEB' : '#ffffff10'"
            :effects="[{ type: 'radius', props: { radius: 12 } }]"
          >
            <Text x="20" y="20" size="28" :content="channel.title" color="#fff" />
          </Element>
        </Element>

        <!-- Player Controls -->
        <Element
          y="1080"
          mount="{y:1}"
          :w="$width"
          :h="$height"
          :color="$backgroundColor"
          :alpha.transition="{value: $controlsVisibility, d: 300}"
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
                color="#0087CEEB"
                :effects="[{type: 'radius', props: {radius:8}}]"
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
    </Element>
  `,
  props: ['stream_url'],
  state() {
    return {
      loading: true,
      controlsVisibility: 0,
      progressLength: 1520,
      progress: 0,
      currentTime: '00:00',
      duration: '00:00',
      playing: false,
      hideTimeout: null,

      channels: [],
      selectedChannelIndex: 0,
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
      try {
        const channels = await fetchAllChannelBylanguage('English')
        this.channels = channels || []
      } catch (err) {
        console.error('❌ Failed to fetch channels:', err)
        this.channels = []
      }
    },
    async ready() {
      try {
        this.loading = true
        await PlayerManager.load({ streamUrl: this.stream_url })
        PlayerManager.play()

        this.$setTimeout(() => {
          this.loading = false
          this.playing = true
        }, 1000)
      } catch (err) {
        console.error('❌ Error loading video stream:', err)
        this.loading = false
      }
    },
    async destroy() {
      if (PlayerManager?.destroy) {
        await PlayerManager.destroy()
      }
    },
  },
  input: {
    up() {
      if (!this.controlsVisibility) {
        this.selectedChannelIndex = Math.max(0, this.selectedChannelIndex - 1)
      }
    },
    down() {
      if (!this.controlsVisibility) {
        this.selectedChannelIndex = Math.min(
          this.channels.length - 1,
          this.selectedChannelIndex + 1
        )
      }
    },
    enter() {
      if (!this.controlsVisibility && this.channels.length > 0) {
        const selected = this.channels[this.selectedChannelIndex]
        this.loadChannel(selected.url || selected.stream_url)
      }
    },
    space() {
      this.play()
    },
    escape() {
      this.toggleControls(1)
    },
  },
  methods: {
    play() {
      this.toggleControls(1)
      this.hideTimeout = this.$setTimeout(() => this.toggleControls(0), 3000)

      if (PlayerManager.state.playingState === true) {
        PlayerManager.pause()
        this.playing = false
      } else {
        PlayerManager.play()
        this.playing = true
      }
    },
    toggleControls(show = 1) {
      this.$clearTimeout(this.hideTimeout)
      this.controlsVisibility = show
      if (show) {
        this.hideTimeout = this.$setTimeout(() => this.toggleControls(0), 3000)
      }
    },
    async loadChannel(url) {
      this.loading = true
      if (PlayerManager?.destroy) {
        await PlayerManager.destroy()
      }
      await PlayerManager.load({ streamUrl: url })
      PlayerManager.play()
      this.playing = true
      this.loading = false
    },
  },
})
