export interface LocalAccount {
  name: string;
  email: string;
  password: string;
}

const accounts: LocalAccount[] = [];

export function createLocalAccount(
  name: string,
  email: string,
  password: string
): LocalAccount | null {
  if (accounts.some((account) => account.email === email)) {
    return null;
  }

  const account = { name, email, password };
  accounts.push(account);
  return account;
}

export function authenticateLocalAccount(
  identifier: string,
  password: string
): LocalAccount | null {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  return (
    accounts.find(
      (account) =>
        (account.email === normalizedIdentifier ||
          account.name.toLowerCase() === normalizedIdentifier) &&
        account.password === password
    ) ?? null
  );
}
