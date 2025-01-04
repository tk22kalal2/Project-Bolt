// ... (keep all existing code above)

// Update the save notes handler
document.getElementById('saveNotesButton').addEventListener('click', async () => {
    try {
        loadingIndicator.style.display = 'block';
        const editor = tinymce.get('notesEditor');
        const content = editor.getContent();

        // Create container for PDF generation
        const container = document.createElement('div');
        container.innerHTML = content;
        document.body.appendChild(container);

        // Configure PDF options
        const opt = {
            margin: 1,
            filename: 'processed-notes.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'in', 
                format: 'letter', 
                orientation: 'portrait' 
            }
        };

        // Generate PDF using html2pdf
        await html2pdf().set(opt).from(container).save();
        
        // Clean up
        document.body.removeChild(container);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    } finally {
        loadingIndicator.style.display = 'none';
    }
});