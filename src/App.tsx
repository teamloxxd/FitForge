import { useState } from "react";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const callGemini = async (prompt: string): Promise<string> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Error generating response.";
};

const tabs = ["🏋️ Workout Split", "🥗 Diet Plan", "🔢 BMI", "🔥 Calories"];

const inputClass = "w-full bg-[#111111] border border-[#f97316]/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f97316] transition-colors";
const selectClass = "w-full bg-[#111111] border border-[#f97316]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f97316] transition-colors";
const btnClass = "w-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all active:scale-95 mt-2";

function ResultBox({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="mt-6 bg-[#111111] border border-[#f97316]/30 rounded-2xl p-5 text-gray-200 whitespace-pre-wrap leading-relaxed text-sm">
      {text}
    </div>
  );
}

function WorkoutTab() {
  const [form, setForm] = useState({ goal: "muscle gain", level: "beginner", days: "3", equipment: "gym" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult("");
    const prompt = `Create a detailed ${form.days}-day per week workout split for someone with goal: ${form.goal}, fitness level: ${form.level}, equipment: ${form.equipment}. Include exercises, sets, reps, and brief tips. Format it clearly with days as headers.`;
    const res = await callGemini(prompt);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Goal</label>
        <select className={selectClass} value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}>
          <option>muscle gain</option><option>fat loss</option><option>strength</option><option>endurance</option><option>general fitness</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Fitness Level</label>
        <select className={selectClass} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
          <option>beginner</option><option>intermediate</option><option>advanced</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Days per Week</label>
        <select className={selectClass} value={form.days} onChange={e => setForm({ ...form, days: e.target.value })}>
          {["2","3","4","5","6"].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Equipment</label>
        <select className={selectClass} value={form.equipment} onChange={e => setForm({ ...form, equipment: e.target.value })}>
          <option>gym</option><option>home (dumbbells)</option><option>no equipment</option><option>resistance bands</option>
        </select>
      </div>
      <button className={btnClass} onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate Workout Split ⚡"}
      </button>
      <ResultBox text={result} />
    </div>
  );
}

function DietTab() {
  const [form, setForm] = useState({ weight: "", height: "", goal: "fat loss", diet: "no preference", meals: "3" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult("");
    const prompt = `Create a detailed daily diet plan for someone: weight ${form.weight}kg, height ${form.height}cm, goal: ${form.goal}, dietary preference: ${form.diet}, wants ${form.meals} meals per day. Include meal names, foods, rough portions, and macros estimate. Format clearly.`;
    const res = await callGemini(prompt);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Weight (kg)</label>
          <input className={inputClass} placeholder="e.g. 75" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Height (cm)</label>
          <input className={inputClass} placeholder="e.g. 175" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Goal</label>
        <select className={selectClass} value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}>
          <option>fat loss</option><option>muscle gain</option><option>maintenance</option><option>clean bulk</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Diet Preference</label>
        <select className={selectClass} value={form.diet} onChange={e => setForm({ ...form, diet: e.target.value })}>
          <option>no preference</option><option>vegetarian</option><option>vegan</option><option>keto</option><option>high protein</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Meals per Day</label>
        <select className={selectClass} value={form.meals} onChange={e => setForm({ ...form, meals: e.target.value })}>
          {["2","3","4","5","6"].map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
      <button className={btnClass} onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate Diet Plan 🥗"}
      </button>
      <ResultBox text={result} />
    </div>
  );
}

function BMITab() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<string | null>(null);

  const calculate = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return;
    setBmi((w / (h * h)).toFixed(1));
  };

  const getCategory = (b: number) => {
    if (b < 18.5) return { label: "Underweight", color: "#60a5fa" };
    if (b < 25) return { label: "Normal", color: "#4ade80" };
    if (b < 30) return { label: "Overweight", color: "#facc15" };
    return { label: "Obese", color: "#f87171" };
  };

  const cat = bmi ? getCategory(parseFloat(bmi)) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Weight (kg)</label>
          <input className={inputClass} placeholder="e.g. 75" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Height (cm)</label>
          <input className={inputClass} placeholder="e.g. 175" value={height} onChange={e => setHeight(e.target.value)} />
        </div>
      </div>
      <button className={btnClass} onClick={calculate}>Calculate BMI</button>
      {bmi && cat && (
        <div className="mt-6 bg-[#111111] border border-[#f97316]/30 rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Your BMI</p>
          <p className="text-6xl font-black mb-3" style={{ color: cat.color }}>{bmi}</p>
          <p className="text-xl font-bold" style={{ color: cat.color }}>{cat.label}</p>
          <div className="mt-4 grid grid-cols-4 gap-1 text-xs text-gray-500">
            {[["<18.5","Underweight","#60a5fa"],["18.5–24.9","Normal","#4ade80"],["25–29.9","Overweight","#facc15"],["30+","Obese","#f87171"]].map(([range, label, color]) => (
              <div key={label} className="rounded-lg p-2" style={{ background: `${color}15` }}>
                <div style={{ color }}>{range}</div>
                <div>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CalorieTab() {
  const [form, setForm] = useState({ age: "", weight: "", height: "", gender: "male", activity: "moderate", goal: "maintenance" });
  const [result, setResult] = useState<{ tdee: number; target: number; protein: number; carbs: number; fat: number } | null>(null);

  const activityMult: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very: 1.9 };
  const goalAdj: Record<string, number> = { "fat loss": -500, "mild loss": -250, maintenance: 0, "mild gain": 250, "muscle gain": 500 };

  const calculate = () => {
    const { age, weight, height, gender, activity, goal } = form;
    if (!age || !weight || !height) return;
    const bmr = gender === "male"
      ? 10 * +weight + 6.25 * +height - 5 * +age + 5
      : 10 * +weight + 6.25 * +height - 5 * +age - 161;
    const tdee = Math.round(bmr * activityMult[activity]);
    const target = tdee + goalAdj[goal];
    setResult({ tdee, target, protein: Math.round(+weight * 2), carbs: Math.round((target * 0.4) / 4), fat: Math.round((target * 0.3) / 9) });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Age</label>
          <input className={inputClass} placeholder="25" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Weight (kg)</label>
          <input className={inputClass} placeholder="75" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Height (cm)</label>
          <input className={inputClass} placeholder="175" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Gender</label>
        <select className={selectClass} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
          <option value="male">Male</option><option value="female">Female</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Activity Level</label>
        <select className={selectClass} value={form.activity} onChange={e => setForm({ ...form, activity: e.target.value })}>
          <option value="sedentary">Sedentary (desk job, no exercise)</option>
          <option value="light">Light (1–3 days/week)</option>
          <option value="moderate">Moderate (3–5 days/week)</option>
          <option value="active">Active (6–7 days/week)</option>
          <option value="very">Very Active (athlete)</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block uppercase tracking-widest">Goal</label>
        <select className={selectClass} value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}>
          <option>fat loss</option><option>mild loss</option><option>maintenance</option><option>mild gain</option><option>muscle gain</option>
        </select>
      </div>
      <button className={btnClass} onClick={calculate}>Calculate Calories 🔥</button>
      {result && (
        <div className="mt-4 bg-[#111111] border border-[#f97316]/30 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-gray-400">Maintenance (TDEE)</span>
            <span className="text-white font-bold">{result.tdee} kcal</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-gray-400">Target Calories</span>
            <span className="text-[#f97316] font-black text-xl">{result.target} kcal</span>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-widest pt-1">Suggested Macros</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["Protein", result.protein + "g", "#f87171"], ["Carbs", result.carbs + "g", "#facc15"], ["Fat", result.fat + "g", "#4ade80"]].map(([label, val, color]) => (
              <div key={label} className="rounded-xl p-3" style={{ background: `${color}15` }}>
                <div className="font-black text-lg" style={{ color }}>{val}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FitnessApp() {
  const [activeTab, setActiveTab] = useState(0);
  const tabComponents = [<WorkoutTab />, <DietTab />, <BMITab />, <CalorieTab />];

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Bebas+Neue&display=swap" rel="stylesheet" />
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111111] to-[#000000] px-6 pt-12 pb-8">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#f97316]/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 text-center">
          <p className="text-[#f97316] text-xs uppercase tracking-[0.3em] font-bold mb-2">AI-Powered</p>
          <h1 className="text-5xl font-black mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
            FIT<span className="text-[#f97316]">FORGE</span>
          </h1>
          <p className="text-gray-400 text-sm">Your personal AI fitness companion</p>
        </div>
      </div>
      <div className="px-4 mt-2">
        <div className="flex bg-[#111111] rounded-2xl p-1 gap-1">
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === i ? "bg-[#f97316] text-white shadow-lg" : "text-gray-400 hover:text-white"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 py-6 max-w-lg mx-auto">
        {tabComponents[activeTab]}
      </div>
      <p className="text-center text-gray-600 text-xs pb-8">Results are AI-generated. Consult a professional for medical advice.</p>
    </div>
  );
}
