export interface Translations {
    [key: string]: string
}

export const translations: Record<string, Translations> = {
    en: {
        // Navigation
        dashboard: 'Dashboard',
        trending: 'Trending',
        news: 'News',
        movies: 'Movies',
        social: 'Social',
        favorites: 'Favorites',
        search: 'Search',
        settings: 'Settings',

        // Main Dashboard
        personalizedContentFeed: 'Your personalized content feed',
        dragToReorder: 'Drag to reorder',

        // Content
        readMore: 'Read More',
        loadMore: 'Load More Content',
        refresh: 'Refresh',
        refreshing: 'Refreshing...',
        loading: 'Loading...',
        searchPlaceholder: 'Search news, movies, posts...',

        // Settings
        general: 'General',
        appearance: 'Appearance',
        content: 'Content',
        privacy: 'Privacy',
        about: 'About',
        notifications: 'Enable Notifications',
        autoRefresh: 'Auto Refresh',
        language: 'Language',
        theme: 'Theme',

        // Settings sections
        contentPreferences: 'Content Preferences',
        displaySettings: 'Display Settings',
        advancedFeatures: 'Advanced Features',
        privacySecurity: 'Privacy & Security',
        favoriteCategories: 'Favorite Categories',
        contentTypes: 'Content Types',
        darkMode: 'Dark Mode',
        switchThemeDescription: 'Switch between light and dark themes',
        itemsPerPage: 'Items per Page',

        // Content types
        showInFeed: 'Show {type} content in your feed',

        // Messages
        noFavorites: 'No favorites yet',
        clickToAddFavorites: 'Click the heart icon on any content to add it to your favorites.',
        settingsSaved: 'Settings saved!',

        // Common
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto'
    },

    hi: {
        // Navigation
        dashboard: 'डैशबोर्ड',
        trending: 'ट्रेंडिंग',
        news: 'समाचार',
        movies: 'फिल्में',
        social: 'सामाजिक',
        favorites: 'पसंदीदा',
        search: 'खोजें',
        settings: 'सेटिंग्स',

        // Main Dashboard
        personalizedContentFeed: 'आपका व्यक्तिगत सामग्री फ़ीड',
        dragToReorder: 'पुनः क्रमबद्ध करने के लिए खींचें',

        // Content
        readMore: 'और पढ़ें',
        loadMore: 'और सामग्री लोड करें',
        refresh: 'रीफ्रेश',
        refreshing: 'रीफ्रेश हो रहा है...',
        loading: 'लोड हो रहा है...',
        searchPlaceholder: 'समाचार, फिल्में, पोस्ट खोजें...',

        // Settings
        general: 'सामान्य',
        appearance: 'दिखावट',
        content: 'सामग्री',
        privacy: 'गोपनीयता',
        about: 'के बारे में',
        notifications: 'सूचनाएं सक्षम करें',
        autoRefresh: 'ऑटो रीफ्रेश',
        language: 'भाषा',
        theme: 'थीम',

        // Settings sections
        contentPreferences: 'सामग्री प्राथमिकताएं',
        displaySettings: 'डिस्प्ले सेटिंग्स',
        advancedFeatures: 'उन्नत सुविधाएं',
        privacySecurity: 'गोपनीयता और सुरक्षा',
        favoriteCategories: 'पसंदीदा श्रेणियां',
        contentTypes: 'सामग्री प्रकार',
        darkMode: 'डार्क मोड',
        switchThemeDescription: 'हल्के और गहरे थीम के बीच स्विच करें',
        itemsPerPage: 'प्रति पृष्ठ आइटम',

        // Content types
        showInFeed: 'अपने फ़ीड में {type} सामग्री दिखाएं',

        // Messages
        noFavorites: 'अभी तक कोई पसंदीदा नहीं',
        clickToAddFavorites: 'अपने पसंदीदा में जोड़ने के लिए किसी भी सामग्री पर हृदय आइकन पर क्लिक करें।',
        settingsSaved: 'सेटिंग्स सहेज दी गईं!',

        // Common
        light: 'हल्का',
        dark: 'गहरा',
        auto: 'ऑटो'
    },

    es: {
        // Navigation
        dashboard: 'Panel',
        trending: 'Tendencias',
        news: 'Noticias',
        movies: 'Películas',
        social: 'Social',
        favorites: 'Favoritos',
        search: 'Buscar',
        settings: 'Configuración',

        // Content
        readMore: 'Leer más',
        loadMore: 'Cargar más contenido',
        refresh: 'Actualizar',
        refreshing: 'Actualizando...',
        loading: 'Cargando...',
        searchPlaceholder: 'Buscar noticias, películas, publicaciones...',        // Settings
        general: 'General',
        appearance: 'Apariencia',
        content: 'Contenido',
        privacy: 'Privacidad',
        about: 'Acerca de',
        notifications: 'Activar notificaciones',
        autoRefresh: 'Actualización automática',
        language: 'Idioma',
        theme: 'Tema',

        // Settings sections
        contentPreferences: 'Preferencias de Contenido',
        displaySettings: 'Configuración de Pantalla',
        privacySecurity: 'Privacidad y Seguridad',
        favoriteCategories: 'Categorías Favoritas',
        contentTypes: 'Tipos de Contenido',
        darkMode: 'Modo Oscuro',
        switchThemeDescription: 'Cambiar entre temas claros y oscuros',
        itemsPerPage: 'Elementos por Página',

        // Content types
        showInFeed: 'Mostrar contenido de {type} en tu feed',

        // Messages
        noFavorites: 'Aún no hay favoritos',
        clickToAddFavorites: 'Haz clic en el icono de corazón en cualquier contenido para agregarlo a tus favoritos.',
        settingsSaved: '¡Configuración guardada!',

        // Common
        light: 'Claro',
        dark: 'Oscuro',
        auto: 'Automático'
    }
}

export const getTranslation = (key: string, language: string): string => {
    return translations[language]?.[key] || translations.en[key] || key
}

export const useTranslation = (language: string) => {
    return (key: string) => getTranslation(key, language)
}
