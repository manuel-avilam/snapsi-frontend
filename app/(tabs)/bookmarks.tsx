import PostsContainer from "@/components/PostsContainer";
import { COLORS } from "@/constants/theme";
import { usePost } from "@/hooks/usePost";
import { StyleSheet, Text, View } from "react-native";
import { useInfiniteQuery } from "react-query";

export default function Bookmarks() {
  const { getBookmarkedPosts } = usePost();
  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery(["posts", "bookmarks"], getBookmarkedPosts, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
  });

  const bookmarks = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookmarks</Text>
      </View>

      <View style={styles.flex}>
        <PostsContainer
          data={bookmarks}
          refetch={refetch}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          isFetching={isFetching}
          noDataIcon="bookmark-outline"
          noDataMessage="No bookmarked posts yet"
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
  flex: {
    flex: 1,
  },
});
