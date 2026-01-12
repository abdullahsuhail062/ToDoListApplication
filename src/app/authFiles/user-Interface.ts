import { Interface } from "readline"

export interface User {
    userName: string;
    email: string;
    id: number;
    avatar?: string
    isFavorite: boolean;
    isAdmin?: boolean;
    isVerified?: boolean;
    
} 