import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { Bookings } from '@/components/user/bookings/bookingtable';

type TrackingContextType = {
  inTransitItems: Bookings[];
};

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

type TrackingProviderProps = {
  children: ReactNode;
};

export const TrackingProvider = ({ children }: TrackingProviderProps) => {
  const [logisticItems, setLogisticItems] = useState<Bookings[]>([]);
  const [inTransitItems, setInTransitItems] = useState<Bookings[]>([]);

  const fetchTrackingItems = async () => {
    const response = await fetch('/api/user/logisticItems');
    const data = await response.json();
    setLogisticItems(data);
  };

  const filterInTransitItems = () => {
    const filteredItems = logisticItems.filter((item: Bookings) => item.status === 'pending');
    setInTransitItems(filteredItems);
  };

  useEffect(() => {
    fetchTrackingItems();
  }, []);

  useEffect(() => {
    filterInTransitItems();
  }, [logisticItems]);

  return <TrackingContext.Provider value={{ inTransitItems }}>{children}</TrackingContext.Provider>;
};

export const useTrackingContext = () => {
  const context = React.useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTrackingContext must be used within a TrackingProvider');
  }
  return context;
};
