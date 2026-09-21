import ErrorNotice from "@/components/ErrorNotice";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderBackButton } from "@react-navigation/elements";
import { getApiErrorMessage, showApiError, logApiError } from "@/api/axios";
import {
  deletePost,
  getPostDetail,
  togglePostLike,
} from "@/api/posts";
import PostActionBar from "@/components/post/PostActionBar";
import PostAuthorSection from "@/components/post/PostAuthorSection";
import PostContentSection from "@/components/post/PostContentSection";
import PostImageSection from "@/components/post/PostImageSection";
import { ThemedView } from "@/components/themed-view";
import { getRelativeTime } from "@/components/utils/date";
import type { PostDetailData } from "@/types/posts";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const defaultProfileImage = require("@/assets/images/logo.png");

export default function PostDetailScreen() {
  const router = useRouter();
  const { isbn, postId: postIdParam } = useLocalSearchParams<{
    isbn: string;
    postId: string;
  }>();

  const [retryCount, setRetryCount] = useState(0);
  const [post, setPost] = useState<PostDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(`/book-detail/${isbn}/gallery`);
  };

  useEffect(() => {
    const postId = Number(postIdParam);

    setPost(null);
    setErrorMessage("");
    setIsLoading(true);

    if (!postId) {
      setErrorMessage("게시글 번호가 올바르지 않습니다.");
      setIsLoading(false);
      return;
    }

    let active = true;
    const loadPost = async () => {
      try {
        const response = await getPostDetail(postId);
        const result = response.data;

        if (!result.success || !result.data) {
          throw new Error(
            result.error?.message ?? "게시글을 불러오지 못했습니다.",
          );
        }

        if (active) setPost(result.data);
      } catch (error) {
        if (!active) return;
        logApiError("게시글 상세 조회 실패:", error);
        setErrorMessage(
          getApiErrorMessage(error, "게시글을 불러오지 못했습니다."),
        );
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadPost();
    return () => { active = false; };
  }, [postIdParam, retryCount]);

  const handleLikePress = async () => {
    if (!post || isLikeLoading) return;

    setIsLikeLoading(true);

    try {
      const response = await togglePostLike(post.postId);
      const result = response.data;

      if (!result.success) {
        throw new Error(
          result.error?.message ?? "좋아요 변경에 실패했습니다.",
        );
      }

      // API가 성공하면 화면의 하트와 숫자도 변경
      setPost((currentPost) => {
        if (!currentPost) return currentPost;

        const nextLiked = !currentPost.isLikedByMe;

        return {
          ...currentPost,
          isLikedByMe: nextLiked,
          likeCount: nextLiked
            ? currentPost.likeCount + 1
            : Math.max(0, currentPost.likeCount - 1),
        };
      });
    } catch (error) {
      logApiError("게시글 좋아요 변경 실패:", error);
      showApiError(error, "좋아요 변경에 실패했습니다.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post || isDeleting) return;

    setIsDeleting(true);

    try {
      const response = await deletePost(post.postId);
      const result = response.data;

      if (!result.success) {
        throw new Error(
          result.error?.message ?? "게시글 삭제에 실패했습니다.",
        );
      }

      handleGoBack();
    } catch (error) {
      logApiError("게시글 삭제 실패:", error);
      showApiError(error, "게시글 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: "게시글 상세",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              displayMode="minimal"
              accessibilityLabel="뒤로가기"
              onPress={handleGoBack}
            />
          ),
        }}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E4A54E" />
        </View>
      ) : !post ? (
        <View style={styles.center}>
          <ErrorNotice
            message={errorMessage}
            onRetry={Number(postIdParam) > 0 ? () => setRetryCount((count) => count + 1) : undefined}
          />
        </View>
      ) : (
        <ThemedView style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <PostAuthorSection
              author={post.author}
              createdAt={getRelativeTime(post.createdAt)}
              groupName={post.groupName}
              profileImage={
                post.profileImageUrl
                  ? { uri: post.profileImageUrl }
                  : defaultProfileImage
              }
              onDelete={post.isMine ? () => void handleDeletePost() : undefined}
              isDeleting={isDeleting}
            />

            <PostImageSection
              images={post.imageUrls.map((url) => ({ uri: url }))}
            />

            <PostActionBar
              isLiked={post.isLikedByMe}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              onLikePress={() => void handleLikePress()}
              onCommentPress={() =>
                router.push(
                  `/book-detail/${isbn}/${postIdParam}/comment`,
                )
              }
            />

            <PostContentSection
              title={post.title}
              content={post.content}
            />
          </ScrollView>
        </ThemedView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
