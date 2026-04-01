export type LayerType = 'functional' | 'technical';

export type OSDDLayersConfig = Partial<Record<LayerType, string[]>>;

export interface LayerOptions {
    name: string;
    type: LayerType;
}

export interface OSDDConfig {
    functional?: string[];
    technical?: string[];
}

export type OSDDNuxtConfig = NuxtConfig & {
    osdd?: OSDDConfig;
};
