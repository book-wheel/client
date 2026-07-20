import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
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
  matchesPublishedAtFilter,
  matchesVolumeFilter,
} from "@/components/search/utils";
import type { BookSearchItem } from "@/types/books";

export default function Search() {
  const { from: rawFrom, id: rawId } = useLocalSearchParams<{
    from?: string | string[];
    id?: string | string[];
  }>();
  const from = getSingleParam(rawFrom);
  const id = getSingleParam(rawId);
  const insets = useSafeAreaInsets();

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
  const [interestedBookIds, setInterestedBookIds] = useState(new Set<string>());

  const [books, setBooks] = useState<BookSearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredBooks = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return books.filter((book) => {
      const matchesQuery =
        keyword.length === 0 ||
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword) ||
        book.publisher.toLowerCase().includes(keyword);

      return matchesQuery;
    });
  }, [books, query]);

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

  const fetchBooks = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const res = await searchBooks(query, 1, 20);

      console.log(JSON.stringify(res.data, null, 2));

      setBooks(res.data.data.books);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSearch = () => {
    Keyboard.dismiss();
    fetchBooks();
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

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>결과 {filteredBooks.length}개</Text>
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
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.isbn}
        contentContainerStyle={[
          styles.listContent,
          filteredBooks.length === 0 && styles.emptyListContent,
        ]}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BookResultItem
            book={item}
            isInterested={interestedBookIds.has(item.isbn)}
            onPress={() => handleSelectBook(item.isbn)}
            onToggleInterest={() => handleToggleInterest(item.isbn)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="book-outline" size={40} color="#DCC9A5" />
            <Text style={styles.emptyTitle}>검색 결과가 없어요</Text>
            <Text style={styles.emptyText}>
              검색어 또는 필터를 조금 바꿔보세요.
            </Text>
          </View>
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
