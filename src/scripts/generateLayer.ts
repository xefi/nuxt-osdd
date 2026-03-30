#!/usr/bin/env node

import prompts from 'prompts';
import * as fs from 'fs';
import * as path from 'path';
import type { LayerOptions, LayerType } from '../type';
import { registerLayer } from './registerLayer';

const parseCommandLineArguments = (args: string[]): Partial<LayerOptions> => {
    let layerName = '';
    let layerType: LayerType | undefined;

    for (const arg of args) {
        if (arg === '--technical') {
            layerType = 'technical';
        } else if (arg === '--functional') {
            layerType = 'functional';
        } else if (!arg.startsWith('--')) {
            layerName = arg;
        }
    }

    return {
        ...(layerName && { name: layerName }),
        ...(layerType && { type: layerType })
    };
};

const buildPromptQuestions = (parsedArgs: Partial<LayerOptions>): prompts.PromptObject[] => {
    const questions: prompts.PromptObject[] = [];

    if (!parsedArgs.name) {
        questions.push({
            type: 'text',
            name: 'name',
            message: 'Layer name:',
            hint: 'e.g. Authentication, Contracts, UserProfile',
            validate: (value: string) => value.length > 0 || 'Layer name is required'
        });
    }

    if (!parsedArgs.type) {
        questions.push({
            type: 'select',
            name: 'type',
            message: 'Layer type:',
            choices: [
                { title: 'Functional  — business feature (e.g. Contracts, Posts)', value: 'functional' },
                { title: 'Technical   — infrastructure (e.g. Authentication, Permission)', value: 'technical' }
            ],
            initial: 0
        });
    }

    return questions;
};

const resolveLayerOptions = async (parsedArgs: Partial<LayerOptions>): Promise<LayerOptions> => {
    const questions = buildPromptQuestions(parsedArgs);

    if (questions.length === 0) {
        return parsedArgs as LayerOptions;
    }

    const answers = await prompts(questions);

    if (Object.keys(answers).length < questions.length) {
        console.log('Operation cancelled');
        process.exit(0);
    }

    return {
        name: parsedArgs.name ?? answers.name,
        type: parsedArgs.type ?? answers.type
    };
};

const buildLayerPath = (options: LayerOptions): string => {
    return path.resolve(process.cwd(), options.type, options.name);
};

const validateLayerDoesNotExist = (layerPath: string, options: LayerOptions): void => {
    if (fs.existsSync(layerPath)) {
        console.error(`❌ Layer "${options.name}" already exists in ${options.type}`);
        process.exit(1);
    }
};

const createLayerDirectory = (layerPath: string): void => {
    fs.mkdirSync(layerPath, { recursive: true });
};

const NUXT_CONFIG_TEMPLATE = 'export default defineNuxtConfig({\n});\n';

const generateReadmeContent = (options: LayerOptions): string =>
    `# ${options.name}\n\nType: ${options.type}\n\n## Description\n\nAdd your layer description here.\n`;

const writeLayerFiles = (layerPath: string, options: LayerOptions): void => {
    fs.writeFileSync(path.join(layerPath, 'nuxt.config.ts'), NUXT_CONFIG_TEMPLATE);
    fs.writeFileSync(path.join(layerPath, 'README.md'), generateReadmeContent(options));
};

const displaySuccessMessage = (options: LayerOptions, layerPath: string): void =>
    console.log(`Layer "${options.name}" created at ${layerPath}`);

/**
 * Generates a new OSDD layer with interactive prompts
 * 
 * @param args Command line arguments (optional)
 */
export async function generateLayer(args: string[] = process.argv.slice(2)): Promise<void> {
    const parsedArgs = parseCommandLineArguments(args);
    const options = await resolveLayerOptions(parsedArgs);

    const layerPath = buildLayerPath(options);
    validateLayerDoesNotExist(layerPath, options);

    createLayerDirectory(layerPath);
    writeLayerFiles(layerPath, options);
    displaySuccessMessage(options, layerPath);
    await registerLayer(options.type, options.name);
}

if (require.main === module) {
    generateLayer().catch((error) => {
        console.error('Failed to generate layer:', error);
        process.exit(1);
    });
}
