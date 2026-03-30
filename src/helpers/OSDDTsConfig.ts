import { LayerType, OSDDLayersConfig, NuxtTsConfigOverride } from "../type";

const buildPathAliasesForLayer = (type: LayerType, name: string): Record<string, string[]> => ({
    [`#${type}/${name}`]: [`../${type}/${name}`],
    [`#${type}/${name}/*`]: [`../${type}/${name}/*`]
});

const buildPathAliasesForType = (type: LayerType, names: string[]): Record<string, string[]> =>
    names.reduce((acc, name) => ({ ...acc, ...buildPathAliasesForLayer(type, name) }), {});

const buildIncludeForType = (type: LayerType): string[] => [
    `../${type}/*/app/**/*`,
    `../${type}/*/modules/*/runtime/**/*`,
    `../${type}/*/shared/**/*.d.ts`,
    `../${type}/*/shared/**/*`,
    `../${type}/*/nuxt.config.*`,
    `../${type}/*/*.d.ts`,
];

const buildExcludeForType = (type: LayerType): string[] => [
    `../${type}/*/node_modules`,
    `../${type}/*/server/**/*`,
    `../${type}/*/modules/*/runtime/server/**/*`,
];

/**
 * Generates a Nuxt-compatible tsConfig override for OSDD functional/technical layers.
 * Nuxt auto-generates paths for `../layers/*` — this covers the missing `functional/` and `technical/` folders.
 * Merge this into `typescript.tsConfig` in your `nuxt.config.ts`.
 *
 * @example
 * // nuxt.config.ts
 * export default defineNuxtConfig({
 *   extends: OSDDLayers({ functional: ['Contracts'], technical: ['Authentication'] }),
 *   typescript: {
 *     tsConfig: OSDDTsConfig({ functional: ['Contracts'], technical: ['Authentication'] })
 *   }
 * })
 *
 * // Generates paths like:
 * // "#functional/Contracts": ["../functional/Contracts"]
 * // "#functional/Contracts/*": ["../functional/Contracts/*"]
 * // "#technical/Authentication": ["../technical/Authentication"]
 * // And include/exclude patterns following Nuxt conventions for each type folder
 */
export const OSDDTsConfig = (config: OSDDLayersConfig): NuxtTsConfigOverride => {
    const paths: Record<string, string[]> = {};
    const include: string[] = [];
    const exclude: string[] = [];

    for (const type in config) {
        const layerType = type as LayerType;
        const names = config[layerType] ?? [];

        Object.assign(paths, buildPathAliasesForType(layerType, names));
        include.push(...buildIncludeForType(layerType));
        exclude.push(...buildExcludeForType(layerType));
    }

    return { compilerOptions: { paths }, include, exclude };
};
