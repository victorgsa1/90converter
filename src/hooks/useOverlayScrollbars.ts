import { OverlayScrollbars } from "overlayscrollbars";
import { useEffect } from "react";

export function useOverlayScrollbars() {
  useEffect(() => {
    const initializedElements = new Set<HTMLElement>();

    const initScrollbars = () => {
      const scrollableElements = Array.from(
        document.querySelectorAll('[data-scrollable="page"]'),
      ) as HTMLElement[];

      scrollableElements.forEach((element) => {
        if (
          !initializedElements.has(element) &&
          !element.hasAttribute("data-overlayscrollbars-initialize")
        ) {
          try {
            OverlayScrollbars(element, {
              scrollbars: {
                theme: "os-theme-custom",
                autoHide: "never",
              },
            });
            initializedElements.add(element);
            element.setAttribute("data-overlayscrollbars-initialize", "true");
          } catch {
            // Ignore per-element initialization failures to avoid crashing the app.
          }
        }
      });
    };

    initScrollbars();

    return () => {
      initializedElements.forEach((element) => {
        try {
          const instance = OverlayScrollbars(element);
          instance?.destroy();
        } catch {
          // Ignore teardown issues during HMR/unmount.
        }
      });
      initializedElements.clear();
    };
  }, []);
}
