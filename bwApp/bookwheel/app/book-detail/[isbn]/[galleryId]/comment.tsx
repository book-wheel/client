import { getApiErrorMessage } from "@/api/axios";
import {
  createPostComment,
  getPostComments,
  type PostCommentData,
} from "@/api/posts";
import CommentInputBar from "@/components/comment/CommentInputBar";
import CommentList, {
  type CommentItem,
} from "@/components/comment/CommentList";
import CommentSheetHeader from "@/components/comment/CommentSheetHeader";
import { ThemedView } from "@/components/themed-view";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import type { CursorParams } from "@/types/api";
import BottomSheet from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const defaultProfileImage = require("@/assets/images/logo.png");

export default function CommentSheetScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { galleryId } = useLocalSearchParams<{ galleryId: string }>();
  const postId = Number(galleryId);

  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const snapPoints = useMemo(() => ["40%", "70%", "90%"], []);

  // 서버에서 댓글 한 페이지 가져옴
  const fetchCommentPage = useCallback(
    async (params: CursorParams) => {
      if (!postId) return null;

      const response = await getPostComments(postId, params);
      const result = response.data;

      if (!result.success || !result.data) {
        throw new Error(
          result.error?.message ?? "댓글을 불러오지 못했습니다.",
        );
      }

      return result.data;
    },
    [postId],
  );

  // 첫 댓글 목록과 스크롤할 때 필요한 다음 목록 관리
  const {
    items,
    totalElements,
    isLoading,
    error,
    loadInitial,
    loadMore,
    refresh,
    reset,
  } = useCursorPagination<PostCommentData>({
    fetchPage: fetchCommentPage,
    pageSize: 20,
  });

  // 댓글창이 처음 열리면 첫 번째 댓글 목록을 불러옴
  useEffect(() => {
    reset();

    if (postId) {
      void loadInitial();
    } else {
      console.error("댓글 조회 실패: 게시글 번호가 올바르지 않습니다.");
    }
  }, [loadInitial, postId, reset]);

  useEffect(() => {
    if (!error) return;

    console.error(
      "댓글 조회 실패:",
      getApiErrorMessage(error, "댓글을 불러오지 못했습니다."),
    );
  }, [error]);

  // 서버 댓글 데이터를 댓글 컴포넌트가 사용하는 모양으로 변경
  const comments = useMemo<CommentItem[]>(
    () =>
      items.map((comment) => ({
        id: String(comment.commentId),
        author: comment.author,
        content: comment.content,
        profileImage: comment.profileImageUrl
          ? { uri: comment.profileImageUrl }
          : defaultProfileImage,
        isMine: comment.isMine,
        createdAt: comment.createdAt,
      })),
    [items],
  );

  // 댓글창을 아래로 끝까지 내리면 댓글장 총료
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) router.back();
    },
    [router],
  );

  // 입력한 내용을 서버에 저장
  const handleSubmitComment = async () => {
    const content = inputText.trim();

    if (!content || !postId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await createPostComment(postId, content);
      const result = response.data;

      if (!result.success) {
        throw new Error(
          result.error?.message ?? "댓글 작성에 실패했습니다.",
        );
      }

      setInputText("");

      // 댓글 목록 다시 로딩
      await refresh();
    } catch (submitError) {
      const message = getApiErrorMessage(
        submitError,
        "댓글 작성에 실패했습니다.",
      );

      console.error("댓글 작성 실패:", message);
      Alert.alert("알림", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.backgroundContainer}>
          <BottomSheet
            ref={bottomSheetRef}
            index={2}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            enablePanDownToClose
            onChange={handleSheetChanges}
            handleIndicatorStyle={styles.dragHandle}
            backgroundStyle={styles.bottomSheetBackground}
          >
            <ThemedView style={styles.sheetContainer}>
              <CommentSheetHeader count={totalElements} />
              <CommentList
                comments={comments}
                isLoading={isLoading}
                onEndReached={() => void loadMore()}
                errorMessage={
                  error
                    ? getApiErrorMessage(error, "댓글을 불러오지 못했습니다.")
                    : undefined
                }
              />
            </ThemedView>
          </BottomSheet>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.fixedBottomInput}
        >
          <CommentInputBar
            value={inputText}
            onChangeText={setInputText}
            onSubmit={() => void handleSubmitComment()}
            isSubmitting={isSubmitting}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    backgroundContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.08)',
    },
    bottomSheetBackground: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    sheetContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
    },
    fixedBottomInput: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
    },
});
