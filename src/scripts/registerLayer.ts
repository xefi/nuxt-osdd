#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import type { LayerType } from '../type';

const nuxtConfigPath = path.resolve(process.cwd(), 'nuxt.config.ts');

const validateNuxtConfigExists = (configPath: string): void => {
    if (!fs.existsSync(configPath)) {
        console.error('❌ nuxt.config.ts not found in current directory');
        process.exit(1);
    }
};

const readNuxtConfigContent = (configPath: string): string =>
    fs.readFileSync(configPath, 'utf-8');

const writeNuxtConfigContent = (configPath: string, content: string): void =>
    fs.writeFileSync(configPath, content, 'utf-8');


const addImportIfMissing = (configContent: string, importStatement: string): string => {
    if (configContent.includes(importStatement)) return configContent;
    return importStatement + configContent;
};

const findOsddSection = (configContent: string): RegExpMatchArray | null =>
    configContent.match(/osdd:\s*\{([\s\S]*?)\}/m);

const isLayerAlreadyRegistered = (configContent: string, type: LayerType, name: string): boolean => {
    const osddMatch = findOsddSection(configContent);
    if (!osddMatch) return false;
    const typeArrayRegex = new RegExp(`${type}:\\s*\\[([^\\]]*)\\]`);
    const typeMatch = osddMatch[1].match(typeArrayRegex);
    if (!typeMatch) return false;
    return typeMatch[1].includes(`'${name}'`) || typeMatch[1].includes(`"${name}"`);
};

const addLayerToTypeArray = (configContent: string, type: LayerType, name: string): string => {
    const typeArrayRegex = new RegExp(`(${type}:\\s*\\[)([ \\t]*)(\\])`);
    const typeArrayWithItemsRegex = new RegExp(`(${type}:\\s*\\[)([^\\]]+)(\\])`);

    if (typeArrayWithItemsRegex.test(configContent)) {
        return configContent.replace(typeArrayWithItemsRegex, `$1$2, '${name}'$3`);
    }
    return configContent.replace(typeArrayRegex, `$1'${name}'$3`);
};

const addTypeKeyToOsddSection = (configContent: string, osddMatch: RegExpMatchArray, type: LayerType, name: string): string => {
    const osddBody = osddMatch[0];
    const lastClosingBrace = osddBody.lastIndexOf('}');
    const before = osddBody.substring(0, lastClosingBrace);
    const after = osddBody.substring(lastClosingBrace);
    const updatedOsddBody = `${before}      ${type}: ['${name}'],\n   ${after}`;
    return configContent.replace(osddBody, updatedOsddBody);
};

const injectOsddSection = (configContent: string, type: LayerType, name: string): string =>
    configContent.replace(
        /defineOSDDNuxtConfig\(\{/,
        `defineOSDDNuxtConfig({\n   osdd: {\n      ${type}: ['${name}'],\n   },`
    );

const displaySuccessMessage = (type: LayerType, name: string): void =>
    console.log(`✅ Layer ${type}/${name} successfully registered in nuxt.config.ts`);

const displayAlreadyRegisteredMessage = (type: LayerType, name: string): void =>
    console.log(`✅ Layer ${type}/${name} is already registered in nuxt.config.ts`);

/**
 * Registers a new OSDD layer in the project's nuxt.config.ts
 * Adds the layer name to the osdd.functional or osdd.technical array inside defineOSDDNuxtConfig
 *
 * @param type Layer type ('functional' or 'technical')
 * @param name Layer name
 */
export async function registerLayer(type: LayerType, name: string): Promise<void> {
    validateNuxtConfigExists(nuxtConfigPath);

    let configContent = readNuxtConfigContent(nuxtConfigPath);

    if (isLayerAlreadyRegistered(configContent, type, name)) {
        displayAlreadyRegisteredMessage(type, name);
        return;
    }

    const osddMatch = findOsddSection(configContent);

    if (!osddMatch) {
        configContent = injectOsddSection(configContent, type, name);
    } else {
        const typeExistsInOsdd = new RegExp(`${type}:\\s*\\[`).test(osddMatch[1]);
        configContent = typeExistsInOsdd
            ? addLayerToTypeArray(configContent, type, name)
            : addTypeKeyToOsddSection(configContent, osddMatch, type, name);
    }

    writeNuxtConfigContent(nuxtConfigPath, configContent);
    displaySuccessMessage(type, name);
}
