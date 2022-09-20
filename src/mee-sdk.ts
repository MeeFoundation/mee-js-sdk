import { createButton, goToMee } from './internal';

export const buttonAction = (partnerId: string) => {
  goToMee(partnerId);
};

export const initButton = (config: {
  partnerId?: string,
  containerId: string,
  classNames?: { text?: string, logo?: string, button?: string }
}) => {
  createButton({
    partnerId: config.partnerId,
    containerId: config.containerId,
    classNames: config.classNames,
  });
};
