/* eslint-disable no-nested-ternary */
/* eslint-disable tailwindcss/no-custom-classname */
import { useCart } from '~/context'

interface Step {
  id: number
  name: string
  value: number
}

const steps: Step[] = [
  { id: 1, name: 'Details', value: 1 },
  { id: 2, name: 'Shipping', value: 2 },
  { id: 3, name: 'Payment', value: 3 }
]

interface StepProps {
  step: Step
  currentCheckoutStepClass: string
  isCurrentStepClasses: string
  isPreviousStepClasses: string
  isNextStepClasses: string
  isCurrentStep: boolean
  isPreviousStep: boolean
  isNextStep: boolean
}

function Step(props: StepProps) {
  const {
    step,
    currentCheckoutStepClass,
    isCurrentStepClasses,
    isPreviousStepClasses,
    isNextStepClasses,
    isCurrentStep,
    isPreviousStep,
    isNextStep
  } = props
  return (
    <div
      className={`${currentCheckoutStepClass} 
      ${
        isCurrentStep
          ? isCurrentStepClasses
          : isPreviousStep
          ? isPreviousStepClasses
          : isNextStep
          ? isNextStepClasses
          : ''
      }`}
      aria-current={isCurrentStep ? 'step' : undefined}
    >
      <span className="font-medium text-gray-900">{step.name}</span>
    </div>
  )
}

export default function Steps() {
  const { currentCheckoutStep } = useCart()
  console.log('currentCheckoutStep', currentCheckoutStep)
  return (
    <div>
      <nav
        aria-label="Progress"
        className="m-auto grid h-[40px] w-[300px] grid-cols-3 rounded-[9px] border border-colorFive/50 text-base font-bold"
      >
        {steps.map(step => {
          const isCurrentStep = currentCheckoutStep === step.value
          const isPreviousStep = currentCheckoutStep > step.value
          const isNextStep = currentCheckoutStep < step.value
          const isCurrentStepClasses = 'bg-colorTwelve/40 border border-colorTwelve'
          const isPreviousStepClasses = 'bg-colorTwelve text-red-900'
          const isNextStepClasses = 'bg-none'
          let currentCheckoutStepClass = ''

          // console.log(step.name)
          // console.log('isCurrentStep', isCurrentStep)
          // console.log('isPreviousStep', isPreviousStep)
          // console.log('isNextStep', isNextStep)
          // console.log('-------')

          if (step.value === 1) {
            currentCheckoutStepClass =
              'stepper-one flex w-[120px] items-center justify-center rounded-lg font-medium text-base'
          }
          if (step.value === 2) {
            currentCheckoutStepClass =
              'stepper-two flex w-[116px] items-center justify-center font-medium'
          }
          if (step.value === 3 || step.value === 4) {
            currentCheckoutStepClass =
              'stepper-three flex w-full items-center justify-center rounded-r-lg font-medium'
          }
          return (
            <Step
              key={step.id}
              step={step}
              currentCheckoutStepClass={currentCheckoutStepClass}
              isCurrentStepClasses={isCurrentStepClasses}
              isPreviousStepClasses={isPreviousStepClasses}
              isNextStepClasses={isNextStepClasses}
              isCurrentStep={isCurrentStep}
              isPreviousStep={isPreviousStep}
              isNextStep={isNextStep}
            />
          )
        })}
      </nav>
    </div>
  )
}
