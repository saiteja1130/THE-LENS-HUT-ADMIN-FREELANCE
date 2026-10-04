import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, 'src');
const INDEX_HTML = path.resolve(__dirname, 'index.html');
const VITE_CONFIG_TS = path.resolve(__dirname, 'vite.config.ts');

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const keepOriginals = args.includes('--keep') || args.includes('--keep-ts');

console.log('====================================================');
console.log(' The Lens Hut Admin - TypeScript to JS/JSX Converter');
console.log('====================================================');
if (isDryRun) {
  console.log('🔍 MODE: DRY RUN (no files will be written or deleted)\n');
}

/**
 * Recursively get all files from a directory
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

/**
 * Convert a TypeScript / TSX file to JavaScript / JSX
 */
function convertFile(filePath) {
  const ext = path.extname(filePath);
  if (ext !== '.ts' && ext !== '.tsx') return null;
  if (filePath.endsWith('.d.ts')) {
    // Definition files have no runtime JavaScript
    return { skipped: true, reason: 'Type declaration file (.d.ts)', filePath };
  }

  const code = fs.readFileSync(filePath, 'utf8');
  const isTsx = ext === '.tsx';
  const targetExt = isTsx ? '.jsx' : '.js';
  const targetPath = filePath.slice(0, -ext.length) + targetExt;

  try {
    const result = esbuild.transformSync(code, {
      loader: isTsx ? 'tsx' : 'ts',
      jsx: 'preserve',
      target: 'esnext',
      format: 'esm',
    });

    let transformedCode = result.code;

    // If file was purely type definitions, ensure it remains a valid empty ES module
    if (!transformedCode.trim()) {
      transformedCode = '// Type definitions stripped during JS conversion\nexport {};\n';
    }

    return {
      success: true,
      sourcePath: filePath,
      targetPath,
      transformedCode,
    };
  } catch (error) {
    return {
      success: false,
      sourcePath: filePath,
      targetPath,
      error: error.message,
    };
  }
}

/**
 * Main execution
 */
function run() {
  const allFiles = getAllFiles(SRC_DIR);
  const targetFiles = allFiles.filter(
    (f) => (f.endsWith('.ts') || f.endsWith('.tsx')) && !f.endsWith('.d.ts')
  );

  console.log(`Found ${targetFiles.length} TypeScript files in src/ to convert.\n`);

  let convertedCount = 0;
  let errorCount = 0;

  for (const filePath of targetFiles) {
    const relSource = path.relative(__dirname, filePath).replace(/\\/g, '/');
    const res = convertFile(filePath);

    if (!res) continue;

    if (res.skipped) {
      console.log(`⏭️  Skipped: ${relSource} (${res.reason})`);
      continue;
    }

    const relTarget = path.relative(__dirname, res.targetPath).replace(/\\/g, '/');

    if (!res.success) {
      console.error(`❌ Error converting ${relSource}: ${res.error}`);
      errorCount++;
      continue;
    }

    if (isDryRun) {
      console.log(`[DRY RUN] Would convert: ${relSource} -> ${relTarget}`);
    } else {
      fs.writeFileSync(res.targetPath, res.transformedCode, 'utf8');
      if (!keepOriginals) {
        fs.unlinkSync(filePath);
      }
      console.log(`✅ Converted: ${relSource} -> ${relTarget}`);
    }
    convertedCount++;
  }

  // Update index.html reference (/src/main.tsx -> /src/main.jsx)
  if (fs.existsSync(INDEX_HTML)) {
    const htmlContent = fs.readFileSync(INDEX_HTML, 'utf8');
    if (htmlContent.includes('/src/main.tsx')) {
      if (isDryRun) {
        console.log(`\n[DRY RUN] Would update index.html: /src/main.tsx -> /src/main.jsx`);
      } else {
        const updatedHtml = htmlContent.replace('/src/main.tsx', '/src/main.jsx');
        fs.writeFileSync(INDEX_HTML, updatedHtml, 'utf8');
        console.log(`\n📄 Updated index.html entry script to /src/main.jsx`);
      }
    }
  }

  // Convert vite.config.ts if it exists
  if (fs.existsSync(VITE_CONFIG_TS)) {
    const viteRes = convertFile(VITE_CONFIG_TS);
    if (viteRes && viteRes.success) {
      const relSource = path.relative(__dirname, viteRes.sourcePath).replace(/\\/g, '/');
      const relTarget = path.relative(__dirname, viteRes.targetPath).replace(/\\/g, '/');
      if (isDryRun) {
        console.log(`[DRY RUN] Would convert: ${relSource} -> ${relTarget}`);
      } else {
        fs.writeFileSync(viteRes.targetPath, viteRes.transformedCode, 'utf8');
        if (!keepOriginals) {
          fs.unlinkSync(VITE_CONFIG_TS);
        }
        console.log(`✅ Converted root config: ${relSource} -> ${relTarget}`);
      }
    }
  }

  console.log('\n====================================================');
  console.log(`Summary:`);
  console.log(`  Total files processed: ${convertedCount}`);
  console.log(`  Errors encountered:   ${errorCount}`);
  if (isDryRun) {
    console.log(`\nTo run the actual conversion, execute:`);
    console.log(`  node convert-to-js.mjs`);
  } else {
    console.log(`\nConversion complete!`);
  }
  console.log('====================================================\n');
}

run();
