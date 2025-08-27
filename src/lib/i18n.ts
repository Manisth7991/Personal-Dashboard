import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
const resources = {
    en: {
        translation: {
            // Navigation
            dashboard: 'Dashboard',
            trending: 'Trending',
            news: 'News',
            movies: 'Movies',
            social: 'Social',
            favorites: 'Favorites',
            search: 'Search',
            settings: 'Settings',

            // Common
            loading: 'Loading...',
            error: 'Error',
            tryAgain: 'Try Again',
            readMore: 'Read More',
            addToFavorites: 'Add to Favorites',
            removeFromFavorites: 'Remove from Favorites',
            share: 'Share',

            // Dashboard
            dashboardTitle: 'Dashboard',
            dashboardSubtitle: 'Your personalized content feed',
            personalizedFeed: 'Personalized Feed',
            totalItems: 'Total Items',
            categories: 'Categories',
            autoRefresh: 'Auto Refresh',

            // Search
            searchPlaceholder: 'Search news, movies, posts...',
            searchResults: 'Search Results',
            searchResultsFor: 'Results for "{{query}}" ({{count}} found)',
            noResults: 'No results found',
            noResultsDesc: 'No content found for "{{query}}". Try different search terms.',
            startSearching: 'Start searching',
            startSearchingDesc: 'Use the search bar above to find news, movies, and social posts.',

            // Favorites
            favoritesTitle: 'Favorites',
            favoritesSubtitle: 'Your saved content ({{count}} items)',
            noFavorites: 'No favorites yet',
            noFavoritesDesc: 'Start adding items to your favorites by clicking the heart icon on any content card.',

            // Settings
            settingsTitle: 'Settings',
            settingsSubtitle: 'Customize your dashboard experience',
            appearance: 'Appearance',
            theme: 'Theme',
            light: 'Light',
            dark: 'Dark',
            system: 'System',
            contentPreferences: 'Content Preferences',
            favoriteCategories: 'Favorite Categories',
            language: 'Language',
            region: 'Region',
            notifications: 'Notifications',
            autoRefreshDesc: 'Automatically refresh content',
            refreshInterval: 'Refresh Interval (minutes)',
            displaySettings: 'Display Settings',
            itemsPerPage: 'Items per Page',
            saveChanges: 'Save Changes',
            reset: 'Reset',

            // Auth
            signIn: 'Sign In',
            signOut: 'Sign Out',
            email: 'Email',
            password: 'Password',
            signInWithGoogle: 'Sign in with Google',
            welcome: 'Welcome back!',
            signInDesc: 'Sign in to your account to continue',

            // News categories
            general: 'General',
            business: 'Business',
            entertainment: 'Entertainment',
            health: 'Health',
            science: 'Science',
            sports: 'Sports',
            technology: 'Technology',

            // Time
            justNow: 'just now',
            minutesAgo: '{{count}} minute ago',
            minutesAgo_plural: '{{count}} minutes ago',
            hoursAgo: '{{count}} hour ago',
            hoursAgo_plural: '{{count}} hours ago',
            daysAgo: '{{count}} day ago',
            daysAgo_plural: '{{count}} days ago',
        }
    },
    hi: {
        translation: {
            // Navigation
            dashboard: 'डैशबोर्ड',
            trending: 'ट्रेंडिंग',
            news: 'समाचार',
            movies: 'फिल्में',
            social: 'सामाजिक',
            favorites: 'पसंदीदा',
            search: 'खोजें',
            settings: 'सेटिंग्स',

            // Common
            loading: 'लोड हो रहा है...',
            error: 'त्रुटि',
            tryAgain: 'फिर से कोशिश करें',
            readMore: 'और पढ़ें',
            addToFavorites: 'पसंदीदा में जोड़ें',
            removeFromFavorites: 'पसंदीदा से हटाएं',
            share: 'साझा करें',

            // Dashboard
            dashboardTitle: 'डैशबोर्ड',
            dashboardSubtitle: 'आपका व्यक्तिगत सामग्री फीड',
            personalizedFeed: 'व्यक्तिगत फीड',
            totalItems: 'कुल आइटम',
            categories: 'श्रेणियां',
            autoRefresh: 'ऑटो रिफ्रेश',

            // Search
            searchPlaceholder: 'समाचार, फिल्में, पोस्ट खोजें...',
            searchResults: 'खोज परिणाम',
            searchResultsFor: '"{{query}}" के लिए परिणाम ({{count}} मिले)',
            noResults: 'कोई परिणाम नहीं मिला',
            noResultsDesc: '"{{query}}" के लिए कोई सामग्री नहीं मिली। अलग खोज शब्दों का प्रयास करें।',
            startSearching: 'खोज शुरू करें',
            startSearchingDesc: 'समाचार, फिल्में और सामाजिक पोस्ट खोजने के लिए ऊपर खोज बार का उपयोग करें।',

            // Favorites
            favoritesTitle: 'पसंदीदा',
            favoritesSubtitle: 'आपकी सहेजी गई सामग्री ({{count}} आइटम)',
            noFavorites: 'अभी तक कोई पसंदीदा नहीं',
            noFavoritesDesc: 'किसी भी सामग्री कार्ड पर हार्ट आइकन पर क्लिक करके आइटम को अपने पसंदीदा में जोड़ना शुरू करें।',

            // Settings
            settingsTitle: 'सेटिंग्स',
            settingsSubtitle: 'अपने डैशबोर्ड अनुभव को कस्टमाइज़ करें',
            appearance: 'दिखावट',
            theme: 'थीम',
            light: 'हल्का',
            dark: 'गहरा',
            system: 'सिस्टम',
            contentPreferences: 'सामग्री प्राथमिकताएं',
            favoriteCategories: 'पसंदीदा श्रेणियां',
            language: 'भाषा',
            region: 'क्षेत्र',
            notifications: 'सूचनाएं',
            autoRefreshDesc: 'सामग्री को स्वचालित रूप से रिफ्रेश करें',
            refreshInterval: 'रिफ्रेश अंतराल (मिनट)',
            displaySettings: 'डिस्प्ले सेटिंग्स',
            itemsPerPage: 'प्रति पृष्ठ आइटम',
            saveChanges: 'परिवर्तन सहेजें',
            reset: 'रीसेट करें',

            // Auth
            signIn: 'साइन इन करें',
            signOut: 'साइन आउट करें',
            email: 'ईमेल',
            password: 'पासवर्ड',
            signInWithGoogle: 'Google के साथ साइन इन करें',
            welcome: 'वापस स्वागत है!',
            signInDesc: 'जारी रखने के लिए अपने खाते में साइन इन करें',

            // News categories
            general: 'सामान्य',
            business: 'व्यापार',
            entertainment: 'मनोरंजन',
            health: 'स्वास्थ्य',
            science: 'विज्ञान',
            sports: 'खेल',
            technology: 'प्रौद्योगिकी',

            // Time
            justNow: 'अभी',
            minutesAgo: '{{count}} मिनट पहले',
            minutesAgo_plural: '{{count}} मिनट पहले',
            hoursAgo: '{{count}} घंटे पहले',
            hoursAgo_plural: '{{count}} घंटे पहले',
            daysAgo: '{{count}} दिन पहले',
            daysAgo_plural: '{{count}} दिन पहले',
        }
    }
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    })

export default i18n

