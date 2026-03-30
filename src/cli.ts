#!/usr/bin/env node

import { generateLayer } from './scripts/generateLayer';

const args = process.argv.slice(2);
const command = args[0];

const displayHelp = () => {
    console.log(`
Usage: npx nuxt-osdd <command> [options]

Commands:
  osdd:layer [name]        Create a new OSDD layer
    Options:
      --technical          Create a technical layer
      --functional        Create a functional layer

Examples:
  npx nuxt-osdd osdd:layer Authentication --functional
  npx nuxt-osdd osdd:layer Database --technical
  npx nuxt-osdd osdd:layer
  `);
};

const shouldDisplayHelp = !command || command === '--help' || command === '-h';

if (shouldDisplayHelp) {
    displayHelp();
    process.exit(0);
}

const handleLayerMakeCommand = () => {
    generateLayer(args.slice(1)).catch((error) => {
        console.error('Failed to generate layer:', error);
        process.exit(1);
    });
};

const handleUnknownCommand = () => {
    console.error(`❌ Unknown command: ${command}`);
    console.log(`Use 'npx nuxt-osdd --help' to see available commands`);
    process.exit(1);
};

switch (command) {
    case 'osdd:layer':
        handleLayerMakeCommand();
        break;
    default:
        handleUnknownCommand();
}
