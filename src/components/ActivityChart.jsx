import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

function ActivityChart({ activity }) {
  const formattedData = activity.map((item) => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="w-full h-[150px] mx-auto min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient
              id="commitGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#8b5cf6"
                stopOpacity={0.35}
              />

              <stop
                offset="100%"
                stopColor="#8b5cf6"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
          />

          <XAxis
            dataKey="displayDate"
            stroke="#64748b"
            tick={{
                fill: "#cbd5e1",
                fontSize: 12,
            }}
            axisLine={{
                stroke: "#334155",
                strokeWidth: 1,
            }}
            tickLine={false}
            interval={4}
            />

          <YAxis
            stroke="#64748b"
            tick={{
              fill: "#cbd5e1",
              fontSize: 12,
            }}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#fff",
            }}
          />

          <Area
            type="monotone"
            dataKey="commits"
            stroke="#a855f7"
            strokeWidth={2}
            fill="url(#commitGradient)"
            dot={{
              r: 3,
              fill: "#a855f7",
              stroke: "#ffffff",
              strokeWidth: 1,
            }}
            activeDot={{
              r: 5,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ActivityChart;