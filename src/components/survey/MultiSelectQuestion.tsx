import { Question } from "@/types/survey";
import { RadioQuestion } from "./RadioQuestion";
import { DropdownQuestion } from "./DropdownQuestion";

interface MultiSelectQuestionProps {
  question: Question;
  value: { [key: string]: any } | undefined;
  onChange: (value: { [key: string]: any }) => void;
}

export const MultiSelectQuestion = ({ question, value = {}, onChange }: MultiSelectQuestionProps) => {
  const handleSubQuestionChange = (subQuestionId: string, subValue: any) => {
    onChange({
      ...value,
      [subQuestionId]: subValue,
    });
  };

  return (
    <div className="space-y-8">
      {question.subQuestions?.map((subQuestion, index) => (
        <div key={subQuestion.id} className="space-y-4">
          <div className="border-l-4 border-primary pl-4">
            <h3 className="text-lg font-semibold mb-1">{subQuestion.title}</h3>
            {subQuestion.description && (
              <p className="text-sm text-muted-foreground">{subQuestion.description}</p>
            )}
          </div>

          {subQuestion.type === "radio" && (
            <RadioQuestion
              question={subQuestion}
              value={value[subQuestion.id]}
              onChange={(v) => handleSubQuestionChange(subQuestion.id, v)}
            />
          )}

          {subQuestion.type === "dropdown" && (
            <DropdownQuestion
              question={subQuestion}
              value={value[subQuestion.id]}
              onChange={(v) => handleSubQuestionChange(subQuestion.id, v)}
            />
          )}
        </div>
      ))}
    </div>
  );
};
