import { useEffect, useState } from "react";
import { detectAvailableBackends, detectWebNNDevice, getDeviceInfo } from "../../lib/device";

type DeviceType = "npu" | "gpu" | "cpu" | "unknown" | null;

export function NPUDetectionLab() {
  const [device] = useState(() => getDeviceInfo());
  const [backends] = useState(() => detectAvailableBackends());
  const [webnnDevice, setWebnnDevice] = useState<DeviceType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectWebNNDevice()
      .then((d) => {
        setWebnnDevice(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const webnnAvailable = backends.includes("webnn");
  const isNPU = webnnDevice === "npu";

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: isNPU ? "var(--color-primary-container)" : "var(--color-surface)",
          border: `1px solid ${isNPU ? "var(--color-primary)" : "var(--color-outline-variant)"}`,
        }}
      >
        <div
          className="text-[10px] uppercase tracking-wider font-semibold mb-2"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Live detection · this browser
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className="text-[10px] uppercase tracking-wider font-semibold"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            navigator.ml available
          </span>
          <Pill ok={webnnAvailable} label={webnnAvailable ? "Yes" : "No"} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className="text-[10px] uppercase tracking-wider font-semibold"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            WebNN routes to
          </span>
          {!webnnAvailable ? (
            <Pill ok={false} label="—" />
          ) : loading ? (
            <Pill ok={false} label="Detecting…" />
          ) : (
            <Pill ok={isNPU} label={isNPU ? "⚡ NPU" : (webnnDevice ?? "unknown").toUpperCase()} big />
          )}
        </div>

        <div className="text-xs leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
          <span className="font-semibold">Your platform:</span> {device.platform ?? "—"} · {device.hardwareConcurrency ?? "—"} cores
          {device.deviceMemoryGB ? ` · ${device.deviceMemoryGB} GB RAM` : ""}
        </div>
      </div>

      {!webnnAvailable && (
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px dashed var(--color-outline-variant)",
          }}
        >
          <h3 className="font-bold text-base mb-2" style={{ color: "var(--color-on-surface)" }}>
            Want to see NPU routing? Try one of these:
          </h3>
          <ul className="text-sm space-y-2" style={{ color: "var(--color-on-surface-variant)" }}>
            <li>
              <span className="font-semibold">Android Chrome on a Pixel</span> — Tensor G3/G4 NPU shows up via WebNN once you
              enable the WebNN flag (<code className="font-mono text-xs">chrome://flags/#web-machine-learning-neural-network</code>).
            </li>
            <li>
              <span className="font-semibold">Android Chrome on a Snapdragon device</span> — Hexagon NPU (Galaxy S24, OnePlus 12, etc.)
              with the same flag enabled.
            </li>
            <li>
              <span className="font-semibold">Windows Chrome on a Copilot+ PC</span> — Snapdragon X Elite, Intel Lunar Lake, AMD Ryzen
              AI; NPU is enabled by default in Edge, behind the flag in Chrome.
            </li>
            <li>
              <span className="font-semibold">macOS Chrome (experimental)</span> — Apple Neural Engine routing is in active
              development; results today depend on Chrome version.
            </li>
          </ul>
        </div>
      )}

      {isNPU && (
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "var(--color-primary-container)",
            border: "1px solid var(--color-primary)",
          }}
        >
          <h3 className="font-bold text-base mb-2" style={{ color: "var(--color-on-primary-container)" }}>
            ⚡ NPU detected
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-primary-container)" }}>
            Your WebNN runs are hardware-accelerated through the same path that powers Google Meet's HD video
            segmentation and Epic Games' MetaHuman facial animation — except they shipped a native app and you got
            it from a URL.
          </p>
        </div>
      )}
    </div>
  );
}

function Pill({ ok, label, big }: { ok: boolean; label: string; big?: boolean }) {
  return (
    <span
      className={`rounded-full font-bold uppercase tracking-wider ${big ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs"}`}
      style={
        ok
          ? {
              backgroundColor: "var(--color-primary)",
              color: "var(--color-on-primary)",
            }
          : {
              backgroundColor: "var(--color-surface-container-high)",
              color: "var(--color-on-surface-variant)",
              border: "1px solid var(--color-outline-variant)",
            }
      }
    >
      {label}
    </span>
  );
}
