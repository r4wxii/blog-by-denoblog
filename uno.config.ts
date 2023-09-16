import { UserConfig, presetWind, presetAttributify } from "unocss"

export const defineConfig: UserConfig = {
    presets: [
        presetWind(),
        presetAttributify(),
    ],
}