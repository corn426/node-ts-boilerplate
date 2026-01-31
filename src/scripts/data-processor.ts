/**
 * Data Processing Script Example
 * Usage: npm run script:data-process -- [options]
 * 
 * Examples:
 *   npm run script:data-process
 *   npm run script:data-process -- --multiplier 3
 *   npm run script:data-process -- -m 5 -c 10
 *   npm run script:data-process -- --format json
 */

import { Command } from 'commander';

interface DataItem {
  id: number;
  name: string;
  value: number;
}

interface ProcessOptions {
  multiplier: number;
  count: number;
  format: 'json' | 'table';
}

// Commander로 CLI 옵션 파싱
const program = new Command();

program
  .name('data-processor')
  .description('데이터 처리 스크립트')
  .version('1.0.0')
  .option('-m, --multiplier <number>', '곱할 값', '2')
  .option('-c, --count <number>', '처리할 아이템 개수', '3')
  .option('-f, --format <type>', '출력 포맷 (json|table)', 'table')
  .parse();

const opts = program.opts();
const options: ProcessOptions = {
  multiplier: parseFloat(opts.multiplier),
  count: parseInt(opts.count, 10),
  format: opts.format as 'json' | 'table',
};

/**
 * Generate sample data
 */
function generateData(count: number): DataItem[] {
  const items: DataItem[] = [];
  const names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
  
  for (let i = 0; i < count; i++) {
    items.push({
      id: i + 1,
      name: `Item ${names[i] || String.fromCharCode(65 + i)}`,
      value: (i + 1) * 100,
    });
  }
  
  return items;
}

async function processData(options: ProcessOptions): Promise<void> {
  console.log('📊 Starting data processing...');
  console.log(`Options: multiplier=${options.multiplier}, count=${options.count}, format=${options.format}\n`);
  
  // Generate data based on count argument
  const data = generateData(options.count);
  
  console.log(`Processing ${data.length} items...`);
  
  // Process data with the specified multiplier
  const processed = data.map((item) => ({
    ...item,
    processedValue: item.value * options.multiplier,
    processedAt: new Date().toISOString(),
  }));
  
  // Display results based on format
  if (options.format === 'json') {
    console.log('\n📈 Processed Results (JSON):');
    console.log(JSON.stringify(processed, null, 2));
  } else {
    console.log('\n📈 Processed Results:');
    processed.forEach((item) => {
      console.log(`  - ${item.name}: ${item.value} × ${options.multiplier} = ${item.processedValue}`);
    });
  }
  
  // Calculate summary
  const total = processed.reduce((sum, item) => sum + item.processedValue, 0);
  const average = total / processed.length;
  
  console.log(`\n📊 Summary:`);
  console.log(`  💰 Total: ${total}`);
  console.log(`  📊 Average: ${average.toFixed(2)}`);
  console.log(`  📦 Items processed: ${processed.length}`);
  
  // Simulate async operation (e.g., API call or file writing)
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  console.log('\n✅ Data processing completed!');
}

// Execute the script
processData(options)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error during data processing:', error);
    process.exit(1);
  });
