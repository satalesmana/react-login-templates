import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface CharacterProps {
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
}

/** Karakter 1 – Welcome Screen: 3 karakter 3D melompat gembira */
export const WelcomeCharacter: React.FC<CharacterProps> = ({ style, resizeMode = 'contain' }) => (
  <Image
    source={require('../../assets/images/welcome_characters.png')}
    style={[{ width: '100%', height: 320 }, style]}
    resizeMode={resizeMode}
  />
);

/** Karakter 2 – Login Screen: Karakter 3D duduk bersila dengan laptop */
export const LoginCharacter: React.FC<CharacterProps> = ({ style, resizeMode = 'contain' }) => (
  <Image
    source={require('../../assets/images/login_character.png')}
    style={[{ width: 230, height: 210 }, style]}
    resizeMode={resizeMode}
  />
);

/** Karakter 3 – Register Screen: Karakter 3D duduk di kursi dengan laptop */
export const RegisterCharacter: React.FC<CharacterProps> = ({ style, resizeMode = 'contain' }) => (
  <Image
    source={require('../../assets/images/register_character.png')}
    style={[{ width: 200, height: 220 }, style]}
    resizeMode={resizeMode}
  />
);
