"use client";

import React, { useEffect, useId, useLayoutEffect, useState } from "react";
import {
  isServiceConsentedFromLocalStorage,
  isMyScriptLoaded,
  waitForHubspotScript,
} from "./utils";
import { HUBSPOT_FORM_URL } from "./consts";

interface UCConsentEventDetail {
  HubSpot: boolean;
}

interface UCConsentEvent extends Event {
  detail: UCConsentEventDetail;
}

export interface HubspotFormProps {
  formId?: string;
}

export const HubspotForm = ({ formId }: HubspotFormProps) => {
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
  const uuid = useId();

  const [isHubspotAccepted, setIsHubspotAccepted] = useState(() =>
    isServiceConsentedFromLocalStorage("HubSpot")
  );

  useEffect(() => {
    const handleEvent = (event: UCConsentEvent) => {
      setIsHubspotAccepted(event.detail.HubSpot);
    };

    window.addEventListener("ucConsentEvent", handleEvent as EventListener);

    return () => {
      window.removeEventListener(
        "ucConsentEvent",
        handleEvent as EventListener
      );
    };
  }, []);

  useLayoutEffect(() => {
    if (!isHubspotAccepted) {
      return;
    }

    const isScriptLoaded = isMyScriptLoaded(HUBSPOT_FORM_URL);
    if (!formId || !portalId) {
      console.warn("Hubspot formId or portalId is not defined.");
      return;
    }

    if (!isScriptLoaded) {
      const script = document.createElement("script");
      script.src = HUBSPOT_FORM_URL;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    waitForHubspotScript().then(() => {
      (window as any).hbspt.forms.create({
        region: "eu1",
        portalId,
        formId,
        target: `#${uuid}`,
      });
    });
  }, [formId, portalId, uuid, isHubspotAccepted]);

  return isHubspotAccepted ? <div id={uuid} className="styled-form" /> : null;
};
