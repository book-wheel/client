import { useEffect, useState } from "react";

import { Group } from "@/components/groups/MyGroupList";

import { getMyGroups } from "@/api/group";
import { mapMyGroups } from "@/utils/mapMyGroups";

export function useGroups() {
  const [open, setOpen] = useState(false);

  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        const response = await getMyGroups();

        console.log(JSON.stringify(response, null, 2));

        const mappedGroups = mapMyGroups(response);

        setGroups(mappedGroups);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyGroups();
  }, []);

  const activeGroups = groups.filter(
    (g) => g.status === "RECRUITING" || g.status === "IN_PROGRESS",
  );

  const otherGroups = groups.filter((g) => g.status === "COMPLETE");

  return {
    open,
    setOpen,
    activeGroups,
    otherGroups,
  };
}
