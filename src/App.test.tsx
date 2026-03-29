/**
 * @jest-environment happy-dom
 */
import { expect, test, describe, mock, beforeEach, afterEach, spyOn } from "bun:test";
import React from "react";
import App from "./App";
import { invoke } from "@tauri-apps/api/core";
import { render, waitFor } from "@testing-library/react";

// Setup emotion cache mock since happy-dom has issues with it sometimes
mock.module("@emotion/react", () => ({
  ...import.meta.require("@emotion/react"),
  CacheProvider: ({ children }: any) => <>{children}</>,
  ThemeProvider: ({ children }: any) => <>{children}</>,
  useTheme: () => ({}),
}));

mock.module("@mui/material", () => {
  const React = import.meta.require("react");
  return {
    ThemeProvider: ({ children }: any) => React.createElement(React.Fragment, null, children),
    CssBaseline: () => null,
    Box: ({ children }: any) => React.createElement("div", null, children),
    CircularProgress: () => null,
    Typography: ({ children }: any) => React.createElement("div", null, children),
  }
});

mock.module("./views/ListView", () => ({
  default: () => <div>ListView</div>
}));
mock.module("./views/EditView", () => ({
  default: () => <div>EditView</div>
}));

// Mock Tauri modules
mock.module("@tauri-apps/api/core", () => ({
  invoke: mock(),
}));

mock.module("@tauri-apps/api/window", () => ({
  getCurrentWindow: mock(() => ({})),
}));

// Mock hooks to isolate the test to just the init logic
mock.module("./hooks/useAlarms", () => ({
  useAlarms: () => ({
    alarms: [],
    loading: false,
    error: null,
    saveAlarms: mock(),
    deleteAlarm: mock(),
    toggleAlarm: mock(),
    reorderAlarms: mock(),
  }),
}));

describe("App Initialization", () => {
  let consoleErrorSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    // Enable Tauri internals to bypass the early return
    (window as any).__TAURI_INTERNALS__ = true;

    // Spy on console.error
    consoleErrorSpy = spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    delete (window as any).__TAURI_INTERNALS__;
    consoleErrorSpy.mockRestore();
    mock.restore();
  });

  test("handles initialization errors correctly", async () => {
    const errorMsg = "Tauri initialization failed";
    // Setup invoke to throw an error for 'init_fs'
    (invoke as import("bun:test").Mock<any>).mockRejectedValueOnce(new Error(errorMsg));

    render(<App />);

    // Wait for the async init function to execute and catch the error
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    // Check that it was called with the correct arguments
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Initialization error:",
      expect.any(Error)
    );

    const errArg = consoleErrorSpy.mock.calls[0][1];
    expect(errArg.message).toBe(errorMsg);
  });
});
