import { useState, useEffect } from "react";
import { tabs, requiredTabs } from "@/data/tabs";

type Props = {
    selected: Record<string, any>;
    setSelected: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

export default function Total({ selected, setSelected }: Props) {
    const [showPopup, setShowPopup] = useState(false);

    const toplam = Object.values(selected)
        .map((p: any) => p?.fiyat_try || 0)
        .reduce((a, b) => a + b, 0);

    const allSelected = tabs.every((cat) => selected[cat]);
    const requiredSelected = requiredTabs.every((cat) => selected[cat]);

    useEffect(() => {
        if (allSelected) setShowPopup(true);
    }, [allSelected]);

    const handleReset = () => {
        if (confirm("Tüm seçimleri sıfırlamak istiyor musunuz?")) {
            setSelected({});
            localStorage.removeItem("selectedParts");
            setShowPopup(false);
        }
    };

    const handleFinish = () => {
        if (!requiredSelected) {
            alert("Lütfen * işaretli zorunlu parçaları seçmeden bitirmeyin.");
            return;
        }
        setShowPopup(true);
    };

    return (
        <>
            <div className="total-container">
                <h3>Toplam:</h3>
                <p>{toplam.toLocaleString("tr-TR")} ₺</p>
                <div className="total-buttons">
                    <button onClick={handleReset}>Sıfırla</button>
                    <button
                        onClick={handleFinish}
                        disabled={!requiredSelected}
                        style={{
                            opacity: requiredSelected ? 1 : 0.6,
                            cursor: requiredSelected ? "pointer" : "not-allowed",
                        }}
                    >
                        Bitir
                    </button>
                </div>
            </div>

            {showPopup && (
                <div className="popup-overlay" onClick={() => setShowPopup(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <h2>Seçilen Parçalar</h2>
                        <ul>
                            {Object.entries(selected).map(([cat, item]) => (
                                <li key={cat}>
                                    <strong>{cat}:</strong> {item?.ad} — {item?.fiyat_try?.toLocaleString("tr-TR")} ₺
                                </li>
                            ))}
                        </ul>
                        <p style={{ fontWeight: "bold" }}>Toplam: {toplam.toLocaleString("tr-TR")} ₺</p>
                        <button onClick={() => setShowPopup(false)}>Kapat</button>
                    </div>
                </div>
            )}
        </>
    );
}