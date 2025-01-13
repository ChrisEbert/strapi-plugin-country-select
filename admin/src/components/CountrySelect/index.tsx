import React from 'react';
import { Field, Flex, Combobox, ComboboxOption } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../utils/getTrad';

import { type InputProps, type FieldValue } from '@strapi/strapi/admin';

type CountrySelectProps = InputProps &
  FieldValue & {
    labelAction?: React.ReactNode;
};

const CountrySelect = React.forwardRef<HTMLButtonElement, CountrySelectProps>(({
    value,
    onChange,
    name,
    label,
    labelAction,
    required,
    hint,
    placeholder,
    disabled,
    error,
}, forwardedRef) => {
    const { formatMessage, messages } = useIntl();
    const countries = messages[getTranslation('countries')] as string || '{}';
    
    const parsedOptions: {[key: string]: string} = JSON.parse(countries);
    const isValidValue = !value || parsedOptions.hasOwnProperty(value);

    return (
        <Field.Root
            name={name}
            id={name}
            error={!isValidValue ? formatMessage({ id: getTranslation('country-select.unsupported-country-code') }, { countryCode: value }) : error}
            required={required}
            hint={hint}
        >
            <Flex direction="column" alignItems="stretch" gap={1}>
                <Field.Label action={labelAction}>{label}</Field.Label>

                <Combobox
                    ref={forwardedRef}
                    placeholder={placeholder} 
                    aria-label={label}
                    aria-disabled={disabled}
                    disabled={disabled}
                    value={isValidValue ? value : null}
                    onChange={(countryCode: string) => onChange(name, parsedOptions.hasOwnProperty(countryCode) ? countryCode : null)}
                    onClear={() => onChange(name, null)}
                >
                    {Object.entries(parsedOptions).sort(([, n1], [, n2]) => n1.localeCompare(n2)).map(([countryCode, countryName]) => (
                        <ComboboxOption value={countryCode} key={countryCode}>{countryName}</ComboboxOption>
                    ))}
                </Combobox>

                <Field.Hint />
                <Field.Error />
            </Flex>
        </Field.Root>
    )
})

export default CountrySelect;
