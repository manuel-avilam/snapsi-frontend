import { COLORS } from "@/constants/theme";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import type { IUserProfile } from "@/types/UserTypes";
import PulsateButton from "./ui/PulsateButton";
import ImageModal from "./Modals/ImageModal";
import { useState } from "react";
import { PLACEHOLDER_PROFILE_IMAGE } from "@/constants/assets";

export default function ProfileInformation({
  profileInfo,
}: {
  profileInfo: IUserProfile | undefined;
}) {
  const [selectedImage, setSelectedImage] = useState<string>("");

  return (
    <View style={styles.container}>
      <View style={styles.profileImageAndStatsContainer}>
        <PulsateButton
          onPress={() =>
            setSelectedImage(profileInfo?.profile_picture_url || "")
          }
        >
          <Image
            style={styles.profileImage}
            source={
              profileInfo?.profile_picture_url
                ? {
                    uri: profileInfo?.profile_picture_url,
                  }
                : PLACEHOLDER_PROFILE_IMAGE
            }
            contentFit="cover"
            cachePolicy={"memory-disk"}
            transition={500}
          />
        </PulsateButton>
        <View style={styles.statsContainer}>
          <View>
            <Text style={styles.profileStatCount}>
              {profileInfo?.post_count}
            </Text>
            <Text style={styles.profileStatLabel}>Posts</Text>
          </View>
          <View>
            <Text style={styles.profileStatCount}>
              {profileInfo?.follower_count}
            </Text>
            <Text style={styles.profileStatLabel}>Followers</Text>
          </View>
          <View>
            <Text style={styles.profileStatCount}>
              {profileInfo?.following_count}
            </Text>
            <Text style={styles.profileStatLabel}>Following</Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.profileName}>{profileInfo?.name}</Text>
        <Text style={styles.profileDescription}>
          {profileInfo?.bio || "No biography."}
        </Text>
      </View>

      <ImageModal
        isVisible={!!selectedImage}
        onClose={() => setSelectedImage("")}
        imageUrl={selectedImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    gap: 15,
  },
  profileImageAndStatsContainer: {
    flexDirection: "row",
    gap: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  statsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  profileStatCount: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    color: COLORS.text,
  },
  profileStatLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  profileName: {
    fontWeight: "bold",
    color: COLORS.text,
  },
  profileDescription: {
    color: COLORS.gray,
    fontSize: 13,
  },
});
