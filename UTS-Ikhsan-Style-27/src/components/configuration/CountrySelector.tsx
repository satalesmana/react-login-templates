import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export interface CountryOption {
  iso: string;
  name: string;
  code: string;
}

export const COUNTRY_LIST: CountryOption[] = [
  { iso: 'ID', name: 'Indonesia', code: '+62' },
  { iso: 'US', name: 'United States', code: '+1' },
  { iso: 'MY', name: 'Malaysia', code: '+60' },
  { iso: 'SG', name: 'Singapore', code: '+65' },
  { iso: 'JP', name: 'Japan', code: '+81' },
  { iso: 'KR', name: 'South Korea', code: '+82' },
  { iso: 'SA', name: 'Saudi Arabia', code: '+966' },
  { iso: 'GB', name: 'United Kingdom', code: '+44' },
  { iso: 'AU', name: 'Australia', code: '+61' },
];

export function FlagIcon({ iso }: { iso: string }) {
  switch (iso) {
    case 'ID':
      return (
        <View
          style={{ width: 22, height: 15, borderRadius: 2, overflow: 'hidden', borderWidth: 0.5, borderColor: '#d1d5db' }}
        >
          <View style={{ flex: 1, backgroundColor: '#EE2737' }} />
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
        </View>
      );
    case 'US':
      return (
        <View
          style={{ width: 22, height: 15, borderRadius: 2, overflow: 'hidden', borderWidth: 0.5, borderColor: '#d1d5db', backgroundColor: '#FFFFFF' }}
        >
          <View style={{ flex: 1, backgroundColor: '#B22234' }} />
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
          <View style={{ flex: 1, backgroundColor: '#B22234' }} />
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
          <View style={{ flex: 1, backgroundColor: '#B22234' }} />
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
          <View style={{ flex: 1, backgroundColor: '#B22234' }} />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 10,
              height: 8,
              backgroundColor: '#3C3B6E',
            }}
          />
        </View>
      );
    case 'MY':
      return (
        <View
          style={{ width: 22, height: 15, borderRadius: 2, overflow: 'hidden', borderWidth: 0.5, borderColor: '#d1d5db', backgroundColor: '#FFFFFF' }}
        >
          <View style={{ flex: 1, backgroundColor: '#CC0000' }} />
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
          <View style={{ flex: 1, backgroundColor: '#CC0000' }} />
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
          <View style={{ flex: 1, backgroundColor: '#CC0000' }} />
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 11,
              height: 8,
              backgroundColor: '#010066',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFCC00' }} />
          </View>
        </View>
      );
    case 'SG':
      return (
        <View
          style={{ width: 22, height: 15, borderRadius: 2, overflow: 'hidden', borderWidth: 0.5, borderColor: '#d1d5db' }}
        >
          <View style={{ flex: 1, backgroundColor: '#EF3340', justifyContent: 'center', paddingLeft: 3 }}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFFFFF' }} />
          </View>
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
        </View>
      );
    case 'JP':
      return (
        <View
          style={{
            width: 22,
            height: 15,
            borderRadius: 2,
            overflow: 'hidden',
            borderWidth: 0.5,
            borderColor: '#d1d5db',
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#BC002D' }} />
        </View>
      );
    case 'KR':
      return (
        <View
          style={{
            width: 22,
            height: 15,
            borderRadius: 2,
            overflow: 'hidden',
            borderWidth: 0.5,
            borderColor: '#d1d5db',
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: 7, height: 7, borderRadius: 3.5, overflow: 'hidden' }}>
            <View style={{ flex: 1, backgroundColor: '#CD2E3A' }} />
            <View style={{ flex: 1, backgroundColor: '#0047A0' }} />
          </View>
        </View>
      );
    case 'SA':
      return (
        <View
          style={{
            width: 22,
            height: 15,
            borderRadius: 2,
            overflow: 'hidden',
            borderWidth: 0.5,
            borderColor: '#d1d5db',
            backgroundColor: '#006C35',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: 12, height: 2, backgroundColor: '#FFFFFF', borderRadius: 1 }} />
        </View>
      );
    case 'GB':
      return (
        <View
          style={{
            width: 22,
            height: 15,
            borderRadius: 2,
            overflow: 'hidden',
            borderWidth: 0.5,
            borderColor: '#d1d5db',
            backgroundColor: '#012169',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ position: 'absolute', width: 22, height: 3, backgroundColor: '#FFFFFF' }} />
          <View style={{ position: 'absolute', width: 3, height: 15, backgroundColor: '#FFFFFF' }} />
          <View style={{ position: 'absolute', width: 22, height: 1.5, backgroundColor: '#C8102E' }} />
          <View style={{ position: 'absolute', width: 1.5, height: 15, backgroundColor: '#C8102E' }} />
        </View>
      );
    case 'AU':
      return (
        <View
          style={{
            width: 22,
            height: 15,
            borderRadius: 2,
            overflow: 'hidden',
            borderWidth: 0.5,
            borderColor: '#d1d5db',
            backgroundColor: '#00008B',
          }}
        >
          <View
            style={{
              width: 10,
              height: 7,
              backgroundColor: '#012169',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ position: 'absolute', width: 10, height: 1.5, backgroundColor: '#C8102E' }} />
            <View style={{ position: 'absolute', width: 1.5, height: 7, backgroundColor: '#C8102E' }} />
          </View>
          <View
            style={{
              position: 'absolute',
              right: 4,
              bottom: 3,
              width: 3,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: '#FFFFFF',
            }}
          />
        </View>
      );
    default:
      return null;
  }
}

interface CountrySelectorProps {
  selectedCountry: CountryOption;
  onSelect: (country: CountryOption) => void;
}

export function CountrySelector({ selectedCountry, onSelect }: CountrySelectorProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
        className="flex-row items-center pr-2.5 mr-1 border-r border-gray-300"
      >
        <View className="mr-1.5">
          <FlagIcon iso={selectedCountry.iso} />
        </View>
        <Text className="text-gray-700 text-xs font-semibold mr-1.5">{selectedCountry.code}</Text>
        <FontAwesome name="caret-down" size={12} color="#6b7280" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setVisible(false)}
          className="flex-1 bg-black/40 justify-center items-center px-6"
        >
          <View className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-lg max-h-96">
            <View className="flex-row justify-between items-center mb-3 pb-2 border-b border-gray-100">
              <Text className="font-bold text-gray-800 text-sm">Pilih Kode Negara</Text>
              <TouchableOpacity onPress={() => setVisible(false)} className="p-1">
                <FontAwesome name="close" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={COUNTRY_LIST}
              keyExtractor={(item) => item.iso}
              renderItem={({ item }) => {
                const isSelected = item.iso === selectedCountry.iso;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item);
                      setVisible(false);
                    }}
                    className={`flex-row items-center justify-between py-2.5 px-3 rounded-xl mb-1 ${
                      isSelected ? 'bg-green-50' : ''
                    }`}
                  >
                    <View className="flex-row items-center">
                      <FlagIcon iso={item.iso} />
                      <Text
                        className={`ml-3 text-sm ${
                          isSelected ? 'font-bold text-primary' : 'text-gray-700'
                        }`}
                      >
                        {item.name}
                      </Text>
                    </View>
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-primary' : 'text-gray-400'
                      }`}
                    >
                      {item.code}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
