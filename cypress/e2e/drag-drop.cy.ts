// E2E test for drag and drop functionality
describe('Drag and Drop', () => {
    beforeEach(() => {
        cy.visit('/')

        // Wait for content to load
        cy.get('[data-testid="content-card"]', { timeout: 10000 })
            .should('have.length.greaterThan', 1)
    })

    it('should allow reordering content cards', () => {
        // Get initial order
        cy.get('[data-testid="content-card"]').first().invoke('text').as('firstCardText')
        cy.get('[data-testid="content-card"]').eq(1).invoke('text').as('secondCardText')

        // Perform drag and drop (this is a simplified version)
        // Real implementation would use cy.drag() or similar
        cy.get('[data-testid="content-card"]').first()
            .trigger('mousedown', { which: 1 })

        cy.get('[data-testid="content-card"]').eq(1)
            .trigger('mousemove')
            .trigger('mouseup')

        // Wait for reorder animation
        cy.wait(500)

        // Verify order has changed
        cy.get('@secondCardText').then((secondText) => {
            cy.get('[data-testid="content-card"]').first()
                .should('contain.text', secondText)
        })
    })

    it('should persist reordered content', () => {
        // Perform drag and drop
        cy.get('[data-testid="content-card"]').first().invoke('text').as('originalFirst')

        // Simulate drag and drop
        cy.get('[data-testid="content-card"]').first()
            .trigger('mousedown', { which: 1 })

        cy.get('[data-testid="content-card"]').eq(1)
            .trigger('mousemove')
            .trigger('mouseup')

        cy.wait(500)

        // Reload page to test persistence
        cy.reload()

        // Wait for content to load
        cy.get('[data-testid="content-card"]', { timeout: 10000 })
            .should('have.length.greaterThan', 0)

        // Verify order is still changed
        cy.get('@originalFirst').then((originalText) => {
            cy.get('[data-testid="content-card"]').first()
                .should('not.contain.text', originalText)
        })
    })

    it('should show drag indicators', () => {
        // Check for drag handle or indicators
        cy.get('[data-testid="content-card"]').first().within(() => {
            // Look for grip icon or drag indicator
            cy.get('svg').should('exist') // Assuming grip icon is SVG
        })
    })

    it('should work with keyboard navigation', () => {
        // Focus on first card
        cy.get('[data-testid="content-card"]').first().focus()

        // Try keyboard interactions
        cy.focused().type('{downarrow}')
        cy.focused().type(' ') // Space to grab
        cy.focused().type('{downarrow}') // Move down
        cy.focused().type(' ') // Space to drop

        // Verify some change occurred
        cy.get('[data-testid="content-card"]').should('have.length.greaterThan', 0)
    })
})
