"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CssBaseline } from "@mui/material";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  type PaletteMode,
} from "@mui/material/styles";

export type ThemeMode = "dark" | "light" | "system";

type ThemeModeContextValue = {
  themeMode: ThemeMode;
  resolvedMode: PaletteMode;
  setThemeMode: (mode: ThemeMode) => void;
};

const THEME_STORAGE_KEY = "cordis-theme-mode";
const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "dark" || value === "light" || value === "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [systemMode, setSystemMode] = useState<PaletteMode>("dark");

  useEffect(() => {
    const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeMode(storedMode)) {
      setThemeMode(storedMode);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemMode = () => setSystemMode(mediaQuery.matches ? "dark" : "light");

    updateSystemMode();
    mediaQuery.addEventListener("change", updateSystemMode);

    return () => mediaQuery.removeEventListener("change", updateSystemMode);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const resolvedMode: PaletteMode = themeMode === "system" ? systemMode : themeMode;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedMode,
          primary: { main: "#5865F2" },
          secondary: { main: "#3BA55D" },
          background:
            resolvedMode === "dark"
              ? { default: "#1e1f22", paper: "#2b2d31" }
              : { default: "#f4f6fb", paper: "#ffffff" },
          text:
            resolvedMode === "dark"
              ? { primary: "#f2f3f5", secondary: "#b5bac1" }
              : { primary: "#1f2328", secondary: "#59636e" },
        },
        shape: {
          borderRadius: 14,
        },
        typography: {
          fontFamily: 'var(--font-geist-sans), "Segoe UI", sans-serif',
          h4: { fontWeight: 800, letterSpacing: "-0.02em" },
          h5: { fontWeight: 700, letterSpacing: "-0.01em" },
          body1: { lineHeight: 1.6 },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor:
                  resolvedMode === "dark" ? "#4f545c #1e1f22" : "#c5cbd3 #f4f6fb",
              },
              "*::-webkit-scrollbar": {
                width: "9px",
                height: "9px",
              },
              "*::-webkit-scrollbar-thumb": {
                borderRadius: "8px",
                backgroundColor:
                  resolvedMode === "dark"
                    ? "rgba(181, 186, 193, 0.45)"
                    : "rgba(89, 99, 110, 0.35)",
              },
              "*::-webkit-scrollbar-track": {
                backgroundColor:
                  resolvedMode === "dark" ? "rgba(30, 31, 34, 0.8)" : "rgba(244, 246, 251, 0.9)",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiButton: {
            defaultProps: {
              disableElevation: true,
            },
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 10,
              },
            },
          },
        },
      }),
    [resolvedMode]
  );

  const value = useMemo(
    () => ({
      themeMode,
      resolvedMode,
      setThemeMode,
    }),
    [themeMode, resolvedMode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useAppThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useAppThemeMode must be used within ThemeProvider.");
  }
  return context;
}
