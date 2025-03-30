/**
 * Font loader for Flavorly
 * Loads the fonts used in the application: 
 * - Playfair Display for headings/display text
 * - Nunito for body text
 */

// Ensure we load the fonts before rendering the app
const fontLoader = () => {
  // Create link element for Google Fonts
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap';
  
  // Append to document head
  document.head.appendChild(link);

  // Add Font Awesome for icons
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  
  // Append to document head
  document.head.appendChild(fontAwesome);

  // Add custom CSS variables for the fonts
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --font-display: 'Playfair Display', serif;
      --font-body: 'Nunito', sans-serif;
    }

    .font-display {
      font-family: var(--font-display);
    }

    .font-body {
      font-family: var(--font-body);
    }

    body {
      font-family: var(--font-body);
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-display);
    }

    /* Custom colors matching design */
    :root {
      --primary: 28 100% 50%; /* #FF7D00 */
      --primary-light: 33 100% 64%; /* #FFA94D */
      --primary-dark: 28 100% 44%; /* #E05E00 */
      --secondary: 122 40% 49%; /* #4CAF50 */
      --secondary-light: 122 36% 64%; /* #7BC67E */
      --secondary-dark: 122 40% 40%; /* #3B8C3F */
      --neutral-light: 33 42% 96%; /* #F9F5F0 */
      --neutral: 33 27% 88%; /* #E7E2D9 */
      --neutral-dark: 33 17% 37%; /* #685F52 */
      --text: 33 47% 13%; /* #2A2118 */
      --background: 33 100% 98%; /* #FFFAF5 */
    }
  `;
  
  // Append to document head
  document.head.appendChild(style);
};

// Execute the font loader
fontLoader();

export default fontLoader;
