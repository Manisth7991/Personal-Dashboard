import { render, screen } from '@testing-library/react'
import { ContentCard } from '@/components/content/content-card'

const mockItem = {
    id: 'test-1',
    type: 'news' as const,
    title: 'Test News Article',
    description: 'This is a test news article description',
    image: 'https://example.com/image.jpg',
    url: 'https://example.com/article',
    metadata: {
        source: 'Test Source',
        author: 'Test Author',
        publishedAt: '2024-01-01T00:00:00Z',
        category: 'technology'
    }
}

describe('ContentCard', () => {
    it('renders content card with correct information', () => {
        render(<ContentCard item={mockItem} index={0} />)

        expect(screen.getByText('Test News Article')).toBeDefined()
        expect(screen.getByText('This is a test news article description')).toBeDefined()
        expect(screen.getByText('Test Source')).toBeDefined()
    })

    it('shows content type badge', () => {
        render(<ContentCard item={mockItem} index={0} />)

        // The badge shows lowercase "news" not "NEWS"
        expect(screen.getByText('news')).toBeDefined()
    })

    it('has data-testid attribute', () => {
        render(<ContentCard item={mockItem} index={0} />)

        const card = screen.getByTestId('content-card')
        expect(card).toBeDefined()
    })

    it('shows favorite and share buttons', () => {
        render(<ContentCard item={mockItem} index={0} />)

        const favoriteButton = screen.getByLabelText('Add to favorites')
        const shareButton = screen.getByLabelText('Share this content')

        expect(favoriteButton).toBeDefined()
        expect(shareButton).toBeDefined()
    })

    it('shows read more link', () => {
        render(<ContentCard item={mockItem} index={0} />)

        const readMoreLink = screen.getByText('Read More')
        expect(readMoreLink).toBeDefined()
    })
})
