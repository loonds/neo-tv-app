import Blits from '@lightningjs/blits'

import Loader from '../components/Loader.js'
import Header from '../components/Header.js'
import Grid from '../components/Grid.js'
import List from '../components/List.js'
import Item from '../components/Item.js'

export default Blits.Component('Home', {
  components: {
    Loader,
    Header,
    Grid,
    List,
    Item,
  },

  template: `
    <Element :w="this.stageW" :h="this.stageH" color="#121212">
      <!-- Header -->
      <Header ref="header" />
    
      <!-- Banner Slider -->
      <Element y="100" w="1920" h="400" color="#334155" ref="banner">
        <Text align="center" size="50" y="175" content="Banner Slider" color="#ffffff80" />
      </Element>
    
      <!-- Quick Watch Section -->
      <Element y="550" w="1920" h="300" ref="quickwatch">
        <Text size="35" x="60" content="Quick Watch" color="#ffffff80" />
        <List
          ref="quickwatchList"
          y="50"
          x="60"
          items="$items"
          itemComponent="Item"
          itemWidth="300"
          itemHeight="200"
          itemOffset="30"
          looping="true"
          autoScroll="true"
          autoscrollOffset="4"
        />
      </Element>
    
      <!-- Category Section -->
      <Element y="900" w="1920" h="400" ref="categorySection">
        <Text size="35" x="60" content="Categories" color="#ffffff80" />
        <Grid
          ref="categoryGrid"
          y="50"
          x="60"
          items="$gridItems"
          itemWidth="120"
          itemHeight="50"
          itemOffset="20"
          looping="false"
          refocusParent="true"
        />
      </Element>
    </Element>
  `,

  state() {
    return {
      focused: 'header',
      scrollX: 0,
      stageW: 1920,
      stageH: 1080,
      index: 0,
      keyboardAlpha: 0,
      keyboardY: 0,
      focusable: ['quickwatchList', 'categoryGrid'],
      progress: 20,
      dummyData: [
        {
          id: 1,
          insert_language: 'Hindi',
          image:
            'https://quickfox.s3.us-west-002.backblazeb2.com/top-tv/language/IMG_2903-lang-1697898399428.jpeg',
          sort_value: 1,
        },
        {
          id: 4,
          insert_language: 'Entertainment',
          image:
            'https://quickfox.s3.us-west-002.backblazeb2.com/top-tv/language/movies-lang-1738606405412.jpg',
          sort_value: 2,
        },
        {
          id: 6,
          insert_language: 'International',
          image:
            'https://quickfox.s3.us-west-002.backblazeb2.com/top-tv/language/IMG_2910-lang-1697898917290.jpeg',
          sort_value: 3,
        },
        {
          id: 9,
          insert_language: 'Punjabi',
          image:
            'https://quickfox.s3.us-west-002.backblazeb2.com/top-tv/language/IMG_2906-lang-1697898673839.jpeg',
          sort_value: 5,
        },
        {
          id: 8,
          insert_language: 'Regional',
          image:
            'https://quickfox.s3.us-west-002.backblazeb2.com/top-tv/language/IMG_2904-lang-1697898494502.jpeg',
          sort_value: 6,
        },
        {
          id: 7,
          insert_language: 'Bangla',
          image:
            'https://quickfox.s3.us-west-002.backblazeb2.com/top-tv/language/IMG_2913-lang-1697899023480.jpeg',
          sort_value: 7,
        },
      ],

      items: [],
      gridItems: [],
    }
  },

  hooks: {
    mounted() {
      this.stageW = this.$stage?.w || 1920
      this.stageH = this.$stage?.h || 1080
      this.focused = 'quickwatchList'

      if (Array.isArray(this.dummyData) && this.dummyData.length > 0) {
        this.items = this.dummyData
          .filter((item) => item && item.image && item.insert_language) // avoid null items
          .map((item, i) => ({
            id: item.id ?? i,
            label: item.insert_language,
            image: item.image,
          }))
      } else {
        this.items = []
      }

      this.gridItems = [...this.items]
    },
    ready() {
      const name = this.$select('name')
      if (name && name.$focus) name.$focus()
    },
    focus() {
      if (this.keyboardAlpha) {
        this.keyboardAlpha = 0
        this.keyboardY = 0
      }
      this.setFocus()
    },
    init() {
      this.registerListeners()
    },
  },

  methods: {
    setFocus() {
      const next = this.$select(this.focusable[this.index])
      if (next && next.$focus) next.$focus()
    },
    removeLastChar(str) {
      return str.substring(0, str.length - 1)
    },
    handleKey(char) {
      if (this.focusable[this.index] === 'name') {
        this.name += char
      } else if (this.focusable[this.index] === 'password') {
        this.password += char
      }
    },
    registerListeners() {
      this.$listen('onKeyboardInput', ({ key }) => {
        this.handleKey(key)
      })
    },
  },

  input: {
    up() {
      this.index = this.index === 0 ? this.focusable.length - 1 : this.index - 1
      this.setFocus()
    },
    down() {
      this.index = this.index === this.focusable.length - 1 ? 0 : this.index + 1
      this.setFocus()
    },
    right() {
      this.setFocus()
    },
    left() {
      this.setFocus()
    },
    enter() {
      const currentFocusable = this.focusable[this.index]
      let element = null

      switch (currentFocusable) {
        case 'button':
          console.log('submitting form:', this.name, this.password, this.checkbox)
          break
        case 'checkbox':
          this.checkbox = !this.checkbox
          break
        case 'progress':
          this.progress = this.progress === 100 ? 20 : this.progress + 20
          break
        case 'toggle':
          this.toggle = !this.toggle
          break
        case 'name':
        case 'password':
          this.keyboardAlpha = 1
          this.keyboardY = -45
          element = this.$select('keyboard')
          if (element && element.$focus) element.$focus()
          break
        default:
          console.warn('Unrecognized focusable element:', currentFocusable)
      }
    },
    back() {
      const currentFocusable = this.focusable[this.index]
      if (currentFocusable === 'name') this.name = this.removeLastChar(this.name)
      if (currentFocusable === 'password') this.password = this.removeLastChar(this.password)
    },
    any(e) {
      if (e.key.match(/^[\w\s.,;!@#$%^&*()_+\-=[\]{}|\\:'"<>,.?/~`]$/)) {
        this.handleKey(e.key)
      }
    },
  },
})
