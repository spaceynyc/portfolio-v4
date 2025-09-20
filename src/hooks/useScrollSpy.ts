import { useEffect, useMemo, useState } from "react";

const DEFAULT_ROOT_MARGIN = "-48% 0px -42% 0px";

export function useScrollSpy(ids: string[], rootMargin: string = DEFAULT_ROOT_MARGIN) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  const idList = useMemo(() => ids.filter(Boolean), [ids]);

  useEffect(() => {
    if (typeof window === "undefined" || idList.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const nextId = visible[0].target.id;
          setActiveId(nextId);
          return;
        }

        const nearest = entries.reduce<IntersectionObserverEntry | null>((closest, entry) => {
          if (!closest) return entry;
          return entry.boundingClientRect.top < closest.boundingClientRect.top ? entry : closest;
        }, null);

        if (nearest?.target?.id) {
          setActiveId(nearest.target.id);
        }
      },
      {
        rootMargin,
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }
    );

    const elements = idList
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [idList, rootMargin]);

  return activeId;
}
