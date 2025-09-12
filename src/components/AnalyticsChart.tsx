"use client";

import { useEffect, useRef } from "react";

interface ChartData {
  _id: string;
  count: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
  type: "bar" | "doughnut" | "line";
}

// Modern color palette for charts
const chartColors = [
  "#10B981", // emerald-500
  "#059669", // emerald-600
  "#047857", // emerald-700
  "#065F46", // emerald-800
  "#064E3B", // emerald-900
  "#34D399", // emerald-400
  "#6EE7B7", // emerald-300
  "#A7F3D0", // emerald-200
  "#D1FAE5", // emerald-100
  "#ECFDF5", // emerald-50
];

const getChartColor = (index: number): string => {
  return chartColors[index % chartColors.length];
};

export default function AnalyticsChart({
  data,
  type,
}: AnalyticsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 60;

    if (type === "bar") {
      drawModernBarChart(ctx, data, width, height, padding);
    } else if (type === "doughnut") {
      drawModernDoughnutChart(ctx, data, width, height);
    } else if (type === "line") {
      drawModernLineChart(ctx, data, width, height, padding);
    }
  }, [data, type]);

  const drawModernBarChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    width: number,
    height: number,
    padding: number
  ) => {
    const maxValue = Math.max(...data.map((d) => d.count));
    const barWidth = (width - padding * 2) / data.length;
    const chartHeight = height - padding * 2;
    const barSpacing = barWidth * 0.2;
    const actualBarWidth = barWidth - barSpacing;

    // Draw grid lines
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);

    // Draw bars with modern styling
    data.forEach((item, index) => {
      const barHeight = (item.count / maxValue) * chartHeight;
      const x = padding + index * barWidth + barSpacing / 2;
      const y = height - padding - barHeight;

      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      const color = getChartColor(index);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + "80");

      // Draw bar shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(x + 3, y + 3, actualBarWidth, barHeight);

      // Draw main bar
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, actualBarWidth, barHeight);

      // Draw bar border
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, actualBarWidth, barHeight);

      // Draw value on top
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.count.toString(), x + actualBarWidth / 2, y - 8);

      // Draw label
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "12px Inter, sans-serif";
      ctx.save();
      ctx.translate(x + actualBarWidth / 2, height - padding + 25);
      ctx.rotate(-Math.PI / 6);
      ctx.fillText(item._id.length > 8 ? item._id.substring(0, 8) + "..." : item._id, 0, 0);
      ctx.restore();
    });

    // Draw axes
    ctx.strokeStyle = "#6B7280";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("0", padding - 20, height - padding + 5);
    ctx.fillText(maxValue.toString(), padding - 20, padding + 5);
  };

  const drawModernDoughnutChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    width: number,
    height: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;
    const innerRadius = radius * 0.5;

    const total = data.reduce((sum, item) => sum + item.count, 0);
    let currentAngle = -Math.PI / 2;

    // Draw outer glow effect
    ctx.shadowColor = "rgba(16, 185, 129, 0.3)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    data.forEach((item, index) => {
      const sliceAngle = (item.count / total) * 2 * Math.PI;

      // Create gradient for slice
      const gradient = ctx.createRadialGradient(
        centerX, centerY, innerRadius,
        centerX, centerY, radius
      );
      const color = getChartColor(index);
      gradient.addColorStop(0, color + "40");
      gradient.addColorStop(1, color);

      // Draw slice
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw slice border
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw value in center of slice
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius + innerRadius) / 2;
      const labelY = centerY + Math.sin(labelAngle) * (radius + innerRadius) / 2;

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.count.toString(), labelX, labelY + 5);

      currentAngle += sliceAngle;
    });

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#1F2937";
    ctx.fill();
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw total in center
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(total.toString(), centerX, centerY - 5);
    ctx.font = "14px Inter, sans-serif";
    ctx.fillStyle = "#9CA3AF";
    ctx.fillText("Total", centerX, centerY + 15);

    // Draw modern legend
    const legendStartX = 20;
    const legendStartY = 40;
    const legendItemHeight = 25;

    data.forEach((item, index) => {
      const legendY = legendStartY + index * legendItemHeight;
      
      // Draw legend color box
      ctx.fillStyle = getChartColor(index);
      ctx.fillRect(legendStartX, legendY - 8, 16, 16);
      
      // Draw legend border
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.strokeRect(legendStartX, legendY - 8, 16, 16);

      // Draw legend text
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px Inter, sans-serif";
      ctx.textAlign = "left";
      const displayText = item._id.length > 15 ? item._id.substring(0, 15) + "..." : item._id;
      ctx.fillText(displayText, legendStartX + 25, legendY + 2);

      // Draw percentage
      const percentage = ((item.count / total) * 100).toFixed(1);
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "12px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${percentage}%`, width - 20, legendY + 2);
    });
  };

  const drawModernLineChart = (
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

    // Draw grid lines
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);

    // Create gradient for line area
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, "#10B98140");
    gradient.addColorStop(1, "#10B98110");

    // Draw area under line
    ctx.beginPath();
    data.forEach((item, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (item.count / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, height - padding);
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
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

    // Draw points with glow effect
    data.forEach((item, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (item.count / maxValue) * chartHeight;

      // Draw point glow
      ctx.shadowColor = "#10B981";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#10B981";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw main point
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Draw point border
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw value
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.count.toString(), x, y - 15);
    });

    // Draw axes
    ctx.strokeStyle = "#6B7280";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("0", padding - 20, height - padding + 5);
    ctx.fillText(maxValue.toString(), padding - 20, padding + 5);
  };

  if (!data.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Data Available</h3>
            <p className="text-gray-400 text-sm">There&apos;s no data to display at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-80 rounded-lg"
        style={{ maxHeight: "320px" }}
      />
    </div>
  );
}