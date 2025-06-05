import Blits from '@lightningjs/blits'

import {
  fetchAllChannel,
  fetchAllChannelBylanguage,
  fetchAllQuickChannel,
} from '../api/providers/index.js'
import TmdbRow from '../components/TmdbRow.js'
import Background from '../components/Background.js'
import Loader from '../components/Loader.js'
import { resolveAssetPath } from '../utils/resolveAssetPath.js'

export default Blits.Component('Home', {
  components: {
    Background,
    TmdbRow,
    Loader,
  },
  template: `
    <Element w="1920" h="1080" color="black">
      <!-- <ProgressBar ref="progress" x="10" y="20" :progress="$progress" /> -->
      <!-- <Loader :visible="$loading" zIndex="1000" /> -->

      <Background :bgImg="$src" />
      <Element>
        <Element
          :y.transition="{value: $contentY, duration: $duration}"
          :alpha.transition="{value: $alpha, duration: $duration}"
        >
          <!-- <Element :src="resolveAssetPath('assets/logo.png')" /> -->
          <Element src="assets/logo.png" x="140" y="90" w="150" h="102" />
          <Text
            :content="$title"
            font="raleway"
            size="80"
            x="140"
            y="100"
            maxwidth="1000"
            @loaded="$positionText"
            maxlines="1"
          />
          <Text :content="$overview" maxwidth="880" x="140" y="200" lineheight="40" maxlines="3" />
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
      y: 250,
      contentY: 0,
      scale: 1,
      title: '',
      overview: '',
      type: 'Poster',
      duration: 300,
      loading: true,
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
      this.loading = true
      console.log('Resolved logo path:', resolveAssetPath('assets/logo.png'))

      try {
        // Fetch both APIs
        const [quickChannels, categorizedChannels] = await Promise.all([
          fetchAllQuickChannel(),
          fetchAllChannel(),
        ])

        let yOffset = 0
        const rowSpacing = 378
        const rows = []

        // 1. First Row - Quick
        rows.push({
          title: '',
          items: quickChannels,
          type: 'Poster',
          width: 215,
          y: yOffset,
        })

        yOffset += rowSpacing

        // 2. Dynamic Rows from categories
        Object.entries(categorizedChannels).forEach(([category, items], index) => {
          if (!items || items.length === 0) return // skip empty rows

          const isHero = index % 3 === 1
          rows.push({
            title: category,
            items,
            type: isHero ? 'Hero' : 'Poster',
            width: isHero ? 970 : 215,
            y: yOffset,
          })

          yOffset += isHero ? 756 : rowSpacing
        })

        this.rows = rows
        this.focused = 0
      } catch (error) {
        console.error('Failed to load channel data:', error)
      } finally {
        this.loading = false
      }
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
      // setTimeout(() => {
      //   this.duration = 300
      //   this.contentY = 0
      //   this.alpha = 1
      // }, 50)
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
      this.y = (this.focused === 0 ? 250 : 90) - this.rows[this.focused].y
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
