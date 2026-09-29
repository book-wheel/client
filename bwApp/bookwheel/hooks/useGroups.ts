import { getApiErrorMessage } from "@/api/axios";
import { useCallback, useEffect, useState } from "react";

import { Group } from "@/components/groups/MyGroupList";

import { getMyGroups } from "@/api/group";
import { mapMyGroups } from "@/utils/mapMyGroups";

export function useGroups() {
  const [open, setOpen] = useState(false);

  const [groups, setGroups] = useState<Group[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const response = await getMyGroups();

      console.log(JSON.stringify(response, null, 2));

      const mappedGroups = mapMyGroups(response);

      setGroups(mappedGroups);
    } catch (error) {
      setError(getApiErrorMessage(error, "모임을 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const activeGroups = groups.filter(
    (g) => g.status === "RECRUITING" || g.status === "IN_PROGRESS",
  );

  const otherGroups = groups.filter((g) => g.status === "COMPLETE");

  return {
    error,
    loading,
    reload,
    open,
    setOpen,
    activeGroups,
    otherGroups,
  };
}
