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
        console.log('tradtradtrad', locales);
        
        const importedTrads = await Promise.all(
            locales.map((locale) => {
                console.log(locale);
                
                return Promise.all([
                    /* webpackChunkName: "[pluginId]-[request]" */ import(`./translations/${locale}.json`),
                    import(`i18n-iso-countries/langs/${locale}.json`)
                ])
                .then(([pluginTranslations, countryTranslations]) => {
                    console.log('foooooo');
                    
                    countries.registerLocale(countryTranslations.default);
console.log('#####################################', countryTranslations);


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
