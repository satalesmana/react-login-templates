import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import Svg, { Path } from 'react-native-svg';

export default function AdminWalletsScreen() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State Modal Form (Tambah/Edit)
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form Field States
  const [name, setName] = useState('');
  const [type, setType] = useState('Bank');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState('#5B51D8');

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetch wallets:', error.message);
        Alert.alert('Gagal', 'Tidak dapat mengambil data dompet.');
      } else {
        setWallets(data || []);
      }
    } catch (err: any) {
      console.error('Exception:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName('');
    setType('Bank');
    setBalance('');
    setColor('#5B51D8');
    setModalVisible(true);
  };

  const handleOpenEditModal = (wallet: any) => {
    setIsEditing(true);
    setCurrentId(wallet.id);
    setName(wallet.name);
    setType(wallet.type || 'Bank');
    setBalance(String(wallet.balance));
    setColor(wallet.color || '#5B51D8');
    setModalVisible(true);
  };

  const handleSaveWallet = async () => {
    if (!name.trim() || !balance.trim()) {
      Alert.alert('Peringatan', 'Nama dompet dan saldo wajib diisi!');
      return;
    }

    try {
      // Ambil user ID yang sedang aktif saat ini
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;

      if (!userId) {
        Alert.alert('Error', 'Sesi pengguna tidak ditemukan. Silakan login ulang.');
        return;
      }

      if (isEditing && currentId) {
        // UPDATE Dompet
        const { error } = await supabase
          .from('wallets')
          .update({
            name: name.trim(),
            type: type,
            balance: parseFloat(balance),
            color: color,
          })
          .eq('id', currentId);

        if (error) throw error;
        Alert.alert('Sukses', 'Dompet berhasil diperbarui!');
      } else {
        // INSERT Dompet Baru
        const { error } = await supabase.from('wallets').insert([
          {
            user_id: userId,
            name: name.trim(),
            type: type,
            balance: parseFloat(balance),
            color: color,
          },
        ]);

        if (error) throw error;
        Alert.alert('Sukses', 'Dompet baru berhasil ditambahkan!');
      }

      setModalVisible(false);
      fetchWallets();
    } catch (err: any) {
      console.error('Error save wallet:', err.message);
      Alert.alert('Terjadi Kesalahan', err.message);
    }
  };

  const handleDeleteWallet = (id: string) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah lu yakin ingin menghapus dompet ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('wallets').delete().eq('id', id);
            if (error) {
              Alert.alert('Gagal', error.message);
            } else {
              Alert.alert('Sukses', 'Dompet berhasil dihapus.');
              fetchWallets();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Halaman */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.badge}>MANAJEMEN KEUANGAN</Text>
          <Text style={styles.title}>Kelola Dompet / Wallets 👛</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenAddModal}>
          <Text style={styles.addButtonText}>+ Tambah Dompet</Text>
        </TouchableOpacity>
      </View>

      {/* Daftar Dompet */}
      {loading ? (
        <ActivityIndicator size="large" color="#5B51D8" style={{ marginTop: 40 }} />
      ) : wallets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada data dompet yang tersimpan.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {wallets.map((item) => (
            <View key={item.id} style={[styles.walletCard, { borderLeftColor: item.color || '#5B51D8' }]}>
              <View style={styles.walletInfo}>
                <View style={styles.walletHeaderRow}>
                  <Text style={styles.walletName}>{item.name}</Text>
                  <Text style={styles.walletType}>{item.type}</Text>
                </View>
                <Text style={styles.walletBalance}>
                  Rp {Number(item.balance || 0).toLocaleString('id-ID')}
                </Text>
              </View>

              {/* Action Buttons (Edit & Delete) */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => handleOpenEditModal(item)}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteWallet(item.id)}
                >
                  <Text style={styles.deleteBtnText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal Form Tambah/Edit Dompet */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Dompet' : 'Tambah Dompet Baru'}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Dompet (Contoh: BCA, Dompet Saku)</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama dompet"
                placeholderTextColor="#A0A0A0"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipe Dompet</Text>
              <TextInput
                style={styles.input}
                placeholder="Bank, Cash, E-Wallet"
                placeholderTextColor="#A0A0A0"
                value={type}
                onChangeText={setType}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Saldo Awal (Rp)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
                value={balance}
                onChangeText={setBalance}
              />
            </View>

            {/* Tombol Aksi Modal */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveWallet}>
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#5B51D8',
    backgroundColor: '#EEECFB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222222',
  },
  addButton: {
    backgroundColor: '#5B51D8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  walletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  walletInfo: {
    flex: 1,
  },
  walletHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  walletName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },
  walletType: {
    fontSize: 10,
    color: '#5B51D8',
    backgroundColor: '#EEECFB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  walletBalance: {
    fontSize: 15,
    fontWeight: '600',
    color: '#059669',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    backgroundColor: '#EEECFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editBtnText: {
    color: '#5B51D8',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteBtnText: {
    color: '#E53E3E',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888888',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#5B51D8',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});