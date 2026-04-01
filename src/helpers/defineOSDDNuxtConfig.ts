import { defineNuxtConfig } from 'nuxt/config';
import { OSDDLayers } from './OSDDLayers';
import { OSDDNuxtConfig } from '../type';

/**
 * Wraps `defineNuxtConfig` with OSDD layer support.
 * The `osdd` config key auto-populates `extends` and `typescript.tsConfig`.
 *
 * @example
 * export default defineOSDDNuxtConfig({
 *   osdd: {
 *     functional: ['Contracts'],
 *     technical: ['Authentication'],
 *   }
 * })
 */
export const defineOSDDNuxtConfig = (config: OSDDNuxtConfig) => {
    const normalizedExtends = config?.extends ? Array.isArray(config.extends) ? config.extends : [config.extends] : [];
    return defineNuxtConfig
        ({
            ...config,
            extends: [
                ...normalizedExtends,
                //@ts-ignore
                ...OSDDLayers({
                    functional: config?.osdd?.functional ?? [],
                    technical: config?.osdd?.technical ?? [],
                })
            ],
        });
};