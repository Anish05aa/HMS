// import { createContext, useContext, useEffect, useState } from 'react';

// export const ThemeContext = createContext(null);

// export const ThemeProvider = ({ children }) => {
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     const storedTheme = localStorage.getItem('theme');
//     if (
//       storedTheme === 'dark' ||
//       (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
//     ) {
//       setDarkMode(true);
//     }
//   }, []);

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   }, [darkMode]);

//   const toggleTheme = () => setDarkMode(!darkMode);

//   return (
//     <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);
