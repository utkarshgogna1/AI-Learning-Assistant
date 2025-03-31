#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Function to find all TypeScript and TSX files in a directory
function findFiles(dir, extensions = ['.ts', '.tsx'], excludeDirs = ['node_modules', '.next', 'public']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip excluded directories
      if (!excludeDirs.includes(file)) {
        // Recursively search subdirectories
        results = results.concat(findFiles(fullPath, extensions, excludeDirs));
      }
    } else if (extensions.includes(path.extname(file))) {
      results.push(fullPath);
    }
  });
  
  return results;
}

// Function to update imports in a file
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Look for relative imports that go up multiple directories
  const relativeImportRegex = /from\s+['"](\.\.\/)+(components|lib)/g;
  if (relativeImportRegex.test(content)) {
    // Replace relative imports with path aliases
    content = content.replace(/from\s+['"](\.\.\/)+components\//g, 'from \'@/components/');
    content = content.replace(/from\s+['"](\.\.\/)+lib\//g, 'from \'@/lib/');
    updated = true;
  }
  
  if (updated) {
    console.log(`Updated imports in: ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
  
  return updated;
}

// Main function to run the script
async function main() {
  console.log('Finding TypeScript files...');
  const files = findFiles('src');
  console.log(`Found ${files.length} TypeScript files.`);
  
  let updatedCount = 0;
  
  for (const file of files) {
    if (updateImports(file)) {
      updatedCount++;
    }
  }
  
  console.log(`Updated imports in ${updatedCount} files.`);
  
  // Run build to verify changes
  if (updatedCount > 0) {
    console.log('Running build to verify changes...');
    exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        console.error(`Build error: ${error.message}`);
        return;
      }
      console.log(stdout);
      console.log('Build completed successfully!');
    });
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 