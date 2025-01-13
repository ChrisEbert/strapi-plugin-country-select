import { prefixPluginTranslations } from './utils/prefixPluginTranslations';
import { PLUGIN_ID } from './pluginId';
import CountrySelectIcon from './components/CountrySelectIcon';
import { getTranslation } from './utils/getTrad';
import countries from 'i18n-iso-countries';

export default {
    register(app: any) {
        app.customFields.register({
            name: 'country',
            pluginId: 'country-select',
            type: 'string',
            icon: CountrySelectIcon,
            intlLabel: {
                id: getTranslation('label'),
                defaultMessage: 'Country',
            },
            intlDescription: {
                id: getTranslation('description'),
                defaultMessage: 'Select any country',
            },
            components: {
                Input: async () =>
                    import('./components/CountrySelect'),
            },
            options: {
                advanced: [
                    {
                        sectionTitle: null,
                        items: [
                            {
                                name: 'default',
                                type: 'text',
                                intlLabel: {
                                    id: 'form.attribute.settings.default',
                                    defaultMessage: 'Default value',
                                },
                                description: {
                                    id: getTranslation('default-value-description'),
                                    defaultMessage: "Has to be a an uppercase 2-letter ISO 3166-1 country code - e.g. DE",
                                },
                            },
                        ],
                    },
                    {
                        sectionTitle: {
                            id: 'global.settings',
                            defaultMessage: 'Settings',
                        },
                        items: [
                            {
                                name: 'required',
                                type: 'checkbox',
                                intlLabel: {
                                    id: 'form.attribute.item.requiredField',
                                    defaultMessage: 'Required field',
                                },
                                description: {
                                    id: 'form.attribute.item.requiredField.description',
                                    defaultMessage: "You won't be able to create an entry if this field is empty",
                                },
                            },
                        ],
                    },
                ],
            },
        });
    },

    async registerTrads({ locales }: { locales: string[] }) {
        const importedTrads = await Promise.all(
            locales.map((locale) => {
                return Promise.all([
                    /* webpackChunkName: "[pluginId]-[request]" */ import(`./translations/${locale}.json`),
                    /* import(`i18n-iso-countries/langs/${locale}.json`})
                
                        as long as vite is unable to import dynamic files from node_modules folder, 
                        we have to import a single language by default

                        https://github.com/vitejs/vite/issues/14102
                    */
                    import(`i18n-iso-countries/langs/en.json`)
                ])
                .then(([pluginTranslations, countryTranslations]) => {
                    countries.registerLocale(countryTranslations.default);

                    return {
                        data: {
                            ...prefixPluginTranslations(pluginTranslations.default),
                            [`${PLUGIN_ID}.countries`]: JSON.stringify(countries.getNames(locale)) 
                        },
                        locale,
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        data: {},
                        locale,
                    };
                });
            })
        );
        
        return Promise.resolve(importedTrads);
    },
};
