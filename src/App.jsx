import NutritionMeter from "./Components/NutritionMeter";
import useThemeMode from "./hooks/useThemeMode";

function App() {
  const { mode, toggle } = useThemeMode();

  return (
    // Top-aligned rather than centred: a centred card would drift down the
    // page as the food list grows.
    <div className="flex min-h-screen items-start justify-center bg-canvas px-4 py-6 sm:px-6 sm:py-12">
      <NutritionMeter mode={mode} onToggleTheme={toggle} />
    </div>
  );
}

export default App;
