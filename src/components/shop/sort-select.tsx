/* eslint-disable react/no-unstable-nested-components */

import { useEffect, useState } from 'react'

import { ChevronDownIcon } from '@heroicons/react/solid'
import type { StylesConfig } from 'react-select'
import Select from 'react-select'

import { useShopFilter } from '~/context'

// NOTE: This is fine to hardcode as it does not come from Woocommerce
// But weight and protein can come from Woocommerce
const options = [
  { value: 'default', label: 'Default' },
  { value: 'new', label: 'New In' },
  { value: 'a-z', label: 'A - Z' },
  { value: 'z-a', label: 'Z - A' }
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

interface SortSelectProps {
  handleOpenFilter(value: boolean): void
}

export const SortSelect = (props: SortSelectProps) => {
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
        Sort by
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
                <img
                  src="/assets/icons/checklist-brown.svg"
                  alt="checklist"
                  height="16px"
                  width="16px"
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
