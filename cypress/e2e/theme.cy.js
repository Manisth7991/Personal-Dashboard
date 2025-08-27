describe('Theme Toggle', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should toggle between light and dark themes', () => {
        // Check initial theme (should be system or light)
        cy.get('html').should('not.have.class', 'dark')

        // Click theme toggle button
        cy.get('[data-testid="theme-toggle"]').click()

        // Should switch to dark theme
        cy.get('html').should('have.class', 'dark')

        // Click again to switch back
        cy.get('[data-testid="theme-toggle"]').click()

        // Should switch back to light theme
        cy.get('html').should('not.have.class', 'dark')
    })

    it('should persist theme preference', () => {
        // Switch to dark theme
        cy.get('[data-testid="theme-toggle"]').click()
        cy.get('html').should('have.class', 'dark')

        // Reload page
        cy.reload()

        // Should still be dark theme
        cy.get('html').should('have.class', 'dark')
    })

    it('should have theme options in settings', () => {
        // Navigate to settings
        cy.contains('Settings').click()

        // Should see theme options
        cy.contains('Theme').should('be.visible')
        cy.contains('light').should('be.visible')
        cy.contains('dark').should('be.visible')
        cy.contains('system').should('be.visible')
    })
})
