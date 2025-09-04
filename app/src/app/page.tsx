import { COLORS } from "@/app/lib/colors";
import WelcomeScreen from "@/app/screens/welcomescreen";

export default function Home() {
  return (
    <>
    <WelcomeScreen />
    <div style={{ padding: "20px" }}>
      <h1>Color Palette</h1>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {COLORS.map((color, index) => (
          <div
            key={index}
            style={{
              backgroundColor: color,
              width: "100px",
              height: "100px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {color}
          </div>
        ))}
      </div>
    </div>
    </>
  );
}