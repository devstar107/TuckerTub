import { useEffect, useState } from 'react'

import { ChevronDownIcon } from '@heroicons/react/solid'
import type { StylesConfig } from 'react-select'
import Select from 'react-select'

import { useShopFilter } from '~/context'

const options = [
  { value: 'chicken', label: 'Chicken' },
  { value: 'pork', label: 'Pork' },
  { value: 'kangaroo', label: 'Kangaroo' },
  { value: 'beef', label: 'Beef' },
  { value: 'duck', label: 'Duck' },
  { value: 'rabbit', label: 'Rabbit' },
  { value: 'turtle', label: 'Turtle' },
  { value: 'human', label: 'Human' }
]
/* eslint-disable react/no-unstable-nested-components */

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

interface ProteinSelectProps {
  handleOpenFilter(value: boolean): void
}

export const ProteinSelect = (props: ProteinSelectProps) => {
  const { handleOpenFilter } = props
  const [isProteinOpen, setIsProteinOpen] = useState(false)
  const { handleProteinFilter, proteinFilter } = useShopFilter()

  useEffect(() => {
    handleOpenFilter(isProteinOpen)
  }, [isProteinOpen, handleOpenFilter])

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsProteinOpen(prevState => {
            return !prevState
          })
        }}
        className={`flex ${isProteinOpen ? 'text-colorTen' : 'text-inherit'}`}
      >
        Protein
        <ChevronDownIcon
          className={`h-6 w-6 duration-300 ${isProteinOpen ? 'rotate-180' : 'rotate-0'} `}
        />
      </button>

      <Select
        instanceId="sort-select"
        options={options}
        value={proteinFilter}
        placeholder={null}
        className="w-full"
        getOptionLabel={(value: any) => {
          return (
            <div className="flex">
              {value === proteinFilter && (
                <img
                  src="/assets/icons/checklist-brown.svg"
                  alt="checklist"
                  height="16px"
                  width="16px"
                />
              )}
              <span className={`${value === proteinFilter ? 'ml-2 font-medium' : 'font-normal'}`}>
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
        menuIsOpen={isProteinOpen}
        onChange={(newValue: any) => {
          handleProteinFilter(newValue)
          setIsProteinOpen(false)
        }}
        styles={reactSelectStyles}
      />
    </div>
  )
}
