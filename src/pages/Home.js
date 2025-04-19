import Blits from '@lightningjs/blits'

import { fetchAllChannelBylanguage, fetchAllQuickChannel } from '../api/providers/index.js'
import TmdbRow from '../components/TmdbRow.js'
import Background from '../components/Background.js'

export default Blits.Component('Home', {
  components: {
    Background,
    TmdbRow,
  },
  template: `
    <Element w="1920" h="1080" color="black">
      <Background :bgImg="$src" />
      <Element>
        <Element
          :y.transition="{value: $contentY, duration: $duration}"
          :alpha.transition="{value: $alpha, duration: $duration}"
        >
          <Element src="assets/logo.png" x="140" y="90" w="150" h="102" />
          <Text
            :content="$title"
            font="raleway"
            size="80"
            x="140"
            y="300"
            maxwidth="1000"
            @loaded="$positionText"
            maxlines="1"
          />
          <Text :content="$overview" maxwidth="880" x="140" y="430" lineheight="40" maxlines="3" />
        </Element>
        <Element :y.transition="{value: $y, duration: 300, easing: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'}">
          <TmdbRow
            :for="(row, index) in $rows"
            key="$row.title"
            title="$row.title"
            :items="$row.items"
            :type="$row.type"
            :width="$row.width"
            y="$row.y"
            ref="row"
          />
        </Element>
      </Element>
    </Element>
  `,
  state() {
    return {
      rows: [],
      src: '',
      focused: null,
      alpha: 1,
      y: 550,
      contentY: 0,
      scale: 1,
      title: '',
      overview: '',
      type: 'Poster',
      duration: 300,
    }
  },
  watch: {
    focused(value) {
      const focusItem = this.$select('row' + value)
      if (focusItem && focusItem.$focus) focusItem.$focus()
    },
  },
  hooks: {
    async init() {
      this.rows = [
        {
          title: 'Best Hindi news channels',
          items: await fetchAllQuickChannel(),
          type: 'Poster',
          width: 215,
          y: 0,
        },
        {
          title: 'English News channels',
          items: await fetchAllChannelBylanguage('English'),
          type: 'Hero',
          width: 1370,
          y: 358,
        },
        {
          title: 'Punjabi News channels',
          items: await fetchAllChannelBylanguage('Punjabi'),
          type: 'PosterTitle',
          width: 215,
          y: 1158,
        },
        {
          title: 'Entertainment channels',
          items: await fetchAllChannelBylanguage('Entertainment'),
          type: 'PosterTitle',
          width: 215,
          y: 1536,
        },
        {
          title: 'International News channels',
          items: await fetchAllChannelBylanguage('International'),
          type: 'Hero',
          width: 1370,
          y: 1914,
        },
        {
          title: 'Regional News channels',
          items: await fetchAllChannelBylanguage('Regional'),
          type: 'PosterTitle',
          width: 215,
          y: 2714,
        },
        {
          title: 'Bangla News channels',
          items: await fetchAllChannelBylanguage('Bangla'),
          type: 'PosterTitle',
          width: 215,
          y: 3092,
        },
      ]
      this.focused = 0
    },
    ready() {
      this.$listen('posterSelect', (item) => {
        if (this.focused === 0) {
          this.src = item.background
          this.title = item.title
          this.overview = item.overview
        }
      })

      // Delay transitions to avoid early cancellation
      setTimeout(() => {
        this.duration = 300
        this.contentY = 0
        this.alpha = 1
      }, 50)
    },
    focus() {
      this.$trigger('focused')
    },
  },
  input: {
    up() {
      if (!this.rows?.[this.focused - 1]) return
      this.contentY = 0
      this.duration = 300
      this.focused = Math.max(this.focused - 1, 0)
      this.y = (this.focused === 0 ? 550 : 90) - this.rows[this.focused].y
      this.alpha = this.focused === 0 ? 1 : 0
    },
    down() {
      if (!this.rows?.[this.focused + 1]) return
      this.contentY = -60
      this.duration = 200
      this.focused = Math.min(this.focused + 1, this.rows.length - 1)
      this.y = (this.focused === 0 ? 550 : 90) - this.rows[this.focused].y
      this.alpha = this.focused === 0 ? 1 : 0
    },
  },
})
