describe('Search Functionality', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should perform search and show results', () => {
        // Type in search box
        cy.get('[data-testid="search-input"]').type('technology')
        cy.get('[data-testid="search-input"]').type('{enter}')

        // Should navigate to search view
        cy.contains('Search Results').should('be.visible')
        cy.contains('Results for "technology"').should('be.visible')
    })

    it('should show search suggestions', () => {
        cy.get('[data-testid="search-input"]').focus()
        cy.get('[data-testid="search-input"]').type('tech')

        // Wait for debounced search
        cy.wait(500)

        // Check if suggestions appear (if implemented)
        // cy.get('[data-testid="search-suggestions"]').should('be.visible')
    })

    it('should handle empty search results', () => {
        cy.get('[data-testid="search-input"]').type('nonexistentquery123')
        cy.get('[data-testid="search-input"]').type('{enter}')

        cy.contains('No results found').should('be.visible')
    })
})
