import { Question, QuestionOption } from "@/types/survey";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export const RadioQuestion = ({ question, value, onChange }: RadioQuestionProps) => {
  return (
    <RadioGroup value={value || ""} onValueChange={onChange}>
      <div className="space-y-3">
        {question.options?.map((option: QuestionOption, index: number) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-all hover:bg-accent/5"
            onClick={() => onChange(option.value)}
          >
            <RadioGroupItem value={option.value} id={`${question.id}-${index}`} className="pointer-events-none" />
            <div className="flex-1 text-base">
              {option.emoji && <span className="mr-2">{option.emoji}</span>}
              {option.label}
            </div>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
};
