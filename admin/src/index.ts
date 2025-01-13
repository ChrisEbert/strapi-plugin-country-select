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
                id: getTranslation('country-select.label'),
                defaultMessage: 'Country',
            },
            intlDescription: {
                id: getTranslation('country-select.description'),
                defaultMessage: 'Select any country',
            },
            components: {
                Input: async () =>
                    import('./components/CountrySelect'),
            },
            options: {
                advanced: [
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
                console.log(locale);
                
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
                    console.log('errrrr', err);
                    
                    return {
                        data: {},
                        locale,
                    };
                });
            })
        );
        console.log(importedTrads);
        
        return Promise.resolve(importedTrads);
    },
};
