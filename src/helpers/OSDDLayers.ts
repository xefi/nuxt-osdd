import { LayerType, OSDDLayersConfig } from "../type";

/**
 * Returns the relative path to an OSDD layer
 *
 * @example
 * layerPath('functional', 'Authentication') // => './functional/Authentication'
 */
export const layerPath = (type: LayerType, name: string): string =>
    `./${type}/${name}`;

/**
 * Returns an array of relative layer paths from a config object
 *
 * @example
 * OSDDLayers({
 *   functional: ['Contracts', 'Posts'],
 *   technical: ['Authentication', 'Permission']
 * }) // => ['./functional/Contracts', './functional/Posts', './technical/Authentication', './technical/Permission']
 */
export const OSDDLayers = (config: OSDDLayersConfig): string[] => {
    const layers: string[] = [];
    for (const type in config) {
        const names = config[type as LayerType] ?? [];
        names.forEach(name => layers.push(layerPath(type as LayerType, name)));
    }
    return layers;
};
