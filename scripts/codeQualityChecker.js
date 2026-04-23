/**
 * Code Quality Checker
 * - Magic Number detection (identifies unnamed numeric constants)
 * - console.log violations (should use Logger instead)
 * - Style tags check (should use CSS classes)
 * - Tag count for UI components
 * - Folder structure check (no loose files in top-level module folders incl. types/, max 5 files per subfolder, no loose files in any nested types/ folder)
 * - Type export location check (interface/type declarations only allowed inside types/ folders)
 */

import fs from 'node:fs';
import path from 'node:path';
import { walkDir, getProjectPaths, getRelativePath } from './checkUtils.js';

const EXCLUDED_TEXT_PATTERNS = [
  /^[MLHVCSQTAZmlhvcsqtaz][\d\s,.MLHVCSQTAZmlhvcsqtaz-]*$/,
  /^[\d\s,.-]+$/,
  /^(noopener|noreferrer|nofollow|_blank|_self|submit|button|reset|text|password|email|number)(\s+(noopener|noreferrer|nofollow|_blank|_self))*$/,
  /^\.[a-z]+$/,
  /^[A-Z0-9]+$/,
  /^[a-zA-Z_]\w*$/,
];

export function checkCodeQuality() {
  const violations = [];
  const { projectRoot, srcDir } = getProjectPaths();

  // 1. Magic Number Check - calculator files in services/
  console.log('Checking services for magic numbers...');

  const servicesDir = path.join(srcDir, 'services');
  
  // Config files are exempt - they ARE the named-constant definitions
  const MAGIC_NUMBER_FILE_IGNORE_PATTERNS = [
    /Config\.ts$/,
    /config\.ts$/,
    /\.test\./,
  ];

  // Numbers that are universally acceptable without a named constant:
  //   12  → months per year
  //   0   → zero/guard value
  //   1   → identity/unit
  //   100 → percentage base
  //   2   → factor (e.g. "both ways")
  //   0.01 → convergence epsilon / rounding guard
  const MAGIC_NUMBER_WHITELIST = new Set([0, 1, 2, 12, 100]);
  const MAGIC_NUMBER_EPSILON = 0.01; // any float <= this is treated as a convergence guard

  // Matches a bare numeric literal used as an operand in an arithmetic expression
  const MAGIC_NUMBER_REGEX =
    /(?:[*/+-]\s*|-\s*)(\d+(?:\.\d+)?)(?!\s*[:,}\]])/g;

  if (fs.existsSync(servicesDir)) {
    walkDir(servicesDir, (file) => {
      if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;
      if (MAGIC_NUMBER_FILE_IGNORE_PATTERNS.some((p) => p.test(file))) return;

      const relFile = getRelativePath(file, projectRoot);
      const lines = fs.readFileSync(file, 'utf8').split('\n');

      lines.forEach((line, idx) => {
        // Skip comment lines and import lines
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('import')) return;

        // Strip inline comments before matching
        const codePart = line.replace(/\/\/.*$/, '');

        let m;
        MAGIC_NUMBER_REGEX.lastIndex = 0;
        while ((m = MAGIC_NUMBER_REGEX.exec(codePart)) !== null) {
          const num = Number.parseFloat(m[1]);
          if (MAGIC_NUMBER_WHITELIST.has(num)) continue;
          if (num <= MAGIC_NUMBER_EPSILON) continue; // convergence epsilon guard

          // Warning only – does not block the build
          console.warn(
            `\x1b[33m⚠ Magic Number Check (services): File '${relFile}' line ${idx + 1}: ` +
            `bare number '${m[1]}' used directly in calculation. Consider extracting it into a named constant in a *Config.ts file.\x1b[0m`
          );
        }
      });
    });
  }

  // 2. Console Log Check
  console.log('Checking for console.log violations...');
  const consoleLogViolations = [];
  
  walkDir(srcDir, (file) => {
    if (
      file.includes(`${path.sep}scripts${path.sep}`) ||
      file.includes(`${path.sep}workers${path.sep}`) ||
      file.includes('.test.') || // Allow console.log in .test. files
      file.includes('logger') // Allow console.log in logger files
    ) {
      return;
    }
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;
    
    const content = fs.readFileSync(file, 'utf8');
    if (/console\.log\(/.test(content)) {
      const relFile = getRelativePath(file, projectRoot);
      consoleLogViolations.push(
        `Console Log Check: Found 'console.log' in file ${relFile}. Use the Logger service instead.`
      );
    }
  });

  if (consoleLogViolations.length > 0) {
    violations.push(...consoleLogViolations);
  }

  // 3. Style Tags & Div/P/Span Tag Count Check in UI components
  console.log('Checking for style tags in UI components...');

  const STYLE_AND_TAG_CHECK_FOLDERS = ['ui', 'container'];

  STYLE_AND_TAG_CHECK_FOLDERS.forEach((folderName) => {
    const folderPath = path.join(srcDir, folderName);
    if (!fs.existsSync(folderPath)) return;

    walkDir(folderPath, (file) => {
      if (!file.endsWith('.tsx')) return;

      const relFile = getRelativePath(file, projectRoot);
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      // Check for style tags (aber nicht className)
      if (/<style[\s>]/.test(content)) {
        violations.push(
          `Style Tags Check (${folderName}): File '${relFile}' contains <style> tags. ` +
          `Use CSS classes instead of inline style tags.`
        );
      }

      // Check div, p, span, label, h1, h2 tag count (skip for ui folder – dumb components may have many tags)
      if (folderName !== 'ui') {
        const tagMatches = content.match(/<(div|p|span|label|h1|h2)[\s>]/g) || [];
        const tagCount = tagMatches.length;
        const lineCount = lines.length;
        const maxAllowed = Math.max(5, Math.ceil(lineCount * 0.1));

        if (tagCount > maxAllowed) {
          violations.push(
            `Tag Count Check (${folderName}): File '${relFile}' has ${tagCount} div/p/span/label/h1/h2 tags, ` +
            `but maximum allowed is ${maxAllowed} (10 or 10% of ${lineCount} lines). ` +
            `Consider breaking this component into smaller sub-components.`
          );
        }
      }
    });
  });

  // 4. Absolute Import Path Check - All imports must use defined @ aliases
  console.log('Checking for absolute import paths with proper @ aliases...');

  // Define allowed import aliases
  const allowedAliases = ['@services', '@components', '@container', '@views', '@ui', '@config', '@types', '@hooks'];

  function isScopedNpmPackage(importPath) {
    const scopedPkgMatch = /^(@[^/]+\/[^/]+)/.exec(importPath);
    if (!scopedPkgMatch) return false;
    const pkgDir = path.join(projectRoot, 'node_modules', scopedPkgMatch[1]);
    return fs.existsSync(pkgDir);
  }

  function validateImportPath(importPath, relFile) {
    if (!importPath.startsWith('@')) return null;
    if (isScopedNpmPackage(importPath)) return null;

    if (importPath.startsWith('../') || importPath.startsWith('./') || importPath.startsWith('/')) {
      return `Absolute Import Check: File '${relFile}' uses relative import path '${importPath}'. ` +
        `All imports must use absolute paths with @ aliases. GOOD: 'import Model from "@services/model"'`;
    }

    const hasValidAlias = allowedAliases.some(alias => importPath.startsWith(alias));
    if (!hasValidAlias) {
      return `Import Alias Check: File '${relFile}' uses invalid import path '${importPath}'. ` +
        `Must use: @services, @components, @views, @ui, @config, @types, @hooks. GOOD: 'import Model from "@services/model"'`;
    }

    if (importPath.startsWith('@services/')) {
      const parts = importPath.split('/');
      const importedService = parts[1];
      const isFileInsideService = relFile.includes(`services/${importedService}/`);
      if (!isFileInsideService && parts.length > 2 && (parts[2] === 'logic' || parts.includes('IService'))) {
        return `Deep Service Import Check: File '${relFile}' bypasses service facade with '${importPath}'. ` +
          `Import service facades only. GOOD: '@services/logger'`;
      }
    }

    return null;
  }

  walkDir(srcDir, (file) => {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;
    if (file.includes('.test.')) return;

    const relFile = getRelativePath(file, projectRoot);
    const content = fs.readFileSync(file, 'utf8');
    const importRegex = /^import\s+.*?\s+from\s+['"]([^'"]+)['"]/gm;

    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const violation = validateImportPath(match[1], relFile);
      if (violation) violations.push(violation);
    }
  });

  // 5. Hardcoded Text Check (i18n migration)
  console.log('Checking for hardcoded text strings (should use i18next)...');

  const HARDCODED_TEXT_CHECK_FOLDERS = ['ui', 'views'];
  const HARDCODED_TEXT_IGNORE_PATTERNS = [
    /\.test\./,
    /Logger/,
    /\.css\.ts$/,
    /onboarding/,  // Onboarding screens excluded from i18n checks
    /FanChart/,    // Data visualization component with hardcoded colors and SVG paths
    /MonteCarloView/, // Refactored from container, i18n migration separate
    /PrognoseContentView/, // Refactored from container, i18n migration separate
  ];

  // Common technical terms and characters that are allowed (not user-facing text)
  const ALLOWED_HARDCODED = new Set([
    // Single characters and symbols
    ':', ',', '.', '!', '?', ';', '/', '-', '_', '+', '=', '(', ')', '[', ']', '{', '}', '$', '%', '@', '#', '&',
    // Empty strings
    '',
    // Aria labels, IDs (technical)
    'id', 'role', 'aria-label', 'className', 'src', 'href', 'target', 'rel', 'type', 'value',
    // Common variable names and technical terms
    'false', 'true', 'null', 'undefined', 'px', 'ms', 'auto', 'center',
    // UUID/ID patterns
    'msg-', 'user', 'assistant', 'chat-message',
    // Emojis and symbols (when used as standalone)
    '⚡', '🧠', '⚙', '💬', '🔧',
    // CSS class names (kebab-case technical identifiers)
    // These are filtered by containing hyphens and being fully lowercase/hyphenated
  ]);

  function isHardcodedText(str) {
    if (!str || str.length < 3) return false;
    if (ALLOWED_HARDCODED.has(str)) return false;
    if (str.startsWith('--') || str.includes('${')) return false;
    if (str.startsWith('http') || str.startsWith('/') || str.startsWith('.')) return false;
    if (EXCLUDED_TEXT_PATTERNS.some(p => p.test(str))) return false;
    if (/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(str) && str.includes('-')) return false;
    if (str.includes('.') && /^[a-zA-Z][a-zA-Z0-9._]*$/.test(str)) return false;
    if (/^[a-z]+-[a-z0-9]+$/i.test(str) && str.length < 15) return false;
    return /[a-zA-ZäöüÄÖÜß]/.test(str);
  }

  function shouldSkipLine(line) {
    const trimmed = line.trim();
    if (trimmed.startsWith('import ') || trimmed.startsWith('//') || trimmed.startsWith('*') ||
        trimmed.startsWith('interface ') || trimmed.startsWith('type ')) return true;
    if (/\bt\(['"]/m.test(line) || /useTranslation/m.test(line)) return true;
    if (line.includes('className') || line.includes('class=') || line.includes('[`') ||
        line.includes('style') || line.includes('CSS')) return true;
    return line.includes('Key=') || line.includes('Key:');
  }

  function collectJsxTextViolations(line, idx, relFile, folderName) {
    const results = [];
    const jsxTextRegex = />([^<>{}`]+)</g;
    let jsxMatch;
    while ((jsxMatch = jsxTextRegex.exec(line)) !== null) {
      const textContent = jsxMatch[1].trim();
      if (textContent.length < 3) continue;
      if (!/[a-zA-ZäöüÄÖÜß]/.test(textContent)) continue;
      if (/^[a-zA-Z_]\w*$/.test(textContent)) continue;
      if (/\bt\(['"]/m.test(line)) continue;
      results.push(
        `Hardcoded JSX Text Check (${folderName}): File '${relFile}' line ${idx + 1} contains hardcoded JSX text: "${textContent}". ` +
        `Use i18next translation function instead: {t('namespace.key')}. ` +
        `Add the text to src/i18n/locales/de.json and en.json, then use useTranslation() hook to access it.`
      );
    }
    return results;
  }

  HARDCODED_TEXT_CHECK_FOLDERS.forEach((folderName) => {
    const folderPath = path.join(srcDir, folderName);
    if (!fs.existsSync(folderPath)) return;

    walkDir(folderPath, (file) => {
      if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
      if (HARDCODED_TEXT_IGNORE_PATTERNS.some((p) => p.test(file))) return;

      const relFile = getRelativePath(file, projectRoot);
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        if (shouldSkipLine(line)) return;

        const stringRegex = /(?<=[=(,:[\s])(['"])([^'"]{3,}?)\1/g;
        let match;
        while ((match = stringRegex.exec(line)) !== null) {
          const stringContent = match[2].trim();
          if (line.substring(0, match.index).includes('//')) continue;
          if (isHardcodedText(stringContent)) {
            violations.push(
              `Hardcoded Text Check (${folderName}): File '${relFile}' line ${idx + 1} contains potential hardcoded text: "${stringContent}". ` +
              `Use i18next translation function instead: t('namespace.key'). ` +
              `Add the text to src/i18n/locales/de.json and en.json, then use useTranslation() hook to access it.`
            );
          }
        }

        violations.push(...collectJsxTextViolations(line, idx, relFile, folderName));
      });
    });
  });

  // 6. Folder Structure Check - No loose files in module folders, max 5 files per subfolder
  console.log('Checking folder structure (views, ui, container, services, hooks)...');

  const STRUCTURE_CHECK_FOLDERS = [ 'ui', 'container', 'services', 'hooks', 'types'];
  const STRUCTURE_EXEMPT_FILES = new Set(['readme.md', '.gitkeep']);

  STRUCTURE_CHECK_FOLDERS.forEach((folderName) => {
    const folderPath = path.join(srcDir, folderName);
    if (!fs.existsSync(folderPath)) return;

    // Check for files directly in the top-level folder (not allowed except ReadMe.md)
    const topLevelEntries = fs.readdirSync(folderPath);
    topLevelEntries.forEach((entry) => {
      const entryPath = path.join(folderPath, entry);
      const stat = fs.statSync(entryPath);
      if (!stat.isDirectory()) {
        if (!STRUCTURE_EXEMPT_FILES.has(entry.toLowerCase())) {
          const relFile = getRelativePath(entryPath, projectRoot);
          violations.push(
            `Folder Structure Check (${folderName}): File '${relFile}' is directly in the '${folderName}/' folder. ` +
            `Files must be placed in a subfolder (e.g. '${folderName}/featureName/${entry}').`
          );
        }
      }
    });

    // Check subfolders for max 5 files rule (ui allows more due to paired .tsx/.css files)
    const maxFilesPerSubfolder = folderName === 'ui' ? 10 : 5;
    function checkSubfolderFileCount(dir) {
      const entries = fs.readdirSync(dir);
      let fileCount = 0;

      entries.forEach((entry) => {
        const entryPath = path.join(dir, entry);
        const stat = fs.statSync(entryPath);
        if (stat.isDirectory()) {
          checkSubfolderFileCount(entryPath);
        } else if (!STRUCTURE_EXEMPT_FILES.has(entry.toLowerCase())) {
          fileCount++;
        }
      });

      if (fileCount > maxFilesPerSubfolder) {
        const relDir = getRelativePath(dir, projectRoot);
        violations.push(
          `Folder Structure Check (${folderName}): Directory '${relDir}' contains ${fileCount} files (max ${maxFilesPerSubfolder} allowed). ` +
          `Split files into further subfolders to keep the structure organized.`
        );
      }
    }

    // Only check subfolders (not the top-level folder itself, that's covered above)
    topLevelEntries.forEach((entry) => {
      const entryPath = path.join(folderPath, entry);
      if (fs.statSync(entryPath).isDirectory()) {
        checkSubfolderFileCount(entryPath);
      }
    });
  });

  // Nested types/ folder check – any types/ directory anywhere in src/ must not contain loose files
  function checkNestedTypesFolders(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach((entry) => {
      const entryPath = path.join(dir, entry);
      if (!fs.statSync(entryPath).isDirectory()) return;

      if (entry === 'types') {
        fs.readdirSync(entryPath).forEach((typeEntry) => {
          const typeEntryPath = path.join(entryPath, typeEntry);
          if (!fs.statSync(typeEntryPath).isDirectory()) {
            if (!STRUCTURE_EXEMPT_FILES.has(typeEntry.toLowerCase())) {
              const relFile = getRelativePath(typeEntryPath, projectRoot);
              violations.push(
                `Folder Structure Check (types): File '${relFile}' is directly inside a 'types/' folder. ` +
                `Files must be placed in a subfolder (e.g. 'types/models/${typeEntry}').`
              );
            }
          }
        });
      }

      checkNestedTypesFolders(entryPath);
    });
  }

  checkNestedTypesFolders(srcDir);

  // 7. Type Export Location Check
  console.log('Checking type export locations...');

  walkDir(srcDir, (file) => {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;
    const relFile = getRelativePath(file, projectRoot);
    const isInTypes = relFile.includes('/types/');
    const isInServices = relFile.includes('/services/');

    const content = fs.readFileSync(file, 'utf8');

    // Type-Exporte sind nur in types und services erlaubt
    if (/export\s+type\s+/.test(content)) {
      if (!isInTypes && !isInServices) {
        violations.push(
          `Type Export Location Check: File '${relFile}' exportiert einen Type. ` +
          `Type-Exporte sind nur in 'types/' oder 'services/' erlaubt.`
        );
      }
    }

    // Enum Exporte sind weiterhin nur in types erlaubt
    if (/export\s+enum\s+/.test(content)) {
      if (!isInTypes) {
        violations.push(
          `Enum Export Location Check: File '${relFile}' exportiert einen Enum. ` +
          `Enum-Exporte sind nur in 'types/' erlaubt, nicht in 'services/' oder anderen Ordnern.`
        );
      }
    }
  });

  return violations;
}

