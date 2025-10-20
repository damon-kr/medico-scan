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
import { useToast } from "@/hooks/use-toast";

interface RankingQuestionProps {
  question: Question;
  value: { selected: string[]; ranking: { [key: string]: number } } | undefined;
  onChange: (value: { selected: string[]; ranking: { [key: string]: number } }) => void;
}

export const RankingQuestion = ({ question, value, onChange }: RankingQuestionProps) => {
  const { toast } = useToast();
  const selected = value?.selected || [];
  const ranking = value?.ranking || {};
  
  // 최대 선택 가능한 순위 개수 (validation.max 또는 선택된 항목 수 중 작은 값)
  const maxRank = Math.min(
    question.validation?.max || selected.length,
    selected.length
  );

  const handleToggle = (optionValue: string) => {
    const isCurrentlySelected = selected.includes(optionValue);
    const maxSelections = question.validation?.max || Infinity;
    
    // 최대 선택 개수 제한 체크
    if (!isCurrentlySelected && selected.length >= maxSelections) {
      toast({
        title: "최대 선택 개수 초과",
        description: `최대 ${maxSelections}개까지만 선택할 수 있습니다.`,
        variant: "destructive",
      });
      return;
    }
    
    const newSelected = isCurrentlySelected
      ? selected.filter((v) => v !== optionValue)
      : [...selected, optionValue];

    const newRanking = { ...ranking };
    
    if (isCurrentlySelected) {
      // 체크 해제: 순위 제거
      const removedRank = ranking[optionValue];
      delete newRanking[optionValue];
      
      // 해제된 순위가 마지막 순위인지 확인
      const allRanks = Object.values(ranking).sort((a, b) => a - b);
      const isLastRank = removedRank === Math.max(...allRanks);
      
      if (!isLastRank && newSelected.length > 0) {
        // 처음이나 중간 순위 해제: 모든 순위 초기화
        Object.keys(newRanking).forEach((key) => {
          delete newRanking[key];
        });
        
        toast({
          title: "순위가 초기화되었습니다",
          description: "처음/중간 순위를 해제하여 모든 순위가 초기화되었습니다. 다시 선택해주세요.",
        });
      }
      // 마지막 순위 해제: 기존 순위 유지 (아무것도 안함)
    } else {
      // 새로운 항목 체크: 비어있는 가장 앞선 순위로 자동 지정
      const usedRanks = Object.values(newRanking);
      const newMaxRank = Math.min(
        question.validation?.max || newSelected.length,
        newSelected.length
      );
      
      // 1부터 maxRank까지 중 사용되지 않은 가장 작은 순위 찾기
      let assignedRank = 1;
      for (let rank = 1; rank <= newMaxRank; rank++) {
        if (!usedRanks.includes(rank)) {
          assignedRank = rank;
          break;
        }
      }
      
      newRanking[optionValue] = assignedRank;
    }

    onChange({ selected: newSelected, ranking: newRanking });
  };

  const handleRankChange = (optionValue: string, rank: string) => {
    const rankNum = parseInt(rank);
    const newRanking = { ...ranking, [optionValue]: rankNum };
    onChange({ selected, ranking: newRanking });
  };

  // 각 옵션에 대해 사용 가능한 순위 목록 계산
  const getAvailableRanks = (currentOptionValue: string) => {
    // 다른 옵션에서 이미 사용 중인 순위들
    const usedRanks = Object.entries(ranking)
      .filter(([key]) => key !== currentOptionValue)
      .map(([, value]) => value);
    
    // 전체 순위 중 사용되지 않은 순위만 반환
    return Array.from({ length: maxRank }, (_, i) => i + 1)
      .filter(rank => !usedRanks.includes(rank));
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
                    {getAvailableRanks(option.value).map((rank) => (
                      <SelectItem key={rank} value={rank.toString()}>
                        {rank}순위
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
