import { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { common } from "@/styles/common";
import SearchInput from "@/components/Input/search";
import FilterBar from "@/components/Filter/FilterBar";
import OfflineRegionSheet from "@/components/Filter/OfflineRegionSheet";
import AdvancedFilterSheet from "@/components/Filter/AdvancedFilterSheet";
import GroupListExtended, {
  ExtendedGroup,
} from "@/components/groups/GroupListExtended";

export default function Explore() {
  //검색창
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchGroups = async (keyword: string) => {
    try {
      setIsLoading(true);
      console.log("검색어:", keyword);
      // TODO: API 호출
    } finally {
      setIsLoading(false);
    }
  };

  //필터링
  const groupFilters = [
    { key: "all", label: "전체" },
    { key: "online", label: "온라인" },
    { key: "offline", label: "오프라인", hasChildren: true },
    { key: "advanced", label: "그 외", hasChildren: true },
  ];

  const [filter, setFilter] = useState("all");
  const [offlineOpen, setOfflineOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedFilter, setAdvancedFilter] = useState<{
    months: number;
    maxMembers: number;
  }>({
    months: 3,
    maxMembers: 10,
  });

  //더미데이터
  const DUMMY_GROUPS: ExtendedGroup[] = [
    {
      id: "1",
      title: "독서모임1",
      description: "느긋하게 독서합니다",
      isOffline: false,
      region: undefined,
      isPrivate: true,
      status: "scheduled",
      total: 3,
      current: 3,
      maxPeople: 8,
      dday: 5,
      startDate: "26/4/25",
    },
    {
      id: "2",
      title: "독서모임",
      description: "한 달 한 권",
      isOffline: true,
      region: "서울",
      isPrivate: false,
      status: "scheduled",
      total: 1,
      current: 1,
      maxPeople: 6,
      dday: 12,
      startDate: "26/3/20",
    },
  ];

  const [selectedGroup, setSelectedGroup] = useState<ExtendedGroup | null>(
    null,
  );

  //그 외 상태관리
  const [open, setOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true); // 그룹 타입
  const [step, setStep] = useState<1 | 2>(1);

  const openJoin = (group: ExtendedGroup) => {
    setSelectedGroup(group);
    if (group.isPrivate) {
      // 비공개방 -> 비밀번호 단계
      setIsPrivate(true);
      setStep(1);
      setOpen(true);
    } else {
      // 공개방 -> 바로 가입 메시지 단계
      setIsPrivate(false);
      setStep(2);
      setOpen(true);
    }
  };
  const [joinedIds, setJoinedIds] = useState<string[]>([]);

  return (
    <>
      {/* 검색창 */}
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="모임 검색"
        onSubmit={() => fetchGroups(query)}
        loading={isLoading}
      />
      {/* 필터바 */}
      <FilterBar
        options={groupFilters}
        value={filter}
        onChange={setFilter}
        onOpenSubFilter={(key) => {
          if (key === "offline") setOfflineOpen(true);
          if (key === "advanced") setAdvancedOpen(true);
        }}
      />
      <OfflineRegionSheet
        visible={offlineOpen}
        onClose={() => setOfflineOpen(false)}
        onSelect={(region) => {
          console.log("선택한 지역:", region);
          setFilter("offline");
          setOfflineOpen(false);
        }}
      />

      <AdvancedFilterSheet
        visible={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
        onApply={(data) => {
          setAdvancedFilter(data);
          setFilter("advanced");
          setAdvancedOpen(false);
        }}
      />
      <View style={{ flex: 1, alignItems: "center", marginTop: 26 }}>
        <View style={{ width: "100%", paddingHorizontal: 16 }}>
          {DUMMY_GROUPS.map((g) => (
            <GroupListExtended
              key={g.id}
              group={g}
              onJoin={(group) => openJoin(group)}
              isPending={joinedIds.includes(g.id)}
            />
          ))}
        </View>

        {/* 가입 모달------------------------------------------------ */}
        <Modal visible={open} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setOpen(false)}>
            <View style={joinStyles.overlay}>
              <TouchableWithoutFeedback>
                <View style={joinStyles.sheet}>
                  {step === 1 && (
                    <>
                      <Text style={joinStyles.title}>
                        {selectedGroup?.title}
                      </Text>
                      <Text style={joinStyles.subtitle}>
                        비밀번호를 입력해주세요
                      </Text>

                      <TextInput
                        style={joinStyles.input}
                        secureTextEntry
                        placeholderTextColor="#CCC"
                      />

                      <View style={joinStyles.buttonRow}>
                        <TouchableOpacity
                          style={[joinStyles.btn, joinStyles.cancel]}
                          onPress={() => setOpen(false)}
                        >
                          <Text style={joinStyles.cancelText}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[joinStyles.btn, joinStyles.apply]}
                          onPress={() => setStep(2)}
                        >
                          <Text style={joinStyles.applyText}>확인</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <Text style={joinStyles.title}>
                        {selectedGroup?.title}
                      </Text>
                      <Text style={joinStyles.subtitle}>
                        가입메시지를 입력해주세요
                      </Text>

                      <TextInput
                        style={[joinStyles.input, joinStyles.textarea]}
                        placeholder="입력하시길 바랍니다"
                        placeholderTextColor="#CCC"
                        multiline
                        textAlignVertical="top"
                      />

                      <View style={joinStyles.buttonRow}>
                        <TouchableOpacity
                          style={[joinStyles.btn, joinStyles.cancel]}
                          onPress={() => setOpen(false)}
                        >
                          <Text style={joinStyles.cancelText}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[joinStyles.btn, joinStyles.apply]}
                          onPress={() => {
                            if (selectedGroup) {
                              setJoinedIds((prev) => [
                                ...prev,
                                selectedGroup.id,
                              ]);
                            }
                            setOpen(false);
                          }}
                        >
                          <Text style={joinStyles.applyText}>가입</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </>
  );
}

const joinStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0005",
    justifyContent: "center",
    alignItems: "center",
  },
  sheet: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  subtitle: {
    fontSize: 13,
    color: "#999",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FAFAFA",
  },
  textarea: {
    height: 110,
    paddingTop: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    width: "100%",
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#F0F0F0",
  },
  apply: {
    backgroundColor: "#E4A54E",
  },
  cancelText: {
    color: "#888",
    fontWeight: "600",
  },
  applyText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
