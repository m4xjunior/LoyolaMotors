import { BarChart as TremorBarChart } from "@tremor/react";
import { cn } from "@/lib/utils";

interface BarChartProps {
  data: any[];
  categories?: string[];
  index?: string;
  valueFormatter?: (value: number) => string;
  colors?: string[];
  height?: number;
  className?: string;
}

export function BarChart({
  data,
  categories = ["count"],
  index = "name",
  valueFormatter = (number) =>
    Intl.NumberFormat("es-ES").format(number).toString(),
  colors = ["blue"],
  height = 300,
  className,
}: BarChartProps) {
  return (
    <div className={cn("w-full", className)} style={{ height: `${height}px` }}>
      <TremorBarChart
        className="h-full w-full"
        data={data}
        index={index}
        categories={categories}
        colors={colors}
        valueFormatter={valueFormatter}
        yAxisWidth={48}
        showAnimation={true}
        {...({ enableLegendSlider: true })}
      />
    </div>
  );
}