import React, { useState, useEffect } from "react";
import "./css/themeSelector.css";

type ThemeSelectorProps = {
  onChangeThemeBackground: (theme: string) => void;
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onChangeThemeBackground }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const availableColors = ["#808080", "#73879C", "#B5BD89", "#8B8E7B", "#4D463B"];
  const defaultColor = '#87CEEB';

  useEffect(() => {
    if (!selectedColor) {
      setSelectedColor(defaultColor);
      onChangeThemeBackground(defaultColor);
    } else {
      onChangeThemeBackground(selectedColor);
    }
  }, [selectedColor, onChangeThemeBackground, defaultColor]);

  return (
    <div className="theme-selector">
      <h1>You can choose the background theme</h1>
      <div className="color-options">
        {availableColors.map((color, index) => (
          <div
            key={index}
            className={`color-option ${selectedColor === color ? 'active' : ''}`}
            style={{ backgroundColor: color, border: selectedColor === color ? '2px solid #2C3E50' : '' }}
            onClick={() => setSelectedColor(color)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
