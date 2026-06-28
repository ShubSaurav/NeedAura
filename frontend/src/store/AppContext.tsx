'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Listing, Notification } from '@shared/types/database';
import { fetchListings, createListing } from '@/actions/listingActions';
import { createClient } from '@/lib/supabase';

export type LanguageType = 'en' | 'hi' | 'es';
export type ThemeType = 'dark' | 'light';

// Language Translation Mappings
export const translations = {
  en: {
    logoText: "NeedAura",
    marketplace: "Marketplace",
    needsFeed: "Needs Feed",
    collaborate: "Collaborate",
    vendors: "Vendors",
    dashboard: "Dashboard",
    login: "Log In",
    joinEcosystem: "Sign Up",
    signOut: "Sign Out",
    welcome: "Welcome back",
    searchPlaceholder: "Find calculators, books...",
    searchCampus: "Search Campus",
    tradeFilters: "Trade Filters",
    categories: "Categories",
    allListings: "All Listings",
    allCategories: "All Categories",
    listItem: "List Item",
    featured: "Featured",
    verified: "Verified",
    unverified: "Unverified",
    notVerifiedWarning: "Verification Required",
    verificationPrompt: "Please complete your Aadhaar and college location onboarding to list, buy, or swap items.",
    verifyNow: "Verify Now",
    close: "Close",
    aurascore: "Aura Score",
    aurapoints: "Aura Points",
    notifications: "Notifications",
    noNotifications: "No new notifications",
    aadhaarVerification: "Aadhaar Safety Verification",
    locationVerification: "Campus Location Match",
    promoteListing: "Boost Listing",
    boostDescription: "Pin your listing to the top of the feed to sell 10x faster.",
    payFee: "Pay ₹99 to Pin Listing",
    callOption: "Voice Call",
    googleLensCheck: "Aura Lens AI Valuation Check",
    comparingPrices: "Comparing market rates...",
    pricingChart: "Marketplace Price Comparison"
  },
  hi: {
    logoText: "नीडऑरा",
    marketplace: "मार्केटप्लेस",
    needsFeed: "नीड्स फ़ीड",
    collaborate: "सहयोग करें",
    vendors: "विक्रेता",
    dashboard: "डैशबोर्ड",
    login: "लॉग इन",
    joinEcosystem: "साइन अप",
    signOut: "साइन आउट",
    welcome: "आपका स्वागत है",
    searchPlaceholder: "कैलकुलेटर, किताबें ढूंढें...",
    searchCampus: "कैंपस खोजें",
    tradeFilters: "व्यापार फ़िल्टर",
    categories: "श्रेणियां",
    allListings: "सभी लिस्टिंग्स",
    allCategories: "सभी श्रेणियां",
    listItem: "सामग्री लिस्ट करें",
    featured: "पिन किया हुआ",
    verified: "सत्यापित",
    unverified: "असत्यापित",
    notVerifiedWarning: "सत्यापन आवश्यक है",
    verificationPrompt: "सामग्री को लिस्ट करने, खरीदने या बदलने के लिए कृपया अपना आधार और कॉलेज स्थान सत्यापन पूरा करें।",
    verifyNow: "अभी सत्यापित करें",
    close: "बंद करें",
    aurascore: "ऑरा स्कोर",
    aurapoints: "ऑरा पॉइंट्स",
    notifications: "सूचनाएं",
    noNotifications: "कोई नई सूचना नहीं",
    aadhaarVerification: "आधार सुरक्षा सत्यापन",
    locationVerification: "कैंपस स्थान मिलान",
    promoteListing: "लिस्टिंग बूस्ट करें",
    boostDescription: "तेजी से बेचने के लिए अपनी लिस्टing को सबसे ऊपर पिन करें।",
    payFee: "पिन करने के लिए ₹99 भुगतान करें",
    callOption: "वॉयस कॉल",
    googleLensCheck: "ऑरा लेंस एआई मूल्य निर्धारण",
    comparingPrices: "बाजार दरों की तुलना की जा रही है...",
    pricingChart: "बाजार मूल्य तुलना चार्ट"
  },
  es: {
    logoText: "NeedAura",
    marketplace: "Mercado",
    needsFeed: "SOS de Necesidad",
    collaborate: "Colaborar",
    vendors: "Vendedores",
    dashboard: "Panel",
    login: "Iniciar Sesión",
    joinEcosystem: "Registrarse",
    signOut: "Cerrar Sesión",
    welcome: "Bienvenido de nuevo",
    searchPlaceholder: "Buscar calculadoras, libros...",
    searchCampus: "Buscar en el Campus",
    tradeFilters: "Filtros de Comercio",
    categories: "Categorías",
    allListings: "Todos los artículos",
    allCategories: "Todas las categorías",
    listItem: "Publicar artículo",
    featured: "Destacado",
    verified: "Verificado",
    unverified: "No verificado",
    notVerifiedWarning: "Verificación Requerida",
    verificationPrompt: "Complete la verificación de Aadhaar y ubicación para publicar, comprar o intercambiar artículos.",
    verifyNow: "Verificar ahora",
    close: "Cerrar",
    aurascore: "Puntuación Aura",
    aurapoints: "Puntos Aura",
    notifications: "Notificaciones",
    noNotifications: "No hay nuevas notificaciones",
    aadhaarVerification: "Verificación de Seguridad Aadhaar",
    locationVerification: "Ubicación del Campus",
    promoteListing: "Destacar artículo",
    boostDescription: "Fije su artículo al principio de la página para vender 10 veces más rápido.",
    payFee: "Pagar ₹99 para Destacar",
    callOption: "Llamada de voz",
    googleLensCheck: "Valuación de Aura Lens AI",
    comparingPrices: "Comparando precios del mercado...",
    pricingChart: "Gráfico de comparación de precios"
  }
};

interface AppContextProps {
  user: Profile | null;
  language: LanguageType;
  theme: ThemeType;
  notifications: Notification[];
  listings: Listing[];
  setUser: (user: Profile | null) => void;
  setLanguage: (lang: LanguageType) => void;
  setTheme: (theme: ThemeType) => void;
  addNotification: (title: string, body: string, type: string) => void;
  markNotificationsAsRead: () => void;
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  addListing: (listing: Omit<Listing, 'id' | 'created_at' | 'updated_at'>) => void;
  boostListing: (listingId: string) => void;
  updateUserProfile: (profileUpdates: Partial<Profile>) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Initial Listings Database Seed
const initialListings: Listing[] = [
  {
    id: 'listing-1',
    seller_id: 'current-user-id',
    title: 'Casio Scientific Calculator fx-991EX',
    description: 'Perfect condition, used for one semester of mathematics. Includes cover and original manual booklet.',
    price: 550.00,
    suggested_price: 600.00,
    market_price: 1250.00,
    category: 'Electronics',
    condition_score: 95,
    image_urls: ['/casio_calculator.png'],
    listing_type: 'sell',
    pickup_zone: 'Central Library Lobby',
    status: 'active',
    visibility: 'campus',
    is_pinned: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'listing-2',
    seller_id: 'user-xyz',
    title: 'Database Management Systems - Korth',
    description: '6th Edition, textbook for CSE courses. No highlighted text or pen marks inside.',
    price: 0.00,
    suggested_price: 150.00,
    market_price: 650.00,
    category: 'Books',
    condition_score: 90,
    image_urls: ['/dbms_textbook.png'],
    listing_type: 'donate',
    pickup_zone: 'Hostel Block B Entrance',
    status: 'active',
    visibility: 'campus',
    is_pinned: true, // Pinned/featured listing by default
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'listing-3',
    seller_id: 'user-abc',
    title: 'Hostel Room Bicycle - Hero Sprint',
    description: '21 gear cycle, perfect for getting around the campus center. Back tire tube was recently replaced.',
    price: 2800.00,
    suggested_price: 2500.00,
    market_price: 8000.00,
    category: 'Cycles',
    condition_score: 75,
    image_urls: ['/hero_bicycle.png'],
    listing_type: 'sell',
    pickup_zone: 'Cafeteria Parking Zone',
    status: 'active',
    visibility: 'campus',
    is_pinned: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check localStorage if browser env
  const [user, setUserState] = useState<Profile | null>(null);
  const [language, setLanguageState] = useState<LanguageType>('en');
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);

  // Initialize from LocalStorage and load database listings
  useEffect(() => {
    const savedLang = localStorage.getItem('aura_lang') as LanguageType;
    const savedTheme = localStorage.getItem('aura_theme') as ThemeType;

    const supabase = createClient();
    
    // Sync session and retrieve profile
    const syncSession = async () => {
      try {
        // Client-side OAuth code/token exchange check
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          if (code) {
            console.log('[AppContext] Client-side auth code found. Exchanging...');
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (!exchangeError) {
              console.log('[AppContext] Client-side code exchange success!');
              const newUrl = window.location.pathname + window.location.hash;
              window.history.replaceState({}, document.title, newUrl);
            } else {
              console.error('[AppContext] Client-side code exchange error:', exchangeError.message);
            }
          }

          // Clean access_token from hash fragment if present
          if (window.location.hash && window.location.hash.includes('access_token')) {
            console.log('[AppContext] Detected access_token in hash fragment. Cleaning URL...');
            const newUrl = window.location.pathname + window.location.search;
            window.history.replaceState({}, document.title, newUrl);
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const expires = new Date();
          expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
          document.cookie = `sb-access-token=${session.access_token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
          document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
          const { data: profile, error: selectError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (selectError && selectError.code !== 'PGRST116') {
            console.error('Failed to select user profile in syncSession:', selectError);
            throw new Error(`[DB SELECT ERROR] Code: ${selectError.code}. Message: ${selectError.message}. Details: ${selectError.details}. Hint: ${selectError.hint}`);
          }

          if (profile) {
            setUserState(profile);
            localStorage.setItem('aura_user', JSON.stringify(profile));
          } else {
            // Create or update user profile using upsert (prevents duplicate key errors)
            const dbProfile = {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'College Student',
              email: session.user.email || '',
              branch: session.user.user_metadata?.branch || 'Computer Science',
              hostel: session.user.user_metadata?.hostel || undefined,
              role: 'student' as any,
              aura_score: 100,
              aura_points: 0,
              is_verified: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            const { error: upsertError } = await supabase.from('profiles').upsert(dbProfile);
            if (upsertError) {
              console.error('Failed to upsert user profile in syncSession:', upsertError);
              throw new Error(`[DB ERROR] Code: ${upsertError.code}. Message: ${upsertError.message}. Details: ${upsertError.details}. Hint: ${upsertError.hint}`);
            }
            const newProfile: Profile = {
              ...dbProfile,
              is_aadhaar_verified: false,
              onboarding_completed: false
            };
            setUserState(newProfile);
            localStorage.setItem('aura_user', JSON.stringify(newProfile));
          }
        } else {
          document.cookie = `sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
          document.cookie = `sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
          // If offline mock user exists from earlier tests, clean it
          const savedUser = localStorage.getItem('aura_user');
          if (savedUser) {
            const userObj = JSON.parse(savedUser);
            if (userObj.id === 'current-user-id' || userObj.id.startsWith('mock-')) {
              localStorage.removeItem('aura_user');
              setUserState(null);
            } else {
              setUserState(userObj);
            }
          } else {
            setUserState(null);
          }
        }
      } catch (err) {
        console.error('Error syncing auth session:', err);
      }
    };

    syncSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      try {
        if (session?.user) {
          const expires = new Date();
          expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
          document.cookie = `sb-access-token=${session.access_token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
          document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
          const { data: profile, error: selectError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (selectError && selectError.code !== 'PGRST116') {
            console.error('Failed to select user profile in onAuthStateChange:', selectError);
            throw new Error(`[DB SELECT ERROR] Code: ${selectError.code}. Message: ${selectError.message}. Details: ${selectError.details}. Hint: ${selectError.hint}`);
          }

          if (profile) {
            setUserState(profile);
            localStorage.setItem('aura_user', JSON.stringify(profile));
          } else {
            // Create or update user profile using upsert (prevents duplicate key errors)
            const dbProfile = {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'College Student',
              email: session.user.email || '',
              branch: session.user.user_metadata?.branch || 'Computer Science',
              hostel: session.user.user_metadata?.hostel || undefined,
              role: 'student' as any,
              aura_score: 100,
              aura_points: 0,
              is_verified: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            const { error: upsertError } = await supabase.from('profiles').upsert(dbProfile);
            if (upsertError) {
              console.error('Failed to upsert user profile in onAuthStateChange:', upsertError);
              throw new Error(`[DB ERROR] Code: ${upsertError.code}. Message: ${upsertError.message}. Details: ${upsertError.details}. Hint: ${upsertError.hint}`);
            }
            const newProfile: Profile = {
              ...dbProfile,
              is_aadhaar_verified: false,
              onboarding_completed: false
            };
            setUserState(newProfile);
            localStorage.setItem('aura_user', JSON.stringify(newProfile));
          }
        } else {
          document.cookie = `sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
          document.cookie = `sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
          setUserState(null);
          localStorage.removeItem('aura_user');
        }
      } catch (err) {
        console.error('Error handling auth state change:', err);
      }
    });

    if (savedLang) setLanguageState(savedLang);
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('light-theme', savedTheme === 'light');
    } else {
      setThemeState('light');
      document.documentElement.classList.add('light-theme');
    }

    // Load active listings from database (Supabase)
    const loadListings = async () => {
      try {
        const response = await fetchListings();
        if (response.success && response.data) {
          setListings(response.data);
        }
      } catch (err) {
        console.error('Failed to load listings from DB:', err);
      }
    };
    loadListings();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setUser = (newUser: Profile | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('aura_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('aura_user');
      const supabase = createClient();
      supabase.auth.signOut();
    }
  };

  const updateUserProfile = (profileUpdates: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...profileUpdates };
    setUser(updated);
    localStorage.setItem('aura_user', JSON.stringify(updated));

    // Save to database asynchronously
    (async () => {
      try {
        const supabase = createClient();
        const dbUpdates: any = {
          full_name: profileUpdates.full_name,
          branch: profileUpdates.branch,
          hostel: profileUpdates.hostel,
          university_id: profileUpdates.university_id,
          avatar_url: profileUpdates.avatar_url,
          is_verified: profileUpdates.is_verified,
          aura_score: profileUpdates.aura_score,
          aura_points: profileUpdates.aura_points,
        };

        if (profileUpdates.aadhaar_no !== undefined) dbUpdates.aadhaar_no = profileUpdates.aadhaar_no;
        if (profileUpdates.is_aadhaar_verified !== undefined) dbUpdates.is_aadhaar_verified = profileUpdates.is_aadhaar_verified;
        if (profileUpdates.onboarding_completed !== undefined) dbUpdates.onboarding_completed = profileUpdates.onboarding_completed;

        // Filter out undefined keys
        Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);

        if (Object.keys(dbUpdates).length > 0) {
          const { error } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', user.id);

          if (error) {
            console.error('[AppContext] Failed to persist profile updates to DB:', error);
            if (error.message.includes('unique') || error.message.includes('aadhaar_no') || error.code === '23505') {
              alert('Security Alert: This Aadhaar card number is already registered and linked to another account.');
              // Revert client-side state
              setUser(user);
              localStorage.setItem('aura_user', JSON.stringify(user));
            }
          }
        }
      } catch (err) {
        console.error('[AppContext] Exception in updateUserProfile:', err);
      }
    })();
  };

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem('aura_lang', lang);
  };

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('aura_theme', newTheme);
    document.documentElement.classList.toggle('light-theme', newTheme === 'light');
  };

  const addNotification = (title: string, body: string, type: string) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      user_id: user?.id || 'guest',
      title,
      body,
      type,
      is_read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const addListing = async (listingInput: Omit<Listing, 'id' | 'created_at' | 'updated_at'>) => {
    // Call server action to save to Supabase
    const result = await createListing({
      title: listingInput.title,
      description: listingInput.description,
      price: listingInput.price,
      suggested_price: listingInput.suggested_price,
      market_price: listingInput.market_price,
      category: listingInput.category,
      condition_score: listingInput.condition_score,
      image_urls: listingInput.image_urls,
      listing_type: listingInput.listing_type,
      pickup_zone: listingInput.pickup_zone,
      visibility: listingInput.visibility
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create listing database row.');
    }

    const newListing: Listing = {
      ...listingInput,
      id: result.listingId || `listing-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setListings(prev => [newListing, ...prev]);

    // Send notifications to all students (global state triggers toast)
    addNotification(
      `New Listing in ${listingInput.category}`,
      `"${listingInput.title}" has been listed for ${listingInput.price === 0 ? 'FREE' : `₹${listingInput.price}`}!`,
      'new_listing'
    );
  };

  const boostListing = (listingId: string) => {
    setListings(prev => prev.map(item => {
      if (item.id === listingId) {
        return { ...item, is_pinned: true };
      }
      return item;
    }));

    addNotification(
      "Listing Boosted Successfully",
      "Your listing has been pinned to the top of the campus feed.",
      "payment_success"
    );
  };

  return (
    <AppContext.Provider value={{
      user,
      language,
      theme,
      notifications,
      listings,
      setUser,
      setLanguage,
      setTheme,
      addNotification,
      markNotificationsAsRead,
      setListings,
      addListing,
      boostListing,
      updateUserProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
