// E2E test for search functionality
describe('Search Functionality', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should perform search across content types', () => {
        // Navigate to search or find search input
        cy.get('input[placeholder*="search" i]').should('be.visible')

        // Type search query
        cy.get('input[placeholder*="search" i]').type('technology')

        // Wait for search results (debounced)
        cy.wait(1000)

        // Check that results are displayed
        cy.get('[data-testid="content-card"]').should('have.length.greaterThan', 0)

        // Verify search results contain the search term
        cy.get('[data-testid="content-card"]').first()
            .should('contain.text', /technology/i)
    })

    it('should filter search results by content type', () => {
        // Perform search
        cy.get('input[placeholder*="search" i]').type('test')
        cy.wait(1000)

        // Find and use filter dropdown (if exists)
        cy.get('select').contains(/type|filter/i).select('news')

        // Verify filtered results
        cy.get('[data-testid="content-card"]').each(($card) => {
            cy.wrap($card).should('contain.text', /news/i)
        })
    })

    it('should handle empty search results', () => {
        // Search for something that won't match
        cy.get('input[placeholder*="search" i]').type('nonexistentquery123')
        cy.wait(1000)

        // Should show no results message
        cy.contains(/no results|not found/i).should('be.visible')
    })

    it('should clear search results', () => {
        // Perform search
        cy.get('input[placeholder*="search" i]').type('technology')
        cy.wait(1000)

        // Clear search
        cy.get('input[placeholder*="search" i]').clear()
        cy.wait(500)

        // Should return to default view
        cy.get('[data-testid="content-card"]').should('have.length.greaterThan', 0)
    })
})
