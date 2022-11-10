import { createButton, goToMee } from './internal';

export const buttonAction = (
  partnerId: string,
  partnerName: string,
  partnerUrl: string,
  partnerImageUrl: string,
  partnerDisplayedUrl: string,
  isMobileApp: boolean,
) => {
  goToMee(partnerId, partnerName, partnerUrl, partnerImageUrl, partnerDisplayedUrl, isMobileApp);
};

export const initButton = (config: {
  partnerId: string,
  partnerName: string,
  partnerUrl: string,
  partnerImageUrl: string,
  partnerDisplayedUrl: string,
  isMobileApp: boolean,
  containerId: string,
  classNames?: { text?: string, logo?: string, button?: string }
}) => {
  createButton({
    partnerId: config.partnerId,
    partnerName: config.partnerName,
    partnerUrl: config.partnerUrl,
    partnerImageUrl: config.partnerImageUrl,
    partnerDisplayedUrl: config.partnerDisplayedUrl,
    isMobileApp: config.isMobileApp,
    containerId: config.containerId,
    classNames: config.classNames,
  });
};
