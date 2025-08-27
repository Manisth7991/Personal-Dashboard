// Custom Cypress commands

// Command to login with test user
Cypress.Commands.add('login', (email = 'demo@example.com', password = 'demo123') => {
    cy.visit('/auth/signin')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()
})

// Command to add item to favorites
Cypress.Commands.add('addToFavorites', (itemTitle) => {
    cy.contains(itemTitle).parent().find('button[aria-label*="favorite"]').click()
})

// Command to change language
Cypress.Commands.add('changeLanguage', (language) => {
    cy.get('[data-testid="language-toggle"]').click()
    cy.contains(language).click()
})

// Declare custom commands for TypeScript
declare global {
    namespace Cypress {
        interface Chainable {
            login(email?: string, password?: string): Chainable<void>
            addToFavorites(itemTitle: string): Chainable<void>
            changeLanguage(language: string): Chainable<void>
        }
    }
}
