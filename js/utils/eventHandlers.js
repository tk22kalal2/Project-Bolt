import { PDFPreviewService } from '../services/pdfPreviewService.js';
import { performOCR } from '../services/ocrService.js';
import { generateNotes } from '../services/notesService.js';
import { generateQuestion } from '../services/quizService.js';
import { QuizUI } from '../components/QuizUI.js';
import { showLoading, hideLoading, showError } from './uiHelpers.js';
import { readFileAsArrayBuffer } from '../services/pdfService.js';
import { updateEditorContent } from '../editor/notesEditor.js';

let pdfPreviewService = new PDFPreviewService();
let ocrText = '';

export function setupEventListeners(elements) {
    setupPDFUpload(elements);
    setupSplitPDF(elements);
    setupOCR(elements);
    setupNotesGeneration(elements);
    setupQuizGeneration(elements);
}

function setupPDFUpload(elements) {
    elements.pdfUpload.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            showLoading(elements.loadingIndicator);
            const arrayBuffer = await readFileAsArrayBuffer(file);
            
            if (await pdfPreviewService.loadPDF(arrayBuffer)) {
                elements.splitControls.style.display = 'block';
                elements.ocrControls.style.display = 'block';
                await pdfPreviewService.renderAllPages();
            }
        } catch (error) {
            console.error('Error processing PDF:', error);
            showError(elements.pdfPreview, 'Failed to process PDF');
        } finally {
            hideLoading(elements.loadingIndicator);
        }
    });
}

function setupSplitPDF(elements) {
    elements.splitButton.addEventListener('click', async () => {
        const start = parseInt(elements.startPage.value);
        const end = parseInt(elements.endPage.value);

        try {
            showLoading(elements.loadingIndicator);
            await pdfPreviewService.renderPageRange(start, end);
        } catch (error) {
            console.error('Error splitting PDF:', error);
            showError(elements.splitPreview, 'Failed to split PDF');
        } finally {
            hideLoading(elements.loadingIndicator);
        }
    });
}

function setupOCR(elements) {
    elements.ocrButton.addEventListener('click', async () => {
        try {
            showLoading(elements.loadingIndicator);
            ocrText = await performOCR(elements.pdfPreview);
            elements.ocrTextPreview.style.display = 'block';
            elements.ocrTextPreview.innerHTML = `<pre>${ocrText}</pre>`;
            elements.notesControls.style.display = 'block';
            elements.quizControls.style.display = 'block';
        } catch (error) {
            console.error('OCR Error:', error);
            showError(elements.ocrTextPreview, 'Failed to perform OCR');
        } finally {
            hideLoading(elements.loadingIndicator);
        }
    });
}

function setupNotesGeneration(elements) {
    elements.notesButton.addEventListener('click', async () => {
        if (!ocrText) {
            showError(elements.notesEditorContainer, 'No OCR text available');
            return;
        }

        try {
            showLoading(elements.loadingIndicator);
            const notes = await generateNotes(ocrText);
            elements.notesEditorContainer.style.display = 'block';
            await updateEditorContent(notes);
        } catch (error) {
            console.error('Notes Generation Error:', error);
            showError(elements.notesEditorContainer, 'Failed to generate notes');
        } finally {
            hideLoading(elements.loadingIndicator);
        }
    });
}

function setupQuizGeneration(elements) {
    elements.quizButton.addEventListener('click', async () => {
        if (!ocrText) {
            showError(elements.quizContainer, 'No OCR text available');
            return;
        }
        
        try {
            showLoading(elements.loadingIndicator);
            elements.ocrTextPreview.style.display = 'none';
            elements.quizContainer.style.display = 'block';
            
            const quizUI = new QuizUI(elements.quizContainer);
            const question = await generateQuestion(ocrText);
            quizUI.renderQuestion(question);
            
            // Setup next question handler
            elements.quizContainer.querySelector('#nextQuestion').addEventListener('click', async () => {
                showLoading(elements.loadingIndicator);
                const nextQuestion = await generateQuestion(ocrText);
                quizUI.renderQuestion(nextQuestion);
                hideLoading(elements.loadingIndicator);
            });
        } catch (error) {
            console.error('Quiz Generation Error:', error);
            showError(elements.quizContainer, 'Failed to generate quiz');
        } finally {
            hideLoading(elements.loadingIndicator);
        }
    });
}