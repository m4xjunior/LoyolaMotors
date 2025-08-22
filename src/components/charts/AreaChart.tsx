import { AreaChart as TremorAreaChart } from "@tremor/react";
import { cn } from "@/lib/utils";

interface AreaChartProps {
  data: any[];
  categories?: string[];
  index?: string;
  valueFormatter?: (value: number) => string;
  colors?: string[];
  height?: number;
  className?: string;
  gradient?: boolean;
  interactive?: boolean;
}

export function AreaChart({
  data,
  categories = ["total"],
  index = "name",
  valueFormatter = (number) =>
    `€ ${Intl.NumberFormat("es-ES").format(number).toString()}`,
  colors = ["indigo", "rose"],
  height = 300,
  className,
  gradient = false,
  interactive = false,
}: AreaChartProps) {
  return (
    <div className={cn("w-full", className)} style={{ height: `${height}px` }}>
      <TremorAreaChart
        className="h-full w-full"
        data={data}
        index={index}
        categories={categories}
        colors={colors}
        valueFormatter={valueFormatter}
        yAxisWidth={48}
        showAnimation={true}
        curveType="natural"
        connectNulls={true}
        {...(gradient && {
          "data-gradient": "true",
          className: cn(
            className,
            "[&_.tremor-tooltip-arrow]:!bg-gray-800 [&_.tremor-tooltip-content]:!bg-gray-800 [&_.tremor-tooltip-content]:!border-gray-800 [&_.tremor-tooltip-content]:!text-white"
          ),
        })}
        {...(interactive && { enableLegendSlider: true })}
      />
    </div>
  );
}