"use client";

import "nprogress/nprogress.css";

export default function LoadingWrapper() {
  // useEffect(() => {
  //   NProgress.configure({ showSpinner: false, trickleSpeed: 200 });
  //   NProgress.start();

  //   // Clean up when the component is unmounted
  //   return () => {
  //     NProgress.done();
  //   };
  // }, []);

  return (
    <div className="relative hidden h-full w-full bg-green-400">
      {/* The animated loading bar */}
      <div className="animate-move-bar absolute left-0 top-0 h-full w-1/4 bg-blue-500"></div>
    </div>
  );
}
