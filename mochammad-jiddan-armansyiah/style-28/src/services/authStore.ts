export interface UserAccount {
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: "admin" | "user";
}

const registeredUsers: UserAccount[] = [
  {
    username: "admin",
    fullName: "Administrator",
    email: "admin@gmail.com",
    phone: "08123456789",
    password: "12345678",
    role: "admin",
  },
  {
    username: "user",
    fullName: "Demo User",
    email: "user@gmail.com",
    phone: "08987654321",
    password: "user1234",
    role: "user",
  },
];

let currentUser: UserAccount | null = null;

export const authService = {
  getUsers: (): UserAccount[] => registeredUsers,

  getCurrentUser: (): UserAccount | null => currentUser,

  setCurrentUser: (user: UserAccount | null) => {
    currentUser = user;
  },

  register: (account: Omit<UserAccount, "role"> & { role?: "admin" | "user" }) => {
    const existing = registeredUsers.find(
      (u) =>
        u.username.toLowerCase() === account.username.toLowerCase() ||
        u.email.toLowerCase() === account.email.toLowerCase()
    );

    if (existing) {
      throw new Error("Username atau Email sudah terdaftar!");
    }

    const newUser: UserAccount = {
      ...account,
      role: account.role || "user",
    };

    registeredUsers.push(newUser);
    return newUser;
  },

  login: (identifier: string, password: string): UserAccount => {
    const cleanId = identifier.trim().toLowerCase();

    if (cleanId === "admin" && password === "12345678") {
      const adminUser: UserAccount = {
        username: "admin",
        fullName: "Administrator",
        email: "admin@gmail.com",
        password: "12345678",
        role: "admin",
      };
      currentUser = adminUser;
      return adminUser;
    }

    const found = registeredUsers.find(
      (u) =>
        (u.username.toLowerCase() === cleanId ||
          u.email.toLowerCase() === cleanId) &&
        u.password === password
    );

    if (!found) {
      throw new Error("Username/Email atau Password salah!");
    }

    currentUser = found;
    return found;
  },

  logout: () => {
    currentUser = null;
  },
};
