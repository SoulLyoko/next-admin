import { defineConfig, presetAttributify, presetIcons, presetWind4, transformerAttributifyJsx } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
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
