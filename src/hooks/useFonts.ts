import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export const useFonts = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [fontError, setFontError] = useState<Error | null>(null);

    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync({
                    'Orbitron-Regular': require('../../assets/fonts/Orbitron-Regular.ttf'),
                    'Orbitron-Medium': require('../../assets/fonts/Orbitron-Medium.ttf'),
                    'Orbitron-SemiBold': require('../../assets/fonts/Orbitron-SemiBold.ttf'),
                    'Orbitron-Bold': require('../../assets/fonts/Orbitron-Bold.ttf'),
                    'Orbitron-ExtraBold': require('../../assets/fonts/Orbitron-ExtraBold.ttf'),
                    'Orbitron-Black': require('../../assets/fonts/Orbitron-Black.ttf'),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error('Error loading fonts:', error);
                setFontError(error as Error);
                setFontsLoaded(false);
            }
        }

        loadFonts();
    }, []);

    return { fontsLoaded, fontError };
};