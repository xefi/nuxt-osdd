import { type NuxtConfig } from '@nuxt/schema';
import { defineNuxtConfig } from 'nuxt/config';
import { OSDDLayers } from './OSDDLayers';
import { OSDDTsConfig } from './OSDDTsConfig';

interface OSDDConfig {
    functional?: string[];
    technical?: string[];
}
type OSDDNuxtConfig = NuxtConfig & {
    osdd?: OSDDConfig;
};

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
            typescript: {
                ...config.typescript,
                tsConfig: {
                    ...OSDDTsConfig({
                        functional: config?.osdd?.functional ?? [],
                        technical: config?.osdd?.technical ?? [],
                    }),
                    ...(config.typescript?.tsConfig ?? {}),
                }
            }
        });
};