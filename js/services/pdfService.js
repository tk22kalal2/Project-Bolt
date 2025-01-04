import { ErrorHandler } from '../utils/errorHandler.js';

export async function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function processPDF(file, previewElement) {
  return ErrorHandler.withErrorHandling(
    async () => {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      return pdf;
    },
    'PDF Processing',
    previewElement,
    'Failed to process PDF. Please try again.'
  );
}