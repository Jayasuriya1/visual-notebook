import { StudyTextbook, Category, LibraryBackup } from '../types';

/**
 * Lossless JSON Export of the entire library (Textbooks + Categories + User Progress).
 */
export function exportEntireLibrary(textbooks: StudyTextbook[], categories: Category[]): void {
  const backup: LibraryBackup = {
    version: 2,
    exportedAt: new Date().toISOString(),
    categories,
    textbooks
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const today = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `ADHD_Visual_Textbook_Library_${today}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Lossless JSON Export of a single textbook.
 */
export function exportSingleTextbook(textbook: StudyTextbook): void {
  const jsonStr = JSON.stringify(textbook, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const cleanTitle = textbook.videoTitle.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  link.href = url;
  link.download = `${cleanTitle}_Textbook.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  textbooks: StudyTextbook[];
  categories?: Category[];
  importedCount: number;
}

/**
 * Parses and validates an uploaded JSON file without ANY data or formatting loss.
 */
export function parseAndValidateImport(rawJson: string): ImportResult {
  if (!rawJson || !rawJson.trim()) {
    throw new Error('The uploaded file is empty.');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err: any) {
    throw new Error('Invalid JSON format: ' + (err.message || 'Syntax error'));
  }

  // Case 1: Full Library Backup
  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.textbooks)) {
    const validTextbooks = parsed.textbooks.filter(
      (t: any) => t && typeof t.id === 'string' && typeof t.videoTitle === 'string'
    );

    const validCategories = Array.isArray(parsed.categories)
      ? parsed.categories.filter((c: any) => c && typeof c.id === 'string' && typeof c.name === 'string')
      : undefined;

    if (validTextbooks.length === 0) {
      throw new Error('No valid textbooks found in the imported backup file.');
    }

    return {
      textbooks: validTextbooks,
      categories: validCategories,
      importedCount: validTextbooks.length
    };
  }

  // Case 2: Array of Textbooks
  if (Array.isArray(parsed)) {
    const validTextbooks = parsed.filter(
      (t: any) => t && typeof t.id === 'string' && typeof t.videoTitle === 'string'
    );

    if (validTextbooks.length === 0) {
      throw new Error('No valid textbooks found in the imported array.');
    }

    return {
      textbooks: validTextbooks,
      importedCount: validTextbooks.length
    };
  }

  // Case 3: Single Textbook object
  if (parsed && typeof parsed.id === 'string' && typeof parsed.videoTitle === 'string') {
    return {
      textbooks: [parsed],
      importedCount: 1
    };
  }

  throw new Error('Unrecognized textbook format. Please upload a valid JSON textbook or library backup file.');
}
