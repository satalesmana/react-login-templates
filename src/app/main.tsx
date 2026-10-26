import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ─────────────────── Static mock data ─────────────────── */

const CATEGORIES = ['All', 'Popular', 'Trending', 'Nearby'];

const DESTINATIONS = [
  {
    id: '1',
    name: 'Bali, Indonesia',
    rating: '4.9',
    price: '\$240',
    tag: '🏝️ Beach',
    bgColor: '#EEF0FF',
  },
  {
    id: '2',
    name: 'Kyoto, Japan',
    rating: '4.8',
    price: '\$380',
    tag: '⛩️ Culture',
    bgColor: '#FFF0F5',
  },
  {
    id: '3',
    name: 'Santorini, Greece',
    rating: '4.7',
    price: '\$510',
    tag: '🌅 Scenic',
    bgColor: '#F0F8FF',
  },
];

const POPULAR = [
  { id: 'a', name: 'Paris, France', detail: '5 days · 4 nights', emoji: '🗼' },
  { id: 'b', name: 'Maldives', detail: '7 days · 6 nights', emoji: '🤿' },
  { id: 'c', name: 'New York, USA', detail: '4 days · 3 nights', emoji: '🗽' },
];

/* ─────────────────── Component ─────────────────── */

export default function MainScreen() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.userName}>Evanneskyr!</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn}>
            <Text style={styles.avatarText}>EV</Text>
          </TouchableOpacity>
        </View>

        {/* ── Search bar ── */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search destinations…</Text>
          <View style={styles.filterBtn}>
            <Text style={styles.filterIcon}>⊞</Text>
          </View>
        </View>

        {/* ── Banner ── */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerLabel}>Special Offer</Text>
            <Text style={styles.bannerTitle}>Up to 40% off{'\n'}your next trip!</Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>Book now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('@/assets/images/welcome.jpeg')}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {/* ── Categories ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat, idx) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, activeCategory === idx && styles.categoryChipActive]}
              onPress={() => setActiveCategory(idx)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === idx && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Destination cards (horizontal) ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.destinationRow}
        >
          {DESTINATIONS.map((dest) => (
            <TouchableOpacity key={dest.id} style={[styles.destCard, { backgroundColor: dest.bgColor }]}>
              <View style={styles.destTagBadge}>
                <Text style={styles.destTagText}>{dest.tag}</Text>
              </View>
              <Text style={styles.destName}>{dest.name}</Text>
              <View style={styles.destFooter}>
                <Text style={styles.destRating}>⭐ {dest.rating}</Text>
                <Text style={styles.destPrice}>{dest.price}<Text style={styles.destPriceSuffix}>/person</Text></Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Popular trips ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Trips</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.popularList}>
          {POPULAR.map((item) => (
            <TouchableOpacity key={item.id} style={styles.popularItem}>
              <View style={styles.popularEmoji}>
                <Text style={styles.popularEmojiText}>{item.emoji}</Text>
              </View>
              <View style={styles.popularInfo}>
                <Text style={styles.popularName}>{item.name}</Text>
                <Text style={styles.popularDetail}>{item.detail}</Text>
              </View>
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>← Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─────────────────── Styles ─────────────────── */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  scroll: { flex: 1 },
  content: {
    paddingBottom: 40,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 13,
    color: '#8A8A9A',
    marginBottom: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: -0.3,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#5B67F8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B67F8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Search */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 24,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchPlaceholder: { flex: 1, fontSize: 14, color: '#AAAAAA' },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#5B67F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: { color: '#FFFFFF', fontSize: 14 },

  /* Banner */
  bannerCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#5B67F8',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 24,
    minHeight: 140,
  },
  bannerText: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  bannerLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: 14,
  },
  bannerBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: '#5B67F8',
    fontSize: 13,
    fontWeight: '700',
  },
  bannerImage: {
    width: 130,
    height: '100%',
  },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  seeAll: {
    fontSize: 13,
    color: '#5B67F8',
    fontWeight: '600',
  },

  /* Categories */
  categoriesRow: {
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#5B67F8',
    borderColor: '#5B67F8',
  },
  categoryText: {
    fontSize: 13,
    color: '#8A8A9A',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Destination cards */
  destinationRow: {
    paddingHorizontal: 24,
    gap: 14,
    marginBottom: 28,
  },
  destCard: {
    width: 160,
    borderRadius: 18,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  destTagBadge: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  destTagText: { fontSize: 11, fontWeight: '600', color: '#1A1A2E' },
  destName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
    marginTop: 24,
  },
  destFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destRating: { fontSize: 12, color: '#5A5A7A' },
  destPrice: { fontSize: 14, fontWeight: '700', color: '#5B67F8' },
  destPriceSuffix: { fontSize: 10, fontWeight: '400', color: '#8A8A9A' },

  /* Popular list */
  popularList: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 28,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  popularEmoji: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularEmojiText: { fontSize: 22 },
  popularInfo: { flex: 1 },
  popularName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 3,
  },
  popularDetail: { fontSize: 12, color: '#8A8A9A' },
  popularBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#5B67F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularBadgeText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  /* Logout */
  logoutBtn: {
    marginHorizontal: 24,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    color: '#8A8A9A',
    fontWeight: '600',
  },
});
