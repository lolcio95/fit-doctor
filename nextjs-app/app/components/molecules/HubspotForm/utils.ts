export const isMyScriptLoaded = (url: string) =>
  !!document.querySelector(`[src="${url}"]`);

export const waitForHubspotScript = () =>
  new Promise<void>((resolve) => {
    setInterval(() => {
      if (!(window as any).hbspt) {
        return;
      }

      resolve();
    }, 100);
  });

export const isServiceConsentedFromLocalStorage = (serviceName: string) => {
  try {
    const ucDataRaw = localStorage.getItem("ucData");
    if (!ucDataRaw) return false;
    const ucData = JSON.parse(ucDataRaw);
    const services = ucData?.consent?.services;
    if (!services) return false;
    return (
      Object.values(services) as { name: string; consent: boolean }[]
    ).some(
      (service) => service?.name === serviceName && service?.consent === true
    );
  } catch {
    return false;
  }
};
