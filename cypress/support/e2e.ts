// cypress/support/e2e.ts
import './commands'

// Hide fetch/XHR requests from command log
Cypress.on('window:before:load', (win) => {
    cy.stub(win.console, 'error').as('consoleError')
    cy.stub(win.console, 'warn').as('consoleWarn')
})

// Global before hook to wait for app to be ready
beforeEach(() => {
    // Wait for the page to load
    cy.visit('/')
    cy.wait(1000) // Give time for initial content to load
})
