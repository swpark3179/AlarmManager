import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Box, CircularProgress, Typography, Button } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import nordTheme from "./theme/nord";
import ListView from "./views/ListView";
import EditView from "./views/EditView";
import { useAlarms } from "./hooks/useAlarms";
import { Alarm } from "./types";

const App: React.FC = () => {
  const {
    alarms,
    loading,
    error,
    saveAlarms,
    deleteAlarm,
    toggleAlarm,
    reorderAlarms,
  } = useAlarms();
  const [currentView, setCurrentView] = useState<"list" | "edit">("list");
  const [editingAlarm, setEditingAlarm] = useState<Alarm | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!window.__TAURI_INTERNALS__) return;
      try {
        await invoke("init_fs");
        await invoke("set_window_position", { window: getCurrentWindow() });
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };
    init();
  }, []);

  const handleEdit = (alarm?: Alarm) => {
    setEditingAlarm(alarm);
    setCurrentView("edit");
  };

  const handleSave = async (alarm: Alarm, content: string) => {
    setIsSaving(true);
    try {
      // Register with Task Scheduler
      await invoke("register_task", { alarm });

      // Save content to markdown
      await invoke("write_alarm_content", { id: alarm.id, content });

      // Save alarm to json
      const index = alarms.findIndex((a) => a.id === alarm.id);
      let newAlarms;
      if (index !== -1) {
        newAlarms = [...alarms];
        newAlarms[index] = alarm;
      } else {
        newAlarms = [...alarms, alarm];
      }
      await saveAlarms(newAlarms);

      setCurrentView("list");
    } catch (err) {
      console.error("Save error:", err);
      alert(`Failed to save: ${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <ThemeProvider theme={nordTheme}>
        <CssBaseline />
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center" }} role="alert">
          <Typography variant="h5" color="error" gutterBottom>
            데이터를 불러오는 중 오류가 발생했습니다
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={nordTheme}>
      <CssBaseline />
      <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        {currentView === "list" ? (
          <ListView
            alarms={alarms}
            loading={loading}
            onEdit={handleEdit}
            onDelete={deleteAlarm}
            onToggle={toggleAlarm}
            onReorder={reorderAlarms}
          />
        ) : (
          <EditView
            alarm={editingAlarm}
            onSave={handleSave}
            onCancel={() => setCurrentView("list")}
          />
        )}

        {/* 저장 중 오버레이 */}
        {isSaving && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              bgcolor: "rgba(46, 52, 64, 0.65)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              zIndex: 9999,
            }}
            role="status"
            aria-live="polite"
          >
            <CircularProgress size={48} sx={{ color: "#88C0D0" }} aria-label="저장 중" />
            <Typography variant="h6" sx={{ color: "#ECEFF4", fontWeight: 500 }} aria-hidden="true">
              저장 중...
            </Typography>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default App;
