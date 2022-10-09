/* eslint-disable react/no-unstable-nested-components */

import { useState } from 'react'

import { ChevronDownIcon } from '@heroicons/react/solid'
import type { StylesConfig } from 'react-select'
import Select from 'react-select'

import { useShopFilter } from '~/context'

// NOTE: This is fine to hardcode as it does not come from Woocommerce
// But weight and protein can come from Woocommerce
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
      boxShadow: 'none'
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

export const CategorySelect = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const { handleCategoryFilter, categoryFilter } = useShopFilter()

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsCategoryOpen(prevState => {
            return !prevState
          })
        }}
        className={`flex ${isCategoryOpen ? 'text-colorTen' : 'text-inherit'}`}
      >
        Category
        <ChevronDownIcon
          className={`h-6 w-6 duration-300 ${isCategoryOpen ? 'rotate-180' : 'rotate-0'} `}
        />
      </button>

      <Select
        instanceId="sort-select"
        options={options}
        value={categoryFilter}
        placeholder={null}
        className="w-full"
        getOptionLabel={(value: any) => {
          return (
            <div className="flex">
              {value === categoryFilter && (
                <img
                  src="/assets/icons/checklist-brown.svg"
                  alt="checklist"
                  height="16px"
                  width="16px"
                />
              )}
              <span className={`${value === categoryFilter ? 'ml-2 font-medium' : 'font-normal'}`}>
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
        menuIsOpen={isCategoryOpen}
        onChange={(newValue: any) => {
          handleCategoryFilter(newValue)
          setIsCategoryOpen(false)
        }}
        styles={reactSelectStyles}
      />
    </div>
  )
}
// import { useState } from 'react'

// import { ChevronDownIcon } from '@heroicons/react/solid'
// import type { StylesConfig } from 'react-select'
// import Select from 'react-select'

// import { useShopFilter } from '~/context'

// const options = [
//   { value: 'cooked-food', label: 'Cooked Food' },
//   { value: 'raw-food', label: 'Raw Food' },
//   { value: 'dry-food', label: 'Dry Food' },
//   { value: 'treats', label: 'Treats' }
// ]

// const reactSelectStyles: StylesConfig = {
//   control: (provided, state) => {
//     return {
//       ...provided,
//       boxShadow: 'none'
//     }
//   },
//   // menu: (provided, state) => {
//   //   return {
//   //     ...provided,
//   //     border: 'none',
//   //     boxShadow: 'none'
//   //   }
//   // },
//   option: (base, { isFocused }) => {
//     return {
//       ...base,
//       backgroundColor: isFocused ? '#fafafa' : '#fff',
//       color: isFocused ? 'rgba(65, 34, 52, 1)' : 'rgba(65, 34, 52, 0.75)',
//       fontWeight: isFocused ? 'bold' : 'normal'
//     }
//   }
// }

// export const CategorySelect = () => {
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false)
//   const { handleCategoryFilter, categoryFilter } = useShopFilter()

//   return (
//     <div>
//       <button
//         type="button"
//         onClick={() => {
//           setIsCategoryOpen(prevState => {
//             return !prevState
//           })
//         }}
//         className="flex items-center justify-center"
//       >
//         Category
//         <ChevronDownIcon
//           className={`h-6 w-6 duration-300 ${isCategoryOpen ? 'rotate-180' : 'rotate-0'} `}
//         />
//       </button>
//       <Select
//         instanceId="category-select"
//         options={options}
//         value={categoryFilter}
//         onChange={(newValue: any) => {
//           handleCategoryFilter(newValue)
//         }}
//         styles={reactSelectStyles}
//       />
//     </div>
//   )
// }
