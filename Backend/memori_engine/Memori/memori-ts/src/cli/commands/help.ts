import { printBanner } from '../utils.js';

export function helpCommand(_args: string[]): Promise<void> {
  printBanner();
  console.log('Usage: memori <command> [options]\n');
  console.log('Available Commands:');
  console.log('  help        Display this help message\n');

  return Promise.resolve();
}
