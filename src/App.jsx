import React, { useState } from 'react';
import { TopNav, Footer } from './components.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import CatalogScreen from './screens/CatalogScreen.jsx';
import ProductScreen from './screens/ProductScreen.jsx';
import ServicesScreen from './screens/ServicesScreen.jsx';
import ResourcesScreen from './screens/ResourcesScreen.jsx';
import ContactScreen from './screens/ContactScreen.jsx';
import AboutScreen from './screens/AboutScreen.jsx';

const labels = {
  home: '01 Home',
  catalog: '02 Catalog',
  product: '03 Product Detail',
  resources: '04 Resources',
  contact: '05 Contact',
  services: '06 Services',
  about: '07 About',
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const [payload, setPayload] = useState(null);

  const onNav = (s, p) => {
    setScreen(s);
    setPayload(p || null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div data-screen-label={labels[screen]} style={{ background: '#F9F9F9', minHeight: '100vh' }}>
      <TopNav active={screen} onNav={onNav} />
      <main key={screen + (payload || '')}>
        {screen === 'home'      && <HomeScreen      onNav={onNav} initialAnchor={payload} />}
        {screen === 'catalog'   && <CatalogScreen   onNav={onNav} initialFilter={payload} />}
        {screen === 'product'   && <ProductScreen   onNav={onNav} productId={payload || 'flue-guard'} />}
        {screen === 'services'  && <ServicesScreen  onNav={onNav} />}
        {screen === 'resources' && <ResourcesScreen onNav={onNav} />}
        {screen === 'contact'   && <ContactScreen   onNav={onNav} requestType={payload} />}
        {screen === 'about'     && <AboutScreen     onNav={onNav} />}
      </main>
      <Footer onNav={onNav} />
    </div>
  );
}
