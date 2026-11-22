import { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

import CustomButton from "@/components/Button";
import { supabase } from "@/lib/supabase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit() {
      if (!email || !password) {
        setErrorMessage("Email dan password tidak boleh kosong!");
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      setLoading(false);

      if (error) {
        setErrorMessage(error.message);
        setPassword("");
      } else {
        router.replace("/dompet");
      }
    }

    function handleHomePress() {
        router.push("/");
    }

    return (
      <ScrollView>
        <View className="bg-white h-screen p-10">
          <Pressable onPress={handleHomePress}>
            <FontAwesomeIcon icon={faXmark} size={30} />
          </Pressable>

          <Text className="mt-[48px] text-xl font-medium">Login to light</Text>

          <View className="mt-[46px] flex flex-col gap-[14px]">
            {errorMessage && (
              <View className="bg-red-400 flex justify-center items-center h-auto py-2 rounded-sm">
                <Text className="text-gray-50 font-semibold text-center text-sm">
                  {errorMessage}
                </Text>
              </View>
            )}

            <View>
              <Text className="text-base font-medium">Email</Text>
              <TextInput
                placeholder="johndoe@gmail.com"
                className="py-[14px] px-4 border border-[#BDBDBD] rounded-[4px] mt-[4px]"
                value={email}
                onChangeText={setEmail}
                onSubmitEditing={handleSubmit}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

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
                <FontAwesomeIcon icon={faCircleCheck} color="#00A520" />
              </View>
            </View>
          </View>

          <View className="flex flex-row justify-between mt-[33px]">
            <Text className="text-[#2752E7]">Forgot Password</Text>
            <Text className="text-[#2752E7]">Privacy Policy</Text>
          </View>

          <View className="mt-[74px]">
            {loading ? (
              <View className="h-[62px] flex items-center justify-center">
                <ActivityIndicator size="large" color="#0152FE" />
              </View>
            ) : (
              <CustomButton title="Login" onPress={handleSubmit} />
            )}
            <Pressable
              className="bg-white mt-[34px] active:bg-gray-100 w-full h-[62px] flex items-center justify-center px-[15px] py-[10px] rounded-md border border-[#CFCFCF]"
              onPress={handleHomePress}
            >
              <Text className="color-black font-bold text-[16px]">
                Connect to a wallet
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
}
