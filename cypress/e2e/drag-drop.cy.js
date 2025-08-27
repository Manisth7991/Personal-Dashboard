describe('Drag and Drop', () => {
    beforeEach(() => {
        cy.visit('/')
        // Add some items to favorites first
        cy.get('[data-testid="content-card"]').first().within(() => {
            cy.get('[data-testid="favorite-button"]').click()
        })
        cy.get('[data-testid="content-card"]').eq(1).within(() => {
            cy.get('[data-testid="favorite-button"]').click()
        })

        // Navigate to favorites view
        cy.contains('Favorites').click()
    })

    it('should reorder items via drag and drop', () => {
        // Get the first two items
        cy.get('[data-testid="content-card"]').first().as('firstItem')
        cy.get('[data-testid="content-card"]').eq(1).as('secondItem')

        // Get their initial text content to verify reordering
        cy.get('@firstItem').find('[data-testid="card-title"]').invoke('text').as('firstTitle')
        cy.get('@secondItem').find('[data-testid="card-title"]').invoke('text').as('secondTitle')

        // Perform drag and drop
        cy.get('@firstItem').trigger('dragstart')
        cy.get('@secondItem').trigger('dragover')
        cy.get('@secondItem').trigger('drop')

        // Verify the order has changed
        cy.get('@firstTitle').then((firstTitle) => {
            cy.get('@secondTitle').then((secondTitle) => {
                cy.get('[data-testid="content-card"]').first().find('[data-testid="card-title"]')
                    .should('contain', secondTitle)
                cy.get('[data-testid="content-card"]').eq(1).find('[data-testid="card-title"]')
                    .should('contain', firstTitle)
            })
        })
    })
})
