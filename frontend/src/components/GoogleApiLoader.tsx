import { useRef } from 'react';
import { useSetting } from './SettingContext';
import { useEffect } from "react";

const GoogleApiLoader = () => {
  const { GOOGLE_API_KEY } = useSetting() as SettingsType;
  const isMounted = useRef<boolean>(false);
  function initMap() {
    //required callback for google maps
  }
  useEffect(() => {

    if (!isMounted) {
      // Load the Google Maps API
      const script = document.createElement('script');
      if (!GOOGLE_API_KEY) {
        throw Error('GOOGLE_API_KEY required');
      }

      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&callback=initMap`;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);
      (window as any).initMap = initMap;
      console.log('api loaded');
      (isMounted as any).current = true;
      // Clean up the script tag when the component is unmounted
      return () => {
        console.log('remove googleapis');
        document.head.removeChild(script);
        delete (window as any).initMap;
      };
    }
  }, []);

  return (<></>);
};
export default GoogleApiLoader;
