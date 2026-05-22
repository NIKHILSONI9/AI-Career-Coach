import fs from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseResume(filePath: string, mimeType: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  if (mimeType === 'application/pdf') {
    const data = await pdf(buffer);
    return data.text;
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  throw new Error('Unsupported file type');
}