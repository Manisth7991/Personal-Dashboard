// Cypress E2E support file
import './commands'

// Import Cypress testing library commands
import '@testing-library/cypress/add-commands'

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
    // Return false to prevent the error from failing the test
    return false
})
