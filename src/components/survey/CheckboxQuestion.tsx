import { Question, QuestionOption } from "@/types/survey";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxQuestionProps {
  question: Question;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

export const CheckboxQuestion = ({ question, value = [], onChange }: CheckboxQuestionProps) => {
  const handleToggle = (optionValue: string) => {
    const currentValues = value || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter((v) => v !== optionValue)
      : [...currentValues, optionValue];

    // Check max validation
    if (question.validation?.max && newValues.length > question.validation.max) {
      return;
    }

    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      {question.options?.map((option: QuestionOption, index: number) => (
        <div
          key={index}
          className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-all hover:bg-accent/5"
          onClick={() => handleToggle(option.value)}
        >
          <Checkbox
            id={`${question.id}-${index}`}
            checked={value?.includes(option.value)}
            className="pointer-events-none"
          />
          <div className="flex-1 text-base">
            {option.emoji && <span className="mr-2">{option.emoji}</span>}
            {option.label}
          </div>
        </div>
      ))}
      {question.validation?.max && (
        <p className="text-sm text-muted-foreground mt-2">
          최대 {question.validation.max}개까지 선택 가능합니다
        </p>
      )}
    </div>
  );
};
