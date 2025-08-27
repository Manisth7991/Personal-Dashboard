describe('Favorites Functionality', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should add item to favorites', () => {
        // Find first content card and add to favorites
        cy.get('[data-testid="content-card"]').first().within(() => {
            cy.get('[data-testid="favorite-button"]').click()
        })

        // Navigate to favorites
        cy.contains('Favorites').click()

        // Should see the favorited item
        cy.get('[data-testid="content-card"]').should('have.length.greaterThan', 0)
    })

    it('should remove item from favorites', () => {
        // First add an item to favorites
        cy.get('[data-testid="content-card"]').first().within(() => {
            cy.get('[data-testid="favorite-button"]').click()
        })

        // Navigate to favorites
        cy.contains('Favorites').click()

        // Remove from favorites
        cy.get('[data-testid="content-card"]').first().within(() => {
            cy.get('[data-testid="favorite-button"]').click()
        })

        // Should show empty state or fewer items
        cy.contains('No favorites yet').should('be.visible')
    })

    it('should persist favorites after page reload', () => {
        // Add item to favorites
        cy.get('[data-testid="content-card"]').first().within(() => {
            cy.get('[data-testid="favorite-button"]').click()
        })

        // Reload page
        cy.reload()

        // Navigate to favorites
        cy.contains('Favorites').click()

        // Should still see favorited items
        cy.get('[data-testid="content-card"]').should('have.length.greaterThan', 0)
    })
})
