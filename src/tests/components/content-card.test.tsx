import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { ContentCard } from '@/components/content/content-card'
import { ContentItem } from '@/lib/api'

const mockItem: ContentItem = {
    id: 'test-1',
    type: 'news',
    title: 'Test News Article',
    description: 'This is a test news article description',
    image: 'https://example.com/image.jpg',
    url: 'https://example.com/article',
    metadata: {
        source: 'Test Source',
        publishedAt: '2023-01-01T00:00:00Z',
        category: 'technology',
    },
}

const renderWithProvider = (component: React.ReactElement) => {
    return render(
        <Provider store={store}>
            {component}
        </Provider>
    )
}

describe('ContentCard', () => {
    it('renders news article correctly', () => {
        renderWithProvider(<ContentCard item={mockItem} />)

        expect(screen.getByText('Test News Article')).toBeInTheDocument()
        expect(screen.getByText(/This is a test news article/)).toBeInTheDocument()
        expect(screen.getByText('Test Source')).toBeInTheDocument()
        expect(screen.getByText('news')).toBeInTheDocument()
    })

    it('handles favorite toggle', () => {
        renderWithProvider(<ContentCard item={mockItem} />)

        const favoriteButton = screen.getByRole('button', { name: /favorite/i })
        expect(favoriteButton).toBeInTheDocument()
    })

    it('shows read more button for items with URL', () => {
        renderWithProvider(<ContentCard item={mockItem} />)

        expect(screen.getByText('Read More')).toBeInTheDocument()
    })

    it('displays movie rating when available', () => {
        const movieItem: ContentItem = {
            ...mockItem,
            type: 'movie',
            metadata: {
                ...mockItem.metadata,
                rating: 8.5,
            },
        }

        renderWithProvider(<ContentCard item={movieItem} />)

        expect(screen.getByText('8.5')).toBeInTheDocument()
    })
})

