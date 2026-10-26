import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { JwtPayload } from '@supabase/supabase-js';
import {
  supabase,
  getLocalSessionUser,
  clearLocalSessionUser,
  LocalUser,
} from '../lib/supabase';
import { Logo } from '../components/configuration/Logo';
import { LoadingUI } from '../components/configuration/LoadingUI';
import { PrimaryButton } from '../components/button/PrimaryButton';

export default function Index() {
  const router = useRouter();
  const [claims, setClaims] = useState<JwtPayload | null>(null);
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.auth
        .getClaims()
        .then(({ data }) => data?.claims ?? null)
        .catch(() => null),
      getLocalSessionUser().catch(() => null),
    ])
      .then(([supabaseClaims, storedUser]) => {
        setClaims(supabaseClaims);
        setLocalUser(storedUser);
      })
      .finally(() => {
        setInitializing(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      supabase.auth
        .getClaims()
        .then(({ data }) => {
          setClaims(data?.claims ?? null);
        })
        .catch(() => {
          setClaims(null);
        });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (initializing) {
    return <LoadingUI visible={true} fullScreen={true} message="Memuat sesi..." />;
  }

  if (!claims && !localUser) {
    return <Redirect href="/(auth)/welcome" />;
  }

  const displayEmail =
    (typeof claims?.email === 'string' ? claims.email : undefined) ?? localUser?.email;
  const displaySub = claims?.sub ?? localUser?.id;

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      <LoadingUI visible={signingOut} message="Keluar dari akun..." />
      <View className="items-center mb-8">
        <Logo size="medium" variant="outline" />
        <Text className="text-2xl font-bold mt-6">
          Welcome{localUser?.name ? `, ${localUser.name}` : ''}!
        </Text>
        {displaySub && (
          <Text className="text-gray-500 text-sm mt-2 text-center">
            User ID: {displaySub}
          </Text>
        )}
        {displayEmail && (
          <Text className="text-gray-700 font-medium mt-1">{displayEmail}</Text>
        )}
      </View>

      <PrimaryButton
        title={signingOut ? 'SIGNING OUT...' : 'SIGN OUT'}
        loading={signingOut}
        onPress={async () => {
          setSigningOut(true);
          await new Promise((resolve) => setTimeout(resolve, 600));
          await clearLocalSessionUser();
          await supabase.auth.signOut().catch(() => {});
          setLocalUser(null);
          setClaims(null);
          setSigningOut(false);
          router.replace('/(auth)/sign-in');
        }}
      />
    </SafeAreaView>
  );
}
