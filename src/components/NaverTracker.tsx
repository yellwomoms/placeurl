import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    wcs: any;
    wcs_add: any;
    _nasa: any;
    wcs_do: any;
  }
}

export default function NaverTracker() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/admin') return;

    const runWcs = () => {
      if (window.wcs) {
        if (!window.wcs_add) window.wcs_add = {};
        window.wcs_add["wa"] = "s_21d013e25f46";
        if (!window._nasa) window._nasa = {};
        window.wcs.inflow();
        if (typeof window.wcs_do === 'function') {
          window.wcs_do();
        }
      }
    };

    if (!document.getElementById('naver-wcs')) {
      const script = document.createElement('script');
      script.id = 'naver-wcs';
      script.src = '//wcs.naver.net/wcslog.js';
      script.async = true;
      script.onload = runWcs;
      document.body.appendChild(script);
    } else {
      runWcs();
    }
  }, [location]);

  return null;
}
