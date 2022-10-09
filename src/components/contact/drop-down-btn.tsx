/* eslint-disable react/no-unstable-nested-components */
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { ControlProps, StylesConfig } from 'react-select'
import Select, { components } from 'react-select'

import type { IContactInput } from '~/pages/contact'

const options = [
  { value: 'product-information', label: 'Product Information' },
  { value: 'nutrition-and-feeding-for-my-dog', label: 'Nutrition and feeding for my dog' },
  { value: 'booking-a-consultation', label: 'Booking a consultation' },
  { value: 'shipping-and-delivery', label: 'Shipping and delivery' },
  { value: 'general-enquiry', label: 'General Enquiry' }
]

interface CustomControlProps extends ControlProps {
  questionTypeValidation: 'primary-input-isValid' | 'primary-input-isInvalid' | undefined
}

const CustomControl = (props: CustomControlProps) => {
  const { children } = props

  return <components.Control {...props}>{children}</components.Control>
}

const reactSelectStyles: StylesConfig = {
  container: (provided, state) => {
    return {
      ...provided
    }
  },
  control: (provided, state) => {
    let borderStyle = ''

    const newStateType = state as CustomControlProps

    if (newStateType?.questionTypeValidation === 'primary-input-isValid') {
      borderStyle = '3px solid rgba(134, 203, 146, 1)'
    } else if (newStateType?.questionTypeValidation === 'primary-input-isInvalid') {
      borderStyle = '3px solid rgba(153, 57, 85, 1)'
    } else {
      borderStyle = '3px solid transparent'
    }

    return {
      ...provided,
      border: borderStyle,
      boxShadow: 'none',
      borderRadius: '0.5rem'
    }
  },
  menu: (provided, state) => {
    return {
      ...provided,
      border: 'none',
      boxShadow: 'none'
    }
  },
  input: (provided, state) => {
    return {
      ...provided,
      margin: 0,
      padding: 0
    }
  },
  menuList: (provided, state) => {
    return {
      ...provided,
      border: 'none',
      boxShadow: 'none'
    }
  },
  valueContainer: (provided, state) => {
    return {
      ...provided,
      paddingLeft: '1rem',
      color: 'RGB(1, 64, 50)',
      padding: '0.5rem'
    }
  },
  placeholder: (provided, state) => {
    return {
      ...provided,
      color: 'RGB(1, 64, 50)'
    }
  },
  option: (base, { isFocused }) => {
    return {
      ...base,
      paddingLeft: '1rem',
      backgroundColor: isFocused ? 'RGB(255, 247, 240)' : '#fff',
      color: 'RGB(1, 64, 50)'
    }
  }
}

interface DropdownButtonSelectProps {
  control: Control<IContactInput, object>
  questionTypeValidation: 'primary-input-isValid' | 'primary-input-isInvalid' | undefined
}

export const DropdownButtonSelect = (props: DropdownButtonSelectProps) => {
  const { control, questionTypeValidation } = props

  console.log('DropDownquestionTypeValidation', questionTypeValidation)

  return (
    <Controller
      name="questionType"
      control={control}
      rules={{ required: true }}
      render={({ field }) => {
        const { value, onChange } = field

        return (
          <Select
            instanceId="contact-select"
            options={options}
            placeholder="My question is about..."
            hideSelectedOptions={false}
            isSearchable
            styles={reactSelectStyles}
            value={value?.value}
            onChange={newValue => {
              onChange(newValue.value)
            }}
            components={{
              IndicatorSeparator: () => {
                return null
              },
              Control: ({ children, ...props }) => {
                return (
                  <CustomControl questionTypeValidation={questionTypeValidation} {...props}>
                    {children}
                  </CustomControl>
                )
              }
            }}
          />
        )
      }}
    />
  )
}
