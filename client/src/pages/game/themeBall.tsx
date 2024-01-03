import React, { useState, useEffect } from "react";
import "./css/themeSelector.css";

type ThemeSelectorProps = {
  onChangeThemeBall: (theme: string) => void;
};

const BallSelector: React.FC<ThemeSelectorProps> = ({ onChangeThemeBall }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const availableColors = ["#FF1493", "#FFFF00", "#00FF00", "#00BFFF", "#FFA500"];
  const defaultColor = "white";

  useEffect(() => {
    if (!selectedColor) {
      setSelectedColor(defaultColor);
      onChangeThemeBall(defaultColor);
    } else {
      onChangeThemeBall(selectedColor);
    }
  }, [selectedColor, onChangeThemeBall, defaultColor]);

  return (
    <div className="theme-selector">
      <h1>You can choose the ball color</h1>
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

export default BallSelector;