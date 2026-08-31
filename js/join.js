document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#joinForm');
    
    if (!form) return; // Guard clause to prevent console errors if form is missing

    form.addEventListener('submit', (event) => {
        // ALWAYS pause the submission immediately to inspect the data first
        let isFormValid = true;

        // 1. Get all input, textarea, and select fields inside the form
        const formFields = form.querySelectorAll('input, textarea, select');

        // 2. Loop through every single field
        formFields.forEach(field => {
            // EXCEPTION: Skip your one optional field entirely
            if (field.id === 'optionalFieldId') {
                clearErrorState(field); 
                return; 
            }

            // 3. Validate all other fields
            if (field.value.trim() === '') {
                showErrorState(field);
                isFormValid = false; // Flag that something is missing
            } else {
                clearErrorState(field);
            }
        });

        // 4. Block the Formspree payload entirely if validation failed
        if (!isFormValid) {
            event.preventDefault();
            event.stopImmediatePropagation(); // Prevents third-party scripts from catching submission
            alert('Please fill out all required fields.');
        }
    });
});

// Helper function to show visual error indicators
function showErrorState(field) {
    field.style.border = '2px solid #dc3545';
    field.style.backgroundColor = '#fff8f8';
}

// Helper function to reset visual error indicators
function clearErrorState(field) {
    field.style.border = '';
    field.style.backgroundColor = '';
}