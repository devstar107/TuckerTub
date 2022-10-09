import { useEffect, useState } from 'react'

import { ChevronDownIcon } from '@heroicons/react/solid'
import NextImage from 'next/future/image'
import type { StylesConfig } from 'react-select'
import Select from 'react-select'

import { useShopFilter } from '~/context'

const options = [
  { value: '250g', label: '250g' },
  { value: '500g', label: '500g' },
  { value: '1kg', label: '1kg' },
  { value: '3kg', label: '3kg' },
  { value: '5kg', label: '5kg' },
  { value: '7kg', label: '7kg' },
  { value: '15kg', label: '15kg' }
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

interface WeightSelectProps {
  handleOpenFilter(value: boolean): void
}

export const WeightSelect = (props: WeightSelectProps) => {
  const { handleOpenFilter } = props
  const [isSortOpen, setIsSortOpen] = useState(false)
  const { handleSortByFilter, sortByFilter } = useShopFilter()

  useEffect(() => {
    handleOpenFilter(isSortOpen)
  }, [isSortOpen, handleOpenFilter])

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsSortOpen(prevState => {
            return !prevState
          })
        }}
        className={`flex ${isSortOpen ? 'text-colorTen' : 'text-inherit'}`}
      >
        Weight
        <ChevronDownIcon
          className={`h-6 w-6 duration-300 ${isSortOpen ? 'rotate-180' : 'rotate-0'} `}
        />
      </button>

      <Select
        instanceId="sort-select"
        options={options}
        value={sortByFilter}
        placeholder={null}
        className="w-full"
        getOptionLabel={(value: any) => {
          return (
            <div className="flex">
              {value === sortByFilter && (
                <NextImage
                  src="/assets/icons/checklist-brown.svg"
                  alt="checklist"
                  height={16}
                  width={16}
                />
              )}
              <span className={`${value === sortByFilter ? 'ml-2 font-medium' : 'font-normal'}`}>
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
        menuIsOpen={isSortOpen}
        onChange={(newValue: any) => {
          handleSortByFilter(newValue)
          setIsSortOpen(false)
        }}
        styles={reactSelectStyles}
      />
    </div>
  )
}
