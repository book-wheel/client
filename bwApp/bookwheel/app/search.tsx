import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BookResultItem from "@/components/search/BookResultItem";
import DateRangeModal from "@/components/search/DateRangeModal";
import FilterSelectModal from "@/components/search/FilterSelectModal";
import PageRangeModal from "@/components/search/PageRangeModal";
import {
  categoryOptions,
  filterKeys,
  filterLabels,
} from "@/components/search/constants";
import { searchBooks } from "@/api/books";
import { searchStyles as styles } from "@/components/search/styles";
import type {
  DateRange,
  FilterKey,
  PageRange,
} from "@/components/search/types";
import {
  createDefaultDateRange,
  createEmptyPageRange,
  getFilterChipLabel,
  getSingleParam,
  hasDateRange,
  hasPageRange,
} from "@/components/search/utils";
import type { BookSearchItem } from "@/types/books";

const SEARCH_PAGE_SIZE = 20;
const SEARCH_FILTER_ENABLED = false;

export default function Search() {
  const { from: rawFrom, id: rawId } = useLocalSearchParams<{
    from?: string | string[];
    id?: string | string[];
  }>();
  const from = getSingleParam(rawFrom);
  const id = getSingleParam(rawId);
  const insets = useSafeAreaInsets();
  const searchRequestId = useRef(0);
  const loadingMoreRef = useRef(false);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [publishedAtRange, setPublishedAtRange] = useState<DateRange>(() =>
    createDefaultDateRange(),
  );
  const [pageRange, setPageRange] = useState<PageRange>(() =>
    createEmptyPageRange(),
  );
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);
  const [excludeInterested, setExcludeInterested] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [interestedBookIds, setInterestedBookIds] = useState(new Set<string>());
  const [books, setBooks] = useState<BookSearchItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isEnd, setIsEnd] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/books");
  };

  const handleSelectBook = (bookId: string) => {
    if (from === "add" && id) {
      router.push({
        pathname: "/group/[id]/add-book",
        params: { id, bookId },
      });
      return;
    }

    router.push({
      pathname: "/book-detail/[bookId]/info",
      params: { bookId },
    });
  };

  const handleSelectCategory = (value: string) => {
    setCategoryFilter(value);
    setActiveFilter(null);
  };

  const handleToggleInterest = (isbn: string) => {
    setInterestedBookIds((prev) => {
      const next = new Set(prev);

      if (next.has(isbn)) next.delete(isbn);
      else next.add(isbn);

      return next;
    });
  };

  const handleSubmitSearch = async () => {
    Keyboard.dismiss();

    const keyword = query.trim();
    const requestId = ++searchRequestId.current;

    loadingMoreRef.current = false;
    setLoadingMore(false);

    if (!keyword) {
      setLoading(false);
      setSubmittedQuery("");
      setBooks([]);
      setPage(1);
      setTotalCount(0);
      setIsEnd(true);
      return;
    }

    setLoading(true);
    setSubmittedQuery(keyword);
    setBooks([]);
    setTotalCount(0);
    setPage(1);
    setIsEnd(true);

    try {
      const res = await searchBooks(keyword, 1, SEARCH_PAGE_SIZE);
      const data = res.data.data;

      if (requestId !== searchRequestId.current) return;

      setBooks(data?.books ?? []);
      setTotalCount(data?.totalCount ?? 0);
      setIsEnd(data?.isEnd ?? true);
    } catch (e) {
      console.log(e);
    } finally {
      if (requestId === searchRequestId.current) setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (
      loading ||
      loadingMoreRef.current ||
      isEnd ||
      !submittedQuery
    ) {
      return;
    }

    const requestId = searchRequestId.current;
    const nextPage = page + 1;

    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const res = await searchBooks(
        submittedQuery,
        nextPage,
        SEARCH_PAGE_SIZE,
      );
      const data = res.data.data;

      if (requestId !== searchRequestId.current || !data) return;

      setBooks((previousBooks) => {
        const existingIsbns = new Set(
          previousBooks.map((book) => book.isbn),
        );
        const nextBooks = data.books.filter(
          (book) => !existingIsbns.has(book.isbn),
        );

        return [...previousBooks, ...nextBooks];
      });
      setPage(nextPage);
      setTotalCount(data.totalCount);
      setIsEnd(data.isEnd);
    } catch (e) {
      console.log(e);
    } finally {
      if (requestId === searchRequestId.current) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity
          accessibilityLabel="뒤로가기"
          accessibilityRole="button"
          activeOpacity={0.7}
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={30} color="#513A11" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>도서 검색</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="제목, 저자, 출판사 등"
          placeholderTextColor="#A68D63"
          returnKeyType="search"
          onSubmitEditing={handleSubmitSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity
          accessibilityLabel="검색"
          accessibilityRole="button"
          activeOpacity={0.75}
          onPress={handleSubmitSearch}
          style={styles.searchButton}
        >
          <Ionicons name="search-outline" size={24} color="#A68D63" />
        </TouchableOpacity>
      </View>

      {SEARCH_FILTER_ENABLED && (
      <View style={styles.filterRow}>
        {filterKeys.map((key) => {
          const active =
            (key === "category" && categoryFilter !== "all") ||
            (key === "publishedAt" && hasDateRange(publishedAtRange)) ||
            (key === "volume" && hasPageRange(pageRange));

          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.75}
              onPress={() => setActiveFilter(key)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text
                numberOfLines={1}
                style={[styles.filterText, active && styles.filterTextActive]}
              >
                {getFilterChipLabel(
                  key,
                  categoryFilter,
                  publishedAtRange,
                  pageRange,
                )}
              </Text>
              <Ionicons
                name="chevron-down"
                size={14}
                color={active ? "#513A11" : "#A68D63"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      )}

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>결과 {totalCount}개</Text>
        {SEARCH_FILTER_ENABLED && (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setExcludeInterested((prev) => !prev)}
          style={styles.excludeButton}
        >
          <Ionicons
            name={excludeInterested ? "checkbox" : "square-outline"}
            size={25}
            color={excludeInterested ? "#E4A54E" : "#D7D7D7"}
          />
          <Text
            style={[
              styles.excludeText,
              excludeInterested && styles.excludeTextActive,
            ]}
          >
            관심도서 제외
          </Text>
        </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.isbn}
        contentContainerStyle={[
          styles.listContent,
          books.length === 0 && styles.emptyListContent,
        ]}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BookResultItem
            book={item}
            isInterested={interestedBookIds.has(item.isbn)}
            onPress={() => handleSelectBook(item.isbn)}
            onToggleInterest={() => handleToggleInterest(item.isbn)}
          />
        )}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator color="#E4A54E" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyBox}>
              <ActivityIndicator size="large" color="#E4A54E" />
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Ionicons name="book-outline" size={40} color="#DCC9A5" />
              <Text style={styles.emptyTitle}>검색 결과가 없어요</Text>
              <Text style={styles.emptyText}>검색어를 입력해 주세요.</Text>
            </View>
          )
        }
      />

      <FilterSelectModal
        visible={activeFilter === "category"}
        title={filterLabels.category}
        options={categoryOptions}
        selectedValue={categoryFilter}
        onSelect={handleSelectCategory}
        onClose={() => setActiveFilter(null)}
      />

      <DateRangeModal
        visible={activeFilter === "publishedAt"}
        value={publishedAtRange}
        onApply={(range) => {
          setPublishedAtRange(range);
          setActiveFilter(null);
        }}
        onReset={() => {
          setPublishedAtRange(createDefaultDateRange());
          setActiveFilter(null);
        }}
        onClose={() => setActiveFilter(null)}
      />

      <PageRangeModal
        visible={activeFilter === "volume"}
        value={pageRange}
        onApply={(range) => {
          setPageRange(range);
          setActiveFilter(null);
        }}
        onReset={() => {
          setPageRange(createEmptyPageRange());
          setActiveFilter(null);
        }}
        onClose={() => setActiveFilter(null)}
      />
    </View>
  );
}
