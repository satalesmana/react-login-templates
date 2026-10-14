import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundCircles from '@/components/BackgroundCircles';
import { Colors, Fonts } from '@/constants/theme';

// ====== ISI DATA KAMU DI SINI ======
const PROFILE = {
  name: 'Falaah Hamid Hutasoit',
  kelas: 'MI-24', // contoh: 'XI RPL 1'
};
// ===================================

const CATEGORIES = ['All', 'Shirt', 'Dress', 'Pants', 'Shoes', 'Bag'];
const PRODUCTS = [
  { id: '1', name: 'Yellow Sweater', price: 'Rp.100.000', icon: 'shirt-outline' as const },
  { id: '2', name: 'Basic T-Shirt', price: 'Rp.75.000', icon: 'shirt-outline' as const },
  { id: '3', name: 'Canvas Bag', price: 'Rp.150.000', icon: 'bag-handle-outline' as const },
  { id: '4', name: 'Shopping Bag', price: 'Rp.90.000', icon: 'bag-outline' as const },
  { id: '5', name: 'Sneakers', price: 'Rp.450.000', icon: 'footsteps-outline' as const },
  { id: '6', name: 'Gift Box', price: 'Rp.150.000', icon: 'gift-outline' as const },
];

const initials = PROFILE.name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((w) => w[0])
  .join('')
  .toUpperCase();

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <BackgroundCircles height={220} />
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={PRODUCTS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 14 }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              {/* Header: logo + keranjang */}
              <View style={styles.topRow}>
                <Text style={styles.logo}>
                  Mini <Text style={{ color: Colors.primary }}>Shop</Text>
                </Text>
                <Ionicons name="cart-outline" size={26} color={Colors.text} />
              </View>

              {/* Kartu identitas: nama + kelas */}
              <View style={styles.profileCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials || '?'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hello}>Hello,</Text>
                  <Text style={styles.name} numberOfLines={1}>
                    {PROFILE.name}
                  </Text>
                  <View style={styles.classBadge}>
                    <Ionicons name="school-outline" size={14} color={Colors.text} />
                    <Text style={styles.classText}>Kelas {PROFILE.kelas}</Text>
                  </View>
                </View>
              </View>

              {/* Banner */}
              <View style={styles.banner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bannerSmall}>Special offer</Text>
                  <Text style={styles.bannerTitle}>Up to 30% off{'\n'}new arrivals</Text>
                  <Pressable style={styles.bannerBtn}>
                    <Text style={styles.bannerBtnText}>Shop now</Text>
                  </Pressable>
                </View>
                <Ionicons name="pricetags-outline" size={72} color={Colors.primary} />
              </View>

              {/* Search */}
              <View style={styles.search}>
                <Ionicons name="search-outline" size={18} color={Colors.muted} />
                <TextInput
                  placeholder="Search product"
                  placeholderTextColor={Colors.muted}
                  style={styles.searchInput}
                />
              </View>

              {/* Kategori */}
              <FlatList
                horizontal
                data={CATEGORIES}
                keyExtractor={(c) => c}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, marginVertical: 18 }}
                renderItem={({ item, index }) => (
                  <Pressable style={[styles.chip, index === 0 && styles.chipActive]}>
                    <Text style={styles.chipText}>{item}</Text>
                  </Pressable>
                )}
              />
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardImage}>
                <Ionicons name={item.icon} size={46} color={Colors.primary} />
              </View>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.footerCard}>
              <Text style={styles.footerLabel}>Dibuat oleh</Text>
              <Text style={styles.footerName}>{PROFILE.name}</Text>
              <Text style={styles.footerClass}>Kelas {PROFILE.kelas}</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { paddingHorizontal: 20, paddingBottom: 32 },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  logo: { fontFamily: Fonts.logo, fontSize: 24, color: Colors.text },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: Fonts.semiBold, fontSize: 22, color: Colors.text },
  hello: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.muted },
  name: { fontFamily: Fonts.semiBold, fontSize: 18, color: Colors.text, marginTop: 1 },
  classBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.circleLight,
  },
  classText: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.text },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    padding: 18,
    borderRadius: 14,
    backgroundColor: Colors.circleLight,
  },
  bannerSmall: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.muted },
  bannerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    lineHeight: 23,
    color: Colors.text,
    marginTop: 2,
  },
  bannerBtn: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
  },
  bannerBtnText: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.text },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 46,
    marginTop: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    backgroundColor: Colors.background,
  },
  searchInput: { flex: 1, fontFamily: Fonts.regular, fontSize: 15 },

  chip: {
    paddingHorizontal: 18,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    backgroundColor: Colors.circleLight,
  },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.text },

  card: { flex: 1, marginBottom: 16 },
  cardImage: {
    height: 150,
    borderRadius: 10,
    backgroundColor: Colors.circleLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: { fontFamily: Fonts.medium, fontSize: 15, marginTop: 8, color: Colors.text },
  cardPrice: { fontFamily: Fonts.semiBold, fontSize: 14, color: Colors.text, marginTop: 2 },

  footerCard: {
    marginTop: 8,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  footerLabel: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.text },
  footerName: { fontFamily: Fonts.semiBold, fontSize: 18, color: Colors.text, marginTop: 2 },
  footerClass: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.text, marginTop: 2 },
});
