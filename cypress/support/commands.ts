// cypress/support/commands.ts

// Custom commands for testing

Cypress.Commands.add('getByTestId', (selector: string) => {
    return cy.get(`[data-testid="${selector}"]`)
})

Cypress.Commands.add('login', (username: string, password: string) => {
    cy.session([username, password], () => {
        cy.visit('/auth/signin')
        cy.get('input[name="email"]').type(username)
        cy.get('input[name="password"]').type(password)
        cy.get('button[type="submit"]').click()
        cy.url().should('not.include', '/auth/signin')
    })
})

Cypress.Commands.add('searchFor', (query: string) => {
    cy.get('input[placeholder*="Search"]').clear().type(query)
    cy.get('input[placeholder*="Search"]').type('{enter}')
})

Cypress.Commands.add('waitForContent', () => {
    cy.get('[data-testid="content-card"]').should('have.length.greaterThan', 0)
})

// Declare custom commands for TypeScript
declare global {
    namespace Cypress {
        interface Chainable {
            getByTestId(selector: string): Chainable<JQuery<HTMLElement>>
            login(username: string, password: string): Chainable<void>
            searchFor(query: string): Chainable<void>
            waitForContent(): Chainable<void>
        }
    }
}
