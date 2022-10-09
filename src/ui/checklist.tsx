interface CheckListProps {
  className?: string
  title: string
}

export const CheckList = ({ title, className = '' }: CheckListProps) => {
  return (
    <div className={`flex justify-start gap-4 ${className}`}>
      <div className="flex items-center justify-center">
        <img
          src="/assets/icons/checklist.svg"
          alt="checklist"
          className="h-5 w-5 lg:h-6 lg:w-6"
        />
      </div>
      <p className={`font-haboro-soft text-lg text-colorFifteen lg:text-list ${className}`}>
        {title}
      </p>
    </div>
  )
}
