import { Question, QuestionOption } from "@/types/survey";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropdownQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export const DropdownQuestion = ({ question, value, onChange }: DropdownQuestionProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-12 bg-card">
        <SelectValue placeholder="선택해주세요" />
      </SelectTrigger>
      <SelectContent className="bg-card z-50">
        {question.options?.map((option: QuestionOption, index: number) => (
          <SelectItem key={index} value={option.value} className="cursor-pointer">
            {option.emoji && <span className="mr-2">{option.emoji}</span>}
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
