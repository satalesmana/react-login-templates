import { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native"
import { useRouter } from "expo-router";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

import CustomButton from "@/components/Button";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorBanner, setErrorBanner] = useState(false);
    
  console.log(password);

    const router = useRouter();
    
    function handleSubmit() {
      if (email === "admin@gmail.com" && password === "12345678") {
        return router.push("/");
      }
      else {
        setErrorBanner(true);
      }
      setEmail("");
      setPassword("");
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
            {errorBanner && (
              <View className="bg-red-400 flex justify-center items-center h-auto py-2 rounded-sm">
                <Text className="text-gray-50 font-semibold text-center text-sm">
                  Invalid email and password!{"\n"}
                  email: admin@gmail.com{"\n"}
                  password: 12345678
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
            <CustomButton title="Login" onPress={handleSubmit} />
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