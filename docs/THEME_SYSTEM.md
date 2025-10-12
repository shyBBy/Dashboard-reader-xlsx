# 🎨 Theme System Documentation

## Kompletny system Dark/Light theme dla aplikacji

### 📁 Struktura plików:
```
src/
├── context/
│   └── ThemeContext.jsx          # Główny context theme
├── components/
│   ├── ThemeToggle/
│   │   └── ThemeToggle.jsx       # Przełącznik Dark/Light
│   └── ThemeShowcase/
│       └── ThemeShowcase.jsx     # Demo theme (opcjonalne)
├── hooks/
│   └── useAppTheme.js            # Utility hook
└── main.jsx                      # Integracja w app
```

## 🚀 Funkcjonalności:

### ✅ **Automatyczne wykrywanie:**
- Sprawdza system preference (`prefers-color-scheme`)
- Zapamiętuje wybór użytkownika w `localStorage`
- Reaguje na zmiany system theme

### ✅ **Glass Morphism Design:**
- Efekt szkła z `backdrop-filter: blur()`
- Przezroczyste tła z alpha kanałem
- Gradient borders i shadows

### ✅ **Kompletna paleta kolorów:**
- **Light mode**: Slate colors + vibrant accents
- **Dark mode**: Dostosowane kontrasty
- Primary: Indigo/Violet, Secondary: Cyan
- Success: Emerald, Warning: Amber, Error: Red, Info: Blue

### ✅ **MUI Components Override:**
- Papers, Cards, AppBar, Buttons, TextFields
- Tables, Tooltips i inne z glass effect
- Consistent styling w całej aplikacji

## 🎯 Użycie:

### **1. Basic usage w komponencie:**
```jsx
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    
    return (
        <div>
            <p>Aktualny tryb: {isDarkMode ? 'Dark' : 'Light'}</p>
            <button onClick={toggleTheme}>Przełącz theme</button>
        </div>
    );
};
```

### **2. Advanced usage z MUI theme:**
```jsx
import { useAppTheme } from '../hooks/useAppTheme';

const MyComponent = () => {
    const { palette, isDarkMode, getGlassStyle } = useAppTheme();
    
    return (
        <Box sx={{
            ...getGlassStyle(),
            color: palette.text.primary,
            p: 3
        }}>
            Glass morphism box
        </Box>
    );
};
```

### **3. ThemeToggle komponenty:**
```jsx
// Podstawowy przycisk
<ThemeToggle variant="icon" />

// Z labelką
<ThemeToggle variant="labeled" />

// Minimalistyczny
<ThemeToggle variant="minimal" />
```

## 🎨 Paleta kolorów:

### **Light Mode:**
- Background: `#f8fafc` (Slate-50)
- Paper: `#ffffff` 
- Text Primary: `#0f172a` (Slate-900)
- Primary: `#6366f1` (Indigo)
- Glass: `rgba(255, 255, 255, 0.85)`

### **Dark Mode:**
- Background: `#0f172a` (Slate-900)
- Paper: `#1e293b` (Slate-800)
- Text Primary: `#f8fafc` (Slate-50)
- Primary: `#8b5cf6` (Violet)
- Glass: `rgba(30, 41, 59, 0.85)`

## 🔧 Customization:

### **Dodawanie nowych kolorów:**
```jsx
// W ThemeContext.jsx
const lightPalette = {
    // ... existing colors
    custom: {
        main: '#your-color',
        light: '#lighter-shade',
        dark: '#darker-shade',
    }
};
```

### **Nowe glass effects:**
```jsx
// W useAppTheme.js
getCustomGlass: (opacity = 0.1) => ({
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
});
```

## 🌟 Features:

1. **🔄 Smooth transitions** - Animacje przy przełączaniu
2. **💾 Persistence** - Zapamiętywanie wyboru
3. **📱 Responsive** - Działa na mobile i desktop
4. **♿ Accessibility** - WCAG compliant contrasts
5. **⚡ Performance** - Optimized re-renders
6. **🎭 Glass morphism** - Modern design trends

## 🎯 Lokalizacja przełącznika:

Przełącznik theme znajduje się w **górnym pasku nawigacji** (AppBar) obok avatara użytkownika.

**Pozycja**: Prawa strona → ThemeToggle → Avatar

## 🚀 Gotowe do użycia!

System jest w pełni zintegrowany i gotowy. Możesz:
- ✅ Przełączać między Dark/Light mode
- ✅ Używać glass morphism effects  
- ✅ Customizować kolory i style
- ✅ Dodawać nowe komponenty z theme support