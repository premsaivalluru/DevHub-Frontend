import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";


// Color palette.
// Colors are assigned based on language ranking,
// NOT based on the language name.
const LANGUAGE_COLORS = [
  "#6366F1", // indigo
  "#FACC15", // yellow
  "#06B6D4", // cyan
  "#F97316", // orange
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#14B8A6", // teal
  "#818CF8", // light indigo
  "#F43F5E", // rose
  "#64748B", // slate
];


function LanguageChart({ languages }) {

  /*
    Backend data:

    [
      {
        name: "Python",
        percentage: 50
      },
      ...
    ]

    We sort by percentage so the largest language
    always gets the first color, second largest gets
    the second color, etc.
  */

  const chartData = [...languages]
    .sort((a, b) => b.percentage - a.percentage)
    .map((language, index) => ({
      ...language,

      // If there are more languages than colors,
      // reuse the last color.
      color:
        LANGUAGE_COLORS[
          Math.min(index, LANGUAGE_COLORS.length - 1)
        ],
    }));


  // Don't render anything if backend sends no languages.
  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[150px] text-gray-400">
        No language data available
      </div>
    );
  }


  return (
    <div className="w-full min-w-0">

      <div className="flex flex-col md:flex-row items-center justify-center gap-6">

        {/* =========================
            DONUT CHART
        ========================== */}

        <div className="w-[220px] h-[220px] shrink-0">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>
            <Pie
                data={chartData}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={0}
                stroke="none"
                strokeWidth={0}
                >
                {chartData.map((language, index) => (
                    <Cell
                    key={`${language.name}-${index}`}
                    fill={language.color}
                    stroke="none"
                    strokeWidth={0}
                    />
                ))}
            </Pie>


              {/* Center text */}

              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#FFFFFF"
                fontSize="22"
                fontWeight="700"
              >
                {chartData.length}
              </text>

              <text
                x="50%"
                y="59%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#CBD5E1"
                fontSize="12"
              >
                Languages
              </text>

            </PieChart>

          </ResponsiveContainer>

        </div>


        {/* =========================
            LEGEND
        ========================== */}

        <div className="flex flex-col gap-4 min-w-[160px]">

          {chartData.map((language, index) => (

            <div
              key={`${language.name}-${index}`}
              className="flex items-center justify-between gap-8"
            >

              <div className="flex items-center gap-3">

                {/* Color indicator */}

                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: language.color,
                  }}
                />

                {/* Language name */}

                <span className="text-sm text-gray-200">
                  {language.name}
                </span>

              </div>


              {/* Percentage */}

              <span className="text-sm text-gray-300">
                {language.percentage}%
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}


export default LanguageChart;