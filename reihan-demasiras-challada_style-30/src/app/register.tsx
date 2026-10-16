import { View, Text, ScrollView, Pressable, TextInput } from "react-native"
import { useState } from "react";
import { useRouter } from "expo-router";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

import { Checkbox } from "expo-checkbox";

import CustomButton from "@/components/Button";

export default function Register() {
    const [isChecked, setIsChecked] = useState(false);

    const router = useRouter();

    function handleHomePress() {
      router.push("/");
    }

    return (
      <ScrollView>
        <View className="p-10 bg-white">
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
            <View>
              <Text className="text-base font-medium">First Name</Text>
              <TextInput
                placeholder="Jhon"
                className="py-[14px] px-4 border border-[#BDBDBD] rounded-[4px] mt-[4px]"
              />
            </View>

            <View>
              <Text className="text-base font-medium">Last Name</Text>
              <TextInput
                placeholder="Doe"
                className="py-[14px] px-4 border border-[#BDBDBD] rounded-[4px] mt-[4px]"
              />
            </View>

            <View>
              <Text className="text-base font-medium">Email</Text>
              <TextInput
                placeholder="jhondoe@gmail.com"
                className="py-[14px] px-4 border border-[#BDBDBD] rounded-[4px] mt-[4px]"
              />
            </View>

            <View className="flex flex-row">
              <View>
                <Text className="text-base font-medium">Country</Text>
                <Pressable className="py-[14px] px-4 border border-[#BDBDBD] rounded-l-[4px] mt-[4px] flex flex-row items-center gap-1">
                  <Text className="text-[#707070]">+33</Text>
                  <FontAwesomeIcon icon={faChevronDown} color="#707070" />
                </Pressable>
              </View>

              <View className="flex-1">
                <Text className="text-base font-medium">Phone</Text>
                <TextInput
                  placeholder="+6281234567890"
                  className="py-[14px] px-4 border-t border-r border-b border-t-[#BDBDBD] border-r-[#BDBDBD] border-b-[#BDBDBD] rounded-r-[4px] mt-[4px]"
                  keyboardType="number-pad"
                  inputMode="numeric"
                />
              </View>
            </View>

            <View>
              <Text className="text-base font-medium">Password</Text>
              <View className="py-[4px] px-4 border border-[#BDBDBD] rounded-[4px] mt-[4px] flex flex-row justify-between items-center gap-2">
                <TextInput
                  secureTextEntry={true}
                  placeholder="XXXXXXXX"
                  className="flex-1"
                />
                <FontAwesomeIcon icon={faCircleCheck} color="#00A520" />
              </View>
              <Text className="text-sm text-[#00A520] font-normal mt-1">
                Looks Nice
              </Text>
            </View>

            <View className="flex flex-row gap-[7px] mt-[40px]">
              <Checkbox
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? "#0152FE" : undefined}
              />
              <Text>
                I certify that I am 18 years of age or older, and I agree to the{" "}
                <Text className="color-[#2752E7]">User Agreement</Text> and{" "}
                <Text className="text-[#2752E7]">Privacy Policy</Text>
              </Text>
            </View>

            <View className="mt-[45px]">
              <CustomButton title="Continue" onPress={handleHomePress} />
            </View>
          </View>
        </View>
      </ScrollView>
    );
}