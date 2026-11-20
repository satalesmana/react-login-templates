import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import WelcomeScreen from './WelcomeScreen';
import { supabase } from '../lib/supabase';

export default function Index() {
    const [checking, setChecking] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    // Cek session tersimpan: sudah login -> Main, belum -> Welcome
    useEffect(() => {
        supabase.auth.getClaims().then(({ data }) => {
            setLoggedIn(!!data?.claims);
            setChecking(false);
        });
    }, []);

    if (checking) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (loggedIn) {
        return <Redirect href="/Main-Screen" />;
    }

    return <WelcomeScreen />;
}
