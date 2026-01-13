import { Interface } from "readline"

export interface User {
    username: string;
    email?: string;
    id: string;
    avatar?: string
    isFavorite?: boolean;
    isAdmin?: boolean;
    isVerified?: boolean;
    
} 