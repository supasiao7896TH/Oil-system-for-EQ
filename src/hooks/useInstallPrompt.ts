import { useCallback, useEffect, useState } from "react";

const DISMISSED_KEY = "oilmate-install-dismissed";

export type InstallPlatform = "android" | "ios" | null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !("MSStream" in window);
}

function isDismissed(): boolean {
  return localStorage.getItem(DISMISSED_KEY) === "1";
}

export interface UseInstallPromptResult {
  platform: InstallPlatform;
  promptInstall: () => void;
  dismiss: () => void;
}

/** Surfaces an installable-app hint for platforms that don't already nag the user
 * themselves: Android/desktop Chrome fire `beforeinstallprompt`, which we capture so
 * our own banner button can trigger it later; iOS Safari never fires that event at
 * all, so we fall back to feature-detecting iOS and showing manual instructions. */
export function useInstallPrompt(): UseInstallPromptResult {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(isDismissed);

  useEffect(() => {
    if (isStandalone()) return;

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  const promptInstall = useCallback(() => {
    deferredEvent?.prompt();
  }, [deferredEvent]);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }, []);

  let platform: InstallPlatform = null;
  if (!dismissed && !isStandalone()) {
    if (deferredEvent) platform = "android";
    else if (isIos()) platform = "ios";
  }

  return { platform, promptInstall, dismiss };
}
