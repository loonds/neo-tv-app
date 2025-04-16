import Blits from '@lightningjs/blits'
import PortalRow from '../components/PortalRow.js'
import SourceInfo from '../components/SourceInfo.js'

import p from '../../package.json'

export default Blits.Component('Portal', {
  components: {
    PortalRow,
    SourceInfo,
  },
  template: `
    <Element w="1920" h="1080" color="{top: '#44037a', bottom: '#240244'}">
      <PortalRow
        v-if="$demo.length > 0"
        mount="{y: 0.5}"
        h="500"
        :y.transition="-$rowFocused * 420 + 550"
        title="Quick Watch"
        items="$demo"
        ref="row0"
      />
      <PortalRow
        mount="{y: 0.5}"
        h="500"
        :y.transition="-$rowFocused * 420 + 1100"
        title="Category"
        items="$example"
        ref="row1"
      />
      <PortalRow
        mount="{y: 0.5}"
        h="500"
        :y.transition="-$rowFocused * 420 + 1650"
        title="Sports"
        items="$benchmark"
        ref="row2"
      />
      <Element w="1920" h="200" color="#44037a">
        <Element w="1920" h="70" y="200" color="{top: '#44037a'}" />
        <Element :y.transition="{value: 80 - $logoOffset, duration: 400}">
          <Element src="assets/logo.png" w="200" h="112" x="60" />
          <Element w="2" h="120" y="-10" color="#ffffff80" x="300" />
          <Element x="320" y="16">
            <Text y="0" size="36">Neo TV App</Text>
            <Text y="50" size="24">v{{ $version }}</Text>
          </Element>
        </Element>
      </Element>
    </Element>
  `,
  state() {
    return {
      version: p.version,
      offset: 60,
      rowFocused: 0,
      rows: ['demo', 'example', 'benchmark'],
      logoOffset: 50,
      demo: [
        {
          title: 'Quick Watch',
          id: 'demo/quick-watch',
          description: 'Quick Watch Elements and Components',
          image: 'assets/image.png',
          stream_url:
            'https://aajtaklive-amd.akamaized.net/hls/live/2014416/aajtak/aajtaklive/live_720p/chunks.m3u8',
        },
        // ... more demo items
      ],
      loading: true,
      example: [],
      benchmark: [
        {
          title: 'Exponential',
          id: 'benchmarks/exponential',
          description: 'Spawn a large number of components at an exponential rate',
          image: 'assets/positioning.png',
          stream_url: 'https://www.youtube.com/watch?v=1',
        },
      ],
    }
  },
  hooks: {
    init() {
      this.fetchData()
    },
    ready() {
      this.logoOffset = 0
      this.$trigger('rowFocused')
    },
  },
  watch: {
    rowFocused(v) {
      const row = this.$select(`row${v}`)
      if (row && row.$focus) row.$focus()
    },
  },
  input: {
    up() {
      this.rowFocused = (this.rowFocused - 1 + this.rows.length) % this.rows.length
    },
    down() {
      this.rowFocused = (this.rowFocused + 1) % this.rows.length
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch('https://api-houston.newsoutnow.com/api/v2/channels', {
          method: 'POST',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIxMjY3MWRmLTQ0ZjEtNGNlOS1hMzk1LTM2MDlkMDc0MGU4MyIsIm1hY19hZGRyZXNzIjoiQW5kcm9pZC1UViIsImlhdCI6MTc0MzYxMTI3N30.DTdQ3JtiQy3uY9lQuGhL4uTvHcD8NWKhw9DwYZ4utKpj7vRJiOMfCKTPmWhfqdkSDG4n348sbOw88CCPNL0hggZSAnygW16WLX1MpSe0N88n-qSnwx14lD5l6eH9Zm9vs3d6BUVtnxhaxvRTeEdB-euI4nV3TABTg8OVRy5a2yBJP5QGS6csb5uYGtE1hbxB9dwKJex-mlqaMwlhCBtnlSRcfToWcixyznOFTL7uN68kma6GVrsOizXSCToG4aKLsApFU_82Et0RbvBUl5U0CZeIr7I3Ok74NGsl0AHeKlbtAqFbYvioIlBYCFDov1aT4ZpsEoprFbnTND3ZX8Aw0A',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ language: 'Hindi' }),
        })

        if (!response.ok) {
          const text = await response.text()
          console.error('API Error:', response.status, text)
          throw new Error('API request failed')
        }

        const data = await response.json()
        console.log('Response Data:', data.data)
        if (data.data && Array.isArray(data.data)) {
          this.example = data.data.map((channel) => ({
            title: channel.channel_name,
            id: channel.id || 'default-id',
            description: channel.description || 'No description available',
            image: channel.image || 'assets/image.png',
            stream_url: channel.stream_url || 'https://www.youtube.com/watch?v=1',
          }))
          this.loading = false
          this.$trigger('rowFocused')
        } else {
          console.error('Invalid API response:', data)
        }
      } catch (err) {
        console.error('Failed to fetch channels:', err)
        this.loading = false
      }
    },
  },
})
