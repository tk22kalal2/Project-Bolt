export class ErrorHandler {
  static handleError(error, context, element, fallbackMessage) {
    console.error(`${context}:`, error);
    
    if (element) {
      element.innerHTML = `<div class="error-message">
        ${fallbackMessage || 'An error occurred. Please try again.'}
      </div>`;
    }
    
    return null;
  }
  
  static async withErrorHandling(operation, context, element, fallbackMessage) {
    try {
      return await operation();
    } catch (error) {
      return this.handleError(error, context, element, fallbackMessage);
    }
  }
}