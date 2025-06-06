import { defineConfig, presetAttributify, presetIcons, presetWind3, transformerAttributifyJsx } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons(),
  ],
  transformers: [
    transformerAttributifyJsx(),
  ],
  shortcuts: [
    ['flex-center', 'flex justify-center items-center'],
  ],
})
