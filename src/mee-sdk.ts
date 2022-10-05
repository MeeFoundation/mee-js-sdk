import { createButton, goToMee } from './internal';

export const buttonAction = (
  partnerId: string,
  partnerName: string,
  partnerUrl: string,
  partnerImageUrl: string,
  partnerDisplayedUrl: string,
) => {
  goToMee(partnerId, partnerName, partnerUrl, partnerImageUrl, partnerDisplayedUrl);
};

export const initButton = (config: {
  partnerId: string,
  partnerName: string,
  partnerUrl: string,
  partnerImageUrl: string,
  partnerDisplayedUrl: string,
  containerId: string,
  classNames?: { text?: string, logo?: string, button?: string }
}) => {
  createButton({
    partnerId: config.partnerId,
    partnerName: config.partnerName,
    partnerUrl: config.partnerUrl,
    partnerImageUrl: config.partnerImageUrl,
    partnerDisplayedUrl: config.partnerDisplayedUrl,
    containerId: config.containerId,
    classNames: config.classNames,
  });
};
