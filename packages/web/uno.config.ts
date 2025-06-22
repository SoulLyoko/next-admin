import { defineConfig, presetAttributify, presetIcons, presetWind4, transformerAttributifyJsx, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons(),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerAttributifyJsx(),
  ],
  shortcuts: [
    ['flex-center', 'flex justify-center items-center'],
  ],
})
