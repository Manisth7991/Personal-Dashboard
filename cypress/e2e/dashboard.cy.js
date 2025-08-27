describe('Dashboard App', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should load the dashboard', () => {
        cy.contains('Dashboard').should('be.visible')
        cy.contains('Your personalized content feed').should('be.visible')
    })

    it('should display stats cards', () => {
        cy.get('[data-testid="stats-card"]').should('have.length', 4)
        cy.contains('Total Items').should('be.visible')
        cy.contains('Favorites').should('be.visible')
        cy.contains('Categories').should('be.visible')
        cy.contains('Auto Refresh').should('be.visible')
    })

    it('should show content grid', () => {
        cy.get('[data-testid="content-grid"]').should('be.visible')
        cy.get('[data-testid="content-card"]').should('have.length.greaterThan', 0)
    })

    it('should navigate between views', () => {
        // Navigate to news
        cy.contains('News').click()
        cy.contains('Latest news from trusted sources').should('be.visible')

        // Navigate to movies
        cy.contains('Movies').click()
        cy.contains('Trending movies and recommendations').should('be.visible')

        // Navigate to favorites
        cy.contains('Favorites').click()
        cy.contains('Your saved content').should('be.visible')
    })
})
