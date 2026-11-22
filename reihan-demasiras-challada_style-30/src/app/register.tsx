import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

import { Checkbox } from "expo-checkbox";

import CustomButton from "@/components/Button";
import { supabase } from "@/lib/supabase";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validasi password: minimal 8 karakter
  const isPasswordValid = password.length === 0 || password.length >= 8;
  const isPasswordFilled = password.length >= 8;

  const router = useRouter();

  function handleHomePress() {
    router.push("/");
  }

  async function handleRegister() {
    // ── Validasi input ──────────────────────────────────────────────────────
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("Nama lengkap tidak boleh kosong.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Email tidak boleh kosong.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password minimal 8 karakter.");
      return;
    }
    if (!isChecked) {
      setErrorMessage("Kamu harus menyetujui syarat & ketentuan.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // ── Daftar ke Supabase ──────────────────────────────────────────────────
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      // Berhasil daftar → langsung ke halaman dompet
      router.replace("/dompet");
    }
  }

  return (
    <ScrollView className="bg-white">
      <View className="p-10 bg-white">

        {/* ── Header: tombol tutup + progress bar ── */}
        <View className="flex flex-row items-center gap-2">
          <Pressable onPress={handleHomePress}>
            <FontAwesomeIcon icon={faXmark} size={30} />
          </Pressable>

          <View className="flex-1 flex-row gap-2">
            <View className="h-1 flex-1 rounded-full bg-blue-600" />
            <View className="h-1 flex-1 rounded-full bg-gray-200" />
            <View className="h-1 flex-1 rounded-full bg-gray-200" />
          </View>
        </View>

        <Text className="text-[20px] font-medium mt-[35px]">
          Create your account
        </Text>

        <View className="flex flex-col gap-4 mt-[29px]">

          {/* ── Banner Error ── */}
          {errorMessage && (
            <View className="bg-red-400 py-2 px-3 rounded-[4px] flex items-center">
              <Text className="text-gray-50 font-semibold text-center text-sm">
                {errorMessage}
              </Text>
            </View>
          )}

          {/* ── First Name ── */}
          <View>
            <Text className="text-base font-medium">First Name</Text>
            <TextInput
              placeholder="Jhon"
              className="py-[14px] px-4 border border-[#BDBDBD] rounded-[4px] mt-[4px]"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          {/* ── Last Name ── */}
          <View>
            <Text className="text-base font-medium">Last Name</Text>
            <TextInput
              placeholder="Doe"
              className="py-[14px] px-4 border border-[#BDBDBD] rounded-[4px] mt-[4px]"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          {/* ── Email ── */}
          <View>
            <Text className="text-base font-medium">Email</Text>
            <TextInput
              placeholder="jhondoe@gmail.com"
              className="py-[14px] px-4 border border-[#BDBDBD] rounded-[4px] mt-[4px]"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* ── Country + Phone ── */}
          <View className="flex flex-row">
            <View>
              <Text className="text-base font-medium">Country</Text>
              <Pressable className="py-[14px] px-4 border border-[#BDBDBD] rounded-l-[4px] mt-[4px] flex flex-row items-center gap-1">
                <Text className="text-[#707070]">+62</Text>
                <FontAwesomeIcon icon={faChevronDown} color="#707070" />
              </Pressable>
            </View>

            <View className="flex-1">
              <Text className="text-base font-medium">Phone</Text>
              <TextInput
                placeholder="81234567890"
                className="py-[14px] px-4 border-t border-r border-b border-t-[#BDBDBD] border-r-[#BDBDBD] border-b-[#BDBDBD] rounded-r-[4px] mt-[4px]"
                keyboardType="number-pad"
                inputMode="numeric"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          {/* ── Password ── */}
          <View>
            <Text className="text-base font-medium">Password</Text>
            <View className="py-[4px] px-4 border border-[#BDBDBD] rounded-[4px] mt-[4px] flex flex-row justify-between items-center gap-2">
              <TextInput
                secureTextEntry
                placeholder="XXXXXXXX"
                className="flex-1"
                value={password}
                onChangeText={setPassword}
              />
              {isPasswordFilled && (
                <FontAwesomeIcon icon={faCircleCheck} color="#00A520" />
              )}
            </View>
            {/* Feedback validasi password */}
            {password.length > 0 && (
              <Text
                className="text-sm font-normal mt-1"
                style={{ color: isPasswordValid ? "#00A520" : "#EF4444" }}
              >
                {isPasswordFilled
                  ? "Looks Nice"
                  : `Password kurang ${8 - password.length} karakter lagi`}
              </Text>
            )}
          </View>

          {/* ── Checkbox syarat & ketentuan ── */}
          <View className="flex flex-row gap-[7px] mt-[40px]">
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? "#0152FE" : undefined}
            />
            <Text className="flex-1">
              I certify that I am 18 years of age or older, and I agree to the{" "}
              <Text className="color-[#2752E7]">User Agreement</Text> and{" "}
              <Text className="text-[#2752E7]">Privacy Policy</Text>
            </Text>
          </View>

          {/* ── Tombol Continue ── */}
          <View className="mt-[45px]">
            {loading ? (
              <View className="h-[62px] flex items-center justify-center">
                <ActivityIndicator size="large" color="#0152FE" />
              </View>
            ) : (
              <CustomButton title="Continue" onPress={handleRegister} />
            )}
          </View>

          {/* ── Link ke login ── */}
          <View className="flex flex-row justify-center mt-2 mb-4">
            <Text className="text-gray-500">Sudah punya akun? </Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text className="text-[#2752E7] font-semibold">Masuk</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}
