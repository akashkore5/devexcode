export interface Column {
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
  references?: { table: string; column: string };
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface Relationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

export interface ParsedSchema {
  tables: Table[];
  relationships: Relationship[];
  errors: string[];
}

function splitByCommaRespectingParens(str: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of str) {
    if (char === '(') depth++;
    else if (char === ')') depth--;
    else if (char === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current);
  return parts;
}

// Extract the body between balanced parens starting right after the opening (
function extractBalancedBody(sql: string, openPos: number): string | null {
  let depth = 1;
  let i = openPos;
  while (i < sql.length && depth > 0) {
    if (sql[i] === '(') depth++;
    else if (sql[i] === ')') depth--;
    i++;
  }
  if (depth !== 0) return null;
  return sql.slice(openPos, i - 1);
}

function parseTableBody(
  tableName: string,
  body: string,
  relationships: Relationship[]
): Table {
  const columns: Column[] = [];
  const tableRels: { fromCol: string; toTable: string; toCol: string }[] = [];
  const parts = splitByCommaRespectingParens(body);
  const compositePKs = new Set<string>();

  // First pass: collect composite PKs and standalone FK constraints
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // PRIMARY KEY (col1, col2)
    const pkMatch = trimmed.match(
      /^(?:CONSTRAINT\s+\w+\s+)?PRIMARY\s+KEY\s*\(([^)]+)\)/i
    );
    if (pkMatch) {
      pkMatch[1].split(',').forEach(c => compositePKs.add(c.trim().replace(/[`"']/g, '')));
      continue;
    }

    // FOREIGN KEY (col) REFERENCES table(col)
    const fkMatch = trimmed.match(
      /^(?:CONSTRAINT\s+\w+\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+[`"']?(\w+)[`"']?\s*\(([^)]+)\)/i
    );
    if (fkMatch) {
      const fromCols = fkMatch[1].split(',').map(c => c.trim().replace(/[`"']/g, ''));
      const toTable = fkMatch[2];
      const toCols = fkMatch[3].split(',').map(c => c.trim().replace(/[`"']/g, ''));
      fromCols.forEach((fromCol, i) => {
        tableRels.push({ fromCol, toTable, toCol: toCols[i] ?? toCols[0] });
      });
      continue;
    }
  }

  // Second pass: parse column definitions
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (/^(PRIMARY|FOREIGN|UNIQUE|CHECK|CONSTRAINT|INDEX|KEY)\s/i.test(trimmed)) continue;

    // Column: name type [constraints...]
    const colMatch = trimmed.match(/^[`"']?(\w+)[`"']?\s+(\w+(?:\s*\([^)]*\))?)(.*)/i);
    if (!colMatch) continue;

    const colName = colMatch[1];
    const colType = colMatch[2].toUpperCase();
    const rest = colMatch[3];
    const restUpper = rest.toUpperCase();

    const isPrimary = restUpper.includes('PRIMARY KEY') || compositePKs.has(colName);
    const isNullable = !restUpper.includes('NOT NULL') && !isPrimary;
    const isUnique = restUpper.includes('UNIQUE');

    let references: { table: string; column: string } | undefined;
    const refMatch = rest.match(/REFERENCES\s+[`"']?(\w+)[`"']?\s*\(([^)]+)\)/i);
    if (refMatch) {
      references = { table: refMatch[1], column: refMatch[2].trim().replace(/[`"']/g, '') };
      tableRels.push({
        fromCol: colName,
        toTable: refMatch[1],
        toCol: refMatch[2].trim().replace(/[`"']/g, ''),
      });
    }

    columns.push({ name: colName, type: colType, isPrimary, isNullable, isUnique, references });
  }

  // Apply FK references to column objects and collect global relationships
  for (const rel of tableRels) {
    const col = columns.find(c => c.name === rel.fromCol);
    if (col && !col.references) {
      col.references = { table: rel.toTable, column: rel.toCol };
    }
    const exists = relationships.some(
      r => r.fromTable === tableName && r.fromColumn === rel.fromCol && r.toTable === rel.toTable
    );
    if (!exists) {
      relationships.push({
        fromTable: tableName,
        fromColumn: rel.fromCol,
        toTable: rel.toTable,
        toColumn: rel.toCol,
      });
    }
  }

  return { name: tableName, columns };
}

export function parseSql(sql: string): ParsedSchema {
  const tables: Table[] = [];
  const relationships: Relationship[] = [];
  const errors: string[] = [];

  const cleaned = sql
    .replace(/--[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim();

  // Find each CREATE TABLE start, then use balanced-paren extraction for the body
  const headerRegex =
    /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"']?(\w+)[`"']?\s*\(/gi;

  let match;
  while ((match = headerRegex.exec(cleaned)) !== null) {
    const tableName = match[1];
    const openPos = match.index + match[0].length; // position right after the opening (

    const body = extractBalancedBody(cleaned, openPos);
    if (body === null) {
      errors.push(`Unbalanced parentheses in CREATE TABLE ${tableName}`);
      continue;
    }

    tables.push(parseTableBody(tableName, body, relationships));

    // Advance the regex past the body we just consumed so it doesn't re-match
    headerRegex.lastIndex = openPos + body.length + 1;
  }

  if (tables.length === 0 && cleaned.length > 10) {
    errors.push(
      'No CREATE TABLE statements found. Use standard SQL: CREATE TABLE name (columns...);'
    );
  }

  return { tables, relationships, errors };
}
