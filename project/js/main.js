import { initializeEditor } from './editor/notesEditor.js';
import { setupEventListeners } from './utils/eventHandlers.js';
import { initializeSidebar } from './utils/sidebarHandler.js';

export function initializeApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupApplication);
    } else {
        setupApplication();
    }
}

function setupApplication() {
    const elements = {
        pdfUpload: document.getElementById("pdfUpload"),
        pdfPreview: document.getElementById("pdfPreview"),
        splitPreview: document.getElementById("splitPreview"),
        splitControls: document.getElementById("splitControls"),
        ocrControls: document.getElementById("ocrControls"),
        splitButton: document.getElementById("splitButton"),
        ocrButton: document.getElementById("ocrButton"),
        notesButton: document.getElementById("notesButton"),
        startPage: document.getElementById("startPage"),
        endPage: document.getElementById("endPage"),
        ocrTextPreview: document.getElementById("ocrTextPreview"),
        loadingIndicator: document.getElementById("loadingIndicator"),
        notesControls: document.getElementById("notesControls"),
        notesEditorContainer: document.getElementById("notesEditorContainer"),
        quizButton: document.getElementById("quizButton"),
        quizContainer: document.getElementById("quizContainer"),
        quizControls: document.getElementById("quizControls")
    };

    if (!validateElements(elements)) {
        console.error('Required DOM elements not found');
        return;
    }
    
    initializeSidebar();
    setupEventListeners(elements);
    initializeEditor();
}

function validateElements(elements) {
    return Object.values(elements).every(element => element !== null);
}

initializeApp();