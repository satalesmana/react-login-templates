import { View, Text, ScrollView, TextInput, Pressable } from "react-native"
import { useRouter } from "expo-router";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { text } from "@fortawesome/fontawesome-svg-core";

import CustomButton from "@/components/Button";

export default function Login() {

    const router = useRouter();

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
            {/* Email */}
            <View>
              <Text className="text-base font-medium">Email</Text>
              <TextInput
                placeholder="johndoe@gmail.com"
                className="py-[14px] px-4 border border-[#BDBDBD] rounded-[4px] mt-[4px]"
              />
            </View>
            {/* Password */}
            <View>
              <Text className="text-base font-medium">Password</Text>
              <TextInput
                secureTextEntry={true}
                placeholder="XXXXXXXX"
                className="py-[14px] px-4 border border-[#BDBDBD] rounded-[4px] mt-[4px]"
              />
            </View>
          </View>

          <View className="flex flex-row justify-between mt-[33px]">
            <Text className="text-[#2752E7]">Forgot Password</Text>
            <Text className="text-[#2752E7]">Privacy Policy</Text>
          </View>
          
          <View className="mt-[74px]">
            <CustomButton title="Login" onPress={handleHomePress} />
            <Pressable className="bg-white mt-[34px] active:bg-gray-100 w-full h-[62px] flex items-center justify-center px-[15px] py-[10px] rounded-md border border-[#CFCFCF]" onPress={handleHomePress}>
              <Text className="color-black font-bold text-[16px]">Connect to a wallet</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
}