"use client";

import { useEffect } from "react";

/**
 * Cal.com booking integration (element-click embed).
 * Loads Cal's embed.js once and initialises the "15min" event namespace.
 * <CalButton> renders a trigger that opens the booking popup on click —
 * Cal's script delegates off the data-cal-* attributes.
 *
 * NOTE: the live event lives at cal.com/auvance/15min. Update the slug here
 * if the founder renames the event type.
 */
const CAL_LINK = "auvance/15min";
const CAL_NS = "15min";

declare global {
  interface Window {
    Cal?: ((...args: unknown[]) => void) & {
      ns?: Record<string, (...args: unknown[]) => void>;
      loaded?: boolean;
      q?: unknown[];
    };
  }
}

let initialised = false;

function initCal() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  /* eslint-disable */
  (function (C: any, A: any, L: any) {
    let p = function (a: any, ar: any) {
      a.q.push(ar);
    };
    let d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () {
            p(api, arguments);
          };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
  })(window, "https://app.cal.com/embed/embed.js", "init");
  /* eslint-enable */
  window.Cal!("init", CAL_NS, { origin: "https://app.cal.com" });
  window.Cal!.ns![CAL_NS]("ui", { hideEventTypeDetails: false, layout: "month_view" });
}

export function CalButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    initCal();
  }, []);

  return (
    <button
      type="button"
      className={className}
      data-hover
      data-cal-link={CAL_LINK}
      data-cal-namespace={CAL_NS}
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
    >
      {children}
    </button>
  );
}
