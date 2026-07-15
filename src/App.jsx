// Import core React library
import React from 'react';
// Import BrowserRouter for HTML5 history API navigation routing
import { BrowserRouter } from 'react-router-dom';
// Import ThemeProvider to manage application light/dark appearance context
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
// Import LeadProvider to manage client leads data state context
import { LeadProvider } from './context/LeadContext';
// Import the Layout component wrapping the sidebar and page headers
import Layout from './components/common/Layout';
// Import the AppRoutes component defining the core pages routes mapping
import AppRoutes from './routes';
// Import Toaster wrapper component to display popup toast notifications
import { Toaster } from 'react-hot-toast';

// Define the main App functional root entry component
function App() {
  // Return the main component layout wrap structure
  return (
    // Wrap with ThemeProvider to grant children access to light/dark themes
    <ThemeProvider>
      {/* Wrap with BrowserRouter to enable React Router DOM navigation and useNavigate in contexts */}
      <BrowserRouter>
        {/* Wrap with AuthProvider to grant children access to authentication context */}
        <AuthProvider>
          {/* Wrap with LeadProvider to grant children access to leads CRUD actions */}
          <LeadProvider>
            {/* Wrap routes inside the Layout component (includes sidebar layout) */}
            <Layout>
              {/* Render AppRoutes resolving paths to Dashboard, Leads, Analytics */}
              <AppRoutes />
            </Layout>
            {/* Include Toaster notification element for toast popups config */}
            <Toaster 
              // Position toast notifications in the top-right corner
              position="top-right"
              // Configure custom dark mode styling properties for popup boxes
              toastOptions={{
                // Apply rounded dark slate cards styling on dark mode
                className: 'dark:bg-gray-900 dark:text-white dark:border dark:border-gray-700',
                // Display notifications on the screen for 3 seconds (3000ms)
                duration: 3000,
              }}
            />
          </LeadProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

// Export the App component as default for main.jsx entry rendering
export default App;