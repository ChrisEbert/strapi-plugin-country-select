import { PLUGIN_ID } from '../pluginId';

type TradOptions = Record<string, string>;

export const prefixPluginTranslations = (
    trad: TradOptions,
): TradOptions => {
    return Object.keys(trad).reduce((acc, current) => {
        acc[`${PLUGIN_ID}.${current}`] = trad[current];
        return acc;
    }, {} as TradOptions);
};