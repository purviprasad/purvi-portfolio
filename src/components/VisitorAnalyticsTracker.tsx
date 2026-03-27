import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { recordVisit } from "../utils/visitorAnalytics";

const VisitorAnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    void recordVisit(`${location.pathname}${location.search}${location.hash}`);
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default VisitorAnalyticsTracker;
