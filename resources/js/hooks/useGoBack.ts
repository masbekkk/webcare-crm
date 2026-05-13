import { router } from "@inertiajs/react";

const useGoBack = () => {
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.visit("/dashboard");
    }
  };

  return goBack;
};

export default useGoBack;
