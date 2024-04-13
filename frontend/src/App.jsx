import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Router from './routes';
import ThemeProvider from './theme';
import ScrollToTop from './components/scroll-to-top';
import { ToasterProvider } from './utils/toaster/toasterContext';
import { RightSidebarProvider } from './layouts/right-side-bar/rightSidebarProvider';

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ToasterProvider>
            <RightSidebarProvider>
              <ScrollToTop />
              <Router />
            </RightSidebarProvider>
          </ToasterProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};
export default App;
