import '@testing-library/jest-dom'

// Global test setup
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            refresh: jest.fn(),
        }
    },
    useSearchParams() {
        return {
            get: jest.fn(),
        }
    },
    usePathname() {
        return ''
    },
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
    useSession() {
        return {
            data: null,
            status: 'unauthenticated',
        }
    },
    signIn: jest.fn(),
    signOut: jest.fn(),
}))

// Mock react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: jest.fn(),
            language: 'en',
        },
    }),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: 'div',
        button: 'button',
        span: 'span',
    },
    AnimatePresence: ({ children }: any) => children,
}))

