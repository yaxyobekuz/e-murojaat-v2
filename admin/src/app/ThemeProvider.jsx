// next-themes wrapper — toggles `.dark` on <html> (Tailwind darkMode:["class"])
import { ThemeProvider as NextThemes } from "next-themes";

const ThemeProvider = ({ children }) => (
  <NextThemes
    attribute="class"
    defaultTheme="dark"
    enableSystem={false}
    disableTransitionOnChange
  >
    {children}
  </NextThemes>
);

export default ThemeProvider;
