import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { supabase } from '../supabaseClient'

interface Dompet {
  id: number
  userId: string
  name: string
  balance: number
  cardbackground: string
  cardcolor: string
}

export default function Dashboard() {
  const [dompetList, setDompetList] = useState<Dompet[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [balance, setBalance] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchDompet()
  }, [])

  async function fetchDompet() {
    setLoading(true)
    const { data, error } = await supabase
      .from('dompet')
      .select()
      .order('balance', { ascending: false })

    if (error) {
      Alert.alert('Gagal Mengambil Data', error.message)
    } else if (data) {
      setDompetList(data)
    }
    setLoading(false)
  }

  async function handleSaveDompet() {
    if (!name.trim() || !balance.trim()) {
      Alert.alert('Peringatan', 'Nama dompet dan saldo awal wajib diisi!')
      return
    }

    setSubmitting(true)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      Alert.alert('Error Sesi', 'Sesi login tidak ditemukan. Silakan login ulang.')
      setSubmitting(false)
      return
    }

    if (editingId !== null) {
      const { error } = await supabase
        .from('dompet')
        .update({
          name: name.trim(),
          balance: parseInt(balance, 10) || 0,
        })
        .eq('id', editingId)

      if (error) {
        Alert.alert('Gagal Mengubah Dompet', error.message)
      } else {
        Alert.alert('Berhasil', 'Dompet berhasil diperbarui!')
        resetForm()
        fetchDompet()
      }
    } else {
      const { error } = await supabase.from('dompet').insert([
        {
          userId: user.id,
          name: name.trim(),
          balance: parseInt(balance, 10) || 0,
          cardbackground: '#1E293B',
          cardcolor: '#FFFFFF',
        },
      ])

      if (error) {
        Alert.alert('Gagal Menambah Dompet', error.message)
      } else {
        Alert.alert('Berhasil', 'Dompet baru berhasil disimpan!')
        resetForm()
        fetchDompet()
      }
    }
    setSubmitting(false)
  }

  function handleEditClick(item: Dompet) {
    setEditingId(item.id)
    setName(item.name)
    setBalance(item.balance.toString())
  }

  function resetForm() {
    setEditingId(null)
    setName('')
    setBalance('')
  }

  function handleDeleteDompet(id: number) {
    Alert.alert(
      'Hapus Dompet',
      'Apakah kamu yakin ingin menghapus dompet ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('dompet').delete().eq('id', id)
            if (error) {
              Alert.alert('Gagal Menghapus', error.message)
            } else {
              Alert.alert('Berhasil', 'Dompet berhasil dihapus.')
              fetchDompet()
            }
          },
        },
      ]
    )
  }

  const totalBalance = dompetList.reduce((acc, curr) => acc + curr.balance, 0)

  const renderDompetItem = ({ item }: { item: Dompet }) => (
    <View style={[styles.card, { backgroundColor: item.cardbackground || '#1E293B' }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardCategory}>DOMPET DIGITAL</Text>
          <Text style={[styles.cardName, { color: item.cardcolor || '#FFFFFF' }]} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => handleEditClick(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionBtnText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.deleteActionBtn]} 
            onPress={() => handleDeleteDompet(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={[styles.cardLabelSub, { color: item.cardcolor || '#FFFFFF' }]}>Saldo Aktif</Text>
        <Text style={[styles.cardBalance, { color: item.cardcolor || '#FFFFFF' }]} numberOfLines={1}>
          Rp {item.balance.toLocaleString('id-ID')}
        </Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.greetingText}>Selamat Datang,</Text>
            <Text style={styles.headerTitle}>Financial Hub</Text>
          </View>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>MY</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Total Aset / Akumulasi Saldo</Text>
          <Text style={styles.heroBalance} numberOfLines={1}>Rp {totalBalance.toLocaleString('id-ID')}</Text>
          <View style={styles.heroFooter}>
            <Text style={styles.heroSubText}>Terhubung dengan {dompetList.length} dompet aktif</Text>
          </View>
        </View>

        <View style={[styles.formCard, editingId !== null && styles.formCardEditing]}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {editingId !== null ? '✏️ Edit Dompet' : '+ Buat Dompet Baru'}
            </Text>
            <Text style={styles.formSubtitle}>
              {editingId !== null ? 'Perbarui informasi dompet kamu' : 'Atur alokasi finansialmu dengan rapi'}
            </Text>
          </View>

          <Text style={styles.label}>Nama Dompet</Text>
          <TextInput
            style={styles.input}
            placeholder="Misal: Dompet Harian, Tabungan Darurat"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Saldo Awal (Rp)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={balance}
            onChangeText={setBalance}
          />

          <View style={styles.formButtonRow}>
            {editingId !== null && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={resetForm}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, editingId !== null ? styles.buttonFlex : {}, submitting && styles.buttonDisabled]}
              onPress={handleSaveDompet}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {editingId !== null ? 'Simpan Perubahan' : '+ Simpan Dompet'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daftar Dompet Kamu</Text>
          <Text style={styles.sectionBadge}>{dompetList.length} Items</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4F46E5" style={styles.loaderSpacing} />
        ) : (
          <FlatList
            data={dompetList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderDompetItem}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Belum Ada Dompet Dibuat</Text>
                <Text style={styles.emptySubText}>
                  Tambahkan dompet pertama kamu di atas untuk mulai memantau saldo.
                </Text>
              </View>
            }
          />
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greetingText: { fontSize: 13, color: '#64748B', fontWeight: '500', letterSpacing: 0.2 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  profileBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#C7D2FE' },
  profileBadgeText: { color: '#4F46E5', fontWeight: '700', fontSize: 14 },
  
  heroCard: { backgroundColor: '#4F46E5', padding: 24, borderRadius: 24, marginBottom: 24, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 },
  heroLabel: { fontSize: 13, color: '#C7D2FE', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  heroBalance: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginTop: 8, letterSpacing: -0.5 },
  heroFooter: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
  heroSubText: { fontSize: 12, color: '#E0E7FF', fontWeight: '500' },

  formCard: { backgroundColor: '#FFFFFF', padding: 22, borderRadius: 24, marginBottom: 28, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  formCardEditing: { borderColor: '#4F46E5', borderWidth: 2, backgroundColor: '#FAFAFF' },
  formHeader: { marginBottom: 16 },
  formTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  formSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, backgroundColor: '#F8FAFC', color: '#0F172A', fontWeight: '500' },
  
  formButtonRow: { flexDirection: 'row', gap: 10, marginTop: 22 },
  button: { flex: 1, backgroundColor: '#0F172A', paddingVertical: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  buttonFlex: { flex: 2, marginTop: 0 },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },
  
  cancelButton: { flex: 1, paddingVertical: 16, borderRadius: 14, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  cancelButtonText: { color: '#334155', fontWeight: '700', fontSize: 14 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  sectionBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '600', color: '#475569' },

  card: { padding: 24, borderRadius: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  cardHeaderLeft: { flex: 1, marginRight: 12 },
  cardCategory: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 4 },
  cardName: { fontSize: 18, fontWeight: '700', letterSpacing: 0.2 },
  
  actionButtonsContainer: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  deleteActionBtn: { backgroundColor: 'rgba(239, 68, 68, 0.25)' },
  actionBtnText: { fontSize: 14 },

  cardFooter: { justifyContent: 'flex-end' },
  cardLabelSub: { fontSize: 11, fontWeight: '600', opacity: 0.75, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardBalance: { fontSize: 26, fontWeight: '800', marginTop: 4, letterSpacing: -0.5 },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 36, paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  emptyText: { textAlign: 'center', color: '#334155', fontWeight: '700', fontSize: 15 },
  emptySubText: { textAlign: 'center', color: '#94A3B8', fontSize: 13, marginTop: 6, lineHeight: 18 },

  loaderSpacing: { marginTop: 24 },
  bottomSpacer: { height: 40 },
})