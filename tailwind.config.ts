module.exports = {
    // ... other config
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "hsl(240, 80%, 60%)",
            foreground: "hsl(0, 0%, 100%)",
          },
          secondary: {
            DEFAULT: "hsl(280, 80%, 60%)",
            foreground: "hsl(0, 0%, 100%)",
          },
        },
        boxShadow: {
          card: "0 4px 20px -2px rgba(0, 0, 0, 0.1)",
          "card-dark": "0 4px 20px -2px rgba(0, 0, 0, 0.3)",
        },
      },
    },
  }