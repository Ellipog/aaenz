"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { pins } from "@/static/pins";
import { useDeviceType } from "@/hooks/useDeviceType";

interface SiteInfo {
  url: string;
  title?: string;
  isLoading?: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// Separate SiteCard component to properly use hooks
const SiteCard = ({
  site,
  isPinned,
  onLoad,
  onError,
  loadedIframes,
  fetchSiteTitle,
  siteInfos,
}: {
  site: { url: string };
  isPinned: boolean;
  onLoad: (subdomain: string) => void;
  onError: (subdomain: string) => void;
  loadedIframes: Record<string, boolean>;
  fetchSiteTitle: (url: string) => Promise<void>;
  siteInfos: Record<string, SiteInfo>;
}) => {
  const subdomain = new URL(site.url).hostname;
  const siteInfo = siteInfos[site.url];
  const isMobile = useDeviceType();
  const scale = isMobile ? 100 / 420 : 100 / 280;

  useEffect(() => {
    if (!siteInfo) {
      fetchSiteTitle(site.url);
    }
  }, [site.url, siteInfo, fetchSiteTitle]);

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl dark:bg-gray-800/90 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 relative max-w-2xl mx-auto w-full backdrop-blur-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="relative" style={{ paddingTop: "56.25%" }}>
        <motion.a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 overflow-hidden group"
          whileHover={{ scale: 1.01 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src={site.url}
              className="w-full h-full bg-white"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "0 0",
                width: `${(isMobile ? 420 : 280) + 1}%`,
                height: `${(isMobile ? 420 : 280) + 1}%`,
                border: "none",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              sandbox="allow-same-origin allow-scripts"
              allow="autoplay 'none'; microphone 'none'; camera 'none'"
              loading="lazy"
              onLoad={() => onLoad(subdomain)}
              onError={() => onError(subdomain)}
            />
          </div>
          {loadedIframes[subdomain] === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900/95">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Site not available
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {isPinned && (
            <div className="absolute top-3 right-2.5 z-30">
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-xl">
                Pinned
              </span>
            </div>
          )}
          <motion.div
            className="absolute left-2 bottom-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="bg-white/95 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-start">
              <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white">
                {siteInfo?.isLoading ? (
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse w-24" />
                ) : (
                  siteInfo?.title || subdomain
                )}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center">
                {subdomain}
              </p>
            </div>
          </motion.div>
        </motion.a>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [subdomains, setSubdomains] = useState<string[]>([]);
  const [siteInfos, setSiteInfos] = useState<Record<string, SiteInfo>>({});
  const [loading, setLoading] = useState(true);
  const [loadedIframes, setLoadedIframes] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    async function fetchSubdomains() {
      try {
        const response = await fetch("/api/subdomains");
        const data = await response.json();

        if (data.subdomains) {
          setSubdomains(
            data.subdomains.filter(
              (subdomain: string) => !subdomain.startsWith("www.")
            )
          );
        } else {
          setSubdomains([]);
          console.error("No subdomains data received:", data);
        }
      } catch (error) {
        console.error("Error:", error);
        setSubdomains([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSubdomains();
  }, []);

  const handleIframeLoad = (subdomain: string) => {
    setLoadedIframes((prev) => ({ ...prev, [subdomain]: true }));
  };

  const handleIframeError = (subdomain: string) => {
    setLoadedIframes((prev) => ({ ...prev, [subdomain]: false }));
  };

  const fetchSiteTitle = async (url: string) => {
    try {
      setSiteInfos((prev) => ({
        ...prev,
        [url]: { ...prev[url], isLoading: true },
      }));

      const response = await fetch(
        `/api/get-title?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      setSiteInfos((prev) => ({
        ...prev,
        [url]: {
          url,
          title: data.title,
          isLoading: false,
        },
      }));
    } catch (error: unknown) {
      console.error("Failed to fetch site title:", error);
      setSiteInfos((prev) => ({
        ...prev,
        [url]: {
          url,
          title: new URL(url).hostname,
          isLoading: false,
        },
      }));
    }
  };

  // Replace the renderSite function with a simple wrapper
  const renderSite = (site: { url: string }, isPinned = false) => (
    <SiteCard
      key={site.url}
      site={site}
      isPinned={isPinned}
      onLoad={handleIframeLoad}
      onError={handleIframeError}
      loadedIframes={loadedIframes}
      fetchSiteTitle={fetchSiteTitle}
      siteInfos={siteInfos}
    />
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Filter out pinned sites from subdomains
  const pinnedUrls = new Set(pins.map((pin) => new URL(pin.url).hostname));
  const unpinnedSubdomains = subdomains.filter(
    (subdomain) => !pinnedUrls.has(subdomain)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-8xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 md:mb-3">
          Aaenz Portal
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 md:mb-12 font-medium">
          Access all subdomains of aaenz.no
        </p>

        {loading ? (
          <motion.div
            className="flex justify-center items-center min-h-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                Loading sites...
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {pins.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 md:mb-8">
                  Pinned Sites
                </h2>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8"
                >
                  {pins.map((pin) => renderSite(pin, true))}
                </motion.div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 md:mb-8">
                All Sites
              </h2>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8"
              >
                {unpinnedSubdomains.map((subdomain) =>
                  renderSite({ url: `https://${subdomain}` })
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
