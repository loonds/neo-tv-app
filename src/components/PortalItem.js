/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import Blits from '@lightningjs/blits'

export default Blits.Component('PortalItem', {
  template: `
    <Element
      w="370"
      h="320"
      :scale.transition="$hasFocus ? 1.1 : 1"
      :color="$backgroundColor"
      :effects="[{type: 'radius', props: {radius: 6}}]"
    >
      <Element src="$image" w="300" h="250" x="60" />
      <!-- <Text x="30" y="140" :content="$title" size="42" font="raleway" :color="$fontColor" letterspacing="2" /> -->
      <!-- <Text x="30" y="200" :content="$description" maxwidth="300" size="28" :color="$fontColor" lineheight="32" /> -->
    </Element>
  `,
  props: ['title', 'image', 'description', 'id', 'stream_url'],
  state() {
    return {
      backgroundColor: '#44037a',
      fontColor: '#e8d7f9',
    }
  },
  hooks: {
    focus() {
      this.backgroundColor = '#fafafa'
      this.fontColor = '#000'
    },
    unfocus() {
      if (!this.$router.navigating) {
        this.backgroundColor = '#44037a'
        this.fontColor = '#e8d7f9'
      }
    },
  },
  input: {
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
