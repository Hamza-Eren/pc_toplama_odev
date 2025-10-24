export default function Sidebar({ filters, setFilters }: any) {
    const handlePriceChange = (field: "minPrice" | "maxPrice", value: string) => {
        const num = Number(value);
        setFilters({
            ...filters,
            [field]: value === "" ? "" : isNaN(num) ? "" : num,
        });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <h3 style={{ marginBottom: "5px" }}>Filtreler</h3>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "3px" }}>Marka:</label>
                <input
                    placeholder="Marka giriniz"
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    style={{
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "3px" }}>Fiyat Aralığı (₺):</label>
                <div style={{ display: "flex", gap: "8px" }}>
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                        style={{
                            width: "70px",
                            padding: "4px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                        style={{
                            width: "70px",
                            padding: "4px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}