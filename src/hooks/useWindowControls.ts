import { getCurrentWindow } from "@tauri-apps/api/window";

export function useWindowControls() {
  const handleWindowMinimize = async () => {
    await getCurrentWindow().minimize();
  };

  const handleWindowToggleMaximize = async () => {
    await getCurrentWindow().toggleMaximize();
  };

  const handleWindowClose = async () => {
    await getCurrentWindow().close();
  };

  return {
    handleWindowMinimize,
    handleWindowToggleMaximize,
    handleWindowClose,
  };
}
