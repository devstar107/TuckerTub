import { useEffect, useState } from 'react'

import { ChevronDownIcon } from '@heroicons/react/solid'
import type { StylesConfig } from 'react-select'
import Select from 'react-select'

import { useShopFilter } from '~/context'

const options = [
  { value: 'cooked-food', label: 'Cooked Food' },
  { value: 'raw-food', label: 'Raw Food' },
  { value: 'dry-food', label: 'Dry Food' },
  { value: 'treats', label: 'Treats' }
]

const reactSelectStyles: StylesConfig = {
  container: (provided, state) => {
    return {
      ...provided
    }
  },
  control: (provided, state) => {
    return {
      ...provided,
      border: 'none',
      boxShadow: 'none',
      backgroundColor: 'transparent'
    }
  },
  menu: (provided, state) => {
    return {
      ...provided,
      border: 'none',
      boxShadow: 'none',
      zIndex: 20
    }
  },
  menuList: (provided, state) => {
    return {
      ...provided,
      border: 'none',
      boxShadow: 'none',
      padding: '0px'
    }
  },
  valueContainer: (provided, state) => {
    return {
      ...provided,
      padding: '0px'
    }
  },
  option: (base, { isFocused }) => {
    return {
      ...base,
      backgroundColor: isFocused ? 'RGB(255, 247, 240)' : 'RGB(255, 247, 240)',
      color: isFocused ? 'RGB(1, 64, 50)' : 'RGB(1, 64, 50)',
      fontWeight: isFocused ? '500' : '400',
      padding: '8px 0'
    }
  }
}

interface TypeSelectProps {
  handleOpenFilter(value: boolean): void
}

export const TypeSelect = (props: TypeSelectProps) => {
  const { handleOpenFilter } = props
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const { handleTypeFilter, typeFilter } = useShopFilter()

  useEffect(() => {
    handleOpenFilter(isTypeOpen)
  }, [isTypeOpen, handleOpenFilter])

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsTypeOpen(prevState => {
            return !prevState
          })
        }}
        className={`flex ${isTypeOpen ? 'text-colorTen' : 'text-inherit'}`}
      >
        Type
        <ChevronDownIcon
          className={`h-6 w-6 duration-300 ${isTypeOpen ? 'rotate-180' : 'rotate-0'} `}
        />
      </button>

      <Select
        instanceId="sort-select"
        options={options}
        value={typeFilter}
        placeholder={null}
        className="w-full"
        getOptionLabel={(value: any) => {
          return (
            <div className="flex">
              {value === typeFilter && (
                <img
                  src="/assets/icons/checklist-brown.svg"
                  alt="checklist"
                  height="16px"
                  width="16px"
                />
              )}
              <span className={`${value === typeFilter ? 'ml-2 font-medium' : 'font-normal'}`}>
                {value.label}
              </span>
            </div>
          )
        }}
        // menuPortalTarget={document.body}
        // menuPosition="fixed"
        components={{
          DropdownIndicator: () => {
            return null
          },
          IndicatorSeparator: () => {
            return null
          },
          SingleValue: () => {
            return null
          }
        }}
        hideSelectedOptions={false}
        isSearchable={false}
        menuIsOpen={isTypeOpen}
        onChange={(newValue: any) => {
          handleTypeFilter(newValue)
          setIsTypeOpen(false)
        }}
        styles={reactSelectStyles}
      />
    </div>
  )
}