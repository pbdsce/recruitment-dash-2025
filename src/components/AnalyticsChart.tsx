"use client";

import { useEffect, useRef } from "react";
import { colors, getChartColor } from "@/lib/colors";

interface ChartData {
  _id: string;
  count: number;
}

interface AnalyticsChartProps {
  title: string;
  data: ChartData[];
  type: "bar" | "doughnut" | "line";
}

export default function AnalyticsChart({
  title,
  data,
  type,
}: AnalyticsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 40;

    if (type === "bar") {
      drawBarChart(ctx, data, width, height, padding);
    } else if (type === "doughnut") {
      drawDoughnutChart(ctx, data, width, height);
    } else if (type === "line") {
      drawLineChart(ctx, data, width, height, padding);
    }
  }, [data, type]);

  const drawBarChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    width: number,
    height: number,
    padding: number
  ) => {
    const maxValue = Math.max(...data.map((d) => d.count));
    const barWidth = (width - padding * 2) / data.length;
    const chartHeight = height - padding * 2;

    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item.count / maxValue) * chartHeight;
      const x = padding + index * barWidth;
      const y = height - padding - barHeight;

      // Bar color - Using global chart colors
      ctx.fillStyle = getChartColor(index);
      ctx.fillRect(x + 5, y, barWidth - 10, barHeight);

      // Bar value
      ctx.fillStyle = colors.text.primary;
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.count.toString(), x + barWidth / 2, y - 8);

      // Bar label
      ctx.fillStyle = colors.text.secondary;
      ctx.font = "bold 14px sans-serif";
      ctx.save();
      ctx.translate(x + barWidth / 2, height - padding + 20);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(item._id, 0, 0);
      ctx.restore();
    });

    // Draw axes
    ctx.strokeStyle = colors.text.secondary;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
  };

  const drawDoughnutChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    width: number,
    height: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    const innerRadius = radius * 0.6;

    const total = data.reduce((sum, item) => sum + item.count, 0);
    let currentAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (item.count / total) * 2 * Math.PI;

      // Draw slice
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        currentAngle,
        currentAngle + sliceAngle
      );
      ctx.arc(
        centerX,
        centerY,
        innerRadius,
        currentAngle + sliceAngle,
        currentAngle,
        true
      );
      ctx.closePath();
      // Using global chart colors
      ctx.fillStyle = getChartColor(index);
      ctx.fill();

      // Draw slice border
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX =
        centerX + (Math.cos(labelAngle) * (radius + innerRadius)) / 2;
      const labelY =
        centerY + (Math.sin(labelAngle) * (radius + innerRadius)) / 2;

      ctx.fillStyle = colors.text.primary;
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.count.toString(), labelX, labelY);

      // Draw legend
      const legendX = 20;
      const legendY = 20 + index * 20;
      ctx.fillStyle = getChartColor(index);
      ctx.fillRect(legendX, legendY - 12, 16, 16);

      ctx.fillStyle = colors.text.secondary;
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(
        item._id.substring(0, 20) + (item._id.length > 20 ? "..." : ""),
        legendX + 25,
        legendY + 2
      );

      currentAngle += sliceAngle;
    });
  };

  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    width: number,
    height: number,
    padding: number
  ) => {
    const maxValue = Math.max(...data.map((d) => d.count));
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const stepX = chartWidth / (data.length - 1);

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = getChartColor(0);
    ctx.lineWidth = 4;
    data.forEach((item, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (item.count / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = getChartColor(0);
    data.forEach((item, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (item.count / maxValue) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Draw value
      ctx.fillStyle = colors.text.primary;
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.count.toString(), x, y - 12);
    });

    // Draw axes
    ctx.strokeStyle = colors.text.secondary;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
  };

  if (!data.length) {
    return (
      <div
        className="rounded-lg shadow-sm border p-6"
        style={{
          backgroundColor: colors.background.card,
          borderColor: colors.border.default,
        }}>
        <h3
          className="text-2xl font-bold mb-6"
          style={{ color: colors.text.primary }}>
          {title}
        </h3>
        <div
          className="flex items-center justify-center h-64"
          style={{ color: colors.text.muted }}>
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="mt-2">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg shadow-sm border p-6"
      style={{
        backgroundColor: colors.background.card,
        borderColor: colors.border.default,
      }}>
      <h3
        className="text-2xl font-bold mb-6"
        style={{ color: colors.text.primary }}>
        {title}
      </h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-64"
          style={{ maxHeight: "256px" }}
        />
      </div>
    </div>
  );
}
