import { getApiErrorMessage } from "@/api/axios";
import { getBookDetail } from "@/api/books";
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
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const defaultProfileImage = require("@/assets/images/logo.png");

export default function PostDetailScreen() {
  const router = useRouter();
  const { isbn, postId: postIdParam } = useLocalSearchParams<{
    isbn: string;
    postId: string;
  }>();

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

    const loadPost = async () => {
      try {
        const response = await getPostDetail(postId);
        const result = response.data;

        if (!result.success || !result.data) {
          throw new Error(
            result.error?.message ?? "게시글을 불러오지 못했습니다.",
          );
        }

        let postData = result.data;

        if (!postData.title?.trim()) {
          try {
            const bookResponse = await getBookDetail(postData.isbn);
            const bookResult = bookResponse.data;

            if (bookResult.success && bookResult.data) {
              postData = {
                ...postData,
                title: bookResult.data.title,
              };
            }
          } catch (bookError) {
            console.warn("게시글 도서 제목 조회 실패:", bookError);
          }
        }

        setPost(postData);
      } catch (error) {
        console.error("게시글 상세 조회 실패:", error);
        setErrorMessage(
          getApiErrorMessage(error, "게시글을 불러오지 못했습니다."),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadPost();
  }, [postIdParam]);

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
      console.error("게시글 좋아요 변경 실패:", error);
      Alert.alert(
        "알림",
        getApiErrorMessage(error, "좋아요 변경에 실패했습니다."),
      );
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
      console.error("게시글 삭제 실패:", error);
      Alert.alert(
        "알림",
        getApiErrorMessage(error, "게시글 삭제에 실패했습니다."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="뒤로가기"
          accessibilityRole="button"
          activeOpacity={0.7}
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={30} color="#513A11" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시글 상세</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E4A54E" />
        </View>
      ) : !post ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{errorMessage}</Text>
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
              title={post.title ?? "도서"}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    marginLeft: 6,
    color: "#513A11",
    fontSize: 27,
    fontWeight: "900",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    color: "#777777",
    textAlign: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
