import PostsContainer from "@/components/PostsContainer";
import ProfileInformation from "@/components/ProfileInformation";
import PulsateButton from "@/components/ui/PulsateButton";
import { COLORS } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import type { IUserProfile } from "@/types/UserTypes";
import { usePost } from "@/hooks/usePost";
import { IPost } from "@/types/PostTypes";
import Loader from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
import { useUserMutations } from "@/hooks/useUserMutations";

export default function Profile() {
  const { getProfile } = useUser();
  const { handleFollow, handleUnfollow, isFollowing, isUnfollowing } =
    useUserMutations();
  const { username: usernameValue } = useLocalSearchParams();
  const { getUserPosts } = usePost();
  const router = useRouter();
  const queryClient = useQueryClient();

  const username =
    typeof usernameValue === "string"
      ? usernameValue
      : usernameValue?.[0] || "";

  useEffect(() => {
    const currentUser: IUserProfile | undefined =
      queryClient.getQueryData("myProfile");
    if (username === currentUser?.username) {
      router.replace("/(tabs)/profile");
    }
  }, [username, queryClient, router]);

  const { data: profileInfo, isLoading: isProfileLoading } = useQuery(
    ["user", username],
    getProfile,
    {
      enabled: !!username,
    }
  );
  const {
    data: postsData,
    isLoading: arePostsLoading,
    hasNextPage: postsHasNextPage,
    fetchNextPage: fetchPostsNextPage,
    isFetchingNextPage: arePostsFetchingNextPage,
    refetch: refetchPosts,
    isFetching: arePostsFetching,
  } = useInfiniteQuery(["posts", username], getUserPosts, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!username,
  });

  const posts: IPost[] = postsData?.pages?.flatMap((page) => page.posts) ?? [];

  const handleToggleFollow = () => {
    let mutationFn;

    mutationFn = profileInfo?.is_followed ? handleUnfollow : handleFollow;
    const _id = profileInfo?.id;
    const _username = profileInfo?.username;

    if (mutationFn && _id && _username) {
      mutationFn({ id: _id, username: _username });
    }
  };

  if (isProfileLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <PulsateButton
        onPress={() => router.back()}
        style={styles.arrowBackContainer}
        scaleOnPress={0.7}
      >
        <Ionicons name="arrow-back-outline" style={styles.icon} />
      </PulsateButton>
      <Text style={styles.title}>{profileInfo?.username}</Text>
      <ProfileInformation profileInfo={profileInfo} />
      <PulsateButton
        onPress={handleToggleFollow}
        disabled={isFollowing || isUnfollowing}
        style={[
          styles.button,
          profileInfo?.is_followed
            ? styles.unfollowButton
            : styles.followButton,
        ]}
      >
        <Text style={styles.buttonText}>
          {profileInfo?.is_followed ? "Unfollow" : "Follow"}
        </Text>
      </PulsateButton>

      <View style={styles.flex}>
        <PostsContainer
          data={posts}
          refetch={refetchPosts}
          fetchNextPage={fetchPostsNextPage}
          hasNextPage={postsHasNextPage}
          isLoading={arePostsLoading}
          isFetchingNextPage={arePostsFetchingNextPage}
          isFetching={arePostsFetching}
          noDataIcon="camera-outline"
          noDataMessage="No posts yet"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    backgroundColor: COLORS.background,
  },
  arrowBackContainer: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 1,
  },
  icon: {
    color: COLORS.text,
    fontSize: 30,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
  },
  flex: {
    flex: 1,
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  followButton: {
    backgroundColor: COLORS.primary,
  },
  unfollowButton: {
    backgroundColor: COLORS.buttonBackground,
  },
  buttonText: {
    color: COLORS.text,
    textAlign: "center",
  },
});
