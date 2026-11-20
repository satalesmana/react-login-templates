export interface User {
    name: string;
    birthDate: Date | null;
    email: string;
    password: string;
}

// Akun awal (untuk testing)
const users: User[] = [
    { name: 'Tes', birthDate: null, email: 'tes@gmail.com', password: 'tes123' },
];

const normalize = (email: string) => email.trim().toLowerCase();

export const isEmailRegistered = (email: string) =>
    users.some((u) => u.email === normalize(email));

export const registerUser = (user: User) => {
    users.push({ ...user, email: normalize(user.email) });
};

export const findUser = (email: string, password: string) =>
    users.find((u) => u.email === normalize(email) && u.password === password);