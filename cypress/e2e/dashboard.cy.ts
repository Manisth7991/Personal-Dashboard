// E2E test for dashboard functionality
describe('Dashboard', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should load the dashboard with content', () => {
        // Check that the main dashboard elements are present
        cy.contains('h1', /Dashboard|Personal/).should('be.visible')

        // Wait for content to load
        cy.get('[data-testid="content-card"]', { timeout: 10000 })
            .should('have.length.greaterThan', 0)

        // Check that content cards are displayed
        cy.get('[data-testid="content-card"]').first().should('be.visible')
    })

    it('should navigate between different sections', () => {
        // Test navigation to different views
        cy.contains('button', 'Trending').click()
        cy.url().should('include', '#trending')

        cy.contains('button', 'News').click()
        cy.url().should('include', '#news')

        cy.contains('button', 'Movies').click()
        cy.url().should('include', '#movies')

        cy.contains('button', 'Favorites').click()
        cy.url().should('include', '#favorites')
    })

    it('should toggle dark mode', () => {
        // Find and click the theme toggle button
        cy.get('button').contains(/dark|light|theme/i).click()

        // Check that dark mode class is applied
        cy.get('html').should('have.class', 'dark')

        // Toggle back to light mode
        cy.get('button').contains(/dark|light|theme/i).click()
        cy.get('html').should('not.have.class', 'dark')
    })

    it('should show content details on card click', () => {
        // Wait for content to load
        cy.get('[data-testid="content-card"]').first().click()

        // Should show some kind of detail view or modal
        // This depends on your implementation
        cy.get('body').should('contain.text', 'Read More')
    })

    it('should handle responsive design', () => {
        // Test mobile view
        cy.viewport(375, 667)
        cy.get('[data-testid="content-card"]').should('be.visible')

        // Test tablet view
        cy.viewport(768, 1024)
        cy.get('[data-testid="content-card"]').should('be.visible')

        // Test desktop view
        cy.viewport(1920, 1080)
        cy.get('[data-testid="content-card"]').should('be.visible')
    })
})
