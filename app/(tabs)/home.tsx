import Loader from "@/components/Loader";
import NoItems from "@/components/NoItems";
import Post from "@/components/Post";
import PulsateButton from "@/components/ui/PulsateButton";
import { COLORS } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { usePost } from "@/hooks/usePost";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { useInfiniteQuery } from "react-query";

export default function Home() {
  const { logout } = useAuth();
  const { getPosts } = usePost();
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { scrollToTop } = useLocalSearchParams();
  const isFocused = useIsFocused();
  const [isManuallyRefreshing, setIsManuallyRefreshing] = useState(false);

  useEffect(() => {
    if (scrollToTop === "true" && flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      router.setParams({ scrollToTop: undefined });
    }
  }, [isFocused, scrollToTop, router]);

  const {
    data,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery("posts", getPosts, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  const handleRefresh = async () => {
    setIsManuallyRefreshing(true);
    await refetch();
    setIsManuallyRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Snapsi</Text>
        <PulsateButton onPress={logout}>
          <Ionicons name="log-out-outline" style={styles.logoutIcon} />
        </PulsateButton>
      </View>

      <View style={styles.flex}>
        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={({ item }) => <Post post={item} />}
          keyExtractor={(item) => JSON.stringify(item.id)}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.postsContainer}
          ListEmptyComponent={
            isLoading ? (
              <Loader />
            ) : (
              <NoItems icon="image-outline" message="No posts available." />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={isManuallyRefreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              progressBackgroundColor={COLORS.background}
              tintColor={COLORS.primary}
            />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isFetchingNextPage ? <Loader /> : null}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    gap: 20,
    backgroundColor: COLORS.background,
  },
  postsContainer: {
    gap: 20,
    paddingBottom: 70,
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  logoutIcon: {
    color: COLORS.text,
    fontSize: 24,
  },
  flex: {
    flex: 1,
  },
});
