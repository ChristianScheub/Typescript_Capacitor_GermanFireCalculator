/**
 * Service Components Checker
 * - Modular Facade Service Architecture validation
 * - No imports from UI, Components, or Views in services
 * - Service folder structure (I[Service]Service.ts, index.ts, logic/ folder)
 * - Unused exports detection in services
 * - Atomization (max 2 exports per logic file)
 */

import fs from 'node:fs';
import path from 'node:path';
import { walkDir, getProjectPaths, getRelativePath } from './checkUtils.js';

function checkRequiredFiles(serviceName, relPath, hasIndexTs, interfaceFiles, logicFolder, violations) {
  const upperName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
  if (!hasIndexTs) {
    violations.push(
      `Service Structure (Modular Facade Pattern): Service '${relPath}' missing 'index.ts'. ` +
      `Each service must have a Facade index.ts that exports typed methods.`
    );
  }
  if (interfaceFiles.length === 0) {
    violations.push(
      `Service Structure (Modular Facade Pattern): Service '${relPath}' missing interface file. ` +
      `Expected: I${upperName}Service.ts (pure interface definition).`
    );
  } else if (interfaceFiles.length > 1) {
    violations.push(
      `Service Structure (Modular Facade Pattern): Service '${relPath}' has ${interfaceFiles.length} interface files. ` +
      `Expected exactly one: I${upperName}Service.ts`
    );
  }
  if (!logicFolder) {
    violations.push(
      `Service Structure (Modular Facade Pattern): Service '${relPath}' missing 'logic' folder. ` +
      `All implementation logic must be in a './logic/' subfolder.`
    );
  }
}

function checkReadme(servicePath, relPath, files, violations) {
  if (!files.includes('README.md')) {
    violations.push(
      `Service Documentation: Service '${relPath}' missing 'README.md'. ` +
      `Each service must have a README.md file (minimum 50 characters) describing its purpose and responsibilities.`
    );
    return;
  }
  const readmeContent = fs.readFileSync(path.join(servicePath, 'README.md'), 'utf8');
  if (readmeContent.trim().length < 50) {
    violations.push(
      `Service Documentation: Service '${relPath}/README.md' is too short (${readmeContent.trim().length} characters). ` +
      `README.md must be at least 50 characters and describe the service's purpose and key responsibilities.`
    );
  }
}

function checkImplFiles(relPath, otherFiles, violations) {
  const invalidFiles = otherFiles.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  if (invalidFiles.length > 0) {
    violations.push(
      `Service Structure (Modular Facade Pattern): Service '${relPath}' has implementation files in main folder: [${invalidFiles.join(', ')}]. ` +
      `Only 'index.ts' and 'I*Service.ts' interface files are allowed in main folder. Implementation must be in './logic/' subfolder.`
    );
  }
}

function checkIndexFacade(servicePath, relPath, serviceName, interfaceFiles, violations) {
  const indexContent = fs.readFileSync(path.join(servicePath, 'index.ts'), 'utf8');
  const exportConstLines = (indexContent.match(/^export\s+(const|type|interface)\s+\w+/gm) || []).length;
  const exportReBraceLines = (indexContent.match(/^export\s*\{\s*\w+/gm) || []).length;

  if (exportConstLines === 0 && exportReBraceLines === 0) {
    violations.push(
      `Facade Pattern (${relPath}/index.ts): Must have at least one export. ` +
      `The facade should export a typed object and its type(s).`
    );
  }
  if (interfaceFiles.length !== 1) return;

  const interfaceNameMatch = interfaceFiles[0].match(/^(I\w+Service)\.ts$/);
  if (!interfaceNameMatch) return;

  const interfaceName = interfaceNameMatch[1];
  const interfaceContent = fs.readFileSync(path.join(servicePath, interfaceFiles[0]), 'utf8');
  const hasInterfaceDefinition = new RegExp(String.raw`export\s+interface\s+${interfaceName}`).test(interfaceContent);
  if (!hasInterfaceDefinition) return;

  const typedExportPattern = new RegExp(String.raw`const\s+\w+\s*:\s*${interfaceName}\s*=`);
  if (!typedExportPattern.test(indexContent)) {
    violations.push(
      `Facade Type Contract (${relPath}/index.ts): Exported const must be explicitly typed with '${interfaceName}'. ` +
      `Example: const ${serviceName}Service: ${interfaceName} = { ... } ` +
      `This ensures the facade strictly conforms to its interface contract and prevents undeclared methods.`
    );
  }
}

function checkInterfaceFile(servicePath, interfaceFile, relPath, violations) {
  const interfaceContent = fs.readFileSync(path.join(servicePath, interfaceFile), 'utf8');
  const lines = interfaceContent.split('\n');
  const indicators = ['async', 'function', 'class', 'const ', '= ', 'if(', 'for(', 'while(', 'switch('];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed === '') continue;
    if (trimmed.startsWith('import')) continue;
    if (trimmed.startsWith('export interface') || trimmed.startsWith('export type') ||
      trimmed.startsWith('interface ') || trimmed.startsWith('type ')) continue;
    if (indicators.some(ind => trimmed.includes(ind)) && !trimmed.startsWith('}') && !trimmed.startsWith('[')) {
      violations.push(
        `Service Interface (${relPath}/${interfaceFile}): Found code implementation at line ${i + 1}. ` +
        `Interface files must only have 'export interface' and 'export type' definitions, no implementation.`
      );
      break;
    }
  }
}

function checkLogicFolder(servicePath, projectRoot, violations) {
  const logicPath = path.join(servicePath, 'logic');
  try {
    if (!fs.statSync(logicPath).isDirectory()) return;
  } catch {
    return;
  }
  walkDir(logicPath, (file) => {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;
    const relFile = getRelativePath(file, projectRoot);
    const content = fs.readFileSync(file, 'utf8');
    const exportCount = (content.match(/^export\s+(?:const|function|class|default)/gm) || []).length;
    if (exportCount > 2) {
      violations.push(
        `Service Atomization (${relFile}): Exports ${exportCount} items. ` +
        `Maximum 2 exports per file in logic subfolder. Keep files focused on a single responsibility.`
      );
    }
  });
}

export function checkServiceComponents() {
  const violations = [];
  const { projectRoot, srcDir } = getProjectPaths();

  const servicesDir = path.join(srcDir, 'services');
  if (!fs.existsSync(servicesDir)) {
    return violations;
  }

  // 1. Unused Exports Check - services folder
  console.log('Checking services folder for unused exports...');

  // Collect all non-test src files for usage search
  const allSrcFiles = [];
  walkDir(srcDir, (file) => {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;
    if (file.includes('.test.')) return;
    allSrcFiles.push(file);
  });

  // Regexes to extract named exports from service files
  const EXPORT_DECL_REGEX = /^export\s+[\w\s]*(?:function|const|class)\s+([$\w]+)/gm;
  const EXPORT_BRACE_REGEX = /^export\s*\{\s*([$\w]+)/gm;

  walkDir(servicesDir, (file) => {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;
    if (file.includes('.test.')) return;

    const content = fs.readFileSync(file, 'utf8');
    const relFile = getRelativePath(file, projectRoot);

    // Skip service facade index files and interface files - they are meant to be pure exports
    if (relFile.includes('/index.ts') || relFile.includes('IService')) {
      return;
    }

    // Usage content = all non-test src files EXCEPT the file being checked itself
    const usageContents = allSrcFiles
      .filter((f) => f !== file)
      .map((f) => fs.readFileSync(f, 'utf8'))
      .join('\n');

    const exportNames = new Set();
    let match;
    EXPORT_DECL_REGEX.lastIndex = 0;
    while ((match = EXPORT_DECL_REGEX.exec(content)) !== null) {
      exportNames.add(match[1]);
    }
    EXPORT_BRACE_REGEX.lastIndex = 0;
    while ((match = EXPORT_BRACE_REGEX.exec(content)) !== null) {
      exportNames.add(match[1]);
    }
    for (const exportName of exportNames) {
      const usageRegex = new RegExp(String.raw`\b${exportName}\b`);
      if (!usageRegex.test(usageContents)) {
        violations.push(
          `Unused Export Check (services): '${exportName}' in '${relFile}' is exported but never used in src (excluding test files).`
        );
      }
    }
  });

  // 2. Layer Boundary Check - Services must not import from UI, Components, or Views
  console.log('Checking layer boundary import rules for Services...');

  const FORBIDDEN_IMPORTS_IN_SERVICES = [
    { pattern: /from\s+['"][^'"]*\/components\//, label: 'components/' },
    { pattern: /from\s+['"][^'"]*\/views\//, label: 'views/' },
    { pattern: /from\s+['"][^'"]*\/ui\//, label: 'ui/' },
  ];

  walkDir(servicesDir, (file) => {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;

    const relFile = getRelativePath(file, projectRoot);
    const content = fs.readFileSync(file, 'utf8');

    FORBIDDEN_IMPORTS_IN_SERVICES.forEach(({ pattern, label }) => {
      if (pattern.test(content)) {
        violations.push(
          `Layer Boundary Check (services): File '${relFile}' imports from forbidden layer '${label}'. ` +
          `Services are pure business logic and must not know about UI, components, or views.`
        );
      }
    });
  });

  // 3. Modular Facade Service Architecture Check
  console.log('Checking Modular Facade Service Architecture compliance...');

  // Check 0: No .ts/.tsx files allowed directly in services/ folder
  const filesInServicesRoot = fs.readdirSync(servicesDir);
  const tsFilesInRoot = filesInServicesRoot.filter(name =>
    (name.endsWith('.ts') || name.endsWith('.tsx')) && name !== 'README.md'
  );

  if (tsFilesInRoot.length > 0) {
    violations.push(
      `Service Structure (Modular Facade Pattern): Found individual .ts/.tsx files directly in 'src/services/': [${tsFilesInRoot.join(', ')}]. ` +
      `Services must be organized in folders. Each service must have its own folder with index.ts, I[ServiceName]Service.ts, and a logic/ subfolder.`
    );
  }

  // External/third-party services that must not be restructured
  const EXTERNAL_SERVICES = new Set(['Ads']);

  const serviceFolderNames = fs.readdirSync(servicesDir)
    .filter(name => {
      const fullPath = path.join(servicesDir, name);
      try {
        const isDir = fs.statSync(fullPath).isDirectory();
        return isDir && name !== 'README.md';
      } catch {
        return false;
      }
    });

  serviceFolderNames.forEach((serviceName) => {
    if (EXTERNAL_SERVICES.has(serviceName)) return;
    const servicePath = path.join(servicesDir, serviceName);
    const files = fs.readdirSync(servicePath);
    const relPath = getRelativePath(servicePath, projectRoot);

    const hasIndexTs = files.includes('index.ts');
    const interfaceFiles = files.filter(f => f.match(/^I[A-Z]\w*Service\.ts$/));
    const logicFolder = files.includes('logic');
    const mainFolderFiles = new Set(['index.ts', ...interfaceFiles]);
    const otherFiles = files.filter(f => !mainFolderFiles.has(f) && f !== 'logic' && !f.startsWith('.'));

    checkRequiredFiles(serviceName, relPath, hasIndexTs, interfaceFiles, logicFolder, violations);
    checkReadme(servicePath, relPath, files, violations);
    checkImplFiles(relPath, otherFiles, violations);
    if (hasIndexTs) checkIndexFacade(servicePath, relPath, serviceName, interfaceFiles, violations);
    if (interfaceFiles.length === 1) checkInterfaceFile(servicePath, interfaceFiles[0], relPath, violations);
    if (logicFolder) checkLogicFolder(servicePath, projectRoot, violations);
  });

  return violations;
}
