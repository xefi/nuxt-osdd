export type LayerType = 'functional' | 'technical';

export type OSDDLayersConfig = Partial<Record<LayerType, string[]>>;

export interface LayerOptions {
    name: string;
    type: LayerType;
}

export interface NuxtTsConfigOverride {
    compilerOptions?: {
        paths?: Record<string, string[]>;
    };
    include?: string[];
    exclude?: string[];
}