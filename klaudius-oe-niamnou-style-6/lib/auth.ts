import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'Mahasiswa' | 'Dosen' | 'Admin';
  nimOrNidn?: string;
  className?: string;
  password: string;
}

// Akun Utama yang langsung FIX bisa masuk
export const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'user_main',
    username: 'admin@gmail.com',
    email: 'admin@gmail.com',
    fullName: 'Klaudius Oe Naimnou',
    phone: '081234567890',
    role: 'Mahasiswa',
    nimOrNidn: '240444020010',
    className: 'Informatika Komputer (IK-24)',
    password: 'test123',
  },
  {
    id: 'user_klaudius',
    username: 'klaudius',
    email: 'klaudius@lp3i.ac.id',
    fullName: 'Klaudius Oe Naimnou',
    phone: '081234567890',
    role: 'Mahasiswa',
    nimOrNidn: '240444020010',
    className: 'Informatika Komputer (IK-24)',
    password: 'test123',
  },
];

const STORAGE_USERS_KEY = '@uts_users_list_v3';
const STORAGE_ACTIVE_SESSION = '@uts_session_user_v3';

export const authService = {
  /**
   * Mengambil semua daftar akun
   */
  async getAllUsers(): Promise<UserAccount[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_USERS_KEY);
      if (!raw) {
        await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
        return DEFAULT_ACCOUNTS;
      }
      const parsed: UserAccount[] = JSON.parse(raw);
      // Pastikan admin@gmail.com selalu tersedia
      const hasMain = parsed.some(
        (u) => u.email.toLowerCase() === 'admin@gmail.com' && u.password === 'test123'
      );
      if (!hasMain) {
        parsed.unshift(DEFAULT_ACCOUNTS[0]);
        await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  },

  /**
   * Mendaftar akun baru
   */
  async register(params: {
    fullName: string;
    emailOrUsername: string;
    phone: string;
    password: string;
  }): Promise<UserAccount> {
    const { fullName, emailOrUsername, phone, password } = params;
    const cleanIdentifier = emailOrUsername.trim().toLowerCase();

    const users = await this.getAllUsers();

    const exists = users.find(
      (u) =>
        u.email.toLowerCase() === cleanIdentifier ||
        u.username.toLowerCase() === cleanIdentifier
    );

    if (exists) {
      throw new Error('Email atau username sudah terdaftar! Silakan gunakan yang lain.');
    }

    const cleanPass = password.trim();

    const newUser: UserAccount = {
      id: `user_${Date.now()}`,
      username: cleanIdentifier.includes('@') ? cleanIdentifier.split('@')[0] : cleanIdentifier,
      email: cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@gmail.com`,
      fullName: fullName.trim(),
      phone: phone.trim() || '081234567890',
      role: 'Mahasiswa',
      nimOrNidn: '240444020010',
      className: 'Informatika Komputer (IK-24)',
      password: cleanPass,
    };

    const updatedList = [...users, newUser];
    await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedList));

    return newUser;
  },

  /**
   * Login pengguna (admin@gmail.com / test123 dijamin FIX langsung masuk)
   */
  async login(identifier: string, password: string): Promise<UserAccount> {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // Jalur langsung fix untuk admin@gmail.com / test123
    if (
      (cleanId === 'admin@gmail.com' || cleanId === 'admin') &&
      cleanPass === 'test123'
    ) {
      const mainAcc = DEFAULT_ACCOUNTS[0];
      await AsyncStorage.setItem(STORAGE_ACTIVE_SESSION, JSON.stringify(mainAcc));
      return mainAcc;
    }

    const users = await this.getAllUsers();

    const matched = users.find(
      (u) =>
        (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
        u.password.trim() === cleanPass
    );

    if (!matched) {
      throw new Error('Username/Email atau Password salah! Periksa kembali data login Anda.');
    }

    // Simpan sesi aktif
    await AsyncStorage.setItem(STORAGE_ACTIVE_SESSION, JSON.stringify(matched));
    return matched;
  },

  /**
   * Mengambil sesi pengguna yang sedang login
   */
  async getActiveSession(): Promise<UserAccount | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_ACTIVE_SESSION);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    return null;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_ACTIVE_SESSION);
    } catch {}
  },
};
