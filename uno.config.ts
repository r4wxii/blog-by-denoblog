import { UserConfig } from "unocss"
import presetWind from "unocss/preset-wind"
import presetAttributify from "unocss/preset-attributify"

export const defineConfig: UserConfig = {
    presets: [
        presetWind(),
        presetAttributify(),
    ],
}