import type { User } from '../types';
import { PRODUCE_LISTINGS } from '../constants';

// In a real app, this would be a secure, server-side store.
// For this demo, we use an in-memory array and localStorage.
interface AuthUser extends User {
    id: string;
    passwordHash: string; // In a real app, NEVER store plain passwords
}

const USERS_STORAGE_KEY = 'sokoFreshUsers';
const PERSISTENT_SESSION_KEY = 'sokoFreshPersistedUser';
const SESSION_KEY = 'sokoFreshCurrentUser';

let users: AuthUser[] = [];

const saveUsers = () => {
    // This check ensures localStorage is only accessed in the browser.
    if (typeof window !== 'undefined') {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
};

const initializeUsers = () => {
    // This function runs only in the browser, preventing build errors on the server.
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
        try {
            users = JSON.parse(storedUsers);
        } catch (e) {
            console.error("Failed to parse users from storage", e);
            users = [];
        }
    }

    if (users.length === 0) {
        const defaultFarmers = new Map<string, AuthUser>();
        PRODUCE_LISTINGS.forEach(listing => {
            if (!defaultFarmers.has(listing.farmerEmail)) {
                const nameParts = listing.farmerName.split(' ');
                const password = `${nameParts[0].toLowerCase()}123`;
                defaultFarmers.set(listing.farmerEmail, {
                    id: `user_farmer_${defaultFarmers.size + 1}`,
                    name: listing.farmerName,
                    email: listing.farmerEmail,
                    phone: listing.farmerContact,
                    county: listing.location.split(', ')[1] || 'Unknown',
                    passwordHash: password, // Plain text for demo ONLY
                    ratingSum: 0,
                    ratingCount: 0,
                    avatarUrl: `https://picsum.photos/seed/${listing.farmerName}/200/200`
                });
            }
        });

        users = Array.from(defaultFarmers.values());
        saveUsers();
    }
};

// Defer user initialization to run only in a browser environment.
if (typeof window !== 'undefined') {
    initializeUsers();
}


let currentUser: User | null = null;

const listeners: Set<(user: User | null) => void> = new Set();

const notifyListeners = () => {
    listeners.forEach(listener => listener(currentUser));
};

export const subscribe = (listener: (user: User | null) => void) => {
    listeners.add(listener);
    // Return an unsubscribe function
    return () => {
        listeners.delete(listener);
    };
};

export const login = (identifier: string, password: string, rememberMe: boolean): { success: boolean, message: string, user?: User } => {
    const user = users.find(u => (u.email.toLowerCase() === identifier.toLowerCase() || u.phone === identifier));

    if (!user || user.passwordHash !== password) { // Simple password check for demo
        return { success: false, message: 'Invalid credentials' };
    }
    
    const { passwordHash, id, ...userProfile } = user;
    currentUser = userProfile;
    
    // Clear any previous sessions
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PERSISTENT_SESSION_KEY);
    
    if (rememberMe) {
        localStorage.setItem(PERSISTENT_SESSION_KEY, JSON.stringify(currentUser));
    } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    }
    
    notifyListeners();
    return { success: true, message: 'Login successful', user: currentUser };
};

export const loginWithGoogle = (): { success: boolean, message: string, user?: User } => {
    const googleEmail = 'demo@sokofresh.dev';
    let user = users.find(u => u.email.toLowerCase() === googleEmail);

    if (!user) {
        // If demo user doesn't exist, create it
        const newUser: AuthUser = {
            id: 'user_google_demo',
            name: 'Demo User',
            email: googleEmail,
            phone: '0799999999',
            county: 'Nairobi',
            passwordHash: 'google_login', // Not used
            ratingSum: 5,
            ratingCount: 1,
            avatarUrl: `https://ui-avatars.com/api/?name=Demo+User&background=4285F4&color=fff&size=128`
        };
        users.push(newUser);
        saveUsers();
        user = newUser;
    }
    
    const { passwordHash, id, ...userProfile } = user;
    currentUser = userProfile;
    // Persist Google login by default
    localStorage.setItem(PERSISTENT_SESSION_KEY, JSON.stringify(currentUser));
    sessionStorage.removeItem(SESSION_KEY);
    notifyListeners();
    return { success: true, message: 'Login successful', user: currentUser };
};


export const loginAsGuest = (): { success: boolean, user: User } => {
    const guestUser: User = {
        name: 'Guest User',
        county: 'Nairobi',
        phone: 'N/A',
        email: 'guest@sokofresh.dev', // a non-real email so it can't be registered
        avatarUrl: `https://ui-avatars.com/api/?name=Guest&background=90A4AE&color=fff&size=128`,
        ratingSum: 0,
        ratingCount: 0,
    };
    currentUser = guestUser;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    localStorage.removeItem(PERSISTENT_SESSION_KEY);
    notifyListeners();
    return { success: true, user: currentUser };
};

export const register = (userData: Omit<User, 'id' | 'ratingSum' | 'ratingCount'>, password: string): { success: boolean, message: string, user?: User } => {
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        return { success: false, message: 'Email already in use' };
    }
    if (users.some(u => u.phone === userData.phone)) {
        return { success: false, message: 'Phone number already in use' };
    }

    const newUser: AuthUser = {
        ...userData,
        id: `user_${Date.now()}`,
        passwordHash: password, // Storing plain text for demo ONLY. Use hashing in production.
        ratingSum: 0,
        ratingCount: 0,
        avatarUrl: '',
    };
    
    users.push(newUser);
    saveUsers();

    const { passwordHash, id, ...userProfile } = newUser;
    currentUser = userProfile;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    localStorage.removeItem(PERSISTENT_SESSION_KEY);
    notifyListeners();
    return { success: true, message: 'Registration successful', user: currentUser };
};

export const logout = () => {
    currentUser = null;
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PERSISTENT_SESSION_KEY);
    notifyListeners();
};

export const getCurrentUser = (): User | null => {
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        const persistedUser = localStorage.getItem(PERSISTENT_SESSION_KEY);
        if (persistedUser) {
            currentUser = JSON.parse(persistedUser);
            return currentUser;
        }

        const sessionUser = sessionStorage.getItem(SESSION_KEY);
        if (sessionUser) {
            currentUser = JSON.parse(sessionUser);
            return currentUser;
        }
    } catch (error) {
        console.error("Failed to parse user session from storage", error);
        return null;
    }
    
    return null;
};

export const updateUser = (updatedUser: User): boolean => {
    if (updatedUser.email === 'guest@sokofresh.dev') {
        // Prevent guest user from being saved
        if (currentUser?.email === updatedUser.email) {
            currentUser = updatedUser;
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
            notifyListeners();
        }
        return true;
    }

    const userIndex = users.findIndex(u => u.email.toLowerCase() === updatedUser.email.toLowerCase());
    if (userIndex === -1) {
        return false;
    }
    
    // Preserve password and id
    const existingUser = users[userIndex];
    users[userIndex] = { ...existingUser, ...updatedUser };
    saveUsers();

    // If the updated user is the current user, update the session
    if (currentUser?.email === updatedUser.email) {
        currentUser = updatedUser;
        // Check which storage the session is in
        if (localStorage.getItem(PERSISTENT_SESSION_KEY)) {
            localStorage.setItem(PERSISTENT_SESSION_KEY, JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
        }
        notifyListeners();
    }
    
    return true;
};

export const rateUser = (farmerEmail: string, rating: number): boolean => {
    const userIndex = users.findIndex(u => u.email.toLowerCase() === farmerEmail.toLowerCase());
    if (userIndex === -1) {
        console.error(`Attempted to rate non-existent user: ${farmerEmail}`);
        return false;
    }

    const farmer = users[userIndex];
    farmer.ratingSum += rating;
    farmer.ratingCount += 1;
    saveUsers();

    // If the rated user happens to be the current user, update their session data
    if (currentUser?.email === farmerEmail) {
        currentUser = { ...currentUser, ratingSum: farmer.ratingSum, ratingCount: farmer.ratingCount };
        // Check which storage the session is in
        if (localStorage.getItem(PERSISTENT_SESSION_KEY)) {
            localStorage.setItem(PERSISTENT_SESSION_KEY, JSON.stringify(currentUser));
        } else if (sessionStorage.getItem(SESSION_KEY)) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
        }
        notifyListeners();
    }

    return true;
};
