import { Question, QuestionOption } from "@/types/survey";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RankingQuestionProps {
  question: Question;
  value: { selected: string[]; ranking: { [key: string]: number } } | undefined;
  onChange: (value: { selected: string[]; ranking: { [key: string]: number } }) => void;
}

export const RankingQuestion = ({ question, value, onChange }: RankingQuestionProps) => {
  const selected = value?.selected || [];
  const ranking = value?.ranking || {};

  const handleToggle = (optionValue: string) => {
    const newSelected = selected.includes(optionValue)
      ? selected.filter((v) => v !== optionValue)
      : [...selected, optionValue];

    // Remove ranking if unchecked
    const newRanking = { ...ranking };
    if (!newSelected.includes(optionValue)) {
      delete newRanking[optionValue];
    }

    onChange({ selected: newSelected, ranking: newRanking });
  };

  const handleRankChange = (optionValue: string, rank: string) => {
    const newRanking = { ...ranking, [optionValue]: parseInt(rank) };
    onChange({ selected, ranking: newRanking });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {question.options?.map((option: QuestionOption, index: number) => (
          <div key={index} className="space-y-2">
            <div
              className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-all hover:bg-accent/5"
              onClick={() => handleToggle(option.value)}
            >
              <Checkbox
                id={`${question.id}-${index}`}
                checked={selected.includes(option.value)}
                onCheckedChange={() => handleToggle(option.value)}
              />
              <Label
                htmlFor={`${question.id}-${index}`}
                className="flex-1 cursor-pointer text-base"
              >
                {option.label}
              </Label>
            </div>

            {selected.includes(option.value) && (
              <div className="ml-12 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">순위:</span>
                <Select
                  value={ranking[option.value]?.toString()}
                  onValueChange={(rank) => handleRankChange(option.value, rank)}
                >
                  <SelectTrigger className="w-32 h-10 bg-card">
                    <SelectValue placeholder="순위 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    <SelectItem value="1">1순위</SelectItem>
                    <SelectItem value="2">2순위</SelectItem>
                    <SelectItem value="3">3순위</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        사용 중인 채널을 모두 선택한 후, 가장 비중이 큰 순서대로 3개를 선택해주세요
      </p>
    </div>
  );
};
