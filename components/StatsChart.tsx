"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ChartDataPoint } from "@/lib/storage";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StatsChartProps {
  data: ChartDataPoint[];
}

export default function StatsChart({ data }: StatsChartProps) {
  const chartOptions = useMemo(() => ({
    chart: {
      type: "area" as const,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
      background: "transparent",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        dynamicAnimation: { enabled: true, speed: 350 }
      }
    },
    colors: ["#3b82f6", "#10b981"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [50, 100, 100],
      },
    },
    xaxis: {
      categories: data.map((d) => d.date),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9ca3af", fontSize: "12px" } },
      tooltip: { enabled: false }
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af", fontSize: "12px" },
        formatter: (value: number) => Math.round(value).toString(),
      },
    },
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    theme: { mode: "light" as const },
    tooltip: {
      theme: "light",
      y: { formatter: (value: number) => value.toLocaleString() }
    },
    legend: {
      position: "top" as const,
      horizontalAlign: "left" as const,
      markers: { radius: 12 }
    }
  }), [data]);

  const series = [
    { name: "Orders", data: data.map((d) => d.orders) },
    { name: "Users", data: data.map((d) => d.users) },
  ];

  return (
    <div className="w-full h-[320px]">
      <Chart options={chartOptions as any} series={series} type="area" height="100%" width="100%" />
    </div>
  );
}
